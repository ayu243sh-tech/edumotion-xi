# live_doubts_routes.py
# Post-class doubts: login required, 10 per student per day (IST), only after the class has ended.
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from firebase_verify import get_current_user
from live_data import LIVE_CLASSES
from live_db import get_pool
from live_routes import _with_status

router = APIRouter(prefix="/live", tags=["live-doubts"])

DAILY_DOUBT_LIMIT = 10

# midnight today in IST, as a timestamp
_MIDNIGHT_IST = "(date_trunc('day', now() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata')"
_COUNT_TODAY = f"select count(*) from live_doubts where user_id = $1 and created_at >= {_MIDNIGHT_IST}"


class DoubtBody(BaseModel):
    question: str


@router.get("/doubts/quota")
async def my_quota(user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        used = await conn.fetchval(_COUNT_TODAY, user["uid"])
    return {"used": used, "limit": DAILY_DOUBT_LIMIT, "remaining": max(0, DAILY_DOUBT_LIMIT - used)}


@router.get("/classes/{class_id}/doubts")
async def my_doubts(class_id: str, user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """select id, question, answer, answered_at, created_at
               from live_doubts where class_id = $1 and user_id = $2
               order by created_at desc""",
            class_id, user["uid"],
        )
    return [dict(r) for r in rows]


@router.post("/classes/{class_id}/doubts")
async def ask_doubt(class_id: str, body: DoubtBody, user=Depends(get_current_user)):
    c = LIVE_CLASSES.get(class_id)
    if not c:
        raise HTTPException(status_code=404, detail="Class not found")
    if _with_status(c)["status"] != "ended":
        raise HTTPException(status_code=403, detail="Doubts open after the class ends.")

    question = body.question.strip()
    if len(question) < 5 or len(question) > 500:
        raise HTTPException(status_code=400, detail="Question must be 5–500 characters.")

    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            # one student's requests are checked one at a time, so the limit can't be beaten by double-clicking
            await conn.execute("select pg_advisory_xact_lock(hashtext($1))", user["uid"])
            used = await conn.fetchval(_COUNT_TODAY, user["uid"])
            if used >= DAILY_DOUBT_LIMIT:
                raise HTTPException(
                    status_code=429,
                    detail=f"You've used all {DAILY_DOUBT_LIMIT} questions for today. Come back tomorrow!",
                )
            row = await conn.fetchrow(
                """insert into live_doubts (class_id, user_id, user_email, question)
                   values ($1, $2, $3, $4) returning id""",
                class_id, user["uid"], user["email"], question,
            )
    return {"id": row["id"], "remaining": DAILY_DOUBT_LIMIT - used - 1}
