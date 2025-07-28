"""
MCP Research Integration Module
Integrates University of Tokyo research findings into the optimization system
"""

import numpy as np
from typing import Dict, List, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ResearchParameters:
    """Research parameters from MCP-taxi study"""
    # Core correlation from your research
    rain_demand_correlation: float = 0.847
    ai_improvement_factor: float = 1.302  # 30.2% improvement
    
    # Weather impact multipliers (from your research)
    heavy_rain_multiplier: float = 3.1
    light_rain_multiplier: float = 2.4
    drizzle_multiplier: float = 1.8
    
    # Time-based patterns
    rush_hour_multiplier: float = 1.6
    weekend_multiplier: float = 1.2
    
    # AI performance metrics (from your research)
    ai_wait_time_reduction: float = 0.382  # 38.2% reduction
    ai_utilization_improvement: float = 0.277  # 27.7% improvement

class MCPResearchIntegration:
    """
    Integrates MCP-taxi and MCP-traffic research into production system
    Based on University of Tokyo research showing 30.2% productivity improvements
    """
    
    def __init__(self):
        self.params = ResearchParameters()
        self.tokyo_districts = [
            {"name": "Ginza", "base_revenue": 62.5, "lat": 35.6762, "lng": 139.7653},
            {"name": "Tokyo Station", "base_revenue": 59.8, "lat": 35.6812, "lng": 139.7671},
            {"name": "Shibuya", "base_revenue": 58.2, "lat": 35.6598, "lng": 139.7006},
            {"name": "Shinjuku", "base_revenue": 55.8, "lat": 35.6896, "lng": 139.6917},
            {"name": "Roppongi", "base_revenue": 54.2, "lat": 35.6627, "lng": 139.7314}
        ]
    
    def calculate_weather_demand_multiplier(self, weather_data: Dict[str, Any]) -> float:
        """
        Calculate demand multiplier based on weather conditions
        Based on 0.847 correlation coefficient from research
        """
        multiplier = 1.0
        
        if weather_data.get("is_raining", False):
            rain_intensity = weather_data.get("rain_intensity", 0)
            
            if rain_intensity > 5:
                multiplier = self.params.heavy_rain_multiplier
            elif rain_intensity > 1:
                multiplier = self.params.light_rain_multiplier
            else:
                multiplier = self.params.drizzle_multiplier
        
        # Temperature effects
        temperature = weather_data.get("temperature", 22)
        if temperature < 5 or temperature > 35:
            multiplier *= 1.4
            
        return multiplier
    
    def calculate_time_multiplier(self, hour: int, day_of_week: int) -> float:
        """Calculate time-based demand multiplier"""
        multiplier = 1.0
        
        # Rush hour effects
        if hour in [7, 8, 9, 17, 18, 19]:
            multiplier *= self.params.rush_hour_multiplier
        
        # Weekend effects
        if day_of_week >= 5:  # Saturday, Sunday
            multiplier *= self.params.weekend_multiplier
            
        return multiplier
    
    def calculate_traffic_disruption_boost(self, traffic_data: Dict[str, Any]) -> float:
        """
        Calculate demand boost from traffic disruptions
        Integration with MCP-traffic data
        """
        boost = 1.0
        
        disruptions = traffic_data.get("disruptions", [])
        for disruption in disruptions:
            delay_minutes = disruption.get("estimated_delay", 0)
            if delay_minutes > 0:
                boost *= 1.0 + (delay_minutes / 100)  # Each minute adds 1% demand
        
        return boost
    
    def predict_ai_vs_traditional_performance(self, base_demand: float) -> Dict[str, float]:
        """
        Predict AI-enhanced vs traditional performance
        Based on research showing 30.2% improvement
        """
        ai_revenue = base_demand * self.params.ai_improvement_factor
        traditional_revenue = base_demand
        
        return {
            "ai_revenue_per_min": round(ai_revenue, 2),
            "traditional_revenue_per_min": round(traditional_revenue, 2),
            "improvement_percentage": round(((ai_revenue - traditional_revenue) / traditional_revenue) * 100, 1),
            "ai_wait_time": round(4.2 / self.params.ai_improvement_factor, 1),  # Inverse relationship
            "traditional_wait_time": 6.8,
            "ai_utilization_rate": round(83 * (1 + self.params.ai_utilization_improvement / 100), 1),
            "traditional_utilization_rate": 65
        }
    
    def generate_demand_predictions(self, weather_data: Dict[str, Any], 
                                  traffic_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate demand predictions for all Tokyo districts
        Integrates all research findings
        """
        current_hour = datetime.now().hour
        current_day = datetime.now().weekday()
        
        predictions = []
        
        for district in self.tokyo_districts:
            # Calculate multipliers
            weather_multiplier = self.calculate_weather_demand_multiplier(weather_data)
            time_multiplier = self.calculate_time_multiplier(current_hour, current_day)
            traffic_multiplier = self.calculate_traffic_disruption_boost(traffic_data)
            
            # Base demand calculation
            base_demand = district["base_revenue"] * weather_multiplier * time_multiplier * traffic_multiplier
            
            # AI vs traditional comparison
            performance = self.predict_ai_vs_traditional_performance(base_demand)
            
            # Create prediction
            prediction = {
                "name": district["name"],
                "latitude": district["lat"],
                "longitude": district["lng"],
                "base_revenue": district["base_revenue"],
                "weather_multiplier": round(weather_multiplier, 2),
                "time_multiplier": round(time_multiplier, 2),
                "traffic_multiplier": round(traffic_multiplier, 2),
                "total_demand_score": round(weather_multiplier * time_multiplier * traffic_multiplier * 100),
                **performance,
                "confidence_score": self.calculate_confidence_score(weather_data, traffic_data),
                "research_backing": "University of Tokyo MCP-taxi study"
            }
            
            predictions.append(prediction)
        
        # Sort by AI revenue potential
        predictions.sort(key=lambda x: x["ai_revenue_per_min"], reverse=True)
        return predictions
    
    def calculate_confidence_score(self, weather_data: Dict[str, Any], 
                                 traffic_data: Dict[str, Any]) -> float:
        """Calculate prediction confidence based on data quality"""
        base_confidence = 85.0
        
        # Higher confidence with better weather data
        if weather_data.get("is_raining"):
            base_confidence += 5.0  # Rain correlation is well-established
        
        # Higher confidence with traffic disruption data
        if traffic_data.get("disruptions"):
            base_confidence += 3.0  # Disruption effects are measurable
            
        return min(95.0, max(70.0, base_confidence))
    
    def get_research_summary(self) -> Dict[str, Any]:
        """Get summary of research parameters and findings"""
        return {
            "research_institution": "University of Tokyo Faculty of Economics",
            "principal_investigator": "Tatsuru Kikuchi",
            "key_findings": {
                "rain_demand_correlation": self.params.rain_demand_correlation,
                "ai_improvement_percentage": (self.params.ai_improvement_factor - 1) * 100,
                "wait_time_reduction_percentage": self.params.ai_wait_time_reduction * 100,
                "utilization_improvement_percentage": self.params.ai_utilization_improvement * 100
            },
            "methodology": "30-day simulation with 10,000 taxi trips",
            "validation": "Statistical significance testing (p < 0.05)",
            "applications": [
                "Weather-aware taxi positioning",
                "Traffic disruption opportunity detection", 
                "AI-enhanced earnings optimization",
                "Multi-modal transportation integration"
            ]
        }

# Global instance for use across the application
research_integration = MCPResearchIntegration()
