import pytest
from services.nutrition_service import NutritionService
from utils.auth import create_access_token, verify_password, get_password_hash

def test_bmi_calculation():
    service = NutritionService()
    # 70kg, 175cm -> 22.86
    res = service.calculate_bmi(70, 175)
    assert res == 22.86
    assert service.calculate_bmi(70, 0) == 0

def test_tdee_calculation():
    service = NutritionService()
    # Male, 70kg, 175cm, 25yr, maintain -> ~1665 BMR -> ~2290 TDEE
    res = service.calculate_tdee(70, 175, 25, "male", "maintain")
    assert res > 2000
    
    # Weight loss should be lower
    res_loss = service.calculate_tdee(70, 175, 25, "male", "weight_loss")
    assert res_loss == res - 500

def test_auth_utils():
    password = "retro_password_123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_one", hashed) is False
    
    token = create_access_token({"sub": "test@example.com"})
    assert isinstance(token, str)
