# portal_routes.py
# The student portal (enrolled students only) and the admin tools.
import json
import re
import secrets
import time
from datetime import date, datetime
from typing import List, Optional
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from firebase_verify import get_current_user
from live_data import BATCHES
from live_db import get_pool
from live_routes import _with_status, all_classes
from portal_auth import is_admin_uid, optional_user, require_admin
from portal_tests import TESTS

router = APIRouter(prefix="/portal", tags=["portal"])
IST = ZoneInfo("Asia/Kolkata")
CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I, so codes are easy to read out
KINDS = {"ppt", "notes", "homework", "other"}
STATUS_FOR = {"paid": "paid", "reject": "rejected", "pending": "pending", "revoke": "revoked"}
_attempts = {}


# ---------- helpers ----------
def _new_code():
    return "".join(secrets.choice(CODE_CHARS) for _ in range(8))


def _rate_limit(uid, limit=10, window=3600):
    now = time.time()
    hits = [t for t in _attempts.get(uid, []) if now - t < window]
    if len(hits) >= limit:
        raise HTTPException(429, "Too many attempts. Please try again in an hour.")
    hits.append(now)
    _attempts[uid] = hits


def _opt_ok(item_option, m):
    return m["admin"] or not item_option or item_option == m["option_id"]


async def _member(conn, user, batch_id):
    if batch_id not in BATCHES:
        raise HTTPException(404, "Batch not found")
    if is_admin_uid(user["uid"]):
        return {"admin": True, "option_id": None, "name": "Admin"}
    row = await conn.fetchrow(
        "select option_id, student_name from enrollment_requests where user_id=$1 and batch_id=$2 and status='accepted'",
        user["uid"], batch_id,
    )
    if not row:
        raise HTTPException(403, "You're not enrolled in this batch.")
    return {"admin": False, "option_id": row["option_id"], "name": row["student_name"]}


def _ordered(items):
    now_up = sorted([c for c in items if c["status"] != "ended"], key=lambda c: c["start"])
    ended = sorted([c for c in items if c["status"] == "ended"], key=lambda c: c["start"], reverse=True)
    return now_up + ended


def _check_scope(batch_id, option_id):
    b = BATCHES.get(batch_id)
    if not b:
        raise HTTPException(400, "Choose a batch.")
    if option_id and option_id not in {o["id"] for o in b.get("options", [])}:
        raise HTTPException(400, "That teacher option doesn't exist for this batch.")
    return b


def _yt_id(text):
    t = (text or "").strip()
    if not t:
        return None
    m = re.search(r"(?:v=|youtu\.be/|shorts/|live/|embed/)([A-Za-z0-9_-]{11})", t)
    if m:
        return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", t):
        return t
    raise HTTPException(400, "That doesn't look like a YouTube link or video ID.")


# ---------- student: account and access ----------
@router.get("/whoami")
async def whoami(user=Depends(get_current_user)):
    return {"uid": user["uid"], "email": user["email"], "is_admin": is_admin_uid(user["uid"])}


class ActivateBody(BaseModel):
    code: str


@router.post("/activate")
async def activate(body: ActivateBody, user=Depends(get_current_user)):
    _rate_limit(user["uid"])
    code = re.sub(r"[^A-Za-z0-9]", "", body.code or "").upper()
    if len(code) != 8:
        raise HTTPException(400, "Enter the 8-character code you were given.")
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                "select id, batch_id, status, user_id from enrollment_requests where activation_code=$1 for update", code)
            if not row or row["status"] != "accepted":
                raise HTTPException(404, "That code isn't valid. Check it and try again.")
            if row["user_id"] and row["user_id"] != user["uid"]:
                raise HTTPException(409, "This code has already been used.")
            await conn.execute(
                "update enrollment_requests set user_id=$2, activated_at=coalesce(activated_at, now()) where id=$1",
                row["id"], user["uid"])
    return {"ok": True, "batch_id": row["batch_id"]}


@router.get("/me")
async def me(user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "select batch_id, option_id, student_name from enrollment_requests where user_id=$1 and status='accepted' order by accepted_at",
            user["uid"])
    out = []
    for r in rows:
        b = BATCHES.get(r["batch_id"])
        if not b:
            continue
        opt = next((o for o in b.get("options", []) if o["id"] == r["option_id"]), None)
        out.append({"batch_id": b["id"], "batch_name": b["name"], "class_level": b["class_level"],
                    "option_label": opt["label"] if opt else None, "student_name": r["student_name"],
                    "subjects": b["subjects"]})
    return {"memberships": out, "is_admin": is_admin_uid(user["uid"])}


# ---------- student: batch pages ----------
@router.get("/batch/{batch_id}/overview")
async def overview(batch_id: str, user=Depends(get_current_user)):
    classes = await all_classes()
    pool = await get_pool()
    async with pool.acquire() as conn:
        m = await _member(conn, user, batch_id)
        ann = await conn.fetch(
            "select id, option_id, title, body, pinned, created_at from portal_announcements where batch_id=$1 order by pinned desc, created_at desc limit 20",
            batch_id)
        att = {r["class_id"] for r in await conn.fetch("select class_id from class_attendance where user_id=$1", user["uid"])}
        hw = await conn.fetch(
            """select r.option_id, (h.user_id is not null) as done from portal_resources r
               left join homework_status h on h.resource_id=r.id and h.user_id=$2
               where r.batch_id=$1 and r.published and r.kind='homework'""", batch_id, user["uid"])
        tested = {r["test_id"] for r in await conn.fetch("select distinct test_id from test_attempts where user_id=$1", user["uid"])}
    b = BATCHES[batch_id]
    mine = [_with_status(c) for c in classes.values() if c["batch_id"] == batch_id and _opt_ok(c.get("option_id"), m)]
    held = [c for c in mine if c["status"] != "upcoming"]
    nxt = next((c for c in _ordered(mine) if c["status"] != "ended"), None)
    my_tests = [t for t in TESTS.values() if batch_id in t["batches"] and _opt_ok(t.get("option_id"), m)]
    opt = next((o for o in b.get("options", []) if o["id"] == m["option_id"]), None)
    return {
        "batch": {"id": b["id"], "name": b["name"], "class_level": b["class_level"], "subjects": b["subjects"], "schedule": b["schedule"]},
        "option": opt,
        "student_name": m["name"],
        "announcements": [dict(a) for a in ann if _opt_ok(a["option_id"], m)],
        "next_class": nxt,
        "stats": {
            "held": len(held),
            "attended": sum(1 for c in held if c["id"] in att),
            "pending_homework": sum(1 for r in hw if _opt_ok(r["option_id"], m) and not r["done"]),
            "tests_total": len(my_tests),
            "tests_done": sum(1 for t in my_tests if t["id"] in tested),
        },
    }


@router.get("/batch/{batch_id}/classes")
async def my_classes(batch_id: str, user=Depends(get_current_user)):
    classes = await all_classes()
    pool = await get_pool()
    async with pool.acquire() as conn:
        m = await _member(conn, user, batch_id)
        att = {r["class_id"] for r in await conn.fetch("select class_id from class_attendance where user_id=$1", user["uid"])}
    items = [_with_status(c) for c in classes.values() if c["batch_id"] == batch_id and _opt_ok(c.get("option_id"), m)]
    for i in items:
        i["attended"] = i["id"] in att
    return _ordered(items)


@router.get("/batch/{batch_id}/resources")
async def my_resources(batch_id: str, user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        m = await _member(conn, user, batch_id)
        rows = await conn.fetch(
            """select id, option_id, subject, kind, title, description, url, chapter, created_at
               from portal_resources where batch_id=$1 and published and kind <> 'homework' order by created_at desc""",
            batch_id)
    return [dict(r) for r in rows if _opt_ok(r["option_id"], m)]


@router.get("/batch/{batch_id}/homework")
async def my_homework(batch_id: str, user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        m = await _member(conn, user, batch_id)
        rows = await conn.fetch(
            """select r.id, r.option_id, r.subject, r.title, r.description, r.url, r.chapter, r.due_date, r.created_at,
                      h.done_at, h.note
               from portal_resources r
               left join homework_status h on h.resource_id=r.id and h.user_id=$2
               where r.batch_id=$1 and r.published and r.kind='homework'
               order by r.due_date nulls last, r.created_at desc""", batch_id, user["uid"])
    return [{**dict(r), "done": r["done_at"] is not None} for r in rows if _opt_ok(r["option_id"], m)]


class HomeworkBody(BaseModel):
    done: bool = True
    note: Optional[str] = None


@router.post("/homework/{resource_id}/done")
async def homework_done(resource_id: int, body: HomeworkBody, user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("select batch_id, option_id, kind from portal_resources where id=$1 and published", resource_id)
        if not row or row["kind"] != "homework":
            raise HTTPException(404, "Homework not found")
        m = await _member(conn, user, row["batch_id"])
        if not _opt_ok(row["option_id"], m):
            raise HTTPException(403, "This homework is for the other teacher group.")
        if body.done:
            note = (body.note or "").strip()[:300] or None
            await conn.execute(
                """insert into homework_status (resource_id, user_id, note) values ($1, $2, $3)
                   on conflict (resource_id, user_id) do update set note=excluded.note, done_at=now()""",
                resource_id, user["uid"], note)
        else:
            await conn.execute("delete from homework_status where resource_id=$1 and user_id=$2", resource_id, user["uid"])
    return {"ok": True}


# ---------- student: tests ----------
async def _test_access(conn, user, t):
    if is_admin_uid(user["uid"]):
        return
    rows = await conn.fetch("select batch_id, option_id from enrollment_requests where user_id=$1 and status='accepted'", user["uid"])
    for r in rows:
        if r["batch_id"] in t["batches"] and (not t.get("option_id") or t["option_id"] == r["option_id"]):
            return
    raise HTTPException(403, "This test is for enrolled students.")


@router.get("/batch/{batch_id}/tests")
async def my_tests(batch_id: str, user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        m = await _member(conn, user, batch_id)
        rows = await conn.fetch(
            "select test_id, max(score) as best, count(*) as n from test_attempts where user_id=$1 group by test_id", user["uid"])
    stats = {r["test_id"]: r for r in rows}
    out = []
    for t in TESTS.values():
        if batch_id in t["batches"] and _opt_ok(t.get("option_id"), m):
            s = stats.get(t["id"])
            out.append({"id": t["id"], "title": t["title"], "subject": t["subject"], "duration_min": t["duration_min"],
                        "questions": len(t["questions"]), "best": s["best"] if s else None, "attempts": s["n"] if s else 0})
    return out


@router.get("/tests/{test_id}")
async def get_test(test_id: str, user=Depends(get_current_user)):
    t = TESTS.get(test_id)
    if not t:
        raise HTTPException(404, "Test not found")
    pool = await get_pool()
    async with pool.acquire() as conn:
        await _test_access(conn, user, t)
    return {"id": t["id"], "title": t["title"], "subject": t["subject"], "duration_min": t["duration_min"],
            "questions": [{"q": q["q"], "options": q["options"]} for q in t["questions"]]}


class SubmitBody(BaseModel):
    answers: List[Optional[int]]


@router.post("/tests/{test_id}/submit")
async def submit_test(test_id: str, body: SubmitBody, user=Depends(get_current_user)):
    t = TESTS.get(test_id)
    if not t:
        raise HTTPException(404, "Test not found")
    qs = t["questions"]
    answers = (list(body.answers) + [None] * len(qs))[: len(qs)]
    review, score = [], 0
    for q, a in zip(qs, answers):
        ok = a == q["answer"]
        score += int(ok)
        review.append({"correct": q["answer"], "chosen": a, "ok": ok, "explain": q.get("explain", "")})
    pool = await get_pool()
    async with pool.acquire() as conn:
        await _test_access(conn, user, t)
        await conn.execute(
            "insert into test_attempts (test_id, user_id, score, total, answers) values ($1, $2, $3, $4, $5::jsonb)",
            test_id, user["uid"], score, len(qs), json.dumps(answers))
    return {"score": score, "total": len(qs), "review": review}


# ---------- student: watching a class ----------
@router.get("/classes/{class_id}/stream")
async def class_stream(class_id: str, user=Depends(optional_user)):
    c = (await all_classes()).get(class_id)
    if not c:
        raise HTTPException(404, "Class not found")
    pub = _with_status(c)
    allowed, member = bool(c.get("free")), False
    if not allowed:
        if not user:
            raise HTTPException(401, "Please log in to watch this class.")
        if is_admin_uid(user["uid"]):
            allowed = True
        else:
            pool = await get_pool()
            async with pool.acquire() as conn:
                row = await conn.fetchrow(
                    "select option_id from enrollment_requests where user_id=$1 and batch_id=$2 and status='accepted'",
                    user["uid"], c["batch_id"])
            if not row:
                raise HTTPException(403, "This class is for enrolled students of this batch.")
            if c.get("option_id") and c["option_id"] != row["option_id"]:
                raise HTTPException(403, "This class is for the other teacher group in your batch.")
            allowed, member = True, True
    if member and pub["status"] == "live":
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                "insert into class_attendance (class_id, user_id) values ($1, $2) on conflict do nothing", class_id, user["uid"])
    show = pub["has_video"] and pub["status"] != "upcoming"
    return {"youtube_id": c.get("youtube_id") if show else None, "status": pub["status"]}


# ---------- admin ----------
class ActionBody(BaseModel):
    action: str
    note: Optional[str] = None


@router.get("/admin/enrollments")
async def admin_enrollments(admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """select id, batch_id, option_id, student_name, dob, father_name, mother_name, phone, utr, status, note,
                      activation_code, (user_id is not null) as activated, accepted_at, created_at
               from enrollment_requests order by created_at desc limit 500""")
    out = []
    for r in rows:
        b = BATCHES.get(r["batch_id"], {})
        opt = next((o for o in b.get("options", []) if o["id"] == r["option_id"]), None)
        out.append({**dict(r), "batch_name": b.get("name", r["batch_id"]), "option_label": opt["label"] if opt else None})
    return out


@router.post("/admin/enrollments/{req_id}")
async def admin_enrollment_action(req_id: int, body: ActionBody, admin=Depends(require_admin)):
    ret = "returning id, status, activation_code"
    pool = await get_pool()
    async with pool.acquire() as conn:
        if body.action == "accept":
            row = await conn.fetchrow(
                f"update enrollment_requests set status='accepted', accepted_at=coalesce(accepted_at, now()), activation_code=coalesce(activation_code, $2) where id=$1 {ret}",
                req_id, _new_code())
        elif body.action in STATUS_FOR:
            row = await conn.fetchrow(f"update enrollment_requests set status=$2 where id=$1 {ret}", req_id, STATUS_FOR[body.action])
        elif body.action == "reset":
            row = await conn.fetchrow(f"update enrollment_requests set user_id=null, activated_at=null where id=$1 {ret}", req_id)
        elif body.action == "note":
            row = await conn.fetchrow(f"update enrollment_requests set note=$2 where id=$1 {ret}", req_id, (body.note or "").strip()[:300] or None)
        else:
            raise HTTPException(400, "Unknown action")
    if not row:
        raise HTTPException(404, "Request not found")
    return dict(row)


class ResourceBody(BaseModel):
    batch_id: str
    option_id: Optional[str] = None
    subject: str
    kind: str
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    chapter: Optional[str] = None
    due_date: Optional[str] = None
    published: bool = True


@router.get("/admin/resources")
async def admin_resources(admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """select r.*, (select count(*) from homework_status h where h.resource_id=r.id) as done_count
               from portal_resources r order by r.created_at desc limit 300""")
    return [dict(r) for r in rows]


@router.post("/admin/resources")
async def admin_add_resource(body: ResourceBody, admin=Depends(require_admin)):
    option_id = body.option_id or None
    _check_scope(body.batch_id, option_id)
    if body.kind not in KINDS:
        raise HTTPException(400, "Choose a type.")
    title = (body.title or "").strip()
    if not 2 <= len(title) <= 120:
        raise HTTPException(400, "Please enter a title.")
    url = (body.url or "").strip() or None
    if url and not re.match(r"^https?://", url):
        raise HTTPException(400, "The link must start with http:// or https://")
    due = None
    if body.due_date:
        try:
            due = date.fromisoformat(body.due_date)
        except ValueError:
            raise HTTPException(400, "Invalid due date.")
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """insert into portal_resources (batch_id, option_id, subject, kind, title, description, url, chapter, due_date, published)
               values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)""",
            body.batch_id, option_id, body.subject.strip(), body.kind, title,
            (body.description or "").strip()[:500] or None, url, (body.chapter or "").strip()[:80] or None, due, body.published)
    return {"ok": True}


@router.delete("/admin/resources/{rid}")
async def admin_delete_resource(rid: int, admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("delete from portal_resources where id=$1", rid)
    return {"ok": True}


class AnnouncementBody(BaseModel):
    batch_id: str
    option_id: Optional[str] = None
    title: str
    body: Optional[str] = None
    pinned: bool = False


@router.get("/admin/announcements")
async def admin_announcements(admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("select * from portal_announcements order by created_at desc limit 100")
    return [dict(r) for r in rows]


@router.post("/admin/announcements")
async def admin_add_announcement(body: AnnouncementBody, admin=Depends(require_admin)):
    option_id = body.option_id or None
    _check_scope(body.batch_id, option_id)
    title = (body.title or "").strip()
    if not 2 <= len(title) <= 120:
        raise HTTPException(400, "Please enter a title.")
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "insert into portal_announcements (batch_id, option_id, title, body, pinned) values ($1, $2, $3, $4, $5)",
            body.batch_id, option_id, title, (body.body or "").strip()[:1000] or None, body.pinned)
    return {"ok": True}


@router.delete("/admin/announcements/{aid}")
async def admin_delete_announcement(aid: int, admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("delete from portal_announcements where id=$1", aid)
    return {"ok": True}


class ClassBody(BaseModel):
    id: Optional[str] = None
    batch_id: str
    option_id: Optional[str] = None
    subject: str
    title: str
    start: str  # "YYYY-MM-DDTHH:MM", in IST
    duration_min: int = 60
    youtube: Optional[str] = None
    free: bool = False


@router.get("/admin/classes")
async def admin_classes(admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """select c.*, (select count(*) from class_attendance a where a.class_id=c.id) as attended
               from portal_classes c order by c.start_at desc limit 200""")
    return [{**dict(r), "start": r["start_at"].astimezone(IST).isoformat()} for r in rows]


@router.post("/admin/classes")
async def admin_save_class(body: ClassBody, admin=Depends(require_admin)):
    option_id = body.option_id or None
    _check_scope(body.batch_id, option_id)
    title = (body.title or "").strip()
    if not 2 <= len(title) <= 120:
        raise HTTPException(400, "Please enter a title.")
    try:
        start = datetime.fromisoformat(body.start)
    except ValueError:
        raise HTTPException(400, "Please choose the class date and time.")
    if start.tzinfo is None:
        start = start.replace(tzinfo=IST)
    duration = min(max(body.duration_min, 10), 360)
    cid = body.id or f"c-{secrets.token_hex(4)}"
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """insert into portal_classes (id, batch_id, option_id, subject, title, start_at, duration_min, youtube_id, free)
               values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               on conflict (id) do update set batch_id=excluded.batch_id, option_id=excluded.option_id, subject=excluded.subject,
                 title=excluded.title, start_at=excluded.start_at, duration_min=excluded.duration_min,
                 youtube_id=excluded.youtube_id, free=excluded.free""",
            cid, body.batch_id, option_id, body.subject.strip(), title, start, duration, _yt_id(body.youtube), body.free)
    return {"ok": True, "id": cid}


@router.delete("/admin/classes/{cid}")
async def admin_delete_class(cid: str, admin=Depends(require_admin)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("delete from portal_classes where id=$1", cid)
    return {"ok": True}
