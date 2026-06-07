# Source Pack: Evidence Ledger

Status: first-party sources only.

## Purpose

This source pack defines which project records may support claims on `/evidence/`.

## Allowed Evidence Sources

| Source | File or command | Supported claim |
|---|---|---|
| Route registry | `docs/routes.json` | Current sitemap route count and route types |
| Page registry | `docs/page-registry.csv` | Page purpose, search intent, schema candidate, and review ownership |
| Technical SEO report | `reports/technical-seo-ci.md` | Local static route availability, canonical, metadata, JSON-LD, links, and mobile checks |
| Crawler audit report | `reports/crawler-access-audit.md` | Production crawler access status for intended search and retrieval crawlers |
| Search evidence report | `reports/search-evidence-import.md` | Whether GSC and Bing exports have been imported |
| Growth snapshot | `reports/growth-evidence-snapshot.md`, `data/growth-evidence-snapshot.csv` | Route-level evidence status and pending evidence |
| Update log | `lib/updateLog.ts`, `/updates/` | Deployment, IndexNow, CI, and verification chronology |
| GitHub Actions | `agentsiteops-ci` workflow run status | Whether automated release checks pass |

## Disallowed Claims Until Evidence Exists

- Guaranteed indexing.
- Guaranteed AI citation.
- Forced AI-search traffic.
- Organic traffic volume.
- Product-market fit.
- Revenue, payback, or conversion rate.
- Search-console performance that has not been exported or imported.

## Update Rule

Update `/evidence/`, this source pack, and the growth snapshot after any real GSC, Bing, referral, analytics, or revenue evidence is imported.
