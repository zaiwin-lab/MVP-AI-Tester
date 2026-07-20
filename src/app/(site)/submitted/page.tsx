import { Suspense } from "react";
import type { Metadata } from "next";
import { Confirmation } from "./confirmation";

export const metadata: Metadata = {
  title: "Challenge received",
  robots: { index: false, follow: false },
};

export default function SubmittedPage() {
  return (
    <Suspense fallback={<div className="container-cap py-24 text-center text-muted">Loading…</div>}>
      <Confirmation />
    </Suspense>
  );
}
