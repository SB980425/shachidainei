# Technical SEO CI Report

- Generated: 2026-06-07T11:00:10.939Z
- Status: PASS
- Base URL: http://127.0.0.1:3000
- Public URL: https://agentsiteops.com
- Sitemap routes: 13

## Summary

| Check | Result |
| --- | --- |
| Routes passed | 13 |
| Routes failed | 0 |
| Blocking issues | 0 |
| Warnings | 0 |

## Route Results

| Route | Status | HTTP | Title | Canonical | JSON-LD | Links | Mobile | Issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | pass | 200 | AgentSiteOps | https://agentsiteops.com/ | 1 | 13 | pass | - |
| /ai-website-operating-system/ | pass | 200 | AI Website Operating System \| AgentSiteOps | https://agentsiteops.com/ai-website-operating-system/ | 1 | 12 | pass | - |
| /tools/website-opportunity-scorer/ | pass | 200 | Website Opportunity Scorer \| AgentSiteOps | https://agentsiteops.com/tools/website-opportunity-scorer/ | 1 | 12 | pass | - |
| /templates/seo-repo-skeleton/ | pass | 200 | SEO Repo Skeleton \| AgentSiteOps | https://agentsiteops.com/templates/seo-repo-skeleton/ | 1 | 12 | pass | - |
| /checklists/ai-content-quality-gate/ | pass | 200 | AI Content Quality Gate \| AgentSiteOps | https://agentsiteops.com/checklists/ai-content-quality-gate/ | 1 | 12 | pass | - |
| /checklists/programmatic-seo-gate/ | pass | 200 | Programmatic SEO Gate \| AgentSiteOps | https://agentsiteops.com/checklists/programmatic-seo-gate/ | 1 | 12 | pass | - |
| /guides/ai-citation-grounding-metrics/ | pass | 200 | AI Citation and Grounding Metrics \| AgentSiteOps | https://agentsiteops.com/guides/ai-citation-grounding-metrics/ | 1 | 12 | pass | - |
| /methodology/website-opportunity-scoring/ | pass | 200 | Website Opportunity Scoring Methodology \| AgentSiteOps | https://agentsiteops.com/methodology/website-opportunity-scoring/ | 1 | 11 | pass | - |
| /authors/ | pass | 200 | Authors and Review Status \| AgentSiteOps | https://agentsiteops.com/authors/ | 1 | 11 | pass | - |
| /editorial-policy/ | pass | 200 | Editorial Policy \| AgentSiteOps | https://agentsiteops.com/editorial-policy/ | 1 | 11 | pass | - |
| /privacy/ | pass | 200 | Privacy Policy \| AgentSiteOps | https://agentsiteops.com/privacy/ | 1 | 11 | pass | - |
| /disclosure/ | pass | 200 | Disclosure \| AgentSiteOps | https://agentsiteops.com/disclosure/ | 1 | 11 | pass | - |
| /updates/ | pass | 200 | Updates \| AgentSiteOps | https://agentsiteops.com/updates/ | 1 | 11 | pass | - |

## Blocking Issues

- None

## Warnings

- None

## Suggested GitHub Actions Gate

```yaml
name: technical-seo-ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  technical-seo:
    runs-on: ubuntu-latest
    env:
      SITE_AUDIT_BASE_URL: http://127.0.0.1:3000
      SITE_PUBLIC_URL: https://agentsiteops.com
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: node --check scripts/technical-seo-ci.mjs
      - run: npm run typecheck
      - run: npm audit --audit-level=moderate
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run start -- --hostname 127.0.0.1 --port 3000 > next-start.log 2>&1 &
      - run: for attempt in {1..45}; do curl -fsS "$SITE_AUDIT_BASE_URL" > /dev/null && exit 0; sleep 2; done; cat next-start.log; exit 1
      - run: npm run seo:ci
```

## Follow-up Issues

- Add Lighthouse CI budgets after deployment target and performance budget are fixed.
- Keep `https://agentsiteops.com` aligned with the real production domain before launch.
- Keep this report in pull requests until the route registry and sitemap are stable.
