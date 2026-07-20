import type { CaseRecord, Diagnosis } from "./domain";

/**
 * Internal, human-in-the-loop AI assist for the diagnosis builder.
 *
 * Governance rules enforced here:
 *  - This is ONLY reachable from the authenticated admin diagnosis builder.
 *  - It never returns content directly to the public user.
 *  - Every output is flagged `aiAssisted: true` and status `draft`, and the UI
 *    labels it "AI-assisted draft. Human review required."
 *  - If no ANTHROPIC_API_KEY is configured, it returns a deterministic
 *    structured template so the workflow still functions offline.
 */

export type DiagnosisDraft = Omit<Diagnosis, "updatedAt" | "updatedByName" | "status">;

const EMPTY: DiagnosisDraft = {
  understanding: "",
  rootProblem: "",
  currentProcessIssues: "",
  digitalOpportunity: "",
  recommendedSolution: "",
  keyFeatures: "",
  suggestedUserGroups: "",
  implementationPhases: "",
  quickWinPilot: "",
  estimatedDeliveryRange: "",
  estimatedInvestmentRange: "",
  risksAndConsiderations: "",
  informationStillRequired: "",
  recommendedNextStep: "",
  aiAssisted: true,
};

function templateDraft(c: CaseRecord): DiagnosisDraft {
  return {
    ...EMPTY,
    understanding: `${c.organisationName} (${c.organisationType}) reports: "${c.challengeTitle}". In their words: ${c.challengeDescription.slice(0, 400)}`,
    rootProblem:
      "Draft: identify whether the core issue is a manual/fragmented process, a lack of visibility, or a missing system. Confirm with the client before finalising.",
    currentProcessIssues: c.currentTools
      ? `Currently using: ${c.currentTools}. Assess where these tools create manual work, duplication, or gaps.`
      : "Ask the client which tools and steps they use today.",
    digitalOpportunity:
      "Draft: describe the opportunity to centralise, automate, or make the process visible. Keep it outcome-focused, not product-led.",
    recommendedSolution: `Draft direction based on category "${c.category ?? "Not specified"}". Refine after review.`,
    keyFeatures: "- Central record\n- Role-based access\n- Status/progress tracking\n- Reporting/export\n- Notifications",
    suggestedUserGroups: "- Administrators\n- Operational team\n- Reviewers/approvers\n- End participants (where relevant)",
    implementationPhases: "Phase 1: Discovery & data model\nPhase 2: Core build & pilot\nPhase 3: Rollout, training & reporting",
    quickWinPilot: "Draft: propose a focused pilot covering one process or one group to prove value quickly.",
    estimatedDeliveryRange: "To confirm after scoping.",
    estimatedInvestmentRange: c.budget ? `Client budget signal: ${c.budget}. Provide a range only after scoping.` : "To confirm after scoping.",
    risksAndConsiderations:
      "Consider data sensitivity, integration with existing systems, governance/procurement, and support requirements.",
    informationStillRequired:
      "Confirm volumes, current tools, integration needs, deadline, decision process, and any security/governance constraints.",
    recommendedNextStep: "Propose a short consultation to validate the direction and agree a pilot scope.",
  };
}

export async function draftDiagnosis(c: CaseRecord): Promise<{ draft: DiagnosisDraft; mode: "ai" | "template" }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { draft: templateDraft(c), mode: "template" };
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
  const system =
    "You are an internal analyst for CAP, a digital solutions consulting team. Produce a PRELIMINARY, INTERNAL diagnosis draft for human review. Be practical and specific. Do not promise pricing or timelines as commitments. Output strict JSON with these keys: understanding, rootProblem, currentProcessIssues, digitalOpportunity, recommendedSolution, keyFeatures, suggestedUserGroups, implementationPhases, quickWinPilot, estimatedDeliveryRange, estimatedInvestmentRange, risksAndConsiderations, informationStillRequired, recommendedNextStep. Values are plain strings.";
  const userMsg = JSON.stringify({
    organisation: c.organisationName,
    organisationType: c.organisationType,
    challengeTitle: c.challengeTitle,
    challengeDescription: c.challengeDescription,
    category: c.category,
    currentTools: c.currentTools,
    affectedUsers: c.affectedUsers,
    budget: c.budget,
    deadline: c.deadline,
  });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const data = (await res.json()) as { content?: { text?: string }[] };
    const text = data.content?.map((b) => b.text ?? "").join("") ?? "";
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as Partial<DiagnosisDraft>;
    return { draft: { ...templateDraft(c), ...parsed, aiAssisted: true }, mode: "ai" };
  } catch (err) {
    console.error("[ai:draftDiagnosis] falling back to template:", err);
    return { draft: templateDraft(c), mode: "template" };
  }
}
