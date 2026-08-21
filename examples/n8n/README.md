# n8n Integration Example

This example shows how to connect n8n to the starter's HTTP API without embedding business rules inside the automation platform.

## Flow

```text
n8n Webhook
   ↓
POST /v1/enquiries/process
   ↓
Human review required?
   ├── yes → prepare review queue item
   └── no  → prepare CRM payload
   ↓
Webhook response
```

## Import

1. Start the API with `npm run dev:api`.
2. In n8n, import `enquiry-processing-workflow.json`.
3. Set `BUSINESS_AUTOMATION_API_URL` in the n8n environment if the default local URL is not appropriate.
4. Activate the workflow only after reviewing the webhook path and downstream actions.

Example API URL:

```text
http://host.docker.internal:3000/v1/enquiries/process
```

For a hosted API, use your HTTPS endpoint instead.

## Example webhook input

```json
{
  "subject": "AI automation enquiry",
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

## Production notes

The included workflow deliberately stops before writing to a real CRM. Replace the preparation nodes with your CRM, database, Slack, email, or ticketing integration after validating the payload. Keep credentials in n8n credentials or environment configuration rather than in the workflow JSON.

Use the returned `handoff.idempotencyKey` when writing to external systems so retries do not create duplicate records. Enquiries flagged with `requiresHumanReview` should remain behind an approval or review step.
