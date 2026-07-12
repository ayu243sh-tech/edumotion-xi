"""Seed catalog: classes, subjects, chapters, notes, videos, tests, PYQs, reviews."""
from datetime import datetime, timezone

CLASSES = [
    {"id": "class-9", "name": "Class 9", "tag": "Foundation Builder", "color": "#7B1E1E"},
    {"id": "class-10", "name": "Class 10", "tag": "Board Year", "color": "#962A2A"},
    {"id": "class-11", "name": "Class 11", "tag": "Stream Choice", "color": "#F5B400"},
    {"id": "class-12", "name": "Class 12", "tag": "Final Push", "color": "#D99E00"},
]

SUBJECTS = [
    {"id": "science", "name": "Science", "icon": "FlaskConical", "color": "#7B1E1E", "classes": ["class-9", "class-10"]},
    {"id": "mathematics", "name": "Mathematics", "icon": "Sigma", "color": "#962A2A", "classes": ["class-9", "class-10", "class-11", "class-12"]},
    {"id": "social-science", "name": "Social Science", "icon": "Globe2", "color": "#B45309", "classes": ["class-9", "class-10"]},
    {"id": "english", "name": "English", "icon": "BookOpen", "color": "#0F766E", "classes": ["class-9", "class-10", "class-11", "class-12"]},
    {"id": "hindi", "name": "Hindi", "icon": "Languages", "color": "#F5B400", "classes": ["class-9", "class-10"]},
    {"id": "computer", "name": "Computer", "icon": "Cpu", "color": "#1E40AF", "classes": ["class-9", "class-10"]},
    {"id": "physics", "name": "Physics", "icon": "FlaskConical", "color": "#7B1E1E", "classes": ["class-11", "class-12"]},
    {"id": "chemistry", "name": "Chemistry", "icon": "FlaskConical", "color": "#962A2A", "classes": ["class-11", "class-12"]},
    {"id": "biology", "name": "Biology", "icon": "FlaskConical", "color": "#0F766E", "classes": ["class-11", "class-12"]},
    {"id": "history", "name": "History", "icon": "Globe2", "color": "#B45309", "classes": ["class-9","class-10","class-11", "class-12"]},
    {"id": "political-science", "name": "Political Science", "icon": "Landmark", "color": "#B45309", "classes": ["class-9","class-10","class-11", "class-12"]},
    {"id": "economics", "name": "Economics", "icon": "IndianRupee", "color": "#B45309", "classes": ["class-9", "class-10","class-11", "class-12"]},
    {"id": "physical-education", "name": "Physical Education", "icon": "Dumbbell", "color": "#0F766E", "classes": ["class-12","class-11"]},
    
]

# Chapters keyed by class_id + subject_id
# NOTE: "notes_pdf" now holds a Google Drive link (placeholder example below).
# Replace "YOUR_FILE_ID_HERE" with the actual file ID from your uploaded Drive PDF.
# Use ".../preview" to embed inline, or ".../view" to open in a new tab.
CHAPTERS = [
    # ---------- CLASS 11 ----------
    # Physics
    {"id": "ch11-phy-motion", "class_id": "class-11", "subject_id": "physics", "name": "Motion in a Straight Line", "difficulty": "Hard", "duration": "4h 30m", "thumbnail": "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg", "trending": True, "overview": "Position, displacement, velocity, acceleration and equations of motion.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # Chemistry
    {"id": "ch11-chem-basic", "class_id": "class-11", "subject_id": "chemistry", "name": "Some Basic Concepts of Chemistry", "difficulty": "Medium", "duration": "3h 00m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Mole concept, atomic mass, molecular mass, and stoichiometry.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # Biology
    {"id": "ch11-bio-cell", "class_id": "class-11", "subject_id": "biology", "name": "Cell: The Unit of Life", "difficulty": "Medium", "duration": "3h 20m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Cell theory, cell structure, and differences between plant and animal cells.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # History
    {"id": "ch11-his-harappan", "class_id": "class-11", "subject_id": "history", "name": "Harappan Civilization", "difficulty": "Easy", "duration": "2h 00m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Town planning, Great Bath, seals, trade, and decline of the Indus Valley cities.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # ---------- CLASS 12 ----------
    # Physics
    {"id": "ch12-phy-charges", "class_id": "class-12", "subject_id": "physics", "name": "Electric Charges and Fields", "difficulty": "Hard", "duration": "4h 00m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Coulomb's law, electric field, and Gauss's theorem.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # Chemistry
    {"id": "ch12-chem-solutions", "class_id": "class-12", "subject_id": "chemistry", "name": "Solutions", "difficulty": "Medium", "duration": "3h 15m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Types of solutions, concentration terms, and colligative properties.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # Mathematics (already exists as ch-integrals — keep or replace)
    {"id": "ch-integrals", "class_id": "class-12", "subject_id": "mathematics", "name": "Integrals", "difficulty": "Hard", "duration": "5h 00m", "thumbnail": "https://images.pexels.com/photos/6238118/pexels-photo-6238118.jpeg", "trending": True, "overview": "Indefinite & definite integrals, methods of integration, properties.", "video_url": "https://www.youtube.com/embed/__zy-oOLPug", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},
# ---------- CLASS 11 (continued) ----------
    # Political Science
    {"id": "ch11-polsci-constitution", "class_id": "class-11", "subject_id": "political-science", "name": "Constitution: Why and How?", "difficulty": "Medium", "duration": "2h 30m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Need for a constitution, constituent assembly, and its guiding values.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # Economics
    {"id": "ch11-eco-basics", "class_id": "class-11", "subject_id": "economics", "name": "Introduction to Economics", "difficulty": "Easy", "duration": "2h 00m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Scarcity, choice, opportunity cost, and central problems of an economy.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # ---------- CLASS 12 (continued) ----------
    # Political Science
    {"id": "ch12-polsci-coldwar", "class_id": "class-12", "subject_id": "political-science", "name": "The Cold War Era", "difficulty": "Medium", "duration": "3h 00m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Origins of the Cold War, alliances, arms race, and non-alignment.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/184Ff26mXJtiBFt0vUQmzBk4AeyfbV5Zo/view?usp=drive_link"},

    # Economics
    {"id": "ch12-eco-national-income", "class_id": "class-12", "subject_id": "economics", "name": "National Income Accounting", "difficulty": "Hard", "duration": "3h 45m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "GDP, GNP, NDP, and methods of measuring national income.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},
    # ---------- CLASS 12 - Physical Education ----------
    {"id": "ch12-pe-sports-mgmt", "class_id": "class-12", "subject_id": "physical-education", "name": "Management of Sports Events", "difficulty": "Medium", "duration": "2h 30m", "thumbnail": "https://images.pexels.com/photos/9276888/pexels-photo-9276888.jpeg", "trending": False, "overview": "Planning, organizing committees, budgeting, and conducting tournaments.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/1pt8UwXsb8ORk1JsGBta95a5yYN6LyNw9/view?usp=sharing"},

    {"id": "ch12-pe-women-sports", "class_id": "class-12", "subject_id": "physical-education", "name": "Children and Women in Sports", "difficulty": "Easy", "duration": "2h 00m", "thumbnail": "https://images.pexels.com/photos/38366608/pexels-photo-38366608.jpeg", "trending": False, "overview": "Motor development in children, common sports injuries, and women's participation in sports.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    {"id": "ch12-pe-yoga-lifestyle", "class_id": "class-12", "subject_id": "physical-education", "name": "Yoga as Preventive Measure for Lifestyle Disease", "difficulty": "Easy", "duration": "2h 15m", "thumbnail": "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg", "trending": False, "overview": "Obesity, diabetes, asthma, hypertension, and back pain management through yoga.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    # ---------- CLASS 12 - English ----------
    {"id": "ch12-eng-last-lesson", "class_id": "class-12", "subject_id": "english", "name": "The Last Lesson", "difficulty": "Easy", "duration": "1h 30m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Alsace under Prussian rule, loss of language and identity, and the value of one's mother tongue.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    {"id": "ch12-eng-lost-spring", "class_id": "class-12", "subject_id": "english", "name": "Lost Spring", "difficulty": "Medium", "duration": "1h 45m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Childhood lost to poverty, child labour, and broken promises in Saheb and Mukesh's stories.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    {"id": "ch12-eng-mother-66", "class_id": "class-12", "subject_id": "english", "name": "My Mother at Sixty-Six", "difficulty": "Easy", "duration": "1h 00m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "Ageing, mortality, and a daughter's fear of losing her mother, told through a car ride to the airport.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},

    {"id": "ch12-eng-deep-water", "class_id": "class-12", "subject_id": "english", "name": "Deep Water", "difficulty": "Medium", "duration": "1h 45m", "thumbnail": "https://images.pexels.com/photos/YOUR_PHOTO_ID/pexels-photo-YOUR_PHOTO_ID.jpeg", "trending": False, "overview": "William Douglas's childhood fear of water and how he overcame it through determination.", "video_url": "https://www.youtube.com/embed/YOUR_VIDEO_ID", "notes_pdf": "https://drive.google.com/file/d/YOUR_FILE_ID/preview"},
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
