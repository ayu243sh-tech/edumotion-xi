# resources_routes.py
# Read-only endpoints for the Study Materials / Resources hub.
# No database, no auth — same pattern as library_routes.py.

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from resources_data import MCQ_SETS, SAMPLE_PAPERS, PYQ_PAPERS, IMPORTANT_QUESTIONS, MIND_MAPS

router = APIRouter(prefix="/resources", tags=["resources"])


def _filter(items, subject=None, class_level=None):
    result = list(items.values())
    if subject:
        result = [i for i in result if i["subject"].lower() == subject.lower()]
    if class_level:
        result = [i for i in result if i["class_level"] == class_level]
    return result


# ---------- MCQ Sets ----------
@router.get("/mcq-sets")
async def list_mcq_sets(subject: Optional[str] = None, class_level: Optional[str] = None):
    sets = _filter(MCQ_SETS, subject, class_level)
    # Don't send full question lists in the list view — just metadata + count
    return [
        {**{k: v for k, v in s.items() if k != "questions"}, "question_count": len(s["questions"])}
        for s in sets
    ]

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


# ---------- Important Questions ----------
@router.get("/important-questions")
async def list_important_questions(subject: Optional[str] = None, class_level: Optional[str] = None):
    return _filter(IMPORTANT_QUESTIONS, subject, class_level)

@router.get("/important-questions/{set_id}")
async def get_important_questions(set_id: str):
    item = IMPORTANT_QUESTIONS.get(set_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


# ---------- Mind Maps ----------
@router.get("/mind-maps")
async def list_mind_maps(subject: Optional[str] = None, class_level: Optional[str] = None):
    return _filter(MIND_MAPS, subject, class_level)

@router.get("/mind-maps/{map_id}")
async def get_mind_map(map_id: str):
    item = MIND_MAPS.get(map_id)
    if not item:
        raise HTTPException(status_code=404, detail="Mind map not found")
    return item
