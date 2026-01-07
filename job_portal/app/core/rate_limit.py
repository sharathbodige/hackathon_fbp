from fastapi import Request, HTTPException, status
from app.core.redis import redis_client
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class RateLimiter:
    """
    Enhanced Redis-based Rate Limiter.
    Supports dynamic limits and configurable windows.
    """
    
    def __init__(self, requests: int = 60, window: int = 60):
        self.requests = requests
        self.window = window

    async def __call__(self, request: Request):
        if not redis_client:
            return # Skip if redis is not available
            
        client_ip = request.client.host
        # Use path in key to allow different limits for different routes
        path = request.url.path
        key = f"rate_limit:{client_ip}:{path}"
        
        try:
            current = await redis_client.get(key)
            
            if current and int(current) >= self.requests:
                logger.warning(f"Rate limit exceeded for IP: {client_ip} on path: {path}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "error": "Rate limit exceeded",
                        "limit": self.requests,
                        "window_seconds": self.window,
                        "message": "Please try again later."
                    }
                )
            
            # Use pipeline for atomic increment and expire
            async with redis_client.pipeline(transaction=True) as pipe:
                await pipe.incr(key)
                await pipe.expire(key, self.window)
                await pipe.execute()
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Rate limiter error: {str(e)}")
            # In production, you might want to fail open or closed. 
            # We fail open here to not block users if Redis has a hiccup.
            return

# Global rate limit instances for different scenarios
default_rate_limit = RateLimiter(requests=60, window=60)      # 60 req/min
strict_rate_limit = RateLimiter(requests=5, window=60)        # 5 req/min (e.g. for login)
search_rate_limit = RateLimiter(requests=30, window=60)       # 30 req/min (for search)
