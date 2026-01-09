import asyncio
import logging
from typing import List, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class AsyncTaskService:
    """
    Service to handle complex AsyncIO operations and background processing.
    """

    @staticmethod
    async def process_batch_notifications(emails: List[str], message: str):
        """
        Simulates an I/O bound background task (like sending bulk emails).
        Uses asyncio.gather for concurrent execution.
        """
        logger.info(f"🚀 Starting background batch process for {len(emails)} users...")
        start_time = datetime.now()
        
        # Simulate individual tasks concurrently
        tasks = [AsyncTaskService.send_individual_simulated_email(email, message) for email in emails]
        await asyncio.gather(*tasks)
        
        duration = (datetime.now() - start_time).total_seconds()
        logger.info(f"✅ Batch notifications completed in {duration:.2f} seconds.")

    @staticmethod
    async def send_individual_simulated_email(email: str, message: str):
        """Simulates sending one email with an artificial I/O delay."""
        await asyncio.sleep(2) # Artificial I/O delay (e.g., SMTP server response)
        logger.info(f"📧 [BACKGROUND] Notification sent to {email}")

    @staticmethod
    async def simulate_heavy_computation():
        """
        Simulates a heavy non-blocking task using asyncio.sleep.
        If this was CPU intensive, we would use run_in_executor.
        """
        await asyncio.sleep(5)
        logger.info("🔥 [BACKGROUND] Heavy periodic cleanup/sync task finished.")

async_task_service = AsyncTaskService()
