# video_routes.py
from fastapi import APIRouter

from video_data import VIDEO_LECTURES

router = APIRouter(prefix="/videos", tags=["videos"])

LANGS = ("hindi", "english")


def _clean(parts):
    return [p for p in parts if p.get("youtube_id") and not p["youtube_id"].startswith("REPLACE")]


@router.get("/available")
async def available():
    """Which chapters have lectures, and in which languages."""
    out = {}
    for chapter_id, langs in VIDEO_LECTURES.items():
        have = [l for l in LANGS if _clean(langs.get(l, []))]
        if have:
            out[chapter_id] = have
    return out


@router.get("/{chapter_id}")
async def get_lectures(chapter_id: str):
    langs = VIDEO_LECTURES.get(chapter_id, {})
    return {l: _clean(langs.get(l, [])) for l in LANGS}
