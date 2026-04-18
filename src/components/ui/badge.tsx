import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant =
  | "created"
  | "certified"
  | "transferred"
  | "verified"
  | "tampered"
  | "closed"
  | "default";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  created:
    "bg-slate-100/80 text-slate-600 ring-1 ring-slate-200/50 backdrop-blur-sm",
  certified:
    "bg-sky-50/80 text-sky-800 ring-1 ring-sky-200/50 backdrop-blur-sm",
  transferred:
    "bg-amber-50/80 text-amber-800 ring-1 ring-amber-200/50 backdrop-blur-sm",
  verified:
    "bg-[var(--color-primary-container)]/30 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20 backdrop-blur-sm",
  tampered:
    "bg-red-50 text-red-700 ring-1 ring-red-200",
  closed:
    "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200",
  default:
    "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
