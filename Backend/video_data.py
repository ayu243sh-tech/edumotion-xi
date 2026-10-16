# video_data.py
# Lecture videos per chapter. The key is the chapter id.
# To find a chapter id: open that chapter on the site; the URL ends with /chapter/<id>.
# youtube_id = the part after v= in youtube.com/watch?v=XXXXXXXXXXX
# Make the videos "Unlisted" on YouTube with embedding allowed.
# Entries whose id still starts with REPLACE are ignored, so nothing broken shows up.

VIDEO_LECTURES = {
    "ch11-his-harappan": {
        "hindi": [
            {"title": "Harappan Civilization — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
        "english": [
            {"title": "Harappan Civilization — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "ch3-Indian-eco-1950-1990": {
        "hindi": [
            {"title": "Indian Economy 1950–1990 — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    "ch3-Economics-reforms": {
        "hindi": [
            {"title": "Economic Reforms 1991 — Full Lecture", "youtube_id": "REPLACE_WITH_VIDEO_ID"},
        ],
    },
    # Add more chapters here, same shape.
    # For a long lecture, add several parts to the list:
    #   {"title": "Part 1 — Town Planning", "youtube_id": "..."},
    #   {"title": "Part 2 — Trade and Decline", "youtube_id": "..."},
}
