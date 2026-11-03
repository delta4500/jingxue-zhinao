from pydantic import BaseModel, Field


class WorkflowState(BaseModel):
    workflowId: str = "WF001"
    userId: str = "U001"
    sessionId: str = "S001"
    traceId: str = "TRACE-MVP-001"
    currentStep: str = "profile"
    profileCompleted: bool = False
    ideasGenerated: bool = False
    ideaSelected: bool = False
    projectCreated: bool = False
    proposalGenerated: bool = False
    selectedIdeaId: str = ""
    projectId: str = ""
    nextRecommendedAction: str = ""
    updatedAt: str = ""
    extra: dict = Field(default_factory=dict)
