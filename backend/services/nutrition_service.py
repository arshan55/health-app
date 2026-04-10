class NutritionService:
    @staticmethod
    def calculate_bmi(weight: float, height: float) -> float:
        """Calculate BMI (Weight in kg / Height in meters squared)."""
        if height <= 0:
            return 0
        height_m = height / 100
        return round(weight / (height_m ** 2), 2)

    @staticmethod
    def calculate_tdee(weight: float, height: float, age: int, gender: str, fitness_goal: str) -> float:
        """
        Calculate Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor Equation.
        Problem alignment: Provides the 'North Star' for user nutrition tracking.
        """
        # BMR Calculation
        if gender.lower() == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        # Activity Multiplier (assuming moderate activity for baseline)
        tdee_base = bmr * 1.375
        
        # Adjustment based on goal
        if fitness_goal == "weight_loss":
            return round(tdee_base - 500, 0) # 500 cal deficit
        elif fitness_goal == "muscle_gain":
            return round(tdee_base + 300, 0) # 300 cal surplus
        return round(tdee_base, 0)
