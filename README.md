# AI Business Automation Starter

A practical, provider-agnostic TypeScript starter for building AI-assisted business workflows such as lead qualification, enquiry routing, proposal preparation, CRM handoff, and operational automation.

> **Status:** Active public foundation. Core TypeScript setup, lead qualification, enquiry routing, structured proposal briefs, AI proposal enhancement, webhook/CRM handoff, an HTTP API example, an n8n workflow example, tests, CI, and provider abstraction are in place.

## What this project is for

Many AI demos stop at a chatbot. This starter focuses on business operations: take structured input, apply deterministic rules where appropriate, call an AI provider only when needed, validate the result, and return data that can be sent to a CRM, webhook, database, or automation platform.

## Current capabilities

- Deterministic lead qualification workflow
- Enquiry classification and queue routing
- Buying-intent / urgency priority detection
- Human-review fallback for unclear enquiries
- Structured proposal brief generation
- AI-enhanced proposal content with validated JSON output
- Guard against unconfirmed commercial commitments in AI-generated proposal content
- Category-specific suggested scope
- Discovery questions, assumptions and next-action guidance
- Typed webhook / CRM handoff payloads
- Stable idempotency keys for duplicate-safe downstream processing
- Optional bearer-authenticated webhook delivery using native `fetch`
- Native Node.js HTTP API example with health and workflow endpoints
- Importable n8n workflow example with review/CRM branching
- Shared typed workflow contracts
- Provider-agnostic AI interface
- Mock AI provider for local development and tests
- OpenAI-compatible chat-completions adapter using `fetch`
- Safe `.env.example` provider configuration
- Automated tests and GitHub Actions CI

## Planned modules

- Audit-friendly workflow results
- Environment validation and safe secret handling
- Additional provider adapters and examples

## Design principles

1. **Business-first:** workflows should solve an operational problem, not just demonstrate an LLM.
2. **Structured outputs:** automation should consume typed data rather than fragile free-form text.
3. **Provider-agnostic:** core business logic should not depend on a single AI vendor.
4. **Safe defaults:** secrets stay in environment variables and examples use non-sensitive demo data.
5. **Human review where it matters:** high-impact actions should be easy to place behind approval gates.
6. **Composable:** modules should be usable from a CLI, API route, worker, webhook, or automation platform.
7. **No invented commitments:** proposal content must not fabricate pricing, delivery dates, credentials, client relationships, guarantees or contractual promises.
8. **Delivery-safe:** downstream handoffs include an idempotency key and explicit human-review state.

## Architecture

```text
src/
├── api/           # native Node.js HTTP API example
├── core/          # shared types and workflow contracts
├── modules/       # qualification, routing, proposal briefs and AI enhancement
├── integrations/  # webhook / CRM handoff helpers
├── providers/     # AI provider contracts and adapters
└── index.ts       # runnable demo entry point

examples/
└── n8n/           # importable automation workflow and setup guide
```

## Business workflow

```text
Lead enquiry / HTTP request / n8n webhook
   ↓
Lead qualification
   ↓
Enquiry classification / routing
   ↓
Structured proposal brief
   ↓
Optional AI proposal enhancement
   ↓
Versioned webhook / CRM handoff payload
   ↓
Human review or downstream automation
```

The deterministic proposal brief generator produces typed business context including category, priority, lead score, suggested scope, discovery questions, assumptions, complexity and the recommended next action. It deliberately avoids inventing final pricing or delivery commitments from incomplete enquiry data.

The optional AI enhancement stage receives that already-structured brief and returns validated JSON containing an executive summary, solution approach, risks/dependencies and a next-step draft. Provider output is treated as untrusted: malformed output is rejected, and generated content containing unconfirmed pricing, delivery promises or guarantees is blocked.

The webhook handoff helper packages the lead, qualification, routing and optional proposal brief into a versioned event envelope. It includes a stable idempotency key so CRM or n8n-style workflows can avoid processing the same enquiry twice.

## Quick start

```bash
npm install
npm run typecheck
npm test
npm run dev
```

## HTTP API example

Start the API locally:

```bash
npm run dev:api
```

By default it listens on `http://localhost:3000`. Set `PORT` to use another port.

### Health check

```http
GET /health
```

### Process an enquiry

```http
POST /v1/enquiries/process
Content-Type: application/json
```

Example payload:

```json
{
  "subject": "AI workflow enquiry",
  "source": "website-contact-form",
  "lead": {
    "name": "Asha",
    "company": "Acme Media",
    "email": "asha@example.com",
    "budget": 150000,
    "timelineDays": 30,
    "message": "We need an urgent AI automation workflow and want a proposal."
  }
}
```

The response contains the lead qualification result, enquiry routing result, structured proposal brief, and a versioned downstream handoff payload. The example intentionally does not auto-send external webhooks; delivery remains an explicit downstream action.

## n8n integration example

An importable n8n workflow is included at:

```text
examples/n8n/enquiry-processing-workflow.json
```

It demonstrates:

- Receiving an enquiry through an n8n webhook
- Calling `POST /v1/enquiries/process`
- Branching on `handoff.requiresHumanReview`
- Preparing either a human-review item or a CRM-ready payload
- Returning a compact webhook response with the idempotency key

See `examples/n8n/README.md` for import and configuration instructions. The example ships inactive and does not contain credentials or a real CRM write operation.

## AI provider configuration

The project defaults to safe local/mock workflows. To connect an OpenAI-compatible endpoint, copy `.env.example` to `.env` and set your own values.

```env
AI_PROVIDER=mock
AI_MODEL=gpt-5-mini
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=replace-me
```

Never commit real credentials.

## Roadmap

- [x] Core TypeScript project foundation
- [x] Deterministic lead qualification module
- [x] AI provider interface
- [x] OpenAI-compatible provider adapter
- [x] Tests
- [x] GitHub Actions CI
- [x] Enquiry routing module
- [x] Structured proposal brief generator
- [x] Webhook / CRM handoff example
- [x] HTTP API example
- [x] n8n integration example
- [x] AI-enhanced proposal content with structured validation
- [ ] Audit-friendly workflow result envelope
- [ ] Environment validation and safe configuration helper

## Contributing

Contributions are welcome. Please open an issue before proposing large architectural changes and keep pull requests focused and testable.

## Security

Do not commit API keys, customer data, production credentials, private URLs, or confidential business information. Use `.env` locally and keep only safe placeholders in `.env.example`.

## Maintainer

**Mohammed Mohsin**  
Founder & CEO, Implement Media Solutions Pvt Ltd  
[Website](https://implementmediasolutions.com) · [LinkedIn](https://www.linkedin.com/in/mohammed-mohsin-ims/)

## License

MIT — see `LICENSE`.
