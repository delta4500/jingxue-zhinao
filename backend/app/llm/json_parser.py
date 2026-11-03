import json
import re
from typing import Any

from ..core.errors import AppError


def strip_markdown_json(text: str) -> str:
    cleaned = text.strip()
    match = re.search(r"```(?:json)?\s*(.*?)```", cleaned, flags=re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return cleaned


def parse_json_content(content: str) -> dict[str, Any]:
    try:
        parsed = json.loads(strip_markdown_json(content))
    except json.JSONDecodeError as exc:
        raise AppError(
            code="INVALID_AGENT_RESPONSE",
            message="模型返回内容不是合法 JSON",
            status_code=502,
            suggested_action="请降低温度、检查 Prompt 或使用 Mock 模式验证结构",
        ) from exc
    if not isinstance(parsed, dict):
        raise AppError(
            code="JSON_VALIDATION_FAILED",
            message="模型返回 JSON 顶层必须是对象",
            status_code=502,
        )
    return parsed
