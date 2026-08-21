import type { LeadInput, LeadQualificationResult } from "../core/types.js";
import type { EnquiryRoutingResult } from "./enquiry-routing.js";

export type ProposalComplexity = "low" | "medium" | "high";

export interface ProposalBriefInput {
  lead: LeadInput;
  qualification: LeadQualificationResult;
  routing: EnquiryRoutingResult;
}

export interface ProposalBrief {
  title: string;
  client: {
    name: string;
    company?: string;
    email?: string;
  };
  category: EnquiryRoutingResult["category"];
  priority: EnquiryRoutingResult["priority"];
  leadScore: number;
  leadTemperature: LeadQualificationResult["temperature"];
  problemSummary: string;
  suggestedScope: string[];
  discoveryQuestions: string[];
  assumptions: string[];
  complexity: ProposalComplexity;
  recommendedNextAction: string;
}

const scopeByCategory: Record<EnquiryRoutingResult["category"], string[]> = {
  website: ["Discovery and requirements mapping", "UX/UI implementation", "Responsive web development", "Deployment and handover"],
  "mobile-app": ["Product discovery", "Mobile application development", "API/integration planning", "Store-ready build and QA"],
  software: ["Requirements analysis", "Application architecture", "Core workflow implementation", "QA, deployment and documentation"],
  "ai-automation": ["Workflow discovery", "AI/provider integration", "Automation orchestration", "Guardrails, testing and monitoring"],
  marketing: ["Goal and audience definition", "Channel strategy", "Campaign setup", "Measurement and optimization"],
  "branding-design": ["Brand discovery", "Visual direction", "Core design assets", "Usage guidelines and handover"],
  "video-media": ["Creative brief", "Production/editing workflow", "Motion/graphics treatment", "Master export and delivery"],
  "hosting-support": ["Environment audit", "Hosting/deployment setup", "Monitoring and maintenance plan", "Operational handover"],
  general: ["Discovery call", "Requirements clarification", "Solution recommendation", "Scope and delivery planning"],
};

function inferComplexity(input: ProposalBriefInput): ProposalComplexity {
  const messageLength = input.lead.message.trim().length;
  const category = input.routing.category;

  if (["software", "ai-automation", "mobile-app"].includes(category) || messageLength > 500) {
    return "high";
  }

  if (["website", "marketing", "hosting-support"].includes(category) || messageLength > 180) {
    return "medium";
  }

  return "low";
}

export function generateProposalBrief(input: ProposalBriefInput): ProposalBrief {
  const categoryLabel = input.routing.category.replaceAll("-", " ");
  const clientLabel = input.lead.company ?? input.lead.name;

  const discoveryQuestions = [
    "What is the primary business outcome you want to achieve?",
    "What is the desired launch timeline?",
    "Are there existing systems, assets or APIs that must be integrated?",
  ];

  if (!input.lead.budget) {
    discoveryQuestions.push("What budget range has been allocated for this project?");
  }

  if (input.routing.requiresHumanReview) {
    discoveryQuestions.push("Which service area best matches this requirement?");
  }

  const assumptions = [
    "Final scope, timeline and commercial terms require discovery and confirmation.",
    "No pricing or delivery commitment is inferred from the initial enquiry alone.",
  ];

  return {
    title: `${categoryLabel} proposal brief for ${clientLabel}`,
    client: {
      name: input.lead.name,
      ...(input.lead.company ? { company: input.lead.company } : {}),
      ...(input.lead.email ? { email: input.lead.email } : {}),
    },
    category: input.routing.category,
    priority: input.routing.priority,
    leadScore: input.qualification.score,
    leadTemperature: input.qualification.temperature,
    problemSummary: input.lead.message.trim(),
    suggestedScope: [...scopeByCategory[input.routing.category]],
    discoveryQuestions,
    assumptions,
    complexity: inferComplexity(input),
    recommendedNextAction:
      input.qualification.temperature === "hot" || input.routing.priority === "high"
        ? "Schedule a priority discovery call and prepare a confirmed scope."
        : "Send a discovery questionnaire and confirm requirements before estimating.",
  };
}
