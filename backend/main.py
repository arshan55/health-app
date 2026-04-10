import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from utils.logger import setup_logger

# Initialize logger
setup_logger()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic (e.g., DB connection, Cache initialization)
    logger.info("Starting up NutriGuide AI Backend...")
    yield
    # Shutdown logic
    logger.info("Shutting down NutriGuide AI Backend...")

app = FastAPI(
    title="NutriGuide AI",
    description="Production-grade AI Health Assistant Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Security Posture: Tighten CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows public access. In strict production, map to frontend domain
    allow_credentials=False, # Must be false when using wildcard origins
    allow_methods=["GET", "POST", "OPTIONS"], # Restricted explicit methods
    allow_headers=["Authorization", "Content-Type"], # Restricted explicit headers
)

@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {"status": "ok", "message": "NutriGuide AI Backend is running"}

from api.v1 import nutrition, ai

# Include routers
app.include_router(nutrition.router, prefix="/api/v1/nutrition", tags=["Nutrition"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
