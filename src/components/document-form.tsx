"use client";

import { useActionState, useMemo, useState } from "react";
import { createDocumentAction } from "@/lib/actions/documents";
import { formatMoney } from "@/lib/format";
import { documentTotals } from "@/lib/totals";
import { Button, FieldError, Input, Label, Select, Textarea } from "@/components/ui";

type Item = { description: string; quantity: string; unitPrice: string };

const emptyItem: Item = { description: "", quantity: "1", unitPrice: "0" };

export function DocumentForm({
  type,
  clients,
  defaultNumber,
}: {
  type: "INVOICE" | "PROPOSAL";
  clients: { id: string; name: string }[];
  defaultNumber: string;
}) {
  const action = useMemo(() => createDocumentAction.bind(null, type), [type]);
  const [state, formAction, pending] = useActionState(action, {});
  const [items, setItems] = useState<Item[]>([{ ...emptyItem }]);
  const [currency, setCurrency] = useState("PKR");
  const [taxRate, setTaxRate] = useState("0");

  const totals = useMemo(
    () =>
      documentTotals(
        items.map((item) => ({
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
        })),
        Number(taxRate) || 0
      ),
    [items, taxRate]
  );

  function updateItem(index: number, field: keyof Item, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity) || 0,
        unitPrice: Number(i.unitPrice) || 0,
      })))} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select id="clientId" name="clientId" required defaultValue="">
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError messages={state.fieldErrors?.clientId} />
        </div>
        <div>
          <Label htmlFor="number">{type === "INVOICE" ? "Invoice" : "Proposal"} number</Label>
          <Input id="number" name="number" defaultValue={defaultNumber} required />
          <FieldError messages={state.fieldErrors?.number} />
        </div>
        <div>
          <Label htmlFor="issueDate">Issue date</Label>
          <Input id="issueDate" name="issueDate" type="date" defaultValue={today} required />
        </div>
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            id="currency"
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="PKR">PKR — Pakistani Rupee</option>
            <option value="USD">USD — US Dollar</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="taxRate">Tax rate (%)</Label>
          <Input
            id="taxRate"
            name="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="mb-0">Line items</Label>
          <Button type="button" variant="secondary" onClick={addItem}>
            Add item
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_90px_120px_auto] items-start gap-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Unit price"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
              />
              <Button type="button" variant="ghost" onClick={() => removeItem(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <FieldError messages={state.fieldErrors?.items} />
      </div>

      <div className="flex flex-col items-end gap-1 border-t border-zinc-200 pt-4 text-sm">
        <p className="text-zinc-600">Subtotal: {formatMoney(totals.subtotal, currency)}</p>
        <p className="text-zinc-600">Tax: {formatMoney(totals.tax, currency)}</p>
        <p className="text-base font-semibold text-zinc-900">
          Total: {formatMoney(totals.total, currency)}
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Payment terms, thank-you note, etc." />
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : `Save ${type === "INVOICE" ? "invoice" : "proposal"}`}
      </Button>
    </form>
  );
}
