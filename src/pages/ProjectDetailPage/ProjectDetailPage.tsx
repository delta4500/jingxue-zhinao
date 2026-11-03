import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Database, FileText } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { WorkflowTimeline } from "../../components/workflow/WorkflowTimeline";
import { useWorkflowStore } from "../../stores/workflowStore";

export function ProjectDetailPage() {
  const { hydrateDemo, runProfileAndIdeas, ideas, project, workflow, selectIdea } = useWorkflowStore();

  useEffect(() => {
    hydrateDemo();
    if (!ideas.length) runProfileAndIdeas();
    if (!project && ideas.length) selectIdea(ideas[0].ideaId);
  }, [hydrateDemo, ideas, project, runProfileAndIdeas, selectIdea]);

  if (!project) {
    return (
      <div className="rounded-xl border border-line bg-white p-8 text-center">
        <p className="text-sm text-ink-500">正在建立项目档案...</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Project Archive"
        title={project.projectName}
        description={project.oneSentenceDefinition}
        actions={
          <Link
            to="/app/proposal"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            生成计划书
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      <WorkflowTimeline workflow={workflow} />

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <article className="rounded-xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="brand">正式项目档案</StatusBadge>
              <StatusBadge tone="neutral">Project ID：{project.projectId}</StatusBadge>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <InfoBlock title="目标用户" items={project.targetUsers} />
              <InfoBlock title="应用场景" items={project.applicationScenarios} />
              <InfoBlock title="核心痛点" items={project.painPoints} />
              <InfoBlock title="核心功能" items={project.coreFunctions} />
            </div>
          </article>

          <article className="rounded-xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-ink-950">技术架构</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Object.entries(project.technicalArchitecture).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-line bg-surface-50 p-4">
                  <p className="text-xs font-semibold tracking-[0.08em] text-brand-700 uppercase">
                    {key}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-700">{value.join("、")}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-5">
            <Database className="size-5 text-brand-600" />
            <h2 className="mt-4 font-display text-lg font-semibold text-ink-950">档案继承规则</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              计划书 Agent 只读取该项目档案，不从聊天历史猜测项目名称、定位或技术路线。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-5">
            <FileText className="size-5 text-brand-600" />
            <h2 className="mt-4 font-display text-lg font-semibold text-ink-950">当前阶段</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              完成度 {project.completionRate}%，下一步是生成并审查计划书章节。
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-500">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1 rounded-full bg-brand-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
