"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button, FieldError, Input, Label } from "@/components/ui";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required autoComplete="name" />
        <FieldError messages={state.fieldErrors?.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        <FieldError messages={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" />
        <FieldError messages={state.fieldErrors?.password} />
      </div>
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
