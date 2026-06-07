# Commercial Validation Gates

Date: 2026-06-07

## Purpose

This file converts commercial uncertainty into phase gates. It exists to prevent cost expansion before evidence exists.

## Gate 0: Production Identity

Required before launch:

- Real domain.
- Production host.
- Real owner or organization identity.
- Public contact path.
- Production `siteUrl`.
- GSC and Bing ownership path.

Blocked actions:

- Paid products.
- Ads.
- Affiliate links.
- Email capture.
- Payment forms.

## Gate 1: Crawl And Index

Target window: day 4-7 after production launch.

Required evidence:

- Production URL returns 200.
- Sitemap submitted.
- Robots and canonical point to production domain.
- Technical SEO CI passes against production.
- GSC/Bing can verify ownership.

Allowed action:

- Add non-payment audit intent copy.
- Continue technical fixes.

Blocked action:

- Do not add paid checkout.
- Do not scale pages.

## Gate 2: Behavior Signal

Target window: day 8-14.

Required evidence:

- Tool completion event.
- Template copy or download event.
- Source link click.
- GitHub click or repo interest if public repo exists.

Allowed action:

- Add request-audit page or manual contact CTA after compliance review.

Blocked action:

- Do not assume revenue potential from page views alone.

## Gate 3: Commercial Intent

Target window: day 15-30.

Required evidence:

- One audit request, waitlist signup, direct inquiry, GitHub issue, or explicit buying signal.

Allowed action:

- Prepare payment processor.
- Draft refund policy and service terms.
- Test USD 99 audit offer manually.

Blocked action:

- Do not build SaaS.
- Do not buy expensive SEO tools for more than one focused research month.

## Gate 4: Revenue

Target window: after first explicit buying signal.

Required evidence:

- Payment path is compliant.
- Owner identity and tax/payment account are ready.
- Refund and delivery rules are written.

Allowed action:

- Sell manual audit.
- Track delivery time and customer outcome.

Stop condition:

- If 30 days pass with no index, no behavior signal, and no commercial intent, stop expansion and reduce the project to domain-only maintenance.

