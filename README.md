# AI Business Automation Starter

A practical, provider-agnostic TypeScript starter for building AI-assisted business workflows such as lead qualification, enquiry routing, proposal preparation, CRM handoff, and operational automation.

> **Status:** Active public foundation. Core TypeScript setup, lead qualification, enquiry routing, structured proposal briefs, webhook/CRM handoff, an HTTP API example, tests, CI, and the first provider abstraction are in place.

## What this project is for

Many AI demos stop at a chatbot. This starter focuses on business operations: take structured input, apply deterministic rules where appropriate, call an AI provider only when needed, validate the result, and return data that can be sent to a CRM, webhook, database, or automation platform.

## Current capabilities

- Deterministic lead qualification workflow
- Enquiry classification and queue routing
- Buying-intent / urgency priority detection
- Human-review fallback for unclear enquiries
- Structured proposal brief generation
- Category-specific suggested scope
- Discovery questions, assumptions and next-action guidance
- Typed webhook / CRM handoff payloads
- Stable idempotency keys for duplicate-safe downstream processing
- Optional bearer-authenticated webhook delivery using native `fetch`
- Native Node.js HTTP API example with health and workflow endpoints
- Shared typed workflow contracts
- Provider-agnostic AI interface
- Mock AI provider for local development and tests
- OpenAI-compatible chat-completions adapter using `fetch`
- Safe `.env.example` provider configuration
- Automated tests and GitHub Actions CI

## Planned modules

- AI-enhanced proposal content
- Structured AI outputs
- n8n-specific integration example
- Audit-friendly workflow results
- Environment validation and safe secret handling

## Design principles

1. **Business-first:** workflows should solve an operational problem, not just demonstrate an LLM.
2. **Structured outputs:** automation should consume typed data rather than fragile free-form text.
3. **Provider-agnostic:** core business logic should not depend on a single AI vendor.
4. **Safe defaults:** secrets stay in environment variables and examples use non-sensitive demo data.
5. **Human review where it matters:** high-impact actions should be easy to place behind approval gates.
6. **Composable:** modules should be usable from a CLI, API route, worker, webhook, or automation platform.
7. **No invented commitments:** proposal briefs do not fabricate pricing, delivery dates, credentials or contractual promises.
8. **Delivery-safe:** downstream handoffs include an idempotency key and explicit human-review state.

## Architecture

```text
src/
├── api/           # native Node.js HTTP API example
├── core/          # shared types and workflow contracts
├── modules/       # lead qualification, enquiry routing and proposal briefs
├── integrations/  # webhook / CRM handoff helpers
├── providers/     # AI provider contracts and adapters
└── index.ts       # runnable demo entry point
```

## Business workflow

```text
Lead enquiry / HTTP request
   ↓
Lead qualification
   ↓
Enquiry classification / routing
   ↓
Structured proposal brief
   ↓
Versioned webhook / CRM handoff payload
   ↓
Human discovery / downstream automation
```

The proposal brief generator produces typed business context including category, priority, lead score, suggested scope, discovery questions, assumptions, complexity and the recommended next action. It deliberately avoids inventing final pricing or delivery commitments from incomplete enquiry data.

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
- [ ] AI-enhanced proposal content
- [ ] n8n integration example

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
