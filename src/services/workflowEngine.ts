import type {
  AgentTask,
  Project,
  ProjectIdea,
  ProposalDocument,
  UserInput,
  UserProfile,
} from "../types/workflow";

const now = () => new Date().toISOString();

const id = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export function createAgentTask(
  agentType: AgentTask["agentType"],
  userId: string,
  input: unknown,
  output: unknown,
  projectId = "",
): AgentTask {
  const createdAt = now();
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
    createdAt,
    completedAt: now(),
    latency: 420,
  };
}

export function analyzeUserProfile(user: UserInput): UserProfile {
  return {
    profileId: "UP001",
    userId: user.userId,
    profileSummary: `${user.grade}${user.major}学生，团队 ${user.teamSize} 人，每周可投入 ${user.weeklyAvailableHours} 小时，具备 ${user.skills.join("、")} 基础，适合从可演示的 AI 工作流应用切入。`,
    abilityScores: {
      programming: 58,
      hardware: user.hardwareResources.length > 1 ? 62 : 45,
      ai: user.softwareResources.includes("Coze") ? 44 : 32,
      writing: 66,
      presentation: 48,
      projectManagement: 42,
    },
    advantages: ["有硬件基础，适合做软硬结合展示", "目标场景明确", "预算和周期适合完成 MVP"],
    weaknesses: ["缺少正式竞赛经验", "AI 工程化能力仍需补强", "答辩表达和项目管理经验偏弱"],
    recommendedRoles: ["项目负责人", "硬件验证负责人", "资料与计划书负责人"],
    recommendedDirections: ["AI+教育工作台", "竞赛项目辅助", "学习路径与材料生成"],
    recommendedDifficulty: "medium",
    resourceAssessment: `预算 ${user.budget} 元、已有 ${user.hardwareResources.join("、")}，适合先完成网页和 Agent 工作流，硬件部分作为增强演示。`,
    timeAssessment: `每周 ${user.weeklyAvailableHours} 小时适合 4-6 周完成第一版闭环，不宜一开始加入过多高级功能。`,
    riskLevel: "medium",
    riskNotes: ["需控制功能范围", "生成内容必须保留人工确认", "计划书需保持项目名称与技术路线一致"],
    generatedAt: now(),
  };
}

export function generateProjectIdeas(user: UserInput, profile: UserProfile): ProjectIdea[] {
  const shared = {
    targetUsers: ["竞赛经验不足的大一大二学生", "需要快速整理项目材料的参赛团队", "指导教师"],
    estimatedDuration: "4-6 周",
    difficulty: "medium" as const,
  };

  return [
    {
      ideaId: "I001",
      projectName: "竞学智脑",
      oneSentenceDefinition: "面向大学生竞赛的证据增强型 AI 项目工作台，帮助学生从模糊想法生成可执行项目和计划书。",
      applicationScenarios: ["选题前期", "项目立项", "材料撰写", "路演准备"],
      painPoints: ["不知道做什么项目", "计划书结构不清", "AI 输出缺少上下文继承"],
      coreFunctions: ["用户画像", "项目创意生成", "方案比较", "项目档案", "计划书生成"],
      softwareModules: ["React 工作台", "Node API", "工作流状态机", "文档编辑器"],
      hardwareModules: ["可选硬件演示盒", "传感器数据样例"],
      aiModules: ["用户画像 Agent", "项目创意 Agent", "计划书 Agent", "质量审查规则"],
      technicalRoute: ["前端分步表单", "主控服务组装上下文", "Agent JSON 输出", "项目档案持久化", "计划书章节生成"],
      innovations: ["多 Agent 串联而非普通聊天", "项目档案作为唯一事实源", "生成结果可追溯到源字段"],
      requiredResources: ["比赛说明", "团队技能信息", "项目案例库", "Qwen 或 Coze API"],
      estimatedBudget: Math.min(user.budget, 1800),
      feasibilityScore: 92,
      innovationScore: 88,
      competitionFitScore: 91,
      userCapabilityFitScore: 87,
      presentationValueScore: 90,
      overallScore: 90,
      risks: ["后端和模型接入需分阶段完成", "需要避免计划书内容空泛"],
      recommendationReason: `与 ${profile.recommendedDirections.join("、")} 高度匹配，且第一版能在网页中完整演示。`,
      ...shared,
    },
    {
      ideaId: "I002",
      projectName: "赛程智导",
      oneSentenceDefinition: "将比赛通知、评分标准和团队条件转化为可执行备赛任务的智能进度管理系统。",
      applicationScenarios: ["比赛报名", "阶段任务拆解", "材料清单管理"],
      painPoints: ["比赛节点容易遗漏", "任务分工不清", "材料版本混乱"],
      coreFunctions: ["比赛解析", "任务拆解", "进度看板", "风险预警"],
      softwareModules: ["规则录入", "任务看板", "提醒中心", "历史版本"],
      hardwareModules: ["无强依赖"],
      aiModules: ["规则解析 Agent", "任务拆解 Agent", "风险诊断 Agent"],
      technicalRoute: ["输入比赛规则", "抽取截止日期和材料", "生成任务", "跟踪状态"],
      innovations: ["将规则文本转为任务状态机", "面向团队协作而非单次生成"],
      requiredResources: ["比赛通知", "团队成员信息", "日程数据"],
      estimatedBudget: 800,
      feasibilityScore: 94,
      innovationScore: 78,
      competitionFitScore: 84,
      userCapabilityFitScore: 90,
      presentationValueScore: 76,
      overallScore: 84,
      risks: ["展示效果不如完整材料生成强", "规则解析需要更多真实样例"],
      recommendationReason: "实现难度低、落地性强，但创新展示张力略弱。",
      ...shared,
    },
    {
      ideaId: "I003",
      projectName: "智赛工坊",
      oneSentenceDefinition: "为不同赛道自动生成项目原型、功能说明和答辩问答的竞赛创作工坊。",
      applicationScenarios: ["创意发散", "团队头脑风暴", "答辩训练"],
      painPoints: ["创意同质化", "答辩准备不足", "方案难比较"],
      coreFunctions: ["创意卡片", "方案评分", "答辩问题", "演示脚本"],
      softwareModules: ["创意生成器", "评分矩阵", "问答训练", "导出中心"],
      hardwareModules: ["可选演示设备"],
      aiModules: ["创意 Agent", "质量审查 Agent", "答辩 Agent"],
      technicalRoute: ["收集约束", "生成多方案", "评分对比", "导出答辩材料"],
      innovations: ["把创意、评分和答辩打通", "适合课堂和社团训练"],
      requiredResources: ["案例库", "评分标准", "答辩题库"],
      estimatedBudget: 1200,
      feasibilityScore: 86,
      innovationScore: 86,
      competitionFitScore: 83,
      userCapabilityFitScore: 84,
      presentationValueScore: 88,
      overallScore: 85,
      risks: ["如果缺少案例库，生成质量会波动", "需要较多模板设计"],
      recommendationReason: "适合扩展到 V2，但第一版闭环不如竞学智脑聚焦。",
      ...shared,
    },
  ];
}

export function createProjectFromIdea(user: UserInput, idea: ProjectIdea): Project {
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
      backend: ["Node.js API", "工作流编排服务", "JSON Schema 校验"],
      agentSystem: ["主控 Agent V1", "用户画像 Agent", "项目创意 Agent", "计划书 Agent"],
      database: ["users", "user_profiles", "project_ideas", "projects", "documents", "agent_tasks", "workflow_states"],
      externalServices: ["Qwen API 或 Coze Workflow API"],
    },
    technicalRoute: idea.technicalRoute,
    innovations: idea.innovations,
    requiredResources: idea.requiredResources,
    estimatedBudget: idea.estimatedBudget,
    estimatedDuration: idea.estimatedDuration,
    risks: idea.risks,
    currentStage: "idea_confirmed",
    completionRate: 62,
    createdAt: now(),
    updatedAt: now(),
  };
}

export function generateProposal(project: Project, profile: UserProfile): ProposalDocument {
  const chapters = [
    ["1", "项目摘要", `${project.projectName} 是${project.oneSentenceDefinition} 项目将用户画像、项目创意和计划书生成串联为可追溯的工作流，适合 ${profile.profileSummary}`],
    ["2", "项目背景", "大学生参加创新竞赛时常面临信息分散、选题模糊、材料难写和答辩准备不足等问题，亟需一个专业工作台降低参赛门槛。"],
    ["3", "用户痛点", project.painPoints.map((item, index) => `${index + 1}. ${item}`).join("\n")],
    ["4", "项目定位", project.oneSentenceDefinition],
    ["5", "核心功能", project.coreFunctions.map((item, index) => `${index + 1}. ${item}`).join("\n")],
    ["6", "系统总体架构", `前端：${project.technicalArchitecture.frontend.join("、")}。\n后端：${project.technicalArchitecture.backend.join("、")}。\n智能体：${project.technicalArchitecture.agentSystem.join("、")}。`],
    ["7", "技术路线", project.technicalRoute.map((item, index) => `${index + 1}. ${item}`).join("\n")],
    ["8", "核心创新点", project.innovations.map((item, index) => `${index + 1}. ${item}`).join("\n")],
    ["9", "实施计划", "第一阶段完成前端工作台和本地工作流；第二阶段接入后端 API 与数据保存；第三阶段接入 Qwen 或 Coze Workflow；第四阶段完成测试、演示和答辩材料。"],
    ["10", "风险分析", project.risks.map((item, index) => `${index + 1}. ${item}`).join("\n")],
    ["11", "预期成果", "形成可运行网站、后端接口、标准化 Agent JSON、项目档案、计划书草稿、历史任务记录和演示数据。"],
    ["12", "项目总结", `${project.projectName} 的价值在于把一次性问答升级为可保存、可继续修改、可追踪的竞赛项目推进流程。`],
  ];

  return {
    documentId: "D001",
    projectId: project.projectId,
    documentType: "proposal",
    title: `${project.projectName} 项目计划书`,
    version: 1,
    chapters: chapters.map(([chapterNumber, title, content]) => ({
      chapterId: `CH${chapterNumber.padStart(3, "0")}`,
      chapterNumber,
      title,
      content,
      sourceData: ["project", "profile", "workflowState"],
      status: "ai_draft",
    })),
    consistencyCheck: {
      projectNameConsistent: true,
      technicalRouteConsistent: true,
      innovationConsistent: true,
      budgetConsistent: true,
      timelineConsistent: true,
    },
    generatedAt: now(),
  };
}
