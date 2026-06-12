# 48-Hour Exposure Runbook

Status: active sprint plan for AgentSiteOps exposure validation.

## Objective

Create the first measurable exposure signals within 48 hours without fake traffic, automated direct messages, artificial voting, or unsupported revenue claims.

## Hard Boundaries

- Do not promise traffic, rankings, AI citations, revenue, customers, or payback.
- Do not automate DMs, fake Q&A, link-dump into communities, or ask for artificial upvotes.
- Do not store names, emails, handles, payment identifiers, or private replies in the public repo.
- Do not treat sitemap success, IndexNow success, crawler access, pageviews, or PayPal clicks as revenue.
- Use aggregate counts only for public records.

## Assets To Use

| Asset | URL | Use |
|---|---|---|
| 48-hour sprint | `/guides/48-hour-exposure-sprint/` | Explain the current exposure run and stop rules. |
| Route method | `/methodology/route-selection/` | Explain how route recommendations are selected. |
| First traffic system | `/guides/first-traffic-system/` | Explain channels and signal hierarchy. |
| Fit Review sample | `/examples/fit-review-sample/` | Show the lower-friction paid artifact before payment. |
| Launch Blueprint sample | `/sample/` | Show the full route file format. |
| Validation gate | `/checklists/launch-validation-decision-gate/` | Decide continue, rewrite, narrow, pivot, or stop. |

## 48-Hour Sequence

| Window | Action | Output |
|---|---|---|
| 0-4h | Publish sprint page, submit IndexNow, verify production health. | Crawlable route and public update log. |
| 4-8h | Update GitHub README and artifact links. | Repo can explain the project without chat context. |
| 8-16h | Prepare Product Hunt, Show HN, Reddit, Indie Hackers, and direct outreach drafts. | Compliant copy pack with platform stop rules. |
| 16-24h | Answer narrow public questions only when the answer is useful without the link. | Referral and objection signals. |
| 24-36h | Run up to 20 manual founder outreach messages. | Aggregate reply, sample view, payment click, and objection counts. |
| 36-44h | Ask peer reviewers to critique the sample, route method, and pricing clarity. | Specific objections and wording repairs. |
| 44-48h | Apply the validation decision gate. | Continue, rewrite, narrow, pivot_to_implementation, or stop. |

## Evidence Table

Record only aggregate counts:

| Metric | Meaning |
|---|---|
| indexed_url_count | Search discovery eligibility. |
| referral_visit_count | Non-search exposure. |
| source_link_click_count | Visitor inspected proof/source links. |
| sample_view_count | Visitor inspected delivery format. |
| paypal_click_count | Payment intent proxy; not revenue. |
| qualified_reply_count | Human interest with a concrete problem. |
| confirmed_payment_count | Revenue only when payment is confirmed. |
| usable_intake_count | Fulfillment-ready order input. |
| objection_count | Product clarity and pricing problems. |

## Decision Rule

If there are no qualified replies, sample views, or useful objections after the first manual batch, rewrite the offer before adding content. If prospects ask for implementation instead of a route file, pivot toward an implementation offer or reject those buyers instead of selling the same blueprint.

## Failure Sealing Rule

At the 48-hour deadline, run `npm run exposure:decision`.

The project must be sealed if all continuation signals are missing:

- confirmed_payment_count is below 1 or usable_intake_count is below 1.
- qualified_reply_count is below 2.
- sample_view_count is below 10 or source_link_click_count is below 3.
- objection_count is below 3.

When the decision is `seal_required`, stop publishing new commercial content for this offer, freeze payment expansion, and archive the project as a failed validation until a materially different offer is selected.

## Current Execution Blocker

External platform posting, community replies, manual outreach, and public account submissions require authenticated platform access. Without available browser control or logged-in platform access, the executable local scope is limited to production readiness, public artifacts, copy packs, evidence templates, and decision scripts. No external exposure action should be claimed unless it was actually submitted and recorded as an aggregate count.
