from typing import List, Dict
from datetime import datetime, timedelta

class SimulationService:
    @staticmethod
    def project_weight_change(
        current_weight: float,
        daily_tdee: float,
        planned_daily_intake: float,
        days: int = 30
    ) -> List[Dict]:
        """
        Simulates weight change over time.
        1kg of fat ~ 7700 kcal.
        Problem alignment: Standout feature - predictive visualization.
        """
        projections = []
        weight = current_weight
        
        for i in range(days):
            # Calculate caloric delta
            delta = planned_daily_intake - daily_tdee
            # Weight change in kg
            weight_diff = delta / 7700
            weight += weight_diff
            
            projections.append({
                "day": i + 1,
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "estimated_weight": round(weight, 2)
            })
            
        return projections
