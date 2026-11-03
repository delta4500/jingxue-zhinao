import { ArrowRight, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "../common/StatusBadge";
import type { ProjectIdea } from "../../types/workflow";

interface IdeaCardProps {
  idea: ProjectIdea;
  selected?: boolean;
  onSelect: (ideaId: string) => void;
}

const difficultyLabel = {
  low: "低难度",
  medium: "中等难度",
  high: "高难度",
};

export function IdeaCard({ idea, selected = false, onSelect }: IdeaCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-all duration-200 ease-emphasized hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge tone="brand">{difficultyLabel[idea.difficulty]}</StatusBadge>
        <div className="text-right">
          <p className="text-[11px] text-ink-400">综合评分</p>
          <p className="font-display text-2xl font-semibold text-brand-700">{idea.overallScore}</p>
        </div>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-7 text-ink-950">
        {idea.projectName}
      </h3>
      <p className="mt-2 text-sm leading-6 text-ink-500">{idea.oneSentenceDefinition}</p>

      <div className="mt-5 space-y-4 text-sm">
        <div>
          <p className="text-xs font-medium text-ink-400">核心功能</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {idea.coreFunctions.slice(0, 4).map((item) => (
              <span key={item} className="rounded-md border border-line bg-surface-50 px-2 py-1 text-xs text-ink-600">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-400">创新点</p>
          <ul className="mt-2 space-y-1.5 text-ink-600">
            {idea.innovations.slice(0, 2).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1 rounded-full bg-brand-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center text-xs">
        <div>
          <p className="font-semibold text-ink-900">{idea.feasibilityScore}</p>
          <p className="mt-1 text-ink-400">可行性</p>
        </div>
        <div>
          <p className="font-semibold text-ink-900">{idea.innovationScore}</p>
          <p className="mt-1 text-ink-400">创新性</p>
        </div>
        <div>
          <p className="font-semibold text-ink-900">{idea.presentationValueScore}</p>
          <p className="mt-1 text-ink-400">展示性</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-ink-500">{idea.recommendationReason}</p>

      <button
        type="button"
        onClick={() => onSelect(idea.ideaId)}
        className="mt-auto flex h-10 items-center justify-between rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink-800 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
      >
        <span>{selected ? "已选择该方案" : "选择该方案"}</span>
        {selected ? <CheckCircle2 className="size-4 text-brand-600" /> : <ArrowRight className="size-4" />}
      </button>
    </article>
  );
}
