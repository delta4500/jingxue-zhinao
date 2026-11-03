from datetime import UTC, datetime

from ..agents.base_agent import AGENT_NAMES
from ..schemas.agent import AgentRequest, AgentResponse
from ..schemas.task import AgentTask
from .workflow_service import summarize


def utc_now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def task_from_response(request: AgentRequest, response: AgentResponse) -> AgentTask:
    now = utc_now()
    return AgentTask(
        taskId=response.taskId,
        traceId=response.traceId,
        requestId=request.requestId,
        sessionId=request.sessionId,
        userId=request.userId,
        projectId=request.projectId,
        agentType=response.agentType,
        agentName=AGENT_NAMES.get(response.agentType, response.agentType),
        provider=response.provider,
        model=response.model,
        mode=response.mode,
        status=response.status,
        inputSummary=summarize(request.context.model_dump()),
        outputSummary=summarize(response.result),
        requestPayload=request.model_dump(),
        errorCode="",
        errorMessage="",
        latencyMs=response.latencyMs,
        inputTokens=response.usage.inputTokens,
        outputTokens=response.usage.outputTokens,
        createdAt=now,
        startedAt=now,
        completedAt=now,
    )


def task_from_error(request: AgentRequest, error_code: str, error_message: str) -> AgentTask:
    now = utc_now()
    return AgentTask(
        taskId=request.taskId,
        traceId=request.traceId,
        requestId=request.requestId,
        sessionId=request.sessionId,
        userId=request.userId,
        projectId=request.projectId,
        agentType=request.agentType,
        agentName=AGENT_NAMES.get(request.agentType, request.agentType),
        provider="",
        model="",
        mode="mock",
        status="failed",
        inputSummary=summarize(request.context.model_dump()),
        requestPayload=request.model_dump(),
        errorCode=error_code,
        errorMessage=error_message,
        createdAt=now,
        startedAt=now,
        completedAt=now,
    )
