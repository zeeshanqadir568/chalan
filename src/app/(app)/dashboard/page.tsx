import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { documentTotals } from "@/lib/totals";
import { Card, Button } from "@/components/ui";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const invoices = await db.document.findMany({
    where: { userId, type: "INVOICE" },
    include: { items: true },
  });

  const outstanding = invoices.filter((d) => d.status === "SENT" || d.status === "OVERDUE");
  const paid = invoices.filter((d) => d.status === "PAID");

  const outstandingTotal = outstanding.reduce((sum, d) => sum + documentTotals(d.items, d.taxRate).total, 0);
  const paidTotal = paid.reduce((sum, d) => sum + documentTotals(d.items, d.taxRate).total, 0);
  const overdueCount = invoices.filter((d) => d.status === "OVERDUE").length;

  const currency = invoices[0]?.currency ?? "PKR";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/invoices/new">
            <Button>New invoice</Button>
          </Link>
          <Link href="/proposals/new">
            <Button variant="secondary">New proposal</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card accent="amber">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              ⏳
            </span>
            <p className="text-sm text-zinc-500">Outstanding</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-zinc-900">{formatMoney(outstandingTotal, currency)}</p>
          <p className="mt-1 text-xs text-zinc-500">{outstanding.length} invoice(s)</p>
        </Card>
        <Card accent="emerald">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              ✓
            </span>
            <p className="text-sm text-zinc-500">Paid</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-zinc-900">{formatMoney(paidTotal, currency)}</p>
          <p className="mt-1 text-xs text-zinc-500">{paid.length} invoice(s)</p>
        </Card>
        <Card accent="red">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
              !
            </span>
            <p className="text-sm text-zinc-500">Overdue</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-zinc-900">{overdueCount}</p>
          <p className="mt-1 text-xs text-zinc-500">need follow-up</p>
        </Card>
      </div>

      {invoices.length === 0 && (
        <Card>
          <p className="text-sm text-zinc-600">
            You haven&apos;t created any invoices yet.{" "}
            <Link href="/invoices/new" className="font-medium text-indigo-600 underline">
              Create your first invoice
            </Link>
            .
          </p>
        </Card>
      )}
    </div>
  );
}
