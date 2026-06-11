# Commercial Validation Gate

- Generated: 2026-06-11T06:29:55.032Z
- Status: pass
- Checks: 50
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
| routes | pass | /tools/audit-scope-builder/ registered in docs/routes.json |
| app | pass | /tools/audit-scope-builder/ has app page |
| routes | pass | /pricing/ registered in docs/routes.json |
| app | pass | /pricing/ has app page |
| routes | pass | /buy/ registered in docs/routes.json |
| app | pass | /buy/ has app page |
| routes | pass | /intake/ registered in docs/routes.json |
| app | pass | /intake/ has app page |
| routes | pass | /terms/ registered in docs/routes.json |
| app | pass | /terms/ has app page |
| routes | pass | /refund-policy/ registered in docs/routes.json |
| app | pass | /refund-policy/ has app page |
| routes | pass | /disclaimer/ registered in docs/routes.json |
| app | pass | /disclaimer/ has app page |
| routes | pass | /contact/ registered in docs/routes.json |
| app | pass | /contact/ has app page |
| payment_path | pass | live USD 99 PayPal link is configured |
| payment_path | pass | temporary USD 1 PayPal test link is configured |
| payment_path | pass | pricing page exposes payment test boundary |
| payment_path | pass | buy page exposes payment test boundary |
| service_boundary | pass | launch product blocks guarantee claims |
| service_boundary | pass | disclaimer blocks guarantee claims |
| trust_pages | pass | terms page covers PayPal payment path |
| trust_pages | pass | refund page exists and states refund boundary |
| revenue_experiments | pass | Launch Blueprint is recorded as live validation |
| revenue_experiments | pass | USD 1 test is recorded as temporary payment test |
| revenue_experiments | pass | subscription remains blocked |
| compliance | pass | current payment path has compliance boundary |
| compliance | pass | manual PayPal path is disclosed |
| compliance | pass | site does not collect card data |
| service_boundary | pass | launch copy avoids guarantee claims |
| readiness_tool | pass | readiness tool has 13 weighted checks; found 13 |
| readiness_tool | pass | readiness tool weights total 100 |
| readiness_tool | pass | tool states evidence boundary |
| audit_scope_builder | pass | scope builder states local-only boundary |
| audit_scope_builder | pass | scope builder blocks request-submission claim |
| audit_scope_builder | pass | scope page states no payment or account step |
| audit_scope_builder | pass | scope builder has no network submit or payment integration |
| mojibake | pass | components/CopyAction.tsx has no visible mojibake marker |
| mojibake | pass | components/AICrawlerReadinessTool.tsx has no visible mojibake marker |
| mojibake | pass | components/AuditScopeBuilder.tsx has no visible mojibake marker |
| mojibake | pass | lib/site.ts has no visible mojibake marker |
| mojibake | pass | docs/site-brief.md has no visible mojibake marker |
| mojibake | pass | checklists/monetization-compliance.md has no visible mojibake marker |

## Blocking Issues

- None

## Interpretation

- This gate checks whether the live manual PayPal path has visible scope, limits, refund, contact, and evidence boundaries.
- It does not prove buyer demand, paid conversion, revenue, or product-market fit.
- The USD 1 payment link is temporary verification only and should be removed after payment-path confirmation.
