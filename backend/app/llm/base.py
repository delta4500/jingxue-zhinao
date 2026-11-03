from abc import ABC, abstractmethod
from typing import Any


class LLMProvider(ABC):
    provider_name: str

    @abstractmethod
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
        raise NotImplementedError
