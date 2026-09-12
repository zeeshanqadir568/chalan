import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import type { DocumentStatus, DocumentType } from "@prisma/client";

type Item = { id: string; description: string; quantity: number; unitPrice: number };

export function DocumentView({
  type,
  number,
  status,
  currency,
  issueDate,
  dueDate,
  notes,
  taxRate,
  items,
  client,
  issuer,
}: {
  type: DocumentType;
  number: string;
  status: DocumentStatus;
  currency: string;
  issueDate: Date;
  dueDate: Date | null;
  notes: string | null;
  taxRate: number;
  items: Item[];
  client: { name: string; email: string | null; phone: string | null; address: string | null };
  issuer: { name: string | null; email: string };
}) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {type === "INVOICE" ? "Invoice" : "Proposal"}
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">{number}</h1>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">From</p>
          <p className="mt-1 font-medium text-zinc-900">{issuer.name ?? issuer.email}</p>
          <p className="text-sm text-zinc-600">{issuer.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">Bill to</p>
          <p className="mt-1 font-medium text-zinc-900">{client.name}</p>
          {client.email && <p className="text-sm text-zinc-600">{client.email}</p>}
          {client.phone && <p className="text-sm text-zinc-600">{client.phone}</p>}
          {client.address && <p className="text-sm text-zinc-600">{client.address}</p>}
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">Issued</p>
          <p className="text-sm text-zinc-900">{formatDate(issueDate)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">Due</p>
          <p className="text-sm text-zinc-900">{formatDate(dueDate)}</p>
        </div>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500">
          <tr>
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 font-medium">Qty</th>
            <th className="py-2 font-medium">Unit price</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-zinc-100">
              <td className="py-2 text-zinc-900">{item.description}</td>
              <td className="py-2 text-zinc-600">{item.quantity}</td>
              <td className="py-2 text-zinc-600">{formatMoney(item.unitPrice, currency)}</td>
              <td className="py-2 text-right text-zinc-900">
                {formatMoney(item.quantity * item.unitPrice, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-end gap-1 text-sm">
        <p className="text-zinc-600">Subtotal: {formatMoney(subtotal, currency)}</p>
        <p className="text-zinc-600">
          Tax ({taxRate}%): {formatMoney(tax, currency)}
        </p>
        <p className="text-lg font-semibold text-emerald-700">Total: {formatMoney(total, currency)}</p>
      </div>

      {notes && (
        <div>
          <p className="text-xs font-medium uppercase text-zinc-500">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">{notes}</p>
        </div>
      )}
    </div>
  );
}
