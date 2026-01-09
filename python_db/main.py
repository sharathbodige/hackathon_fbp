from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

from datetime import datetime
from app.core.config import settings
from starlette.middleware.base import BaseHTTPMiddleware
from app.api.v1.api import api_router
from app.core.exceptions import (
    custom_http_exception_handler, 
    generic_exception_handler, 
    business_exception_handler,
    BusinessException
)

from app.core.logging import setup_logging

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Exception handlers
app.add_exception_handler(StarletteHTTPException, custom_http_exception_handler)
app.add_exception_handler(BusinessException, business_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

from app.core.middleware import request_log_middleware
from starlette.middleware.base import BaseHTTPMiddleware

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(BaseHTTPMiddleware, dispatch=request_log_middleware)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing application startup...")
    print("\n" + "="*50)
    print(f" API is running at: http://127.0.0.1:8080")
    print(f" Documentation at: http://127.0.0.1:8080/docs")
    print("="*50 + "\n")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down...")

from app.core.rate_limit import default_rate_limit

app.include_router(
    api_router, 
    prefix=settings.API_V1_STR,
    dependencies=[Depends(default_rate_limit)]
)

from fastapi.responses import HTMLResponse, RedirectResponse

@app.get("/", response_class=HTMLResponse)
async def root():
    return f"""
    <html>
        <head>
            <title>Job Portal API</title>
            <style>
                body {{ font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: white; }}
                .card {{ background: #1e293b; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); text-align: center; }}
                a {{ color: #6366f1; text-decoration: none; font-weight: bold; border-bottom: 2px solid transparent; transition: 0.3s; }}
                a:hover {{ border-bottom-color: #6366f1; }}
                .btn {{ display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border-radius: 0.5rem; }}
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 Job Portal API is Live</h1>
                <p>Base API Link: <code style="background: #000; padding: 0.2rem 0.5rem; border-radius: 0.3rem;">{settings.API_V1_STR}</code></p>
                <p>Interactive Documentation:</p>
                <a class="btn" href="/docs">Open Swagger UI</a>
            </div>
        </body>
    </html>
    """

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": str(datetime.now())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
