from fastapi import APIRouter

from .agents import router as agents_router
from .health import router as health_router
from .projects import router as projects_router
from .proposals import router as proposals_router
from .tasks import router as tasks_router
from .workflows import router as workflows_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(agents_router)
api_router.include_router(projects_router)
api_router.include_router(proposals_router)
api_router.include_router(tasks_router)
api_router.include_router(workflows_router)
