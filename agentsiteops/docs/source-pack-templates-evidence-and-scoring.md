# Source Pack: Evidence and Scoring Templates

Date: 2026-06-08
Status: source pack for `/templates/evidence-ledger-template/` and `/templates/website-opportunity-scoring-template/`

## First-Party Sources

| Source | Path | Use in AgentSiteOps |
|---|---|---|
| Evidence Ledger page | `lib/site.ts` route `/evidence/` | Defines verified, pending, import, and not-claimed proof boundaries. |
| Website Opportunity Scoring Methodology | `lib/site.ts` route `/methodology/website-opportunity-scoring/` | Defines score thresholds, blockers, and limitations. |
| Opportunity scorecard | `data/opportunity-scorecard.csv` | Records the project candidate scoring structure. |
| Page review actions | `data/page-review-actions.csv` | Defines keep, rewrite, merge, noindex, and expansion decisions per route. |
| Growth evidence snapshot | `scripts/growth-evidence-snapshot.mjs` | Converts route, registry, search, and report status into evidence rows. |
| Search evidence import contract | `docs/search-evidence-imports.md` | Defines how GSC and Bing exports are normalized before claims change. |

## Claims Allowed

- A scoring template can reduce build-time uncertainty but cannot forecast traffic or revenue.
- An evidence ledger can separate verified, pending, inferred, stale, blocked, and not-claimed signals.
- Route expansion should depend on first-party evidence or explicit review decisions.
- Hard blockers include copied content, unsupported YMYL advice, unclear data rights, unsupported payment flow, and keyword-only pages.

## Claims Not Allowed

- Do not claim the template proves a website will succeed.
- Do not claim a score above 70 guarantees traffic, indexing, AI citation, conversion, or revenue.
- Do not claim evidence exists before a report, export, log, request, or payment record supports it.
