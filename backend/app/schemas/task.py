from typing import Any

from pydantic import BaseModel, Field

from .common import Mode, TaskStatus


class AgentTask(BaseModel):
    taskId: str
    traceId: str
    requestId: str = ""
    sessionId: str
    userId: str
    projectId: str = ""
    agentType: str
    agentName: str
    provider: str
    model: str = ""
    mode: Mode = "mock"
    status: TaskStatus = "completed"
    inputSummary: str = ""
    outputSummary: str = ""
    requestPayload: dict[str, Any] = Field(default_factory=dict)
    errorCode: str = ""
    errorMessage: str = ""
    latencyMs: int = 0
    inputTokens: int = 0
    outputTokens: int = 0
    createdAt: str = ""
    startedAt: str = ""
    completedAt: str = ""
