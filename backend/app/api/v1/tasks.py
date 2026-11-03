from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ...core.errors import AppError
from ...db import get_db
from ...models import AgentTaskRecord
from ...repositories.json_repo import loads
from ...schemas.agent import AgentRequest
from ...schemas.common import ApiResponse
from ...services.task_service import task_from_response
from ...services.workflow_service import new_id

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=ApiResponse)
def list_tasks(
    userId: str | None = None,
    projectId: str | None = None,
    traceId: str | None = None,
    agentType: str | None = None,
    status: str | None = None,
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> ApiResponse:
    query = db.query(AgentTaskRecord)
    if userId:
        query = query.filter(AgentTaskRecord.user_id == userId)
    if projectId:
        query = query.filter(AgentTaskRecord.project_id == projectId)
    if traceId:
        query = query.filter(AgentTaskRecord.trace_id == traceId)
    if agentType:
        query = query.filter(AgentTaskRecord.agent_type == agentType)
    if status:
        query = query.filter(AgentTaskRecord.status == status)
    total = query.count()
    rows = query.order_by(AgentTaskRecord.created_at.desc()).offset((page - 1) * pageSize).limit(pageSize).all()
    return ApiResponse(
        success=True,
        data={"items": [loads(row.payload) for row in rows], "total": total, "page": page, "pageSize": pageSize},
        error=None,
        traceId=traceId or "",
    )


@router.get("/{task_id}", response_model=ApiResponse)
def get_task(task_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    row = db.get(AgentTaskRecord, task_id)
    if not row:
        raise AppError("TASK_NOT_FOUND", "未找到任务", status_code=404)
    return ApiResponse(success=True, data=loads(row.payload), error=None, traceId=row.trace_id)


@router.post("/{task_id}/retry", response_model=ApiResponse)
async def retry_task(task_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    row = db.get(AgentTaskRecord, task_id)
    if not row:
        raise AppError("TASK_NOT_FOUND", "未找到任务", status_code=404)

    payload = loads(row.payload)
    if payload.get("status") not in {"failed", "timeout"}:
        raise AppError("TASK_NOT_RETRYABLE", "只有失败或超时任务可以重试", status_code=409)
    request_payload = payload.get("requestPayload")
    if not isinstance(request_payload, dict):
        raise AppError("TASK_NOT_RETRYABLE", "历史任务缺少原始请求，无法安全重试", status_code=409)

    request = AgentRequest.model_validate(request_payload)
    request.taskId = ""
    request.requestId = new_id("REQ")
    request.traceId = request.traceId or row.trace_id or new_id("TRACE")

    from .agents import run_agent

    response = await run_agent(request, db)
    retried_task = task_from_response(request, response)
    db.commit()
    return ApiResponse(success=True, data=retried_task.model_dump(), error=None, traceId=response.traceId)
