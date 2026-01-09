from app.repositories.base import CRUDBase
from app.models.models import Skill, Recruiter, JobSeeker, Interview, ActivityLog
from pydantic import BaseModel
from typing import Optional

# Skill Repository
class SkillCreate(BaseModel):
    name: str

class SkillUpdate(BaseModel):
    name: Optional[str] = None

class CRUDSkill(CRUDBase[Skill, SkillCreate, SkillUpdate]):
    pass

skill_repo = CRUDSkill(Skill)

# Recruiter Repository
class RecruiterCreate(BaseModel):
    user_id: int
    company_name: str
    company_website: Optional[str] = None

class RecruiterUpdate(BaseModel):
    company_name: Optional[str] = None
    company_website: Optional[str] = None

class CRUDRecruiter(CRUDBase[Recruiter, RecruiterCreate, RecruiterUpdate]):
    pass

recruiter_repo = CRUDRecruiter(Recruiter)

# JobSeeker Repository
class JobSeekerCreate(BaseModel):
    user_id: int
    full_name: str
    phone: Optional[str] = None
    experience_years: Optional[int] = None
    education: Optional[str] = None
    resume_url: Optional[str] = None

class JobSeekerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    experience_years: Optional[int] = None
    education: Optional[str] = None
    resume_url: Optional[str] = None

class CRUDJobSeeker(CRUDBase[JobSeeker, JobSeekerCreate, JobSeekerUpdate]):
    pass

job_seeker_repo = CRUDJobSeeker(JobSeeker)

# Interview Repository
class InterviewCreate(BaseModel):
    application_id: int
    interview_date: str # Simplified, using string in Pydantic for validation if needed
    mode: str
    result: Optional[str] = "PENDING"

class InterviewUpdate(BaseModel):
    interview_date: Optional[str] = None
    mode: Optional[str] = None
    result: Optional[str] = None

class CRUDInterview(CRUDBase[Interview, InterviewCreate, InterviewUpdate]):
    pass

interview_repo = CRUDInterview(Interview)
