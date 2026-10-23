# short_routes.py
from fastapi import APIRouter

from short_data import SHORTS

router = APIRouter(prefix="/shorts", tags=["shorts"])


def _valid(s):
    yt = s.get("youtube_id")
    return bool(s.get("video_url")) or bool(yt and not yt.startswith("REPLACE"))


@router.get("")
async def list_shorts():
    return [s for s in SHORTS if _valid(s)]
