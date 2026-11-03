from typing import Any

import httpx

from ...config import settings
from ..base import LLMProvider
from ..exceptions import ModelProviderNotConfigured, ModelResponseError


class DeepSeekProvider(LLMProvider):
    provider_name = "deepseek"

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
        if not settings.deepseek_api_key or not settings.deepseek_base_url:
            raise ModelProviderNotConfigured("deepseek")
        payload = {
            "model": model or settings.deepseek_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format
        headers = {"Authorization": f"Bearer {settings.deepseek_api_key}", "Content-Type": "application/json"}
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(settings.deepseek_base_url.rstrip("/") + "/chat/completions", json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
        except httpx.TimeoutException as exc:
            raise ModelResponseError("MODEL_TIMEOUT", "DeepSeek 模型调用超时") from exc
        except httpx.HTTPStatusError as exc:
            raise ModelResponseError("MODEL_AUTHENTICATION_FAILED", f"DeepSeek 调用失败：HTTP {exc.response.status_code}") from exc
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not content:
            raise ModelResponseError("MODEL_RESPONSE_EMPTY", "DeepSeek 返回内容为空")
        usage = data.get("usage", {})
        return {"provider": self.provider_name, "model": payload["model"], "content": content, "usage": usage}
