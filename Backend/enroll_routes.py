# enroll_routes.py
# Enrolment requests: the student fills the form and pays by QR; you verify the payment by hand.
import re
from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from live_data import BATCHES
from live_db import get_pool

router = APIRouter(prefix="/live", tags=["enrollment-requests"])


class EnrollRequest(BaseModel):
    batch_id: str
    option_id: Optional[str] = None
    student_name: str
    dob: str  # YYYY-MM-DD
    father_name: str
    mother_name: str
    phone: str
    utr: Optional[str] = None
    consent: bool = False


def _clean(text, label):
    t = re.sub(r"\s+", " ", (text or "").strip())
    if not 2 <= len(t) <= 60:
        raise HTTPException(status_code=400, detail=f"Please enter {label}.")
    return t


@router.post("/enroll-request")
async def enroll_request(body: EnrollRequest):
    batch = BATCHES.get(body.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    if not body.consent:
        raise HTTPException(status_code=400, detail="Please tick the consent box.")

    option_id = None
    options = batch.get("options", [])
    if options:
        if body.option_id not in {o["id"] for o in options}:
            raise HTTPException(status_code=400, detail="Please choose your teachers.")
        option_id = body.option_id

    name = _clean(body.student_name, "the student's name")
    father = _clean(body.father_name, "the father's name")
    mother = _clean(body.mother_name, "the mother's name")

    try:
        dob = date.fromisoformat(body.dob)
    except ValueError:
        raise HTTPException(status_code=400, detail="Please enter a valid date of birth.")
    age = (date.today() - dob).days / 365.25
    if not 4 <= age <= 30:
        raise HTTPException(status_code=400, detail="Please check the date of birth.")

    digits = re.sub(r"\D", "", body.phone or "")
    if len(digits) < 10:
        raise HTTPException(status_code=400, detail="Please enter a 10-digit phone number.")
    phone = digits[-10:]

    utr = (body.utr or "").strip()[:30] or None

    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """insert into enrollment_requests
                   (batch_id, option_id, student_name, dob, father_name, mother_name, phone, utr)
               values ($1, $2, $3, $4, $5, $6, $7, $8)
               on conflict (batch_id, phone) do nothing
               returning id""",
            body.batch_id, option_id, name, dob, father, mother, phone, utr,
        )
    return {"ok": True, "already": row is None}
