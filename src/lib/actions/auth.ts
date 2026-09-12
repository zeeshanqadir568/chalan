"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { signIn } from "@/auth";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.user.create({ data: { name, email, password: hashed } });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}
