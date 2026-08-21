import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

interface N8nNode {
  name: string;
  type: string;
}

interface N8nWorkflow {
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, unknown>;
}

async function loadWorkflow(): Promise<N8nWorkflow> {
  const raw = await readFile(new URL("../examples/n8n/enquiry-processing-workflow.json", import.meta.url), "utf8");
  return JSON.parse(raw) as N8nWorkflow;
}

test("n8n example is importable JSON with expected workflow nodes", async () => {
  const workflow = await loadWorkflow();
  const names = new Set(workflow.nodes.map((node) => node.name));

  assert.equal(workflow.name, "AI Business Enquiry Processing");
  assert.equal(workflow.active, false);
  assert.ok(names.has("Receive Enquiry"));
  assert.ok(names.has("Process Enquiry"));
  assert.ok(names.has("Human Review Required?"));
  assert.ok(names.has("Prepare CRM Payload"));
  assert.ok(names.has("Respond"));
});

test("n8n example uses native webhook and HTTP request nodes", async () => {
  const workflow = await loadWorkflow();
  const types = new Set(workflow.nodes.map((node) => node.type));

  assert.ok(types.has("n8n-nodes-base.webhook"));
  assert.ok(types.has("n8n-nodes-base.httpRequest"));
  assert.ok(types.has("n8n-nodes-base.if"));
  assert.ok(types.has("n8n-nodes-base.respondToWebhook"));
});

test("n8n workflow contains connections and starts inactive", async () => {
  const workflow = await loadWorkflow();

  assert.ok(Object.keys(workflow.connections).length >= 5);
  assert.equal(workflow.active, false);
});
