import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCase } from "@/lib/db";
import { siteMeta } from "@/lib/content";
import type { Diagnosis } from "@/lib/domain";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Diagnosis document", robots: { index: false } };

const SECTIONS: { key: keyof Diagnosis; label: string }[] = [
  { key: "understanding", label: "Understanding of the challenge" },
  { key: "rootProblem", label: "Root problem" },
  { key: "currentProcessIssues", label: "Current process issues" },
  { key: "digitalOpportunity", label: "Digital opportunity" },
  { key: "recommendedSolution", label: "Recommended solution" },
  { key: "keyFeatures", label: "Key proposed features" },
  { key: "suggestedUserGroups", label: "Suggested user groups" },
  { key: "implementationPhases", label: "Implementation phases" },
  { key: "quickWinPilot", label: "Quick-win pilot" },
  { key: "estimatedDeliveryRange", label: "Estimated delivery range" },
  { key: "estimatedInvestmentRange", label: "Estimated investment range" },
  { key: "risksAndConsiderations", label: "Risks and considerations" },
  { key: "informationStillRequired", label: "Information still required" },
  { key: "recommendedNextStep", label: "Recommended next step" },
];

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const c = await getCase(id);
  if (!c) notFound();
  const d = c.diagnosis;

  return (
    <div className="mx-auto min-h-dvh max-w-[820px] bg-white px-10 py-10 text-ink print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <a href={`/admin/cases/${id}`} className="text-sm font-medium text-primary hover:underline">← Back to case</a>
        <PrintButton />
      </div>

      {/* Letterhead */}
      <header className="flex items-start justify-between border-b-2 border-primary pb-4">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-ink">CAP Digital Clinic</p>
          <p className="text-xs text-muted">{siteMeta.tagline} · {siteMeta.parent}</p>
        </div>
        <div className="text-right text-xs text-muted">
          <p className="font-mono text-sm font-semibold text-primary">{c.reference}</p>
          <p>Initial digital diagnosis</p>
          <p>{new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}</p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
        <p><span className="text-muted">Prepared for:</span> <strong>{c.fullName}</strong>, {c.position}</p>
        <p><span className="text-muted">Organisation:</span> <strong>{c.organisationName}</strong></p>
        <p><span className="text-muted">Type:</span> {c.organisationType}</p>
        <p><span className="text-muted">Challenge:</span> {c.challengeTitle}</p>
      </section>

      {d?.aiAssisted && (
        <p className="mt-5 rounded border border-dashed border-warning bg-warning-soft/50 px-3 py-2 text-xs text-ink print:border-black">
          Internal note (not part of client copy): this draft was AI-assisted and requires human review before sending.
        </p>
      )}

      {!d ? (
        <p className="mt-10 text-muted">No diagnosis has been drafted for this case yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {SECTIONS.map((s) => {
            const value = d[s.key] as string;
            if (!value) return null;
            return (
              <section key={s.key} className="break-inside-avoid">
                <h2 className="text-[0.8rem] font-bold uppercase tracking-wide text-primary">{s.label}</h2>
                <p className="mt-1 whitespace-pre-wrap text-[0.92rem] leading-relaxed text-ink">{value}</p>
              </section>
            );
          })}
        </div>
      )}

      <footer className="mt-10 border-t border-border pt-4 text-[0.7rem] leading-relaxed text-muted">
        <p>{siteMeta.motto}</p>
        <p className="mt-1">
          This initial diagnosis is preliminary and provided in good faith. It is not a formal
          quotation, technical specification, or contract. Scope, timeline, cost, security, and
          governance are confirmed through a separate agreement. {siteMeta.brand} · {siteMeta.email}
        </p>
      </footer>
    </div>
  );
}
