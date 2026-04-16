import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Package } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/EmptyState";
import { BatchCard } from "../components/shared/BatchCard";
import type { BatchItem } from "../components/shared/BatchCard";
import { cn } from "../lib/utils";

type Role = "Producer" | "Logistics" | "School" | "Consumer";

const ROLES: Role[] = ["Producer", "Logistics", "School", "Consumer"];

// Placeholder items — will be replaced with on-chain data in Phase 2
const PLACEHOLDER_ITEMS: BatchItem[] = [
  {
    id: "0x4f2a8c",
    name: "Jasmine Rice Batch #001",
    category: "Grains",
    origin: "Chiang Mai, Thailand",
    status: "Verified",
    createdAt: "Apr 2, 2026",
  },
  {
    id: "0x9e3b1d",
    name: "Organic Spinach Lot A",
    category: "Vegetables",
    origin: "Nakhon Pathom, Thailand",
    status: "In Transit",
    createdAt: "Apr 8, 2026",
  },
  {
    id: "0x2c7f55",
    name: "Brown Rice Batch #003",
    category: "Grains",
    origin: "Suphan Buri, Thailand",
    status: "Created",
    createdAt: "Apr 12, 2026",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<Role>("Producer");

  return (
    <PageContainer>
      {/* ── Page header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-(--color-foreground)">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
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
        className="mb-8 inline-flex rounded-xl bg-(--color-surface-low) p-1"
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
              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
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
        <div className="space-y-3">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Your Registered Batches
          </p>
          {PLACEHOLDER_ITEMS.map((item) => (
            <BatchCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {activeRole === "Logistics" && (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No batches assigned yet"
          description="Once a producer assigns a batch to you, it will appear here for custody updates."
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
