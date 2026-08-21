import { createHash } from "node:crypto";
import type { LeadInput, LeadQualificationResult } from "../core/types.js";
import type { EnquiryRoutingResult } from "../modules/enquiry-routing.js";
import type { ProposalBrief } from "../modules/proposal-brief.js";

export interface WorkflowHandoffInput {
  lead: LeadInput;
  qualification: LeadQualificationResult;
  routing: EnquiryRoutingResult;
  proposalBrief?: ProposalBrief;
  source?: string;
}

export interface WorkflowHandoffPayload {
  event: "business.enquiry.ready";
  version: "1.0";
  idempotencyKey: string;
  occurredAt: string;
  source: string;
  lead: LeadInput;
  qualification: LeadQualificationResult;
  routing: EnquiryRoutingResult;
  proposalBrief?: ProposalBrief;
  requiresHumanReview: boolean;
}

export interface SendWebhookOptions {
  url: string;
  payload: WorkflowHandoffPayload;
  bearerToken?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface WebhookDeliveryResult {
  ok: boolean;
  status: number;
  deliveryId?: string;
}

function makeIdempotencyKey(input: WorkflowHandoffInput): string {
  const stableIdentity = [
    input.lead.email ?? "",
    input.lead.company ?? "",
    input.lead.name,
    input.lead.message.trim(),
    input.routing.category,
  ].join("|");

  return createHash("sha256").update(stableIdentity).digest("hex").slice(0, 32);
}

export function buildWorkflowHandoff(
  input: WorkflowHandoffInput,
  now: Date = new Date(),
): WorkflowHandoffPayload {
  return {
    event: "business.enquiry.ready",
    version: "1.0",
    idempotencyKey: makeIdempotencyKey(input),
    occurredAt: now.toISOString(),
    source: input.source ?? "ai-business-automation-starter",
    lead: { ...input.lead },
    qualification: { ...input.qualification, reasons: [...input.qualification.reasons] },
    routing: { ...input.routing, matchedTerms: [...input.routing.matchedTerms] },
    ...(input.proposalBrief ? { proposalBrief: input.proposalBrief } : {}),
    requiresHumanReview:
      input.routing.requiresHumanReview || input.proposalBrief === undefined,
  };
}

export async function sendWebhook(options: SendWebhookOptions): Promise<WebhookDeliveryResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(options.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-idempotency-key": options.payload.idempotencyKey,
        ...(options.bearerToken
          ? { authorization: `Bearer ${options.bearerToken}` }
          : {}),
      },
      body: JSON.stringify(options.payload),
      signal: controller.signal,
    });

    return {
      ok: response.ok,
      status: response.status,
      ...(response.headers.get("x-delivery-id")
        ? { deliveryId: response.headers.get("x-delivery-id") ?? undefined }
        : {}),
    };
  } finally {
    clearTimeout(timeout);
  }
}
