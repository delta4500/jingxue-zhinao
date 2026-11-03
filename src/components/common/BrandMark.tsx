import { Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-brand-200 bg-brand-50 text-brand-700">
        <Sparkles className="size-4" strokeWidth={1.8} aria-hidden="true" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="font-display text-[17px] font-semibold leading-5 text-ink-950">
            竞学智脑
          </div>
          <div className="mt-0.5 text-[11px] tracking-[0.08em] text-ink-500">
            AI 竞赛项目工作台
          </div>
        </div>
      )}
    </div>
  );
}
