from fastapi import APIRouter, HTTPException
from typing import Optional

from resources_data import (
    RESOURCE_CHAPTERS, MCQ_SETS, IMPORTANT_QUESTIONS, MIND_MAPS,
    FORMULA_SHEETS, SAMPLE_PAPERS, PYQ_PAPERS, PREMIUM_BOOKS,
)

router = APIRouter(prefix="/resources", tags=["resources"])


def _filter(items, subject=None, class_level=None):
    result = list(items.values())
    if subject:
        result = [i for i in result if i["subject"].lower() == subject.lower()]
    if class_level:
        result = [i for i in result if i["class_level"] == class_level]
    return result


# ---------- Subjects (distinct list, per class — drives the subject cards) ----------
@router.get("/subjects")
async def list_subjects(class_level: Optional[str] = None):
    chapters = list(RESOURCE_CHAPTERS.values())
    if class_level:
        chapters = [c for c in chapters if c["class_level"] == class_level]
    subjects = {}
    for c in chapters:
        subjects.setdefault(c["subject"], 0)
        subjects[c["subject"]] += 1
    return [{"subject": s, "chapter_count": n} for s, n in subjects.items()]


# ---------- Chapters (per subject + class — drives the chapter list) ----------
@router.get("/chapters")
async def list_chapters(subject: Optional[str] = None, class_level: Optional[str] = None):
    return _filter(RESOURCE_CHAPTERS, subject, class_level)


# ---------- Chapter detail — everything for ONE chapter in one call ----------
@router.get("/chapters/{chapter_id}")
async def get_chapter_detail(chapter_id: str):
    chapter = RESOURCE_CHAPTERS.get(chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    mcq = next((m for m in MCQ_SETS.values() if m["chapter_id"] == chapter_id), None)
    iq = next((q for q in IMPORTANT_QUESTIONS.values() if q["chapter_id"] == chapter_id), None)
    mind_map = next((m for m in MIND_MAPS.values() if m["chapter_id"] == chapter_id), None)
    formula_sheet = next((f for f in FORMULA_SHEETS.values() if f["chapter_id"] == chapter_id), None)

    return {
        "chapter": chapter,
        "mcq_set": {**mcq, "question_count": len(mcq["questions"])} if mcq else None,
        "important_questions": iq,
        "mind_map": mind_map,
        "formula_sheet": formula_sheet,
    }


@router.get("/mcq-sets/{set_id}")
async def get_mcq_set(set_id: str):
    mcq_set = MCQ_SETS.get(set_id)
    if not mcq_set:
        raise HTTPException(status_code=404, detail="MCQ set not found")
    return mcq_set


# ---------- Sample Papers ----------
@router.get("/sample-papers")
async def list_sample_papers(subject: Optional[str] = None, class_level: Optional[str] = None):
    return _filter(SAMPLE_PAPERS, subject, class_level)

@router.get("/sample-papers/{paper_id}")
async def get_sample_paper(paper_id: str):
    paper = SAMPLE_PAPERS.get(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Sample paper not found")
    return paper


# ---------- PYQs ----------
@router.get("/pyqs")
async def list_pyqs(subject: Optional[str] = None, class_level: Optional[str] = None, year: Optional[str] = None):
    items = _filter(PYQ_PAPERS, subject, class_level)
    if year:
        items = [i for i in items if i["year"] == year]
    return items

@router.get("/pyqs/{pyq_id}")
async def get_pyq(pyq_id: str):
    pyq = PYQ_PAPERS.get(pyq_id)
    if not pyq:
        raise HTTPException(status_code=404, detail="PYQ not found")
    return pyq


# ---------- Premium Books ----------
@router.get("/premium-books")
async def list_premium_books(subject: Optional[str] = None, class_level: Optional[str] = None):
    return _filter(PREMIUM_BOOKS, subject, class_level)

@router.get("/premium-books/{book_id}")
async def get_premium_book(book_id: str):
    book = PREMIUM_BOOKS.get(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
