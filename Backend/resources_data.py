# resources_data.py
# Data for the Study Materials / Resources hub — MCQ sets (interactive, scored),
# sample papers, PYQs, important questions, and mind maps.
# No database — static Python dicts, same pattern as seed_data.py and library_data.py.

# ---------- MCQ Sets (interactive, scored in the frontend) ----------
MCQ_SETS = {
    "eco-national-income-mcq": {
        "id": "eco-national-income-mcq",
        "title": "National Income — 100 MCQs",
        "subject": "Economics",
        "class_level": "12",
        "chapter": "National Income",
        "questions": [
            {
                "q": "GDP stands for?",
                "options": ["Gross Domestic Product", "General Domestic Product", "Gross Development Plan", "General Development Product"],
                "answer": 0,
            },
            {
                "q": "Which of these is NOT included in National Income?",
                "options": ["Transfer payments", "Wages", "Rent", "Profit"],
                "answer": 0,
            },
            {
                "q": "NNP at Factor Cost is also called:",
                "options": ["National Income", "Gross National Product", "Personal Income", "Disposable Income"],
                "answer": 0,
            },
            # ... continue adding up to 100 questions in this {q, options, answer} shape
        ],
    },
}

# ---------- Sample Papers (question paper + optional marking scheme, both PDFs) ----------
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

# ---------- Previous Year Question Papers ----------
PYQ_PAPERS = {
    "eco-pyq-2024": {
        "id": "eco-pyq-2024",
        "title": "Economics PYQ 2024",
        "subject": "Economics",
        "class_level": "12",
        "year": "2024",
        "pdf_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
    },
    "eco-pyq-2023": {
        "id": "eco-pyq-2023",
        "title": "Economics PYQ 2023",
        "subject": "Economics",
        "class_level": "12",
        "year": "2023",
        "pdf_url": "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/preview",
    },
}

# ---------- Important Questions (text-based, marks-weighted) ----------
IMPORTANT_QUESTIONS = {
    "eco-important-q": {
        "id": "eco-important-q",
        "title": "Economics — Important Questions",
        "subject": "Economics",
        "class_level": "12",
        "questions": [
            {"q": "Explain the circular flow of income with a diagram.", "marks": 4},
            {"q": "Distinguish between GDP and GNP.", "marks": 3},
            {"q": "What is the significance of the multiplier in income determination?", "marks": 6},
        ],
    },
}

# ---------- Mind Maps (single image per chapter) ----------
MIND_MAPS = {
    "eco-national-income-mindmap": {
        "id": "eco-national-income-mindmap",
        "title": "National Income — Mind Map",
        "subject": "Economics",
        "class_level": "12",
        "chapter": "National Income",
        "image_url": "https://drive.google.com/uc?export=view&id=REPLACE_WITH_FILE_ID",
    },
}
