import asyncio
from collections.abc import Awaitable, Callable
from typing import TypeVar

T = TypeVar("T")


async def with_retries(fn: Callable[[], Awaitable[T]], retries: int) -> T:
    last_error: Exception | None = None
    for attempt in range(retries + 1):
        try:
            return await fn()
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            if attempt < retries:
                await asyncio.sleep(0.4 * (attempt + 1))
    assert last_error is not None
    raise last_error
