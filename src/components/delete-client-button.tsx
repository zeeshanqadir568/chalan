"use client";

import { useTransition } from "react";
import { deleteClientAction } from "@/lib/actions/clients";
import { Button } from "@/components/ui";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this client? This cannot be undone.")) return;
        startTransition(() => deleteClientAction(clientId));
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
