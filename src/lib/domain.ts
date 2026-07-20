/**
 * CAP Digital Clinic — domain model.
 *
 * Single source of truth for the enums and record shapes used across the
 * public submission flow and the internal case-management workflow. The
 * production Postgres/Supabase equivalent is documented in
 * `prisma/schema.prisma`; the runtime store (`src/lib/db.ts`) persists these
 * exact shapes as JSON so the two never drift for V1.
 */

// ── Reference option lists (also drive the public form <select> menus) ──────

export const ORGANISATION_TYPES = [
  "Ministry",
  "Government Department",
  "Government Agency",
  "Local Authority",
  "GLC",
  "Statutory Body",
  "Cooperative",
  "University / Education Institution",
  "NGO / Foundation",
  "Association",
  "Corporate Company",
  "SME",
  "Training Provider",
  "Event Organiser",
  "Other",
] as const;
export type OrganisationType = (typeof ORGANISATION_TYPES)[number];

export const CHALLENGE_CATEGORIES = [
  "Reporting & Dashboard",
  "Registration & Participant Management",
  "Event Management",
  "AI & Automation",
  "Website or Portal",
  "Workflow & Approval",
  "Community Outreach",
  "Training & Facilitation",
  "Cooperative Management",
  "Project / PMO Management",
  "Document & Proposal Management",
  "Internal Operations",
  "Not Sure",
  "Other",
] as const;
export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];

export const BUDGET_RANGES = [
  "Not determined",
  "Below RM10,000",
  "RM10,000 – RM30,000",
  "RM30,001 – RM100,000",
  "RM100,001 – RM300,000",
  "Above RM300,000",
  "Prefer to discuss",
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const CONTACT_METHODS = ["Email", "Phone call", "WhatsApp", "Video consultation"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const CONSULTATION_LANGUAGES = ["English", "Bahasa Melayu", "Mandarin", "Iban"] as const;
export type ConsultationLanguage = (typeof CONSULTATION_LANGUAGES)[number];

// ── Case workflow enums ─────────────────────────────────────────────────────

export const CASE_STATUSES = [
  "New",
  "Under review",
  "Clarification required",
  "Assigned",
  "Diagnosis in progress",
  "Diagnosis ready",
  "Response sent",
  "Consultation requested",
  "Pilot proposed",
  "Proposal requested",
  "Quotation requested",
  "Project opportunity",
  "Closed",
  "Not suitable",
  "Duplicate",
  "Spam",
] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CASE_PRIORITIES = ["Normal", "Important", "High potential", "Urgent", "Strategic"] as const;
export type CasePriority = (typeof CASE_PRIORITIES)[number];

export const USER_ROLES = ["admin", "consultant", "reviewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Internal opportunity-score dimensions (0–10 each). Never shown publicly. */
export const SCORE_DIMENSIONS = [
  "strategicRelevance",
  "problemUrgency",
  "potentialImpact",
  "budgetReadiness",
  "decisionMakerAccess",
  "implementationReadiness",
  "replicationPotential",
  "institutionalImportance",
  "relationshipStrength",
  "commercialPotential",
] as const;
export type ScoreDimension = (typeof SCORE_DIMENSIONS)[number];

export const SCORE_DIMENSION_LABELS: Record<ScoreDimension, string> = {
  strategicRelevance: "Strategic relevance",
  problemUrgency: "Problem urgency",
  potentialImpact: "Potential impact",
  budgetReadiness: "Budget readiness",
  decisionMakerAccess: "Decision-maker access",
  implementationReadiness: "Implementation readiness",
  replicationPotential: "Replication potential",
  institutionalImportance: "Government / institutional importance",
  relationshipStrength: "Relationship strength",
  commercialPotential: "Commercial potential",
};

// ── Records ─────────────────────────────────────────────────────────────────

export interface AttachmentMeta {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface CaseNote {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  from: CaseStatus | null;
  to: CaseStatus;
  byId: string | null;
  byName: string;
  note?: string;
  createdAt: string;
}

export interface EmailLogEntry {
  id: string;
  template: string;
  to: string;
  subject: string;
  status: "sent" | "logged" | "failed";
  error?: string;
  createdAt: string;
}

export type ScoreMap = Partial<Record<ScoreDimension, number>>;

export interface Diagnosis {
  understanding: string;
  rootProblem: string;
  currentProcessIssues: string;
  digitalOpportunity: string;
  recommendedSolution: string;
  keyFeatures: string;
  suggestedUserGroups: string;
  implementationPhases: string;
  quickWinPilot: string;
  estimatedDeliveryRange: string;
  estimatedInvestmentRange: string;
  risksAndConsiderations: string;
  informationStillRequired: string;
  recommendedNextStep: string;
  aiAssisted: boolean;
  status: "draft" | "sent";
  updatedAt: string;
  updatedByName: string;
}

export interface CaseRecord {
  id: string;
  reference: string; // e.g. CAP-2026-0007
  createdAt: string;
  updatedAt: string;
  source: string; // "web" for public form

  // Contact
  fullName: string;
  workEmail: string;
  mobile: string;
  position: string;
  preferredContact?: ContactMethod;
  preferredLanguage?: ConsultationLanguage;

  // Organisation
  organisationName: string;
  organisationType: OrganisationType;
  department?: string;
  website?: string;
  location?: string;

  // Challenge
  challengeTitle: string;
  challengeDescription: string;
  category?: ChallengeCategory;
  currentTools?: string;
  affectedUsers?: string;
  deadline?: string;
  budget?: BudgetRange;
  supportingLink?: string;

  // Workflow
  status: CaseStatus;
  priority: CasePriority;
  assignedToId: string | null;
  assignedToName: string | null;
  recommendedSolutionType?: string;
  followUpAction?: string;
  nextActionDate?: string;

  // Consent & audit
  consent: boolean;
  consentText: string;
  consentAt: string;
  submitterIpHash?: string;
  userAgent?: string;

  // Related collections
  attachments: AttachmentMeta[];
  notes: CaseNote[];
  statusHistory: StatusHistoryEntry[];
  emailLog: EmailLogEntry[];
  score: ScoreMap;
  diagnosis: Diagnosis | null;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string; // scrypt: salt:hash
  createdAt: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  at: string;
  actorId: string | null;
  actorName: string;
  action: string;
  target?: string;
  detail?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

export function averageScore(score: ScoreMap): number | null {
  const values = SCORE_DIMENSIONS.map((d) => score[d]).filter(
    (v): v is number => typeof v === "number",
  );
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

/** Status buckets used to group the admin pipeline board. */
export const STATUS_GROUPS: { label: string; statuses: CaseStatus[] }[] = [
  { label: "Intake", statuses: ["New", "Under review", "Clarification required"] },
  { label: "Diagnosis", statuses: ["Assigned", "Diagnosis in progress", "Diagnosis ready"] },
  {
    label: "Engagement",
    statuses: [
      "Response sent",
      "Consultation requested",
      "Pilot proposed",
      "Proposal requested",
      "Quotation requested",
      "Project opportunity",
    ],
  },
  { label: "Archive", statuses: ["Closed", "Not suitable", "Duplicate", "Spam"] },
];
