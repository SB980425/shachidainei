# AgentSiteOps Self-Score Maintenance Protocol

Status: active governance protocol.

## Purpose

The public self-score exists to prevent technical launch readiness from being mistaken for search demand, AI visibility, payment demand, or product-market validation.

The current public score is `52/100`. It must not increase unless first-party evidence changes.

## Score Dimensions

| Dimension | Weight | Current score | Increase requires |
|---|---:|---:|---|
| Technical foundation | 20 | 92 | New release gates remain passing after route, policy, or infrastructure changes. |
| Search evidence | 15 | 15 | Imported first-party GSC or Bing export rows from a defined date window. |
| AI visibility readiness | 15 | 45 | Confirmed crawler logs, AI referral examples, Bing AI Performance data, or repeatable citation evidence. |
| Product clarity | 20 | 68 | Qualified buyer feedback showing the offer, sample, objections, and intake are understood. |
| Commercial validation | 20 | 18 | Confirmed payment plus usable intake, qualified order, or delivered buyer artifact. |
| Delivery readiness | 10 | 70 | Completed real delivery using the checklist, with no sensitive data stored publicly. |

## Update Rules

- Do not raise the overall score from pageviews, sitemap success, IndexNow success, crawler access, generic praise, or private confidence.
- Do not raise the commercial validation score from PayPal clicks without confirmed payment and usable intake.
- Do not raise the search evidence score from third-party estimates, screenshots without export rows, or missing GSC/Bing files.
- Decrease a score immediately when a gate fails, a claim is no longer supported, a payment path breaks, or a privacy/commercial boundary becomes inaccurate.
- Keep dimension weights fixed until a public methodology update explains the change.
- Record every score change in `data/self-score-change-log-template.csv` before updating public copy.

## Required Evidence Packet

Each score change needs:

- Date.
- Dimension.
- Previous score.
- New score.
- Evidence source.
- Date window.
- Threshold crossed.
- Public claim affected.
- Next action.

Do not store names, emails, payment identifiers, raw private replies, account screenshots, bank details, cookies, IP addresses, or API keys in public files.

## Release Checks

Before publishing a score change:

1. Update `data/agentsiteops-self-score-2026-06-11.csv` or a dated successor file.
2. Update the public evidence ledger and self-audit copy.
3. Run code quality, commercial validation, route consistency, build, technical SEO, crawler audit, and growth snapshot.
4. Deploy.
5. Run production health and IndexNow.
6. Record the change in the run log and public update log.
