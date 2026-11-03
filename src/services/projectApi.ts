import { apiRequest } from "./http";

export function selectProjectIdea(payload: { sessionId: string; userId: string; selectedIdeaId: string }) {
  return apiRequest("/api/v1/project-ideas/select", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProject(projectId: string) {
  return apiRequest(`/api/v1/projects/${projectId}`);
}
