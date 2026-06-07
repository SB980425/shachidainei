# Performance Budget

用途：给 Lighthouse、Core Web Vitals、资源体积和交互性能设定上线前预算。当前预算是目标，不是生产实测结果。

## Current Decision

| Area | Decision |
|---|---|
| Lab budget | Use Lighthouse/Playwright in CI after deployment target is stable |
| Field budget | Use Core Web Vitals after production traffic exists |
| Current state | No production performance claim yet |
| Release gate | Local technical SEO CI passes; Lighthouse budget pending deployment target |

## Core Web Vitals Targets

Measure at the 75th percentile when real field data exists.

| Metric | Good target | Action if missed |
|---|---|---|
| LCP | <= 2.5s | Reduce render-blocking work, optimize largest text/image block, reduce JS/CSS and server delay |
| INP | <= 200ms | Reduce long tasks, simplify client JS, avoid heavy hydration and expensive event handlers |
| CLS | <= 0.1 | Reserve dimensions, avoid late layout shifts, avoid injecting unstable widgets |

## Lighthouse Lab Budget

These are CI targets, not field-data replacements.

| Category | Target | Release action |
|---|---|---|
| Performance | >= 90 | Warn below 90; block below 80 after production baseline is known |
| Accessibility | >= 95 | Block below 90 |
| Best Practices | >= 95 | Block below 90 |
| SEO | >= 100 | Block below 100 for core routes |

## Resource Budget

| Resource | Initial budget | Reason |
|---|---|---|
| Total JS per route | <= 180 KB compressed | Current site is mostly static; interaction should stay light |
| CSS | <= 80 KB compressed | Single global stylesheet should remain controlled |
| Images above fold | 0 unless needed | Current first cluster does not require hero images |
| Third-party scripts | 0 before privacy review | Avoid unreviewed tracking, ads, widgets and layout shift |
| Fonts | System fonts only unless justified | Avoid font loading delays |

## Route Priority

| Route group | Budget priority |
|---|---|
| `/` | Highest; user enters scoring path |
| `/tools/website-opportunity-scorer/` | Highest; interactive path |
| `/templates/seo-repo-skeleton/` | High; copy action |
| `/checklists/*` | High; copy action and AI citation target |
| `/guides/*` and `/methodology/*` | Medium; source and metrics content |
| trust pages | Medium; must remain readable and accessible |
| `/updates/` | Medium; grows over time, watch HTML size |

## CI Implementation Plan

Do not add Lighthouse CI as a hard release gate until a deployment target exists.

1. Keep `npm run seo:ci` as current local gate.
2. After hosting exists, add Lighthouse CI against deployed preview.
3. Store Lighthouse reports under `reports/lighthouse/`.
4. Add a `lighthouserc` only after route list and preview URL are stable.
5. Treat the first run as baseline; do not block on unknown production-specific issues until investigated.
6. After baseline, enforce budgets on core routes first.

## Optimization Priorities

1. Preserve static rendering.
2. Keep client components narrow: only scorer, event layer and copy actions need client behavior.
3. Avoid third-party scripts until privacy/compliance review.
4. Avoid decorative media unless it improves the actual task.
5. Keep tables horizontally scrollable instead of breaking layout.
6. Monitor `/updates/` size as the log grows.

## Sources

- Google Search Central: Core Web Vitals and Google Search results: https://developers.google.com/search/docs/appearance/core-web-vitals
- web.dev: Web Vitals: https://web.dev/articles/vitals
- web.dev: Defining Core Web Vitals thresholds: https://web.dev/articles/defining-core-web-vitals-thresholds
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
