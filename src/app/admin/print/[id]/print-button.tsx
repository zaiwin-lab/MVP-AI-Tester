"use client";

import { Icon } from "@/components/icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
    >
      <Icon.Doc className="h-4 w-4" /> Print / Save as PDF
    </button>
  );
}
