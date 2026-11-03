import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...agents import AGENT_REGISTRY
from ...core.errors import AppError
from ...db import get_db
from ...repositories.json_repo import save_profile, save_project_idea, save_proposal, save_session, save_task, save_user
from ...schemas.agent import AgentContext, AgentRequest, AgentResponse
from ...schemas.common import ApiResponse
from ...schemas.project_idea import ProjectIdeasResult
from ...schemas.user import UserInput
from ...services.task_service import task_from_error, task_from_response

router = APIRouter(prefix="/agents", tags=["agents"])


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:10].upper()}"


def success_response(response: AgentResponse) -> ApiResponse:
    return ApiResponse(success=True, data=response.model_dump(), error=None, traceId=response.traceId)


def persist_agent_result(request: AgentRequest, response: AgentResponse, db: Session) -> None:
    if response.agentType == "user_profile":
        profile = response.result.get("profile")
        if profile:
            user = dict(request.context.user)
            user["userId"] = request.userId
            save_user(db, user)
            save_profile(db, profile)
            save_session(db, request.sessionId, request.userId, {"user": user, "profile": profile})
        return

    if response.agentType == "project_idea":
        ideas_result = ProjectIdeasResult.model_validate(response.result)
        for idea in ideas_result.ideas:
            save_project_idea(db, request.userId, request.sessionId, idea.model_dump())
        return

    if response.agentType == "proposal":
        document = response.result.get("document")
        if document:
            save_proposal(db, document)


async def run_agent(request: AgentRequest, db: Session) -> AgentResponse:
    request.requestId = request.requestId or new_id("REQ")
    request.taskId = request.taskId or new_id("TASK")
    request.traceId = request.traceId or new_id("TRACE")

    agent_cls = AGENT_REGISTRY.get(request.agentType)
    if not agent_cls:
        raise AppError("INVALID_REQUEST", f"未知 Agent 类型：{request.agentType}")

    try:
        response = await agent_cls().run(request)
    except AppError as exc:
        exc.task_id = request.taskId
        exc.trace_id = request.traceId
        save_task(db, task_from_error(request, exc.code, exc.message).model_dump())
        db.commit()
        raise
    except Exception as exc:
        app_error = AppError(
            "AGENT_EXECUTION_FAILED",
            "Agent 执行失败，请稍后重试",
            status_code=502,
            task_id=request.taskId,
            trace_id=request.traceId,
        )
        save_task(db, task_from_error(request, app_error.code, app_error.message).model_dump())
        db.commit()
        raise app_error from exc

    save_task(db, task_from_response(request, response).model_dump())
    persist_agent_result(request, response, db)
    return response


@router.post("/run", response_model=ApiResponse)
async def run_unified_agent(request: AgentRequest, db: Session = Depends(get_db)) -> ApiResponse:
    response = await run_agent(request, db)
    db.commit()
    return success_response(response)


@router.post("/profile/analyze", response_model=ApiResponse)
async def analyze_profile(user: UserInput, db: Session = Depends(get_db)) -> ApiResponse:
    request = AgentRequest(
        requestId=new_id("REQ"),
        traceId=new_id("TRACE"),
        sessionId=new_id("SESSION"),
        userId=user.userId,
        agentType="user_profile",
        action="analyze",
        context=AgentContext(user=user.model_dump(), competition=user.selectedCompetition.model_dump()),
    )
    response = await run_agent(request, db)
    db.commit()
    return success_response(response)


@router.post("/ideas/generate", response_model=ApiResponse)
async def generate_ideas(request: AgentRequest, db: Session = Depends(get_db)) -> ApiResponse:
    request.agentType = "project_idea"
    response = await run_agent(request, db)
    db.commit()
    return success_response(response)


@router.post("/proposal/generate", response_model=ApiResponse)
async def generate_proposal(request: AgentRequest, db: Session = Depends(get_db)) -> ApiResponse:
    request.agentType = "proposal"
    response = await run_agent(request, db)
    db.commit()
    return success_response(response)
