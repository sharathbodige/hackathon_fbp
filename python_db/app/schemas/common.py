from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CoreBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class TimestampSchema(CoreBase):
    created_at: datetime
    updated_at: datetime
    is_deleted: Optional[datetime] = None
