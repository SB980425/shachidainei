# Analytics Endpoint Gate

- Generated: 2026-06-18T15:34:30.938Z
- Status: gate_ready_endpoint_active
- Endpoint enabled: yes, first-party aggregate counters only
- Test cases: 10
- Failed cases: 0

## Decision

- The local event buffer remains active for browser verification.
- The production endpoint may remain active only while it stores aggregate counters and does not store raw events, visitor identifiers, account data, or payment data.
- Current validation rejects unknown events, sensitive payloads, nested payload values, invalid paths, stale timestamps, future timestamps, external page URLs, and oversized bodies.
- Current implementation checks require Cloudflare KV binding, first-party endpoint default, sanitized source-link payloads, aggregate summary output, daily total-key counting, privacy copy, and no raw event retention.

## Implementation Checks

| Check | Status | Detail |
|---|---|---|
| Cloudflare KV binding configured | pass | wrangler.toml includes the production analytics KV binding |
| frontend defaults to first-party endpoint | pass | SiteAnalytics sends production events to /api/events by default |
| frontend avoids full external URL payloads | pass | source-link events store source host and path instead of full href |
| write endpoint uses aggregate KV counters | pass | /api/events writes aggregate event, path, event-path, and total counters |
| summary endpoint returns aggregate-only fields | pass | /api/events/summary exposes counts only |
| daily summary uses total keys only | pass | counts_by_day is not inflated by event, path, and event-path keys |
| privacy page describes aggregate endpoint | pass | /privacy/ copy matches the endpoint behavior |
| analytics docs describe active aggregate endpoint | pass | analytics event registry matches production collection |
| endpoint contract forbids raw event retention | pass | endpoint contract blocks raw event retention |

## Test Results

| Case | Expected | Actual | Status | Reason |
|---|---|---|---|---|
| valid tool_completed event | accept | accept | pass | accepted |
| unknown event rejected | reject | reject | pass | unknown event name |
| nested payload rejected | reject | reject | pass | payload value must be string, number, boolean, or null |
| sensitive email payload rejected | reject | reject | pass | email-like payload value rejected |
| sensitive key rejected | reject | reject | pass | sensitive payload key rejected: email |
| old timestamp rejected | reject | reject | pass | timestamp older than 24 hours |
| future timestamp rejected | reject | reject | pass | timestamp more than 10 minutes in the future |
| invalid path rejected | reject | reject | pass | path must start with slash |
| external page url rejected | reject | reject | pass | page_url origin is not allowed |
| large body rejected | reject | reject | pass | request body over 8 KB |

## Required Before Activation

- Keep the actual endpoint first-party unless a new privacy and compliance review passes.
- Do not add raw event retention without a new privacy review and gate update.
- Keep IP address, user agent, cookies, raw form text, full external URLs, email, phone, account IDs, and payment data out of the event table.
- Run `npm run analytics:gate`, `npm run seo:ci`, `npm run crawler:audit`, and `npm run growth:snapshot` before activation.
