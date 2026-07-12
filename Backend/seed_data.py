"""Seed catalog: classes, subjects, chapters, notes, videos, tests, PYQs, reviews."""
from datetime import datetime, timezone

CLASSES = [
    {"id": "class-9", "name": "Class 9", "tag": "Foundation Builder", "color": "#7B1E1E"},
    {"id": "class-10", "name": "Class 10", "tag": "Board Year", "color": "#962A2A"},
    {"id": "class-11", "name": "Class 11", "tag": "Stream Choice", "color": "#F5B400"},
    {"id": "class-12", "name": "Class 12", "tag": "Final Push", "color": "#D99E00"},
]

SUBJECTS = [
    {"id": "science", "name": "Science", "icon": "FlaskConical", "color": "#7B1E1E"},
    {"id": "mathematics", "name": "Mathematics", "icon": "Sigma", "color": "#962A2A"},
    {"id": "social-science", "name": "Social Science", "icon": "Globe2", "color": "#B45309"},
    {"id": "english", "name": "English", "icon": "BookOpen", "color": "#0F766E"},
    {"id": "hindi", "name": "Hindi", "icon": "Languages", "color": "#F5B400"},
    {"id": "computer", "name": "Computer", "icon": "Cpu", "color": "#1E40AF"},
]

# Chapters keyed by class_id + subject_id
# NOTE: "notes_pdf" now holds a Google Drive link (placeholder example below).
# Replace "YOUR_FILE_ID_HERE" with the actual file ID from your uploaded Drive PDF.
# Use ".../preview" to embed inline, or ".../view" to open in a new tab.
CHAPTERS = [
    # Class 10 Science
    {"id": "ch-light", "class_id": "class-10", "subject_id": "science", "name": "Light – Reflection and Refraction", "difficulty": "Medium", "duration": "3h 20m", "thumbnail": "https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg", "trending": True, "overview": "Understand laws of reflection, image formation by mirrors, refraction by lenses, lens formula, and power of a lens.", "video_url": "https://www.youtube.com/embed/Pe-rkN9pibo", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    {"id": "ch-electricity", "class_id": "class-10", "subject_id": "science", "name": "Electricity", "difficulty": "Hard", "duration": "4h 10m", "thumbnail": "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg", "trending": True, "overview": "Ohm's law, resistance, series & parallel combinations, heating effect of current, and electric power.", "video_url": "https://www.youtube.com/embed/mc979OhitAg", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    {"id": "ch-life-processes", "class_id": "class-10", "subject_id": "science", "name": "Life Processes", "difficulty": "Easy", "duration": "2h 45m", "thumbnail": "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg", "trending": True, "overview": "Nutrition, respiration, transportation and excretion in living organisms.", "video_url": "https://www.youtube.com/embed/yqOpC4lvDRA", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    # Class 10 Maths
    {"id": "ch-quadratic", "class_id": "class-10", "subject_id": "mathematics", "name": "Quadratic Equations", "difficulty": "Medium", "duration": "3h 00m", "thumbnail": "https://images.pexels.com/photos/6238048/pexels-photo-6238048.jpeg", "trending": True, "overview": "Roots of quadratic equations, discriminant, nature of roots and applications.", "video_url": "https://www.youtube.com/embed/UFiP-zsiqIw", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    {"id": "ch-trigonometry", "class_id": "class-10", "subject_id": "mathematics", "name": "Introduction to Trigonometry", "difficulty": "Medium", "duration": "3h 30m", "thumbnail": "https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg", "trending": False, "overview": "Trig ratios, identities, complementary angles and basic problems.", "video_url": "https://www.youtube.com/embed/F21S9Wpi0y8", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    # Class 11 Physics
    {"id": "ch-kinematics", "class_id": "class-11", "subject_id": "science", "name": "Motion in a Straight Line", "difficulty": "Hard", "duration": "4h 30m", "thumbnail": "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg", "trending": True, "overview": "Position, displacement, velocity, acceleration and equations of motion.", "video_url": "https://www.youtube.com/embed/ZM8ECpBuQYE", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    # Class 9 Science
    {"id": "ch-matter", "class_id": "class-9", "subject_id": "science", "name": "Matter in Our Surroundings", "difficulty": "Easy", "duration": "2h 10m", "thumbnail": "https://images.pexels.com/photos/220301/pexels-photo-220301.jpeg", "trending": False, "overview": "States of matter, change of state, evaporation and factors affecting it.", "video_url": "https://www.youtube.com/embed/oNCxs0EaW4Y", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    # Class 12 Maths
    {"id": "ch-integrals", "class_id": "class-12", "subject_id": "mathematics", "name": "Integrals", "difficulty": "Hard", "duration": "5h 00m", "thumbnail": "https://images.pexels.com/photos/6238118/pexels-photo-6238118.jpeg", "trending": True, "overview": "Indefinite & definite integrals, methods of integration, properties.", "video_url": "https://www.youtube.com/embed/__zy-oOLPug", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    # Class 10 English
    {"id": "ch-letter", "class_id": "class-10", "subject_id": "english", "name": "A Letter to God", "difficulty": "Easy", "duration": "1h 30m", "thumbnail": "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg", "trending": False, "overview": "Theme, characters and message of the story.", "video_url": "https://www.youtube.com/embed/n2C5wlSDQTI", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
    # Class 10 Computer
    {"id": "ch-python", "class_id": "class-10", "subject_id": "computer", "name": "Python Basics", "difficulty": "Easy", "duration": "2h 20m", "thumbnail": "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg", "trending": True, "overview": "Variables, data types, conditionals, loops and functions in Python.", "video_url": "https://www.youtube.com/embed/_uQrJ0TkZlc", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/preview"},
]

# NOTE: "drive_link" added below as a placeholder — replace with the actual
# Google Drive link once you've uploaded the corresponding file.
LATEST_UPLOADS = [
    {"id": "u1", "type": "notes", "title": "Electricity – Complete Revision PDF", "chapter_id": "ch-electricity", "date": "2026-02-10", "drive_link": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view"},
    {"id": "u2", "type": "video", "title": "Light: Spherical Mirrors Explained", "chapter_id": "ch-light", "date": "2026-02-09", "drive_link": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view"},
    {"id": "u3", "type": "test", "title": "Quadratic Equations – Chapter Test", "chapter_id": "ch-quadratic", "date": "2026-02-08", "drive_link": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view"},
    {"id": "u4", "type": "notes", "title": "Life Processes – Mind Map", "chapter_id": "ch-life-processes", "date": "2026-02-07", "drive_link": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view"},
    {"id": "u5", "type": "video", "title": "Kinematics: Motion Graphs", "chapter_id": "ch-kinematics", "date": "2026-02-06", "drive_link": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view"},
    {"id": "u6", "type": "test", "title": "Trigonometry Quick Quiz", "chapter_id": "ch-trigonometry", "date": "2026-02-05", "drive_link": "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view"},
]

REVIEWS = [
    {"name": "Ayush Sharma", "class": "Class 10", "rating": 5, "text": "Edumotion's mind maps made me actually enjoy revision. Scored 94 in pre-boards!", "picture": "https://images.pexels.com/photos/5940722/pexels-photo-5940722.jpeg"},
    {"name": "Priya Verma", "class": "Class 12", "rating": 5, "text": "The AI doubt solver is brilliant for late-night study sessions. Feels like having a tutor 24/7.", "picture": "https://images.pexels.com/photos/7983621/pexels-photo-7983621.jpeg"},
    {"name": "Rahul Mehta", "class": "Class 11", "rating": 4, "text": "PYQs section is gold. Practice exactly what comes in board exams.", "picture": "https://images.pexels.com/photos/4144096/pexels-photo-4144096.jpeg"},
    {"name": "Anika Iyer", "class": "Class 9", "rating": 5, "text": "Clean design, no clutter. I can focus and the streak keeps me consistent.", "picture": "https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg"},
]

LEADERBOARD = [
    {"name": "Vihaan K.", "points": 4820, "rank": 1, "avatar": "V"},
    {"name": "Saanvi G.", "points": 4655, "rank": 2, "avatar": "S"},
    {"name": "Aarav P.", "points": 4490, "rank": 3, "avatar": "A"},
    {"name": "Diya R.", "points": 4210, "rank": 4, "avatar": "D"},
    {"name": "Kabir M.", "points": 4080, "rank": 5, "avatar": "K"},
]

PYQ_QUESTIONS = {
    "ch-light": [
        {"year": 2024, "q": "State the laws of refraction of light."},
        {"year": 2023, "q": "Define power of a lens. What is its SI unit?"},
        {"year": 2022, "q": "Derive the mirror formula for a concave mirror."},
    ],
    "ch-electricity": [
        {"year": 2024, "q": "State Ohm's law. Draw V-I graph for a metallic conductor."},
        {"year": 2023, "q": "Derive an expression for the equivalent resistance of three resistors connected in parallel."},
    ],
    "ch-quadratic": [
        {"year": 2024, "q": "Find the roots of x² – 5x + 6 = 0 by factorisation."},
        {"year": 2023, "q": "Determine the nature of roots of 2x² – 4x + 3 = 0."},
    ],
}

FLASHCARDS = {
    "ch-light": [
        {"front": "Laws of Reflection", "back": "1) Angle of incidence = angle of reflection. 2) Incident ray, reflected ray and normal lie in the same plane."},
        {"front": "Power of a lens", "back": "P = 1/f (in metres). SI unit: Dioptre (D)."},
        {"front": "Refractive Index", "back": "n = c/v, where c = speed of light in vacuum, v = speed in medium."},
    ],
    "ch-electricity": [
        {"front": "Ohm's Law", "back": "V = IR, where V is potential difference, I is current, R is resistance."},
        {"front": "Series Combination", "back": "R = R₁ + R₂ + R₃ + …"},
        {"front": "Parallel Combination", "back": "1/R = 1/R₁ + 1/R₂ + 1/R₃ + …"},
    ],
    "ch-quadratic": [
        {"front": "Standard Form", "back": "ax² + bx + c = 0, where a ≠ 0."},
        {"front": "Discriminant", "back": "D = b² – 4ac. D>0 ⇒ real distinct, D=0 ⇒ equal, D<0 ⇒ no real roots."},
    ],
}

QUIZZES = {
    "ch-light": [
        {"q": "The image formed by a plane mirror is:", "options": ["Real & inverted", "Virtual & erect", "Real & erect", "Virtual & inverted"], "answer": 1},
        {"q": "SI unit of power of a lens is:", "options": ["Watt", "Metre", "Dioptre", "Joule"], "answer": 2},
        {"q": "Focal length of a concave mirror is positive or negative?", "options": ["Positive", "Negative", "Zero", "Infinite"], "answer": 1},
    ],
    "ch-electricity": [
        {"q": "Unit of resistance is:", "options": ["Volt", "Ampere", "Ohm", "Watt"], "answer": 2},
        {"q": "Resistors in series have the same:", "options": ["Voltage", "Current", "Power", "Resistance"], "answer": 1},
    ],
    "ch-quadratic": [
        {"q": "If D < 0, the quadratic has:", "options": ["Two real roots", "Equal roots", "No real roots", "One root"], "answer": 2},
    ],
}

ACHIEVEMENTS = [
    {"id": "streak-7", "name": "7-Day Streak", "icon": "🔥", "description": "Studied 7 days in a row"},
    {"id": "first-100", "name": "First 100 Chapters", "icon": "📚", "description": "Completed your first 100 chapters"},
    {"id": "quiz-master", "name": "Quiz Master", "icon": "🏆", "description": "Aced 25 chapter quizzes"},
    {"id": "perfect", "name": "Perfect Score", "icon": "⭐", "description": "Scored 100% in a chapter test"},
]

