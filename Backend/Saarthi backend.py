# ============================================================
# PART 1 — add this to the BOTTOM of Backend/seed_data.py
# ============================================================

SAARTHI = {
    "name": "Saarthi",
    "tagline": "Handwritten notes, made to carry you through boards.",
    "intro": (
        "Saarthi is EduMotion's series of handwritten notes books for Class 12. "
        "Every chapter is condensed into clean, exam-focused pages written by hand, "
        "so you can revise faster and remember more."
    ),

    # --- SALES TRACKER VALUES: edit these numbers ---------------------------
    # is_demo=True shows a "Demo figures" badge on the tracker. Set it to False
    # once the numbers are real, and the badge changes to "Live".
    "is_demo": True,
    "status_label": "Pre-launch",
    "target_copies": 500,
    "books": [
        {
            "id": "saarthi-english",
            "title": "Saarthi — English",
            "subject_id": "english",
            "class_id": "class-12",
            "sold": 86,  # <-- put your value here
            "highlights": [
                "The Last Lesson",
                "Lost Spring",
                "Deep Water",
                "My Mother at Sixty-Six",
                "The Tiger King",
                "Journey to the End of the Earth",
            ],
        },
        {
            "id": "saarthi-pe",
            "title": "Saarthi — Physical Education",
            "subject_id": "physical-education",
            "class_id": "class-12",
            "sold": 64,  # <-- put your value here
            "highlights": [
                "Management of Sports Events",
                "Children and Women in Sports",
                "Yoga as Preventive Measure for Lifestyle Disease",
                "Physical Education and Sports for CWSN",
            ],
        },
    ],
    # --- BOOK FEATURES: edit these so they match the real book --------------
    "features": [
        {"title": "Handwritten & easy to scan", "desc": "Clean handwriting with headings, boxes and highlights so key points stand out."},
        {"title": "Chapter-wise coverage", "desc": "Every chapter on its own pages, in the same order as your textbook."},
        {"title": "Exam-focused", "desc": "Built around the CBSE pattern, with the points that actually get asked."},
        {"title": "Quick revision pages", "desc": "Short summary pages for the night before an exam."},
        {"title": "Diagrams & flowcharts", "desc": "Visual notes that make long answers easier to recall."},
        {"title": "Linked to EduMotion", "desc": "Pairs with the quizzes, PYQs and flashcards already on the platform."},
    ],
}


# ============================================================
# PART 2 — in Backend/server.py
#   a) add SAARTHI to your existing seed_data import:
#
#       from seed_data import (
#           CLASSES, SUBJECTS, CHAPTERS, LATEST_UPLOADS, REVIEWS,
#           LEADERBOARD, PYQ_QUESTIONS, FLASHCARDS, QUIZZES, ACHIEVEMENTS,
#           CURRENT_AFFAIRS, SAARTHI,
#       )
#
#   b) add this route next to your other @api_router routes
#      (it must be ABOVE the include_router lines near the bottom):
# ============================================================

@api_router.get("/catalog/saarthi")
async def get_saarthi():
    # TODAY: returns the figures typed into seed_data.py.
    # LATER: replace this body with a real lookup (database, Google Sheet,
    # payment gateway...) and return the same shape. The frontend refreshes
    # every 30 seconds, so no frontend change is needed.
    total_sold = sum(b["sold"] for b in SAARTHI["books"])
    return {**SAARTHI, "total_sold": total_sold}
