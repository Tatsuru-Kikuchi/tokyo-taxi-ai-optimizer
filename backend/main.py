"""
Tokyo Taxi AI Optimizer - Main FastAPI Application
Integrates MCP-taxi research, MCP-traffic data, and weather APIs
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
    
    yield
    
    logger.info("🚕 Tokyo Taxi AI Optimizer shutting down...")

# Create FastAPI application
app = FastAPI(
    title="Tokyo Taxi AI Optimizer",
    description="Integrated Weather + Traffic Intelligence for Taxi Optimization - University of Tokyo Research",
    version="1.0.0",
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
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint with comprehensive system information"""
    return {
        "message": "Tokyo Taxi AI Optimizer",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "research_backing": {
            "institution": "University of Tokyo",
            "faculty": "Faculty of Economics", 
            "researcher": "Tatsuru Kikuchi",
            "key_findings": {
                "productivity_improvement": "30.2%",
                "rain_demand_correlation": 0.847,
                "wait_time_reduction": "38.2%",
                "utilization_increase": "27.7%"
            }
        },
        "integrations": [
            "MCP-taxi research algorithms",
            "MCP-traffic ODPT data",
            "JMA weather intelligence",
            "Real-time AI optimization"
        ],
        "endpoints": {
            "weather": "/api/v1/weather",
            "hotspots": "/api/v1/hotspots",
            "recommendations": "/api/v1/recommendations/{user_type}",
            "research": "/api/v1/research/summary",
            "health": "/api/v1/system/health",
            "performance": "/api/v1/stats/performance",
            "documentation": "/docs"
        },
        "features": [
            "Weather-aware positioning recommendations",
            "Real-time demand hotspot analysis", 
            "AI vs traditional performance comparison",
            "Multi-modal transportation optimization",
            "Research-validated algorithms"
        ]
    }

@app.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "research_status": "University of Tokyo algorithms active"
    }

# Legacy demo endpoints for backward compatibility
@app.get("/api/v1/demo/weather")
async def demo_weather():
    """Demo weather endpoint - redirects to production endpoint"""
    return {
        "message": "This is a demo endpoint. Use /api/v1/weather for production data.",
        "redirect": "/api/v1/weather",
        "demo_data": {
            "temperature": 22.5,
            "humidity": 65,
            "precipitation": 0.0,
            "is_raining": False,
            "forecast_3h": {"rain_probability": 25}
        }
    }

@app.get("/api/v1/demo/hotspots")
async def demo_hotspots():
    """Demo hotspots endpoint - redirects to production endpoint"""
    return {
        "message": "This is a demo endpoint. Use /api/v1/hotspots for production data.",
        "redirect": "/api/v1/hotspots",
        "demo_data": {
            "hotspots": [
                {
                    "name": "Ginza",
                    "ai_revenue_per_min": 68.1,
                    "traditional_revenue_per_min": 52.3,
                    "improvement": 30.2,
                    "demand_level": "High",
                    "research_note": "University of Tokyo validated improvement"
                },
                {
                    "name": "Shibuya", 
                    "ai_revenue_per_min": 64.8,
                    "traditional_revenue_per_min": 49.7,
                    "improvement": 30.4,
                    "demand_level": "High",
                    "research_note": "Weather correlation: 0.847"
                }
            ]
        }
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
