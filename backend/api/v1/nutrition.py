from fastapi import APIRouter, Depends, HTTPException
from schemas.user_nutrition import FoodLogCreate, FoodLogResponse
from services.nutrition_service import NutritionService
from services.simulation_service import SimulationService
from typing import List

router = APIRouter()

@router.post("/log", response_model=FoodLogResponse)
async def log_food(log_in: FoodLogCreate):
    """Logs a food item. Problem alignment: consistent tracking."""
    # TODO: Save to DB
    return {**log_in.model_dump(), "id": 101, "logged_at": "2026-04-10T14:10:00"}

@router.get("/projections")
async def get_weight_projections(weight: float, tdee: float, intake: float):
    """Standout feature endpoint: predictive weight change."""
    return SimulationService.project_weight_change(weight, tdee, intake)
