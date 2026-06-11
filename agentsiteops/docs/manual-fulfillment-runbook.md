# Manual Fulfillment Runbook

This runbook keeps the first Launch Blueprint offer operable before there is an account system, checkout webhook, or customer dashboard.

## Source Files

- Public intake page: `/intake/`
- Public buy page: `/buy/`
- Local template: `data/manual-fulfillment-log-template.csv`
- Support email: `sun19980425s@gmail.com`

## Order Intake Rule

Create one row only after a payment or serious intake email arrives. Do not create fake customer rows.

Required fields:

- `order_id`: internal identifier such as `ASO-20260611-001`.
- `payment_status`: `pending`, `confirmed`, `duplicate`, or `refunded`.
- `paypal_reference`: PayPal transaction ID or receipt reference.
- `buyer_email`: delivery email for the manual artifact.
- `intake_status`: `missing`, `usable`, `unsafe`, or `needs_clarification`.
- `fit_status`: `strong_fit`, `possible_fit`, `not_ready`, or `blocked`.
- `scope_status`: `in_scope`, `narrowed`, or `out_of_scope`.
- `delivery_due_at`: 24-72 hour target after confirmed payment and usable intake.
- `delivery_status`: `not_started`, `in_progress`, `delivered`, or `paused`.
- `refund_status`: `not_requested`, `eligible`, `not_eligible`, or `processed`.

## Data Boundary

Do not store:

- Card numbers, bank details, passwords, API keys, account recovery details, or private customer lists.
- Regulated personal data unless a separate agreement and process exists.
- Full copies of confidential client material when a short description or public link is enough.

## Stop Rules

Pause or reject the order before work starts when:

- Payment cannot be matched to the intake.
- The buyer asks for guaranteed traffic, rankings, revenue, approvals, or platform safety.
- The project requires legal, medical, financial, tax, safety, or other regulated professional advice.
- Delivery would require unsafe automation, private account takeover, spam, or hidden scraping.

## Completion Rule

Mark `delivered` only when the buyer has received a document or link containing:

- One selected offer.
- Rejected alternatives and reasons.
- Target buyer and trigger.
- One-page landing structure.
- Pricing boundary.
- Outreach messages.
- Seven-day keep, repackage, or stop rule.
- Missing evidence ledger.
