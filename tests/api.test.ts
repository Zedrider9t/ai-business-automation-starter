import test from "node:test";
import assert from "node:assert/strict";
import { handleApiRequest } from "../src/api/app.js";

test("returns health metadata", async () => {
  const response = await handleApiRequest({ method: "GET", path: "/health" });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    ok: true,
    service: "ai-business-automation-starter",
    version: "1.0",
  });
});

test("processes an enquiry through the complete business workflow", async () => {
  const response = await handleApiRequest({
    method: "POST",
    path: "/v1/enquiries/process",
    body: {
      subject: "AI workflow enquiry",
      source: "website-contact-form",
      lead: {
        name: "Asha",
        company: "Acme Media",
        email: "asha@example.com",
        budget: 150000,
        timelineDays: 30,
        message: "We need an urgent AI automation workflow and want a proposal.",
      },
    },
  });

  assert.equal(response.status, 200);
  const body = response.body as {
    qualification: { temperature: string };
    routing: { category: string; priority: string };
    proposalBrief: { category: string };
    handoff: { event: string; source: string; requiresHumanReview: boolean };
  };

  assert.equal(body.qualification.temperature, "hot");
  assert.equal(body.routing.category, "ai-automation");
  assert.equal(body.routing.priority, "high");
  assert.equal(body.proposalBrief.category, "ai-automation");
  assert.equal(body.handoff.event, "business.enquiry.ready");
  assert.equal(body.handoff.source, "website-contact-form");
  assert.equal(body.handoff.requiresHumanReview, false);
});

test("rejects malformed enquiry bodies", async () => {
  const response = await handleApiRequest({
    method: "POST",
    path: "/v1/enquiries/process",
    body: { lead: { name: "", message: "" } },
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: "invalid_request",
    message: "A valid lead with non-empty name and message is required.",
  });
});

test("returns 404 for unknown routes", async () => {
  const response = await handleApiRequest({ method: "GET", path: "/missing" });
  assert.equal(response.status, 404);
});
