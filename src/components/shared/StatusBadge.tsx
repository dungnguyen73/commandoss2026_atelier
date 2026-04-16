import { Badge } from "../ui/badge";
import type { BadgeVariant } from "../ui/badge";

export type BatchStatus = "Verified" | "In Transit" | "Created" | "Pending" | "Flagged";

const statusMap: Record<BatchStatus, BadgeVariant> = {
  Verified: "verified",
  "In Transit": "in-transit",
  Created: "created",
  Pending: "pending",
  Flagged: "flagged",
};

export function StatusBadge({ status }: { status: BatchStatus }) {
  return <Badge variant={statusMap[status]}>{status}</Badge>;
}
