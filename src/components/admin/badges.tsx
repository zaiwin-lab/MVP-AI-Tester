import { clsx } from "@/lib/clsx";
import type { CasePriority, CaseStatus } from "@/lib/domain";

const STATUS_TONE: Record<CaseStatus, string> = {
  New: "bg-info-soft text-info",
  "Under review": "bg-info-soft text-info",
  "Clarification required": "bg-warning-soft text-warning",
  Assigned: "bg-primary-soft text-primary-ink",
  "Diagnosis in progress": "bg-primary-soft text-primary-ink",
  "Diagnosis ready": "bg-primary-soft text-primary-ink",
  "Response sent": "bg-success-soft text-success",
  "Consultation requested": "bg-success-soft text-success",
  "Pilot proposed": "bg-success-soft text-success",
  "Proposal requested": "bg-success-soft text-success",
  "Quotation requested": "bg-success-soft text-success",
  "Project opportunity": "bg-accent-soft text-accent-ink",
  Closed: "bg-surface-2 text-muted",
  "Not suitable": "bg-surface-2 text-muted",
  Duplicate: "bg-surface-2 text-muted",
  Spam: "bg-danger-soft text-danger",
};

const PRIORITY_TONE: Record<CasePriority, string> = {
  Normal: "bg-surface-2 text-ink-soft",
  Important: "bg-info-soft text-info",
  "High potential": "bg-accent-soft text-accent-ink",
  Urgent: "bg-danger-soft text-danger",
  Strategic: "bg-primary-soft text-primary-ink",
};

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_TONE[status], className)}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: CasePriority; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", PRIORITY_TONE[priority], className)}>
      {priority !== "Normal" && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {priority}
    </span>
  );
}
