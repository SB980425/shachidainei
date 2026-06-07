# Payment Channel Hold

Date: 2026-06-07
Status: blocked by legal payout availability

## Decision

Stripe and Lemon Squeezy are not production blockers for the website. Payment integration is paused until a real supported legal entity, payout country, bank account, tax profile, and identity verification path are available.

## Current Rule

- Do not select a false country or region to pass payment onboarding.
- Do not publish paid checkout buttons until the payment provider account is verified.
- Do not collect customer payment or personal data through an improvised form.
- Do not add a paid product claim before fulfillment files and refund policy are ready.

## Allowed While Payments Are Paused

- Publish free templates.
- Publish product landing pages without checkout.
- Track search indexing and page engagement.
- Prepare paid product files privately.
- Use a plain "payment provider pending" internal status.

## Next Payment Decision

Reopen payment integration only when a supported payout route exists. Candidate routes must be checked against provider documentation and real owner details before account creation.
