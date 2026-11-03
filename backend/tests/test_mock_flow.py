import os
import tempfile
from copy import deepcopy
from pathlib import Path

import pytest


TEST_DATA_DIR = tempfile.TemporaryDirectory()
TEST_DB_PATH = Path(TEST_DATA_DIR.name) / "jingxue-test.db"
os.environ["APP_MODE"] = "mock"
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.as_posix()}"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


USER_PAYLOAD = {
    "userId": "U001",
    "name": "李同学",
    "major": "通信工程",
    "grade": "大一",
    "school": "河南某高校",
    "skills": ["C语言", "STM32基础"],
    "competitionExperience": ["无正式参赛经验"],
    "teamSize": 3,
    "weeklyAvailableHours": 12,
    "budget": 2000,
    "hardwareResources": ["STM32", "ESP32"],
    "softwareResources": ["Coze", "VS Code"],
    "interests": ["AI+教育"],
    "goals": ["参加大学生AI创新竞赛"],
    "selectedCompetition": {"name": "大学生AI创新竞赛", "track": "AI+教育", "requirements": [], "materials": []},
    "projectPreference": {"scenarios": ["竞赛选题"], "difficulty": "medium", "additionalRequirements": ""},
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["data"]["mode"] in {"mock", "live"}


def test_mock_profile_generation_uses_api_envelope(client: TestClient):
    response = client.post("/api/v1/agents/profile/analyze", json=USER_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["timestamp"]
    assert body["data"]["agentType"] == "user_profile"
    assert body["data"]["mode"] == "mock"
    assert body["data"]["result"]["profile"]["userId"] == "U001"


def test_generated_profile_ids_do_not_collide_between_users(client: TestClient):
    first = client.post("/api/v1/agents/profile/analyze", json=USER_PAYLOAD).json()["data"]
    second_payload = deepcopy(USER_PAYLOAD)
    second_payload["userId"] = "U002"
    second = client.post("/api/v1/agents/profile/analyze", json=second_payload).json()["data"]

    assert first["taskId"] != second["taskId"]
    assert first["traceId"] != second["traceId"]
    assert first["result"]["profile"]["profileId"] != second["result"]["profile"]["profileId"]
    assert second["result"]["profile"]["userId"] == "U002"


def test_idea_selection_is_scoped_to_user_and_session(client: TestClient):
    request_payload = {
        "sessionId": "SESSION-OWNER",
        "userId": "OWNER",
        "agentType": "project_idea",
        "context": {"user": {**USER_PAYLOAD, "userId": "OWNER"}},
    }
    ideas_response = client.post("/api/v1/agents/ideas/generate", json=request_payload)
    assert ideas_response.status_code == 200
    ideas_data = ideas_response.json()["data"]["result"]
    idea_id = ideas_data["ideas"][0]["ideaId"]
    assert ideas_data["recommendedIdeaId"] in {idea["ideaId"] for idea in ideas_data["ideas"]}

    forbidden = client.post(
        "/api/v1/project-ideas/select",
        json={"sessionId": "SESSION-OWNER", "userId": "OTHER", "selectedIdeaId": idea_id},
    )
    assert forbidden.status_code == 404

    selected_once = client.post(
        "/api/v1/project-ideas/select",
        json={"sessionId": "SESSION-OWNER", "userId": "OWNER", "selectedIdeaId": idea_id},
    )
    selected_twice = client.post(
        "/api/v1/project-ideas/select",
        json={"sessionId": "SESSION-OWNER", "userId": "OWNER", "selectedIdeaId": idea_id},
    )
    assert selected_once.status_code == 200
    assert selected_once.json()["data"]["project"]["projectId"] == selected_twice.json()["data"]["project"]["projectId"]
    assert selected_once.json()["data"]["task"]["taskId"] == selected_twice.json()["data"]["task"]["taskId"]


def test_task_list(client: TestClient):
    client.post("/api/v1/agents/profile/analyze", json=USER_PAYLOAD)
    response = client.get("/api/v1/tasks", params={"userId": "U001"})
    assert response.status_code == 200
    assert response.json()["data"]["total"] >= 1


def test_invalid_user_input_returns_422(client: TestClient):
    invalid = deepcopy(USER_PAYLOAD)
    invalid["teamSize"] = 0
    invalid["budget"] = -1
    response = client.post("/api/v1/agents/profile/analyze", json=invalid)
    assert response.status_code == 422
