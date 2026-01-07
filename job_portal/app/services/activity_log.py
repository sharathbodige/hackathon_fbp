from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import ActivityLog
from app.db.session import AsyncSessionLocal
import logging

logger = logging.getLogger(__name__)

async def log_activity(
    user_id: int, 
    action: str, 
    entity_type: str, 
    entity_id: int
):
    """
    Background task to log user activity.
    """
    async with AsyncSessionLocal() as db:
        try:
            log = ActivityLog(
                user_id=user_id,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id
            )
            db.add(log)
            await db.commit()
            logger.info(f"Activity logged: {action} by user {user_id}")
        except Exception as e:
            logger.error(f"Failed to log activity: {e}")
            await db.rollback()
