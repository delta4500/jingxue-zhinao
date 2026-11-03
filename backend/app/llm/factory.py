from ..config import settings
from .base import LLMProvider
from .providers.deepseek_provider import DeepSeekProvider
from .providers.mock_provider import MockProvider
from .providers.qwen_provider import QwenProvider


class LLMProviderFactory:
    @staticmethod
    def create(provider_name: str | None = None) -> LLMProvider:
        provider = (provider_name or settings.default_llm_provider or "mock").lower()
        if settings.app_mode == "mock":
            return MockProvider()
        if provider == "qwen":
            return QwenProvider()
        if provider == "deepseek":
            return DeepSeekProvider()
        return MockProvider()
