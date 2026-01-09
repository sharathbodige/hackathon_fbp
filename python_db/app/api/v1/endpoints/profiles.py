from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.profile import (
    Recruiter, RecruiterCreate, RecruiterUpdate,
    JobSeeker, JobSeekerCreate, JobSeekerUpdate
)
from app.services import profile_service, notification_service

router = APIRouter()

# Recruiter Endpoints
@router.post("/recruiters", response_model=Recruiter, status_code=status.HTTP_201_CREATED)
async def create_recruiter_profile(
    *,
    db: AsyncSession = Depends(get_db),
    profile_in: RecruiterCreate,
    background_tasks: BackgroundTasks
) -> Any:
    """
    Create recruiter profile
    """
    profile = await profile_service.create_recruiter_profile(
        db=db,
        profile_data=profile_in,
        user_id=profile_in.user_id
    )
    
    # Send notification about profile creation
    background_tasks.add_task(
        notification_service.send_welcome_email,
        user_email="recruiter@example.com",  # Get from user
        user_name=profile.company_name
    )
    
    return profile

@router.get("/recruiters/{id}", response_model=Recruiter)
async def get_recruiter_profile(
    id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get recruiter profile by ID
    """
    from app.repositories.profiles import recruiter_repo
    profile = await recruiter_repo.get(db, id=id)
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    return profile

@router.get("/recruiters/user/{user_id}", response_model=Recruiter)
async def get_recruiter_by_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get recruiter profile by user ID
    """
    profile = await profile_service.get_recruiter_by_user(db, user_id)
    return profile

# Job Seeker Endpoints
@router.post("/job-seekers", response_model=JobSeeker, status_code=status.HTTP_201_CREATED)
async def create_job_seeker_profile(
    *,
    db: AsyncSession = Depends(get_db),
    profile_in: JobSeekerCreate,
    background_tasks: BackgroundTasks
) -> Any:
    """
    Create job seeker profile
    """
    profile = await profile_service.create_job_seeker_profile(
        db=db,
        profile_data=profile_in,
        user_id=profile_in.user_id
    )
    
    # Send welcome notification
    background_tasks.add_task(
        notification_service.send_welcome_email,
        user_email="jobseeker@example.com",  # Get from user
        user_name=profile.full_name
    )
    
    return profile

@router.get("/job-seekers/{id}", response_model=JobSeeker)
async def get_job_seeker_profile(
    id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get job seeker profile by ID
    """
    from app.repositories.profiles import job_seeker_repo
    profile = await job_seeker_repo.get(db, id=id)
    if not profile:
        raise HTTPException(status_code=404, detail="Job Seeker profile not found")
    return profile

@router.get("/job-seekers/user/{user_id}", response_model=JobSeeker)
async def get_job_seeker_by_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get job seeker profile by user ID
    """
    profile = await profile_service.get_job_seeker_by_user(db, user_id)
    return profile

@router.put("/job-seekers/{user_id}", response_model=JobSeeker)
async def update_job_seeker_profile(
    user_id: int,
    profile_in: JobSeekerUpdate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Update job seeker profile
    """
    profile = await profile_service.update_job_seeker_profile(
        db=db,
        user_id=user_id,
        profile_data=profile_in
    )
    return profile
