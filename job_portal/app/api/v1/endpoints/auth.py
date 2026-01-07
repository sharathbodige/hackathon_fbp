from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import User, UserCreate
from app.services import auth_service, notification_service
from app.core.rate_limit import strict_rate_limit

router = APIRouter()

@router.post("/login/access-token", dependencies=[Depends(strict_rate_limit)])
async def login_access_token(
    db: AsyncSession = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Authenticate user using auth service
    user = await auth_service.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    # Validate user is active
    await auth_service.validate_user_active(user)
    
    # Generate access token
    return await auth_service.create_access_token(user.id)

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED, dependencies=[Depends(strict_rate_limit)])
async def register_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
    background_tasks: BackgroundTasks
) -> Any:
    """
    Register a new user account
    """
    # Register user using auth service
    user = await auth_service.register_user(db, user_in)
    
    # Send welcome email in background
    background_tasks.add_task(
        notification_service.send_welcome_email,
        user_email=user.email,
        user_name=user.email.split('@')[0]
    )
    
    return user
