from typing import Optional, List
from pydantic import BaseModel, HttpUrl
from app.schemas.common import CoreBase, TimestampSchema
from app.models.models import ProficiencyLevel, ApplicationStatus, InterviewMode, InterviewResult, UserRole

class SkillBase(CoreBase):
    name: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase, TimestampSchema):
    id: int

class JobSeekerBase(CoreBase):
    full_name: str
    phone: Optional[str] = None
    experience_years: Optional[int] = 0
    education: Optional[str] = None
    resume_url: Optional[str] = None

class JobSeekerCreate(JobSeekerBase):
    user_id: int

class JobSeekerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    experience_years: Optional[int] = None
    education: Optional[str] = None
    resume_url: Optional[str] = None

class JobSeeker(JobSeekerBase, TimestampSchema):
    id: int
    user_id: int

class RecruiterBase(CoreBase):
    company_name: str
    company_website: Optional[str] = None

class RecruiterCreate(RecruiterBase):
    user_id: int

class RecruiterUpdate(BaseModel):
    company_name: Optional[str] = None
    company_website: Optional[str] = None

class Recruiter(RecruiterBase, TimestampSchema):
    id: int
    user_id: int

class InterviewBase(CoreBase):
    interview_date: str
    mode: InterviewMode
    result: InterviewResult = InterviewResult.PENDING

class InterviewCreate(InterviewBase):
    application_id: int

class InterviewUpdate(BaseModel):
    interview_date: Optional[str] = None
    mode: Optional[InterviewMode] = None
    result: Optional[InterviewResult] = None

class Interview(InterviewBase, TimestampSchema):
    id: int
    application_id: int
