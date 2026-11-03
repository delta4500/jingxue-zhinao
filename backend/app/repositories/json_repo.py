import json
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from ..models import (
    AgentTaskRecord,
    ProjectIdeaRecord,
    ProjectRecord,
    ProjectVersionRecord,
    ProposalChapterRecord,
    ProposalRecord,
    SessionRecord,
    UserProfileRecord,
    UserRecord,
    WorkflowRecord,
)


def dumps(payload: Any) -> str:
    return json.dumps(payload, ensure_ascii=False, default=str)


def loads(payload: str) -> Any:
    return json.loads(payload)


def save_user(db: Session, user: dict) -> None:
    record = db.get(UserRecord, user["userId"])
    if record:
        record.payload = dumps(user)
        record.updated_at = datetime.utcnow()
    else:
        db.add(UserRecord(user_id=user["userId"], payload=dumps(user)))


def save_profile(db: Session, profile: dict) -> None:
    db.merge(UserProfileRecord(profile_id=profile["profileId"], user_id=profile["userId"], payload=dumps(profile)))


def save_project(db: Session, project: dict) -> None:
    db.merge(
        ProjectRecord(
            project_id=project["projectId"],
            user_id=project["userId"],
            selected_idea_id=project.get("selectedIdeaId", ""),
            payload=dumps(project),
            version=1,
        )
    )
    db.merge(
        ProjectVersionRecord(
            version_id=f"{project['projectId']}-v1",
            project_id=project["projectId"],
            version=1,
            payload=dumps(project),
        )
    )


def save_project_idea(db: Session, user_id: str, session_id: str, idea: dict) -> None:
    db.merge(
        ProjectIdeaRecord(
            idea_id=idea["ideaId"],
            user_id=user_id,
            session_id=session_id,
            payload=dumps(idea),
        )
    )


def save_proposal(db: Session, proposal: dict) -> None:
    db.merge(
        ProposalRecord(
            document_id=proposal["documentId"],
            project_id=proposal["projectId"],
            payload=dumps(proposal),
            version=proposal.get("version", 1),
        )
    )
    for chapter in proposal.get("chapters", []):
        db.merge(
            ProposalChapterRecord(
                chapter_id=chapter["chapterId"],
                document_id=proposal["documentId"],
                project_id=proposal["projectId"],
                payload=dumps(chapter),
            )
        )


def save_session(db: Session, session_id: str, user_id: str, payload: dict) -> None:
    db.merge(SessionRecord(session_id=session_id, user_id=user_id, payload=dumps(payload)))


def save_task(db: Session, task: dict) -> None:
    db.merge(
        AgentTaskRecord(
            task_id=task["taskId"],
            trace_id=task.get("traceId", ""),
            request_id=task.get("requestId", ""),
            session_id=task.get("sessionId", ""),
            user_id=task.get("userId", ""),
            project_id=task.get("projectId", ""),
            agent_type=task.get("agentType", ""),
            status=task.get("status", "completed"),
            provider=task.get("provider", ""),
            model=task.get("model", ""),
            mode=task.get("mode", "mock"),
            latency_ms=task.get("latencyMs", 0),
            payload=dumps(task),
            completed_at=datetime.utcnow(),
        )
    )


def save_workflow(db: Session, workflow: dict) -> None:
    db.merge(
        WorkflowRecord(
            workflow_id=workflow["workflowId"],
            user_id=workflow["userId"],
            session_id=workflow["sessionId"],
            project_id=workflow.get("projectId", ""),
            trace_id=workflow.get("traceId", ""),
            payload=dumps(workflow),
            updated_at=datetime.utcnow(),
        )
    )


def latest_payload(db: Session, model: type, order_column: Any) -> dict | None:
    row = db.query(model).order_by(order_column.desc()).first()
    return loads(row.payload) if row else None
