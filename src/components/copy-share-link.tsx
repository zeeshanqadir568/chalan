"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function CopyShareLink({ shareToken }: { shareToken: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={async () => {
        const url = `${window.location.origin}/share/${shareToken}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Link copied!" : "Copy share link"}
    </Button>
  );
}
