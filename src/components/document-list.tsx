import Link from "next/link";
import { Card } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import type { DocumentStatus } from "@prisma/client";

type Row = {
  id: string;
  number: string;
  status: DocumentStatus;
  currency: string;
  issueDate: Date;
  dueDate: Date | null;
  client: { name: string };
  items: { quantity: number; unitPrice: number }[];
  taxRate: number;
};

export function DocumentList({
  documents,
  basePath,
  emptyLabel,
}: {
  documents: Row[];
  basePath: string;
  emptyLabel: string;
}) {
  if (documents.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-600">{emptyLabel}</p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Number</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Issued</th>
            <th className="px-4 py-3 font-medium">Due</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const subtotal = doc.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
            const total = subtotal + subtotal * (doc.taxRate / 100);
            return (
              <tr key={doc.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link href={`${basePath}/${doc.id}`} className="font-medium text-zinc-900 hover:underline">
                    {doc.number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-600">{doc.client.name}</td>
                <td className="px-4 py-3 text-zinc-600">{formatDate(doc.issueDate)}</td>
                <td className="px-4 py-3 text-zinc-600">{formatDate(doc.dueDate)}</td>
                <td className="px-4 py-3 text-zinc-900">{formatMoney(total, doc.currency)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
