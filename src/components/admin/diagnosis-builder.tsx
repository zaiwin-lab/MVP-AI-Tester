"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { aiDraftAction, saveDiagnosisAction, sendDiagnosisAction } from "@/app/admin/actions";
import type { Diagnosis } from "@/lib/domain";

const FIELDS: { name: keyof Diagnosis; label: string; rows?: number }[] = [
  { name: "understanding", label: "Understanding of the challenge", rows: 3 },
  { name: "rootProblem", label: "Root problem", rows: 2 },
  { name: "currentProcessIssues", label: "Current process issues", rows: 2 },
  { name: "digitalOpportunity", label: "Digital opportunity", rows: 2 },
  { name: "recommendedSolution", label: "Recommended solution", rows: 3 },
  { name: "keyFeatures", label: "Key proposed features", rows: 3 },
  { name: "suggestedUserGroups", label: "Suggested user groups", rows: 2 },
  { name: "implementationPhases", label: "Implementation phases", rows: 3 },
  { name: "quickWinPilot", label: "Quick-win pilot", rows: 2 },
  { name: "estimatedDeliveryRange", label: "Estimated delivery range", rows: 1 },
  { name: "estimatedInvestmentRange", label: "Estimated investment range", rows: 1 },
  { name: "risksAndConsiderations", label: "Risks and considerations", rows: 2 },
  { name: "informationStillRequired", label: "Information still required", rows: 2 },
  { name: "recommendedNextStep", label: "Recommended next step", rows: 2 },
];

export function DiagnosisBuilder({
  caseId,
  diagnosis,
}: {
  caseId: string;
  diagnosis: Diagnosis | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [aiPending, startAi] = useTransition();
  const [sendPending, startSend] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  const isSent = diagnosis?.status === "sent";
  // Remount inputs when the underlying draft changes (after AI draft / save).
  const formKey = diagnosis?.updatedAt ?? "empty";

  function runAiDraft() {
    setNotice(null);
    startAi(async () => {
      const res = await aiDraftAction(caseId);
      if ("error" in res) setNotice(res.error);
      else setNotice(res.mode === "ai" ? "AI draft generated." : "Template draft generated (no AI key configured).");
      router.refresh();
    });
  }

  function save(formData: FormData) {
    startTransition(async () => {
      await saveDiagnosisAction(caseId, formData);
      setNotice("Diagnosis saved as draft.");
      router.refresh();
    });
  }

  function send() {
    if (!window.confirm("Send this human-reviewed diagnosis to the client by email? This is the only action that delivers a diagnosis externally.")) return;
    startSend(async () => {
      const res = await sendDiagnosisAction(caseId);
      if (res && "error" in res && res.error) setNotice(res.error);
      else setNotice("Diagnosis sent to client. Status set to Response sent.");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon.Doc className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-ink">Digital diagnosis builder</h2>
        </div>
        <div className="flex items-center gap-2">
          {diagnosis?.aiAssisted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
              <Icon.Spark className="h-3 w-3" /> AI-assisted draft · human review required
            </span>
          )}
          {isSent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">
              <Icon.Check className="h-3 w-3" /> Sent
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runAiDraft}
            disabled={aiPending}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:border-primary hover:text-primary disabled:opacity-60"
          >
            <Icon.Spark className="h-4 w-4" />
            {aiPending ? "Drafting…" : diagnosis ? "Regenerate AI draft" : "Generate AI draft"}
          </button>
          <a
            href={`/admin/print/${caseId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:border-primary hover:text-primary"
          >
            <Icon.Doc className="h-4 w-4" /> Preview / PDF
          </a>
        </div>

        {notice && (
          <p className="mb-4 rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-primary-ink" role="status">
            {notice}
          </p>
        )}

        <form action={save} key={formKey} className="space-y-4">
          <input type="hidden" name="aiAssisted" value={String(diagnosis?.aiAssisted ?? false)} />
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.rows && f.rows >= 3 ? "sm:col-span-2" : ""}>
                <label htmlFor={f.name} className="field-label">{f.label}</label>
                <textarea
                  id={f.name}
                  name={f.name}
                  rows={f.rows ?? 2}
                  defaultValue={(diagnosis?.[f.name] as string) ?? ""}
                  className="field-input resize-y text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={send}
              disabled={sendPending || !diagnosis}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-ink hover:brightness-95 disabled:opacity-60"
            >
              <Icon.Mail className="h-4 w-4" />
              {sendPending ? "Sending…" : "Send to client"}
            </button>
            <p className="text-xs text-muted">Sending requires a saved draft and an explicit confirmation.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
