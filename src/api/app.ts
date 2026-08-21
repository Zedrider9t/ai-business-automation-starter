import type { LeadInput } from "../core/types.js";
import { buildWorkflowHandoff } from "../integrations/webhook-handoff.js";
import { routeEnquiry } from "../modules/enquiry-routing.js";
import { qualifyLead } from "../modules/lead-qualification.js";
import { generateProposalBrief } from "../modules/proposal-brief.js";

export interface ApiRequest {
  method: string;
  path: string;
  body?: unknown;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

interface ProcessEnquiryBody {
  lead: LeadInput;
  subject?: string;
  source?: string;
}

function isLeadInput(value: unknown): value is LeadInput {
  if (!value || typeof value !== "object") return false;
  const lead = value as Partial<LeadInput>;
  return typeof lead.name === "string" && lead.name.trim().length > 0
    && typeof lead.message === "string" && lead.message.trim().length > 0;
}

function isProcessEnquiryBody(value: unknown): value is ProcessEnquiryBody {
  if (!value || typeof value !== "object") return false;
  const body = value as Partial<ProcessEnquiryBody>;
  return isLeadInput(body.lead)
    && (body.subject === undefined || typeof body.subject === "string")
    && (body.source === undefined || typeof body.source === "string");
}

export async function handleApiRequest(request: ApiRequest): Promise<ApiResponse> {
  if (request.method === "GET" && request.path === "/health") {
    return {
      status: 200,
      body: {
        ok: true,
        service: "ai-business-automation-starter",
        version: "1.0",
      },
    };
  }

  if (request.method === "POST" && request.path === "/v1/enquiries/process") {
    if (!isProcessEnquiryBody(request.body)) {
      return {
        status: 400,
        body: {
          error: "invalid_request",
          message: "A valid lead with non-empty name and message is required.",
        },
      };
    }

    const qualification = qualifyLead(request.body.lead);
    const routing = routeEnquiry({
      ...(request.body.subject ? { subject: request.body.subject } : {}),
      message: request.body.lead.message,
    });
    const proposalBrief = generateProposalBrief({
      lead: request.body.lead,
      qualification,
      routing,
    });
    const handoff = buildWorkflowHandoff({
      lead: request.body.lead,
      qualification,
      routing,
      proposalBrief,
      ...(request.body.source ? { source: request.body.source } : {}),
    });

    return {
      status: 200,
      body: {
        qualification,
        routing,
        proposalBrief,
        handoff,
      },
    };
  }

  return {
    status: 404,
    body: {
      error: "not_found",
      message: "Route not found.",
    },
  };
}
