import {
  appendAudit,
  getCase,
  insertCase,
  newId,
  nextReference,
  updateCase,
} from "./db";
import type {
  AttachmentMeta,
  CasePriority,
  CaseRecord,
  CaseStatus,
  Diagnosis,
  EmailLogEntry,
  OrganisationType,
  ScoreMap,
} from "./domain";
import type { SubmissionInput } from "./validation";

/** Service layer: all case mutations flow through here so audit + history stay consistent. */

/** Submission after the API has filled the now-optional title/org-type defaults. */
export type NormalizedSubmission = SubmissionInput & {
  organisationType: OrganisationType;
  challengeTitle: string;
};

export interface NewCaseContext {
  attachments: AttachmentMeta[];
  consentText: string;
  ipHash?: string;
  userAgent?: string;
  source?: string;
}

export async function createCaseFromSubmission(
  input: NormalizedSubmission,
  ctx: NewCaseContext,
): Promise<CaseRecord> {
  const now = new Date().toISOString();
  const reference = await nextReference();
  const record: CaseRecord = {
    id: newId("case_"),
    reference,
    createdAt: now,
    updatedAt: now,
    source: ctx.source ?? "web",

    fullName: input.fullName,
    workEmail: input.workEmail,
    mobile: input.mobile,
    position: input.position,
    preferredContact: input.preferredContact,
    preferredLanguage: input.preferredLanguage,

    organisationName: input.organisationName,
    organisationType: input.organisationType,
    department: input.department,
    website: input.website,
    location: input.location,

    challengeTitle: input.challengeTitle,
    challengeDescription: input.challengeDescription,
    category: input.category,
    currentTools: input.currentTools,
    affectedUsers: input.affectedUsers,
    deadline: input.deadline,
    budget: input.budget,
    supportingLink: input.supportingLink,

    status: "New",
    priority: "Normal",
    assignedToId: null,
    assignedToName: null,

    consent: true,
    consentText: ctx.consentText,
    consentAt: now,
    submitterIpHash: ctx.ipHash,
    userAgent: ctx.userAgent,

    attachments: ctx.attachments,
    notes: [],
    statusHistory: [
      { id: newId("sh_"), from: null, to: "New", byId: null, byName: "Public submission", createdAt: now },
    ],
    emailLog: [],
    score: {},
    diagnosis: null,
  };

  await insertCase(record);
  await appendAudit({
    actorId: null,
    actorName: "Public",
    action: "case.created",
    target: reference,
    detail: `${record.organisationName} · ${record.organisationType}`,
  });
  return record;
}

export async function changeStatus(
  caseId: string,
  to: CaseStatus,
  actor: { id: string; name: string },
  note?: string,
): Promise<CaseRecord | null> {
  const updated = await updateCase(caseId, (c) => {
    if (c.status === to) return c;
    return {
      ...c,
      status: to,
      statusHistory: [
        ...c.statusHistory,
        { id: newId("sh_"), from: c.status, to, byId: actor.id, byName: actor.name, note, createdAt: new Date().toISOString() },
      ],
    };
  });
  if (updated) {
    await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.status", target: updated.reference, detail: to });
  }
  return updated;
}

export async function setPriority(caseId: string, priority: CasePriority, actor: { id: string; name: string }) {
  const updated = await updateCase(caseId, (c) => ({ ...c, priority }));
  if (updated) await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.priority", target: updated.reference, detail: priority });
  return updated;
}

export async function assignCase(
  caseId: string,
  assignee: { id: string; name: string } | null,
  actor: { id: string; name: string },
) {
  const updated = await updateCase(caseId, (c) => ({
    ...c,
    assignedToId: assignee?.id ?? null,
    assignedToName: assignee?.name ?? null,
  }));
  if (updated) await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.assign", target: updated.reference, detail: assignee?.name ?? "Unassigned" });
  return updated;
}

export async function addNote(caseId: string, body: string, actor: { id: string; name: string }) {
  const updated = await updateCase(caseId, (c) => ({
    ...c,
    notes: [
      ...c.notes,
      { id: newId("note_"), authorId: actor.id, authorName: actor.name, body, createdAt: new Date().toISOString() },
    ],
  }));
  if (updated) await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.note", target: updated.reference });
  return updated;
}

export async function saveScore(caseId: string, score: ScoreMap, actor: { id: string; name: string }) {
  const updated = await updateCase(caseId, (c) => ({ ...c, score }));
  if (updated) await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.score", target: updated.reference });
  return updated;
}

export async function updateCaseFields(
  caseId: string,
  fields: Partial<Pick<CaseRecord, "recommendedSolutionType" | "followUpAction" | "nextActionDate" | "category" | "priority">>,
  actor: { id: string; name: string },
) {
  const updated = await updateCase(caseId, (c) => ({ ...c, ...fields }));
  if (updated) await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.update", target: updated.reference });
  return updated;
}

export async function saveDiagnosis(
  caseId: string,
  diagnosis: Omit<Diagnosis, "updatedAt" | "updatedByName" | "status"> & { status?: Diagnosis["status"] },
  actor: { id: string; name: string },
) {
  const updated = await updateCase(caseId, (c) => ({
    ...c,
    diagnosis: {
      ...diagnosis,
      status: diagnosis.status ?? c.diagnosis?.status ?? "draft",
      updatedAt: new Date().toISOString(),
      updatedByName: actor.name,
    },
  }));
  if (updated) await appendAudit({ actorId: actor.id, actorName: actor.name, action: "case.diagnosis.save", target: updated.reference });
  return updated;
}

export async function logEmail(caseId: string, entry: Omit<EmailLogEntry, "id" | "createdAt">) {
  return updateCase(caseId, (c) => ({
    ...c,
    emailLog: [
      ...c.emailLog,
      { id: newId("mail_"), createdAt: new Date().toISOString(), ...entry },
    ],
  }));
}

export { getCase };
