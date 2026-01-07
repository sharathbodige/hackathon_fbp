from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.models import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        query = select(self.model).where(self.model.email == email, self.model.is_deleted == None)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        from app.core.security import get_password_hash
        db_obj = User(
            email=obj_in.email,
            password_hash=get_password_hash(obj_in.password),
            role=obj_in.role,
            is_active=obj_in.is_active,
        )
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

user_repo = CRUDUser(User)
