# live_data.py
# Batches and live classes as plain dicts (same pattern as library_data.py).
# Times use IST (+05:30). The status (upcoming/live/ended) is computed
# automatically from the time, so you never edit it by hand.

DEFAULT_TEACHER = "EduMotion Team"  # change to your name or a teacher's name


def _batch(id, name, level, subjects, schedule, start_date, description, teacher=DEFAULT_TEACHER):
    return {
        "id": id,
        "name": name,
        "class_level": level,
        "subjects": subjects,
        "schedule": schedule,
        "start_date": start_date,
        "description": description,
        "teacher": teacher,
    }


_BATCH_LIST = [
    # ---------- Class 9 ----------
    _batch("c9-maths-eng-hindi", "Maths + English + Hindi Combo", "9",
           ["Mathematics", "English", "Hindi"],
           "Mon–Sat, 4:00 PM – 6:00 PM", "2026-11-01",
           "Strong foundation in the three core skill subjects."),
    _batch("c9-sci-sst-maths", "Science + SST + Maths Combo", "9",
           ["Science", "Social Science", "Mathematics"],
           "Mon–Sat, 6:00 PM – 8:00 PM", "2026-11-01",
           "Concept-first teaching for the subjects that carry the most weight."),
    _batch("c9-all", "Complete Foundation Batch", "9",
           ["Mathematics", "Science", "Social Science", "English", "Hindi"],
           "Mon–Sat, 4:00 PM – 8:00 PM", "2026-11-01",
           "Every subject, one batch."),

    # ---------- Class 10 ----------
    _batch("c10-maths-eng-hindi", "Maths + English + Hindi Combo", "10",
           ["Mathematics", "English", "Hindi"],
           "Mon–Sat, 4:00 PM – 6:00 PM", "2026-11-01",
           "Board-focused practice with weekly tests."),
    _batch("c10-sci-sst-maths", "Science + SST + Maths Combo", "10",
           ["Science", "Social Science", "Mathematics"],
           "Mon–Sat, 6:00 PM – 8:00 PM", "2026-11-01",
           "Complete board syllabus with PYQs and sample papers."),
    _batch("c10-all", "Board Year Complete Batch", "10",
           ["Mathematics", "Science", "Social Science", "English", "Hindi"],
           "Mon–Sat, 4:00 PM – 8:00 PM", "2026-11-01",
           "All five subjects with doubt sessions."),

    # ---------- Class 11 ----------
    _batch("c11-science", "Science Batch (PCM)", "11",
           ["Physics", "Chemistry", "Mathematics"],
           "Mon–Sat, 4:00 PM – 7:00 PM", "2026-11-01",
           "Physics, Chemistry and Maths with problem-solving sessions."),
    _batch("c11-commerce", "Commerce Batch", "11",
           ["Economics", "Business Studies", "Accountancy"],
           "Mon–Fri, 4:00 PM – 6:00 PM", "2026-11-01",
           "Commerce core subjects from the basics."),

    # ---------- Class 12 ----------
    _batch("c12-commerce", "Commerce Board Batch 2027", "12",
           ["Economics", "Business Studies", "Accountancy", "Political Science"],
           "Mon–Sat, 5:00 PM – 7:00 PM", "2026-11-01",
           "Full syllabus coverage with weekly tests and doubt sessions."),
    _batch("c12-arts", "Arts Board Batch 2027", "12",
           ["History", "Political Science", "Economics"],
           "Mon–Fri, 4:00 PM – 6:00 PM", "2026-11-01",
           "History, Political Science and Economics in one batch."),
]

BATCHES = {b["id"]: b for b in _BATCH_LIST}


LIVE_CLASSES = {
    "eco-national-income-live-1": {
        "id": "eco-national-income-live-1",
        "batch_id": "c12-commerce",
        "class_level": "12",
        "subject": "Economics",
        "title": "National Income — Introduction",
        "start": "2026-10-12T17:00:00+05:30",
        "duration_min": 60,
        # Paste the YouTube video ID from the live stream URL
        # (the part after v= in youtube.com/watch?v=XXXXXXXXXXX)
        "youtube_id": "REPLACE_WITH_VIDEO_ID",
    },
    "c10-maths-live-1": {
        "id": "c10-maths-live-1",
        "batch_id": "c10-maths-eng-hindi",
        "class_level": "10",
        "subject": "Mathematics",
        "title": "Real Numbers — Revision",
        "start": "2026-10-13T16:00:00+05:30",
        "duration_min": 60,
        "youtube_id": "REPLACE_WITH_VIDEO_ID",
    },
    # Add more classes here, same shape.
}
