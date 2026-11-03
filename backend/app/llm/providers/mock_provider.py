import json
from pathlib import Path
from typing import Any

from ..base import LLMProvider


class MockProvider(LLMProvider):
    provider_name = "mock"

    async def generate(
        self,
        messages: list[dict[str, str]],
        model: str,
        temperature: float,
        max_tokens: int,
        response_format: dict[str, Any] | None,
        timeout: int,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        agent_type = (metadata or {}).get("agentType", "master_agent")
        data_dir = Path(__file__).resolve().parents[2] / "mock_data"
        file_map = {
            "user_profile": "profile.json",
            "project_idea": "project_ideas.json",
            "proposal": "proposal.json",
            "master_agent": "master.json",
        }
        payload = json.loads((data_dir / file_map.get(agent_type, "master.json")).read_text(encoding="utf-8"))
        return {
            "provider": self.provider_name,
            "model": "mock-agent",
            "content": json.dumps(payload, ensure_ascii=False),
            "usage": {"inputTokens": 0, "outputTokens": 0, "totalTokens": 0},
        }
