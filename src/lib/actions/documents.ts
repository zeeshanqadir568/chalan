"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { documentSchema } from "@/lib/validation";
import type { FormState } from "@/lib/actions/auth";
import type { DocumentType, PaymentMethod } from "@prisma/client";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  return userId;
}

const typePrefix: Record<DocumentType, string> = {
  INVOICE: "INV",
  PROPOSAL: "PRO",
};

export async function nextDocumentNumber(userId: string, type: DocumentType) {
  const count = await db.document.count({ where: { userId, type } });
  return `${typePrefix[type]}-${String(count + 1).padStart(4, "0")}`;
}

export async function createDocumentAction(
  type: DocumentType,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId();

  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Invalid line items." };
  }

  const parsed = documentSchema.safeParse({
    clientId: formData.get("clientId"),
    number: formData.get("number"),
    currency: formData.get("currency"),
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate"),
    taxRate: formData.get("taxRate"),
    notes: formData.get("notes"),
    items,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const client = await db.client.findFirst({
    where: { id: data.clientId, userId },
  });
  if (!client) {
    return { error: "Select a valid client." };
  }

  const document = await db.document.create({
    data: {
      userId,
      clientId: data.clientId,
      type,
      number: data.number,
      currency: data.currency,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      taxRate: data.taxRate,
      notes: data.notes || null,
      items: {
        create: data.items.map((item, index) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          sortOrder: index,
        })),
      },
    },
  });

  const basePath = type === "INVOICE" ? "/invoices" : "/proposals";
  revalidatePath(basePath);
  redirect(`${basePath}/${document.id}`);
}

export async function updateDocumentStatusAction(
  documentId: string,
  status: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED"
) {
  const userId = await requireUserId();

  const document = await db.document.update({
    where: { id: documentId, userId },
    data: { status },
  });

  const basePath = document.type === "INVOICE" ? "/invoices" : "/proposals";
  revalidatePath(`${basePath}/${documentId}`);
  revalidatePath(basePath);
}

export async function markPaidAction(
  documentId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId();

  const paymentMethod = String(formData.get("paymentMethod") ?? "") as PaymentMethod;
  const paymentRef = String(formData.get("paymentRef") ?? "").trim();

  await db.document.update({
    where: { id: documentId, userId },
    data: {
      status: "PAID",
      paymentMethod,
      paymentRef: paymentRef || null,
      paidAt: new Date(),
    },
  });

  revalidatePath(`/invoices/${documentId}`);
  revalidatePath("/invoices");
  return {};
}

export async function deleteDocumentAction(documentId: string, type: DocumentType) {
  const userId = await requireUserId();

  await db.document.deleteMany({ where: { id: documentId, userId } });

  const basePath = type === "INVOICE" ? "/invoices" : "/proposals";
  revalidatePath(basePath);
  redirect(basePath);
}
