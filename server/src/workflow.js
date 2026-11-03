const stamp = () => new Date().toISOString();
const id = (prefix) => `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export function createWorkflowState(userId = "U001", sessionId = "S001") {
  return {
    workflowId: "WF001",
    userId,
    sessionId,
    currentStep: "profile",
    profileCompleted: false,
    ideasGenerated: false,
    ideaSelected: false,
    projectCreated: false,
    proposalGenerated: false,
    selectedIdeaId: "",
    projectId: "",
    nextRecommendedAction: "填写个人与团队信息",
    updatedAt: stamp(),
  };
}

export function task(agentType, userId, input, output, projectId = "") {
  return {
    taskId: id("T"),
    traceId: "TRACE-MVP-001",
    userId,
    projectId,
    sessionId: "S001",
    agentType,
    status: "completed",
    input,
    output,
    errorCode: "",
    errorMessage: "",
    createdAt: stamp(),
    startedAt: stamp(),
    completedAt: stamp(),
    latency: 380,
  };
}

export function analyzeProfile(user) {
  return {
    profileId: "UP001",
    userId: user.userId,
    profileSummary: `${user.grade}${user.major}学生，${user.teamSize} 人团队，具备 ${user.skills.join("、")} 基础，适合完成中等难度 AI 竞赛项目。`,
    abilityScores: {
      programming: 58,
      hardware: 62,
      ai: 44,
      writing: 66,
      presentation: 48,
      projectManagement: 42,
    },
    advantages: ["目标方向明确", "团队资源可支撑 MVP", "适合网页 + Agent 工作流路线"],
    weaknesses: ["竞赛经验不足", "AI 工程能力需补强", "答辩表达需要训练"],
    recommendedRoles: ["项目负责人", "前端与材料负责人", "智能体配置负责人"],
    recommendedDirections: ["AI+教育", "竞赛项目工作台", "计划书生成"],
    recommendedDifficulty: "medium",
    resourceAssessment: "当前预算与资源适合先完成软件闭环，硬件作为展示增强。",
    timeAssessment: "建议 4-6 周完成 V1 闭环。",
    riskLevel: "medium",
    riskNotes: ["控制功能范围", "保留人工确认", "输出必须结构化"],
    generatedAt: stamp(),
  };
}

export function generateIdeas(user, profile) {
  return [
    {
      ideaId: "I001",
      projectName: "竞学智脑",
      oneSentenceDefinition: "面向大学生竞赛的证据增强型 AI 项目工作台。",
      targetUsers: ["竞赛新手", "参赛团队", "指导教师"],
      applicationScenarios: ["选题", "项目立项", "计划书撰写"],
      painPoints: ["方向不清", "材料难写", "上下文不能继承"],
      coreFunctions: ["用户画像", "创意生成", "项目档案", "计划书生成"],
      softwareModules: ["React 工作台", "Node API", "状态机"],
      hardwareModules: ["可选智能硬件演示"],
      aiModules: ["画像 Agent", "创意 Agent", "计划书 Agent"],
      technicalRoute: ["表单收集", "画像分析", "创意生成", "项目归档", "计划书生成"],
      innovations: ["多 Agent 串联", "项目档案作为事实源", "JSON 可保存输出"],
      requiredResources: ["比赛资料", "用户画像", "模型 API"],
      estimatedBudget: Math.min(user.budget ?? 2000, 1800),
      estimatedDuration: "4-6 周",
      difficulty: "medium",
      feasibilityScore: 92,
      innovationScore: 88,
      competitionFitScore: 91,
      userCapabilityFitScore: 87,
      presentationValueScore: 90,
      overallScore: 90,
      risks: ["模型接入需要后端代理", "计划书需一致性检查"],
      recommendationReason: `匹配 ${profile.recommendedDirections.join("、")}，适合作为 V1 主案例。`,
    },
    {
      ideaId: "I002",
      projectName: "赛程智导",
      oneSentenceDefinition: "把比赛规则转成备赛任务的智能进度管理系统。",
      targetUsers: ["参赛团队", "竞赛社团"],
      applicationScenarios: ["报名", "任务拆解", "节点提醒"],
      painPoints: ["截止时间遗漏", "材料版本混乱"],
      coreFunctions: ["规则录入", "任务看板", "风险预警"],
      softwareModules: ["规则解析", "任务中心"],
      hardwareModules: ["无"],
      aiModules: ["规则解析 Agent", "任务拆解 Agent"],
      technicalRoute: ["输入规则", "抽取材料", "生成任务", "跟踪状态"],
      innovations: ["规则文本转任务状态机"],
      requiredResources: ["比赛通知", "团队信息"],
      estimatedBudget: 800,
      estimatedDuration: "3-5 周",
      difficulty: "medium",
      feasibilityScore: 94,
      innovationScore: 78,
      competitionFitScore: 84,
      userCapabilityFitScore: 90,
      presentationValueScore: 76,
      overallScore: 84,
      risks: ["展示张力较弱"],
      recommendationReason: "落地性强，但不如竞学智脑完整。",
    },
  ];
}

export function createProject(user, idea) {
  return {
    projectId: "P001",
    userId: user.userId,
    selectedIdeaId: idea.ideaId,
    projectName: idea.projectName,
    oneSentenceDefinition: idea.oneSentenceDefinition,
    targetUsers: idea.targetUsers,
    applicationScenarios: idea.applicationScenarios,
    painPoints: idea.painPoints,
    coreFunctions: idea.coreFunctions,
    technicalArchitecture: {
      frontend: ["React", "Vite", "TypeScript", "Tailwind CSS"],
      backend: ["Node API", "Workflow Service", "JSON Store"],
      agentSystem: ["master_agent", "user_profile", "project_idea", "proposal"],
      database: ["users", "projects", "documents", "agent_tasks"],
      externalServices: ["Qwen API", "Coze Workflow API"],
    },
    technicalRoute: idea.technicalRoute,
    innovations: idea.innovations,
    requiredResources: idea.requiredResources,
    estimatedBudget: idea.estimatedBudget,
    estimatedDuration: idea.estimatedDuration,
    risks: idea.risks,
    currentStage: "idea_confirmed",
    completionRate: 62,
    createdAt: stamp(),
    updatedAt: stamp(),
  };
}

export function generateProposal(project) {
  const titles = ["项目摘要", "项目背景", "用户痛点", "项目定位", "核心功能", "系统总体架构", "技术路线", "核心创新点", "实施计划", "风险分析", "预期成果", "项目总结"];
  const chapters = titles.map((title, index) => ({
    chapterId: `CH${String(index + 1).padStart(3, "0")}`,
    chapterNumber: String(index + 1),
    title,
    content: `${title}：围绕 ${project.projectName} 的项目档案生成，保持项目名称、技术路线、预算和周期一致。`,
    sourceData: ["project", "profile", "workflowState"],
    status: "ai_draft",
  }));
  return {
    documentId: "D001",
    projectId: project.projectId,
    documentType: "proposal",
    title: `${project.projectName} 项目计划书`,
    version: 1,
    chapters,
    consistencyCheck: {
      projectNameConsistent: true,
      technicalRouteConsistent: true,
      innovationConsistent: true,
      budgetConsistent: true,
      timelineConsistent: true,
    },
    generatedAt: stamp(),
  };
}
