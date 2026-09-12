"use client";

import { useActionState, useMemo } from "react";
import { markPaidAction } from "@/lib/actions/documents";
import { Button, Select, Input, Label } from "@/components/ui";

export function MarkPaidForm({ documentId }: { documentId: string }) {
  const action = useMemo(() => markPaidAction.bind(null, documentId), [documentId]);
  const [, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-md border border-zinc-200 p-4">
      <div>
        <Label htmlFor="paymentMethod">Payment method</Label>
        <Select id="paymentMethod" name="paymentMethod" defaultValue="BANK_TRANSFER">
          <option value="BANK_TRANSFER">Bank transfer</option>
          <option value="JAZZCASH">JazzCash</option>
          <option value="EASYPAISA">EasyPaisa</option>
          <option value="CASH">Cash</option>
          <option value="OTHER">Other</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="paymentRef">Reference number</Label>
        <Input id="paymentRef" name="paymentRef" placeholder="Optional" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Mark as paid"}
      </Button>
    </form>
  );
}
