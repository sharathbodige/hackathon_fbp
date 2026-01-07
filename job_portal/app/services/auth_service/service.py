"""
Authentication Service
Handles user authentication, token management, and authorization
"""
from typing import Optional
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import security
from app.core.config import settings
from app.repositories.user import user_repo
from app.models.models import User, UserRole
from app.schemas.user import UserCreate
from fastapi import HTTPException, status

class AuthService:
    """Microservice for authentication operations"""
    
    async def authenticate_user(
        self, 
        db: AsyncSession, 
        email: str, 
        password: str
    ) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await user_repo.get_by_email(db, email=email)
        if not user:
            return None
        if not security.verify_password(password, user.password_hash):
            return None
        return user
    
    async def create_access_token(self, user_id: int) -> dict:
        """Generate JWT access token"""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": security.create_access_token(
                user_id, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
        }
    
    async def register_user(
        self, 
        db: AsyncSession, 
        user_data: UserCreate
    ) -> User:
        """Register a new user"""
        # Check if user exists
        existing_user = await user_repo.get_by_email(db, email=user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Create user
        user = await user_repo.create(db, obj_in=user_data)
        return user
    
    async def validate_user_active(self, user: User) -> bool:
        """Validate if user account is active"""
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account"
            )
        return True
    
    async def check_permission(self, user: User, required_role: UserRole) -> bool:
        """Check if user has required role"""
        if user.role != required_role and user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return True

# Singleton instance
auth_service = AuthService()
