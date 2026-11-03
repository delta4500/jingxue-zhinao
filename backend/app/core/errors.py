from datetime import UTC, datetime

from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        recoverable: bool = True,
        suggested_action: str = "请检查输入后重试",
        task_id: str = "",
        trace_id: str = "",
    ) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        self.recoverable = recoverable
        self.suggested_action = suggested_action
        self.task_id = task_id
        self.trace_id = trace_id
        super().__init__(message)


def error_payload(error: AppError) -> dict:
    return {
        "success": False,
        "data": None,
        "taskId": error.task_id,
        "traceId": error.trace_id,
        "status": "failed",
        "error": {
            "code": error.code,
            "message": error.message,
            "recoverable": error.recoverable,
            "suggestedAction": error.suggested_action,
        },
        "timestamp": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
    }


async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=error_payload(exc))


async def unhandled_error_handler(_: Request, exc: Exception) -> JSONResponse:
    app_error = AppError(
        code="INTERNAL_SERVER_ERROR",
        message="后端服务异常，请稍后重试",
        status_code=500,
        recoverable=True,
        suggested_action="查看后端日志或联系管理员",
    )
    return JSONResponse(status_code=500, content=error_payload(app_error))
