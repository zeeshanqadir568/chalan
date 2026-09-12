import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import { DocumentView } from "@/components/document-view";
import { PrintButton } from "@/components/print-button";

export default async function SharedDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const document = await db.document.findUnique({
    where: { shareToken: token },
    include: { client: true, items: { orderBy: { sortOrder: "asc" } }, user: true },
  });

  if (!document) notFound();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex justify-end print:hidden">
          <PrintButton />
        </div>
        <Card>
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
      </div>
    </div>
  );
}
