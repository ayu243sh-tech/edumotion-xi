# batch_routes.py
# Teacher-option enrolment: choose, and later switch, teachers inside a batch.
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from firebase_verify import get_current_user
from live_data import BATCHES
from live_db import get_pool

router = APIRouter(prefix="/live", tags=["batch-enrollment"])

# How many times a student may change teachers in one batch. Use None for unlimited.
MAX_SWITCHES = 3


class EnrollBody(BaseModel):
    option_id: str


@router.get("/enrollments/me")
async def my_enrollments(user=Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """select batch_id, option_id, switch_count, enrolled_at, updated_at
               from batch_enrollments where user_id = $1""",
            user["uid"],
        )
    return {"max_switches": MAX_SWITCHES, "enrollments": [dict(r) for r in rows]}


@router.post("/batches/{batch_id}/enroll")
async def enroll(batch_id: str, body: EnrollBody, user=Depends(get_current_user)):
    batch = BATCHES.get(batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    option_ids = {o["id"] for o in batch.get("options", [])}
    if not option_ids:
        raise HTTPException(status_code=400, detail="This batch has no teacher options to choose from.")
    if body.option_id not in option_ids:
        raise HTTPException(status_code=400, detail="That option doesn't exist for this batch.")

    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            # one student's requests run one at a time, so double clicks can't break the limit
            await conn.execute("select pg_advisory_xact_lock(hashtext($1))", user["uid"])
            existing = await conn.fetchrow(
                "select option_id, switch_count from batch_enrollments where user_id = $1 and batch_id = $2",
                user["uid"], batch_id,
            )

            if existing and existing["option_id"] == body.option_id:
                return {
                    "option_id": existing["option_id"],
                    "switch_count": existing["switch_count"],
                    "changed": False,
                    "max_switches": MAX_SWITCHES,
                }

            if existing and MAX_SWITCHES is not None and existing["switch_count"] >= MAX_SWITCHES:
                raise HTTPException(
                    status_code=403,
                    detail=f"You've used all {MAX_SWITCHES} teacher changes for this batch. Please contact us if you need help.",
                )

            if existing:
                row = await conn.fetchrow(
                    """update batch_enrollments
                       set previous_option_id = option_id, option_id = $3,
                           switch_count = switch_count + 1, updated_at = now()
                       where user_id = $1 and batch_id = $2
                       returning option_id, switch_count""",
                    user["uid"], batch_id, body.option_id,
                )
            else:
                row = await conn.fetchrow(
                    """insert into batch_enrollments (user_id, user_email, batch_id, option_id)
                       values ($1, $2, $3, $4)
                       returning option_id, switch_count""",
                    user["uid"], user["email"], batch_id, body.option_id,
                )

    return {**dict(row), "changed": True, "max_switches": MAX_SWITCHES}
