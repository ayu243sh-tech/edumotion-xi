# live_routes.py
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException

from live_data import BATCHES, LIVE_CLASSES

router = APIRouter(prefix="/live", tags=["live"])


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
    return {**c, "status": status, "end": end.isoformat()}


def _sorted(classes):
    order = {"live": 0, "upcoming": 1, "ended": 2}
    return sorted(
        classes,
        key=lambda c: (
            order[c["status"]],
            c["start"] if c["status"] != "ended" else "",
        ),
    )


@router.get("/classes")
async def list_classes(
    batch_id: Optional[str] = None,
    class_level: Optional[str] = None,
    status: Optional[str] = None,
):
    items = [_with_status(c) for c in LIVE_CLASSES.values()]
    if batch_id:
        items = [c for c in items if c["batch_id"] == batch_id]
    if class_level:
        items = [c for c in items if c["class_level"] == class_level]
    if status:
        items = [c for c in items if c["status"] == status]
    items = _sorted(items)
    # recordings: most recent first
    if status == "ended":
        items.sort(key=lambda c: c["start"], reverse=True)
    return items


@router.get("/classes/{class_id}")
async def get_class(class_id: str):
    c = LIVE_CLASSES.get(class_id)
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
    classes = _sorted(
        [_with_status(c) for c in LIVE_CLASSES.values() if c["batch_id"] == batch_id]
    )
    return {**b, "classes": classes}
