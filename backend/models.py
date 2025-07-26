from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    preferences: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    name: str
    preferences: Optional[Dict[str, Any]] = None

# Trend Models
class PlatformEngagement(BaseModel):
    posts: int = 0
    mentions: int = 0
    sentiment: float = 0.0
    videos: int = 0
    totalViews: int = 0
    avgViews: int = 0
    upvotes: int = 0
    comments: int = 0
    engagement: float = 0.0

class TrendEngagement(BaseModel):
    twitter: PlatformEngagement = Field(default_factory=PlatformEngagement)
    youtube: PlatformEngagement = Field(default_factory=PlatformEngagement)
    reddit: PlatformEngagement = Field(default_factory=PlatformEngagement)
    tiktok: PlatformEngagement = Field(default_factory=PlatformEngagement)

class Trend(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    topic: str
    platform: str
    hashtags: List[str] = Field(default_factory=list)
    contentScore: int
    trendVelocity: str
    engagement: TrendEngagement = Field(default_factory=TrendEngagement)
    keyInsights: List[str] = Field(default_factory=list)
    suggestedAngles: List[str] = Field(default_factory=list)
    timeframe: str
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Content Generation Models
class ContentSection(BaseModel):
    section: str
    duration: str
    content: List[str]

class GeneratedContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    trend_id: str
    template_id: str
    tone: str
    custom_prompt: Optional[str] = None
    title: str
    hook: str
    outline: List[ContentSection]
    keyPoints: List[str]
    seoKeywords: List[str]
    hashtags: List[str]
    estimatedViews: str
    difficulty: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentGenerationRequest(BaseModel):
    trend_id: str
    template_id: str
    tone: str
    custom_prompt: Optional[str] = None
    session_id: Optional[str] = None

# Content Template Models
class ContentTemplate(BaseModel):
    id: str
    name: str
    description: str
    structure: List[str]
    estimatedLength: str
    icon: str

# Session Models
class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Response Models
class TrendResponse(BaseModel):
    trends: List[Trend]
    total: int
    page: int
    limit: int

class ContentGenerationResponse(BaseModel):
    id: str
    content: GeneratedContent
    status: str
    message: str

# API Response Models
class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: str = ""
    error: Optional[str] = None