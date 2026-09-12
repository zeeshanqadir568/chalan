"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/login";
import { Button, Input, Label } from "@/components/ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Signing in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-zinc-600">
        No account yet?{" "}
        <Link href="/register" className="font-medium text-indigo-600 underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
