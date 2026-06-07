# Analytics Endpoint Contract

Purpose: define the expected contract for the optional endpoint behind `NEXT_PUBLIC_ANALYTICS_ENDPOINT`. A real endpoint is not enabled yet.

This contract does not govern Cloudflare-managed hosting analytics, edge logs, or injected hosting scripts.

## Endpoint Shape

| Field | Value |
|---|---|
| Method | `POST` |
| Content type | `application/json` |
| Auth | Public write endpoint or first-party proxy; no user account required in v1 |
| Response | `204 No Content` on accepted event |
| Environment variable | `NEXT_PUBLIC_ANALYTICS_ENDPOINT` |

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
- `evidence_ledger_view`
- `tool_page_view`
- `starter_pack_view`
- `search_console_launch_checklist_view`
- `ai_citation_readiness_view`
- `small_ai_visibility_metrics_view`
- `tool_started`
- `tool_completed`
- `tool_result_export`
- `cta_click`
- `source_link_click`
- `repo_skeleton_matrix_view`
- `ci_gate_matrix_view`
- `pseo_batch_audit_view`
- `pseo_index_map_view`
- `ai_metric_matrix_view`
- `review_window_view`
- `scoring_methodology_view`
- `scoring_model_limit_view`
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
| Request body over 8 KB | reject |
| Timestamp more than 24 hours old or 10 minutes in the future | reject |

## Storage Rules

| Item | Rule |
|---|---|
| Raw event retention | 90 days unless a shorter policy is selected |
| Aggregated weekly metrics | Keep while the site exists |
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
| `source_link_clicks` | Count by source href and path |
| `cta_clicks` | Count by label and target |

## Release Gate

Do not enable endpoint until:

- `checklists/monetization-compliance.md` passes for analytics.
- `/privacy/` describes endpoint collection.
- `npm run seo:ci` passes.
- A test event is accepted and visible in a non-production test table.
- A malformed event is rejected.
- A sensitive payload test is rejected.
- `npm run analytics:gate` passes.
