from ..core.errors import AppError


class ModelProviderNotConfigured(AppError):
    def __init__(self, provider: str) -> None:
        super().__init__(
            code="MODEL_PROVIDER_NOT_CONFIGURED",
            message=f"{provider} 未配置 API Key 或 Base URL",
            status_code=400,
            suggested_action="请在后端 .env 中配置模型提供商信息，或切换 APP_MODE=mock",
        )


class ModelResponseError(AppError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(code=code, message=message, status_code=502, suggested_action="请重试或切换备用模型")
