from fastapi import APIRouter, UploadFile, File
from services.ai_service import AIService
from typing import Dict

router = APIRouter()
ai_service = AIService()

@router.post("/recognize")
async def recognize_food(file: UploadFile = File(...)):
    """AI Food Recognition. Problem alignment: seamless tracking."""
    contents = await file.read()
    analysis = await ai_service.analyze_food_image(contents)
    return analysis
