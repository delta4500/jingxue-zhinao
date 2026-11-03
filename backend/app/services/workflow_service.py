from datetime import UTC, datetime
from typing import Any
import uuid

from ..schemas.project import Project, TechnicalArchitecture
from ..schemas.project_idea import ProjectIdea
from ..schemas.workflow import WorkflowState


def now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:10].upper()}"


def stable_id(prefix: str, *parts: str) -> str:
    value = ":".join(parts)
    return f"{prefix}-{uuid.uuid5(uuid.NAMESPACE_URL, value).hex[:10].upper()}"


def workflow_for(user_id: str, session_id: str, trace_id: str = "") -> WorkflowState:
    return WorkflowState(
        workflowId=new_id("WF"),
        userId=user_id,
        sessionId=session_id,
        traceId=trace_id or new_id("TRACE"),
        currentStep="profile",
        nextRecommendedAction="生成用户画像",
        updatedAt=now(),
    )


def create_project_from_idea(user_id: str, idea: ProjectIdea) -> Project:
    return Project(
        projectId=stable_id("PROJECT", user_id, idea.ideaId),
        userId=user_id,
        selectedIdeaId=idea.ideaId,
        projectName=idea.projectName,
        oneSentenceDefinition=idea.oneSentenceDefinition,
        targetUsers=idea.targetUsers,
        applicationScenarios=idea.applicationScenarios,
        painPoints=idea.painPoints,
        coreFunctions=idea.coreFunctions,
        technicalArchitecture=TechnicalArchitecture(
            frontend=["React", "Vite", "TypeScript", "Tailwind CSS"],
            backend=["FastAPI", "SQLAlchemy", "SQLite", "Agent Service"],
            agentSystem=["主控Agent", "用户画像Agent", "项目创意Agent", "计划书Agent"],
            database=["users", "user_profiles", "project_ideas", "projects", "proposals", "agent_tasks", "workflows"],
            externalServices=["Qwen", "DeepSeek", "MockProvider"],
        ),
        technicalRoute=idea.technicalRoute,
        innovations=idea.innovations,
        requiredResources=idea.requiredResources,
        estimatedBudget=idea.estimatedBudget,
        estimatedDuration=idea.estimatedDuration,
        risks=idea.risks,
        currentStage="idea_confirmed",
        completionRate=62,
        createdAt=now(),
        updatedAt=now(),
    )


def summarize(value: Any, max_len: int = 120) -> str:
    text = str(value).replace("\n", " ")
    return text[:max_len] + ("..." if len(text) > max_len else "")
