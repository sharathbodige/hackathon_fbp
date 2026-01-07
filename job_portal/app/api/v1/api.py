from fastapi import APIRouter
from app.api.v1.endpoints import users, jobs, auth, applications, profiles, ext_features

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(ext_features.router, tags=["extra-features"])
