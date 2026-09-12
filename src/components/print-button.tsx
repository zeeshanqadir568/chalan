"use client";

import { Button } from "@/components/ui";

export function PrintButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()} className="print:hidden">
      Print / Save as PDF
    </Button>
  );
}
