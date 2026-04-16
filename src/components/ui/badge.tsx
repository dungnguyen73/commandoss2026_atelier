import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant =
  | "verified"
  | "in-transit"
  | "created"
  | "pending"
  | "flagged"
  | "default";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  verified:
    "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  "in-transit":
    "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
  created:
    "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  pending:
    "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  flagged:
    "bg-red-50 text-red-700 ring-1 ring-red-200",
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
