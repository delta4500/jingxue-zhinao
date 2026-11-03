import type { MetricItem } from "../../types/dashboard";
import { cn } from "../../utils/cn";

interface MetricCardProps {
  item: MetricItem;
}

const toneClasses: Record<MetricItem["tone"], string> = {
  brand: "border-brand-100 bg-brand-50 text-brand-700",
  teal: "border-teal-100 bg-teal-50 text-teal-700",
  gold: "border-warning-100 bg-warning-50 text-warning-800",
  neutral: "border-ink-200 bg-surface-100 text-ink-700",
};

export function MetricCard({ item }: MetricCardProps) {
  const Icon = item.icon;

  return (
    <article className="rounded-xl border border-line bg-white p-5 transition-transform duration-200 ease-emphasized hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-500">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink-950">
            {item.value}
          </p>
        </div>
        <div
          className={cn(
            "grid size-10 place-items-center rounded-lg border",
            toneClasses[item.tone],
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-ink-500">{item.helper}</p>
    </article>
  );
}
