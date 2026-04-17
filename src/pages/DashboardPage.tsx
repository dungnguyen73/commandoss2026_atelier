import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Package, Loader2, Wallet } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/EmptyState";
import { BatchCard } from "../components/shared/BatchCard";
import { cn } from "../lib/utils";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useOwnedBatches } from "../hooks/useOwnedBatches";

type Role = "Producer" | "Logistics" | "School" | "Consumer";

const ROLES: Role[] = ["Producer", "Logistics", "School", "Consumer"];

export default function DashboardPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { batches, isLoading, error } = useOwnedBatches(account?.address);
  console.log(batches);
  // Preselect "Producer" if wallet is connected, but allow user to change it.
  const [activeRole, setActiveRole] = useState<Role>("Producer");

  // If the user connects, default them to Producer if they aren't already looking at it.
  useEffect(() => {
    if (account && activeRole !== "Producer") {
      setActiveRole("Producer");
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
            Track and manage your registered batches.
          </p>
        </div>
        <Button
          id="dashboard-create-btn"
          variant="primary"
          onClick={() => navigate("/create")}
          className="shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          Create Batch
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

      {/* ── Content by role ── */}
      {activeRole === "Producer" && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Your Owned Batches
          </p>

          {!account ? (
            <EmptyState
              icon={<Wallet className="h-6 w-6" />}
              title="Wallet Not Connected"
              description="Please connect your SUI wallet to view your owned items."
            />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-4 font-medium">Fetching your batches...</p>
            </div>
          ) : error ? (
            <EmptyState
              icon={<Package className="h-6 w-6 text-red-500" />}
              title="Error Loading Batches"
              description={`Something went wrong while fetching from the SUI network: ${error}`}
            />
          ) : batches.length === 0 ? (
            <EmptyState
              icon={<Package className="h-6 w-6" />}
              title="No batches found"
              description="You don't own any batches yet. Create one to get started."
              action={{ label: "Create Batch", onClick: () => navigate("/create") }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {batches.map((item: any, index: number) => (
                <BatchCard key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeRole === "Logistics" && (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No batches assigned yet"
          description="Once a producer transfers a batch to you, it will appear here for custody updates."
        />
      )}

      {activeRole === "School" && (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No batches to verify"
          description="Search for a batch by ID, or scan a QR code to start a verification."
          action={{ label: "Scan QR", onClick: () => navigate("/scan") }}
        />
      )}

      {activeRole === "Consumer" && (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="Scan to see origin"
          description="Use the Scan page to read a product QR code and view its full provenance history."
          action={{ label: "Scan QR", onClick: () => navigate("/scan") }}
        />
      )}
    </PageContainer>
  );
}
