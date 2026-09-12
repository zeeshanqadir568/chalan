import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button, Card } from "@/components/ui";
import { DeleteClientButton } from "@/components/delete-client-button";

export default async function ClientsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const clients = await db.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Clients</h1>
        <Link href="/clients/new">
          <Button>Add client</Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">
            No clients yet.{" "}
            <Link href="/clients/new" className="font-medium text-indigo-600 underline">
              Add your first client
            </Link>
            .
          </p>
        </Card>
      ) : (
        <Card className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{client.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{client.email ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{client.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteClientButton clientId={client.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
