"""
Profile Service
Handles job seeker and recruiter profile management
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.profiles import job_seeker_repo, recruiter_repo
from app.models.models import JobSeeker, Recruiter, User, UserRole
from app.schemas.profile import JobSeekerCreate, JobSeekerUpdate, RecruiterCreate, RecruiterUpdate
from fastapi import HTTPException, status

class ProfileService:
    """Microservice for profile management operations"""
    
    async def create_job_seeker_profile(
        self,
        db: AsyncSession,
        profile_data: JobSeekerCreate,
        user_id: int
    ) -> JobSeeker:
        """Create job seeker profile"""
        # Check if profile already exists
        query = select(JobSeeker).where(JobSeeker.user_id == user_id)
        result = await db.execute(query)
        existing = result.scalar_one_or_none()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already exists for this user"
            )
        
        # Verify user exists
        query_user = select(User).where(User.id == user_id)
        result_user = await db.execute(query_user)
        user_record = result_user.scalar_one_or_none()
        
        if not user_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found. You must register the user first."
            )
        
        profile = await job_seeker_repo.create(db, obj_in=profile_data)
        return profile
    
    async def create_recruiter_profile(
        self,
        db: AsyncSession,
        profile_data: RecruiterCreate,
        user_id: int
    ) -> Recruiter:
        """Create recruiter profile"""
        # Check if profile already exists
        query = select(Recruiter).where(Recruiter.user_id == user_id)
        result = await db.execute(query)
        existing = result.scalar_one_or_none()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already exists for this user"
            )
        
        # Verify user exists
        query_user = select(User).where(User.id == user_id)
        result_user = await db.execute(query_user)
        user_record = result_user.scalar_one_or_none()
        
        if not user_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found. You must register the user first."
            )
        
        profile = await recruiter_repo.create(db, obj_in=profile_data)
        return profile
    
    async def get_job_seeker_by_user(
        self,
        db: AsyncSession,
        user_id: int
    ) -> Optional[JobSeeker]:
        """Get job seeker profile by user ID"""
        query = select(JobSeeker).where(JobSeeker.user_id == user_id)
        result = await db.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job seeker profile not found"
            )
        return profile
    
    async def get_recruiter_by_user(
        self,
        db: AsyncSession,
        user_id: int
    ) -> Optional[Recruiter]:
        """Get recruiter profile by user ID"""
        query = select(Recruiter).where(Recruiter.user_id == user_id)
        result = await db.execute(query)
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recruiter profile not found"
            )
        return profile
    
    async def update_job_seeker_profile(
        self,
        db: AsyncSession,
        user_id: int,
        profile_data: JobSeekerUpdate
    ) -> JobSeeker:
        """Update job seeker profile"""
        profile = await self.get_job_seeker_by_user(db, user_id)
        
        update_data = profile_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        
        await db.commit()
        await db.refresh(profile)
        return profile
    
    async def verify_profile_ownership(
        self,
        user: User,
        profile_user_id: int
    ) -> bool:
        """Verify user owns the profile"""
        if user.id != profile_user_id and user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this profile"
            )
        return True

# Singleton instance
profile_service = ProfileService()
