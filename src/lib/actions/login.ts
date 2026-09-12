"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { FormState } from "@/lib/actions/auth";

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }
}
