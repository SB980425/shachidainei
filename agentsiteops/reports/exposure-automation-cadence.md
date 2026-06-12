# Exposure Automation Cadence

- Generated: 2026-06-12T02:09:00Z
- Automation ID: agentsiteops-48h-exposure-loop
- Status: ACTIVE
- Cadence: FREQ=HOURLY;INTERVAL=1
- Counts toward 48-hour continuation threshold: no

## Decision

The continuation cadence was updated from a short interval loop to one-hour execution blocks. Each continuation should refresh evidence, update the 48-hour decision state, record aggregate-only findings, and continue the next useful exposure task instead of stopping after a short status-only cycle.

## Boundary

- This is an operating cadence record only.
- It does not prove traffic, search impressions, clicks, qualified replies, confirmed payments, usable intake, objections, product-market fit, or revenue.
- Threshold evidence still comes only from the dedicated exposure evidence template and confirmed external platform or payment signals.
