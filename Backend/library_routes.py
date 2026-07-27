# library_routes.py
# Read-only endpoints for the Digital Library.
# No database, no auth — book data comes straight from library_data.py,
# and PDFs are served by Google Drive directly (frontend embeds pdf_url in an iframe).

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from library_data import BOOKS

router = APIRouter(prefix="/library", tags=["library"])


@router.get("/books")
def list_books(
    class_level: Optional[str] = Query(None, description="Filter by class, e.g. '12'"),
    subject: Optional[str] = Query(None, description="Filter by subject, e.g. 'Economics'"),
    q: Optional[str] = Query(None, description="Search by title or author"),
):
    """
    Returns all books, optionally filtered by class, subject, and/or a search string.
    Filtering happens here so the frontend can just hit one endpoint for browse + search.
    """
    books = list(BOOKS.values())

    if class_level:
        books = [b for b in books if b["class_level"] == class_level]

    if subject:
        books = [b for b in books if b["subject"].lower() == subject.lower()]

    if q:
        q_lower = q.lower()
        books = [
            b for b in books
            if q_lower in b["title"].lower() or q_lower in b["author"].lower()
        ]

    return books


@router.get("/books/{book_id}")
def get_book(book_id: str):
    """
    Returns full details for a single book, including its chapter list —
    used by the BookReader page.
    """
    book = BOOKS.get(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.get("/subjects")
def list_subjects():
    """
    Returns the distinct list of subjects present in the library —
    used to build the subject filter tiles on the homepage/browse page.
    """
    return sorted({b["subject"] for b in BOOKS.values()})


@router.get("/classes")
def list_classes():
    """
    Returns the distinct list of class levels present in the library —
    used to build the class filter tiles.
    """
    return sorted({b["class_level"] for b in BOOKS.values()})
