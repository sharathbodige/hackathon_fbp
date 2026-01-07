"""
Application Service
Handles job application workflow and lifecycle management
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.repositories.application import application_repo
from app.models.models import Application, ApplicationStatus, Job, JobSeeker
from fastapi import HTTPException, status
from app.services.notification_service.service import notification_service

class ApplicationService:
    """Microservice for application management operations"""
    
    async def submit_application(
        self,
        db: AsyncSession,
        job_id: int,
        job_seeker_id: int,
        user_email: str
    ) -> Application:
        """Submit a job application"""
        # Check if already applied
        query = select(Application).where(
            and_(
                Application.job_id == job_id,
                Application.job_seeker_id == job_seeker_id
            )
        )
        result = await db.execute(query)
        existing = result.scalar_one_or_none()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this job"
            )
        
        # Get job details for notification
        job_query = select(Job).where(Job.id == job_id)
        job_result = await db.execute(job_query)
        job = job_result.scalar_one_or_none()
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Create application
        from app.repositories.application import ApplicationCreate
        app_data = ApplicationCreate(job_id=job_id, job_seeker_id=job_seeker_id)
        application = await application_repo.create(db, obj_in=app_data)
        
        # Send confirmation notification
        await notification_service.send_application_confirmation(
            user_email=user_email,
            job_title=job.title,
            application_id=application.id
        )
        
        return application
    
    async def update_application_status(
        self,
        db: AsyncSession,
        application_id: int,
        new_status: ApplicationStatus,
        recruiter_id: int
    ) -> Application:
        """Update application status (recruiter only)"""
        application = await application_repo.get(db, id=application_id)
        
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        # Verify recruiter owns the job
        job_query = select(Job).where(Job.id == application.job_id)
        result = await db.execute(job_query)
        job = result.scalar_one()
        
        if job.recruiter_id != recruiter_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this application"
            )
        
        # Update status
        application.status = new_status
        await db.commit()
        await db.refresh(application)
        
        return application
    
    async def get_applications_by_job_seeker(
        self,
        db: AsyncSession,
        job_seeker_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Application]:
        """Get all applications by a job seeker"""
        query = select(Application).where(
            Application.job_seeker_id == job_seeker_id
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get_applications_for_job(
        self,
        db: AsyncSession,
        job_id: int,
        recruiter_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Application]:
        """Get all applications for a job (recruiter only)"""
        # Verify ownership
        job_query = select(Job).where(Job.id == job_id)
        result = await db.execute(job_query)
        job = result.scalar_one_or_none()
        
        if not job or job.recruiter_id != recruiter_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these applications"
            )
        
        query = select(Application).where(
            Application.job_id == job_id
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

# Singleton instance
application_service = ApplicationService()
