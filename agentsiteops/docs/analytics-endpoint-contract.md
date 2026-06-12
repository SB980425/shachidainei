# Analytics Endpoint Contract

Purpose: define the production contract for the first-party aggregate endpoint behind `/api/events`. `NEXT_PUBLIC_ANALYTICS_ENDPOINT` can override the target, but the default production path is first-party.

This contract does not govern Cloudflare-managed hosting analytics, edge logs, or injected hosting scripts.

## Endpoint Shape

| Field | Value |
|---|---|
| Write method | `POST /api/events` |
| Read method | `GET /api/events/summary?days=2` |
| Content type | `application/json` |
| Auth | Public write endpoint or first-party proxy; no user account required in v1 |
| Write response | `204 No Content` on accepted event |
| Storage binding | `AGENTSITEOPS_ANALYTICS` Cloudflare KV |
| Environment variable | Optional `NEXT_PUBLIC_ANALYTICS_ENDPOINT` override |

## Accepted Payload

```json
{
  "name": "tool_completed",
  "payload": {
    "tool": "website_opportunity_scorer",
    "score": 82.5,
    "decision": "proceed",
    "export_method": "copy"
  },
  "page_url": "https://agentsiteops.com/tools/website-opportunity-scorer/",
  "path": "/tools/website-opportunity-scorer/",
  "timestamp": "2026-06-06T00:00:00.000Z"
}
```

## Accepted Events

Use the registry in `docs/analytics-events.md` as the allowlist.

Minimum v1 allowlist:

- `page_view`
- `update_log_view`
- `operating_system_view`
- `evidence_ledger_view`
- `tool_page_view`
- `ai_crawler_readiness_view`
- `sample_audit_view`
- `fit_review_sample_view`
- `audit_intent_page_view`
- `audit_scope_builder_view`
- `launch_blueprint_fit_checker_view`
- `starter_pack_view`
- `search_console_launch_checklist_view`
- `ai_citation_readiness_view`
- `small_ai_visibility_metrics_view`
- `tool_started`
- `tool_completed`
- `tool_result_export`
- `payment_cta_click`
- `cta_click`
- `source_link_click`
- `repo_skeleton_matrix_view`
- `ci_gate_matrix_view`
- `content_quality_gate_view`
- `pseo_batch_audit_view`
- `pseo_index_map_view`
- `ai_search_robots_guide_view`
- `indexnow_cloudflare_pages_view`
- `gsc_bing_sitemap_verification_view`
- `ai_metric_matrix_view`
- `review_window_view`
- `evidence_ledger_template_view`
- `route_evidence_dashboard_view`
- `route_evidence_filter_used`
- `opportunity_scoring_template_view`
- `scoring_methodology_view`
- `scoring_model_limit_view`
- `launch_blueprint_compare_view`
- `launch_blueprint_pricing_view`
- `launch_blueprint_sample_view`
- `launch_blueprint_buy_view`
- `launch_blueprint_intake_view`
- `starter_review_view`
- `intake_email_click`
- `contact_email_click`
- `trust_policy_view`

## Validation Rules

| Rule | Decision |
|---|---|
| Unknown event name | reject |
| Missing `name`, `path`, or `timestamp` | reject |
| `path` does not start with `/` | reject |
| `payload` contains object, array, or function | reject |
| Payload key longer than 64 chars | reject or truncate before storage |
| Payload string longer than 200 chars | reject or truncate before storage |
| Email, phone, account id, payment data, IP, raw user text, cookie id, or device fingerprint | reject |
| Full external URL storage | not allowed; source clicks store host and path only |
| Request body over 8 KB | reject |
| Timestamp more than 24 hours old or 10 minutes in the future | reject |

## Storage Rules

| Item | Rule |
|---|---|
| Raw event retention | Do not store raw events in KV |
| Aggregated counters | Keep while the site exists or until manually purged |
| IP address | Do not store in event table |
| User agent | Do not store in event table in v1 |
| Session id | Do not add until privacy and consent are reviewed |
| Deletion path | Define before adding accounts, email, forms, or user identifiers |

## Weekly Aggregates

The endpoint or downstream job should produce:

| Metric | Definition |
|---|---|
| `page_views` | Count of `page_view` by path |
| `tool_started` | Count of tool start events |
| `tool_completed` | Count of completed scorer result events |
| `tool_completion_rate` | `tool_completed / tool_started` where denominator > 0 |
| `tool_result_export` | Count of copy/download actions |
| `source_link_clicks` | Count source-link click events without storing the full source URL |
| `cta_clicks` | Count by label and target |

## Public Summary

`GET /api/events/summary?days=2` returns aggregate counts only:

- `counts_by_event`
- `counts_by_path`
- `counts_by_day`
- `counts_by_event_path`
- `threshold_snapshot.sample_view_count`
- `threshold_snapshot.source_link_click_count`
- `threshold_snapshot.paypal_click_count`

The summary does not return IP address, user agent, cookie id, account id, email, phone, raw form text, full external URL, payment data, or individual events.

## Release Gate

Endpoint release gate:

- `checklists/monetization-compliance.md` passes for analytics.
- `/privacy/` describes endpoint collection.
- `npm run seo:ci` passes.
- A test event is accepted and visible in aggregate summary output.
- A malformed event is rejected.
- A sensitive payload test is rejected.
- `npm run analytics:gate` passes.
