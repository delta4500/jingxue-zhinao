from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.orm import Session

from ...config import settings
from ...db import engine

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health() -> dict:
    database_connected = True
    try:
        with Session(engine) as session:
            session.execute(text("SELECT 1"))
    except Exception:  # noqa: BLE001
        database_connected = False
    return {
        "success": True,
        "data": {
            "service": "jingxue-fastapi",
            "mode": settings.app_mode,
            "databaseConnected": database_connected,
            "qwenConfigured": bool(settings.qwen_api_key and settings.qwen_base_url),
            "deepseekConfigured": bool(settings.deepseek_api_key and settings.deepseek_base_url),
            "defaultProvider": settings.default_llm_provider,
        },
        "error": None,
        "traceId": "TRACE-MVP-001",
    }
