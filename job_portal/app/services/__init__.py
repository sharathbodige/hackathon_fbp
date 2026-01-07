"""
Service Layer Initialization
Exports all microservices for easy import
"""
from app.services.auth_service.service import auth_service
from app.services.job_service.service import job_service
from app.services.profile_service.service import profile_service
from app.services.notification_service.service import notification_service
from app.services.application_service import application_service

__all__ = [
    "auth_service",
    "job_service",
    "profile_service",
    "notification_service",
    "application_service"
]
