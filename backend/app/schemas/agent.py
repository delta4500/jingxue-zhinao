from typing import Any

from pydantic import BaseModel, Field

from .common import AgentType, Mode, NextAction, QualityCheck, TaskStatus, Usage


class AgentOptions(BaseModel):
    language: str = "zh-CN"
    outputFormat: str = "json"
    detailLevel: str = "detailed"


class AgentContext(BaseModel):
    user: dict[str, Any] = Field(default_factory=dict)
    profile: dict[str, Any] = Field(default_factory=dict)
    competition: dict[str, Any] = Field(default_factory=dict)
    projectIdeas: list[dict[str, Any]] = Field(default_factory=list)
    selectedIdea: dict[str, Any] = Field(default_factory=dict)
    project: dict[str, Any] = Field(default_factory=dict)
    previousAgentResult: dict[str, Any] = Field(default_factory=dict)


class AgentRequest(BaseModel):
    requestId: str = ""
    taskId: str = ""
    traceId: str = ""
    sessionId: str = Field(min_length=1)
    userId: str = Field(min_length=1)
    projectId: str = ""
    agentType: AgentType
    action: str = "generate"
    userInput: str = ""
    context: AgentContext = Field(default_factory=AgentContext)
    options: AgentOptions = Field(default_factory=AgentOptions)


class AgentResponse(BaseModel):
    success: bool = True
    taskId: str
    traceId: str
    agentType: AgentType
    provider: str = "mock"
    model: str = ""
    mode: Mode = "mock"
    status: TaskStatus = "completed"
    message: str = ""
    result: dict[str, Any] = Field(default_factory=dict)
    missingFields: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    qualityCheck: QualityCheck = Field(default_factory=QualityCheck)
    usage: Usage = Field(default_factory=Usage)
    latencyMs: int = 0
    nextAction: NextAction = Field(default_factory=NextAction)
