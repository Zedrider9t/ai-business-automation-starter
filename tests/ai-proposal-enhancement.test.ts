import test from "node:test";
import assert from "node:assert/strict";
import { MockAIProvider } from "../src/providers/mock.js";
import { qualifyLead } from "../src/modules/lead-qualification.js";
import { routeEnquiry } from "../src/modules/enquiry-routing.js";
import { generateProposalBrief } from "../src/modules/proposal-brief.js";
import { enhanceProposalBrief } from "../src/modules/ai-proposal-enhancement.js";

function makeBrief() {
  const lead = {
    name: "Asha",
    company: "Acme Media",
    email: "asha@example.com",
    budget: 150_000,
    timelineDays: 30,
    message: "We need an urgent AI automation workflow and want a proposal.",
  };

  const qualification = qualifyLead(lead);
  const routing = routeEnquiry({ subject: "AI automation", message: lead.message });
  return generateProposalBrief({ lead, qualification, routing });
}

test("returns validated structured AI proposal content", async () => {
  const provider = new MockAIProvider(JSON.stringify({
    executiveSummary: "Acme Media is evaluating an AI automation workflow that requires discovery before final scope confirmation.",
    solutionApproach: ["Map the target workflow", "Confirm provider and integration requirements", "Validate guardrails and monitoring needs"],
    risksAndDependencies: ["Existing API access must be confirmed", "Final workflow scope depends on discovery"],
    nextStepDraft: "Schedule a discovery session to confirm requirements and integration constraints.",
  }));

  const enhancement = await enhanceProposalBrief(makeBrief(), provider);

  assert.equal(enhancement.metadata.provider, "mock");
  assert.equal(enhancement.metadata.model, "mock-model");
  assert.equal(enhancement.solutionApproach.length, 3);
  assert.match(enhancement.executiveSummary, /Acme Media/);
});

test("rejects invalid JSON from a provider", async () => {
  const provider = new MockAIProvider("not-json");

  await assert.rejects(() => enhanceProposalBrief(makeBrief(), provider), /invalid JSON/i);
});

test("rejects incomplete structured output", async () => {
  const provider = new MockAIProvider(JSON.stringify({ executiveSummary: "Summary only" }));

  await assert.rejects(() => enhanceProposalBrief(makeBrief(), provider), /required structured output/i);
});

test("rejects unconfirmed commercial commitments", async () => {
  const provider = new MockAIProvider(JSON.stringify({
    executiveSummary: "The project will be delivered in 10 days.",
    solutionApproach: ["Implement the workflow"],
    risksAndDependencies: ["API access must be confirmed"],
    nextStepDraft: "Proceed immediately.",
  }));

  await assert.rejects(() => enhanceProposalBrief(makeBrief(), provider), /commercial commitment/i);
});
