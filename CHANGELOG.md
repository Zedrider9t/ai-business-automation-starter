# Changelog

All notable changes to this project are documented here.

The project follows semantic versioning for public releases.

## [0.1.0] - 2026-08-21

### Added

- Deterministic lead qualification with temperature and recommended action
- Enquiry classification, priority detection and queue routing
- Structured proposal brief generation with discovery questions and assumptions
- Optional provider-agnostic AI proposal enhancement with strict JSON validation
- Safeguards against invented pricing, guarantees and delivery commitments
- Versioned webhook / CRM handoff payloads with idempotency keys
- Native Node.js HTTP API example
- Importable n8n workflow example
- Mock and OpenAI-compatible AI provider adapters
- Automated TypeScript validation and test coverage through GitHub Actions
- Branch-protected pull-request workflow for `main`

### Security

- Secrets are configured through environment variables only
- Public examples use placeholder data and no production credentials
- External webhook delivery remains explicit rather than automatic
