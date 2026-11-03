import type { LucideIcon } from "lucide-react";

export type ProjectStageStatus = "completed" | "current" | "pending";
export type TaskStatus = "pending" | "in_progress" | "blocked";
export type ArtifactStatus = "draft" | "confirmed" | "needs_review";

export interface ProjectStage {
  id: string;
  label: string;
  status: ProjectStageStatus;
}

export interface CurrentProject {
  id: string;
  name: string;
  fullName: string;
  competition: string;
  track: string;
  stage: string;
  progress: number;
  updatedAt: string;
  nextAction: string;
  stages: ProjectStage[];
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone: "brand" | "teal" | "gold" | "neutral";
}

export interface TodoItem {
  id: string;
  title: string;
  project: string;
  dueLabel: string;
  category: string;
  status: TaskStatus;
}

export interface ArtifactItem {
  id: string;
  title: string;
  type: string;
  updatedAt: string;
  model: string;
  status: ArtifactStatus;
  isDemo: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  kind: "system" | "ai" | "user";
}
