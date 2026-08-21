# AI Business Automation Starter

A practical, provider-agnostic TypeScript starter for building AI-assisted business workflows such as lead qualification, enquiry routing, proposal preparation, CRM handoff, and operational automation.

> **Status:** Active public foundation. Core TypeScript setup, lead qualification, enquiry routing, structured proposal briefs, tests, CI, and the first provider abstraction are in place.

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
- Shared typed workflow contracts
- Provider-agnostic AI interface
- Mock AI provider for local development and tests
- OpenAI-compatible chat-completions adapter using `fetch`
- Safe `.env.example` provider configuration
- Automated tests and GitHub Actions CI

## Planned modules

- AI-enhanced proposal content
- Structured AI outputs
- CRM / webhook handoff examples
- n8n-friendly endpoints and payloads
- Audit-friendly workflow results
- Environment validation and safe secret handling
- API examples

## Design principles

1. **Business-first:** workflows should solve an operational problem, not just demonstrate an LLM.
2. **Structured outputs:** automation should consume typed data rather than fragile free-form text.
3. **Provider-agnostic:** core business logic should not depend on a single AI vendor.
4. **Safe defaults:** secrets stay in environment variables and examples use non-sensitive demo data.
5. **Human review where it matters:** high-impact actions should be easy to place behind approval gates.
6. **Composable:** modules should be usable from a CLI, API route, worker, webhook, or automation platform.
7. **No invented commitments:** proposal briefs do not fabricate pricing, delivery dates, credentials or contractual promises.

## Architecture

```text
src/
├── core/          # shared types and workflow contracts
├── modules/       # lead qualification, enquiry routing and proposal briefs
├── providers/     # AI provider contracts and adapters
└── index.ts       # runnable demo entry point
```

## Proposal brief flow

```text
Lead enquiry
   ↓
Lead qualification
   ↓
Enquiry classification / routing
   ↓
Structured proposal brief
   ↓
Human discovery / confirmed scope
```

The proposal brief generator produces typed business context including category, priority, lead score, suggested scope, discovery questions, assumptions, complexity and the recommended next action. It deliberately avoids inventing final pricing or delivery commitments from incomplete enquiry data.

## Quick start

```bash
npm install
npm run typecheck
npm test
npm run dev
```

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
- [ ] AI-enhanced proposal content
- [ ] Webhook example
- [ ] API example
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
