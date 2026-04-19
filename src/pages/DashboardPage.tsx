import { useNavigate } from "react-router-dom";
import { PlusCircle, Gem, Loader2, Wallet, Award, Activity, Search, ShieldCheck } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/EmptyState";
import { BatchCard } from "../components/shared/BatchCard";
import { cn } from "../lib/utils";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useTransactionExecution } from "../hooks/useTransactionExecution";
import { useOwnedCertificates } from "../hooks/useOwnedCertificates";
import { useCreatedCertificates } from "../hooks/useCreatedCertificates";
import { useRecentCertificates } from "../hooks/useRecentCertificates";
import { useArtisanProfile } from "../hooks/useArtisanProfile";
import { Transaction } from "@mysten/sui/transactions";
import { ATELIER_PACKAGE_ID } from "../config/network";
import { useStore } from "@nanostores/react";
import { $roleStore, ROLES } from "../store/roleStore";
import { useState, useMemo } from "react";
import { unpackNote } from "../lib/unpack";
import { motion } from "framer-motion";

function ActiveFigure() {
  return (
    <div className="relative h-48 w-48 sm:h-64 sm:w-64 flex items-center justify-center animate-float">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-emerald-400/20 blur-[80px] rounded-full animate-pulse-luxury" />

      {/* Abstract Glass Sculpture (SVG) */}
      <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#d7f5e5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0a4d2c" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <motion.path
          d="M100,20 Q160,20 180,80 T100,180 Q40,180 20,120 T100,20"
          fill="url(#glassGradient)"
          stroke="#0a4d2c"
          strokeWidth="0.5"
          animate={{
            d: [
              "M100,20 Q160,20 180,80 T100,180 Q40,180 20,120 T100,20",
              "M100,40 Q140,20 190,100 T100,160 Q60,180 10,100 T100,40",
              "M100,20 Q160,20 180,80 T100,180 Q40,180 20,120 T100,20"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="100" cy="100" r="10"
          fill="#1a1f18"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: any; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-3xl bg-white p-6 shadow-(--shadow-card) ring-1 ring-slate-100 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 text-left">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-display font-extrabold text-(--color-foreground)"
          >
            {value}
          </motion.h3>
          <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-600 shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Artisan View ── */
function ArtisanView({ account, certificates, isLoading, error, profile, isLoadingProfile, onSetupProfile, isSettingUp }: any) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">
        Registry: Your Creations
      </p>

      {!account ? (
        <EmptyState
          icon={<Wallet className="h-6 w-6" />}
          title="Archive Locked"
          description="Please connect your artisan wallet to access your certification history."
        />
      ) : isLoadingProfile ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-(--color-primary)" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Hydrating Profile...</p>
        </div>
      ) : !profile ? (
        <div className="rounded-[2.5rem] bg-white p-12 text-center shadow-lg ring-1 ring-slate-100 animate-in zoom-in duration-700">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-emerald-50 text-(--color-primary) flex items-center justify-center mb-6">
            <Award className="h-10 w-10" />
          </div>
          <h3 className="font-display text-2xl font-black mb-3">Initialize Artisan Credentials</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8">Set up your immutable on-chain artisan profile to start minting heritage provenance certificates.</p>
          <Button variant="primary" onClick={onSetupProfile} disabled={isSettingUp} className="px-10 py-6 rounded-2xl shadow-lg shadow-emerald-900/10">
            {isSettingUp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            Create On-Chain Profile
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
          <p className="mt-4 font-bold uppercase tracking-widest text-xs">Querying History...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon={<Gem className="h-6 w-6 text-red-500" />}
          title="Network Connectivity Issue"
          description={`Secure query failed: ${error}`}
        />
      ) : certificates.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon={<Gem className="h-6 w-6" />}
            title="Clean Slate"
            description="You haven't anchored any masterpieces to the blockchain yet. Start your journey with a new certificate."
            action={{ label: "Begin First Mint", onClick: () => navigate("/create") }}
          />
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((item: any, idx: number) => (
            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <BatchCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Owner View ── */
function OwnerView({ account, certificates, isLoading, error }: any) {

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">
        Vault: Collected Masterpieces
      </p>

      {!account ? (
        <EmptyState
          icon={<Wallet className="h-6 w-6" />}
          title="Vault Restricted"
          description="Connect your collector wallet to view your authentic collection."
        />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
          <p className="mt-4 font-bold uppercase tracking-widest text-xs">Accessing Private Vault...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon={<Gem className="h-6 w-6 text-red-500" />}
          title="Vault Error"
          description={`Failed to synchronize your collection: ${error}`}
        />
      ) : certificates.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon={<Gem className="h-6 w-6" />}
            title="Empty Vault"
            description="Once a piece is transferred to your address, it will be secured in your private vault with full provenance."
          />
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((item: any, idx: number) => (
            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <BatchCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Buyer View ── */
function BuyerView({ recentCertificates, ownedCertificates }: any) {
  const navigate = useNavigate();

  // Deduplicate: Hide items that are already owned
  const filteredRecent = recentCertificates.filter(
    (recentByScan: any) => !ownedCertificates.some((owned: any) => owned.id === recentByScan.id)
  );

  return (
    <div className="space-y-12">
      <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-950 to-emerald-900 p-12 text-center text-white shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-white/10 text-emerald-300 flex items-center justify-center mb-6 backdrop-blur-md ring-1 ring-white/20">
          <Gem className="h-10 w-10 animate-pulse" />
        </div>
        <h2 className="font-display text-4xl font-extrabold mb-4">Discover Handcrafted Heritage</h2>
        <p className="text-emerald-100/70 max-w-lg mx-auto mb-10 text-lg">Use our cryptographic scanner to reveal the story, materials, and artisan behind any certified piece.</p>
        <Button variant="secondary" onClick={() => navigate("/scan")} className="px-12 py-8 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 text-lg font-bold">
          Launch Atelier Scanner
        </Button>
      </div>

      {filteredRecent.length > 0 && (
        <div className="space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
            Recently Scouted
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecent.map((item: any, idx: number) => (
              <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                <BatchCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Verifier View ── */
function VerifierView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().startsWith("0x")) {
      navigate(`/item/${searchQuery.trim()}`);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="rounded-[2.5rem] bg-white p-10 shadow-[0px_40px_80px_-20px_rgba(10,77,44,0.08)] ring-1 ring-slate-100 overflow-hidden relative">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-3xl bg-emerald-50 text-(--color-primary) flex items-center justify-center mb-6 shadow-sm ring-1 ring-emerald-100">
            <Search className="h-10 w-10" />
          </div>
          <h2 className="font-display text-3xl font-extrabold text-(--color-foreground)">Registry Inspector</h2>
          <p className="max-w-md text-sm text-muted-foreground mt-3 leading-relaxed">
            Verify the provenance and authenticity of any Atelier piece by entering its unique topographic identifier. 
            <span className="block mt-2 font-bold text-(--color-primary)">Now supporting Verifier Verdicts: Cast your professional vote on any item to build community trust.</span>
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-10 relative flex gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Enter Certificate ID (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-5 rounded-2xl bg-(--color-surface-low) border border-(--color-outline-variant) text-base font-medium outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-(--color-primary) focus:bg-white"
            />
          </div>
          <Button type="submit" variant="primary" className="px-10 rounded-2xl shadow-lg shadow-emerald-900/10">
            Inspect
          </Button>
        </form>

        {/* Decor */}
        <div className="absolute top-0 right-0 p-8 text-emerald-500/5 rotate-12">
          <ShieldCheck className="h-40 w-40" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 items-center bg-white/40 p-10 rounded-[2.5rem] ring-1 ring-slate-200/50 backdrop-blur-sm">
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-bold">In-Field Verification</h3>
          <p className="text-sm text-muted-foreground">The most reliable way to authenticate an item is to scan its physical identity anchor (QR code) using a mobile device.</p>
          <Button variant="secondary" onClick={() => navigate("/scan")} className="rounded-xl px-8">
            Open Scanner
          </Button>
        </div>
        <div className="flex justify-center">
          <div className="h-40 w-40 p-4 bg-white rounded-3xl shadow-sm ring-1 ring-emerald-50 flex items-center justify-center text-(--color-primary)/20">
            <PlusCircle className="h-20 w-20 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { execute, isZkLogin } = useTransactionExecution();

  const { certificates: ownedCertificates, isLoading: isLoadingOwned, error: errorOwned } = useOwnedCertificates(account?.address);
  const { certificates: createdCertificates, isLoading: isLoadingCreated, error: errorCreated } = useCreatedCertificates(account?.address);
  const { certificates: recentCertificates } = useRecentCertificates();
  const { profile, isLoading: isLoadingProfile, refetch: refetchProfile } = useArtisanProfile(account?.address);

  const [isSettingUp, setIsSettingUp] = useState(false);
  const activeRole = useStore($roleStore);

  const isLoading = activeRole === "Artisan" ? isLoadingCreated : (activeRole === "Owner" ? isLoadingOwned : false);
  const error = activeRole === "Artisan" ? errorCreated : (activeRole === "Owner" ? errorOwned : null);

  // Helper to transform raw certificate into the UI CertItem shape
  const transformToCertItem = (c: any) => {
    const { imageUrl } = unpackNote(c.note || "");
    return {
      id: c.id,
      name: c.name,
      category: c.category,
      location: c.location,
      status: c.status || "Verified",
      createdAt: new Date(Number(c.created_at)).toLocaleDateString(),
      imageUrl,
      artisanName: c.artisan_name
    };
  };

  const enhancedCreated = createdCertificates.map(transformToCertItem);
  const enhancedOwned = ownedCertificates.map(transformToCertItem);
  const enhancedRecent = recentCertificates.map(transformToCertItem);

  // For Owners, we show items they own but did NOT create
  const collectedCertificates = enhancedOwned.filter(
    (c: any) => c.creator !== account?.address // This might need raw data check, but for now filtering is fine
  );

  const handleCreateProfile = async () => {
    setIsSettingUp(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${ATELIER_PACKAGE_ID}::atelier::create_profile`,
        arguments: [],
      });
      await execute(tx);
      await refetchProfile();
    } catch (err) {
      console.error("Profile setup failed:", err);
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <PageContainer>
      {/* ── Luxury Hero Section ── */}
      <section className="relative mb-10 sm:mb-16 overflow-hidden rounded-[2rem] sm:rounded-[3rem] luxury-mesh p-8 sm:p-16 ring-1 ring-white/50 shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-full pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-slate-400/10 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-block rounded-full bg-emerald-950 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300"
            >
              Immerse In Provenance
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-black text-(--color-foreground) leading-[1.1]"
            >
              The digital anchor <br /> for <span className="italic font-serif serif text-emerald-800">handcrafted</span> heritage.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground font-medium max-w-md mx-auto lg:mx-0"
            >
              {activeRole === "Artisan" && "Registry standing active. Your immutable archive of creation is synchronized with the global ledger."}
              {activeRole === "Owner" && "Collector status active. Your heritage vault contains verified assets with cryptographic integrity."}
              {activeRole === "Buyer" && "Exploration mode active. Discover authentic masterpieces and the artisans who defined their history."}
              {activeRole === "Verifier" && "Inspector mode active. Directly query the truth of any Atelier anchor on the SUI network."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              {activeRole === "Artisan" && (
                <Button variant="primary" onClick={() => navigate("/create")} className="h-14 px-10 rounded-2xl shadow-lg shadow-emerald-900/10">
                  <PlusCircle className="mr-3 h-5 w-5" /> New Certificate
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => document.getElementById("atelier-hub")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-10 rounded-2xl bg-white/50 backdrop-blur-sm border-white/80"
              >
                <Search className="mr-3 h-5 w-5" /> View Registry
              </Button>
            </motion.div>
          </div>

          <div className="flex justify-center flex-1">
            <ActiveFigure />
          </div>
        </div>
      </section>

      <div id="atelier-hub" className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 scroll-mt-24">
        <h2 className="font-display text-2xl font-black uppercase tracking-widest text-(--color-foreground)">
          Atelier Hub
        </h2>
        {account && (
          <Button
            variant="ghost"
            onClick={() => refetchProfile()}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-(--color-primary)"
          >
            Refetch Profile
          </Button>
        )}
      </div>

      {/* ── Role tabs ── */}
      <div
        className="mb-10 inline-flex rounded-2xl bg-(--color-surface-low) p-1.5 overflow-x-auto w-full sm:w-auto animate-in fade-in duration-700 delay-200 shadow-inner"
        role="tablist"
        aria-label="Dashboard role"
      >
        {ROLES.map((role) => (
          <button
            key={role}
            id={`role-tab-${role.toLowerCase()}`}
            role="tab"
            aria-selected={activeRole === role}
            onClick={() => $roleStore.set(role)}
            className={cn(
              "rounded-xl px-8 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap",
              activeRole === role
                ? "bg-(--color-card) text-(--color-primary) shadow-md scale-[1.02]"
                : "text-muted-foreground hover:text-(--color-foreground) hover:bg-white/40",
            )}
          >
            {role}
          </button>
        ))}
      </div>

      {/* ── Metrics Grid ── */}
      {account && !isLoading && !error && (
        <div className="mb-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          {activeRole === "Artisan" && (
            <>
              <MetricCard
                title="Total Minted"
                value={createdCertificates.length}
                icon={Gem}
                description="Unique certifications created"
              />
              <MetricCard
                title="Artisan Standing"
                value="Verified"
                icon={Award}
                description="Registry initialization active"
              />
            </>
          )}
          {activeRole === "Owner" && (
            <>
              <MetricCard
                title="Your Collection"
                value={collectedCertificates.length}
                icon={Gem}
                description="Authentic pieces collected"
              />
              <MetricCard
                title="Account Standing"
                value="Verified"
                icon={Activity}
                description="Provenance history active"
              />
            </>
          )}
        </div>
      )}

      <div className="animate-in fade-in duration-1000 delay-300">
        {activeRole === "Artisan" && (
          <ArtisanView
            account={account}
            certificates={enhancedCreated}
            isLoading={isLoadingCreated}
            error={errorCreated}
            profile={profile}
            isLoadingProfile={isLoadingProfile}
            onSetupProfile={handleCreateProfile}
            isSettingUp={isSettingUp}
          />
        )}

        {activeRole === "Owner" && (
          <OwnerView
            account={account}
            certificates={enhancedOwned}
            isLoading={isLoadingOwned}
            error={errorOwned}
          />
        )}

        {activeRole === "Verifier" && <VerifierView />}

        {activeRole === "Buyer" && (
          <BuyerView
            recentCertificates={enhancedRecent}
            ownedCertificates={enhancedOwned}
          />
        )}
      </div>
    </PageContainer>
  );
}
