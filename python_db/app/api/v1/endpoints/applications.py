from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.models import ApplicationStatus, User
from app.services import application_service
from app.core.security import get_current_active_user
from pydantic import BaseModel

router = APIRouter()

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    job_seeker_id: int
    status: ApplicationStatus
    
    class Config:
        from_attributes = True

class ApplyRequest(BaseModel):
    job_id: int

class StatusUpdateRequest(BaseModel):
    new_status: ApplicationStatus

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    *,
    db: AsyncSession = Depends(get_db),
    apply_in: ApplyRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Submit a job application (Protected - Job Seeker)
    """
    # Get job_seeker_id from current_user
    # For now using placeholder
    application = await application_service.submit_application(
        db=db,
        job_id=apply_in.job_id,
        job_seeker_id=1,  # Get from current_user.job_seeker.id
        user_email=current_user.email
    )
    
    return application

@router.get("/", response_model=List[ApplicationResponse])
async def read_applications(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all applications (Public GET)
    """
    from app.repositories.application import application_repo
    applications = await application_repo.get_multi(db, skip=skip, limit=limit)
    return applications

@router.get("/my/applications", response_model=List[ApplicationResponse])
async def get_my_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all applications by current job seeker (Protected)
    """
    applications = await application_service.get_applications_by_job_seeker(
        db=db,
        job_seeker_id=1,  # Get from current_user.job_seeker.id
        skip=skip,
        limit=limit
    )
    return applications

@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
async def get_job_applications(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all applications for a job (Protected - Recruiter only)
    """
    applications = await application_service.get_applications_for_job(
        db=db,
        job_id=job_id,
        recruiter_id=1,  # Get from current_user.recruiter.id
        skip=skip,
        limit=limit
    )
    return applications

@router.put("/{application_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    application_id: int,
    status_update: StatusUpdateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update application status (Protected - Recruiter only)
    """
    application = await application_service.update_application_status(
        db=db,
        application_id=application_id,
        new_status=status_update.new_status,
        recruiter_id=1  # Get from current_user.recruiter.id
    )
    
    # Send status update notification in background
    from app.services import notification_service
    background_tasks.add_task(
        notification_service.send_application_status_update,
        user_email="applicant@example.com",  # Get from application
        job_title="Job Title",  # Get from job
        new_status=status_update.new_status.value
    )
    
    return application
