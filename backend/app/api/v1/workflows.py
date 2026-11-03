from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...core.errors import AppError
from ...db import get_db
from ...models import WorkflowRecord
from ...repositories.json_repo import loads

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/{workflow_id}")
def get_workflow(workflow_id: str, db: Session = Depends(get_db)) -> dict:
    row = db.get(WorkflowRecord, workflow_id)
    if not row:
        raise AppError("WORKFLOW_STATE_INVALID", "未找到流程状态", status_code=404)
    return {"success": True, "data": loads(row.payload), "error": None, "traceId": row.trace_id}


@router.post("/continue")
def continue_workflow(db: Session = Depends(get_db)) -> dict:
    row = db.query(WorkflowRecord).order_by(WorkflowRecord.updated_at.desc()).first()
    if not row:
        raise AppError("WORKFLOW_STATE_INVALID", "暂无可继续的流程", status_code=404)
    return {"success": True, "data": loads(row.payload), "error": None, "traceId": row.trace_id}
