import type { Metadata } from "next";
import { LegalDoc } from "@/components/site/legal-doc";
import { legalDocs } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms of submission" };
export default function Page() {
  return <LegalDoc {...legalDocs.terms} />;
}
