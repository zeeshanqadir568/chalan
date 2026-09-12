"use client";

import { useTransition } from "react";
import { updateDocumentStatusAction, deleteDocumentAction } from "@/lib/actions/documents";
import { Button } from "@/components/ui";
import type { DocumentStatus, DocumentType } from "@prisma/client";

export function DocumentStatusActions({
  documentId,
  type,
  status,
}: {
  documentId: string;
  type: DocumentType;
  status: DocumentStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {status === "DRAFT" && (
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() => startTransition(() => updateDocumentStatusAction(documentId, "SENT"))}
        >
          Mark as sent
        </Button>
      )}
      {type === "PROPOSAL" && status === "SENT" && (
        <>
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() => startTransition(() => updateDocumentStatusAction(documentId, "ACCEPTED"))}
          >
            Mark accepted
          </Button>
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() => startTransition(() => updateDocumentStatusAction(documentId, "DECLINED"))}
          >
            Mark declined
          </Button>
        </>
      )}
      <Button
        variant="danger"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this document? This cannot be undone.")) return;
          startTransition(() => deleteDocumentAction(documentId, type));
        }}
      >
        Delete
      </Button>
    </div>
  );
}
