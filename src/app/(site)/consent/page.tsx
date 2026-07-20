import type { Metadata } from "next";
import { LegalDoc } from "@/components/site/legal-doc";
import { legalDocs } from "@/lib/legal";

export const metadata: Metadata = { title: "Data consent" };
export default function Page() {
  return <LegalDoc {...legalDocs.consent} />;
}
