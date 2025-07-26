import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from models import Trend, TrendEngagement, PlatformEngagement
from .ai_service import AIService
import random

logger = logging.getLogger(__name__)

class TrendService:
    def __init__(self):
        self.ai_service = AIService()
    
    async def get_trending_topics(
        self, 
        category: Optional[str] = None,
        platform: Optional[str] = None,
        limit: int = 20
    ) -> List[Trend]:
        """Get trending topics - using mock data for now, can be enhanced with real APIs"""
        
        # Mock trending topics - in production, this would integrate with Twitter API, YouTube API, etc.
        mock_topics = [
            {
                "topic": "AI-Powered Code Reviews",
                "platform": "twitter",
                "category": "Technology",
                "base_score": 87
            },
            {
                "topic": "Micro-SaaS Success Stories", 
                "platform": "youtube",
                "category": "Business",
                "base_score": 92
            },
            {
                "topic": "Remote Work Productivity Hacks",
                "platform": "reddit", 
                "category": "Lifestyle",
                "base_score": 78
            },
            {
                "topic": "AI Image Generation Ethics",
                "platform": "tiktok",
                "category": "Technology", 
                "base_score": 95
            },
            {
                "topic": "Sustainable Fashion Trends 2025",
                "platform": "twitter",
                "category": "Lifestyle",
                "base_score": 83
            },
            {
                "topic": "Cryptocurrency Market Recovery",
                "platform": "youtube",
                "category": "Finance",
                "base_score": 88
            },
            {
                "topic": "Mental Health in Tech Industry",
                "platform": "reddit",
                "category": "Health",
                "base_score": 79
            },
            {
                "topic": "Plant-Based Protein Innovation",
                "platform": "tiktok",
                "category": "Food",
                "base_score": 81
            }
        ]
        
        trends = []
        
        for topic_data in mock_topics:
            # Filter as requested
            if category and topic_data["category"].lower() != category.lower():
                continue
            if platform and topic_data["platform"] != platform:
                continue
            
            # Generate enhanced trend data with AI analysis
            enhanced_data = await self._enhance_trend_with_ai(topic_data)
            trend = await self._create_trend_object(topic_data, enhanced_data)
            trends.append(trend)
        
        # Sort by content score and return limited results
        trends.sort(key=lambda x: x.contentScore, reverse=True)
        return trends[:limit]
    
    async def _enhance_trend_with_ai(self, topic_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance trend data with AI analysis"""
        
        try:
            # Create mock platform data for AI analysis
            platform_data = {
                "topic": topic_data["topic"],
                "platform": topic_data["platform"],
                "category": topic_data["category"]
            }
            
            # Get AI analysis
            ai_analysis = await self.ai_service.analyze_trend_potential(
                topic_data["topic"], 
                platform_data
            )
            
            return ai_analysis
            
        except Exception as e:
            logger.error(f"Error enhancing trend with AI: {str(e)}")
            # Return fallback data
            return {
                "contentScore": topic_data["base_score"],
                "trendVelocity": "Steady Growth",
                "keyInsights": [
                    f"Growing interest in {topic_data['topic']}",
                    f"Popular on {topic_data['platform']} platform",
                    "Good potential for content creation"
                ],
                "suggestedAngles": [
                    f"Beginner's guide to {topic_data['topic']}",
                    f"Latest trends in {topic_data['topic']}",
                    f"How {topic_data['topic']} affects you"
                ],
                "category": topic_data["category"]
            }
    
    async def _create_trend_object(self, topic_data: Dict[str, Any], enhanced_data: Dict[str, Any]) -> Trend:
        """Create a complete Trend object with mock engagement data"""
        
        # Generate realistic engagement metrics
        engagement = self._generate_engagement_metrics(topic_data["platform"], enhanced_data["contentScore"])
        
        # Generate hashtags
        hashtags = self._generate_hashtags(topic_data["topic"])
        
        # Generate timeframe
        timeframe = self._generate_timeframe()
        
        trend = Trend(
            topic=topic_data["topic"],
            platform=topic_data["platform"],
            hashtags=hashtags,
            contentScore=enhanced_data.get("contentScore", topic_data["base_score"]),
            trendVelocity=enhanced_data.get("trendVelocity", "Steady Growth"),
            engagement=engagement,
            keyInsights=enhanced_data.get("keyInsights", []),
            suggestedAngles=enhanced_data.get("suggestedAngles", []),
            timeframe=timeframe,
            category=enhanced_data.get("category", topic_data["category"])
        )
        
        return trend
    
    def _generate_engagement_metrics(self, primary_platform: str, content_score: int) -> TrendEngagement:
        """Generate realistic engagement metrics based on platform and score"""
        
        # Base multiplier based on content score
        multiplier = content_score / 100.0
        
        # Platform-specific engagement patterns
        base_metrics = {
            "twitter": {"mentions": 45000, "posts": 12500, "sentiment": 0.8},
            "youtube": {"videos": 234, "totalViews": 890000, "avgViews": 3800},
            "reddit": {"posts": 89, "upvotes": 15600, "comments": 2400},
            "tiktok": {"videos": 156, "totalViews": 456000, "engagement": 0.12}
        }
        
        engagement = TrendEngagement()
        
        # Twitter metrics
        twitter_base = base_metrics.get("twitter", {"mentions": 30000, "posts": 8000, "sentiment": 0.7})
        engagement.twitter = PlatformEngagement(
            mentions=int(twitter_base["mentions"] * multiplier * random.uniform(0.8, 1.2)),
            posts=int(twitter_base["posts"] * multiplier * random.uniform(0.8, 1.2)),
            sentiment=min(1.0, twitter_base["sentiment"] * random.uniform(0.9, 1.1))
        )
        
        # YouTube metrics
        youtube_base = base_metrics.get("youtube", {"videos": 200, "totalViews": 500000, "avgViews": 2500})
        engagement.youtube = PlatformEngagement(
            videos=int(youtube_base["videos"] * multiplier * random.uniform(0.7, 1.3)),
            totalViews=int(youtube_base["totalViews"] * multiplier * random.uniform(0.8, 1.5)),
            avgViews=int(youtube_base["avgViews"] * multiplier * random.uniform(0.9, 1.2))
        )
        
        # Reddit metrics
        reddit_base = base_metrics.get("reddit", {"posts": 60, "upvotes": 10000, "comments": 1500})
        engagement.reddit = PlatformEngagement(
            posts=int(reddit_base["posts"] * multiplier * random.uniform(0.8, 1.3)),
            upvotes=int(reddit_base["upvotes"] * multiplier * random.uniform(0.7, 1.4)),
            comments=int(reddit_base["comments"] * multiplier * random.uniform(0.8, 1.2))
        )
        
        # TikTok metrics
        tiktok_base = base_metrics.get("tiktok", {"videos": 100, "totalViews": 300000, "engagement": 0.1})
        engagement.tiktok = PlatformEngagement(
            videos=int(tiktok_base["videos"] * multiplier * random.uniform(0.8, 1.5)),
            totalViews=int(tiktok_base["totalViews"] * multiplier * random.uniform(0.9, 1.6)),
            engagement=min(0.2, tiktok_base["engagement"] * multiplier * random.uniform(0.8, 1.3))
        )
        
        return engagement
    
    def _generate_hashtags(self, topic: str) -> List[str]:
        """Generate relevant hashtags for a topic"""
        
        # Extract key terms from topic
        words = topic.lower().replace("-", " ").split()
        
        hashtags = []
        
        # Add topic-specific hashtags
        for word in words:
            if len(word) > 3:  # Skip short words
                hashtags.append(f"#{word.capitalize()}")
        
        # Add common trending hashtags based on topic content
        topic_lower = topic.lower()
        
        if "ai" in topic_lower or "artificial intelligence" in topic_lower:
            hashtags.extend(["#AI", "#ArtificialIntelligence", "#MachineLearning"])
        
        if "business" in topic_lower or "startup" in topic_lower or "saas" in topic_lower:
            hashtags.extend(["#Business", "#Startup", "#Entrepreneurship"])
        
        if "tech" in topic_lower or "code" in topic_lower or "programming" in topic_lower:
            hashtags.extend(["#Tech", "#Programming", "#Development"])
        
        if "health" in topic_lower or "wellness" in topic_lower:
            hashtags.extend(["#Health", "#Wellness", "#MentalHealth"])
        
        if "remote" in topic_lower or "work" in topic_lower:
            hashtags.extend(["#RemoteWork", "#Productivity", "#WorkFromHome"])
        
        # Remove duplicates and limit to 5
        unique_hashtags = list(dict.fromkeys(hashtags))[:5]
        
        return unique_hashtags
    
    def _generate_timeframe(self) -> str:
        """Generate a realistic timeframe for when the trend was detected"""
        
        timeframes = [
            "1h ago", "2h ago", "3h ago", "4h ago", "6h ago", 
            "8h ago", "12h ago", "1 day ago", "2 days ago"
        ]
        
        return random.choice(timeframes)
    
    async def get_trend_by_id(self, trend_id: str) -> Optional[Trend]:
        """Get a specific trend by ID"""
        
        # In a real application, this would query the database
        # For now, we'll generate a trend with the requested ID
        try:
            trends = await self.get_trending_topics(limit=50)
            for trend in trends:
                if trend.id == trend_id:
                    return trend
            return None
        except Exception as e:
            logger.error(f"Error getting trend by ID: {str(e)}")
            return None
    
    async def search_trends(
        self, 
        query: str, 
        category: Optional[str] = None,
        platform: Optional[str] = None,
        limit: int = 20
    ) -> List[Trend]:
        """Search trends by query"""
        
        try:
            # Get all trends
            all_trends = await self.get_trending_topics(category=category, platform=platform, limit=100)
            
            # Filter by search query
            query_lower = query.lower()
            matching_trends = []
            
            for trend in all_trends:
                if (query_lower in trend.topic.lower() or 
                    any(query_lower in hashtag.lower() for hashtag in trend.hashtags) or
                    any(query_lower in insight.lower() for insight in trend.keyInsights)):
                    matching_trends.append(trend)
            
            return matching_trends[:limit]
            
        except Exception as e:
            logger.error(f"Error searching trends: {str(e)}")
            return []