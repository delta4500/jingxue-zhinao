import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "brand"
  | "teal";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  success: "border-success-200 bg-success-50 text-success-700",
  warning: "border-warning-200 bg-warning-50 text-warning-800",
  danger: "border-danger-200 bg-danger-50 text-danger-700",
  info: "border-info-200 bg-info-50 text-info-700",
  neutral: "border-ink-200 bg-white text-ink-600",
  brand: "border-brand-200 bg-brand-50 text-brand-700",
  teal: "border-teal-200 bg-teal-50 text-teal-700",
};

const dotClasses: Record<StatusTone, string> = {
  success: "bg-success-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
  info: "bg-info-600",
  neutral: "bg-ink-400",
  brand: "bg-brand-600",
  teal: "bg-teal-600",
};

export function StatusBadge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium leading-none",
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dotClasses[tone])} />}
      {children}
    </span>
  );
}
