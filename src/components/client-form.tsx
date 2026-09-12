"use client";

import { useActionState } from "react";
import { createClientAction } from "@/lib/actions/clients";
import { Button, FieldError, Input, Label, Textarea } from "@/components/ui";

export function ClientForm() {
  const [state, formAction, pending] = useActionState(createClientAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
        <FieldError messages={state.fieldErrors?.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
        <FieldError messages={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={3} />
      </div>
      <Button type="submit" disabled={pending} className="mt-2 self-start">
        {pending ? "Saving…" : "Save client"}
      </Button>
    </form>
  );
}
