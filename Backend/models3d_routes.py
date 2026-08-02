# models3d_routes.py
from fastapi import APIRouter, HTTPException
from typing import Optional

from models3d_data import MODELS_3D

router = APIRouter(prefix="/models3d", tags=["models3d"])


@router.get("")
async def list_models(subject: Optional[str] = None, class_level: Optional[str] = None):
    models = list(MODELS_3D.values())
    if subject:
        models = [m for m in models if m["subject"].lower() == subject.lower()]
    if class_level:
        models = [m for m in models if m["class_level"] == class_level]
    # Don't send full hotspot list in the list view
    return [{k: v for k, v in m.items() if k != "hotspots"} for m in models]


@router.get("/{model_id}")
async def get_model(model_id: str):
    model = MODELS_3D.get(model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model
