import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export const documentItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
});

export const documentSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  number: z.string().min(1, "Document number is required"),
  currency: z.string().min(1),
  issueDate: z.string().min(1),
  dueDate: z.string().optional().or(z.literal("")),
  taxRate: z.coerce.number().min(0).max(100),
  notes: z.string().optional().or(z.literal("")),
  items: z.array(documentItemSchema).min(1, "Add at least one line item"),
});

export type DocumentInput = z.infer<typeof documentSchema>;
