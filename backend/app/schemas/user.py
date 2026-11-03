from pydantic import BaseModel, Field


class CompetitionInfo(BaseModel):
    name: str = ""
    track: str = ""
    requirements: list[str] = Field(default_factory=list)
    materials: list[str] = Field(default_factory=list)


class ProjectPreference(BaseModel):
    scenarios: list[str] = Field(default_factory=list)
    difficulty: str = "medium"
    additionalRequirements: str = ""


class UserInput(BaseModel):
    userId: str = Field(min_length=1)
    name: str = ""
    major: str = Field(min_length=1)
    grade: str
    school: str = ""
    skills: list[str] = Field(default_factory=list)
    competitionExperience: list[str] = Field(default_factory=list)
    teamSize: int = Field(ge=1, le=100)
    weeklyAvailableHours: int = Field(ge=0, le=168)
    budget: int = Field(ge=0)
    hardwareResources: list[str] = Field(default_factory=list)
    softwareResources: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    goals: list[str] = Field(default_factory=list)
    selectedCompetition: CompetitionInfo = Field(default_factory=CompetitionInfo)
    projectPreference: ProjectPreference = Field(default_factory=ProjectPreference)
