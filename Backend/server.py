from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pdf_generator import generate_pdf
from library_routes import router as library_router
from resources_routes import router as resources_router
from models3d_routes import router as models3d_router

from starlette.middleware.cors import CORSMiddleware
import os
import httpx
import logging
from pathlib import Path
from dotenv import load_dotenv
from typing import Optional
from datetime import datetime, timezone

from seed_data import (
    CLASSES, SUBJECTS, CHAPTERS, LATEST_UPLOADS, REVIEWS,
    LEADERBOARD, PYQ_QUESTIONS, FLASHCARDS, QUIZZES, ACHIEVEMENTS,
    CURRENT_AFFAIRS,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(title="Edumotion XI API")
api_router = APIRouter(prefix="/api")

# In-memory visit counter (resets on restart — no persistence needed)
_visits = {}  # { "2026-07-11": {"ip1", "ip2", ...} }

class PDFRequest(BaseModel):
    title: str
    content: str


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


GEMINI_SYSTEM_PROMPT = (
    "Your name is Leo,you are Edumotion AI, a friendly and knowledgeable assistant for Indian "
    "school students in Classes 9-12 (CBSE board). Answer questions on any topic "
    "in clear, helpful detail — academic subjects, general knowledge, everyday "
    "questions, or anything else the student asks. When explaining academic "
    "concepts, break things down step by step using simple language and keep "
    "answers exam-relevant where applicable. For non-academic questions, answer "
    "just as helpfully and completely."
    "If asked who your father, creator, or maker is, respond warmly: "
    "'Ayush Maurya is my father — he built me to help students like you!'"
    "If asked who is Lassi, of Class 12th C, or meri class me Lassi kon hai, responde warmly: "
    "'Sukhmehar Sukkhi pajji Class 12th C ka Lassi hai !'"
)

@api_router.post("/ai/chat")
async def ai_chat(request: Request):
    body = await request.json()
    message = body.get("message", "").strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    api_key = os.environ.get("EDUMOTION_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service is not configured")

    url = "https://api.groq.com/openai/v1/chat/completions"

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": GEMINI_SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": message
            }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                url,
                json=payload,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
            )

        print("Status Code:", resp.status_code)
        print("Response:", resp.text)

        data = resp.json()

        if resp.status_code != 200:
            print("Groq Error:", data)
            raise Exception(data.get("error", {}).get("message", "Unknown API error"))

        reply = data["choices"][0]["message"]["content"]

    except Exception as e:
        print("Groq Error:", e)
        reply = f"Groq Error: {e}"

    return {"reply": reply}
    
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

@api_router.post("/generate-pdf")
async def generate_pdf_api(request: PDFRequest):
    pdf_path = generate_pdf(request.title, request.content)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{request.title}.pdf"
    )
    
api_router.include_router(library_router)
api_router.include_router(resources_router)
api_router.include_router(models3d_router)
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
