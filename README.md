# AI Business Automation Starter

[![CI](https://github.com/Zedrider9t/ai-business-automation-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/Zedrider9t/ai-business-automation-starter/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Node](https://img.shields.io/badge/Node.js-%3E%3D20-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A practical, provider-agnostic TypeScript starter for AI-assisted business workflows: qualify a lead, route the enquiry, build a structured proposal brief, optionally enhance it with AI, and hand the result to an API, CRM, webhook or n8n automation.

> **Current milestone:** `v0.1.0` foundation is feature-complete and release-ready pending final validation/tagging.

## Why this project exists

Many AI examples stop at a chatbot. Business automation usually needs something different: deterministic rules where reliability matters, structured data between steps, optional AI where it adds value, and explicit human review before commercial or operational commitments.

This starter demonstrates that pattern without tying the core workflow to one model vendor, CRM or automation platform.

## What is included

| Area | Capability |
| --- | --- |
| Lead handling | Deterministic lead scoring, temperature and recommended action |
| Enquiry operations | Category classification, priority detection and queue routing |
| Proposal workflow | Structured proposal brief, discovery questions, assumptions and complexity |
| AI enhancement | Provider-agnostic executive summary, solution approach, risks and next-step draft |
| AI safety | Strict JSON validation and rejection of unconfirmed pricing, guarantees or delivery promises |
| Integration | Versioned webhook / CRM payloads and stable idempotency keys |
| API | Native Node.js HTTP API with health and enquiry-processing endpoints |
| n8n | Importable workflow with human-review / CRM-ready branching |
| Providers | Mock provider and OpenAI-compatible chat-completions adapter |
| Engineering | Strict TypeScript, automated tests and GitHub Actions CI |

## End-to-end workflow

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

The deterministic stages remain usable without an AI provider. AI enhancement is optional and provider output is treated as untrusted until it passes structural and commercial-safety validation.

## Architecture

```text
src/
├── api/           # native Node.js HTTP API example
├── core/          # shared types and workflow contracts
├── integrations/  # webhook / CRM handoff helpers
├── modules/       # qualification, routing, proposal briefs and AI enhancement
├── providers/     # AI provider contracts and adapters
└── index.ts       # runnable demo entry point

examples/
├── example-output.json
└── n8n/           # importable workflow and setup guide
```

## Quick start

```bash
npm install
npm run typecheck
npm test
npm run dev
```

Run the API example:

```bash
npm run dev:api
```

By default the API listens on `http://localhost:3000`.

## API example

### Health check

```http
GET /health
```

### Process an enquiry

```http
POST /v1/enquiries/process
Content-Type: application/json
```

Example request:

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

The response contains the qualification result, routing result, structured proposal brief and downstream handoff envelope. A representative output is available in [`examples/example-output.json`](examples/example-output.json).

External webhook delivery is intentionally explicit rather than automatic.

## n8n integration

Import:

```text
examples/n8n/enquiry-processing-workflow.json
```

The example demonstrates:

- receiving an enquiry through an n8n webhook;
- calling `POST /v1/enquiries/process`;
- branching on `handoff.requiresHumanReview`;
- preparing a human-review item or CRM-ready payload;
- propagating the idempotency key for duplicate-safe downstream processing.

See [`examples/n8n/README.md`](examples/n8n/README.md) for setup notes. The workflow ships inactive and contains no credentials or live CRM writes.

## AI provider configuration

The project defaults to safe local/mock workflows. To connect an OpenAI-compatible endpoint, copy `.env.example` to `.env` and set your own values.

```env
AI_PROVIDER=mock
AI_MODEL=gpt-5-mini
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=replace-me
```

Never commit real credentials.

## Design principles

1. **Business-first** — solve an operational problem, not just demonstrate an LLM.
2. **Structured outputs** — automation consumes typed data instead of fragile free-form text.
3. **Provider-agnostic** — business logic is not coupled to one AI vendor.
4. **Deterministic where possible** — routine classification and routing do not require a model call.
5. **Human review where it matters** — high-impact actions stay behind explicit confirmation points.
6. **No invented commitments** — generated proposal content must not fabricate pricing, delivery dates, credentials, client relationships, guarantees or contractual promises.
7. **Delivery-safe** — downstream events include stable idempotency and explicit review state.
8. **Safe defaults** — examples contain placeholders only and external writes are opt-in.

## Roadmap

- [x] Core TypeScript foundation
- [x] Deterministic lead qualification
- [x] Enquiry routing
- [x] Structured proposal brief generator
- [x] AI provider abstraction
- [x] OpenAI-compatible provider adapter
- [x] AI-enhanced proposal content with structured validation
- [x] Webhook / CRM handoff
- [x] HTTP API example
- [x] n8n integration example
- [x] Automated tests and CI
- [ ] Audit-friendly workflow result envelope
- [ ] Environment validation and configuration helper
- [ ] Additional provider and CRM examples

## Release history

See [`CHANGELOG.md`](CHANGELOG.md). The first public milestone is prepared as `v0.1.0`.

## Contributing

Contributions are welcome. Please open an issue before proposing large architectural changes and keep pull requests focused and testable.

## Security

Do not commit API keys, customer data, production credentials, private URLs or confidential business information. Use `.env` locally and keep only safe placeholders in `.env.example`.

## Maintainer

**Mohammed Mohsin**  
Founder & CEO, Implement Media Solutions Pvt Ltd  
[Website](https://implementmediasolutions.com) · [LinkedIn](https://www.linkedin.com/in/mohammed-mohsin-ims/)

## License

MIT — see [`LICENSE`](LICENSE).
