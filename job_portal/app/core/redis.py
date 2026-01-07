import json
from typing import Any, Optional, Union
import redis.asyncio as redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Redis client
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True
)

async def get_redis():
    """Dependency for getting redis connection"""
    return redis_client

class RedisService:
    """Utility class for Redis operations"""
    
    @staticmethod
    async def set(key: str, value: Any, expire: int = 3600) -> bool:
        """Store value in Redis (automatically serializes dicts/lists)"""
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            await redis_client.set(key, value, ex=expire)
            return True
        except Exception as e:
            logger.error(f"Redis Set Error: {str(e)}")
            return False

    @staticmethod
    async def get(key: str, is_json: bool = False) -> Any:
        """Retrieve value from Redis (automatically deserializes if is_json=True)"""
        try:
            value = await redis_client.get(key)
            if value and is_json:
                return json.loads(value)
            return value
        except Exception as e:
            logger.error(f"Redis Get Error: {str(e)}")
            return None

    @staticmethod
    async def delete(key: str) -> bool:
        """Remove key from Redis"""
        try:
            await redis_client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis Delete Error: {str(e)}")
            return False

    @staticmethod
    async def increment(key: str) -> int:
        """Increment value in Redis"""
        try:
            return await redis_client.incr(key)
        except Exception as e:
            logger.error(f"Redis Incr Error: {str(e)}")
            return 0

    @staticmethod
    async def exists(key: str) -> bool:
        """Check if key exists in Redis"""
        try:
            return await redis_client.exists(key) > 0
        except Exception as e:
            logger.error(f"Redis Exists Error: {str(e)}")
            return False

    @staticmethod
    async def clear_cache(pattern: str = "*"):
        """Clear cache keys matching a specific pattern"""
        try:
            keys = await redis_client.keys(pattern)
            if keys:
                await redis_client.delete(*keys)
            return True
        except Exception as e:
            logger.error(f"Redis Clear Error: {str(e)}")
            return False

# Initialize singleton
redis_cache = RedisService()
