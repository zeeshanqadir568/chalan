import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { nextDocumentNumber } from "@/lib/actions/documents";
import { DocumentForm } from "@/components/document-form";
import { Card } from "@/components/ui";

export default async function NewProposalPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [clients, defaultNumber] = await Promise.all([
    db.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    nextDocumentNumber(userId, "PROPOSAL"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900">New proposal</h1>
      {clients.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">
            Add a client before creating a proposal.{" "}
            <Link href="/clients/new" className="font-medium text-indigo-600 underline">
              Add a client
            </Link>
            .
          </p>
        </Card>
      ) : (
        <Card className="max-w-2xl">
          <DocumentForm type="PROPOSAL" clients={clients} defaultNumber={defaultNumber} />
        </Card>
      )}
    </div>
  );
}
