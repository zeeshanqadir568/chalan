import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-zinc-50 to-emerald-50 px-6 py-16">
      <Card accent="indigo" className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Log in to Chalan</h1>
        <LoginForm />
      </Card>
    </div>
  );
}
