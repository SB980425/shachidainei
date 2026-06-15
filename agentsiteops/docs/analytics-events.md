# Analytics Events

Status: first-party aggregate endpoint active through Cloudflare Pages Functions and KV.

## Purpose

The event layer records page and interaction events for release testing, exposure validation, and future 30/60/90 day reviews. Events are stored in browser memory and `sessionStorage`, then sent to `/api/events` as a first-party aggregate endpoint unless `NEXT_PUBLIC_ANALYTICS_ENDPOINT` overrides the target.

This file covers the first-party event layer only. Cloudflare-managed hosting analytics, edge logs, or injected hosting scripts are separate and must be reviewed through the privacy and compliance gate.

## Data Rules

- Do not collect email, phone, account ID, payment data, IP address, user agent, cookie ID, device fingerprint, or raw user text.
- Do not store full external URLs; source-link clicks keep only `source_host` and `source_path`.
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
| `start_page_view` | `/start/` load | `path` |
| `plan_studio_view` | `/plan/` load | `path` |
| `plan_example_loaded` | Plan Studio example button click | `label`, `type` |
| `plan_brief_copy` | Plan Studio copy brief button click | `label`, `type` |
| `plan_missing_field_focus` | Plan Studio missing-field focus button click | `field`, `missing_count`; click capture also records `label`, `type` |
| `plan_copy_continue` | Plan Studio copy-and-continue action | `copied`, `missing_count`, `readiness_score`; click capture also records `label`, `type` |
| `client_state_current_click` | Client Route State current-state link click | `label`, `type` |
| `client_state_next_click` | Client Route State next-state link click | `label`, `type` |
| `intake_saved_plan_detected` | Intake packet builder detects a browser-local Plan Studio brief | `length` |
| `how_it_works_view` | `/how-it-works/` load | `path` |
| `scope_lock_view` | `/scope/` load | `path` |
| `execution_workbench_view` | `/execution/` load | `path` |
| `operating_system_view` | `/ai-website-operating-system/` load | `path` |
| `tool_page_view` | `/tools/website-opportunity-scorer/` load | `path` |
| `ai_crawler_readiness_view` | `/tools/ai-crawler-readiness/` load | `path` |
| `sample_audit_view` | `/examples/agentsiteops-self-audit/` load | `path` |
| `fit_review_sample_view` | `/examples/fit-review-sample/` load | `path` |
| `ai_service_route_file_example_view` | `/examples/ai-service-route-file/` load | `path` |
| `blocked_intake_example_view` | `/examples/blocked-intake/` load | `path` |
| `audit_intent_page_view` | `/services/ai-website-opportunity-audit/` load | `path` |
| `audit_scope_builder_view` | `/tools/audit-scope-builder/` load | `path` |
| `launch_blueprint_fit_checker_view` | `/tools/launch-blueprint-fit-checker/` load | `path` |
| `route_file_fit_checker_view` | `/tools/launch-blueprint-fit-checker/` load | `path` |
| `route_confidence_checker_view` | `/tools/route-confidence-checker/` load | `path` |
| `starter_pack_view` | `/templates/starter-pack/` load | `path` |
| `repo_skeleton_matrix_view` | `/templates/seo-repo-skeleton/` load | `path` |
| `ci_gate_matrix_view` | `/templates/seo-repo-skeleton/` load | `path` |
| `content_quality_gate_view` | `/checklists/ai-content-quality-gate/` load | `path` |
| `search_console_launch_checklist_view` | `/checklists/gsc-bing-indexnow-launch/` load | `path` |
| `ai_citation_readiness_view` | `/checklists/ai-citation-readiness/` load | `path` |
| `launch_validation_decision_gate_view` | `/checklists/launch-validation-decision-gate/` load | `path` |
| `delivery_gate_alias_view` | `/delivery-gate/` load | `path` |
| `route_file_delivery_gate_view` | `/checklists/route-file-delivery-gate/` load | `path` |
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
| `route_basis_report_view` | `/reports/route-basis/` load | `path` |
| `agentsiteops_route_run_view` | `/reports/agentsiteops-route-run/` load | `path` |
| `client_route_workflow_view` | `/reports/client-route-workflow/` load | `path` |
| `route_evidence_filter_used` | User filters the route evidence dashboard | `filter_type`, `filter_value`, `has_query`, `visible_count` |
| `evidence_ledger_template_view` | `/templates/evidence-ledger-template/` load | `path` |
| `route_research_prompt_pack_view` | `/templates/route-research-prompt-pack/` load | `path` |
| `opportunity_scoring_template_view` | `/templates/website-opportunity-scoring-template/` load | `path` |
| `scoring_methodology_view` | `/methodology/website-opportunity-scoring/` load | `path` |
| `scoring_model_limit_view` | `/methodology/website-opportunity-scoring/` load | `path` |
| `route_selection_methodology_view` | `/methodology/route-selection/` load | `path` |
| `first_traffic_system_view` | `/guides/first-traffic-system/` load | `path` |
| `exposure_sprint_48h_view` | `/guides/48-hour-exposure-sprint/` load | `path` |
| `launch_kit_view` | `/launch-kit/` load | `path` |
| `answer_offer_validation_view` | `/answers/validate-ai-service-offer-before-building/` load | `path` |
| `answer_route_vs_chatgpt_view` | `/answers/ai-service-route-vs-generic-chatgpt/` load | `path` |
| `answer_stop_rule_view` | `/answers/when-to-stop-an-ai-website-idea/` load | `path` |
| `launch_blueprint_legacy_view` | `/website-opportunity-audit/` load | `path` |
| `route_file_service_view` | `/website-opportunity-audit/` load | `path` |
| `launch_blueprint_pricing_view` | `/pricing/` load | `path` |
| `route_file_pricing_view` | `/pricing/` load | `path` |
| `sample_route_file_view` | `/sample/` load | `path` |
| `launch_blueprint_compare_view` | `/compare/` load | `path` |
| `route_file_compare_view` | `/compare/` load | `path` |
| `starter_review_view` | `/starter-review/` load | `path` |
| `launch_blueprint_buy_view` | `/buy/` load | `path` |
| `route_file_buy_view` | `/buy/` load | `path` |
| `launch_blueprint_intake_view` | `/intake/` load | `path` |
| `route_file_intake_view` | `/intake/` load | `path` |
| `launch_blueprint_thank_you_view` | `/thank-you/` load | `path` |
| `route_file_thank_you_view` | `/thank-you/` load | `path` |
| `contact_page_view` | `/contact/` load | `path` |
| `trust_policy_view` | `/authors/`, `/editorial-policy/`, `/privacy/`, `/disclosure/`, `/terms/`, `/refund-policy/`, or `/disclaimer/` load | `path` |
| `tool_started` | First tool input, slider, evidence, or hard-blocker change | `tool`, `trigger`, `score`, `decision` |
| `tool_completed` | User copies or exports a tool result | `tool`, `export_method`, `score`, `decision` |
| `tool_result_export` | User copies or downloads a tool result | `tool`, `export_method`, `score`, `decision` |
| `template_copy_click` | User copies a template block | `label`, `length` |
| `checklist_copy_click` | User copies checklist content | `label`, `length` |
| `execution_stage_selected` | User selects an Execution Workbench stage | `surface`, `stage` |
| `execution_stage_status_changed` | User changes an Execution Workbench stage decision | `surface`, `stage`, `status` |
| `social_copy_variant_copied` | User copies an Execution Workbench social copy variant | `surface`, `channel`, `lang`, `variant` |
| `payment_cta_click` | User clicks a live PayPal Fit Review or Route File payment link | `label`, `target`, `type` |
| `intake_email_click` | User clicks the intake email link | `label`, `target`, `type` |
| `contact_email_click` | User clicks the contact email link | `label`, `target`, `type` |
| `cta_click` | Click on an element with `data-analytics-event` | `label`, `target`, `type` |
| `source_link_click` | Click on an external source link | `source_host`, `source_path`, `label` |

## Storage Locations

| Location | Purpose |
|---|---|
| `window.__codexAnalyticsEvents` | Current page debugging and browser verification |
| `sessionStorage["codex-seo-events"]` | Most recent 100 events in the current browser session |
| `/api/events` | First-party Cloudflare Pages Function that writes aggregate counters only |
| `/api/events/summary` | Public aggregate summary for exposure review; no visitor identity or raw payload data |
| `AGENTSITEOPS_ANALYTICS` | Cloudflare KV binding that stores event, path, event-path, and total counters |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional override for the default `/api/events` target |

## Endpoint Gate

Endpoint activation requirements:

- `/privacy/` describes the endpoint, payload, retention, and deletion boundary.
- `docs/analytics-endpoint-contract.md` has been implemented and tested.
- Sensitive payload tests are rejected.
- Unknown event names are rejected.
- `npm run analytics:gate`, `npm run seo:ci`, `npm run crawler:audit`, and `npm run growth:snapshot` pass.
