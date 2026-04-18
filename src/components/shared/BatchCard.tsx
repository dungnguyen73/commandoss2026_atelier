import { useNavigate } from "react-router-dom";
import { ArrowRight, Gem } from "lucide-react";
import { cn } from "../../lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { CertStatus } from "./StatusBadge";

export interface CertItem {
  id: string;
  name: string;
  category: string;
  location: string;
  status: CertStatus;
  createdAt: string;
}

interface CertCardProps {
  item: CertItem;
  className?: string;
}

export function BatchCard({ item, className }: CertCardProps) {
  const navigate = useNavigate();

  return (
    <button
      id={`cert-card-${item.id}`}
      onClick={() => navigate(`/item/${item.id}`)}
      className={cn(
        "group w-full rounded-2xl bg-[var(--color-card)] p-5 text-left",
        "shadow-[var(--shadow-card)] transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0px_32px_64px_rgba(19,27,46,0.12)] hover:ring-1 hover:ring-emerald-500/20",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-low)] transition-colors duration-300 group-hover:bg-emerald-50">
            <Gem className="h-6 w-6 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold leading-snug text-[var(--color-foreground)] transition-colors duration-300 group-hover:text-emerald-900">
              {item.name}
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {item.category}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500/40" />
                {item.location}
              </p>
            </div>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Minted {item.createdAt}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
          <StatusBadge status={item.status} />
          <div className="flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-emerald-50">
            <ArrowRight className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
      </div>
    </button>
  );
}
