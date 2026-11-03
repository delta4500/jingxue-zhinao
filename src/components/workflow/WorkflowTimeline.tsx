import { Check, Circle, Dot } from "lucide-react";
import type { WorkflowState } from "../../types/workflow";
import { cn } from "../../utils/cn";

const steps = [
  { key: "profile", label: "用户画像" },
  { key: "project_idea", label: "创意生成" },
  { key: "idea_selection", label: "方案确认" },
  { key: "proposal", label: "项目档案" },
  { key: "proposal_review", label: "计划书" },
];

const order = steps.map((step) => step.key);

interface WorkflowTimelineProps {
  workflow: WorkflowState;
  compact?: boolean;
}

export function WorkflowTimeline({ workflow, compact = false }: WorkflowTimelineProps) {
  const currentIndex = order.indexOf(workflow.currentStep);

  return (
    <div className={cn("rounded-xl border border-line bg-white", compact ? "p-4" : "p-5")}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-brand-700 uppercase">
            Workflow State
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink-950">核心闭环进度</h2>
        </div>
        <span className="rounded-md border border-line bg-surface-50 px-2 py-1 text-[11px] text-ink-500">
          {workflow.workflowId}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        {steps.map((step, index) => {
          const done = index < currentIndex || (step.key === "proposal_review" && workflow.proposalGenerated);
          const active = index === currentIndex;
          return (
            <div
              key={step.key}
              className={cn(
                "min-w-0 rounded-lg border px-3 py-3",
                done && "border-brand-100 bg-brand-50 text-brand-700",
                active && "border-brand-200 bg-white text-ink-950 shadow-soft",
                !done && !active && "border-line bg-surface-50 text-ink-400",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full border",
                    done && "border-brand-200 bg-brand-600 text-white",
                    active && "border-brand-200 bg-brand-50 text-brand-700",
                    !done && !active && "border-line bg-white text-ink-300",
                  )}
                >
                  {done ? <Check className="size-3" /> : active ? <Dot className="size-4" /> : <Circle className="size-2.5" />}
                </span>
                <span className="truncate text-xs font-medium">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-500">
        下一步：<span className="font-medium text-ink-900">{workflow.nextRecommendedAction}</span>
      </p>
    </div>
  );
}
