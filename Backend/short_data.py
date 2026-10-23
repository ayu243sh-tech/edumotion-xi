# short_data.py
# Short vertical videos. Add new ones at the TOP so the newest show first.
# class_level: "9", "10", "11" or "12"
#
# For a YouTube Short, set youtube_id (the part after youtube.com/shorts/ in its link).
# Or host your own vertical MP4 (for example in Supabase Storage) and use video_url instead.
# Entries whose youtube_id still starts with REPLACE are ignored, so nothing broken shows up.

SHORTS = [
    {
        "id": "eco-gdp-vs-gnp",
        "class_level": "12",
        "subject": "Economics",
        "title": "GDP vs GNP in 60 seconds",
        "youtube_id": "REPLACE_WITH_VIDEO_ID",
    },
    {
        "id": "his-harappan-town-planning",
        "class_level": "12",
        "subject": "History",
        "title": "Harappan town planning — quick revision",
        "youtube_id": "REPLACE_WITH_VIDEO_ID",
    },
    # Example with your own MP4 instead of YouTube:
    # {
    #     "id": "sci-ohms-law",
    #     "class_level": "10",
    #     "subject": "Science",
    #     "title": "Ohm's law in one minute",
    #     "video_url": "https://your-supabase-url/storage/v1/object/public/shorts/ohms-law.mp4",
    # },
]
