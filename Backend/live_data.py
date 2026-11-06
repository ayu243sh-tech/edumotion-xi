# live_data.py
# Batches and live classes as plain dicts (same pattern as library_data.py).
# Times use IST (+05:30). The status (upcoming/live/ended) is computed
# automatically from the time, so you never edit it by hand.

DEFAULT_TEACHER = "EduMotion Team"  # change to your name or a teacher's name


def _batch(id, name, level, subjects, schedule, start_date, description,
           teacher=DEFAULT_TEACHER, options=None):
    return {
        "id": id,
        "name": name,
        "class_level": level,
        "subjects": subjects,
        "schedule": schedule,
        "start_date": start_date,
        "description": description,
        "teacher": teacher,
        "options": options or [],
    }


# ---------------------------------------------------------------------------
# Teacher lists and options
# ---------------------------------------------------------------------------

# Classes 7 and 8 (same teachers)
_CLASS_7_8_TEACHERS = (
    "Mr. Daljeet Kumar"
)

# Class 6
_CLASS_6_TEACHERS = (
    "Mr. Daljeet Kumar "
)

# Class 11 and Class 12 Humanities
_HUMANITIES_TEACHERS = "Mrs. Faiza Khan (History, Political Science) · Mr. Ayush Maurya (Economics)"

# Commerce: Class 11 and Class 12 share these two options
_COMMERCE_OPTIONS = [
    {
        "id": "A",
        "label": "Option A",
        "tagline": "A specialist teacher for every subject",
        "teachers": [
            {"subject": "Economics", "name": "Mr. Ashish Kumar"},
        ],
    },
    {
        "id": "B",
        "label": "Option B",
        "tagline": "Subject-wise teaching with a structured study plan",
        "teachers": [],
    },
]

# PCB: Class 11 and Class 12 share these two options
_PCB_OPTIONS = [
    {
        "id": "A",
        "label": "Option A",
        "tagline": "Subject-wise teaching with a structured study plan",
        "teachers": [],
    },
    {
        "id": "B",
        "label": "Option B",
        "tagline": "Subject-wise teaching with a structured study plan",
        "teachers": [],
    },
]

# PCM: Class 11 and Class 12 share these two options
_PCM_OPTIONS = [
    {
        "id": "A",
        "label": "Option A",
        "tagline": "Subject-wise teaching with a structured study plan",
        "teachers": [],
    },
    {
        "id": "B",
        "label": "Option B",
        "tagline": "Subject-wise teaching with a structured study plan",
        "teachers": [],
    },
]

_JUNIOR_SUBJECTS = ["Mathematics", "English", "Science", "Hindi", "Social Science"]

_JUNIOR_OPTIONS = [
    {
        "id": "A",
        "label": "Option A",
          "tagline": "All five subjects with Mr. Daljeet Kumar",
        "teachers": [{"subject": s, "name": "Mr. Daljeet Kumar"} for s in _JUNIOR_SUBJECTS],
    },
    {
        "id": "B",
        "label": "Option B",
        "tagline": "All five subjects with Mr. Ashish Kumar",
        "teachers": [{"subject": s, "name": "Mr. Ashish Kumar"} for s in _JUNIOR_SUBJECTS],
    },
]

# ---------------------------------------------------------------------------
# Batches, in order from Class 6 to Class 12
# ---------------------------------------------------------------------------
_BATCH_LIST = [
        _batch("c6-all", "Class 6 Complete Batch", "6",
           _JUNIOR_SUBJECTS,
           "Mon–Sat, 3:00 PM – 5:00 PM", "2026-11-10",
           "All five subjects in one batch, taught concept by concept. Choose the teacher you learn best with.",
           options=_JUNIOR_OPTIONS),
    _batch("c7-all", "Class 7 Complete Batch", "7",
           _JUNIOR_SUBJECTS,
           "Mon–Sat, 3:00 PM – 5:00 PM", "2026-11-10",
           "All five subjects in one batch, with regular practice and revision. Choose the teacher you learn best with.",
           options=_JUNIOR_OPTIONS),
    _batch("c8-all", "Class 8 Complete Batch", "8",
           _JUNIOR_SUBJECTS,
           "Mon–Sat, 3:00 PM – 5:00 PM", "2026-11-10",
           "All five subjects in one batch, building a strong base for Class 9. Choose the teacher you learn best with.",
           options=_JUNIOR_OPTIONS),

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
    _batch("c11-commerce", "Commerce Batch", "11",
           ["Economics", "Business Studies", "Accountancy"],
           "Mon–Sat, 5:00 PM – 7:00 PM", "2026-11-10",
           "Commerce core subjects from the basics, with weekly tests and doubt sessions. Choose the teachers you learn best with.",
           options=_COMMERCE_OPTIONS),
    _batch("c11-humanities", "Humanities Batch", "11",
           ["History", "Political Science", "Economics"],
           "Mon–Fri, 4:00 PM – 6:00 PM", "2026-11-10",
           "History, Political Science and Economics in one batch, with weekly tests and doubt sessions.",
           teacher=_HUMANITIES_TEACHERS),
    _batch("c11-pcm", "PCM Batch", "11",
           ["Physics", "Chemistry", "Mathematics"],
           "Mon–Sat, 4:00 PM – 7:00 PM", "2026-11-10",
           "Physics, Chemistry and Maths with problem-solving sessions. Choose the teachers you learn best with.",
           options=_PCM_OPTIONS),
    _batch("c11-pcb", "PCB Batch", "11",
           ["Physics", "Chemistry", "Biology"],
           "Mon–Sat, 4:00 PM – 7:00 PM", "2026-11-10",
           "Physics, Chemistry and Biology with diagrams, revision and doubt sessions. Choose the teachers you learn best with.",
           options=_PCB_OPTIONS),

     # ---------- Class 12 ----------
    _batch("c12-commerce", "Commerce Board Batch 2027", "12",
           ["Economics", "Business Studies", "Accountancy"],
           "Mon–Sat, 5:00 PM – 7:00 PM", "2026-11-01",
           "Full syllabus coverage with weekly tests and doubt sessions. Choose the teachers you learn best with.",
           options=_COMMERCE_OPTIONS),
    _batch("c12-humanities", "Humanities Board Batch 2027", "12",
           ["History", "Political Science", "Economics"],
           "Mon–Fri, 4:00 PM – 6:00 PM", "2026-11-10",
           "Complete board syllabus for History, Political Science and Economics, with PYQs and sample papers.",
           teacher=_HUMANITIES_TEACHERS),
    _batch("c12-pcm", "PCM Board Batch 2027", "12",
           ["Physics", "Chemistry", "Mathematics"],
           "Mon–Sat, 4:00 PM – 7:00 PM", "2026-11-10",
           "Full syllabus with numericals, weekly tests and doubt sessions. Choose the teachers you learn best with.",
           options=_PCM_OPTIONS),
    _batch("c12-pcb", "PCB Board Batch 2027", "12",
           ["Physics", "Chemistry", "Biology"],
           "Mon–Sat, 4:00 PM – 7:00 PM", "2026-11-10",
           "Full syllabus with diagrams, revision and weekly tests. Choose the teachers you learn best with.",
           options=_PCB_OPTIONS),
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
        "youtube_id": "QWAo4ffY3E0",
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
               "c12-eco-live-A1": {
        "id": "c12-eco-live-A1",
        "batch_id": "c12-commerce",
        "option_id": "A",
        "class_level": "12",
        "subject": "Economics",
        "title": "National Income: Introduction (Mr. Ashish Kumar)",
        "start": "2026-11-03T17:00:00+05:30",
        "duration_min": 60,
        "youtube_id": "REPLACE_WITH_VIDEO_ID",
    },
    "c12-eco-live-B1": {
        "id": "c12-eco-live-B1",
        "batch_id": "c12-commerce",
        "option_id": "B",
        "class_level": "12",
        "subject": "Economics",
        "title": "National Income: Introduction (Mr. Nitin Bajpai)",
        "start": "2026-11-03T18:00:00+05:30",
        "duration_min": 60,
        "youtube_id": "REPLACE_WITH_VIDEO_ID",
    },
    # Add more classes here, same shape.
}
