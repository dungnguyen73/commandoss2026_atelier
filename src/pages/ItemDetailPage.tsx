import { useParams, useNavigate } from "react-router-dom";
import { addRecentId } from "../store/recentStore";

import {
  ArrowLeft, Gem, MapPin, Calendar, History,
  ShieldCheck, ShieldAlert, PlusCircle, Send, X, Loader2,
  ExternalLink, Copy, Check, Activity, RefreshCw, Eye, EyeOff
} from "lucide-react";

import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useCertificateData } from "../hooks/useCertificateData";
import { useState, useMemo, useEffect } from "react";
// @ts-ignore
import { QRCode } from "react-qr-code";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useTransactionExecution } from "../hooks/useTransactionExecution";
import { motion } from "framer-motion";
import { Transaction } from "@mysten/sui/transactions";
import { addProvenanceEvent, transferCertificate } from "../contracts/atelier/atelier";
import { ATELIER_PACKAGE_ID } from "../config/network";
import { computeCertificateHash } from "../lib/hash";
import type { CertStatus } from "../components/shared/StatusBadge";
import { unpackNote } from "../lib/unpack";
import { cn } from "../lib/utils";
import { useStore } from "@nanostores/react";
import { $roleStore } from "../store/roleStore";
import { useVotingData } from "../hooks/useVotingData";
import { VERIFICATION_REGISTRY_ID } from "../config/network";
import { castVote } from "../contracts/atelier/atelier";


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
      return History;
    case "sold":
    case "transferred":
      return Send;
    case "delivered":
    case "exhibited":
      return Check;
    default:
      return Gem;
  }
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { execute, isZkLogin, isConnected } = useTransactionExecution();

  const [copied, setCopied] = useState(false);


  const { certificate, ownerAddress, isLoading, error, refetch } = useCertificateData(id);
  console.log("certificate", certificate);
  // Modal / Form states
  const [activeAction, setActiveAction] = useState<"none" | "event" | "transfer">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Validation state
  const [hashStatus, setHashStatus] = useState<"pending" | "verified" | "tampered">("pending");

  // Simulation states for testing (Not for production)
  const [isSimulatingTamper, setIsSimulatingTamper] = useState(false);
  const [isSimulatingAnchorTamper, setIsSimulatingAnchorTamper] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);

  // Voting stats
  const { data: votingData, refetch: refetchVoting } = useVotingData(id ?? "");
  const activeRole = useStore($roleStore);
  const isVerifier = activeRole === "Verifier";


  useEffect(() => {
    if (id) {
      addRecentId(id);
    }
  }, [id]);

  useEffect(() => {

    if (!certificate) return;
    async function verifyHash() {
      if (!certificate) return;
      try {
        // Unpack image/note but use BOTH for original hash verification to maintain legacy consistency
        const { note: cleanNote } = unpackNote(certificate.note || "");

        const computed = await computeCertificateHash({
          name: isSimulatingTamper ? "!!! TAMPERED NAME !!!" : (certificate.name || ""),
          category: certificate.category || "",
          artisanName: certificate.artisan_name || "",
          location: certificate.location || "",
          materials: certificate.materials || "",
          note: cleanNote // Use unpacked note for hash verification to match creation logic
        });

        const anchorHash = isSimulatingAnchorTamper ? "corrupted_hash_anchor_xyz" : certificate.cert_hash;

        if (computed === anchorHash) {
          setHashStatus("verified");
        } else {
          setHashStatus("tampered");
        }
      } catch (err) {
        setHashStatus("tampered");
      }
    }
    verifyHash();
  }, [certificate, isSimulatingTamper, isSimulatingAnchorTamper]);


  // Form data
  const [eventData, setEventData] = useState({ type: "", location: "", note: "" });
  const [transferData, setTransferData] = useState({ recipient: "" });

  // function handleCopy() {
  //   navigator.clipboard.writeText(window.location.href).catch(() => { });
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // }

  function handleCopyObjectIdToClipBoard(id: string) {
    if (!id) return;
    navigator.clipboard.writeText(id).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  const isOwner = !!account && !!ownerAddress && ownerAddress === account.address;

  // Derive display status — default "Verified" for on-chain objects without explicit status field
  const { imageUrl, note: displayNote } = useMemo(() => unpackNote(certificate?.note || ""), [certificate?.note]);

  const events = (certificate?.history || []).map((ev: any, i: number) => ({
    icon: getEventIcon(ev.event_type),
    label: ev.event_type,
    location: ev.location,
    date: formatDate(ev.timestamp),
    note: unpackNote(ev.note).note, // Clean up history notes too
    isFirst: i === 0,
  }));

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !eventData.type || !eventData.location) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const tx = new Transaction();
      addProvenanceEvent({
        package: ATELIER_PACKAGE_ID,
        arguments: [id, eventData.type, eventData.location, eventData.note || "N/A"],
      })(tx);
      await execute(tx);
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
      const tx = new Transaction();
      transferCertificate({
        package: ATELIER_PACKAGE_ID,
        arguments: [id, transferData.recipient],
      })(tx);
      await execute(tx);
      setTimeout(() => refetch(), 2000);
      setActiveAction("none");
      setTransferData({ recipient: "" });
    } catch (err: any) {
      setActionError(err.message || "Failed to transfer certificate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVote(isLegit: boolean) {
    if (!id || !VERIFICATION_REGISTRY_ID) return;

    // Bug fix: guard against unauthenticated users before touching the chain
    if (!isConnected) {
      setActionError("Please connect your wallet or sign in to cast a verdict.");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      const tx = new Transaction();
      castVote({
        package: ATELIER_PACKAGE_ID,
        arguments: [VERIFICATION_REGISTRY_ID, id, isLegit],
      })(tx);

      await execute(tx);
      // Allow some time for the chain to update
      setTimeout(() => {
        refetchVoting();
      }, 2000);
    } catch (err: any) {
      setActionError(err.message || "Failed to cast verdict.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
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
            <ShieldAlert className="h-10 w-10" />
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


  const displayStatus: CertStatus = certificate.status ? (certificate.status as CertStatus) : "Verified";
  const inputBase = "w-full rounded-2xl bg-(--color-surface-low) border border-(--color-outline-variant) px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all";
  const isTampered = hashStatus === "tampered" || displayStatus === "Tampered";

  return (
    <PageContainer>
      {/* ── Breadcrumb ── */}
      <button
        id="item-detail-back"
        onClick={() => navigate(-1)}
        className="group mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-(--color-primary) transition-all animate-in fade-in duration-700"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 group-hover:ring-(--color-primary)/20 group-hover:bg-(--color-surface-low)">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Return to Dashboard
      </button>

      {/* ── Hero Story Layout ── */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">

        {/* ── Left Sidebar (Product Image & Identity) ── */}
        <div className="space-y-8 lg:col-span-5 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          {/* Main Product Card */}
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0px_40px_80px_-20px_rgba(10,77,44,0.12)] ring-1 ring-slate-100">
            <div className={`aspect-4/5 bg-(--color-surface-low) relative group`}>
              {imageUrl ? (
                <img src={imageUrl} alt={certificate.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-50 to-emerald-50 text-(--color-primary)/10">
                  <Gem className="h-24 w-24 rotate-12" />
                </div>
              )}

              {/* Identity Float */}
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-pill rounded-3xl flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-(--color-primary)/70 mb-1">Authentic Registry</p>
                  <p className="font-mono text-xs font-bold text-(--color-foreground) truncate max-w-48">{id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => window.open(`https://suiscan.xyz/mainnet/object/${id}`, "_blank")} className="h-10 w-10 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 p-0 text-slate-400 hover:text-(--color-primary) transition-all">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm" className="h-10 w-10 rounded-full" onClick={() => handleCopyObjectIdToClipBoard(id!)}>
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-(--color-primary) uppercase tracking-widest">{certificate.category}</span>
                <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-(--color-foreground)">{certificate.name}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <dt className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Created By</dt>
                  <dd className="text-sm font-bold text-(--color-foreground)">{certificate.artisan_name}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Origin</dt>
                  <dd className="text-sm font-bold text-(--color-foreground) flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-(--color-primary)" />
                    {certificate.location}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* QR & Verification Status */}
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 bg-white rounded-3xl ring-8 ring-emerald-50/50">
                <QRCode value={window.location.href} size={160} level="H" fgColor="#1a1f18" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verification Anchor</p>
                <p className="text-xs text-muted-foreground">Scan to verify this item's on-chain existence instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content Area (Story & Timeline) ── */}
        <div className="space-y-10 lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">

          {/* Premium Trust Seal Banner */}
          <div className={cn(
            "relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-700",
            isTampered
              ? "bg-red-50 ring-1 ring-red-200/50 text-red-900"
              : "bg-primary-container/30 ring-1 ring-(--color-primary)/10 text-(--color-primary)"
          )}>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl shadow-xl transition-transform duration-700 hover:rotate-6",
                  isTampered ? "bg-red-600 text-white shadow-red-200" : "bg-(--color-primary) text-white shadow-emerald-200"
                )}>
                  {hashStatus === "pending" ? (
                    <Loader2 className="h-10 w-10 animate-spin" />
                  ) : isTampered ? (
                    <ShieldAlert className="h-10 w-10" />
                  ) : (
                    <ShieldCheck className="h-10 w-10" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black uppercase tracking-tight">
                    {hashStatus === "pending" ? "Validating Proof..." : isTampered ? "Security Breach" : "Trust-Verified"}
                  </h2>
                  <p className="text-sm font-medium opacity-80 mt-1 max-w-sm">
                    {isTampered
                      ? "Warning: This certificate has been compromised. The descriptive metadata does not match the on-chain registry."
                      : "This piece is authenticated by a cryptographic hash anchored on the SUI blockchain. Its metadata and history are immutable."}
                  </p>
                </div>
              </div>
              <StatusBadge status={displayStatus} />
            </div>

            {/* Background Decoration */}
            <Gem className={cn(
              "absolute -bottom-10 -right-10 h-40 w-40 opacity-5 rotate-12",
              isTampered ? "text-red-900" : "text-(--color-primary)"
            )} />
          </div>

          {/* Community Verdict Stats */}
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl ring-1 ring-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-(--color-primary)">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vouches</p>
                <p className="text-xl font-black text-(--color-foreground)">{votingData?.upvotes || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl ring-1 ring-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Flags</p>
                <p className="text-xl font-black text-(--color-foreground)">{votingData?.downvotes || 0}</p>
              </div>
            </div>

            <div className="flex-1 min-w-[200px] flex items-center justify-between px-6 py-4 bg-emerald-950 text-white rounded-3xl shadow-lg">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Community Trust</p>
                <p className="text-sm font-bold">
                  {((votingData?.upvotes || 0) + (votingData?.downvotes || 0)) > 0
                    ? `${Math.round(((votingData?.upvotes || 0) / ((votingData?.upvotes || 0) + (votingData?.downvotes || 0))) * 100)}% Confidence`
                    : "Awaiting Reviews"}
                </p>
              </div>
              <Activity className="h-5 w-5 text-emerald-400 opacity-50" />
            </div>
          </div>

          {/* Action Error Alert */}
          {actionError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4 text-red-900"
            >
              <div className="bg-red-600 p-2 rounded-xl text-white">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-black uppercase tracking-widest text-[10px] mb-1">Authorization Failure</p>
                <p className="text-sm font-medium leading-relaxed">{actionError}</p>
                <button
                  onClick={() => setActionError(null)}
                  className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] underline opacity-60 hover:opacity-100"
                >
                  Dismiss Alert
                </button>
              </div>
            </motion.div>
          )}

          {/* Artisan Story / Note */}
          <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 ring-1 ring-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Artisan Narrative</h3>
            <div className="relative">
              <span className="absolute -top-4 -left-4 font-display text-6xl text-emerald-100 select-none">“</span>
              <p className="relative font-serif text-xl leading-relaxed text-(--color-foreground) italic">
                {displayNote || "This masterwork was meticulously crafted by hand, following centuries-old tradition and modern innovation. Its provenance reflects a journey of dedication and authenticity."}
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Materials used</p>
                  <div className="flex items-center gap-2">
                    < Gem className="h-4 w-4 text-(--color-primary)" />
                    <p className="text-sm font-bold">{certificate.materials}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Date of Creation</p>
                  <div className="flex items-center gap-2">
                    < Calendar className="h-4 w-4 text-(--color-primary)" />
                    <p className="text-sm font-bold">{formatDate(certificate.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Management Actions (Owner Only) */}
          {isOwner && (
            <section className="rounded-[2.5rem] bg-white p-8 ring-1 ring-slate-100 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-primary)">Owner Management Suite</h3>
                <span className="px-3 py-1 bg-emerald-50 text-(--color-primary) text-[10px] font-bold rounded-full ring-1 ring-emerald-100">YOU OWN THIS ITEM</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={() => setActiveAction("event")} className="py-8 rounded-3xl bg-white border-2 border-slate-100 hover:border-(--color-primary)/30 text-(--color-foreground) shadow-sm group">
                  <PlusCircle className="mr-3 h-5 w-5 text-(--color-primary) transition-transform group-hover:rotate-90" />
                  Record Milestone
                </Button>
                <Button onClick={() => setActiveAction("transfer")} className="py-8 rounded-3xl bg-white border-2 border-slate-100 hover:border-amber-400/30 text-(--color-foreground) shadow-sm group">
                  <Send className="mr-3 h-5 w-5 text-amber-500 transition-transform group-hover:translate-x-1" />
                  Handoff Ownership
                </Button>
              </div>

              {/* Action Modals - Inline Redesigned */}
              {activeAction !== "none" && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in duration-500">
                  {activeAction === "event" && (
                    <form onSubmit={handleAddEvent} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold flex items-center gap-2"><PlusCircle className="h-4 w-4 text-(--color-primary)" /> Add Provenance Milestone</h4>
                        <Button variant="ghost" size="sm" onClick={() => setActiveAction("none")} className="h-8 w-8 p-0 rounded-full"><X className="h-4 w-4" /></Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input required value={eventData.type} onChange={(e) => setEventData({ ...eventData, type: e.target.value })} className={inputBase} placeholder="Event e.g. Exhibition" />
                        <input required value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} className={inputBase} placeholder="Location" />
                      </div>
                      <textarea value={eventData.note} onChange={(e) => setEventData({ ...eventData, note: e.target.value })} className={cn(inputBase, "h-24 py-4")} placeholder="Describe this milestone for future owners..." />
                      <Button disabled={isSubmitting} type="submit" className="w-full py-6 rounded-2xl bg-(--color-primary) hover:bg-emerald-950 text-white shadow-lg shadow-emerald-200">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                        Anchor Milestone to Chain
                      </Button>
                    </form>
                  )}
                  {activeAction === "transfer" && (
                    <form onSubmit={handleTransfer} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-900 flex items-center gap-2"><Send className="h-4 w-4 text-amber-600" /> Transfer Proof of Ownership</h4>
                        <Button variant="ghost" size="sm" onClick={() => setActiveAction("none")} className="h-8 w-8 p-0 rounded-full"><X className="h-4 w-4" /></Button>
                      </div>
                      <p className="text-sm text-amber-800/80 bg-amber-50 p-4 rounded-xl border border-amber-100 font-medium">
                        Warning: This action permanently transfers the digital certificate. Ensure the recipient address is correct. This is irreversible.
                      </p>
                      <input required value={transferData.recipient} onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })} className={inputBase} placeholder="Recipient SUI Address (0x...)" />
                      <Button disabled={isSubmitting} type="submit" className="w-full py-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Commit Official Transfer
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Verifier Assessment (Verifier Only) */}
          {isVerifier && (
            <section className="rounded-[2.5rem] bg-emerald-950 p-10 text-white shadow-2xl ring-1 ring-emerald-900 animate-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/80 mb-1">Verifier Laboratory</h3>
                  <p className="font-display text-2xl font-black">Professional Assessment</p>
                </div>
              </div>

              <p className="text-emerald-100/60 text-sm leading-relaxed mb-10 max-w-lg">
                As an accredited Verifier, your role is to audit the provenance events and metadata matches.
                Your vote directly influences the cryptographic trust score of this asset.
              </p>

              {/* Bug fix: show connect prompt when not authenticated */}
              {!isConnected ? (
                <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-emerald-500/20">
                  <div className="h-10 w-10 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-white uppercase tracking-widest">Authentication Required</p>
                    <p className="text-emerald-100/50 text-xs mt-1">Connect your wallet or sign in via Google to cast a verdict on this asset.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleVote(true)}
                    className="h-20 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{isZkLogin ? "Generating Proof..." : "Casting Verdict..."}</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck className="mr-3 h-5 w-5" />
                        Vouch as Legit
                      </>
                    )}
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleVote(false)}
                    variant="outline"
                    className="h-20 rounded-3xl border-2 border-red-500/50 hover:bg-red-500 hover:text-white text-red-400 font-black uppercase tracking-widest transition-all hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{isZkLogin ? "Generating Proof..." : "Tagging Asset..."}</span>
                      </div>
                    ) : (
                      <>
                        <ShieldAlert className="mr-3 h-5 w-5" />
                        Flag as Suspicious
                      </>
                    )}
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Provenance Timeline Redesigned */}
          <section className="bg-white rounded-[2.5rem] p-10 ring-1 ring-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10">Provenance Lifecycle</h3>

            {events.length > 0 ? (
              <div className="relative space-y-0 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                {events.map(({ icon: Icon, label, location, date, note, isFirst }: any, i: number) => (
                  <div key={i} className="relative pl-16 pb-12 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className={cn(
                      "absolute left-0 p-3 rounded-2xl shadow-sm z-10 transition-transform duration-500 hover:scale-110",
                      isFirst ? "bg-(--color-primary) text-white" : "bg-white ring-1 ring-slate-100 text-muted-foreground"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-display text-lg font-bold text-(--color-foreground)">{label}</h4>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{date}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-(--color-primary)/60 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {location}</span>
                      </div>
                      {note && (
                        <p className="mt-4 p-5 rounded-2xl bg-slate-50/50 text-sm text-muted-foreground leading-relaxed border border-slate-100/50">
                          {note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center opacity-30">
                < Gem className="h-12 w-12 mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Security Audit Panel (Remains for Testing) ── */}
      {/* <div className="mt-16 rounded-[2rem] overflow-hidden border border-red-200 bg-red-50/20 backdrop-blur-sm animate-in fade-in duration-1000 delay-500">
        <div className="p-2 px-6 bg-red-500 flex justify-between items-center">
          <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Cryptographic Integrity Laboratory</span>
          <button onClick={() => setShowAuditPanel(!showAuditPanel)} className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
            {showAuditPanel ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
        </div>
        {showAuditPanel && (
          <div className="p-8 grid gap-8 md:grid-cols-3 items-center">
            <div className="space-y-3">
              <h4 className="text-xs font-black text-red-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Hardened Simulators
              </h4>
              <p className="text-[11px] text-red-700/80 leading-relaxed font-medium">
                Induce metadata drift or hash corruption to validate the re-verification engine's response speed and UI integrity.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" size="sm" onClick={() => setIsSimulatingTamper(!isSimulatingTamper)} className={cn("justify-start h-12 rounded-xl text-[10px] font-black uppercase tracking-widest", isSimulatingTamper ? "bg-red-100 text-red-700" : "bg-white shadow-sm")}>
                <div className={cn("h-2 w-2 rounded-full mr-3", isSimulatingTamper ? "bg-red-500 animate-pulse" : "bg-gray-300")} />
                {isSimulatingTamper ? "Stop Data Corruption" : "Corrupt Master Records"}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsSimulatingAnchorTamper(!isSimulatingAnchorTamper)} className={cn("justify-start h-12 rounded-xl text-[10px] font-black uppercase tracking-widest", isSimulatingAnchorTamper ? "bg-red-100 text-red-700" : "bg-white shadow-sm")}>
                <div className={cn("h-2 w-2 rounded-full mr-3", isSimulatingAnchorTamper ? "bg-red-500 animate-pulse" : "bg-gray-300")} />
                {isSimulatingAnchorTamper ? "Release Hash Lock" : "Corrupt Chain Anchor"}
              </Button>
            </div>
            <Button variant="secondary" size="lg" onClick={() => { setIsSimulatingTamper(false); setIsSimulatingAnchorTamper(false); }} disabled={!isSimulatingTamper && !isSimulatingAnchorTamper} className="h-20 bg-white rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-red-900 border-2 border-slate-100 hover:border-red-200">
              <RefreshCw className="h-4 w-4 mr-3" /> Re-sync Integrity State
            </Button>
          </div>
        )}
      </div> */}
    </PageContainer>
  );
}
