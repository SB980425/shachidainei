# First-Party Evidence Plan

Date: 2026-06-07
Status: active operating plan

## Decision

AgentSiteOps should collect first-party evidence before scaling content or paying for AI visibility monitoring.

## Evidence Sources

| Source | Current state | Required output | Decision it supports |
|---|---|---|---|
| Technical SEO CI | Active | `reports/technical-seo-ci.md` | Whether a route batch is releasable |
| Crawler access audit | Active | `reports/crawler-access-audit.md` | Whether intended search and retrieval crawlers can reach the site |
| Growth snapshot | Active | `data/growth-evidence-snapshot.csv`, `reports/growth-evidence-snapshot.md` | Which routes still lack data |
| Google Search Console | Verified, export pending | Queries, pages, impressions, clicks, CTR, index status | Day 30 search discovery review |
| Bing Webmaster Tools | Verified/submitted, export pending | Queries, pages, impressions, clicks, AI Performance fields when available | Bing and AI grounding review |
| Semrush trial | Optional, short window only | Prompt clusters, SERP gaps, keyword clusters, competitor feature claims | Page backlog and positioning, not revenue proof |
| Onsite analytics endpoint | Not enabled | Page events, scorer completion, copy actions, source clicks | Human continuation proof |
| Payment or lead channel | Not enabled | Paid order, lead, or download-to-contact event | Monetization proof |

## Weekly Evidence Order

1. Run `npm run seo:ci`.
2. Run `npm run crawler:audit`.
3. Run `npm run growth:snapshot`.
4. Export GSC data when available.
5. Export Bing data when available.
6. Add Semrush trial exports only if the trial window is active.
7. Update `data/page-review-actions.csv`.
8. Decide keep, rewrite, merge, noindex, delete, continue, pivot, or stop.

## Do Not Do Yet

- Do not renew Semrush before first-party evidence identifies a paid-monitoring need.
- Do not add a large content batch before Day 30 search and crawler evidence.
- Do not add payment collection before a supported legal payout route exists.
- Do not enable real analytics collection before the privacy and endpoint gates pass.

## Minimum Day 30 Decision Inputs

| Input | Required before content scale |
|---|---|
| Sitemap status | GSC and Bing sitemap accepted or issue logged |
| Index coverage | Sample route statuses checked |
| Query breadth | GSC/Bing query export reviewed |
| Crawler access | `crawler:audit` pass |
| Technical SEO | `seo:ci` pass |
| Human continuation | Event endpoint or manual evidence path defined |
