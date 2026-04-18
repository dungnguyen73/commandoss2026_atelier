import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-surface-low) text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-base font-semibold text-(--color-foreground)">
          {title}
        </p>
        {description && (
          <p className="max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
