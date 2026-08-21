import test from "node:test";
import assert from "node:assert/strict";

import { routeEnquiry } from "../src/modules/enquiry-routing.js";

test("routes AI automation enquiries to the AI queue", () => {
  const result = routeEnquiry({
    subject: "AI workflow automation",
    message: "We need an OpenAI chatbot with n8n automation for our enquiries.",
  });

  assert.equal(result.category, "ai-automation");
  assert.equal(result.queue, "ai-automation");
  assert.equal(result.requiresHumanReview, false);
  assert.ok(result.matchedTerms.includes("openai"));
});

test("routes mobile app buying enquiries with high priority", () => {
  const result = routeEnquiry({
    message: "Please send a quote for an Android app and iOS app. We want to start project soon.",
  });

  assert.equal(result.category, "mobile-app");
  assert.equal(result.queue, "mobile-apps");
  assert.equal(result.priority, "high");
});

test("sends unclear enquiries to human review", () => {
  const result = routeEnquiry({
    message: "I would like to discuss a business requirement with your team.",
  });

  assert.equal(result.category, "general");
  assert.equal(result.queue, "general-enquiries");
  assert.equal(result.requiresHumanReview, true);
});
