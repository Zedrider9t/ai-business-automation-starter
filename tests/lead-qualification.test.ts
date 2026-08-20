import assert from "node:assert/strict";
import test from "node:test";

import { qualifyLead } from "../src/modules/lead-qualification.js";

test("classifies a high-intent lead as hot", () => {
  const result = qualifyLead({
    name: "Asha",
    company: "Example Labs",
    email: "asha@example.com",
    budget: 120_000,
    timelineDays: 14,
    message: "Please send a proposal to build our automation platform.",
  });

  assert.equal(result.temperature, "hot");
  assert.equal(result.recommendedAction, "priority-call");
  assert.ok(result.score >= 70);
});

test("classifies an incomplete low-intent lead as cold", () => {
  const result = qualifyLead({
    name: "Demo",
    message: "Just exploring what is possible.",
  });

  assert.equal(result.temperature, "cold");
  assert.equal(result.recommendedAction, "nurture");
  assert.ok(result.score < 40);
});
