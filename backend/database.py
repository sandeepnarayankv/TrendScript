from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase
import os
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

# Database instance
database = Database()

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return database.database

async def connect_db():
    """Create database connection"""
    try:
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('DB_NAME', 'trendscript')
        
        if not mongo_url:
            raise ValueError("MONGO_URL not found in environment variables")
        
        database.client = AsyncIOMotorClient(mongo_url)
        database.database = database.client[db_name.strip('"')]
        
        # Test connection
        await database.client.admin.command('ping')
        logger.info(f"Connected to MongoDB database: {db_name}")
        
        # Create indexes for better performance
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}")
        raise

async def close_db():
    """Close database connection"""
    if database.client:
        database.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        db = database.database
        
        # Trends collection indexes
        await db.trends.create_index("topic")
        await db.trends.create_index("platform")
        await db.trends.create_index("category")
        await db.trends.create_index("contentScore")
        await db.trends.create_index("created_at")
        
        # Generated content collection indexes
        await db.generated_content.create_index("user_id")
        await db.generated_content.create_index("trend_id")
        await db.generated_content.create_index("session_id")
        await db.generated_content.create_index("created_at")
        
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {str(e)}")

# CRUD Operations for Trends
async def save_trend(trend_data: dict) -> str:
    """Save trend to database"""
    try:
        db = await get_database()
        result = await db.trends.insert_one(trend_data)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving trend: {str(e)}")
        raise

async def get_trends(
    category: str = None, 
    platform: str = None, 
    limit: int = 20,
    skip: int = 0
):
    """Get trends from database with filters"""
    try:
        db = await get_database()
        
        # Build query
        query = {}
        if category:
            query["category"] = category
        if platform:
            query["platform"] = platform
        
        # Execute query
        cursor = db.trends.find(query).sort("contentScore", -1).skip(skip).limit(limit)
        trends = await cursor.to_list(length=limit)
        
        return trends
    except Exception as e:
        logger.error(f"Error getting trends: {str(e)}")
        return []

async def get_trend_by_id(trend_id: str):
    """Get trend by ID"""
    try:
        db = await get_database()
        trend = await db.trends.find_one({"id": trend_id})
        return trend
    except Exception as e:
        logger.error(f"Error getting trend by ID: {str(e)}")
        return None

# CRUD Operations for Generated Content
async def save_generated_content(content_data: dict) -> str:
    """Save generated content to database"""
    try:
        db = await get_database()
        result = await db.generated_content.insert_one(content_data)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving generated content: {str(e)}")
        raise

async def get_user_generated_content(user_id: str, limit: int = 50):
    """Get user's generated content history"""
    try:
        db = await get_database()
        cursor = db.generated_content.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
        content_list = await cursor.to_list(length=limit)
        return content_list
    except Exception as e:
        logger.error(f"Error getting user generated content: {str(e)}")
        return []

async def get_generated_content_by_id(content_id: str):
    """Get generated content by ID"""
    try:
        db = await get_database()
        content = await db.generated_content.find_one({"id": content_id})
        return content
    except Exception as e:
        logger.error(f"Error getting generated content by ID: {str(e)}")
        return None

# CRUD Operations for Users
async def save_user(user_data: dict) -> str:
    """Save user to database"""
    try:
        db = await get_database()
        result = await db.users.insert_one(user_data)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Error saving user: {str(e)}")
        raise

async def get_user_by_email(email: str):
    """Get user by email"""
    try:
        db = await get_database()
        user = await db.users.find_one({"email": email})
        return user
    except Exception as e:
        logger.error(f"Error getting user by email: {str(e)}")
        return None

async def get_user_by_id(user_id: str):
    """Get user by ID"""
    try:
        db = await get_database()
        user = await db.users.find_one({"id": user_id})
        return user
    except Exception as e:
        logger.error(f"Error getting user by ID: {str(e)}")
        return None