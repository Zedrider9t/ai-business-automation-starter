import type { LeadInput, LeadQualificationResult } from "../core/types.js";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function qualifyLead(lead: LeadInput): LeadQualificationResult {
  let score = 0;
  const reasons: string[] = [];

  if (lead.budget && lead.budget >= 100_000) {
    score += 35;
    reasons.push("High stated budget");
  } else if (lead.budget && lead.budget >= 40_000) {
    score += 25;
    reasons.push("Viable stated budget");
  } else if (lead.budget) {
    score += 10;
    reasons.push("Budget provided");
  }

  if (lead.timelineDays && lead.timelineDays <= 30) {
    score += 25;
    reasons.push("Short buying timeline");
  } else if (lead.timelineDays && lead.timelineDays <= 90) {
    score += 15;
    reasons.push("Defined buying timeline");
  }

  if (lead.company) {
    score += 10;
    reasons.push("Company identified");
  }

  if (lead.email) {
    score += 10;
    reasons.push("Contact email provided");
  }

  const intentTerms = ["quote", "proposal", "demo", "build", "develop", "automation", "website", "app", "software"];
  const normalizedMessage = lead.message.toLowerCase();
  const matchedIntent = intentTerms.some((term) => normalizedMessage.includes(term));

  if (matchedIntent) {
    score += 20;
    reasons.push("Message contains buying or project intent");
  }

  score = clamp(score, 0, 100);

  if (score >= 70) {
    return {
      score,
      temperature: "hot",
      reasons,
      recommendedAction: "priority-call",
    };
  }

  if (score >= 40) {
    return {
      score,
      temperature: "warm",
      reasons,
      recommendedAction: "follow-up",
    };
  }

  return {
    score,
    temperature: "cold",
    reasons,
    recommendedAction: "nurture",
  };
}
