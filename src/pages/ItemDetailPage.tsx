import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  Gem,
  Share2,
  Copy,
  CheckCircle2,
  Award,
  Loader2,
  AlertCircle,
  PlusCircle,
  Send,
  X,
} from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useCertificateData } from "../hooks/useCertificateData";
import * as QRCodeModule from "react-qr-code";
const QRCode = (QRCodeModule as any).default || QRCodeModule;
import { useState, useMemo } from "react";
import { useCurrentAccount, useDAppKit, CurrentAccountSigner } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { addProvenanceEvent, transferCertificate } from "../contracts/atelier/atelier";
import { ATELIER_PACKAGE_ID } from "../config/network";
import type { CertStatus } from "../components/shared/StatusBadge";

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
  if (!type) return Gem;
  switch (type.toLowerCase()) {
    case "created":
      return Gem;
    case "certified":
      return Award;
    case "sold":
    case "transferred":
      return Send;
    case "delivered":
    case "exhibited":
      return CheckCircle2;
    default:
      return Gem;
  }
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();

  const signer = useMemo(() => {
    try {
      if (typeof CurrentAccountSigner !== "undefined" && dAppKit) {
        return new CurrentAccountSigner(dAppKit as any);
      }
    } catch (e) {
      console.error("Signer initialization failed:", e);
    }
    return null;
  }, [dAppKit]);

  const { certificate, ownerAddress, isLoading, error, refetch } = useCertificateData(id);
  console.log("certificate", certificate);
  // Modal / Form states
  const [activeAction, setActiveAction] = useState<"none" | "event" | "transfer">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form data
  const [eventData, setEventData] = useState({ type: "", location: "", note: "" });
  const [transferData, setTransferData] = useState({ recipient: "" });

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => { });
  }

  const isOwner = !!account && !!ownerAddress && ownerAddress === account.address;

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !eventData.type || !eventData.location) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      if (!signer) throw new Error("Wallet signer not available.");
      const tx = new Transaction();
      addProvenanceEvent({
        package: ATELIER_PACKAGE_ID,
        arguments: [id, eventData.type, eventData.location, eventData.note || "N/A"],
      })(tx);
      await (signer as any).signAndExecuteTransaction({ transaction: tx });
      setTimeout(() => refetch(), 2000);
      setActiveAction("none");
      setEventData({ type: "", location: "", note: "" });
    } catch (err: any) {
      setActionError(err.message || "Failed to publish provenance event.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !transferData.recipient) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      if (!signer) throw new Error("Wallet signer not available.");
      const tx = new Transaction();
      transferCertificate({
        package: ATELIER_PACKAGE_ID,
        arguments: [id, transferData.recipient],
      })(tx);
      await (signer as any).signAndExecuteTransaction({ transaction: tx });
      setTimeout(() => refetch(), 2000);
      setActiveAction("none");
      setTransferData({ recipient: "" });
    } catch (err: any) {
      setActionError(err.message || "Failed to transfer certificate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-muted-foreground)]">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="mt-4 font-medium">Loading certificate record from SUI…</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !certificate) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-bold text-(--color-foreground)">Certificate Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The certificate ID you provided could not be found on the blockchain.
          </p>
          <Button variant="secondary" onClick={() => navigate("/scan")} className="mt-6">
            Try Scanning Again
          </Button>
        </div>
      </PageContainer>
    );
  }

  const events = (certificate?.history || []).map((ev: any, i: number) => ({
    icon: getEventIcon(ev.event_type),
    label: ev.event_type,
    location: ev.location,
    date: formatDate(ev.timestamp),
    note: ev.note,
    isFirst: i === 0,
  }));

  // Derive display status — default "Verified" for on-chain objects without explicit status field
  const displayStatus: CertStatus =
    certificate.status
      ? (certificate.status as CertStatus)
      : "Verified";

  const inputBase =
    "w-full rounded-xl bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all";

  const isTampered = displayStatus === "Tampered";

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

          {/* Certificate header card */}
          <div className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  Artisan Certificate
                </p>
                <h1 className="font-display text-2xl font-bold leading-tight text-[var(--color-foreground)]">
                  {certificate.name || "Untitled Certificate"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {certificate.location || "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {certificate.created_at
                      ? new Date(Number(certificate.created_at)).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
              <StatusBadge status={displayStatus} />
            </div>
          </div>

          {/* Certificate details grid */}
          <div className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Certificate Details
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {[
                { label: "Category", value: certificate.category || "N/A" },
                { label: "Artisan", value: certificate.artisan_name || "N/A" },
                { label: "Location", value: certificate.location || "N/A" },
                { label: "Materials", value: certificate.materials || "N/A" },
                { label: "Creator", value: certificate.creator ? `${String(certificate.creator).slice(0, 6)}…${String(certificate.creator).slice(-4)}` : "Unknown" },
                { label: "Object ID", value: id?.slice(0, 10) + "…" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="mb-0.5 text-xs font-medium text-[var(--color-muted-foreground)]">
                    {label}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-[var(--color-foreground)]" title={String(value)}>
                    {String(value)}
                  </dd>
                </div>
              ))}
            </dl>

            {certificate.note && (
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <dt className="mb-1 text-xs font-medium text-[var(--color-muted-foreground)]">
                  Provenance Note
                </dt>
                <dd className="text-sm leading-relaxed text-[var(--color-foreground)]">
                  {certificate.note}
                </dd>
              </div>
            )}
          </div>

          {/* Owner action modals (inline) */}
          {activeAction === "event" && (
            <div className="rounded-2xl bg-[var(--color-surface-low)] p-6 border border-[var(--color-primary)] relative">
              <button
                onClick={() => setActiveAction("none")}
                className="absolute top-4 right-4 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-[var(--color-foreground)]">
                <PlusCircle className="h-5 w-5 text-[var(--color-primary)]" /> Add Provenance Update
              </h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                      Event Type
                    </label>
                    <input
                      required
                      value={eventData.type}
                      onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                      className={inputBase}
                      placeholder="e.g. Certified"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                      Location
                    </label>
                    <input
                      required
                      value={eventData.location}
                      onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                      className={inputBase}
                      placeholder="e.g. Paris Workshop"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                    Note (Optional)
                  </label>
                  <input
                    value={eventData.note}
                    onChange={(e) => setEventData({ ...eventData, note: e.target.value })}
                    className={inputBase}
                    placeholder="e.g. Inspected and certified by curator"
                  />
                </div>
                {actionError && <p className="text-red-500 text-sm">{actionError}</p>}
                <Button disabled={isSubmitting} variant="primary" type="submit" className="w-full mt-4">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Publish to Chain
                </Button>
              </form>
            </div>
          )}

          {activeAction === "transfer" && (
            <div className="rounded-2xl bg-[var(--color-surface-low)] p-6 border border-amber-500/50 relative">
              <button
                onClick={() => setActiveAction("none")}
                className="absolute top-4 right-4 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-[var(--color-foreground)]">
                <Send className="h-5 w-5 text-amber-500" /> Transfer Certificate
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                Transferring this certificate permanently hands over ownership of this piece to the
                recipient wallet. This action is recorded on-chain.
              </p>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                    Recipient SUI Address
                  </label>
                  <input
                    required
                    value={transferData.recipient}
                    onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                    className={inputBase}
                    placeholder="0x…"
                  />
                </div>
                {actionError && <p className="text-red-500 text-sm">{actionError}</p>}
                <Button
                  disabled={isSubmitting}
                  variant="primary"
                  type="submit"
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Transfer On-Chain
                </Button>
              </form>
            </div>
          )}

          {/* Provenance Timeline */}
          <div className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)]">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                Provenance Timeline
              </h2>
            </div>

            {events.length > 0 ? (
              <ol className="space-y-0">
                {events.map(({ icon: Icon, label, location, date, note, isFirst }: any, i: number) => (
                  <li key={i} className="flex gap-4">
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
                    <div className="pb-8">
                      <p className="font-semibold text-[var(--color-foreground)]">{label}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {location}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{date}</p>
                      {note && (
                        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
                          {note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[var(--color-muted-foreground)]">No events recorded yet.</p>
            )}
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <div className="space-y-4 lg:row-start-1">

          {/* Trust / Tampered badge */}
          <div
            className={`rounded-2xl p-6 ring-1 ${isTampered
                ? "bg-red-50 ring-red-200"
                : "bg-emerald-50 ring-emerald-200"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${isTampered ? "bg-red-100" : "bg-emerald-100"
                  }`}
              >
                {isTampered ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${isTampered ? "text-red-900" : "text-emerald-900"}`}>
                  {isTampered ? "Tampered" : "Verified"}
                </p>
                <p className={`text-xs ${isTampered ? "text-red-700" : "text-emerald-700"}`}>
                  {isTampered
                    ? "Certificate hash mismatch detected"
                    : "On-chain certificate confirmed"}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="mt-6 pt-4 border-t border-emerald-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-3">
                  Owner Actions
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() => setActiveAction("event")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Provenance Update
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setActiveAction("transfer")}
                    className="w-full bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  >
                    <Send className="h-4 w-4 mr-2" /> Transfer Certificate
                  </Button>
                </div>
              </div>
            )}
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
              Certificate QR Code
            </p>
          </div>

          {/* Share buttons */}
          <div className="flex flex-col gap-2">
            <Button
              id="item-action-share"
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => { }}
            >
              <Share2 className="h-4 w-4" />
              Share Certificate
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
