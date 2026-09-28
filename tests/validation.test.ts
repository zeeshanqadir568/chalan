import { describe, expect, it } from "vitest";
import { documentSchema, registerSchema } from "@/lib/validation";

const validDoc = {
  clientId: "c1",
  number: "INV-001",
  currency: "PKR",
  issueDate: "2026-09-01",
  taxRate: "17",
  items: [{ description: "Website", quantity: "1", unitPrice: "50000" }],
};

describe("documentSchema", () => {
  it("accepts a valid document and coerces form strings to numbers", () => {
    const parsed = documentSchema.parse(validDoc);
    expect(parsed.taxRate).toBe(17);
    expect(parsed.items[0]).toMatchObject({ quantity: 1, unitPrice: 50000 });
  });

  it("rejects a document with no line items", () => {
    expect(documentSchema.safeParse({ ...validDoc, items: [] }).success).toBe(false);
  });

  it("rejects a tax rate above 100%", () => {
    expect(documentSchema.safeParse({ ...validDoc, taxRate: "150" }).success).toBe(false);
  });

  it("rejects zero or negative quantities and negative prices", () => {
    const bad = (item: object) =>
      documentSchema.safeParse({ ...validDoc, items: [{ description: "x", ...item }] }).success;
    expect(bad({ quantity: "0", unitPrice: "10" })).toBe(false);
    expect(bad({ quantity: "1", unitPrice: "-5" })).toBe(false);
  });
});

describe("registerSchema", () => {
  it("requires an 8+ character password", () => {
    const base = { name: "Ali", email: "ali@example.com" };
    expect(registerSchema.safeParse({ ...base, password: "short" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, password: "longenough" }).success).toBe(true);
  });
});
