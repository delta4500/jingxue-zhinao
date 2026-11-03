from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ...core.errors import AppError
from ...db import get_db
from ...models import AgentTaskRecord, ProjectIdeaRecord, ProjectRecord
from ...repositories.json_repo import loads, save_project, save_task, save_workflow
from ...schemas.common import ApiResponse
from ...schemas.project import Project
from ...schemas.project_idea import ProjectIdea
from ...schemas.workflow import WorkflowState
from ...services.workflow_service import create_project_from_idea, new_id, now, stable_id

router = APIRouter(tags=["projects"])


class SelectIdeaRequest(BaseModel):
    sessionId: str
    userId: str
    selectedIdeaId: str


@router.post("/project-ideas/select", response_model=ApiResponse)
def select_project_idea(body: SelectIdeaRequest, db: Session = Depends(get_db)) -> ApiResponse:
    row = (
        db.query(ProjectIdeaRecord)
        .filter(
            ProjectIdeaRecord.idea_id == body.selectedIdeaId,
            ProjectIdeaRecord.user_id == body.userId,
            ProjectIdeaRecord.session_id == body.sessionId,
        )
        .one_or_none()
    )
    if not row:
        raise AppError("INVALID_IDEA_SELECTION", "未找到当前用户会话中的项目方案", status_code=404)

    idea = ProjectIdea.model_validate(loads(row.payload))
    project = create_project_from_idea(body.userId, idea)
    trace_id = stable_id("TRACE", body.userId, body.sessionId, body.selectedIdeaId)
    workflow = WorkflowState(
        workflowId=stable_id("WF", body.userId, body.sessionId, body.selectedIdeaId),
        userId=body.userId,
        sessionId=body.sessionId,
        traceId=trace_id,
        currentStep="proposal",
        profileCompleted=True,
        ideasGenerated=True,
        ideaSelected=True,
        projectCreated=True,
        proposalGenerated=False,
        selectedIdeaId=body.selectedIdeaId,
        projectId=project.projectId,
        nextRecommendedAction="生成计划书",
        updatedAt=now(),
    )
    task = {
        "taskId": stable_id("TASK", "select", body.userId, body.sessionId, body.selectedIdeaId),
        "traceId": trace_id,
        "requestId": stable_id("REQ", "select", body.userId, body.sessionId, body.selectedIdeaId),
        "sessionId": body.sessionId,
        "userId": body.userId,
        "projectId": project.projectId,
        "agentType": "master_agent",
        "agentName": "主控 Agent",
        "provider": "mock",
        "model": "workflow-router",
        "mode": "mock",
        "status": "completed",
        "inputSummary": f"selectedIdeaId={body.selectedIdeaId}",
        "outputSummary": f"projectId={project.projectId}",
        "requestPayload": body.model_dump(),
        "latencyMs": 20,
        "inputTokens": 0,
        "outputTokens": 0,
        "createdAt": now(),
        "startedAt": now(),
        "completedAt": now(),
    }
    save_project(db, project.model_dump())
    save_workflow(db, workflow.model_dump())
    save_task(db, task)
    db.commit()
    return ApiResponse(
        success=True,
        data={"project": project.model_dump(), "workflowState": workflow.model_dump(), "task": task},
        error=None,
        traceId=trace_id,
    )


@router.post("/projects", response_model=ApiResponse)
def create_project(project: Project, db: Session = Depends(get_db)) -> ApiResponse:
    existing = db.get(ProjectRecord, project.projectId)
    if existing and existing.user_id != project.userId:
        raise AppError("PROJECT_ID_CONFLICT", "项目编号已被其他用户占用", status_code=409)
    save_project(db, project.model_dump())
    db.commit()
    return ApiResponse(success=True, data=project.model_dump(), error=None, traceId=new_id("TRACE"))


@router.get("/projects/{project_id}", response_model=ApiResponse)
def get_project(project_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    row = db.get(ProjectRecord, project_id)
    if not row:
        raise AppError("PROJECT_NOT_FOUND", "未找到项目档案", status_code=404)
    return ApiResponse(success=True, data=loads(row.payload), error=None, traceId=new_id("TRACE"))


@router.get("/projects/{project_id}/tasks", response_model=ApiResponse)
def get_project_tasks(project_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    rows = (
        db.query(AgentTaskRecord)
        .filter(AgentTaskRecord.project_id == project_id)
        .order_by(AgentTaskRecord.created_at.desc())
        .all()
    )
    return ApiResponse(success=True, data=[loads(row.payload) for row in rows], error=None, traceId=new_id("TRACE"))
