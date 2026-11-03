from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.router import api_router
from .config import settings
from .core.errors import AppError, app_error_handler, unhandled_error_handler
from .db import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="竞学智脑 API",
    description="多智能体竞赛决策与项目推进平台后端",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(Exception, unhandled_error_handler)


@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    try:
        exceeds_limit = content_length is not None and int(content_length) > settings.request_body_limit_bytes
    except ValueError as exc:
        raise AppError("INVALID_REQUEST", "Content-Length 格式无效", status_code=400) from exc
    if exceeds_limit:
        raise AppError("INVALID_REQUEST", "请求体过大", status_code=413)
    return await call_next(request)


app.include_router(api_router)
