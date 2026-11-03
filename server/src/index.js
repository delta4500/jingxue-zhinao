import http from "node:http";
import { parse } from "node:url";
import { readDb, upsert, writeDb } from "./store.js";
import {
  analyzeProfile,
  createProject,
  createWorkflowState,
  generateIdeas,
  generateProposal,
  task,
} from "./workflow.js";

const port = Number(process.env.PORT ?? 4174);

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body, null, 2));
}

function ok(data, traceId = "TRACE-MVP-001") {
  return { success: true, data, error: null, traceId, timestamp: new Date().toISOString() };
}

function fail(code, message, status = 400) {
  return {
    status,
    body: {
      success: false,
      data: null,
      error: { code, message, recoverable: true, suggestedAction: "检查请求数据后重试" },
      traceId: "TRACE-MVP-001",
      timestamp: new Date().toISOString(),
    },
  };
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function latest(db, table) {
  return db[table]?.[db[table].length - 1] ?? null;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});

  try {
    const url = parse(req.url ?? "", true);
    const path = url.pathname ?? "/";
    const db = readDb();

    if (req.method === "GET" && path === "/api/health") {
      return send(res, 200, ok({ service: "jingxue-ai-api", mode: "local-json", port }));
    }

    if (req.method === "POST" && path === "/api/profile/analyze") {
      const user = await readJson(req);
      const required = ["userId", "major", "grade", "teamSize", "weeklyAvailableHours", "budget"];
      const missingFields = required.filter((field) => user[field] === undefined || user[field] === "");
      if (missingFields.length) {
        const error = fail("USER_DATA_INCOMPLETE", `缺少字段：${missingFields.join("、")}`);
        return send(res, error.status, error.body);
      }
      const profile = analyzeProfile(user);
      const agentTask = task("user_profile", user.userId, user, { profile });
      const workflow = createWorkflowState(user.userId, "S001");
      workflow.profileCompleted = true;
      workflow.currentStep = "project_idea";
      workflow.nextRecommendedAction = "生成项目创意";
      upsert(db, "users", "userId", user);
      upsert(db, "user_profiles", "profileId", profile);
      upsert(db, "agent_tasks", "taskId", agentTask);
      upsert(db, "workflow_states", "workflowId", workflow);
      writeDb(db);
      return send(res, 200, ok({ profile, workflowState: workflow, task: agentTask }));
    }

    if (req.method === "GET" && path.startsWith("/api/profile/")) {
      const userId = decodeURIComponent(path.split("/").pop() ?? "");
      const profile = db.user_profiles.find((item) => item.userId === userId);
      if (!profile) {
        const error = fail("PROFILE_NOT_FOUND", "未找到用户画像", 404);
        return send(res, error.status, error.body);
      }
      return send(res, 200, ok(profile));
    }

    if (req.method === "POST" && path === "/api/project-ideas/generate") {
      const body = await readJson(req);
      const user = body.user ?? latest(db, "users");
      const profile = body.profile ?? latest(db, "user_profiles");
      if (!user || !profile) {
        const error = fail("CONTEXT_MISSING", "生成项目创意前需要 user 和 profile");
        return send(res, error.status, error.body);
      }
      const ideas = generateIdeas(user, profile);
      const agentTask = task("project_idea", user.userId, { user, profile }, { ideas });
      const workflow = latest(db, "workflow_states") ?? createWorkflowState(user.userId, "S001");
      workflow.ideasGenerated = true;
      workflow.currentStep = "idea_selection";
      workflow.nextRecommendedAction = "选择项目方案";
      ideas.forEach((idea) => upsert(db, "project_ideas", "ideaId", idea));
      upsert(db, "agent_tasks", "taskId", agentTask);
      upsert(db, "workflow_states", "workflowId", workflow);
      writeDb(db);
      return send(res, 200, ok({ ideas, workflowState: workflow, task: agentTask }));
    }

    if (req.method === "GET" && path === "/api/project-ideas") {
      return send(res, 200, ok(db.project_ideas));
    }

    if (req.method === "POST" && path === "/api/project-ideas/select") {
      const body = await readJson(req);
      const idea = db.project_ideas.find((item) => item.ideaId === body.selectedIdeaId);
      const user = latest(db, "users");
      if (!idea || !user) {
        const error = fail("INVALID_IDEA_SELECTION", "请选择有效的项目方案");
        return send(res, error.status, error.body);
      }
      const project = createProject(user, idea);
      const agentTask = task("master_agent", user.userId, body, { project }, project.projectId);
      const workflow = latest(db, "workflow_states") ?? createWorkflowState(user.userId, "S001");
      workflow.ideaSelected = true;
      workflow.projectCreated = true;
      workflow.selectedIdeaId = idea.ideaId;
      workflow.projectId = project.projectId;
      workflow.currentStep = "proposal";
      workflow.nextRecommendedAction = "生成计划书";
      upsert(db, "projects", "projectId", project);
      upsert(db, "project_versions", "projectId", { ...project, version: 1 });
      upsert(db, "agent_tasks", "taskId", agentTask);
      upsert(db, "workflow_states", "workflowId", workflow);
      writeDb(db);
      return send(res, 200, ok({ project, workflowState: workflow, task: agentTask }));
    }

    if (req.method === "GET" && path.startsWith("/api/projects/")) {
      const projectId = decodeURIComponent(path.split("/").pop() ?? "");
      const project = db.projects.find((item) => item.projectId === projectId);
      if (!project) {
        const error = fail("PROJECT_NOT_FOUND", "未找到项目档案", 404);
        return send(res, error.status, error.body);
      }
      return send(res, 200, ok(project));
    }

    if (req.method === "POST" && path === "/api/proposals/generate") {
      const body = await readJson(req);
      const project = body.project ?? latest(db, "projects");
      if (!project) {
        const error = fail("PROJECT_NOT_FOUND", "生成计划书前需要项目档案");
        return send(res, error.status, error.body);
      }
      const document = generateProposal(project);
      const agentTask = task("proposal", project.userId, { project }, { document }, project.projectId);
      const workflow = latest(db, "workflow_states") ?? createWorkflowState(project.userId, "S001");
      workflow.proposalGenerated = true;
      workflow.currentStep = "proposal_review";
      workflow.nextRecommendedAction = "检查并修改计划书";
      upsert(db, "documents", "documentId", document);
      document.chapters.forEach((chapter) => upsert(db, "document_chapters", "chapterId", chapter));
      upsert(db, "agent_tasks", "taskId", agentTask);
      upsert(db, "workflow_states", "workflowId", workflow);
      writeDb(db);
      return send(res, 200, ok({ document, workflowState: workflow, task: agentTask }));
    }

    if (req.method === "GET" && path.startsWith("/api/proposals/")) {
      const documentId = decodeURIComponent(path.split("/").pop() ?? "");
      const document = db.documents.find((item) => item.documentId === documentId);
      if (!document) {
        const error = fail("PROPOSAL_GENERATION_FAILED", "未找到计划书", 404);
        return send(res, error.status, error.body);
      }
      return send(res, 200, ok(document));
    }

    if (req.method === "GET" && path.startsWith("/api/workflows/")) {
      return send(res, 200, ok(latest(db, "workflow_states") ?? createWorkflowState()));
    }

    if (req.method === "POST" && path === "/api/workflows/continue") {
      return send(res, 200, ok({ workflowState: latest(db, "workflow_states") ?? createWorkflowState() }));
    }

    if (req.method === "GET" && path.startsWith("/api/agent-tasks/")) {
      const taskId = decodeURIComponent(path.split("/").pop() ?? "");
      const found = db.agent_tasks.find((item) => item.taskId === taskId);
      if (!found) {
        const error = fail("CONTEXT_MISSING", "未找到 Agent 任务", 404);
        return send(res, error.status, error.body);
      }
      return send(res, 200, ok(found));
    }

    const error = fail("NOT_FOUND", `接口不存在：${path}`, 404);
    return send(res, error.status, error.body);
  } catch (error) {
    return send(res, 500, fail("SERVER_ERROR", error instanceof Error ? error.message : "服务异常", 500).body);
  }
});

server.listen(port, () => {
  console.log(`Jingxue AI API running at http://localhost:${port}`);
});
