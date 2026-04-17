import { Badge } from "../ui/badge";
import type { BadgeVariant } from "../ui/badge";

export type CertStatus = "Created" | "Certified" | "Transferred" | "Verified" | "Tampered" | "Closed";

const statusMap: Record<CertStatus, BadgeVariant> = {
  Created:     "created",
  Certified:   "certified",
  Transferred: "transferred",
  Verified:    "verified",
  Tampered:    "tampered",
  Closed:      "closed",
};

export function StatusBadge({ status }: { status: CertStatus }) {
  return <Badge variant={statusMap[status]}>{status}</Badge>;
}
