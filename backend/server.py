from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from typing import List, Optional
import uuid

# Import models and services
from models import (
    Trend, TrendResponse, GeneratedContent, ContentGenerationRequest, 
    ContentGenerationResponse, ApiResponse, User, UserCreate, ContentTemplate
)
from services.trend_service import TrendService
from services.ai_service import AIService
from database import connect_db, close_db

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="TrendScript AI API", version="1.0.0")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
trend_service = TrendService()
ai_service = AIService()

# Content templates data
CONTENT_TEMPLATES = [
    {
        "id": "youtube-explainer",
        "name": "YouTube Explainer",
        "description": "10-15 minute deep dive video",
        "structure": ["Hook", "Problem Setup", "Main Content", "Examples", "Call to Action"],
        "estimatedLength": "12-15 minutes",
        "icon": "📺"
    },
    {
        "id": "blog-post",
        "name": "Blog Post Deep Dive",
        "description": "Comprehensive written analysis",
        "structure": ["Compelling Headline", "Introduction", "Main Points", "Case Studies", "Conclusion"],
        "estimatedLength": "1500-2000 words",
        "icon": "📝"
    },
    {
        "id": "social-thread",
        "name": "Social Media Thread",
        "description": "Twitter/LinkedIn thread format",
        "structure": ["Hook Tweet", "Problem Statement", "Key Points", "Examples", "CTA"],
        "estimatedLength": "8-12 tweets",
        "icon": "🧵"
    },
    {
        "id": "podcast-guide",
        "name": "Podcast Discussion Guide",
        "description": "Structured talking points",
        "structure": ["Opening Hook", "Key Discussion Points", "Questions", "Takeaways"],
        "estimatedLength": "20-30 minutes",
        "icon": "🎙️"
    },
    {
        "id": "short-form",
        "name": "Short-Form Video",
        "description": "TikTok/Instagram Reels",
        "structure": ["Attention Grabber", "Quick Value", "Visual Hook", "CTA"],
        "estimatedLength": "30-60 seconds",
        "icon": "📱"
    }
]

# Helper function to get current user (simplified for MVP)
async def get_current_user():
    """Get current user - simplified for MVP, returns anonymous user"""
    return {"id": "anonymous_user", "email": "user@example.com", "name": "Anonymous User"}

# API Routes

@api_router.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "TrendScript AI API is running", "version": "1.0.0"}

@api_router.get("/trends", response_model=ApiResponse)
async def get_trends(
    category: Optional[str] = Query(None, description="Filter by category"),
    platform: Optional[str] = Query(None, description="Filter by platform"),
    search: Optional[str] = Query(None, description="Search query"),
    limit: int = Query(20, description="Number of trends to return"),
    page: int = Query(1, description="Page number")
):
    """Get trending topics with filters"""
    try:
        skip = (page - 1) * limit
        
        if search:
            trends = await trend_service.search_trends(
                query=search,
                category=category,
                platform=platform,
                limit=limit
            )
        else:
            trends = await trend_service.get_trending_topics(
                category=category,
                platform=platform,
                limit=limit
            )
        
        # Convert to dict for response
        trends_data = [trend.dict() for trend in trends]
        
        return ApiResponse(
            success=True,
            data={
                "trends": trends_data,
                "total": len(trends_data),
                "page": page,
                "limit": limit
            },
            message="Trends retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting trends: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving trends: {str(e)}")

@api_router.get("/trends/{trend_id}", response_model=ApiResponse)
async def get_trend(trend_id: str):
    """Get a specific trend by ID"""
    try:
        trend = await trend_service.get_trend_by_id(trend_id)
        
        if not trend:
            raise HTTPException(status_code=404, detail="Trend not found")
        
        return ApiResponse(
            success=True,
            data=trend.dict(),
            message="Trend retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting trend: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving trend: {str(e)}")

@api_router.post("/generate-content", response_model=ApiResponse)
async def generate_content(
    request: ContentGenerationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate AI-powered content script"""
    try:
        # Get the trend
        trend = await trend_service.get_trend_by_id(request.trend_id)
        if not trend:
            raise HTTPException(status_code=404, detail="Trend not found")
        
        # Generate content using AI
        generated_content = await ai_service.generate_content_script(
            trend=trend,
            request=request,
            user_id=current_user["id"]
        )
        
        # Save to database (optional for MVP)
        # await database.save_generated_content(generated_content.dict())
        
        return ApiResponse(
            success=True,
            data={
                "id": generated_content.id,
                "content": generated_content.dict()
            },
            message="Content generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@api_router.get("/content-templates", response_model=ApiResponse)
async def get_content_templates():
    """Get available content templates"""
    try:
        return ApiResponse(
            success=True,
            data={"templates": CONTENT_TEMPLATES},
            message="Content templates retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Error getting content templates: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving content templates: {str(e)}")

@api_router.get("/tone-options", response_model=ApiResponse)
async def get_tone_options():
    """Get available tone options"""
    try:
        tone_options = [
            {"id": "professional", "name": "Professional", "description": "Authoritative and business-focused"},
            {"id": "casual", "name": "Casual", "description": "Friendly and conversational"},
            {"id": "humorous", "name": "Humorous", "description": "Light-hearted with jokes and wit"},
            {"id": "educational", "name": "Educational", "description": "Teaching-focused and informative"},
            {"id": "controversial", "name": "Controversial", "description": "Provocative and debate-inducing"},
            {"id": "inspirational", "name": "Inspirational", "description": "Motivational and uplifting"}
        ]
        
        return ApiResponse(
            success=True,
            data={"tones": tone_options},
            message="Tone options retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Error getting tone options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving tone options: {str(e)}")

@api_router.get("/user/content-history", response_model=ApiResponse)
async def get_user_content_history(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(20, description="Number of items to return")
):
    """Get user's content generation history"""
    try:
        # For MVP, return empty history since we're not persisting to DB yet
        return ApiResponse(
            success=True,
            data={"content_history": [], "total": 0},
            message="Content history retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Error getting content history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving content history: {str(e)}")

@api_router.get("/stats", response_model=ApiResponse)
async def get_platform_stats():
    """Get platform statistics"""
    try:
        # Get current trends for stats
        trends = await trend_service.get_trending_topics(limit=100)
        
        total_trends = len(trends)
        high_potential = len([t for t in trends if t.contentScore >= 85])
        avg_score = sum(t.contentScore for t in trends) / len(trends) if trends else 0
        platforms = len(set(t.platform for t in trends))
        
        stats = {
            "totalTrends": total_trends,
            "highPotential": high_potential,
            "averageScore": round(avg_score),
            "platforms": platforms
        }
        
        return ApiResponse(
            success=True,
            data=stats,
            message="Platform statistics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Error getting platform stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving platform statistics: {str(e)}")

# Include the API router
app.include_router(api_router)

# Application lifecycle events
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    try:
        await connect_db()
        logger.info("TrendScript AI API started successfully")
    except Exception as e:
        logger.error(f"Error starting application: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    try:
        await close_db()
        logger.info("TrendScript AI API shut down successfully")
    except Exception as e:
        logger.error(f"Error shutting down application: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)