import { Badge } from "@/components/ui";
import type { DocumentStatus } from "@prisma/client";

const tones: Record<DocumentStatus, "zinc" | "green" | "amber" | "red" | "blue"> = {
  DRAFT: "zinc",
  SENT: "blue",
  PAID: "green",
  OVERDUE: "red",
  ACCEPTED: "green",
  DECLINED: "red",
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return <Badge tone={tones[status]}>{status}</Badge>;
}
