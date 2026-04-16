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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useBatchData } from "../hooks/useBatchData";
import QRCode from "react-qr-code";

function formatDate(timestamp: string | number) {
  const date = new Date(Number(timestamp));
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEventIcon(type: string) {
  switch (type.toLowerCase()) {
    case "created":
      return PackagePlus;
    case "transport":
    case "shipping":
      return Truck;
    case "delivered":
      return CheckCircle2;
    default:
      return Package;
  }
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { batch, isLoading, error } = useBatchData(id);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => { });
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="mt-4 font-medium">Loading batch record from SUI...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !batch) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Batch Not Found</h1>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            The batch ID you provided could not be found on the blockchain.
          </p>
          <Button variant="secondary" onClick={() => navigate("/scan")} className="mt-6">
            Try Scanning Again
          </Button>
        </div>
      </PageContainer>
    );
  }

  const events = (batch.history || []).map((ev: any, i: number) => ({
    icon: getEventIcon(ev.event_type),
    label: ev.event_type,
    location: ev.location,
    date: formatDate(ev.timestamp),
    note: ev.note,
    isFirst: i === 0,
  }));

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
                  {batch.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {batch.province}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(Number(batch.created_at)).toLocaleDateString()}
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
                { label: "Category", value: batch.category },
                { label: "Quantity", value: batch.quantity },
                { label: "Origin Farm", value: batch.farm },
                { label: "Province", value: batch.province },
                { label: "Creator", value: `${batch.creator.slice(0, 6)}…${batch.creator.slice(-4)}` },
                { label: "Object ID", value: id?.slice(0, 10) + "..." },
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
            {events.length > 0 ? (
              <ol className="space-y-0">
                {events.map(({ icon: Icon, label, location, date, note, isFirst }: any, i: number) => (
                  <li key={i} className="flex gap-4">
                    {/* Node + connector */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isFirst
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface-low)] text-[var(--color-muted-foreground)]"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {i < events.length - 1 && (
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
            ) : (
              <p className="text-sm text-[var(--color-muted-foreground)]">No events recorded yet.</p>
            )}
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

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <QRCode
                value={window.location.href}
                size={160}
                level="H"
              />
            </div>
            <p className="text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
              Batch QR Passport
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button
              id="item-action-share"
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => { }}
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
