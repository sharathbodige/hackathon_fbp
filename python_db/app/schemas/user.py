from typing import Optional
from pydantic import EmailStr, Field
from app.schemas.common import CoreBase, TimestampSchema
from app.models.models import UserRole

class UserBase(CoreBase):
    email: EmailStr
    role: UserRole
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(CoreBase):
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserInDB(UserBase, TimestampSchema):
    id: int

class User(UserInDB):
    pass
