import { describe, expect, it } from "vitest";
import { documentTotals } from "@/lib/totals";

describe("documentTotals", () => {
  it("sums line items and applies tax", () => {
    const items = [
      { quantity: 2, unitPrice: 1500 },
      { quantity: 1, unitPrice: 5000 },
    ];
    expect(documentTotals(items, 17)).toEqual({ subtotal: 8000, tax: 1360, total: 9360 });
  });

  it("returns zeros for an empty document", () => {
    expect(documentTotals([], 17)).toEqual({ subtotal: 0, tax: 0, total: 0 });
  });

  it("handles zero tax", () => {
    expect(documentTotals([{ quantity: 3, unitPrice: 250 }], 0)).toEqual({
      subtotal: 750,
      tax: 0,
      total: 750,
    });
  });

  it("rounds away floating-point noise to 2 decimals", () => {
    // 0.1 * 3 = 0.30000000000000004 in raw JS
    const { subtotal, total } = documentTotals([{ quantity: 3, unitPrice: 0.1 }], 0);
    expect(subtotal).toBe(0.3);
    expect(total).toBe(0.3);
  });

  it("rounds tax on fractional amounts", () => {
    // 99.99 * 16% = 15.9984 -> 16.00
    expect(documentTotals([{ quantity: 1, unitPrice: 99.99 }], 16)).toEqual({
      subtotal: 99.99,
      tax: 16,
      total: 115.99,
    });
  });

  it("supports fractional quantities (e.g. hours)", () => {
    expect(documentTotals([{ quantity: 2.5, unitPrice: 4000 }], 0).total).toBe(10000);
  });
});
