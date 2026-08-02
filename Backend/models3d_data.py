# models3d_data.py
# 3D model metadata — labeled, rotatable anatomy/science models.
# Model files themselves are hosted on Supabase Storage (not here).

MODELS_3D = {
    "frog-circulatory": {
        "id": "frog-circulatory",
        "title": "Circulatory and Respiratory System of Frog",
        "subject": "Biology",
        "class_level": "11",
        "model_url": "https://REPLACE_WITH_SUPABASE_STORAGE_URL/frog-circulatory.glb",
        "hotspots": [
            {"name": "Frog Heart", "position": "0 0.3 0", "normal": "0 1 0"},
            {"name": "Right Atricle", "position": "0.05 0.25 0.1", "normal": "1 0 0"},
            {"name": "Left Atrium", "position": "-0.05 0.25 0.1", "normal": "-1 0 0"},
            {"name": "Sinus Venosus", "position": "0 0.2 -0.05", "normal": "0 0 1"},
            {"name": "Pulmonary Arch", "position": "0.03 0.15 0.05", "normal": "0 -1 0"},
            {"name": "Truncus Arteriosus", "position": "0.02 0.28 0.03", "normal": "0 1 0"},
        ],
    },
    # Add more models here, same shape — one entry per model.
}
