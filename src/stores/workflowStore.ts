import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoUserInput, initialWorkflowState } from "../data/demo/workflow";
import {
  analyzeUserProfile,
  createAgentTask,
  createProjectFromIdea,
  generateProjectIdeas,
  generateProposal,
} from "../services/workflowEngine";
import type { ProjectIdea, UserInput, WorkflowRecord } from "../types/workflow";

interface WorkflowStore extends WorkflowRecord {
  hydrateDemo: () => void;
  submitUserInfo: (user: UserInput) => void;
  runProfileAndIdeas: () => void;
  selectIdea: (ideaId: string) => void;
  runProposal: () => void;
  resetWorkflow: () => void;
}

const blankRecord: WorkflowRecord = {
  user: null,
  profile: null,
  ideas: [],
  project: null,
  proposal: null,
  tasks: [],
  workflow: initialWorkflowState,
};

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      ...blankRecord,
      hydrateDemo: () => {
        if (get().user) return;
        set({ user: demoUserInput });
      },
      submitUserInfo: (user) => {
        set({
          user,
          workflow: {
            ...get().workflow,
            userId: user.userId,
            currentStep: "project_idea",
            nextRecommendedAction: "生成用户画像与项目创意",
            updatedAt: new Date().toISOString(),
          },
        });
      },
      runProfileAndIdeas: () => {
        const user = get().user ?? demoUserInput;
        const profile = analyzeUserProfile(user);
        const ideas = generateProjectIdeas(user, profile);
        const profileTask = createAgentTask("user_profile", user.userId, user, { profile });
        const ideaTask = createAgentTask("project_idea", user.userId, { user, profile }, { ideas });

        set({
          user,
          profile,
          ideas,
          tasks: [profileTask, ideaTask, ...get().tasks],
          workflow: {
            ...get().workflow,
            currentStep: "idea_selection",
            profileCompleted: true,
            ideasGenerated: true,
            nextRecommendedAction: "选择一个项目方案",
            updatedAt: new Date().toISOString(),
          },
        });
      },
      selectIdea: (ideaId) => {
        const user = get().user ?? demoUserInput;
        const idea = get().ideas.find((item: ProjectIdea) => item.ideaId === ideaId);
        if (!idea) return;
        const project = createProjectFromIdea(user, idea);
        const task = createAgentTask("master_agent", user.userId, { selectedIdeaId: ideaId }, { project }, project.projectId);

        set({
          project,
          tasks: [task, ...get().tasks],
          workflow: {
            ...get().workflow,
            currentStep: "proposal",
            ideaSelected: true,
            projectCreated: true,
            selectedIdeaId: ideaId,
            projectId: project.projectId,
            nextRecommendedAction: "生成竞赛计划书",
            updatedAt: new Date().toISOString(),
          },
        });
      },
      runProposal: () => {
        const project = get().project;
        const profile = get().profile;
        const user = get().user ?? demoUserInput;
        if (!project || !profile) return;
        const proposal = generateProposal(project, profile);
        const task = createAgentTask("proposal", user.userId, { project, profile }, { document: proposal }, project.projectId);

        set({
          proposal,
          project: {
            ...project,
            currentStage: "proposal_review",
            completionRate: 78,
            updatedAt: new Date().toISOString(),
          },
          tasks: [task, ...get().tasks],
          workflow: {
            ...get().workflow,
            currentStep: "proposal_review",
            proposalGenerated: true,
            nextRecommendedAction: "检查并修改计划书",
            updatedAt: new Date().toISOString(),
          },
        });
      },
      resetWorkflow: () => {
        set({ ...blankRecord, user: demoUserInput });
      },
    }),
    {
      name: "jingxue-workflow-store",
    },
  ),
);
