from typing import Optional, List
from pydantic import Field
from app.schemas.common import CoreBase, TimestampSchema
from app.models.models import JobType, JobStatus

class JobBase(CoreBase):
    title: str
    description: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: JobType
    status: JobStatus = JobStatus.OPEN

class JobCreate(JobBase):
    recruiter_id: int
    skill_ids: List[int] = []

class JobUpdate(CoreBase):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: Optional[JobType] = None
    status: Optional[JobStatus] = None

class JobInDB(JobBase, TimestampSchema):
    id: int
    recruiter_id: int

class Job(JobInDB):
    pass
