from fastapi import APIRouter, UploadFile, File
from services.ai_service import AIService
from pydantic import BaseModel
from typing import Dict

router = APIRouter()
ai_service = AIService()

class ChatRequest(BaseModel):
    query: str
    history: list = []

@router.post("/chat")
async def chat_with_assistant(body: ChatRequest):
    """Conversational health assistant."""
    response = await ai_service.get_health_advice(body.query, body.history)
    return {"response": response}

@router.post("/recognize")
async def recognize_food(file: UploadFile = File(...)):
    """AI Food Recognition. Problem alignment: seamless tracking."""
    contents = await file.read()
    analysis = await ai_service.analyze_food_image(contents)
    return analysis
