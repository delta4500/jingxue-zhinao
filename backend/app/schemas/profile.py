from typing import Literal

from pydantic import BaseModel, Field


class AbilityScores(BaseModel):
    programming: int = 0
    hardware: int = 0
    ai: int = 0
    writing: int = 0
    presentation: int = 0
    projectManagement: int = 0


class UserProfile(BaseModel):
    profileId: str
    userId: str
    profileSummary: str
    abilityScores: AbilityScores
    advantages: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    recommendedRoles: list[str] = Field(default_factory=list)
    recommendedDirections: list[str] = Field(default_factory=list)
    recommendedDifficulty: Literal["low", "medium", "high"] = "medium"
    resourceAssessment: str = ""
    timeAssessment: str = ""
    riskLevel: Literal["low", "medium", "high"] = "medium"
    riskNotes: list[str] = Field(default_factory=list)
    nextSuggestion: str = ""
    generatedAt: str = ""
