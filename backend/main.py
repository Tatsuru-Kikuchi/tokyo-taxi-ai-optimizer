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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("🚕 Tokyo Taxi AI Optimizer starting up...")
    
    # Initialize services here
    # await initialize_services()
    
    yield
    
    # Cleanup on shutdown
    logger.info("🚕 Tokyo Taxi AI Optimizer shutting down...")

# Create FastAPI application
app = FastAPI(
    title="Tokyo Taxi AI Optimizer",
    description="Integrated Weather + Traffic Intelligence for Taxi Optimization",
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

# Include API routes (will be created in next session)
# from api.routes import router
# app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Tokyo Taxi AI Optimizer",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "integrations": ["MCP-taxi research", "MCP-traffic data", "Weather APIs"],
        "research_backing": "University of Tokyo - 30.2% productivity improvement"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "running",
            "database": "not_implemented",
            "redis": "not_implemented",
            "weather_api": "not_implemented",
            "traffic_api": "not_implemented"
        }
    }

# Temporary endpoints for testing (will be moved to proper routes)
@app.get("/api/v1/demo/weather")
async def demo_weather():
    """Demo weather endpoint"""
    return {
        "temperature": 22.5,
        "humidity": 65,
        "precipitation": 0.0,
        "is_raining": False,
        "forecast_3h": {"rain_probability": 25}
    }

@app.get("/api/v1/demo/hotspots")
async def demo_hotspots():
    """Demo hotspots endpoint"""
    return {
        "hotspots": [
            {
                "name": "Ginza",
                "ai_revenue_per_min": 68.1,
                "traditional_revenue_per_min": 52.3,
                "improvement": 30.2,
                "demand_level": "High"
            },
            {
                "name": "Shibuya", 
                "ai_revenue_per_min": 64.8,
                "traditional_revenue_per_min": 49.7,
                "improvement": 30.4,
                "demand_level": "High"
            }
        ]
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
