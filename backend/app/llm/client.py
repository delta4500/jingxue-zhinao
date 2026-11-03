from typing import Any

from ..config import settings
from .factory import LLMProviderFactory


async def generate_with_provider(
    provider_name: str,
    model: str,
    messages: list[dict[str, str]],
    metadata: dict[str, Any],
) -> dict[str, Any]:
    provider = LLMProviderFactory.create(provider_name)
    return await provider.generate(
        messages=messages,
        model=model,
        temperature=settings.llm_temperature,
        max_tokens=settings.llm_max_tokens,
        response_format={"type": "json_object"},
        timeout=settings.llm_timeout_seconds,
        metadata=metadata,
    )
