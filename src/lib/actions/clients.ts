"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clientSchema } from "@/lib/validation";
import type { FormState } from "@/lib/actions/auth";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  return userId;
}

export async function createClientAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, phone, address } = parsed.data;

  await db.client.create({
    data: {
      userId,
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function deleteClientAction(clientId: string) {
  const userId = await requireUserId();

  await db.client.deleteMany({ where: { id: clientId, userId } });

  revalidatePath("/clients");
}
