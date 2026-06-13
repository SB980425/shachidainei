# Launch Funnel Evidence Runbook

This runbook defines how AgentSiteOps should judge the USD 29 Fit Review and USD 99 Research-to-Route File offers without pretending that page views equal demand.

## Current State

- The browser event layer is local/session-only unless `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is configured.
- No real analytics endpoint is enabled.
- PayPal clicks are not the same as confirmed payments.
- Intake emails are not the same as qualified buyers.
- Fit Review payments are not proof that the full Route File should be expanded.
- GSC and Bing exports are still pending.

## Template

Use `data/launch-funnel-evidence-template.csv` for aggregate review only.

Do not store:

- Email addresses.
- Phone numbers.
- Payment identifiers.
- IP addresses.
- Cookie IDs.
- Raw buyer messages.
- Private project details.

## Funnel Stages

| Stage | Evidence | Interpretation |
|---|---|---|
| Fit checker completion | `tool_completed` on `/tools/launch-blueprint-fit-checker/` | The visitor can produce a fit result. |
| Sample inspection | `/sample/` view or session export | The visitor inspected what the artifact looks like. |
| Alternative comparison | `/compare/` view | The visitor saw when not to buy. |
| Fit Review view | `/starter-review/` view | The visitor inspected the lower-friction paid filter. |
| Payment intent | `payment_cta_click` | The visitor opened PayPal, but payment is unconfirmed. Keep Fit Review and full Blueprint labels separate. |
| Intake intent | `intake_email_click` or manual email | The visitor tried to send details. |
| Confirmed payment | PayPal record outside repo | The only direct revenue evidence. |
| Qualified order | Payment plus usable intake | The first evidence that fulfillment can start. |
| Review verdict | Manual go, narrow, or stop count | Shows whether Fit Review buyers are actually ready for the full Blueprint. |

## Decision Rules

- Keep price and copy only if confirmed payments or qualified order evidence exists.
- Rewrite the offer if fit checker completion happens but sample, compare, pricing, or buy movement is weak.
- Keep the Fit Review only if it produces confirmed payments plus usable intake or clear stop/narrow verdicts that prevent larger wrong-fit orders.
- Keep the full Blueprint at USD 99 only if Fit Review verdicts, direct payments, or qualified intake show enough readiness for full delivery.
- Stop or pivot if manual outreach produces no qualified replies after a defined outreach batch.
- Do not add subscriptions until repeat demand, delivery capacity, and support load are proven.

## Weekly Review

Each review should answer:

1. Which stage has evidence.
2. Which stage is missing.
3. Whether the missing stage is a traffic problem, trust problem, pricing problem, or fulfillment problem.
4. What page, offer, price, or outreach change will be tested next.
