import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Gem, Loader2, Wallet, Award, Activity } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/EmptyState";
import { BatchCard } from "../components/shared/BatchCard";
import { cn } from "../lib/utils";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useOwnedCertificates } from "../hooks/useOwnedCertificates";
import { useStore } from "@nanostores/react";
import { $roleStore, ROLES } from "../store/roleStore";

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
  const { certificates, isLoading, error } = useOwnedCertificates(account?.address);
  const activeRole = useStore($roleStore);

  const artisanCertificates = certificates.filter(
    (c: any) => c.creator === account?.address
  );
  const ownerCertificates = certificates.filter(
    (c: any) => c.creator !== account?.address
  );

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

      {/* ── Metrics Grid (Conditional) ── */}
      {account && !isLoading && !error && (
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {activeRole === "Artisan" && (
            <>
              <MetricCard 
                title="Total Minted" 
                value={artisanCertificates.length} 
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
                value={ownerCertificates.length} 
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
              Your Certificates
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
                <p className="mt-4 font-medium">Fetching your certificates...</p>
              </div>
            ) : error ? (
              <EmptyState
                icon={<Gem className="h-6 w-6 text-red-500" />}
                title="Error Loading Certificates"
                description={`Something went wrong while fetching from the SUI network: ${error}`}
              />
            ) : artisanCertificates.length === 0 ? (
              <EmptyState
                icon={<Gem className="h-6 w-6" />}
                title="No certificates found"
                description="You haven't minted any certificates yet. Create one to get started."
                action={{ label: "New Certificate", onClick: () => navigate("/create") }}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {artisanCertificates.map((item: any, idx: number) => (
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
            ) : ownerCertificates.length === 0 ? (
              <EmptyState
                icon={<Gem className="h-6 w-6" />}
                title="No certificates transferred to you yet"
                description="Once an artisan transfers a certificate to you, it will appear here for safekeeping and re-transfer."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ownerCertificates.map((item: any, idx: number) => (
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
          <EmptyState
            icon={<Gem className="h-6 w-6" />}
            title="Discover certified pieces"
            description="Scan an item's QR code to view its full certificate, provenance history, and transfer record."
            action={{ label: "Scan QR", onClick: () => navigate("/scan") }}
          />
        )}
      </div>
    </PageContainer>
  );
}
