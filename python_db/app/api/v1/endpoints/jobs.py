from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.job import Job, JobCreate, JobUpdate
from app.models.models import JobType, JobStatus, User
from app.services import job_service
from app.services.activity_log import log_activity
from app.core.security import get_current_active_user
from app.core.rate_limit import search_rate_limit

router = APIRouter()

@router.post("/", response_model=Job, status_code=status.HTTP_201_CREATED)
async def create_job(
    *,
    db: AsyncSession = Depends(get_db),
    job_in: JobCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new job posting (Protected - Recruiter only)
    Requires JWT authentication
    """
    try:
        # In production, verify user is a recruiter and get their recruiter profile
        job = await job_service.create_job_posting(
            db=db,
            job_data=job_in,
            recruiter_id=job_in.recruiter_id
        )
        
        background_tasks.add_task(
            log_activity, 
            current_user.id, 
            "JOB_POSTED", 
            "JOB", 
            job.id
        )
        
        return job
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating job: {str(e)}"
        )

@router.get("/", response_model=List[Job])
async def read_jobs(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all jobs (Public endpoint)
    """
    from app.repositories.job import job_repo
    jobs = await job_repo.get_multi(db, skip=skip, limit=limit)
    return jobs

@router.get("/search", response_model=List[Job], dependencies=[Depends(search_rate_limit)])
async def search_jobs(
    db: AsyncSession = Depends(get_db),
    location: Optional[str] = Query(None, description="Filter by location"),
    job_type: Optional[JobType] = Query(None, description="Filter by job type"),
    min_salary: Optional[int] = Query(None, description="Minimum salary"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Search jobs with advanced filters (Public endpoint)
    """
    jobs = await job_service.search_jobs(
        db=db,
        location=location,
        job_type=job_type,
        min_salary=min_salary,
        skip=skip,
        limit=limit
    )
    return jobs

@router.get("/{job_id}", response_model=Job)
async def get_job(
    job_id: int,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get job by ID (Public endpoint)
    """
    job = await job_service.get_job_by_id(db, job_id)
    return job

@router.put("/{job_id}/status")
async def update_job_status(
    job_id: int,
    new_status: JobStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update job status (Protected - Recruiter only)
    """
    # In production, get recruiter_id from current_user's recruiter profile
    # For now, using a placeholder
    job = await job_service.update_job_status(
        db=db,
        job_id=job_id,
        new_status=new_status,
        recruiter_id=1  # Get from current_user.recruiter.id
    )
    return job

@router.get("/my/jobs", response_model=List[Job])
async def get_my_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all jobs posted by current recruiter (Protected)
    """
    # Get recruiter_id from current_user
    jobs = await job_service.get_jobs_by_recruiter(
        db=db,
        recruiter_id=1,  # Get from current_user.recruiter.id
        skip=skip,
        limit=limit
    )
    return jobs

@router.get("/stats/active-count")
async def get_active_jobs_count(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get count of active job postings (Public endpoint)
    """
    count = await job_service.get_active_jobs_count(db)
    return {"active_jobs": count}
