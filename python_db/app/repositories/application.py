from app.repositories.base import CRUDBase
from app.models.models import Application
from pydantic import BaseModel
from typing import Optional

class ApplicationCreate(BaseModel):
    job_id: int
    job_seeker_id: int

class ApplicationUpdate(BaseModel):
    status: str

class CRUDApplication(CRUDBase[Application, ApplicationCreate, ApplicationUpdate]):
    pass

application_repo = CRUDApplication(Application)
