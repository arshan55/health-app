from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Profile Data
    age = Column(Integer)
    gender = Column(String)
    height = Column(Float) # in cm
    weight = Column(Float) # in kg
    fitness_goal = Column(String) # weight_loss, maintain, muscle_gain
    dietary_preference = Column(String) # veg, vegan, keto, etc.
    
    # Health Stats
    bmi = Column(Float)
    tdee = Column(Float) # Daily calorie reqs

    food_logs = relationship("FoodLog", back_populates="user")
    created_at = Column(DateTime, default=datetime.utcnow)

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    food_name = Column(String, nullable=False)
    calories = Column(Float, nullable=False)
    protein = Column(Float)
    carbs = Column(Float)
    fats = Column(Float)
    
    portion_size = Column(String) # e.g., "1 bowl", "100g"
    logged_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="food_logs")
