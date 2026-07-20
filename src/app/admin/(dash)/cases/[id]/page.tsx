import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCase } from "@/lib/db";
import { listUsers } from "@/lib/db";
import {
  CASE_PRIORITIES,
  CASE_STATUSES,
  CHALLENGE_CATEGORIES,
  SCORE_DIMENSIONS,
  SCORE_DIMENSION_LABELS,
  averageScore,
} from "@/lib/domain";
import { StatusBadge, PriorityBadge } from "@/components/admin/badges";
import { DiagnosisBuilder } from "@/components/admin/diagnosis-builder";
import { Icon } from "@/components/icons";
import {
  addNoteAction,
  assignAction,
  changeStatusAction,
  saveScoreAction,
  sendClarificationAction,
  setPriorityAction,
  updateFieldsAction,
} from "@/app/admin/actions";

export const metadata: Metadata = { title: "Case detail" };

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function Panel({ title, icon, children, actions }: { title: string; icon: keyof typeof Icon; children: React.ReactNode; actions?: React.ReactNode }) {
  const IconEl = Icon[icon];
  return (
    <section className="rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <IconEl className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCase(id);
  if (!c) notFound();
  const users = (await listUsers()).filter((u) => u.active);
  const avg = averageScore(c.score);

  const statusForm = changeStatusAction.bind(null, id);
  const priorityForm = setPriorityAction.bind(null, id);
  const assignForm = assignAction.bind(null, id);
  const noteForm = addNoteAction.bind(null, id);
  const scoreForm = saveScoreAction.bind(null, id);
  const fieldsForm = updateFieldsAction.bind(null, id);
  const clarifyForm = sendClarificationAction.bind(null, id);

  // Merge status history + email log into one chronological timeline.
  const timeline = [
    ...c.statusHistory.map((h) => ({ at: h.createdAt, kind: "status" as const, text: `${h.from ? `${h.from} → ` : ""}${h.to}`, by: h.byName, note: h.note })),
    ...c.emailLog.map((m) => ({ at: m.createdAt, kind: "email" as const, text: `${m.subject}`, by: `→ ${m.to} · ${m.status}`, note: undefined })),
    ...c.notes.map((n) => ({ at: n.createdAt, kind: "note" as const, text: n.body, by: n.authorName, note: undefined })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/cases" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <Icon.Arrow className="h-4 w-4 rotate-180" /> All cases
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-muted">{c.reference}</span>
              <StatusBadge status={c.status} />
              <PriorityBadge priority={c.priority} />
            </div>
            <h1 className="mt-2 text-h2 font-bold text-ink">{c.challengeTitle}</h1>
            <p className="mt-1 text-ink-soft">
              {c.organisationName} · {c.organisationType} · received {fmt(c.createdAt)}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium text-ink">{c.fullName}</p>
            <p className="text-muted">{c.position}</p>
            <a href={`mailto:${c.workEmail}`} className="text-primary hover:underline">{c.workEmail}</a>
            <p className="text-muted">{c.mobile}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <Panel title="The challenge, in their words" icon="Chat">
            <p className="whitespace-pre-wrap leading-relaxed text-ink">{c.challengeDescription}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
              <Detail label="Category" value={c.category} />
              <Detail label="Budget" value={c.budget} />
              <Detail label="Affected users" value={c.affectedUsers} />
              <Detail label="Deadline" value={c.deadline} />
              <Detail label="Current tools" value={c.currentTools} />
              <Detail label="Location" value={c.location} />
              <Detail label="Department" value={c.department} />
              <Detail label="Website" value={c.website} />
              <Detail label="Preferred contact" value={c.preferredContact} />
              <Detail label="Language" value={c.preferredLanguage} />
              <Detail label="Supporting link" value={c.supportingLink} />
              <Detail label="Source" value={c.source} />
            </dl>
          </Panel>

          {c.attachments.length > 0 && (
            <Panel title={`Attachments (${c.attachments.length})`} icon="Doc">
              <ul className="space-y-2">
                {c.attachments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-2.5">
                    <span className="flex min-w-0 items-center gap-2 text-sm text-ink">
                      <Icon.Doc className="h-4 w-4 shrink-0 text-muted" />
                      <span className="truncate">{a.originalName}</span>
                      <span className="shrink-0 text-xs text-muted">{(a.size / 1024 / 1024).toFixed(1)}MB</span>
                    </span>
                    <a
                      href={`/admin/attachments/${a.storedName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-sm font-medium text-primary hover:underline"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <DiagnosisBuilder caseId={id} diagnosis={c.diagnosis} />

          <Panel title="Request clarification" icon="Mail">
            <form action={clarifyForm} className="space-y-3">
              <textarea
                name="message"
                rows={3}
                required
                placeholder="What would you like the client to clarify? This is emailed to them and sets the status to Clarification required."
                className="field-input resize-y text-sm"
              />
              <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3.5 text-sm font-medium text-ink hover:border-primary hover:text-primary">
                <Icon.Mail className="h-4 w-4" /> Send clarification request
              </button>
            </form>
          </Panel>

          <Panel title="Internal notes" icon="Chat">
            <form action={noteForm} className="flex gap-2">
              <input name="body" required placeholder="Add an internal note…" className="field-input text-sm" />
              <button className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary-hover">
                <Icon.Plus className="h-4 w-4" /> Add
              </button>
            </form>
            {c.notes.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No notes yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {[...c.notes].reverse().map((n) => (
                  <li key={n.id} className="rounded-lg bg-surface/70 p-3">
                    <p className="whitespace-pre-wrap text-sm text-ink">{n.body}</p>
                    <p className="mt-1.5 text-xs text-muted">{n.authorName} · {fmt(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Timeline" icon="Clock">
            <ol className="space-y-3">
              {timeline.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${t.kind === "email" ? "bg-accent" : t.kind === "note" ? "bg-muted" : "bg-primary"}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-ink">
                      <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted">{t.kind}</span>{" "}
                      {t.text}
                    </p>
                    {t.note && <p className="text-xs text-ink-soft">{t.note}</p>}
                    <p className="text-xs text-muted">{t.by} · {fmt(t.at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <Panel title="Workflow" icon="Kanban">
            <div className="space-y-4">
              <form action={statusForm} className="space-y-2">
                <label className="field-label" htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={c.status} className="field-input text-sm">
                  {CASE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input name="note" placeholder="Optional note" className="field-input text-sm" />
                <button className="h-9 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary-hover">Update status</button>
              </form>

              <form action={priorityForm} className="flex items-end gap-2 border-t border-border pt-4">
                <div className="flex-1">
                  <label className="field-label" htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" defaultValue={c.priority} className="field-input text-sm">
                    {CASE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <button className="h-[42px] rounded-md border border-border px-3 text-sm font-medium hover:border-primary hover:text-primary">Set</button>
              </form>

              <form action={assignForm} className="flex items-end gap-2 border-t border-border pt-4">
                <div className="flex-1">
                  <label className="field-label" htmlFor="assigneeId">Assigned to</label>
                  <select id="assigneeId" name="assigneeId" defaultValue={c.assignedToId ?? ""} className="field-input text-sm">
                    <option value="">Unassigned</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <button className="h-[42px] rounded-md border border-border px-3 text-sm font-medium hover:border-primary hover:text-primary">Assign</button>
              </form>
            </div>
          </Panel>

          <Panel title="Case fields" icon="Doc">
            <form action={fieldsForm} className="space-y-3">
              <div>
                <label className="field-label" htmlFor="category">Category</label>
                <select id="category" name="category" defaultValue={c.category ?? ""} className="field-input text-sm">
                  <option value="">Unset</option>
                  {CHALLENGE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="recommendedSolutionType">Recommended solution type</label>
                <input id="recommendedSolutionType" name="recommendedSolutionType" defaultValue={c.recommendedSolutionType ?? ""} className="field-input text-sm" />
              </div>
              <div>
                <label className="field-label" htmlFor="followUpAction">Follow-up action</label>
                <input id="followUpAction" name="followUpAction" defaultValue={c.followUpAction ?? ""} className="field-input text-sm" />
              </div>
              <div>
                <label className="field-label" htmlFor="nextActionDate">Next action date</label>
                <input id="nextActionDate" name="nextActionDate" type="date" defaultValue={c.nextActionDate ?? ""} className="field-input text-sm" />
              </div>
              <button className="h-9 w-full rounded-md border border-border text-sm font-medium hover:border-primary hover:text-primary">Save fields</button>
            </form>
          </Panel>

          <Panel
            title="Opportunity score"
            icon="Spark"
            actions={avg !== null ? <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-accent-ink">{avg} / 10</span> : undefined}
          >
            <p className="mb-3 text-xs text-muted">Internal only. Never shown to the client. Leave blank to skip a dimension.</p>
            <form action={scoreForm} className="space-y-2.5">
              {SCORE_DIMENSIONS.map((dim) => (
                <div key={dim} className="flex items-center justify-between gap-3">
                  <label htmlFor={dim} className="text-sm text-ink-soft">{SCORE_DIMENSION_LABELS[dim]}</label>
                  <input
                    id={dim}
                    name={dim}
                    type="number"
                    min={0}
                    max={10}
                    defaultValue={c.score[dim] ?? ""}
                    className="h-8 w-16 rounded-md border border-border px-2 text-center text-sm"
                  />
                </div>
              ))}
              <button className="mt-2 h-9 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary-hover">Save score</button>
            </form>
          </Panel>

          <Panel title="Consent & audit" icon="Shield">
            <dl className="space-y-2.5 text-sm">
              <Detail label="Consent given" value={`${c.consent ? "Yes" : "No"} · ${fmt(c.consentAt)}`} />
              <div>
                <dt className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Consent text</dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-ink-soft">{c.consentText}</dd>
              </div>
              <Detail label="Submitter (hashed)" value={c.submitterIpHash} />
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
