import time
import uuid
from typing import Any

from pydantic import BaseModel, ValidationError

from ..config import settings
from ..core.errors import AppError
from ..llm.client import generate_with_provider
from ..llm.json_parser import parse_json_content
from ..llm.retry import with_retries
from ..schemas.agent import AgentRequest, AgentResponse
from ..schemas.common import NextAction, QualityCheck, Usage


AGENT_NAMES = {
    "master_agent": "主控 Agent",
    "user_profile": "用户画像 Agent",
    "project_idea": "项目创意 Agent",
    "proposal": "计划书 Agent",
}


class BaseAgent:
    agent_type = "master_agent"
    system_prompt = ""
    result_schema: type[BaseModel] | None = None

    def provider_and_model(self) -> tuple[str, str]:
        provider = getattr(settings, f"{self.agent_type}_provider", "") or settings.default_llm_provider
        model = getattr(settings, f"{self.agent_type}_model", "")
        if provider == "qwen":
            model = model or settings.qwen_model
        elif provider == "deepseek":
            model = model or settings.deepseek_model
        else:
            provider = "mock"
            model = "mock-agent"
        return provider, model

    def build_messages(self, request: AgentRequest) -> list[dict[str, str]]:
        return [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": request.model_dump_json()},
        ]

    def next_action(self) -> NextAction:
        return NextAction(type="continue_workflow", label="继续流程", targetAgent="master_agent", requiredData=[])

    @staticmethod
    def _new_id(prefix: str) -> str:
        return f"{prefix}-{uuid.uuid4().hex[:10].upper()}"

    def normalize_identifiers(self, raw: dict[str, Any], request: AgentRequest) -> dict[str, Any]:
        """Replace identifiers from mock/LLM output with request-scoped server IDs."""
        if self.agent_type == "user_profile" and isinstance(raw.get("profile"), dict):
            raw["profile"]["profileId"] = self._new_id("UP")
            raw["profile"]["userId"] = request.userId

        if self.agent_type == "project_idea" and isinstance(raw.get("ideas"), list):
            idea_id_map: dict[str, str] = {}
            for idea in raw["ideas"]:
                if isinstance(idea, dict):
                    old_id = str(idea.get("ideaId", ""))
                    new_id = self._new_id("IDEA")
                    idea["ideaId"] = new_id
                    if old_id:
                        idea_id_map[old_id] = new_id
            recommended_id = str(raw.get("recommendedIdeaId", ""))
            if recommended_id in idea_id_map:
                raw["recommendedIdeaId"] = idea_id_map[recommended_id]

        if self.agent_type == "proposal" and isinstance(raw.get("document"), dict):
            document = raw["document"]
            document["documentId"] = self._new_id("DOC")
            if request.projectId:
                document["projectId"] = request.projectId
            for chapter in document.get("chapters", []):
                if isinstance(chapter, dict):
                    chapter["chapterId"] = self._new_id("CH")

        workflow = raw.get("workflowState")
        if self.agent_type == "master_agent" and isinstance(workflow, dict):
            workflow["workflowId"] = self._new_id("WF")
            workflow["userId"] = request.userId
            workflow["sessionId"] = request.sessionId
            workflow["traceId"] = request.traceId
        return raw

    def validate_result(self, raw: dict[str, Any]) -> dict[str, Any]:
        if self.result_schema is None:
            return raw
        try:
            if "profile" in raw:
                self.result_schema.model_validate(raw["profile"])
            elif "document" in raw:
                self.result_schema.model_validate(raw["document"])
            else:
                self.result_schema.model_validate(raw)
        except ValidationError as exc:
            raise AppError(
                code="JSON_VALIDATION_FAILED",
                message=f"{AGENT_NAMES.get(self.agent_type, self.agent_type)} 输出结构校验失败",
                status_code=502,
                suggested_action="检查模型Prompt或切换Mock模式",
            ) from exc
        return raw

    async def run(self, request: AgentRequest) -> AgentResponse:
        start = time.perf_counter()
        task_id = request.taskId or f"TASK-{uuid.uuid4().hex[:8].upper()}"
        trace_id = request.traceId or f"TRACE-{uuid.uuid4().hex[:8].upper()}"
        provider, model = self.provider_and_model()
        messages = self.build_messages(request)

        llm_result = await with_retries(
            lambda: generate_with_provider(provider, model, messages, {"agentType": self.agent_type}),
            settings.llm_max_retries,
        )
        parsed = parse_json_content(llm_result["content"])
        normalized = self.normalize_identifiers(parsed, request)
        validated = self.validate_result(normalized)
        usage = llm_result.get("usage", {})
        latency = int((time.perf_counter() - start) * 1000)

        return AgentResponse(
            success=True,
            taskId=task_id,
            traceId=trace_id,
            agentType=self.agent_type,  # type: ignore[arg-type]
            provider=llm_result.get("provider", provider),
            model=llm_result.get("model", model),
            mode=settings.app_mode,  # type: ignore[arg-type]
            status="completed",
            message=f"{AGENT_NAMES.get(self.agent_type, self.agent_type)} 执行完成",
            result=validated,
            qualityCheck=QualityCheck(structureValid=True, contentComplete=True, contextUsed=True, hallucinationRisk="low"),
            usage=Usage(
                inputTokens=int(usage.get("prompt_tokens", usage.get("inputTokens", 0)) or 0),
                outputTokens=int(usage.get("completion_tokens", usage.get("outputTokens", 0)) or 0),
                totalTokens=int(usage.get("total_tokens", usage.get("totalTokens", 0)) or 0),
            ),
            latencyMs=latency,
            nextAction=self.next_action(),
        )
