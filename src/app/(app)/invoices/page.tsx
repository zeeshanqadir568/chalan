import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui";
import { DocumentList } from "@/components/document-list";

export default async function InvoicesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const invoices = await db.document.findMany({
    where: { userId, type: "INVOICE" },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Invoices</h1>
        <Link href="/invoices/new">
          <Button>New invoice</Button>
        </Link>
      </div>
      <DocumentList
        documents={invoices}
        basePath="/invoices"
        emptyLabel="No invoices yet. Create your first invoice to get started."
      />
    </div>
  );
}
