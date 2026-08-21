import test from "node:test";
import assert from "node:assert/strict";
import { qualifyLead } from "../src/modules/lead-qualification.js";
import { routeEnquiry } from "../src/modules/enquiry-routing.js";
import { generateProposalBrief } from "../src/modules/proposal-brief.js";
import { buildWorkflowHandoff, sendWebhook } from "../src/integrations/webhook-handoff.js";

const lead = {
  name: "Asha",
  company: "Acme Media",
  email: "asha@example.com",
  budget: 150_000,
  timelineDays: 30,
  message: "We need an urgent AI automation workflow and want a proposal.",
};

function makePayload() {
  const qualification = qualifyLead(lead);
  const routing = routeEnquiry({ subject: "AI automation", message: lead.message });
  const proposalBrief = generateProposalBrief({ lead, qualification, routing });

  return buildWorkflowHandoff(
    { lead, qualification, routing, proposalBrief, source: "website-contact-form" },
    new Date("2026-08-21T12:00:00.000Z"),
  );
}

test("builds a deterministic CRM/webhook handoff envelope", () => {
  const payload = makePayload();

  assert.equal(payload.event, "business.enquiry.ready");
  assert.equal(payload.version, "1.0");
  assert.equal(payload.source, "website-contact-form");
  assert.equal(payload.occurredAt, "2026-08-21T12:00:00.000Z");
  assert.equal(payload.routing.category, "ai-automation");
  assert.equal(payload.requiresHumanReview, false);
  assert.equal(payload.idempotencyKey.length, 32);
  assert.equal(payload.proposalBrief?.leadTemperature, "hot");
});

test("uses the same idempotency key for the same enquiry", () => {
  const first = makePayload();
  const second = makePayload();

  assert.equal(first.idempotencyKey, second.idempotencyKey);
});

test("marks a handoff for human review when no proposal brief is supplied", () => {
  const qualification = qualifyLead(lead);
  const routing = routeEnquiry({ subject: "AI automation", message: lead.message });
  const payload = buildWorkflowHandoff({ lead, qualification, routing });

  assert.equal(payload.requiresHumanReview, true);
});

test("posts JSON with idempotency and optional bearer auth", async () => {
  const payload = makePayload();
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;

  const fakeFetch: typeof fetch = async (input, init) => {
    capturedUrl = String(input);
    capturedInit = init;
    return new Response(null, {
      status: 202,
      headers: { "x-delivery-id": "delivery-123" },
    });
  };

  const result = await sendWebhook({
    url: "https://example.com/webhooks/enquiries",
    bearerToken: "test-token",
    payload,
    fetchImpl: fakeFetch,
  });

  assert.equal(capturedUrl, "https://example.com/webhooks/enquiries");
  assert.equal(capturedInit?.method, "POST");
  assert.equal((capturedInit?.headers as Record<string, string>)["x-idempotency-key"], payload.idempotencyKey);
  assert.equal((capturedInit?.headers as Record<string, string>).authorization, "Bearer test-token");
  assert.equal(result.ok, true);
  assert.equal(result.status, 202);
  assert.equal(result.deliveryId, "delivery-123");
});
