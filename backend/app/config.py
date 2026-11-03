import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def _float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, str(default)))
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    app_env: str = os.getenv("APP_ENV", "development")
    app_mode: str = os.getenv("APP_MODE", "mock")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = _int("PORT", 8000)
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./jingxue.db")
    cors_origins: tuple[str, ...] = tuple(
        item.strip()
        for item in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if item.strip()
    )

    default_llm_provider: str = os.getenv("DEFAULT_LLM_PROVIDER", "mock")
    backup_llm_provider: str = os.getenv("BACKUP_LLM_PROVIDER", "mock")

    qwen_api_key: str = os.getenv("QWEN_API_KEY", "")
    qwen_base_url: str = os.getenv("QWEN_BASE_URL", "")
    qwen_model: str = os.getenv("QWEN_MODEL", "")

    deepseek_api_key: str = os.getenv("DEEPSEEK_API_KEY", "")
    deepseek_base_url: str = os.getenv("DEEPSEEK_BASE_URL", "")
    deepseek_model: str = os.getenv("DEEPSEEK_MODEL", "")

    master_agent_provider: str = os.getenv("MASTER_AGENT_PROVIDER", "")
    master_agent_model: str = os.getenv("MASTER_AGENT_MODEL", "")
    profile_agent_provider: str = os.getenv("PROFILE_AGENT_PROVIDER", "")
    profile_agent_model: str = os.getenv("PROFILE_AGENT_MODEL", "")
    idea_agent_provider: str = os.getenv("IDEA_AGENT_PROVIDER", "")
    idea_agent_model: str = os.getenv("IDEA_AGENT_MODEL", "")
    proposal_agent_provider: str = os.getenv("PROPOSAL_AGENT_PROVIDER", "")
    proposal_agent_model: str = os.getenv("PROPOSAL_AGENT_MODEL", "")

    llm_timeout_seconds: int = _int("LLM_TIMEOUT_SECONDS", 60)
    llm_max_retries: int = _int("LLM_MAX_RETRIES", 2)
    llm_temperature: float = _float("LLM_TEMPERATURE", 0.7)
    llm_max_tokens: int = _int("LLM_MAX_TOKENS", 4096)

    request_body_limit_bytes: int = _int("REQUEST_BODY_LIMIT_BYTES", 1024 * 1024)


settings = Settings()
