import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanQrCode, Hash, ArrowRight } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";

export default function ScanPage() {
  const navigate = useNavigate();
  const [manualId, setManualId] = useState("");

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = manualId.trim();
    if (trimmed) navigate(`/item/${encodeURIComponent(trimmed)}`);
  }

  return (
    <PageContainer narrow>
      {/* ── Page header ── */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
          Scan QR Code
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Point your camera at a ChainPassport QR code to view its provenance
          record.
        </p>
      </div>

      {/* ── Scanner area placeholder ── */}
      <div
        id="scanner-viewport"
        className="relative flex aspect-square w-full max-w-sm mx-auto flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] transition-colors duration-200"
        aria-label="QR scanner viewport (placeholder)"
        role="img"
      >
        {/* Corner brackets */}
        <span aria-hidden className="absolute left-5 top-5 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-[var(--color-primary)]" />
        <span aria-hidden className="absolute right-5 top-5 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-[var(--color-primary)]" />
        <span aria-hidden className="absolute bottom-5 left-5 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-[var(--color-primary)]" />
        <span aria-hidden className="absolute bottom-5 right-5 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-[var(--color-primary)]" />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <ScanQrCode className="h-8 w-8 text-[var(--color-primary)]" strokeWidth={1.5} />
        </div>
        <p className="px-8 text-center text-sm font-medium text-[var(--color-muted-foreground)]">
          Camera scanner will appear here
        </p>
        <p className="px-8 text-center text-xs text-[var(--color-muted-foreground)]">
          QR scanner integration is coming in Phase 3
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
          or enter ID manually
        </span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* ── Manual entry ── */}
      <form
        id="scan-manual-form"
        onSubmit={handleManualSubmit}
        className="flex gap-2"
        aria-label="Manual batch ID entry"
      >
        <div className="relative flex-1">
          <Hash
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            aria-hidden
          />
          <input
            id="manual-batch-id"
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Batch ID or object address"
            aria-label="Batch ID"
            className="w-full rounded-xl bg-[var(--color-surface-low)] py-2.5 pl-9 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none focus:bg-[var(--color-surface-lowest)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
          />
        </div>
        <Button
          id="scan-manual-submit"
          type="submit"
          variant="primary"
          disabled={!manualId.trim()}
          aria-label="Look up batch"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </PageContainer>
  );
}
