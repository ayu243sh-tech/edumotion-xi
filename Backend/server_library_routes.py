# Add BOOKS to the import line at the top of server.py:
# from seed_data import (
#     CLASSES, SUBJECTS, CHAPTERS, LATEST_UPLOADS, REVIEWS,
#     LEADERBOARD, PYQ_QUESTIONS, FLASHCARDS, QUIZZES, ACHIEVEMENTS,
#     CURRENT_AFFAIRS, BOOKS,
# )

# Then add these two routes anywhere among your other @api_router routes:

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
