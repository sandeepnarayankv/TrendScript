import os
import logging
from typing import Dict, List, Any
from emergentintegrations.llm.chat import LlmChat, UserMessage
from models import Trend, ContentGenerationRequest, GeneratedContent, ContentSection

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
    
    async def generate_content_script(
        self, 
        trend: Trend, 
        request: ContentGenerationRequest,
        user_id: str
    ) -> GeneratedContent:
        """Generate AI-powered content script based on trend and user preferences"""
        
        try:
            # Create unique session ID for this generation
            session_id = request.session_id or f"content_gen_{trend.id}_{request.template_id}"
            
            # Initialize LLM Chat
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=self._get_system_message(request.template_id, request.tone)
            ).with_model("openai", "gpt-4o").with_max_tokens(4096)
            
            # Create user prompt
            user_prompt = self._create_content_prompt(trend, request)
            user_message = UserMessage(text=user_prompt)
            
            # Generate content with AI
            ai_response = await chat.send_message(user_message)
            
            # Parse AI response and structure it
            generated_content = self._parse_ai_response(
                ai_response, 
                trend, 
                request, 
                user_id, 
                session_id
            )
            
            return generated_content
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            raise Exception(f"Failed to generate content: {str(e)}")
    
    def _get_system_message(self, template_id: str, tone: str) -> str:
        """Get system message based on content template and tone"""
        
        template_instructions = {
            "youtube-explainer": "You are an expert YouTube content creator specializing in 10-15 minute educational videos. Create detailed, engaging scripts with clear timestamps, hooks, and actionable content.",
            "blog-post": "You are a professional content writer specializing in comprehensive blog posts. Create well-structured, SEO-optimized content with clear headings and valuable insights.",
            "social-thread": "You are a social media expert creating viral Twitter/LinkedIn threads. Focus on concise, impactful points that drive engagement and sharing.",
            "podcast-guide": "You are a podcast producer creating structured discussion guides. Focus on natural conversation flow, thought-provoking questions, and key talking points.",
            "short-form": "You are a TikTok/Instagram Reels creator. Focus on hook-heavy, fast-paced content that captures attention in the first 3 seconds."
        }
        
        tone_instructions = {
            "professional": "Use authoritative, business-focused language with industry expertise.",
            "casual": "Use friendly, conversational tone like talking to a friend.",
            "humorous": "Include appropriate humor, wit, and light-hearted commentary.",
            "educational": "Focus on teaching and explaining concepts clearly.",
            "controversial": "Present provocative viewpoints while maintaining respect.",
            "inspirational": "Use motivational and uplifting language that inspires action."
        }
        
        base_instruction = template_instructions.get(template_id, template_instructions["youtube-explainer"])
        tone_instruction = tone_instructions.get(tone, tone_instructions["professional"])
        
        return f"""
        {base_instruction}
        
        Tone: {tone_instruction}
        
        Always provide:
        1. A compelling, clickable title
        2. An attention-grabbing hook
        3. Detailed content outline with timestamps (if applicable)
        4. Key points to emphasize
        5. SEO keywords and hashtags
        6. Performance predictions
        
        Format your response as a structured JSON object with all required fields.
        """
    
    def _create_content_prompt(self, trend: Trend, request: ContentGenerationRequest) -> str:
        """Create the user prompt for content generation"""
        
        custom_instructions = f"\nAdditional instructions: {request.custom_prompt}" if request.custom_prompt else ""
        
        prompt = f"""
        Create a content script for the following trending topic:
        
        **Topic**: {trend.topic}
        **Category**: {trend.category}
        **Content Score**: {trend.contentScore}/100
        **Trend Velocity**: {trend.trendVelocity}
        **Primary Platform**: {trend.platform}
        **Hashtags**: {', '.join(trend.hashtags)}
        
        **Key Insights**:
        {chr(10).join(f"- {insight}" for insight in trend.keyInsights)}
        
        **Suggested Angles**:
        {chr(10).join(f"- {angle}" for angle in trend.suggestedAngles)}
        
        **Platform Engagement Data**:
        - Twitter: {trend.engagement.twitter.mentions} mentions, sentiment: {trend.engagement.twitter.sentiment}
        - YouTube: {trend.engagement.youtube.videos} videos, {trend.engagement.youtube.totalViews} total views
        - Reddit: {trend.engagement.reddit.upvotes} upvotes, {trend.engagement.reddit.comments} comments
        
        **Template**: {request.template_id}
        **Tone**: {request.tone}
        {custom_instructions}
        
        Please generate a comprehensive content script in JSON format with the following structure:
        {{
            "title": "Compelling, clickable title",
            "hook": "Attention-grabbing opening line",
            "outline": [
                {{
                    "section": "Section name",
                    "duration": "0:00 - 1:30",
                    "content": ["Point 1", "Point 2", "Point 3"]
                }}
            ],
            "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
            "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
            "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
            "estimatedViews": "10K - 25K",
            "difficulty": "Beginner-friendly"
        }}
        """
        
        return prompt
    
    def _parse_ai_response(
        self, 
        ai_response: str, 
        trend: Trend, 
        request: ContentGenerationRequest, 
        user_id: str,
        session_id: str
    ) -> GeneratedContent:
        """Parse AI response and create GeneratedContent object"""
        
        try:
            import json
            
            # Try to extract JSON from AI response
            response_text = ai_response.strip()
            
            # Find JSON content (sometimes AI wraps it in markdown)
            if "```json" in response_text:
                start = response_text.find("```json") + 7
                end = response_text.find("```", start)
                json_content = response_text[start:end].strip()
            elif response_text.startswith("{"):
                json_content = response_text
            else:
                # If no JSON found, create a fallback structure
                raise ValueError("No JSON structure found in AI response")
            
            # Parse JSON
            parsed_data = json.loads(json_content)
            
            # Convert outline to ContentSection objects
            outline_sections = []
            for section in parsed_data.get("outline", []):
                outline_sections.append(ContentSection(
                    section=section.get("section", ""),
                    duration=section.get("duration", ""),
                    content=section.get("content", [])
                ))
            
            # Create GeneratedContent object
            generated_content = GeneratedContent(
                user_id=user_id,
                session_id=session_id,
                trend_id=trend.id,
                template_id=request.template_id,
                tone=request.tone,
                custom_prompt=request.custom_prompt,
                title=parsed_data.get("title", "Generated Content"),
                hook=parsed_data.get("hook", ""),
                outline=outline_sections,
                keyPoints=parsed_data.get("keyPoints", []),
                seoKeywords=parsed_data.get("seoKeywords", []),
                hashtags=parsed_data.get("hashtags", []),
                estimatedViews=parsed_data.get("estimatedViews", "1K - 5K"),
                difficulty=parsed_data.get("difficulty", "Intermediate")
            )
            
            return generated_content
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response JSON: {str(e)}")
            # Return fallback content
            return self._create_fallback_content(trend, request, user_id, session_id)
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return self._create_fallback_content(trend, request, user_id, session_id)
    
    def _create_fallback_content(
        self, 
        trend: Trend, 
        request: ContentGenerationRequest, 
        user_id: str,
        session_id: str
    ) -> GeneratedContent:
        """Create fallback content when AI parsing fails"""
        
        fallback_outline = [
            ContentSection(
                section="Introduction",
                duration="0:00 - 1:00",
                content=[
                    f"Introduce the topic: {trend.topic}",
                    "Hook the audience with a compelling opening",
                    "Preview what they'll learn"
                ]
            ),
            ContentSection(
                section="Main Content",
                duration="1:00 - 8:00",
                content=[
                    "Deep dive into the topic",
                    "Provide valuable insights and examples",
                    "Address common questions and concerns"
                ]
            ),
            ContentSection(
                section="Conclusion & Call to Action",
                duration="8:00 - 10:00",
                content=[
                    "Summarize key takeaways",
                    "Provide actionable next steps",
                    "Encourage engagement and subscriptions"
                ]
            )
        ]
        
        return GeneratedContent(
            user_id=user_id,
            session_id=session_id,
            trend_id=trend.id,
            template_id=request.template_id,
            tone=request.tone,
            custom_prompt=request.custom_prompt,
            title=f"Content Script: {trend.topic}",
            hook=f"Did you know that {trend.topic} is trending right now? Here's what you need to know...",
            outline=fallback_outline,
            keyPoints=[
                f"{trend.topic} is gaining significant traction",
                "Understanding this trend can benefit your audience",
                "There are specific strategies to leverage this topic",
                "Timing is crucial for maximum impact"
            ],
            seoKeywords=trend.hashtags[:4] if len(trend.hashtags) >= 4 else trend.hashtags + ["trending", "content"],
            hashtags=trend.hashtags[:5],
            estimatedViews="2K - 8K",
            difficulty="Beginner-friendly"
        )

    async def analyze_trend_potential(self, topic: str, platform_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze trend potential using AI"""
        
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"trend_analysis_{topic}",
                system_message="You are a trend analysis expert. Analyze social media trends and provide content potential scores with insights."
            ).with_model("openai", "gpt-4o").with_max_tokens(2048)
            
            prompt = f"""
            Analyze this trending topic for content creation potential:
            
            Topic: {topic}
            Platform Data: {platform_data}
            
            Provide analysis in JSON format:
            {{
                "contentScore": 85,
                "trendVelocity": "Rising Fast",
                "keyInsights": ["insight1", "insight2", "insight3"],
                "suggestedAngles": ["angle1", "angle2", "angle3"],
                "category": "Technology"
            }}
            """
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse response
            import json
            try:
                return json.loads(response)
            except:
                return {
                    "contentScore": 75,
                    "trendVelocity": "Steady Growth",
                    "keyInsights": ["Trending topic with potential", "Audience engagement expected", "Timing is important"],
                    "suggestedAngles": ["Educational approach", "Personal experience", "Industry analysis"],
                    "category": "General"
                }
                
        except Exception as e:
            logger.error(f"Error analyzing trend: {str(e)}")
            return {
                "contentScore": 70,
                "trendVelocity": "Unknown",
                "keyInsights": ["Analysis unavailable"],
                "suggestedAngles": ["General coverage"],
                "category": "General"
            }