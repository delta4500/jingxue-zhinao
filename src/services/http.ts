import { runtimeConfig } from "../config/runtime";
import type { ApiResponse } from "../types/api";

export class HttpError extends Error {
  code: string;
  traceId: string;

  constructor(message: string, code = "NETWORK_ERROR", traceId = "") {
    super(message);
    this.code = code;
    this.traceId = traceId;
  }
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(path, runtimeConfig.apiBaseUrl);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), runtimeConfig.requestTimeoutMs);
  const requestId = crypto.randomUUID();
  try {
    const response = await fetch(buildUrl(path, options.query), {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        ...(options.headers ?? {}),
      },
    });
    const payload = (await response.json()) as ApiResponse<T>;
    if (!response.ok || !payload.success) {
      throw new HttpError(payload.error?.message ?? "请求失败", payload.error?.code ?? "HTTP_ERROR", payload.traceId);
    }
    return payload.data as T;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new HttpError("请求超时，请检查后端服务是否启动", "REQUEST_TIMEOUT");
    }
    throw new HttpError("无法连接后端服务，请确认 FastAPI 已启动", "NETWORK_ERROR");
  } finally {
    window.clearTimeout(timer);
  }
}
