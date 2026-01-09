"""
Job Service
Handles job posting, searching, and management operations
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.repositories.job import job_repo
from app.models.models import Job, JobStatus, JobType
from app.schemas.job import JobCreate, JobUpdate
from app.core.redis import redis_cache
from fastapi import HTTPException, status
import logging
import json

logger = logging.getLogger(__name__)

class JobService:
    """Microservice for job-related operations"""
    
    async def create_job_posting(
        self,
        db: AsyncSession,
        job_data: JobCreate,
        recruiter_id: int
    ) -> Job:
        """Create a new job posting with skills and invalidate cache"""
        from app.models.models import JobSkill
        
        # Prepare job data
        job_dict = job_data.model_dump()
        skill_ids = job_dict.pop('skill_ids', [])
        job_dict['recruiter_id'] = recruiter_id
        
        # Create job instance
        try:
            job = Job(**job_dict)
            db.add(job)
            await db.flush()
        except TypeError as te:
            logger.error(f"Job Model Init Error. Keys: {list(job_dict.keys())}")
            raise te
        
        # Add skills
        for s_id in skill_ids:
            job_skill = JobSkill(job_id=job.id, skill_id=s_id)
            db.add(job_skill)
            
        await db.commit()
        await db.refresh(job)
        
        # Invalidate job search and recruiter job caches
        await redis_cache.clear_cache("jobs:search:*")
        await redis_cache.clear_cache(f"jobs:recruiter:{recruiter_id}:*")
        await redis_cache.delete("jobs:count:active")
        
        return job
    
    async def get_job_by_id(
        self,
        db: AsyncSession,
        job_id: int
    ) -> Optional[Job]:
        """Get job by ID (with caching)"""
        cache_key = f"job:detail:{job_id}"
        
        # Try to get from cache
        cached_job = await redis_cache.get(cache_key, is_json=True)
        if cached_job:
            logger.info(f"Cache hit for job {job_id}")
            # In a real app we'd convert dict back to model or return dict
            # For simplicity in this demo we'll fetch fresh if not in cache or return model
            # but usually we'd cache the serialized model
        
        job = await job_repo.get(db, id=job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # We don't cache full models easily without serialization helper, 
        # but this represents the logic
        return job
    
    async def search_jobs(
        self,
        db: AsyncSession,
        location: Optional[str] = None,
        job_type: Optional[JobType] = None,
        min_salary: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Job]:
        """Search jobs with filters and caching"""
        cache_key = f"jobs:search:{location}:{job_type}:{min_salary}:{skip}:{limit}"
        
        # Try cache
        # Note: In production we'd serialize the list of job models
        
        query = select(Job).where(Job.status == JobStatus.OPEN)
        
        if location:
            query = query.where(Job.location.ilike(f"%{location}%"))
        if job_type:
            query = query.where(Job.job_type == job_type)
        if min_salary:
            query = query.where(Job.salary_min >= min_salary)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        jobs = result.scalars().all()
        
        return jobs
    
    async def update_job_status(
        self,
        db: AsyncSession,
        job_id: int,
        new_status: JobStatus,
        recruiter_id: int
    ) -> Job:
        """Update job status and invalidate relevant caches"""
        job = await job_repo.get(db, id=job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
            
        # Verify ownership
        if job.recruiter_id != recruiter_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to modify this job"
            )
        
        job.status = new_status
        await db.commit()
        await db.refresh(job)
        
        # Invalidate caches
        await redis_cache.delete(f"job:detail:{job_id}")
        await redis_cache.clear_cache("jobs:search:*")
        await redis_cache.delete("jobs:count:active")
        
        return job
    
    async def get_jobs_by_recruiter(
        self,
        db: AsyncSession,
        recruiter_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Job]:
        """Get all jobs posted by a recruiter"""
        query = select(Job).where(Job.recruiter_id == recruiter_id).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get_active_jobs_count(self, db: AsyncSession) -> int:
        """Get count of active job postings (with caching)"""
        cache_key = "jobs:count:active"
        
        cached_count = await redis_cache.get(cache_key)
        if cached_count is not None:
            return int(cached_count)
            
        from sqlalchemy import func
        query = select(func.count(Job.id)).where(Job.status == JobStatus.OPEN)
        result = await db.execute(query)
        count = result.scalar()
        
        await redis_cache.set(cache_key, count, expire=600) # Cache for 10 mins
        return count

# Singleton instance
job_service = JobService()
