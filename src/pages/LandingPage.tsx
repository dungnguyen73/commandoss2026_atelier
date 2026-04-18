import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ScanQrCode,
  Gem,
  ArrowRight,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Gem,
    title: "Create a Certificate",
    description:
      "Artisans connect their SUI wallet and mint a digital certificate for each handmade piece — storing metadata and a unique hash permanently on-chain.",
  },
  {
    step: "02",
    icon: Award,
    title: "Anchor to Chain",
    description:
      "The certificate hash is anchored to the SUI blockchain, creating an immutable provenance record that proves authenticity and tracks every ownership transfer.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Verify with a Scan",
    description:
      "Anyone can scan the QR code on the physical piece to instantly view the full certificate, ownership history, and authenticity status — no account required.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Tamper-Proof Certificates",
    description: "Every certificate is hashed and stored on the SUI blockchain — impossible to alter or forge after minting.",
  },
  {
    icon: ScanQrCode,
    title: "One-Scan Verification",
    description: "A single QR scan opens the complete provenance certificate — fast, mobile-first, no friction for buyers or galleries.",
  },
  {
    icon: Gem,
    title: "Built for Artisans",
    description: "Designed for ceramicists, jewelers, textile makers, and craftspeople who want to certify and protect their creative work.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 md:pt-28"
      >
        {/* Soft ambient blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[480px] w-[480px] rounded-full bg-emerald-100 opacity-40 blur-3xl"
        />

        <motion.div variants={itemVariants} className="relative space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <Gem className="h-3 w-3" />
            Artisan Authenticity on SUI Blockchain
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-(--color-foreground) sm:text-5xl md:text-6xl">
            Every craft deserves{" "}
            <span className="text-gradient-primary">a certified story</span>
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The Atelier lets artisans mint tamper-proof digital certificates for
            handmade pieces, anchor them on-chain, and give every buyer or
            collector instant, trustless proof of authenticity.
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
              Verify a Piece
            </Button>
            <Button
              id="hero-cta-demo"
              variant="ghost"
              size="lg"
              onClick={() => navigate("/item/0x7b568399589d81d4a89bc448eb586c99c43d842292f74154fa7847bc08bca08b")}
              className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border border-emerald-100 text-emerald-800"
            >
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Hero certificate preview card */}
        <motion.div 
          variants={itemVariants}
          className="relative mt-16 w-full max-w-md"
        >
          <div className="rounded-2xl bg-(--color-card) p-6 shadow-(--shadow-card) transition-all hover:scale-[1.02] duration-500">
            <div className="flex items-start justify-between">
              <div className="space-y-1 text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Artisan Certificate
                </p>
                <h2 className="font-display text-xl font-bold text-(--color-foreground)">
                  Celadon Teapot No.12
                </h2>
                <p className="text-sm text-muted-foreground">
                  Nguyen Thi Lan · Hanoi · Apr 2026
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>

            {/* Mini provenance timeline */}
            <div className="mt-5 space-y-3 text-left">
              {[
                { label: "Crafted",    loc: "Hanoi Workshop",  date: "Apr 2" },
                { label: "Certified",  loc: "On-chain record", date: "Apr 4" },
                { label: "Sold",       loc: "Gallery Maison",  date: "Apr 9" },
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
        </motion.div>
      </motion.section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section
        className="bg-(--color-surface-low) px-4 py-20 sm:px-6"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2
              id="how-it-works-heading"
              className="font-display text-3xl font-bold text-(--color-foreground)"
            >
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps from workshop to verified.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
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
              </motion.div>
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
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2
              id="features-heading"
              className="font-display text-3xl font-bold text-(--color-foreground)"
            >
              Built for trust
            </h2>
            <p className="mt-3 text-muted-foreground">
              Provenance infrastructure designed for artisans and collectors.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="bg-primary-gradient flex flex-col items-center justify-between gap-6 rounded-3xl px-8 py-12 text-center sm:flex-row sm:text-left shadow-lg">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-white">
                Ready to certify your craft?
              </h2>
              <p className="text-sm text-white/80">
                Connect your SUI wallet and mint your first certificate on-chain today.
              </p>
            </div>
            <Button
              id="cta-banner-create"
              variant="ghost"
              size="lg"
              onClick={() => navigate("/create")}
              className="shrink-0 bg-white text-[var(--color-primary)] hover:bg-white/90 hover:text-[var(--color-primary)] font-bold shadow-md"
            >
              Create a Certificate
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
