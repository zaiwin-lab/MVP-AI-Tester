"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticate, currentUser } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import {
  addNote,
  assignCase,
  changeStatus,
  getCase,
  logEmail,
  saveDiagnosis,
  saveScore,
  setPriority,
  updateCaseFields,
} from "@/lib/cases";
import { getUser, saveContentOverrides } from "@/lib/db";
import { draftDiagnosis } from "@/lib/ai";
import {
  clarificationEmail,
  diagnosisReadyEmail,
  sendEmail,
} from "@/lib/email";
import {
  CASE_PRIORITIES,
  CASE_STATUSES,
  CHALLENGE_CATEGORIES,
  SCORE_DIMENSIONS,
  type CasePriority,
  type CaseStatus,
  type ChallengeCategory,
  type Diagnosis,
  type ScoreMap,
} from "@/lib/domain";

async function actor() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return { id: user.id, name: user.name };
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const user = await authenticate(email, password);
  if (!user) return { error: "Those credentials were not recognised." };
  await createSession({ id: user.id, role: user.role, name: user.name });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ── Case workflow ───────────────────────────────────────────────────────────

function revalidateCase(id: string) {
  revalidatePath(`/admin/cases/${id}`);
  revalidatePath("/admin/cases");
  revalidatePath("/admin");
}

export async function addNoteAction(caseId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  await addNote(caseId, body, await actor());
  revalidateCase(caseId);
}

export async function changeStatusAction(caseId: string, formData: FormData) {
  const to = String(formData.get("status") ?? "") as CaseStatus;
  if (!CASE_STATUSES.includes(to)) return;
  const note = String(formData.get("note") ?? "").trim() || undefined;
  await changeStatus(caseId, to, await actor(), note);
  revalidateCase(caseId);
}

export async function setPriorityAction(caseId: string, formData: FormData) {
  const priority = String(formData.get("priority") ?? "") as CasePriority;
  if (!CASE_PRIORITIES.includes(priority)) return;
  await setPriority(caseId, priority, await actor());
  revalidateCase(caseId);
}

export async function assignAction(caseId: string, formData: FormData) {
  const assigneeId = String(formData.get("assigneeId") ?? "");
  const me = await actor();
  if (!assigneeId) {
    await assignCase(caseId, null, me);
  } else {
    const user = await getUser(assigneeId);
    if (user) await assignCase(caseId, { id: user.id, name: user.name }, me);
  }
  revalidateCase(caseId);
}

export async function updateFieldsAction(caseId: string, formData: FormData) {
  const category = String(formData.get("category") ?? "") as ChallengeCategory;
  await updateCaseFields(
    caseId,
    {
      recommendedSolutionType: String(formData.get("recommendedSolutionType") ?? "").trim() || undefined,
      followUpAction: String(formData.get("followUpAction") ?? "").trim() || undefined,
      nextActionDate: String(formData.get("nextActionDate") ?? "").trim() || undefined,
      category: CHALLENGE_CATEGORIES.includes(category) ? category : undefined,
    },
    await actor(),
  );
  revalidateCase(caseId);
}

export async function saveScoreAction(caseId: string, formData: FormData) {
  const score: ScoreMap = {};
  for (const dim of SCORE_DIMENSIONS) {
    const raw = formData.get(dim);
    if (raw !== null && raw !== "") {
      const n = Math.max(0, Math.min(10, Number(raw)));
      if (!Number.isNaN(n)) score[dim] = n;
    }
  }
  await saveScore(caseId, score, await actor());
  revalidateCase(caseId);
}

// ── Diagnosis builder ───────────────────────────────────────────────────────

const DIAGNOSIS_FIELDS: (keyof Omit<Diagnosis, "aiAssisted" | "status" | "updatedAt" | "updatedByName">)[] = [
  "understanding", "rootProblem", "currentProcessIssues", "digitalOpportunity",
  "recommendedSolution", "keyFeatures", "suggestedUserGroups", "implementationPhases",
  "quickWinPilot", "estimatedDeliveryRange", "estimatedInvestmentRange",
  "risksAndConsiderations", "informationStillRequired", "recommendedNextStep",
];

function readDiagnosis(formData: FormData) {
  const d: Record<string, string> = {};
  for (const f of DIAGNOSIS_FIELDS) d[f] = String(formData.get(f) ?? "").trim();
  return d as unknown as Omit<Diagnosis, "aiAssisted" | "status" | "updatedAt" | "updatedByName">;
}

export async function saveDiagnosisAction(caseId: string, formData: FormData) {
  const fields = readDiagnosis(formData);
  const aiAssisted = formData.get("aiAssisted") === "true";
  await saveDiagnosis(caseId, { ...fields, aiAssisted, status: "draft" }, await actor());
  revalidateCase(caseId);
}

/** Generate an AI-assisted (or template) draft. Never auto-sent. */
export async function aiDraftAction(caseId: string): Promise<{ mode: "ai" | "template" } | { error: string }> {
  await actor();
  const record = await getCase(caseId);
  if (!record) return { error: "Case not found." };
  const { draft, mode } = await draftDiagnosis(record);
  await saveDiagnosis(caseId, { ...draft, status: "draft" }, await actor());
  revalidateCase(caseId);
  return { mode };
}

export async function sendClarificationAction(caseId: string, formData: FormData) {
  const me = await actor();
  const message = String(formData.get("message") ?? "").trim();
  if (!message) return;
  const record = await getCase(caseId);
  if (!record) return;
  const email = clarificationEmail(record, message);
  const result = await sendEmail(record.workEmail, email);
  await logEmail(caseId, {
    template: "clarification", to: record.workEmail, subject: email.subject,
    status: result.status, error: result.error,
  });
  await changeStatus(caseId, "Clarification required", me, "Clarification requested");
  revalidateCase(caseId);
}

/**
 * Send the human-reviewed diagnosis to the client. This is the ONLY path that
 * delivers a diagnosis externally, and it requires an explicit admin action —
 * AI drafts are never auto-sent.
 */
export async function sendDiagnosisAction(caseId: string) {
  const me = await actor();
  const record = await getCase(caseId);
  if (!record || !record.diagnosis) return { error: "Save a diagnosis first." };
  const d = record.diagnosis;
  const summaryHtml = `
    <p style="margin:0 0 10px"><strong>Our understanding</strong><br/>${escape(d.understanding)}</p>
    <p style="margin:0 0 10px"><strong>Recommended direction</strong><br/>${escape(d.recommendedSolution)}</p>
    <p style="margin:0 0 10px"><strong>A possible quick-win pilot</strong><br/>${escape(d.quickWinPilot)}</p>
    <p style="margin:0"><strong>Recommended next step</strong><br/>${escape(d.recommendedNextStep)}</p>`;
  const summaryText = `Our understanding:\n${d.understanding}\n\nRecommended direction:\n${d.recommendedSolution}\n\nPossible quick-win pilot:\n${d.quickWinPilot}\n\nRecommended next step:\n${d.recommendedNextStep}`;
  const email = diagnosisReadyEmail(record, summaryHtml, summaryText);
  const result = await sendEmail(record.workEmail, email);
  await logEmail(caseId, {
    template: "diagnosis_ready", to: record.workEmail, subject: email.subject,
    status: result.status, error: result.error,
  });
  await saveDiagnosis(caseId, { ...d, status: "sent" }, me);
  await changeStatus(caseId, "Response sent", me, "Diagnosis sent to client");
  revalidateCase(caseId);
  return { ok: true as const };
}

// ── Content management ──────────────────────────────────────────────────────

export async function saveContentAction(formData: FormData) {
  await actor();
  const hero = {
    headline: String(formData.get("headline") ?? "").trim(),
    subhead: String(formData.get("subhead") ?? "").trim(),
    primaryCta: String(formData.get("primaryCta") ?? "").trim(),
  };
  await saveContentOverrides({ hero });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
