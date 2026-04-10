from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserProfileUpdate(BaseModel):
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[str] = None
    height: Optional[float] = Field(None, description="Height in cm")
    weight: Optional[float] = Field(None, description="Weight in kg")
    fitness_goal: Optional[str] = None
    dietary_preference: Optional[str] = None

class UserResponse(UserBase):
    id: int
    age: Optional[int]
    gender: Optional[str]
    height: Optional[float]
    weight: Optional[float]
    fitness_goal: Optional[str]
    dietary_preference: Optional[str]
    bmi: Optional[float]
    tdee: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class FoodLogBase(BaseModel):
    food_name: str
    calories: float
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fats: Optional[float] = None
    portion_size: Optional[str] = None

class FoodLogCreate(FoodLogBase):
    pass

class FoodLogResponse(FoodLogBase):
    id: int
    logged_at: datetime

    class Config:
        from_attributes = True
