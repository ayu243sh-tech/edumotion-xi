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
    return LATEST_UPLOADS

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
    // src/components/CurrentAffairsFAB.jsx
    
import { useState, useEffect } from "react";
import { Newspaper, X } from "lucide-react";
import { api } from "@/lib/api";

export default function CurrentAffairsFAB() {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (open && cards.length === 0) {
      api.get("/catalog/current-affairs").then((r) => setCards(r.data));
    }
  }, [open]);

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] pl-4 pr-5 py-3 rounded-full shadow-lg"
      >
        <Newspaper className="w-5 h-5" />
        <span className="text-sm font-semibold">Current Affairs</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-white w-[90%] max-w-md rounded-[20px] p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-[#78716C]"><X /></button>
            {cards.length === 0 ? (
              <div className="text-center text-[#78716C] py-10">Loading...</div>
            ) : (
              <>
                <button onClick={() => setFlipped(!flipped)} className="w-full min-h-[160px] flex items-center justify-center text-center p-6 bg-[#FAF9F6] rounded-2xl border">
                  <span className="font-display text-lg">{flipped ? cards[index].back : cards[index].front}</span>
                </button>
                <button onClick={next} className="mt-4 w-full bg-[#7B1E1E] text-white rounded-full py-2.5 font-semibold">Next</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

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
