import test from "node:test";
import assert from "node:assert/strict";
import { qualifyLead } from "../src/modules/lead-qualification.js";
import { routeEnquiry } from "../src/modules/enquiry-routing.js";
import { generateProposalBrief } from "../src/modules/proposal-brief.js";

const hotLead = {
  name: "Asha",
  company: "Acme Media",
  email: "asha@example.com",
  budget: 150_000,
  timelineDays: 30,
  message: "We need an urgent AI automation workflow and want a proposal.",
};

test("generates a structured high-priority AI proposal brief", () => {
  const qualification = qualifyLead(hotLead);
  const routing = routeEnquiry({ subject: "AI automation", message: hotLead.message });
  const brief = generateProposalBrief({ lead: hotLead, qualification, routing });

  assert.equal(brief.category, "ai-automation");
  assert.equal(brief.priority, "high");
  assert.equal(brief.leadTemperature, "hot");
  assert.equal(brief.complexity, "high");
  assert.match(brief.title, /Acme Media/);
  assert.ok(brief.suggestedScope.includes("AI/provider integration"));
  assert.match(brief.recommendedNextAction, /priority discovery call/i);
});

test("asks for budget when none is provided", () => {
  const lead = {
    name: "Ravi",
    message: "I need a new company website.",
  };
  const qualification = qualifyLead(lead);
  const routing = routeEnquiry({ message: lead.message });
  const brief = generateProposalBrief({ lead, qualification, routing });

  assert.equal(brief.category, "website");
  assert.ok(brief.discoveryQuestions.some((question) => question.toLowerCase().includes("budget")));
  assert.ok(brief.assumptions.some((assumption) => assumption.toLowerCase().includes("no pricing")));
});

test("keeps unclear enquiries behind human review", () => {
  const lead = {
    name: "Mina",
    message: "Please contact me about a possible project.",
  };
  const qualification = qualifyLead(lead);
  const routing = routeEnquiry({ message: lead.message });
  const brief = generateProposalBrief({ lead, qualification, routing });

  assert.equal(brief.category, "general");
  assert.ok(brief.discoveryQuestions.some((question) => question.includes("service area")));
});
