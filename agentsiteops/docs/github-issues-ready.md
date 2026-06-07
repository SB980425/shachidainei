# GitHub Issues Ready Backlog

用途：把当前计划拆成可发布 issue。当前没有真实 GitHub repo，因此只生成 issue 草案，不创建远端 issue。

## Issue 1: Replace Placeholder Domain

- Type: HITL
- Blocked by: none
- Labels: `type:seo`

### What to build

Replace every production URL placeholder with the real domain, then verify canonical, sitemap, robots, metadata and JSON-LD use the same production origin.

### Acceptance criteria

- [x] `lib/site.ts` uses the production domain.
- [x] GitHub Actions `SITE_PUBLIC_URL` uses the production domain.
- [ ] `/sitemap.xml` contains production URLs.
- [ ] `/robots.txt` declares production sitemap.
- [ ] `npm run seo:ci` passes after replacement.

## Issue 2: Deploy Preview And Production Host

- Type: HITL
- Blocked by: hosting provider decision
- Labels: `type:ci`, `type:seo`, `status:blocked`

### What to build

Deploy the site to the selected host, expose a preview URL and production URL, then run the same technical checks against the deployed target.

### Acceptance criteria

- [ ] Production build deploys successfully.
- [ ] Preview URL returns HTTP 200.
- [ ] Production URL returns HTTP 200.
- [ ] `SITE_AUDIT_BASE_URL=<deployed-url> npm run seo:ci` passes.
- [ ] Hosting logs or equivalent request logs are accessible.

## Issue 3: Verify Search Console And Submit Sitemap

- Type: HITL
- Blocked by: Issue 1, Issue 2
- Labels: `type:analytics`, `type:seo`, `status:blocked`

### What to build

Verify Google Search Console ownership, submit the sitemap, and record the first indexing baseline.

### Acceptance criteria

- [ ] Search Console property is verified.
- [ ] Production sitemap is submitted.
- [ ] Page indexing report status is recorded.
- [ ] Baseline data is written to `reports/weekly-growth-review.md`.
- [ ] Missing or excluded pages are added to `data/page-review-actions.csv`.

## Issue 4: Verify Bing Webmaster Tools And AI Performance

- Type: HITL
- Blocked by: Issue 1, Issue 2
- Labels: `type:analytics`, `type:seo`, `status:blocked`

### What to build

Verify Bing Webmaster Tools, submit sitemap, and prepare the first Bing search and AI Performance baseline when available.

### Acceptance criteria

- [ ] Bing Webmaster Tools site is verified or imported from GSC.
- [ ] Production sitemap is submitted.
- [ ] Search performance baseline is recorded.
- [ ] AI citations, cited URLs and grounding queries are recorded when available.
- [ ] Gaps are written to `reports/weekly-growth-review.md`.

## Issue 5: Implement Real Analytics Endpoint

- Type: AFK after analytics destination decision
- Blocked by: analytics destination, privacy review
- Labels: `type:analytics`, `gate:compliance`, `status:blocked`

### What to build

Implement the endpoint described in `docs/analytics-endpoint-contract.md`, reject invalid or sensitive payloads, and update privacy documentation before enabling `NEXT_PUBLIC_ANALYTICS_ENDPOINT`.

### Acceptance criteria

- [ ] Endpoint accepts allowlisted events.
- [ ] Endpoint rejects unknown events.
- [ ] Endpoint rejects sensitive payload tests.
- [ ] Privacy page describes the endpoint.
- [ ] `checklists/monetization-compliance.md` passes for analytics.
- [ ] Browser event check confirms real endpoint receives test events.

## Issue 6: Add Lighthouse CI Baseline

- Type: AFK after deployed preview exists
- Blocked by: Issue 2
- Labels: `type:ci`, `type:seo`

### What to build

Add Lighthouse CI baseline reports for core routes using `docs/performance-budget.md`. Start as advisory, then promote to release gate after baseline is understood.

### Acceptance criteria

- [ ] Lighthouse runs against deployed preview.
- [ ] Reports are saved under `reports/lighthouse/`.
- [ ] Core routes are included: `/`, scorer, template, content gate, pSEO gate.
- [ ] Results are compared with `docs/performance-budget.md`.
- [ ] Blocking thresholds are not enabled until the baseline is reviewed.

## Issue 7: Start 3 / 7 / 14 / 30 Validation

- Type: AFK after launch
- Blocked by: Issue 1, Issue 2, Issue 3, Issue 4
- Labels: `type:analytics`, `type:seo`

### What to build

Run the fast validation cycle in `docs/fast-validation-cycle.md`, then update the weekly review report and page action table.

### Acceptance criteria

- [ ] Day 3 local/deployment readiness is recorded.
- [ ] Day 7 crawl and sitemap status is recorded.
- [ ] Day 14 index and event status is recorded.
- [ ] Day 30 page actions are recorded.
- [ ] No page is expanded without evidence.

## Issue 8: Publish GitHub Release Gate

- Type: AFK after repo exists
- Blocked by: GitHub repo publication
- Labels: `type:ci`

### What to build

Enable `.github/workflows/technical-seo-ci.yml` on the real GitHub repo and make it a required branch protection check.

### Acceptance criteria

- [ ] Workflow runs on pull request.
- [ ] Workflow uploads `reports/technical-seo-ci.md`.
- [ ] Branch protection requires `technical-seo-ci`.
- [ ] Workflow domain placeholder is replaced when production domain exists.
- [ ] Failure mode is documented in `docs/github-actions-release-gate.md`.
