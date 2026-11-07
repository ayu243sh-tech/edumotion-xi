# live_routes.py
from datetime import datetime, timedelta, timezone
from typing import Optional
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException

from live_data import BATCHES, LIVE_CLASSES
from live_db import get_pool

router = APIRouter(prefix="/live", tags=["live"])
IST = ZoneInfo("Asia/Kolkata")


async def all_classes():
    """Classes from live_data.py plus the ones scheduled from the admin page."""
    out = dict(LIVE_CLASSES)
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            rows = await conn.fetch("select * from portal_classes")
        for r in rows:
            out[r["id"]] = {
                "id": r["id"], "batch_id": r["batch_id"], "option_id": r["option_id"],
                "class_level": BATCHES.get(r["batch_id"], {}).get("class_level", ""),
                "subject": r["subject"], "title": r["title"],
                "start": r["start_at"].astimezone(IST).isoformat(),
                "duration_min": r["duration_min"],
                "youtube_id": r["youtube_id"] or "", "free": r["free"],
            }
    except Exception:
        pass  # the static classes still work if the database is unavailable
    return out


def _with_status(c):
    start = datetime.fromisoformat(c["start"])
    end = start + timedelta(minutes=c["duration_min"])
    now = datetime.now(timezone.utc)
    if now < start:
        status = "upcoming"
    elif now <= end:
        status = "live"
    else:
        status = "ended"
    yt = c.get("youtube_id") or ""
    public = {k: v for k, v in c.items() if k != "youtube_id"}
    return {**public, "status": status, "end": end.isoformat(),
            "free": bool(c.get("free")), "has_video": bool(yt) and not yt.startswith("REPLACE")}


def _sorted(classes):
    order = {"live": 0, "upcoming": 1, "ended": 2}
    return sorted(classes, key=lambda c: (order[c["status"]], c["start"] if c["status"] != "ended" else ""))


@router.get("/classes")
async def list_classes(batch_id: Optional[str] = None, class_level: Optional[str] = None, status: Optional[str] = None):
    items = [_with_status(c) for c in (await all_classes()).values()]
    if batch_id:
        items = [c for c in items if c["batch_id"] == batch_id]
    if class_level:
        items = [c for c in items if c["class_level"] == class_level]
    if status:
        items = [c for c in items if c["status"] == status]
    items = _sorted(items)
    if status == "ended":
        items.sort(key=lambda c: c["start"], reverse=True)
    return items


@router.get("/classes/{class_id}")
async def get_class(class_id: str):
    c = (await all_classes()).get(class_id)
    if not c:
        raise HTTPException(status_code=404, detail="Class not found")
    return _with_status(c)


@router.get("/batches")
async def list_batches(class_level: Optional[str] = None):
    items = list(BATCHES.values())
    if class_level:
        items = [b for b in items if b["class_level"] == class_level]
    return items


@router.get("/batches/{batch_id}")
async def get_batch(batch_id: str):
    b = BATCHES.get(batch_id)
    if not b:
        raise HTTPException(status_code=404, detail="Batch not found")
    classes = _sorted([_with_status(c) for c in (await all_classes()).values() if c["batch_id"] == batch_id])
    return {**b, "classes": classes}
