from pydantic import BaseModel, Field


class ProposalChapter(BaseModel):
    chapterId: str
    chapterNumber: str
    title: str
    content: str
    sourceData: list[str] = Field(default_factory=list)
    status: str = "ai_draft"


class ConsistencyCheck(BaseModel):
    projectNameConsistent: bool = True
    technicalRouteConsistent: bool = True
    innovationConsistent: bool = True
    budgetConsistent: bool = True
    timelineConsistent: bool = True


class ProposalDocument(BaseModel):
    documentId: str
    projectId: str
    documentType: str = "proposal"
    title: str
    version: int = 1
    chapters: list[ProposalChapter]
    consistencyCheck: ConsistencyCheck = Field(default_factory=ConsistencyCheck)
    generatedAt: str = ""
