from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.user import user_repo
from app.schemas.user import User, UserCreate, UserUpdate
from app.core.security import get_password_hash, get_current_active_user
from app.services.activity_log import log_activity
from app.models.models import User as UserModel

router = APIRouter()

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
    background_tasks: BackgroundTasks
) -> Any:
    """
    Create new user (Public endpoint for registration)
    """
    user = await user_repo.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    user = await user_repo.create(db, obj_in=user_in)
    background_tasks.add_task(log_activity, user.id, "USER_CREATED", "USER", user.id)
    return user

@router.get("/", response_model=List[User])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve users (Public GET for initial setup / debugging)
    """
    users = await user_repo.get_multi(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=User)
async def read_user_me(
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Get current authenticated user (Protected)
    """
    return current_user

@router.get("/{user_id}", response_model=User)
async def read_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get a specific user by id (Public GET)
    """
    user = await user_repo.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user

@router.put("/me", response_model=User)
async def update_user_me(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
) -> Any:
    """
    Update current user
    """
    user = await user_repo.update(db, db_obj=current_user, obj_in=user_in)
    return user
