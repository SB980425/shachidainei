# Analytics Events

Status: local event layer active; real endpoint disabled until privacy and storage review.

## Purpose

The event layer records page and interaction events for release testing and future 30/60/90 day reviews. By default, events are stored only in browser memory and `sessionStorage`. Events are sent to a real endpoint only when `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is configured.

This file covers the first-party event layer only. Cloudflare-managed hosting analytics, edge logs, or injected hosting scripts are separate and must be reviewed through the privacy and compliance gate.

## Data Rules

- Do not collect email, phone, account ID, payment data, IP address, cookie ID, device fingerprint, or raw user text.
- Payload values may only be strings, numbers, booleans, or null.
- Payload keys are truncated to 64 characters.
- Payload strings are truncated to 200 characters.
- The browser keeps the most recent 100 events per session.
- Events support page review decisions; they are not used to manipulate clicks or rankings.

## Current Events

| Event | Trigger | Payload |
|---|---|---|
| `page_view` | Any route load | `path` |
| `update_log_view` | `/updates/` load | `path` |
| `operating_system_view` | `/ai-website-operating-system/` load | `path` |
| `tool_page_view` | `/tools/website-opportunity-scorer/` load | `path` |
| `ai_crawler_readiness_view` | `/tools/ai-crawler-readiness/` load | `path` |
| `sample_audit_view` | `/examples/agentsiteops-self-audit/` load | `path` |
| `fit_review_sample_view` | `/examples/fit-review-sample/` load | `path` |
| `audit_intent_page_view` | `/services/ai-website-opportunity-audit/` load | `path` |
| `audit_scope_builder_view` | `/tools/audit-scope-builder/` load | `path` |
| `launch_blueprint_fit_checker_view` | `/tools/launch-blueprint-fit-checker/` load | `path` |
| `starter_pack_view` | `/templates/starter-pack/` load | `path` |
| `repo_skeleton_matrix_view` | `/templates/seo-repo-skeleton/` load | `path` |
| `ci_gate_matrix_view` | `/templates/seo-repo-skeleton/` load | `path` |
| `content_quality_gate_view` | `/checklists/ai-content-quality-gate/` load | `path` |
| `search_console_launch_checklist_view` | `/checklists/gsc-bing-indexnow-launch/` load | `path` |
| `ai_citation_readiness_view` | `/checklists/ai-citation-readiness/` load | `path` |
| `launch_validation_decision_gate_view` | `/checklists/launch-validation-decision-gate/` load | `path` |
| `pseo_batch_audit_view` | `/checklists/programmatic-seo-gate/` load | `path` |
| `pseo_index_map_view` | `/checklists/programmatic-seo-gate/` load | `path` |
| `ai_search_robots_guide_view` | `/guides/ai-search-friendly-robots-txt/` load | `path` |
| `indexnow_cloudflare_pages_view` | `/guides/indexnow-cloudflare-pages/` load | `path` |
| `gsc_bing_sitemap_verification_view` | `/guides/gsc-bing-sitemap-verification/` load | `path` |
| `small_ai_visibility_metrics_view` | `/guides/small-website-ai-visibility-metrics/` load | `path` |
| `ai_metric_matrix_view` | `/guides/ai-citation-grounding-metrics/` load | `path` |
| `review_window_view` | `/guides/ai-citation-grounding-metrics/` load | `path` |
| `evidence_ledger_view` | `/evidence/` load | `path` |
| `route_evidence_dashboard_view` | `/reports/route-evidence-dashboard/` load | `path` |
| `route_evidence_filter_used` | User filters the route evidence dashboard | `filter_type`, `filter_value`, `has_query`, `visible_count` |
| `evidence_ledger_template_view` | `/templates/evidence-ledger-template/` load | `path` |
| `opportunity_scoring_template_view` | `/templates/website-opportunity-scoring-template/` load | `path` |
| `scoring_methodology_view` | `/methodology/website-opportunity-scoring/` load | `path` |
| `scoring_model_limit_view` | `/methodology/website-opportunity-scoring/` load | `path` |
| `route_selection_methodology_view` | `/methodology/route-selection/` load | `path` |
| `first_traffic_system_view` | `/guides/first-traffic-system/` load | `path` |
| `exposure_sprint_48h_view` | `/guides/48-hour-exposure-sprint/` load | `path` |
| `launch_blueprint_legacy_view` | `/website-opportunity-audit/` load | `path` |
| `launch_blueprint_pricing_view` | `/pricing/` load | `path` |
| `launch_blueprint_sample_view` | `/sample/` load | `path` |
| `launch_blueprint_compare_view` | `/compare/` load | `path` |
| `starter_review_view` | `/starter-review/` load | `path` |
| `launch_blueprint_buy_view` | `/buy/` load | `path` |
| `launch_blueprint_intake_view` | `/intake/` load | `path` |
| `launch_blueprint_thank_you_view` | `/thank-you/` load | `path` |
| `contact_page_view` | `/contact/` load | `path` |
| `trust_policy_view` | `/authors/`, `/editorial-policy/`, `/privacy/`, `/disclosure/`, `/terms/`, `/refund-policy/`, or `/disclaimer/` load | `path` |
| `tool_started` | First tool input, slider, evidence, or hard-blocker change | `tool`, `trigger`, `score`, `decision` |
| `tool_completed` | User copies or exports a tool result | `tool`, `export_method`, `score`, `decision` |
| `tool_result_export` | User copies or downloads a tool result | `tool`, `export_method`, `score`, `decision` |
| `template_copy_click` | User copies a template block | `label`, `length` |
| `checklist_copy_click` | User copies checklist content | `label`, `length` |
| `payment_cta_click` | User clicks the live PayPal Launch Blueprint payment link | `label`, `target`, `type` |
| `intake_email_click` | User clicks the intake email link | `label`, `target`, `type` |
| `contact_email_click` | User clicks the contact email link | `label`, `target`, `type` |
| `cta_click` | Click on an element with `data-analytics-event` | `label`, `target`, `type` |
| `source_link_click` | Click on an external source link | `href`, `label` |

## Storage Locations

| Location | Purpose |
|---|---|
| `window.__codexAnalyticsEvents` | Current page debugging and browser verification |
| `sessionStorage["codex-seo-events"]` | Most recent 100 events in the current browser session |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional real collection endpoint; not configured by default |

## Endpoint Gate

Do not enable a real endpoint until:

- `/privacy/` describes the endpoint, payload, retention, and deletion boundary.
- `docs/analytics-endpoint-contract.md` has been implemented and tested.
- Sensitive payload tests are rejected.
- Unknown event names are rejected.
- `npm run analytics:gate`, `npm run seo:ci`, `npm run crawler:audit`, and `npm run growth:snapshot` pass.
