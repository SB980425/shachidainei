# Analytics Plan

## Goal

Track whether AI/search traffic leads to useful actions, not just pageviews.

Current implementation:
- Event layer: `components/SiteAnalytics.tsx`.
- Event registry: `docs/analytics-events.md`.
- Weekly review template: `docs/weekly-review-template.md`.
- Fast validation cycle: `docs/fast-validation-cycle.md`.
- Baseline review report: `reports/weekly-growth-review.md`.
- Page action table: `data/page-review-actions.csv`.
- Production setup checklist: `docs/production-data-source-setup.md`.
- Endpoint contract: `docs/analytics-endpoint-contract.md`.
- Compliance gate: `checklists/monetization-compliance.md`.
- Launch readiness: `checklists/launch-readiness.md`.
- Performance budget: `docs/performance-budget.md`.
- Issue backlog: `docs/github-issues-ready.md`.
- Default storage: browser memory and `sessionStorage`.
- Optional endpoint: `NEXT_PUBLIC_ANALYTICS_ENDPOINT`.

## Required Dimensions

| Field | Purpose |
|---|---|
| `page_url` | Page identity |
| `page_type` | Compare home, pillar, tool, checklist, template, guide, methodology |
| `cluster_id` | Cluster-level performance |
| `template_id` | Template performance |
| `content_state` | draft, published, rewrite, merge, noindex, delete |
| `published_at` | Lifecycle analysis |
| `last_reviewed_at` | Maintenance |
| `source_medium` | Channel mix |
| `query_source` | GSC, Bing, AI Performance, direct, internal |

## Events

| Event | Trigger | Primary Pages |
|---|---|---|
| `tool_started` | User starts a local tool | Scorer, readiness tool, audit scope builder |
| `tool_completed` | User reaches or copies a local tool result | Scorer, readiness tool, audit scope builder |
| `tool_result_export` | User copies/downloads a tool result | Scorer, readiness tool, audit scope builder |
| `audit_scope_builder_view` | User opens the local audit scope builder | `/tools/audit-scope-builder/` |
| `template_copy_click` | User copies a template block | `/templates/seo-repo-skeleton/` |
| `template_download_click` | User downloads template file | `/templates/seo-repo-skeleton/` |
| `github_repo_click` | User clicks GitHub repo | Template/tool pages |
| `checklist_copy_click` | User copies checklist | Checklist pages |
| `checklist_expand` | User expands a checklist group | Checklist pages |
| `email_signup_submit` | User subscribes | Global |
| `internal_search_used` | User searches site | Future search UI |
| `source_link_click` | User opens source link | Guide/methodology pages |
| `update_log_view` | User opens the public update log | `/updates/` |
| `pseo_batch_audit_view` | User views pSEO batch audit rules | `/checklists/programmatic-seo-gate/` |
| `pseo_index_map_view` | User views index/noindex map | `/checklists/programmatic-seo-gate/` |
| `repo_skeleton_matrix_view` | User views repo directory matrix | `/templates/seo-repo-skeleton/` |
| `ci_gate_matrix_view` | User views technical SEO CI gate matrix | `/templates/seo-repo-skeleton/` |
| `ai_metric_matrix_view` | User views AI/search metric matrix | `/guides/ai-citation-grounding-metrics/` |
| `review_window_view` | User views 30/60/90 review rules | `/guides/ai-citation-grounding-metrics/` |
| `ai_search_robots_guide_view` | User views crawler policy separation | `/guides/ai-search-friendly-robots-txt/` |
| `indexnow_cloudflare_pages_view` | User views IndexNow deployment workflow | `/guides/indexnow-cloudflare-pages/` |
| `gsc_bing_sitemap_verification_view` | User views sitemap verification workflow | `/guides/gsc-bing-sitemap-verification/` |
| `evidence_ledger_template_view` | User views proof-boundary template | `/templates/evidence-ledger-template/` |
| `route_evidence_dashboard_view` | User views route-level evidence status | `/reports/route-evidence-dashboard/` |
| `opportunity_scoring_template_view` | User views candidate scorecard template | `/templates/website-opportunity-scoring-template/` |
| `scoring_methodology_view` | User views scoring fields and thresholds | `/methodology/website-opportunity-scoring/` |
| `scoring_model_limit_view` | User views model limits and update rules | `/methodology/website-opportunity-scoring/` |
| `trust_policy_view` | User views author/editorial/privacy/disclosure policy | Trust pages |
| `disclosure_source_click` | User opens FTC or disclosure source link | `/disclosure/` |

## Operational Quality Events

These are internal site operations, not user behavior events.

| Event | Trigger | Evidence |
|---|---|---|
| `technical_seo_ci_run` | `npm run seo:ci` executes | `reports/technical-seo-ci.md` |
| `technical_seo_ci_pass` | All sitemap routes pass with 0 blockers | Report summary and route table |
| `technical_seo_ci_blocker` | A route fails HTTP, metadata, canonical, JSON-LD, links, mojibake, noindex, or mobile overflow checks | Blocking Issues section |

## AI Search Measurement

Track separately when available:

- Bing AI citations.
- Bing grounding queries.
- Cited URLs.
- GSC clicks, impressions, CTR, average position.
- Server logs for known crawlers if available.
- Referral traffic from AI assistants when referrer is available.

## Fast Validation

Day 1-3:
- Local build, typecheck, SEO CI, launch checklist.

Day 4-7:
- Production crawl, sitemap submission, GSC/Bing verification.

Day 8-14:
- Index status, early impressions, crawler logs, event health.

Day 15-30:
- Page action table update and first rewrite/merge/noindex decisions.

## 60/90 Review

Day 60:
- Query breadth.
- CTR.
- Tool completion rate.
- Template copy/download rate.
- Source link clicks.
- Email or GitHub click rate.

Day 90:
- Keep/rewrite/merge/noindex/delete per page.
- Whether to add AI video prompt and camera motion library as second cluster.

## Privacy Boundary

- Do not track sensitive personal data.
- If email signup exists, privacy page must describe collection and unsubscribe path.
- If analytics uses cookies or advertising features, consent requirements must be reviewed before release.
