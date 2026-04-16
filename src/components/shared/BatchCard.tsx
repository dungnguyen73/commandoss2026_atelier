import { useNavigate } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { cn } from "../../lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { BatchStatus } from "./StatusBadge";

export interface BatchItem {
  id: string;
  name: string;
  category: string;
  origin: string;
  status: BatchStatus;
  createdAt: string;
}

interface BatchCardProps {
  item: BatchItem;
  className?: string;
}

export function BatchCard({ item, className }: BatchCardProps) {
  const navigate = useNavigate();

  return (
    <button
      id={`batch-card-${item.id}`}
      onClick={() => navigate(`/item/${item.id}`)}
      className={cn(
        "group w-full rounded-xl bg-[var(--color-card)] p-5 text-left",
        "shadow-[var(--shadow-card)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0px_24px_48px_rgba(19,27,46,0.10)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-low)]">
            <Package className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold leading-snug text-[var(--color-foreground)]">
              {item.name}
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {item.category} · {item.origin}
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {item.createdAt}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={item.status} />
          <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)] transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}
