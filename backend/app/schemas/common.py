from datetime import UTC, datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


TaskStatus = Literal["pending", "running", "completed", "failed", "timeout", "cancelled", "needs_input"]
AgentType = Literal["master_agent", "user_profile", "project_idea", "proposal"]
Mode = Literal["mock", "live"]


class QualityCheck(BaseModel):
    structureValid: bool = True
    contentComplete: bool = True
    contextUsed: bool = True
    hallucinationRisk: Literal["low", "medium", "high"] = "low"


class Usage(BaseModel):
    inputTokens: int = 0
    outputTokens: int = 0
    totalTokens: int = 0


class NextAction(BaseModel):
    type: str = ""
    label: str = ""
    targetAgent: str = ""
    requiredData: list[str] = Field(default_factory=list)


class ErrorBody(BaseModel):
    code: str
    message: str
    recoverable: bool = True
    suggestedAction: str = ""


class ApiResponse(BaseModel):
    success: bool
    data: Any | None = None
    error: ErrorBody | None = None
    traceId: str = ""
    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat().replace("+00:00", "Z"))
