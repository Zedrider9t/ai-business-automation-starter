import assert from "node:assert/strict";
import test from "node:test";

import { MockAIProvider } from "../src/providers/mock.js";

const request = {
  messages: [
    { role: "system" as const, content: "You classify business enquiries." },
    { role: "user" as const, content: "Need a mobile app for our company." },
  ],
};

test("mock provider returns deterministic completion metadata", async () => {
  const provider = new MockAIProvider("qualified lead");
  const result = await provider.complete(request);

  assert.equal(result.text, "qualified lead");
  assert.equal(result.provider, "mock");
  assert.equal(result.model, "mock-model");
});
