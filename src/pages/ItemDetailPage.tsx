import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Package,
  Share2,
  Copy,
  Truck,
  CheckCircle2,
  PackagePlus,
} from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/shared/StatusBadge";

const PLACEHOLDER_EVENTS = [
  {
    icon: PackagePlus,
    label: "Batch Created",
    location: "Chiang Mai Organic Farm",
    date: "Apr 2, 2026 · 09:14 AM",
    note: "Initial registration by producer. GAP certified origin.",
    isFirst: true,
  },
  {
    icon: Truck,
    label: "In Transit",
    location: "Mae Rim Processing Centre",
    date: "Apr 5, 2026 · 01:30 PM",
    note: "Transported to milling facility. Temperature maintained at 20°C.",
    isFirst: false,
  },
  {
    icon: CheckCircle2,
    label: "Delivered",
    location: "Bangkok Central Depot",
    date: "Apr 9, 2026 · 11:00 AM",
    note: "Received by verified distributor. Quantity confirmed.",
    isFirst: false,
  },
];

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }

  return (
    <PageContainer>
      {/* ── Back ── */}
      <button
        id="item-detail-back"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: main content ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Item header card */}
          <div className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  Origin Passport
                </p>
                <h1 className="font-display text-2xl font-bold leading-tight text-[var(--color-foreground)]">
                  Jasmine Rice Batch #001
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    Chiang Mai, Thailand
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Apr 2, 2026
                  </span>
                </div>
              </div>
              <StatusBadge status="Verified" />
            </div>
          </div>

          {/* Metadata grid */}
          <div className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Batch Details
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {[
                { label: "Category", value: "Grains" },
                { label: "Quantity", value: "500 kg" },
                { label: "Origin Farm", value: "Mae Taeng Farm" },
                { label: "Province", value: "Chiang Mai" },
                { label: "Creator", value: "0x4f2a…8c3d" },
                { label: "Object ID", value: id ?? "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="mb-0.5 text-xs font-medium text-[var(--color-muted-foreground)]">
                    {label}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Provenance Timeline */}
          <div className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Provenance Timeline
            </h2>
            <ol className="space-y-0">
              {PLACEHOLDER_EVENTS.map(({ icon: Icon, label, location, date, note, isFirst }, i) => (
                <li key={i} className="flex gap-4">
                  {/* Node + connector */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isFirst
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface-low)] text-[var(--color-muted-foreground)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {i < PLACEHOLDER_EVENTS.length - 1 && (
                      <span className="mt-1 h-full w-px bg-[var(--color-border)]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p className="font-semibold text-[var(--color-foreground)]">{label}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {location}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{date}</p>
                    <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
                      {note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Right: actions sidebar ── */}
        <div className="space-y-4 lg:row-start-1">
          {/* Trust badge */}
          <div className="rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900">Verified</p>
                <p className="text-xs text-emerald-700">On-chain record confirmed</p>
              </div>
            </div>
          </div>

          {/* QR placeholder */}
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
            <div
              className="flex aspect-square w-full max-w-[160px] items-center justify-center rounded-xl bg-[var(--color-surface-low)]"
              aria-label="QR code placeholder"
            >
              <Package className="h-10 w-10 text-[var(--color-muted-foreground)]" strokeWidth={1} />
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">QR generation coming in Phase 3</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button
              id="item-action-share"
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => {}}
            >
              <Share2 className="h-4 w-4" />
              Share Passport
            </Button>
            <Button
              id="item-action-copy"
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
