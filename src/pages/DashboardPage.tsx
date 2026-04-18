import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Gem, Loader2, Wallet, Award, Activity } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/EmptyState";
import { BatchCard } from "../components/shared/BatchCard";
import { cn } from "../lib/utils";
import { useCurrentAccount, useDAppKit, CurrentAccountSigner } from "@mysten/dapp-kit-react";
import { useOwnedCertificates } from "../hooks/useOwnedCertificates";
import { useCreatedCertificates } from "../hooks/useCreatedCertificates";
import { useRecentCertificates } from "../hooks/useRecentCertificates";
import { useArtisanProfile } from "../hooks/useArtisanProfile";
import { Transaction } from "@mysten/sui/transactions";
import { ATELIER_PACKAGE_ID } from "../config/network";
import { useStore } from "@nanostores/react";
import { $roleStore, ROLES } from "../store/roleStore";
import { useState, useMemo } from "react";



function MetricCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: any; description: string }) {
  return (
    <div className="rounded-2xl bg-(--color-card) p-5 shadow-(--shadow-card) border border-(--color-outline-variant) transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-(--color-foreground)">{value}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const signer = useMemo(() => new CurrentAccountSigner(dAppKit as any), [dAppKit]);

  
  const { certificates: ownedCertificates, isLoading: isLoadingOwned, error: errorOwned } = useOwnedCertificates(account?.address);
  const { certificates: createdCertificates, isLoading: isLoadingCreated, error: errorCreated } = useCreatedCertificates(account?.address);
  const { certificates: recentCertificates } = useRecentCertificates();
  const { profile, isLoading: isLoadingProfile, refetch: refetchProfile } = useArtisanProfile(account?.address);
  
  const [isSettingUp, setIsSettingUp] = useState(false);
  const activeRole = useStore($roleStore);

  const isLoading = activeRole === "Artisan" ? isLoadingCreated : isLoadingOwned;
  const error = activeRole === "Artisan" ? errorCreated : errorOwned;

  // For Owners, we show items they own but did NOT create
  const collectedCertificates = ownedCertificates.filter(

    (c: any) => c.creator !== account?.address
  );

  const handleCreateProfile = async () => {
    if (!signer) return;
    setIsSettingUp(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${ATELIER_PACKAGE_ID}::atelier::create_profile`,
        arguments: [],
      });
      await signer.signAndExecuteTransaction({ transaction: tx });
      await refetchProfile();
    } catch (err) {
      console.error("Profile setup failed:", err);
    } finally {
      setIsSettingUp(false);
    }
  };


  useEffect(() => {
    if (account && activeRole === "Buyer") {
      $roleStore.set("Artisan");
    }
  }, [account]);

  return (
    <PageContainer>
      {/* ── Page header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Track and manage your certified artisan pieces.
          </p>
        </div>
        {activeRole === "Artisan" && (
          <Button
            id="dashboard-create-btn"
            variant="primary"
            onClick={() => navigate("/create")}
            className="shrink-0 group"
          >
            <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90" />
            New Certificate
          </Button>
        )}
      </div>
      
      {/* ── Profile Setup Banner ── */}
      {activeRole === "Artisan" && account && !isLoadingProfile && !profile && (
        <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Setup Artisan Profile</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Initialize your on-chain registry to securely track all your creations, even after they're sold.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCreateProfile}
              disabled={isSettingUp}
              className="bg-white border-amber-200 hover:bg-amber-100 text-amber-700 whitespace-nowrap"
            >
              {isSettingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initialize Profile"}
            </Button>
          </div>
        </div>
      )}


      {/* ── Metrics Grid (Conditional) ── */}
      {account && !isLoading && !error && (
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {activeRole === "Artisan" && (
            <>
              <MetricCard 
                title="Total Minted" 
                value={createdCertificates.length} 
                icon={Gem}
                description="Unique certifications created"
              />
              <MetricCard 
                title="Active Status" 
                value="Artisan" 
                icon={Award}
                description="Verified creator profile"
              />
            </>
          )}
          {activeRole === "Owner" && (
            <>
              <MetricCard 
                title="Collections" 
                value={collectedCertificates.length} 
                icon={Gem}
                description="Authentic pieces collected"
              />
              <MetricCard 
                title="Account Standing" 
                value="Verified" 
                icon={Activity}
                description="On-chain history active"
              />
            </>
          )}
        </div>
      )}

      {/* ── Role tabs ── */}
      <div
        className="mb-8 inline-flex rounded-xl bg-[var(--color-surface-low)] p-1 overflow-x-auto w-full sm:w-auto animate-in fade-in duration-700 delay-200"
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
              "rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeRole === role
                ? "bg-(--color-card) text-(--color-primary) shadow-(--shadow-sm)"
                : "text-muted-foreground hover:text-(--color-foreground) hover:bg-(--color-surface-lowest)/50",
            )}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-1000 delay-300">
        {/* ── Artisan: owned certificates ── */}
        {activeRole === "Artisan" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your Creation History
            </p>

            {!account ? (
              <EmptyState
                icon={<Wallet className="h-6 w-6" />}
                title="Wallet Not Connected"
                description="Please connect your SUI wallet to view your certificates."
              />
            ) : isLoadingCreated ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
                <p className="mt-4 font-medium">Fetching your creation history...</p>
              </div>
            ) : errorCreated ? (
              <EmptyState
                icon={<Gem className="h-6 w-6 text-red-500" />}
                title="Error Loading Certificates"
                description={`Something went wrong while fetching from the SUI network: ${errorCreated}`}
              />
            ) : createdCertificates.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={<Gem className="h-6 w-6" />}
                  title="No certificates found"
                  description="You haven't minted any certificates yet. Create one to get started."
                  action={{ label: "New Certificate", onClick: () => navigate("/create") }}
                />
                <div className="flex justify-center">
                  <button 
                    onClick={() => navigate("/item/0x7b568399589d81d4a89bc448eb586c99c43d842292f74154fa7847bc08bca08b")}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                  >
                    View a demo certificate instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {createdCertificates.map((item: any, idx: number) => (
                  <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <BatchCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Owner: transferred certificates ── */}
        {activeRole === "Owner" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Collected Certificates
            </p>

            {!account ? (
              <EmptyState
                icon={<Wallet className="h-6 w-6" />}
                title="Wallet Not Connected"
                description="Please connect your SUI wallet to view your certificates."
              />
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
                <p className="mt-4 font-medium">Fetching incoming certificates...</p>
              </div>
            ) : error ? (
              <EmptyState
                icon={<Gem className="h-6 w-6 text-red-500" />}
                title="Error Loading Certificates"
                description={`Something went wrong while fetching from the SUI network: ${error}`}
              />
            ) : collectedCertificates.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={<Gem className="h-6 w-6" />}
                  title="No certificates transferred to you yet"
                  description="Once an artisan transfers a certificate to you, it will appear here for safekeeping and re-transfer."
                />
                <div className="flex justify-center">
                  <button 
                    onClick={() => navigate("/item/0x7b568399589d81d4a89bc448eb586c99c43d842292f74154fa7847bc08bca08b")}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                  >
                    View a demo certificate
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collectedCertificates.map((item: any, idx: number) => (
                  <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <BatchCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Verifier: verification lookup ── */}
        {activeRole === "Verifier" && (
          <EmptyState
            icon={<Gem className="h-6 w-6" />}
            title="Nothing to verify yet"
            description="Search for a certificate by ID, or scan a QR code to verify authenticity."
            action={{ label: "Scan QR", onClick: () => navigate("/scan") }}
          />
        )}

        {/* ── Buyer: browsing certificates ── */}
        {activeRole === "Buyer" && (
          <div className="space-y-6">
            <EmptyState
              icon={<Gem className="h-6 w-6" />}
              title="Discover certified pieces"
              description="Scan an item's QR code to view its full certificate, provenance history, and transfer record."
              action={{ label: "Scan QR", onClick: () => navigate("/scan") }}
            />
            
            {recentCertificates.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-(--color-outline-variant)">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Recently Scouted
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentCertificates.map((item: any, idx: number) => (
                    <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                      <BatchCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </PageContainer>
  );
}
