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
| `tool_page_view` | `/tools/website-opportunity-scorer/` load | `path` |
| `starter_pack_view` | `/templates/starter-pack/` load | `path` |
| `repo_skeleton_matrix_view` | `/templates/seo-repo-skeleton/` load | `path` |
| `ci_gate_matrix_view` | `/templates/seo-repo-skeleton/` load | `path` |
| `search_console_launch_checklist_view` | `/checklists/gsc-bing-indexnow-launch/` load | `path` |
| `ai_citation_readiness_view` | `/checklists/ai-citation-readiness/` load | `path` |
| `pseo_batch_audit_view` | `/checklists/programmatic-seo-gate/` load | `path` |
| `pseo_index_map_view` | `/checklists/programmatic-seo-gate/` load | `path` |
| `small_ai_visibility_metrics_view` | `/guides/small-website-ai-visibility-metrics/` load | `path` |
| `ai_metric_matrix_view` | `/guides/ai-citation-grounding-metrics/` load | `path` |
| `review_window_view` | `/guides/ai-citation-grounding-metrics/` load | `path` |
| `evidence_ledger_view` | `/evidence/` load | `path` |
| `scoring_methodology_view` | `/methodology/website-opportunity-scoring/` load | `path` |
| `scoring_model_limit_view` | `/methodology/website-opportunity-scoring/` load | `path` |
| `trust_policy_view` | `/authors/`, `/editorial-policy/`, `/privacy/`, or `/disclosure/` load | `path` |
| `tool_started` | First scorer input, slider, or hard-blocker change | `tool`, `trigger`, `score`, `decision` |
| `tool_completed` | User copies or exports scorer result | `tool`, `export_method`, `score`, `decision` |
| `tool_result_export` | User copies or downloads scorer result | `tool`, `export_method`, `score`, `decision` |
| `template_copy_click` | User copies a template block | `label`, `length` |
| `checklist_copy_click` | User copies checklist content | `label`, `length` |
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
