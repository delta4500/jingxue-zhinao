import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, FolderKanban, Sparkles, UserRound } from "lucide-react";
import { MetricCard } from "../../components/common/MetricCard";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { WorkflowTimeline } from "../../components/workflow/WorkflowTimeline";
import { useWorkflowStore } from "../../stores/workflowStore";
import type { MetricItem } from "../../types/dashboard";

export function DashboardPage() {
  const { hydrateDemo, user, profile, ideas, project, proposal, tasks, workflow } = useWorkflowStore();

  useEffect(() => {
    hydrateDemo();
  }, [hydrateDemo]);

  const metrics: MetricItem[] = [
    {
      id: "profile",
      label: "用户画像",
      value: profile ? "已生成" : "待生成",
      helper: profile ? `风险等级：${profile.riskLevel}` : "提交表单后生成结构化画像",
      icon: UserRound,
      tone: "brand",
    },
    {
      id: "ideas",
      label: "项目方案",
      value: `${ideas.length} 个`,
      helper: ideas.length ? "可进入方案比较与确认" : "等待项目创意 Agent",
      icon: Sparkles,
      tone: "teal",
    },
    {
      id: "project",
      label: "项目档案",
      value: project ? project.projectId : "未建立",
      helper: project?.currentStage ?? "选择方案后自动创建",
      icon: FolderKanban,
      tone: "neutral",
    },
    {
      id: "proposal",
      label: "计划书",
      value: proposal ? `${proposal.chapters.length} 章` : "未生成",
      helper: proposal ? "已生成结构化章节草稿" : "项目档案创建后生成",
      icon: FileText,
      tone: "gold",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academic Intelligence Workspace"
        title="竞学智脑工作台"
        description="围绕用户画像、项目创意、正式档案和计划书生成，跑通第一条多智能体核心闭环。"
        actions={
          <>
            <Link
              to="/app/create"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-50"
            >
              新建项目
            </Link>
            <Link
              to={workflow.projectCreated ? "/app/proposal" : "/app/create"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              继续当前流程
              <ArrowRight className="size-4" />
            </Link>
          </>
        }
      />

      <WorkflowTimeline workflow={workflow} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="数据概览">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} item={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-xl border border-line bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge tone="brand">当前项目</StatusBadge>
              <h2 className="mt-4 font-display text-2xl font-semibold text-ink-950">
                {project?.projectName ?? "尚未确认项目方案"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                {project?.oneSentenceDefinition ?? "填写个人与团队信息后，系统将生成 3 个可比较的项目方案。"}
              </p>
            </div>
            <FolderKanban className="size-6 text-brand-600" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Info title="用户条件" text={user ? `${user.major} · ${user.grade} · ${user.teamSize} 人` : "待填写"} icon={<UserRound className="size-4" />} />
            <Info title="方案数量" text={`${ideas.length} 个项目创意`} icon={<Sparkles className="size-4" />} />
            <Info title="计划书" text={proposal ? `${proposal.version}.0 版本` : "待生成"} icon={<FileText className="size-4" />} />
          </div>
        </article>

        <article className="rounded-xl border border-line bg-white">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl font-semibold text-ink-950">最近 Agent 任务</h2>
            <p className="mt-1 text-sm text-ink-500">本地任务记录，后续写入后端 agent_tasks。</p>
          </div>
          <div className="divide-y divide-line">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.taskId} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-ink-900">{task.agentType}</p>
                  <p className="mt-1 text-xs text-ink-500">{task.taskId} · {task.traceId}</p>
                </div>
                <StatusBadge tone="success">{task.status}</StatusBadge>
              </div>
            ))}
            {!tasks.length && <div className="p-8 text-center text-sm text-ink-500">暂无任务，先创建项目。</div>}
          </div>
        </article>
      </section>
    </div>
  );
}

function Info({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface-50 p-4">
      <div className="flex items-center gap-2 text-brand-700">
        {icon}
        <p className="text-xs font-medium">{title}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-ink-900">{text}</p>
    </div>
  );
}
