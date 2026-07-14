from fastapi import FastAPI, APIRouter, HTTPException, Request
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from typing import Optional
from datetime import datetime, timezone

from seed_data import (
    CLASSES, SUBJECTS, CHAPTERS, LATEST_UPLOADS, REVIEWS,
    LEADERBOARD, PYQ_QUESTIONS, FLASHCARDS, QUIZZES, ACHIEVEMENTS,
    CURRENT_AFFAIRS, BOOKS,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(title="Edumotion XI API")
api_router = APIRouter(prefix="/api")

# In-memory visit counter (resets on restart — no persistence needed)
_visits = {}  # { "2026-07-11": {"ip1", "ip2", ...} }


# ---------- Catalog Routes ----------
@api_router.get("/catalog/classes")
async def get_classes():
    return CLASSES

@api_router.get("/catalog/subjects")
async def get_subjects(class_id: Optional[str] = None):
    if class_id:
        return [s for s in SUBJECTS if class_id in s.get("classes", [])]
    return SUBJECTS

@api_router.get("/catalog/chapters")
async def get_chapters(class_id: Optional[str] = None, subject_id: Optional[str] = None, trending: Optional[bool] = None):
    items = CHAPTERS
    if class_id:
        items = [c for c in items if c["class_id"] == class_id]
    if subject_id:
        items = [c for c in items if c["subject_id"] == subject_id]
    if trending:
        items = [c for c in items if c.get("trending")]
    return items

@api_router.get("/catalog/chapters/{chapter_id}")
async def get_chapter(chapter_id: str):
    ch = next((c for c in CHAPTERS if c["id"] == chapter_id), None)
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return {
        **ch,
        "pyqs": PYQ_QUESTIONS.get(chapter_id, []),
        "flashcards": FLASHCARDS.get(chapter_id, []),
        "quiz": QUIZZES.get(chapter_id, []),
    }

@api_router.get("/catalog/latest-uploads")
async def latest_uploads():
    chapter_ids = {c["id"] for c in CHAPTERS}
    return [u for u in LATEST_UPLOADS if u["chapter_id"] in chapter_ids]

@api_router.get("/catalog/reviews")
async def reviews():
    return REVIEWS

@api_router.get("/catalog/leaderboard")
async def leaderboard():
    return LEADERBOARD

@api_router.get("/catalog/achievements")
async def achievements():
    return ACHIEVEMENTS

@api_router.get("/search")
async def search(q: str = "", class_id: Optional[str] = None, subject_id: Optional[str] = None, type: Optional[str] = None):
    q_lower = q.lower().strip()
    results = []
    for ch in CHAPTERS:
        if class_id and ch["class_id"] != class_id:
            continue
        if subject_id and ch["subject_id"] != subject_id:
            continue
        if q_lower and q_lower not in ch["name"].lower() and q_lower not in ch.get("overview", "").lower():
            continue
        results.append({"type": "chapter", "id": ch["id"], "title": ch["name"], "subject_id": ch["subject_id"], "class_id": ch["class_id"], "difficulty": ch["difficulty"]})
    if not type or type == "upload":
        chapter_lookup = {c["id"]: c for c in CHAPTERS}
        for u in LATEST_UPLOADS:
            linked_chapter = chapter_lookup.get(u["chapter_id"])
            if not linked_chapter:
                continue  # upload points to a chapter that no longer exists — skip it
            if class_id and linked_chapter["class_id"] != class_id:
                continue
            if subject_id and linked_chapter["subject_id"] != subject_id:
                continue
            if q_lower and q_lower not in u["title"].lower():
                continue
            results.append({"type": u["type"], "id": u["id"], "title": u["title"], "chapter_id": u["chapter_id"]})
    return {"count": len(results), "results": results}


@api_router.get("/catalog/current-affairs")
async def current_affairs():
    return CURRENT_AFFAIRS

@api_router.get("/catalog/books")
async def get_books(class_id: Optional[str] = None, subject_id: Optional[str] = None):
    items = BOOKS
    if class_id:
        items = [b for b in items if b["class_id"] == class_id]
    if subject_id:
        items = [b for b in items if b["subject_id"] == subject_id]
    return items

@api_router.get("/catalog/books/{book_id}")
async def get_book(book_id: str):
    book = next((b for b in BOOKS if b["id"] == book_id), None)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# ---------- Visits (in-memory, resets on restart) ----------
@api_router.post("/visits")
async def track_visit(request: Request):
    ip = request.client.host if request.client else "unknown"
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    _visits.setdefault(day, set()).add(ip)
    return {"today": len(_visits[day])}

@api_router.get("/visits/today")
async def visits_today():
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return {"today": len(_visits.get(day, set()))}


@api_router.get("/")
async def root():
    return {"message": "Edumotion XI API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
