import { apiRequest } from "./http";

export function getWorkflow(workflowId: string) {
  return apiRequest(`/api/v1/workflows/${workflowId}`);
}

export function continueWorkflow() {
  return apiRequest("/api/v1/workflows/continue", { method: "POST" });
}
