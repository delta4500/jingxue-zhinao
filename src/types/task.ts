export interface BackendAgentTask {
  taskId: string;
  traceId: string;
  requestId: string;
  sessionId: string;
  userId: string;
  projectId: string;
  agentType: string;
  agentName: string;
  provider: string;
  model: string;
  mode: "mock" | "live";
  status: string;
  inputSummary: string;
  outputSummary: string;
  errorCode: string;
  errorMessage: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  createdAt: string;
  startedAt: string;
  completedAt: string;
}

export interface TaskListResponse {
  items: BackendAgentTask[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskFilters {
  userId?: string;
  projectId?: string;
  traceId?: string;
  agentType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
