type LineItem = { quantity: number; unitPrice: number };

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Single source of truth for invoice/proposal maths, rounded to 2 decimals. */
export function documentTotals(items: LineItem[], taxRate: number) {
  const subtotal = round2(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
  const tax = round2(subtotal * (taxRate / 100));
  return { subtotal, tax, total: round2(subtotal + tax) };
}

type CurrencyDocument = { currency: string; taxRate: number; items: LineItem[] };

/**
 * Sums document totals per currency. Amounts in different currencies are never
 * added together; results are sorted largest first.
 */
export function totalsByCurrency(docs: CurrencyDocument[]) {
  const sums = new Map<string, number>();
  for (const doc of docs) {
    sums.set(doc.currency, (sums.get(doc.currency) ?? 0) + documentTotals(doc.items, doc.taxRate).total);
  }
  return [...sums]
    .map(([currency, total]) => ({ currency, total: round2(total) }))
    .sort((a, b) => b.total - a.total);
}
