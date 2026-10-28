# notes_routes.py
from fastapi import APIRouter, HTTPException

from notes_data import NOTES
from resources_data import RESOURCE_CHAPTERS

router = APIRouter(prefix="/notes", tags=["notes"])


def _usable(b):
    t = b.get("type")
    if t in ("audio", "image"):
        return bool(b.get("url")) and not b["url"].startswith("REPLACE")
    if t == "video":
        yt = b.get("youtube_id", "")
        return bool(yt) and not yt.startswith("REPLACE")
    return True


def _clean(note):
    return {**note, "blocks": [b for b in note["blocks"] if _usable(b)]}


@router.get("/available")
async def available():
    return {cid: {"title": n["title"], "blocks": len(_clean(n)["blocks"])} for cid, n in NOTES.items()}


@router.get("/{chapter_id}")
async def get_notes(chapter_id: str):
    note = NOTES.get(chapter_id)
    if not note:
        raise HTTPException(status_code=404, detail="Notes not found")
    return {"chapter": RESOURCE_CHAPTERS.get(chapter_id, {}), **_clean(note)}
