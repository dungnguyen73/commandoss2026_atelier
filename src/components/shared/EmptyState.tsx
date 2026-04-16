import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-low)] text-[var(--color-muted-foreground)]">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-base font-semibold text-[var(--color-foreground)]">
          {title}
        </p>
        {description && (
          <p className="max-w-xs text-sm text-[var(--color-muted-foreground)]">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
