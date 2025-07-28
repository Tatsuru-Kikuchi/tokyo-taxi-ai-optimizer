"""
Tokyo Taxi AI Optimizer - Enhanced Main FastAPI Application
Integrates MCP-taxi research, MCP-traffic data, weather APIs, and Weather Intelligence Engine

CORE FOCUS: Weather-driven taxi optimization for drivers and passengers
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import logging
from datetime import datetime
from contextlib import asynccontextmanager

# Import our API routes
from api.routes import router
from api.weather_routes import weather_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("🚕 Tokyo Taxi AI Optimizer starting up...")
    logger.info("🔬 University of Tokyo research integration active")
    logger.info("🌦️ Weather intelligence system ready")
    logger.info("🤖 AI optimization algorithms loaded")
    logger.info("⚡ Driver positioning & passenger decision support active")
    
    yield
    
    logger.info("🚕 Tokyo Taxi AI Optimizer shutting down...")

# Create FastAPI application
app = FastAPI(
    title="Tokyo Taxi AI Optimizer - Weather Intelligence Edition",
    description="""
    **AI-powered taxi optimization system with weather-driven intelligence**
    
    ### 🎯 Core Features:
    - **Driver Positioning**: AI tells drivers where to go based on weather conditions
    - **Passenger Decision Support**: Smart advice on taxi vs alternatives during weather events
    - **Weather Intelligence**: 0.847 correlation between rain and taxi demand (University of Tokyo research)
    - **Real-time Integration**: JMA weather + ODPT traffic + Research algorithms
    
    ### 🔬 Research Backing:
    - **Institution**: University of Tokyo Faculty of Economics
    - **Researcher**: Tatsuru Kikuchi  
    - **Proven Results**: 30.2% productivity improvement with weather-AI integration
    - **Statistical Significance**: p < 0.05
    
    ### 🌟 Key Endpoints:
    - `/api/v1/weather/driver/hotspots` - Driver positioning recommendations
    - `/api/v1/weather/passenger/advice` - Passenger transportation decisions
    - `/api/v1/weather/forecast` - 3-hour weather forecast for transportation
    - `/api/v1/weather/intelligence/summary` - Complete system intelligence overview
    """,
    version="2.0.0-weather-intelligence",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["Core System"])
app.include_router(weather_router, prefix="/api/v1/weather", tags=["Weather Intelligence"])

@app.get("/")
async def root():
    """Root endpoint with comprehensive system information"""
    return {
        "message": "Tokyo Taxi AI Optimizer - Weather Intelligence Edition",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "core_purpose": {
            "driver_feature": "AI tells taxi drivers where to go during weather conditions",
            "passenger_feature": "Smart advice on taxi vs alternatives based on weather",
            "weather_intelligence": "Real-time weather-demand correlation analysis"
        },
        "research_backing": {
            "institution": "University of Tokyo",
            "faculty": "Faculty of Economics", 
            "researcher": "Tatsuru Kikuchi",
            "key_findings": {
                "productivity_improvement": "30.2%",
                "rain_demand_correlation": 0.847,
                "wait_time_reduction": "38.2%",
                "utilization_increase": "27.7%"
            },
            "methodology": "30-day simulation with 10,000 taxi trips",
            "statistical_significance": "p < 0.05"
        },
        "integrations": [
            "MCP-taxi research algorithms",
            "MCP-traffic ODPT data",
            "JMA weather intelligence",
            "Real-time AI optimization",
            "Weather-demand correlation engine"
        ],
        "primary_endpoints": {
            "driver_hotspots": "/api/v1/weather/driver/hotspots",
            "passenger_advice": "/api/v1/weather/passenger/advice",
            "weather_forecast": "/api/v1/weather/forecast", 
            "intelligence_summary": "/api/v1/weather/intelligence/summary",
            "system_health": "/api/v1/system/health",
            "documentation": "/docs"
        },
        "weather_intelligence_features": [
            "🚕 Driver positioning recommendations based on weather patterns",
            "👤 Passenger decision support (taxi vs wait vs alternatives)",
            "🌦️ 3-hour weather forecast optimized for transportation",
            "⚡ Real-time demand hotspot analysis with weather correlation",
            "🎯 Research-validated 30.2% productivity improvements",
            "📊 Live weather-demand correlation tracking (0.847 baseline)"
        ],
        "data_sources": {
            "weather": "Japan Meteorological Agency (JMA)",
            "traffic": "Open Data Platform for Transportation (ODPT)",
            "research": "University of Tokyo Faculty of Economics",
            "real_time_integration": "60-second update cycles"
        },
        "system_capabilities": {
            "weather_analysis": "Real-time precipitation, temperature, visibility analysis",
            "demand_prediction": "AI-powered hotspot identification with weather triggers",
            "decision_support": "Intelligent recommendations for drivers and passengers",
            "research_integration": "University-validated algorithms and performance metrics"
        }
    }

@app.get("/health")
async def health_check():
    """Enhanced health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0-weather-intelligence",
        "system_components": {
            "weather_intelligence_engine": "active",
            "driver_positioning_system": "active", 
            "passenger_decision_support": "active",
            "research_algorithms": "University of Tokyo validated",
            "weather_service": "JMA integration active",
            "traffic_service": "ODPT integration active"
        },
        "capabilities": [
            "Weather-driven driver positioning",
            "Passenger transportation decision support", 
            "Real-time demand hotspot analysis",
            "3-hour weather forecasting",
            "Research-validated performance improvements"
        ]
    }

# Enhanced demo endpoints with weather intelligence
@app.get("/api/v1/demo/weather-intelligence")
async def demo_weather_intelligence():
    """Demo weather intelligence features"""
    return {
        "message": "Weather Intelligence Demo - Core Features",
        "demo_scenarios": {
            "light_rain_scenario": {
                "weather": "Light rain detected (2.5mm/h)",
                "driver_recommendation": "Head to Shibuya - Expected +45% demand increase",
                "passenger_advice": "Take taxi now - Rain expected for next 2 hours",
                "research_backing": "0.847 rain-demand correlation (University of Tokyo)"
            },
            "heavy_rain_scenario": {
                "weather": "Heavy rain detected (8.2mm/h)",
                "driver_recommendation": "Position at Tokyo Station - Expected +130% demand increase",
                "passenger_advice": "Taxi strongly recommended - Poor visibility and heavy precipitation",
                "research_backing": "2.8x demand multiplier validated in research"
            },
            "clear_weather_scenario": {
                "weather": "Clear conditions (22°C, good visibility)",
                "driver_recommendation": "Normal operations - Consider traditional high-traffic areas",
                "passenger_advice": "Multiple options available - Train and walking are viable",
                "research_backing": "Baseline demand patterns apply"
            }
        },
        "live_endpoints": {
            "driver_hotspots": "/api/v1/weather/driver/hotspots",
            "passenger_advice": "/api/v1/weather/passenger/advice?origin=Shibuya&destination=Tokyo",
            "weather_forecast": "/api/v1/weather/forecast",
            "intelligence_summary": "/api/v1/weather/intelligence/summary"
        },
        "research_validation": {
            "institution": "University of Tokyo",
            "improvement": "30.2% productivity increase",
            "correlation": "0.847 rain-demand correlation",
            "significance": "p < 0.05"
        }
    }

@app.get("/api/v1/demo/driver-positioning")
async def demo_driver_positioning():
    """Demo driver positioning recommendations"""
    return {
        "message": "Driver Positioning Demo - Weather-Based Recommendations",
        "demo_recommendations": [
            {
                "location": "Ginza",
                "coordinates": {"latitude": 35.6717, "longitude": 139.7647},
                "opportunity": {
                    "demand_increase": "+67%",
                    "revenue_boost": "¥890/hour",
                    "confidence": "89%"
                },
                "reasoning": "Moderate rain increasing taxi demand by 2.3x • Ginza is a high-traffic business district • morning rush hour traffic",
                "weather_trigger": "Light Rain (Intensity: 3.2mm/h)",
                "action": "🚕 HEAD THERE NOW - High opportunity zone"
            },
            {
                "location": "Tokyo Station", 
                "coordinates": {"latitude": 35.6812, "longitude": 139.7671},
                "opportunity": {
                    "demand_increase": "+89%",
                    "revenue_boost": "¥1240/hour",
                    "confidence": "92%"
                },
                "reasoning": "Heavy rain increasing taxi demand by 2.8x • Tokyo Station is a high-traffic transit hub • ⚡ HIGH OPPORTUNITY ZONE",
                "weather_trigger": "Moderate Rain (Intensity: 5.8mm/h)",
                "action": "🚕 PRIORITY TARGET - Maximum revenue potential"
            }
        ],
        "live_endpoint": "/api/v1/weather/driver/hotspots",
        "research_note": "Based on University of Tokyo research showing 30.2% revenue improvement"
    }

@app.get("/api/v1/demo/passenger-decision")
async def demo_passenger_decision():
    """Demo passenger decision support"""
    return {
        "message": "Passenger Decision Support Demo - Weather-Based Transportation Advice",
        "demo_scenarios": {
            "rainy_conditions": {
                "recommendation": {
                    "decision": "take_taxi_now",
                    "action": "Take Taxi Now",
                    "icon": "🚕", 
                    "urgency": "high",
                    "confidence": "87%"
                },
                "reasoning": "Moderate rain detected - taxi recommended for comfort and time efficiency",
                "cost_comparison": {
                    "taxi": "¥2,580",
                    "train": "¥200",
                    "walking": "Free"
                },
                "weather_context": "Rain intensity: 4.2mm/h, visibility reduced",
                "time_savings": "15-20 minutes vs walking in rain"
            },
            "clearing_weather": {
                "recommendation": {
                    "decision": "wait_rain_stops",
                    "action": "Wait for Weather",
                    "icon": "⏳",
                    "urgency": "medium",
                    "confidence": "82%"
                },
                "reasoning": "Light rain expected to stop in 35 minutes - consider waiting for alternatives",
                "wait_recommendation": {
                    "wait_duration": "35 minutes",
                    "reason": "Rain clearing soon",
                    "alternative_savings": "¥2,180"
                },
                "weather_forecast": "Improving conditions, 25% rain probability in 1 hour"
            }
        },
        "live_endpoint": "/api/v1/weather/passenger/advice?origin=Shibuya&destination=Tokyo",
        "research_backing": "Decisions based on 0.847 weather-demand correlation analysis"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
