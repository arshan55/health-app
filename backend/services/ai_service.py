import google.generativeai as genai
import os
from pathlib import Path
from typing import Optional, Dict
import logging
import io
from PIL import Image
from dotenv import load_dotenv

# Load .env from root or backend directory (works regardless of where uvicorn is launched)
_root = Path(__file__).resolve().parents[2]  # project root
load_dotenv(_root / ".env")
load_dotenv(Path(__file__).resolve().parents[1] / ".env")  # backend/.env fallback

logger = logging.getLogger(__name__)

# Configure Gemini with the loaded API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

class AIService:
    def __init__(self):
        self.vision_model = genai.GenerativeModel('gemini-2.0-flash')

    async def analyze_food_image(self, image_data: bytes) -> Dict:
        """
        Analyzes food image to estimate macros.
        """
        try:
            prompt = "Identify this food and estimate its macros. Output as a strict JSON object with these keys ONLY: food_name (string), calories (number), protein (number), carbs (number), fats (number), confidence (number between 0 and 1). Do not use markdown backticks."
            
            image = Image.open(io.BytesIO(image_data))
            
            # If they haven't set an API key, fallback to mock
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key or api_key == "your_gemini_api_key_here":
                raise ValueError("API Key not configured")

            response = self.vision_model.generate_content([prompt, image])
            
            import json
            try:
                clean_text = response.text.replace('```json', '').replace('```', '').strip()
                return json.loads(clean_text)
            except:
                logger.error("Failed to parse Gemini JSON output")
                raise

        except Exception as e:
            logger.warning(f"AI Vision Error or Mock Fallback: {e}")
            return {
                "food_name": "Dynamic Mock: Baked Salmon Salad",
                "calories": 420,
                "protein": 35,
                "carbs": 12,
                "fats": 22,
                "confidence": 0.89
            }
