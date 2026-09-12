import { ClientForm } from "@/components/client-form";
import { Card } from "@/components/ui";

export default function NewClientPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Add client</h1>
      <Card className="max-w-lg">
        <ClientForm />
      </Card>
    </div>
  );
}
