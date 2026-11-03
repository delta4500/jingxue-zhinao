from pydantic import BaseModel, Field


class TechnicalArchitecture(BaseModel):
    frontend: list[str] = Field(default_factory=list)
    backend: list[str] = Field(default_factory=list)
    agentSystem: list[str] = Field(default_factory=list)
    database: list[str] = Field(default_factory=list)
    externalServices: list[str] = Field(default_factory=list)


class Project(BaseModel):
    projectId: str
    userId: str
    selectedIdeaId: str
    projectName: str
    oneSentenceDefinition: str
    targetUsers: list[str] = Field(default_factory=list)
    applicationScenarios: list[str] = Field(default_factory=list)
    painPoints: list[str] = Field(default_factory=list)
    coreFunctions: list[str] = Field(default_factory=list)
    technicalArchitecture: TechnicalArchitecture
    technicalRoute: list[str] = Field(default_factory=list)
    innovations: list[str] = Field(default_factory=list)
    requiredResources: list[str] = Field(default_factory=list)
    estimatedBudget: int = 0
    estimatedDuration: str = ""
    risks: list[str] = Field(default_factory=list)
    currentStage: str = "idea_confirmed"
    completionRate: int = 0
    createdAt: str = ""
    updatedAt: str = ""
