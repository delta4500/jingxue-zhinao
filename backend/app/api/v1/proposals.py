from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...core.errors import AppError
from ...db import get_db
from ...models import ProjectRecord, ProposalRecord
from ...repositories.json_repo import loads
from ...schemas.agent import AgentContext, AgentRequest
from ...schemas.common import ApiResponse
from ...services.workflow_service import new_id
from .agents import run_agent, success_response

router = APIRouter(prefix="/proposals", tags=["proposals"])


@router.get("/{document_id}", response_model=ApiResponse)
def get_proposal(document_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    row = db.get(ProposalRecord, document_id)
    if not row:
        raise AppError("PROPOSAL_NOT_FOUND", "未找到计划书", status_code=404)
    return ApiResponse(success=True, data=loads(row.payload), error=None, traceId=new_id("TRACE"))


@router.post("/generate-from-project/{project_id}", response_model=ApiResponse)
async def generate_from_project(project_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    row = db.get(ProjectRecord, project_id)
    if not row:
        raise AppError("PROJECT_NOT_FOUND", "生成计划书前需要项目档案", status_code=404)
    project = loads(row.payload)
    request = AgentRequest(
        requestId=new_id("REQ"),
        traceId=new_id("TRACE"),
        sessionId=new_id("SESSION"),
        userId=project["userId"],
        projectId=project_id,
        agentType="proposal",
        action="generate",
        context=AgentContext(project=project),
    )
    response = await run_agent(request, db)
    db.commit()
    return success_response(response)
