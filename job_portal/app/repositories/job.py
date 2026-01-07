from app.repositories.base import CRUDBase
from app.models.models import Job
from app.schemas.job import JobCreate, JobUpdate

class CRUDJob(CRUDBase[Job, JobCreate, JobUpdate]):
    pass

job_repo = CRUDJob(Job)
