# Analytics Endpoint Gate

- Generated: 2026-06-08T06:30:11.571Z
- Status: gate_ready_endpoint_disabled
- Endpoint enabled: no
- Test cases: 10
- Failed cases: 0

## Decision

- The local event buffer may remain active.
- A real analytics endpoint must not be enabled until this gate passes and the privacy page is updated for the selected endpoint, retention period, and deletion path.
- Current validation rejects unknown events, sensitive payloads, nested payload values, invalid paths, stale timestamps, future timestamps, external page URLs, and oversized bodies.

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

- Select the actual endpoint or first-party proxy.
- Define raw event retention and deletion path.
- Update `/privacy/` before production collection.
- Keep IP address, user agent, cookies, raw form text, email, phone, account IDs, and payment data out of the event table.
- Run `npm run analytics:gate`, `npm run seo:ci`, `npm run crawler:audit`, and `npm run growth:snapshot` before activation.
