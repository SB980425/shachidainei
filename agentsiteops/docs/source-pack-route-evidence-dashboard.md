# Source Pack: Route Evidence Dashboard

Status: first-party generated evidence source.

## Purpose

This source pack defines which records support claims on `/reports/route-evidence-dashboard/`.

## Supported Claims

| Claim | Source | Status |
|---|---|---|
| Route count and route labels | `docs/routes.json`, `docs/page-registry.csv` | Supported after `npm run growth:snapshot` |
| Technical SEO status | `reports/technical-seo-ci.md` | Supported after local or production SEO CI run |
| Crawler access status | `reports/crawler-access-audit.md` | Supported after crawler audit run |
| Search evidence status | `reports/search-evidence-import.md`, `data/search-evidence-normalized.csv` | Pending until GSC and Bing exports are available |
| Route-level action and next evidence | `data/page-review-actions.csv`, `data/growth-evidence-snapshot.csv` | Supported by route review action table and snapshot |
| Public dashboard rendering | `app/reports/route-evidence-dashboard/page.tsx` | Supported by static page reading the snapshot |

## Disallowed Claims

- The dashboard proves pages are indexed.
- The dashboard proves AI systems cite the site.
- The dashboard proves traffic, conversions, customers, or revenue.
- The dashboard replaces GSC, Bing Webmaster Tools, server logs, analytics exports, or payment records.

## Update Rule

Regenerate `data/growth-evidence-snapshot.csv` and `reports/growth-evidence-snapshot.md` after every route batch, production deployment, search evidence import, crawler audit, or page action decision update.
