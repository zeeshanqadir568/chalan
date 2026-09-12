import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui";
import { DocumentList } from "@/components/document-list";

export default async function ProposalsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const proposals = await db.document.findMany({
    where: { userId, type: "PROPOSAL" },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Proposals</h1>
        <Link href="/proposals/new">
          <Button>New proposal</Button>
        </Link>
      </div>
      <DocumentList
        documents={proposals}
        basePath="/proposals"
        emptyLabel="No proposals yet. Create one to send to a prospective client."
      />
    </div>
  );
}
