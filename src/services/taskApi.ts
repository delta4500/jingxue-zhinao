import { apiRequest } from "./http";
import type { BackendAgentTask, TaskFilters, TaskListResponse } from "../types/task";

export function listTasks(filters: TaskFilters = {}) {
  return apiRequest<TaskListResponse>("/api/v1/tasks", {
    query: {
      userId: filters.userId,
      projectId: filters.projectId,
      traceId: filters.traceId,
      agentType: filters.agentType,
      status: filters.status,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  });
}

export function getTask(taskId: string) {
  return apiRequest<BackendAgentTask>(`/api/v1/tasks/${taskId}`);
}

export function retryTask(taskId: string) {
  return apiRequest<BackendAgentTask>(`/api/v1/tasks/${taskId}/retry`, { method: "POST" });
}
