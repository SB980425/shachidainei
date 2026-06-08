# Commercial Validation Gate

- Generated: 2026-06-08T00:17:08.236Z
- Status: pass
- Checks: 21
- Blockers: 0

## Summary

| Scope | Status | Detail |
|---|---|---|
| routes | pass | /tools/ai-crawler-readiness/ registered in docs/routes.json |
| app | pass | /tools/ai-crawler-readiness/ has app page |
| routes | pass | /examples/agentsiteops-self-audit/ registered in docs/routes.json |
| app | pass | /examples/agentsiteops-self-audit/ has app page |
| routes | pass | /services/ai-website-opportunity-audit/ registered in docs/routes.json |
| app | pass | /services/ai-website-opportunity-audit/ has app page |
| service_boundary | pass | service page states checkout is disabled |
| service_boundary | pass | service page blocks ranking and revenue promises |
| revenue_experiments | pass | audit price is intent test, not active checkout |
| revenue_experiments | pass | subscription remains blocked |
| compliance | pass | audit intent page has compliance boundary |
| compliance | pass | payment and account system remain absent |
| service_boundary | pass | no active checkout CTA copy in site data |
| readiness_tool | pass | readiness tool has 13 weighted checks; found 13 |
| readiness_tool | pass | readiness tool weights total 100 |
| readiness_tool | pass | tool states evidence boundary |
| mojibake | pass | components/CopyAction.tsx has no visible mojibake marker |
| mojibake | pass | components/AICrawlerReadinessTool.tsx has no visible mojibake marker |
| mojibake | pass | lib/site.ts has no visible mojibake marker |
| mojibake | pass | docs/site-brief.md has no visible mojibake marker |
| mojibake | pass | checklists/monetization-compliance.md has no visible mojibake marker |

## Blocking Issues

- None

## Interpretation

- This gate checks whether commercial pages remain in intent-test mode.
- It does not prove buyer demand, paid conversion, revenue, or product-market fit.
- Checkout remains blocked until identity, terms, refund policy, payment support, and first request evidence exist.
