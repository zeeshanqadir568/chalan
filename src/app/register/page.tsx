import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/register-form";
import { Card } from "@/components/ui";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-zinc-50 to-emerald-50 px-6 py-16">
      <Card accent="emerald" className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Create your account</h1>
        <RegisterForm />
      </Card>
    </div>
  );
}
