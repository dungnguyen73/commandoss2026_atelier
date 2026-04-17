import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Gem, Loader2, Wallet } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/EmptyState";
import { BatchCard } from "../components/shared/BatchCard";
import { cn } from "../lib/utils";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useOwnedCertificates } from "../hooks/useOwnedCertificates";

type Role = "Artisan" | "Owner" | "Verifier" | "Buyer";

const ROLES: Role[] = ["Artisan", "Owner", "Verifier", "Buyer"];

export default function DashboardPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { certificates, isLoading, error } = useOwnedCertificates(account?.address);

  // Default to "Artisan" when a wallet is connected.
  const [activeRole, setActiveRole] = useState<Role>("Artisan");

  useEffect(() => {
    if (account && activeRole !== "Artisan") {
      setActiveRole("Artisan");
    }
  }, [account]);

  return (
    <PageContainer>
      {/* ── Page header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Track and manage your certified artisan pieces.
          </p>
        </div>
        <Button
          id="dashboard-create-btn"
          variant="primary"
          onClick={() => navigate("/create")}
          className="shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          New Certificate
        </Button>
      </div>

      {/* ── Role tabs ── */}
      <div
        className="mb-8 inline-flex rounded-xl bg-[var(--color-surface-low)] p-1 overflow-x-auto w-full sm:w-auto"
        role="tablist"
        aria-label="Dashboard role"
      >
        {ROLES.map((role) => (
          <button
            key={role}
            id={`role-tab-${role.toLowerCase()}`}
            role="tab"
            aria-selected={activeRole === role}
            onClick={() => setActiveRole(role)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap",
              activeRole === role
                ? "bg-(--color-card) text-(--color-primary) shadow-(--shadow-sm)"
                : "text-muted-foreground hover:text-(--color-foreground)",
            )}
          >
            {role}
          </button>
        ))}
      </div>

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
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-4 font-medium">Fetching your certificates...</p>
            </div>
          ) : error ? (
            <EmptyState
              icon={<Gem className="h-6 w-6 text-red-500" />}
              title="Error Loading Certificates"
              description={`Something went wrong while fetching from the SUI network: ${error}`}
            />
          ) : certificates.length === 0 ? (
            <EmptyState
              icon={<Gem className="h-6 w-6" />}
              title="No certificates found"
              description="You haven't minted any certificates yet. Create one to get started."
              action={{ label: "New Certificate", onClick: () => navigate("/create") }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((item: any) => (
                <BatchCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Owner: transferred certificates ── */}
      {activeRole === "Owner" && (
        <EmptyState
          icon={<Gem className="h-6 w-6" />}
          title="No certificates transferred to you yet"
          description="Once an artisan transfers a certificate to you, it will appear here for safekeeping and re-transfer."
        />
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
    </PageContainer>
  );
}
