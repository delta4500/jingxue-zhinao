import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, Save } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { WorkflowTimeline } from "../../components/workflow/WorkflowTimeline";
import { useWorkflowStore } from "../../stores/workflowStore";

export function ProposalEditorPage() {
  const { workflow, project, proposal, runProposal, hydrateDemo, runProfileAndIdeas, selectIdea, ideas } =
    useWorkflowStore();
  const [activeChapter, setActiveChapter] = useState("CH001");

  useEffect(() => {
    hydrateDemo();
    if (!ideas.length) runProfileAndIdeas();
    if (!project && ideas.length) selectIdea(ideas[0].ideaId);
    if (project && !proposal) runProposal();
  }, [hydrateDemo, ideas, project, proposal, runProfileAndIdeas, runProposal, selectIdea]);

  const current = proposal?.chapters.find((chapter) => chapter.chapterId === activeChapter) ?? proposal?.chapters[0];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Proposal Editor"
        title={proposal?.title ?? "竞赛计划书"}
        description="按章节结构化保存，右侧保留来源字段和一致性检查。"
        actions={
          <button
            type="button"
            onClick={runProposal}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink-700 hover:bg-surface-50"
          >
            <RotateCcw className="size-4" />
            重新生成
          </button>
        }
      />

      <WorkflowTimeline workflow={workflow} />

      <section className="grid gap-6 xl:grid-cols-[260px_1fr_300px]">
        <aside className="rounded-xl border border-line bg-white p-4">
          <h2 className="px-2 font-display text-lg font-semibold text-ink-950">章节目录</h2>
          <div className="mt-4 space-y-1">
            {proposal?.chapters.map((chapter) => (
              <button
                key={chapter.chapterId}
                type="button"
                onClick={() => setActiveChapter(chapter.chapterId)}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                  current?.chapterId === chapter.chapterId
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-surface-50"
                }`}
              >
                <span className="block text-xs text-ink-400">第 {chapter.chapterNumber} 章</span>
                <span className="mt-1 block font-medium">{chapter.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-xl border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <p className="text-xs font-medium text-ink-400">{current?.chapterId}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink-950">{current?.title}</h2>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm text-ink-700 hover:bg-surface-50">
                <Save className="size-4" />
                保存
              </button>
              <StatusBadge tone="warning">AI 草稿</StatusBadge>
            </div>
          </div>
          <textarea
            value={current?.content ?? ""}
            readOnly
            className="min-h-[520px] w-full resize-none border-0 bg-white p-6 font-sans text-[15px] leading-8 text-ink-800 outline-none"
          />
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink-950">来源字段</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {current?.sourceData.map((source) => (
                <StatusBadge key={source} tone="neutral">{source}</StatusBadge>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink-950">一致性检查</h2>
            <div className="mt-4 space-y-3">
              {proposal &&
                Object.entries(proposal.consistencyCheck).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink-500">{key}</span>
                    <span className="flex items-center gap-1.5 text-brand-700">
                      <CheckCircle2 className="size-4" />
                      {value ? "通过" : "待核验"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
