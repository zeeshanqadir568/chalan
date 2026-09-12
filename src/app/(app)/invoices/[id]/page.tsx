import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import { DocumentView } from "@/components/document-view";
import { DocumentStatusActions } from "@/components/document-status-actions";
import { MarkPaidForm } from "@/components/mark-paid-form";
import { CopyShareLink } from "@/components/copy-share-link";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const document = await db.document.findFirst({
    where: { id, userId, type: "INVOICE" },
    include: { client: true, items: { orderBy: { sortOrder: "asc" } }, user: true },
  });

  if (!document) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DocumentStatusActions documentId={document.id} type={document.type} status={document.status} />
        <CopyShareLink shareToken={document.shareToken} />
      </div>

      <Card className="max-w-2xl">
        <DocumentView
          type={document.type}
          number={document.number}
          status={document.status}
          currency={document.currency}
          issueDate={document.issueDate}
          dueDate={document.dueDate}
          notes={document.notes}
          taxRate={document.taxRate}
          items={document.items}
          client={document.client}
          issuer={document.user}
        />
      </Card>

      {document.status !== "PAID" && (
        <div className="max-w-2xl">
          <MarkPaidForm documentId={document.id} />
        </div>
      )}

      {document.status === "PAID" && (
        <Card className="max-w-2xl">
          <p className="text-sm text-zinc-600">
            Paid via {document.paymentMethod?.replaceAll("_", " ").toLowerCase()}
            {document.paymentRef ? ` — ref ${document.paymentRef}` : ""}
          </p>
        </Card>
      )}
    </div>
  );
}
