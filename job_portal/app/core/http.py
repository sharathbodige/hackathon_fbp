from httpx import AsyncClient, Response
from typing import Any, Dict, Optional
import asyncio

class ExternalServiceHandler:
    """
    Handles external HTTP calls with retry logic and timeout (Circuit Breaker Awareness).
    """
    def __init__(self, base_url: str, timeout: float = 10.0):
        self.base_url = base_url
        self.timeout = timeout

    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None, retries: int = 3) -> Response:
        async with AsyncClient(base_url=self.base_url, timeout=self.timeout) as client:
            for attempt in range(retries):
                try:
                    response = await client.get(endpoint, params=params)
                    response.raise_for_status()
                    return response
                except Exception as e:
                    if attempt == retries - 1:
                        raise e
                    await asyncio.sleep(1 * (attempt + 1))
            raise Exception("Failed after retries")

# Example usage for Java backend integration
java_api = ExternalServiceHandler(base_url="http://localhost:8080")
