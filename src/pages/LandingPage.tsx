import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ScanQrCode,
  PackagePlus,
  ArrowRight,
  Leaf,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: PackagePlus,
    title: "Register a Batch",
    description:
      "Producers enter origin details and mint an on-chain object that becomes the item's permanent passport.",
  },
  {
    step: "02",
    icon: Truck,
    title: "Track the Journey",
    description:
      "Logistics operators add custody updates at every stage — location, temperature, handoffs — all recorded on-chain.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Verify with a Scan",
    description:
      "Buyers or consumers scan a QR code and instantly see the full provenance timeline — no app or account required.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Tamper-Proof Records",
    description: "Every update is stored on the SUI blockchain and cannot be altered or deleted.",
  },
  {
    icon: ScanQrCode,
    title: "One-Scan Verification",
    description: "A single QR scan opens the complete origin story — fast, mobile-first, no friction.",
  },
  {
    icon: Leaf,
    title: "Built for Food Safety",
    description: "Designed specifically for food traceability, school procurement, and supply chain compliance.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 md:pt-28">
        {/* Soft ambient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[480px] w-[480px] rounded-full bg-emerald-100 opacity-40 blur-3xl"
        />

        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <Leaf className="h-3 w-3" />
            Food Provenance on SUI Blockchain
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-(--color-foreground) sm:text-5xl md:text-6xl">
            Every batch tells{" "}
            <span className="text-gradient-primary">a trusted story</span>
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            ChainPassport is a provenance platform for food origin. Producers
            register batches on-chain, logistics teams record the journey, and
            consumers verify authenticity with a single QR scan.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              id="hero-cta-dashboard"
              variant="primary"
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              id="hero-cta-scan"
              variant="secondary"
              size="lg"
              onClick={() => navigate("/scan")}
              className="w-full sm:w-auto"
            >
              <ScanQrCode className="h-4 w-4" />
              Scan a QR Code
            </Button>
          </div>
        </div>

        {/* Hero card preview */}
        <div className="relative mt-16 w-full max-w-md">
          <div className="rounded-2xl bg-(--color-card) p-6 shadow-(--shadow-card)">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Origin Passport
                </p>
                <h2 className="font-display text-xl font-bold text-(--color-foreground)">
                  Jasmine Rice — Batch 0x4f2a
                </h2>
                <p className="text-sm text-muted-foreground">
                  Chiang Mai, Thailand · Apr 2026
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>

            {/* Mini timeline */}
            <div className="mt-5 space-y-3">
              {[
                { label: "Harvested", loc: "Chiang Mai Farm", date: "Apr 2" },
                { label: "Processed", loc: "Mae Rim Mill", date: "Apr 5" },
                { label: "Delivered", loc: "Bangkok Depot", date: "Apr 9" },
              ].map((event, i, arr) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-(--color-primary)" : "bg-slate-300"}`}
                    />
                    {i < arr.length - 1 && (
                      <span className="mt-1 h-full w-px bg-slate-200" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm font-semibold text-(--color-foreground)">
                      {event.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.loc} · {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section
        className="bg-(--color-surface-low) px-4 py-20 sm:px-6"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2
              id="how-it-works-heading"
              className="font-display text-3xl font-bold text-(--color-foreground)"
            >
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps from farm to verified.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div
                key={step}
                className="group rounded-2xl bg-(--color-card) p-8 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[0px_24px_48px_rgba(19,27,46,0.10)]"
              >
                <span className="font-display text-4xl font-extrabold text-emerald-100">
                  {step}
                </span>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-(--color-foreground)">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section
        className="px-4 py-20 sm:px-6"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2
              id="features-heading"
              className="font-display text-3xl font-bold text-(--color-foreground)"
            >
              Built for trust
            </h2>
            <p className="mt-3 text-muted-foreground">
              Provenance infrastructure designed for the real world.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl bg-(--color-card) p-7 shadow-[var(--shadow-card)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-display text-base font-semibold text-(--color-foreground)">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="bg-primary-gradient flex flex-col items-center justify-between gap-6 rounded-3xl px-8 py-12 text-center sm:flex-row sm:text-left">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-white">
                Ready to passport your products?
              </h2>
              <p className="text-sm text-white/80">
                Connect your wallet and start registering batches on SUI testnet.
              </p>
            </div>
            <Button
              id="cta-banner-create"
              variant="ghost"
              size="lg"
              onClick={() => navigate("/create")}
              className="shrink-0 bg-white text-[var(--color-primary)] hover:bg-white/90 hover:text-[var(--color-primary)]"
            >
              Create a Batch
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
