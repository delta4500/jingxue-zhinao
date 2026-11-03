from typing import Literal

from pydantic import BaseModel, Field


class ProjectIdea(BaseModel):
    ideaId: str
    projectName: str
    oneSentenceDefinition: str
    targetUsers: list[str] = Field(default_factory=list)
    applicationScenarios: list[str] = Field(default_factory=list)
    painPoints: list[str] = Field(default_factory=list)
    coreFunctions: list[str] = Field(default_factory=list)
    softwareModules: list[str] = Field(default_factory=list)
    hardwareModules: list[str] = Field(default_factory=list)
    aiModules: list[str] = Field(default_factory=list)
    technicalRoute: list[str] = Field(default_factory=list)
    innovations: list[str] = Field(default_factory=list)
    requiredResources: list[str] = Field(default_factory=list)
    estimatedBudget: int = 0
    estimatedDuration: str = ""
    difficulty: Literal["low", "medium", "high"] = "medium"
    risks: list[str] = Field(default_factory=list)
    innovationScore: int = 0
    feasibilityScore: int = 0
    competitionFitScore: int = 0
    userCapabilityFitScore: int = 0
    presentationValueScore: int = 0
    overallScore: int = 0
    recommendationReason: str = ""


class ProjectIdeasResult(BaseModel):
    ideas: list[ProjectIdea]
    recommendedIdeaId: str = ""
    comparisonSummary: str = ""
