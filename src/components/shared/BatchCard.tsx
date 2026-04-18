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
  imageUrl?: string; // Added for UI/UX upgrade
  artisanName?: string;
}

interface CertCardProps {
  item: CertItem;
  className?: string;
}

import { motion } from "framer-motion";

export function BatchCard({ item, className }: CertCardProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id={`cert-card-${item.id}`}
      onClick={() => navigate(`/item/${item.id}`)}
      className={cn(
        "group relative w-full overflow-hidden rounded-[2rem] bg-(--color-card) text-left",
        "shadow-[var(--shadow-card)] transition-all duration-500",
        "hover:shadow-[0px_40px_80px_-12px_rgba(10,77,44,0.15)]",
        className,
      )}
    >
      {/* ── Image Section ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-(--color-surface-low)">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-(--color-surface-low) to-(--color-primary-container)/20 text-(--color-primary)/20">
            <Gem className="h-16 w-16 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />
          </div>
        )}
        
        {/* Status Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-primary)/60">
              {item.category}
            </p>
            <h3 className="font-display text-lg font-bold leading-tight text-(--color-foreground) group-hover:text-(--color-primary) transition-colors duration-300">
              {item.name}
            </h3>
            
            <div className="mt-3 flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-(--color-primary)/40" />
                {item.artisanName || "Verified Artisan"}
              </p>
              <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                {item.location}
              </p>
            </div>
          </div>
          
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-surface-low) text-(--color-primary) opacity-0 transition-all duration-500 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between border-t border-(--color-outline-variant) pt-4">
          <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {item.createdAt}
          </p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-(--color-primary) uppercase tracking-tighter">
            PROVENANCE ANCHORED
          </div>
        </div>
      </div>
    </motion.button>
  );
}
