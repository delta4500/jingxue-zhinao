export type AgentType = "user_profile" | "project_idea" | "proposal" | "master_agent";

export type TaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "timeout"
  | "cancelled"
  | "needs_input";

export interface UserInput {
  userId: string;
  name: string;
  major: string;
  grade: string;
  school: string;
  skills: string[];
  competitionExperience: string[];
  teamSize: number;
  weeklyAvailableHours: number;
  budget: number;
  hardwareResources: string[];
  softwareResources: string[];
  interests: string[];
  goals: string[];
  selectedCompetition: {
    name: string;
    track: string;
    requirements: string[];
    materials: string[];
  };
  projectPreference: {
    scenarios: string[];
    difficulty: "low" | "medium" | "high";
    additionalRequirements: string;
  };
}

export interface UserProfile {
  profileId: string;
  userId: string;
  profileSummary: string;
  abilityScores: {
    programming: number;
    hardware: number;
    ai: number;
    writing: number;
    presentation: number;
    projectManagement: number;
  };
  advantages: string[];
  weaknesses: string[];
  recommendedRoles: string[];
  recommendedDirections: string[];
  recommendedDifficulty: "low" | "medium" | "high";
  resourceAssessment: string;
  timeAssessment: string;
  riskLevel: "low" | "medium" | "high";
  riskNotes: string[];
  generatedAt: string;
}

export interface ProjectIdea {
  ideaId: string;
  projectName: string;
  oneSentenceDefinition: string;
  targetUsers: string[];
  applicationScenarios: string[];
  painPoints: string[];
  coreFunctions: string[];
  softwareModules: string[];
  hardwareModules: string[];
  aiModules: string[];
  technicalRoute: string[];
  innovations: string[];
  requiredResources: string[];
  estimatedBudget: number;
  estimatedDuration: string;
  difficulty: "low" | "medium" | "high";
  feasibilityScore: number;
  innovationScore: number;
  competitionFitScore: number;
  userCapabilityFitScore: number;
  presentationValueScore: number;
  overallScore: number;
  risks: string[];
  recommendationReason: string;
}

export interface Project {
  projectId: string;
  userId: string;
  selectedIdeaId: string;
  projectName: string;
  oneSentenceDefinition: string;
  targetUsers: string[];
  applicationScenarios: string[];
  painPoints: string[];
  coreFunctions: string[];
  technicalArchitecture: {
    frontend: string[];
    backend: string[];
    agentSystem: string[];
    database: string[];
    externalServices: string[];
  };
  technicalRoute: string[];
  innovations: string[];
  requiredResources: string[];
  estimatedBudget: number;
  estimatedDuration: string;
  risks: string[];
  currentStage: "idea_confirmed" | "proposal_draft" | "proposal_review";
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalChapter {
  chapterId: string;
  chapterNumber: string;
  title: string;
  content: string;
  sourceData: string[];
  status: "ai_draft" | "user_modified" | "confirmed" | "needs_review";
}

export interface ProposalDocument {
  documentId: string;
  projectId: string;
  documentType: "proposal";
  title: string;
  version: number;
  chapters: ProposalChapter[];
  consistencyCheck: {
    projectNameConsistent: boolean;
    technicalRouteConsistent: boolean;
    innovationConsistent: boolean;
    budgetConsistent: boolean;
    timelineConsistent: boolean;
  };
  generatedAt: string;
}

export interface AgentTask {
  taskId: string;
  traceId: string;
  userId: string;
  projectId?: string;
  sessionId: string;
  agentType: AgentType;
  status: TaskStatus;
  input: unknown;
  output: unknown;
  createdAt: string;
  completedAt?: string;
  latency: number;
}

export interface WorkflowState {
  workflowId: string;
  userId: string;
  sessionId: string;
  currentStep:
    | "profile"
    | "project_idea"
    | "idea_selection"
    | "proposal"
    | "proposal_review";
  profileCompleted: boolean;
  ideasGenerated: boolean;
  ideaSelected: boolean;
  projectCreated: boolean;
  proposalGenerated: boolean;
  selectedIdeaId: string;
  projectId: string;
  nextRecommendedAction: string;
  updatedAt: string;
}

export interface WorkflowRecord {
  user: UserInput | null;
  profile: UserProfile | null;
  ideas: ProjectIdea[];
  project: Project | null;
  proposal: ProposalDocument | null;
  tasks: AgentTask[];
  workflow: WorkflowState;
}
