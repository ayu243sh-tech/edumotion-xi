# video_data.py
# Lecture videos per chapter. The key is the chapter id.
# To find a chapter id: open that chapter on the site; the URL ends with /chapter/<id>.
# youtube_id = the part after youtu.be/ or after v= in the YouTube link.
# Make the videos "Unlisted" on YouTube with embedding allowed.
# Entries whose id still starts with REPLACE are ignored, so nothing broken shows up.

VIDEO_LECTURES = {
    # ---------- Class 12 History (Themes in Indian History) ----------
    "ch11-his-harappan": {  # Ch 1 — Bricks, Beads and Bones
        "hindi": [
            {"title": "Harappan Civilization — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Harappan Civilization — Full Lecture", "youtube_id": "BesZIL3xJPE"},
        ],
    },
    "his-kings-farmers-towns": {  # Ch 2 — Kings, Farmers and Towns
        "hindi": [
            {"title": "Kings, Farmers and Towns — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Kings, Farmers and Towns — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "his-kinship-caste-class": {  # Ch 3 — Kinship, Caste and Class
        "hindi": [
            {"title": "Kinship, Caste and Class — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Kinship, Caste and Class — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "his-thinkers-beliefs-buildings": {  # Ch 4 — Thinkers, Beliefs and Buildings
        "hindi": [
            {"title": "Thinkers, Beliefs and Buildings — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Thinkers, Beliefs and Buildings — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "his-eyes-of-travellers": {  # Ch 5 — Through the Eyes of Travellers
        "hindi": [
            {"title": "Through the Eyes of Travellers — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Through the Eyes of Travellers — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "his-bhakti-sufi": {  # Ch 6 — Bhakti-Sufi Traditions
        "hindi": [
            {"title": "Bhakti-Sufi Traditions — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Bhakti-Sufi Traditions — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },

    # ---------- Class 12 Political Science (Politics in India Since Independence) ----------
    "pol-nation-building": {  # Ch 1 — Challenges of Nation Building
        "hindi": [
            {"title": "Challenges of Nation Building — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Challenges of Nation Building — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-one-party-dominance": {  # Ch 2 — Era of One-Party Dominance
        "hindi": [
            {"title": "Era of One-Party Dominance — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Era of One-Party Dominance — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-planned-development": {  # Ch 3 — Politics of Planned Development
        "hindi": [
            {"title": "Politics of Planned Development — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Politics of Planned Development — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-external-relations": {  # Ch 4 — India's External Relations
        "hindi": [
            {"title": "India's External Relations — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "India's External Relations — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-congress-system": {  # Ch 5 — Challenges to and Restoration of the Congress System
        "hindi": [
            {"title": "Challenges to and Restoration of the Congress System — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Challenges to and Restoration of the Congress System — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-democratic-order-crisis": {  # Ch 6 — The Crisis of Democratic Order
        "hindi": [
            {"title": "The Crisis of Democratic Order — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "The Crisis of Democratic Order — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-popular-movements": {  # Ch 7 — Rise of Popular Movements
        "hindi": [
            {"title": "Rise of Popular Movements — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Rise of Popular Movements — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-regional-aspirations": {  # Ch 8 — Regional Aspirations
        "hindi": [
            {"title": "Regional Aspirations — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Regional Aspirations — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "pol-recent-developments": {  # Ch 9 — Recent Developments in Indian Politics
        "hindi": [
            {"title": "Recent Developments in Indian Politics — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Recent Developments in Indian Politics — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },

    # ---------- Class 12 Economics ----------
    "ch3-Indian-eco-1950-1990": {
        "hindi": [
            {"title": "Indian Economy 1950–1990 — Full Lecture", "youtube_id": "VdJZxSR57xY"},
        ],
    },
    "ch3-Economics-reforms": {
        "hindi": [
            {"title": "Economic Reforms 1991 — Full Lecture", "youtube_id": "9Ca1KSI7xao"},
        ],
    },

    # Add more chapters here, same shape.
}
