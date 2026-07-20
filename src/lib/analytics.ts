import { listCases } from "./db";
import type { CaseRecord, CaseStatus } from "./domain";

export interface Analytics {
  total: number;
  newCases: number;
  underReview: number;
  responsesSent: number;
  consultationRequests: number;
  proposalRequests: number;
  projectOpportunities: number;
  highPotential: number;
  avgResponseHours: number | null;
  byOrgType: { label: string; count: number }[];
  byCategory: { label: string; count: number }[];
  recent: CaseRecord[];
}

const RESPONDED: CaseStatus[] = [
  "Response sent", "Consultation requested", "Pilot proposed", "Proposal requested",
  "Quotation requested", "Project opportunity",
];

function tally(items: (string | undefined)[]): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = item || "Unspecified";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

export async function getAnalytics(): Promise<Analytics> {
  const cases = await listCases();

  // Average response time: submission → first "Response sent" status entry.
  const responseDurations: number[] = [];
  for (const c of cases) {
    const sent = c.statusHistory.find((h) => h.to === "Response sent");
    if (sent) {
      const hrs = (new Date(sent.createdAt).getTime() - new Date(c.createdAt).getTime()) / 36e5;
      if (hrs >= 0) responseDurations.push(hrs);
    }
  }
  const avgResponseHours =
    responseDurations.length > 0
      ? Math.round((responseDurations.reduce((a, b) => a + b, 0) / responseDurations.length) * 10) / 10
      : null;

  const count = (pred: (c: CaseRecord) => boolean) => cases.filter(pred).length;

  return {
    total: cases.length,
    newCases: count((c) => c.status === "New"),
    underReview: count((c) => c.status === "Under review" || c.status === "Diagnosis in progress"),
    responsesSent: count((c) => RESPONDED.includes(c.status)),
    consultationRequests: count((c) => c.status === "Consultation requested"),
    proposalRequests: count((c) => c.status === "Proposal requested" || c.status === "Quotation requested"),
    projectOpportunities: count((c) => c.status === "Project opportunity"),
    highPotential: count((c) => c.priority === "High potential" || c.priority === "Strategic"),
    avgResponseHours,
    byOrgType: tally(cases.map((c) => c.organisationType)),
    byCategory: tally(cases.map((c) => c.category)),
    recent: cases.slice(0, 6),
  };
}
