from typing import Any, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.profiles import skill_repo, interview_repo
from app.schemas.profile import Skill, SkillCreate, Interview, InterviewCreate, InterviewUpdate
from fastapi import BackgroundTasks
from app.services.async_tasks import async_task_service

router = APIRouter()

# Skill Endpoints
@router.post("/skills", response_model=Skill, status_code=status.HTTP_201_CREATED, tags=["skills"])
async def create_skill(
    *,
    db: AsyncSession = Depends(get_db),
    skill_in: SkillCreate
) -> Any:
    return await skill_repo.create(db, obj_in=skill_in)

@router.get("/skills", response_model=List[Skill], tags=["skills"])
async def read_skills(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    return await skill_repo.get_multi(db, skip=skip, limit=limit)

# Interview Endpoints
@router.post("/interviews", response_model=Interview, status_code=status.HTTP_201_CREATED, tags=["interviews"])
async def schedule_interview(
    *,
    db: AsyncSession = Depends(get_db),
    interview_in: InterviewCreate
) -> Any:
    return await interview_repo.create(db, obj_in=interview_in)

@router.get("/interviews", response_model=List[Interview], tags=["interviews"])
async def read_interviews(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    return await interview_repo.get_multi(db, skip=skip, limit=limit)

# AsyncIO & Background Tasks Demo
@router.post("/demo/background-batch", status_code=status.HTTP_202_ACCEPTED, tags=["async-demo"])
async def trigger_background_batch(
    background_tasks: BackgroundTasks,
    emails: List[str]
):
    """
    Triggers an asynchronous background batch process.
    The API returns immediately (202 Accepted), while the server 
    continues to process tasks in the background.
    """
    # Register the task in FastAPI BackgroundTasks
    background_tasks.add_task(
        async_task_service.process_batch_notifications, 
        emails, 
        "Welcome to our Job Portal!"
    )
    
    # We can also start other tasks
    background_tasks.add_task(async_task_service.simulate_heavy_computation)
    
    return {
        "status": "Accepted",
        "message": f"Processing {len(emails)} notifications in the background. You don't have to wait!",
        "time_triggered": str(datetime.now())
    }

from datetime import datetime
