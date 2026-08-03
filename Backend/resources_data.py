# resources_data.py

# ---------- Chapters (the backbone — everything else links to a chapter_id) ----------
RESOURCE_CHAPTERS = {
    "eco-national-income": {
        "id": "eco-national-income",
        "title": "National Income",
        "subject": "Economics",
        "class_level": "12",
    },
    "his-harappan": {
        "id": "his-harappan",
        "title": "Harappan Civilization",
        "subject": "History",
        "class_level": "12",
    },
    # Add one entry per chapter you want covered in the Resource Hub.
}

# ---------- MCQ Sets (now linked to a chapter_id) ----------
MCQ_SETS = {
    "eco-national-income-mcq": {
        "id": "eco-national-income-mcq",
        "chapter_id": "eco-national-income",
        "questions": [
            {"q": "GDP stands for?", "options": ["Gross Domestic Product", "General Domestic Product", "Gross Development Plan", "General Development Product"], "answer": 0},
            # ... rest of your 28 questions
        ],
    },
}

# ---------- Important Questions (linked to a chapter_id) ----------
IMPORTANT_QUESTIONS = {
    "eco-national-income-iq": {
        "id": "eco-national-income-iq",
        "chapter_id": "eco-national-income",
        "questions": [
            {"q": "Explain the circular flow of income with a diagram.", "marks": 4},
            # ... rest of your 18 questions
        ],
    },
}

# ---------- Mind Maps (linked to a chapter_id, one per chapter) ----------
MIND_MAPS = {
    "eco-national-income-mindmap": {
        "id": "eco-national-income-mindmap",
        "chapter_id": "eco-national-income",
        "image_url": "https://drive.google.com/uc?export=view&id=REPLACE_WITH_FILE_ID",
    },
}

# ---------- Formula Sheets (NEW — linked to a chapter_id) ----------
FORMULA_SHEETS = {
    "eco-national-income-formulas": {
        "id": "eco-national-income-formulas",
        "chapter_id": "eco-national-income",
        "image_url": "https://drive.google.com/uc?export=view&id=REPLACE_WITH_FILE_ID",
        # Formula sheets are usually one image, same viewer as mind maps.
        # If yours are PDFs instead, use "pdf_url" and the PDF viewer instead.
    },
}

# ---------- Sample Papers (top-level, spans all chapters — unchanged) ----------
SAMPLE_PAPERS = {
    "eco-sample-paper-1": {
        "id": "eco-sample-paper-1",
        "title": "Economics Sample Paper 1",
        "subject": "Economics",
        "class_level": "12",
        "year": "2026",
        "pdf_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
        "marking_scheme_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
    },
}

# ---------- PYQs (top-level — unchanged) ----------
PYQ_PAPERS = {
    "eco-pyq-2025-set1": {
        "id": "eco-pyq-2025-set1",
        "title": "Economics PYQ 2025 — Set 1",
        "subject": "Economics",
        "class_level": "12",
        "year": "2025",
        "pdf_url": "https://drive.google.com/file/d/19MAVP1AfekLwzywrmEwt-dSaIcYZx5ta/preview",
    },
    # ... rest of your PYQ entries
}

# ---------- Premium Books (NEW — your handwritten books, Library-style) ----------
PREMIUM_BOOKS = {
    # Same shape as your Digital Library's BOOKS — title, author, cover, pdf_url, optional chapters.
    # "eco-handwritten-notes": {
    #     "id": "eco-handwritten-notes",
    #     "title": "Economics — Handwritten Notes",
    #     "author": "Ayush",
    #     "class_level": "12",
    #     "subject": "Economics",
    #     "cover": "https://...jpg",
    #     "pdf_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
    # },
}
