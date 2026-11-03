import { apiRequest } from "./http";

export function runAgent<TRequest extends object, TResponse>(payload: TRequest) {
  return apiRequest<TResponse>("/api/v1/agents/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
