import type { ProposalBrief } from "./proposal-brief.js";
import type { AICompletionResult, AIProvider } from "../providers/types.js";

export interface AIProposalEnhancement {
  executiveSummary: string;
  solutionApproach: string[];
  risksAndDependencies: string[];
  nextStepDraft: string;
  metadata: {
    provider: string;
    model: string;
  };
}

const commercialCommitmentPattern =
  /(?:₹|\$|£|€|fixed\s+price|guaranteed|will\s+be\s+delivered|delivery\s+in\s+\d+)/i;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function parseStructuredEnhancement(result: AICompletionResult): AIProposalEnhancement {
  let parsed: unknown;

  try {
    parsed = JSON.parse(result.text);
  } catch {
    throw new Error("AI provider returned invalid JSON for proposal enhancement.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI provider returned an invalid proposal enhancement object.");
  }

  const candidate = parsed as Record<string, unknown>;

  if (
    typeof candidate.executiveSummary !== "string" ||
    candidate.executiveSummary.trim().length === 0 ||
    !isStringArray(candidate.solutionApproach) ||
    !isStringArray(candidate.risksAndDependencies) ||
    typeof candidate.nextStepDraft !== "string" ||
    candidate.nextStepDraft.trim().length === 0
  ) {
    throw new Error("AI proposal enhancement did not match the required structured output.");
  }

  const generatedText = [
    candidate.executiveSummary,
    ...candidate.solutionApproach,
    ...candidate.risksAndDependencies,
    candidate.nextStepDraft,
  ].join(" ");

  if (commercialCommitmentPattern.test(generatedText)) {
    throw new Error("AI proposal enhancement contained an unconfirmed commercial commitment.");
  }

  return {
    executiveSummary: candidate.executiveSummary.trim(),
    solutionApproach: candidate.solutionApproach.map((item) => item.trim()),
    risksAndDependencies: candidate.risksAndDependencies.map((item) => item.trim()),
    nextStepDraft: candidate.nextStepDraft.trim(),
    metadata: {
      provider: result.provider,
      model: result.model,
    },
  };
}

export async function enhanceProposalBrief(
  brief: ProposalBrief,
  provider: AIProvider,
): Promise<AIProposalEnhancement> {
  const result = await provider.complete({
    temperature: 0.2,
    maxTokens: 900,
    messages: [
      {
        role: "system",
        content: [
          "You enhance an already-structured business proposal brief.",
          "Return JSON only with these keys: executiveSummary, solutionApproach, risksAndDependencies, nextStepDraft.",
          "solutionApproach and risksAndDependencies must be non-empty arrays of strings.",
          "Use only facts present in the supplied brief.",
          "Do not invent pricing, delivery dates, credentials, client relationships, guarantees, or contractual commitments.",
          "Keep final commercial scope subject to human discovery and confirmation.",
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify(brief),
      },
    ],
  });

  return parseStructuredEnhancement(result);
}
