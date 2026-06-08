# Technical SEO CI Report

- Generated: 2026-06-08T06:45:18.045Z
- Status: PASS
- Base URL: https://agentsiteops.com
- Public URL: https://agentsiteops.com
- Sitemap routes: 28

## Summary

| Check | Result |
| --- | --- |
| Routes passed | 28 |
| Routes failed | 0 |
| Blocking issues | 0 |
| Warnings | 0 |

## Route Results

| Route | Status | HTTP | Title | Canonical | JSON-LD | Links | Mobile | Issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | pass | 200 | AgentSiteOps | https://agentsiteops.com/ | 1 | 28 | pass | - |
| /ai-website-operating-system/ | pass | 200 | AI Website Operating System \| AgentSiteOps | https://agentsiteops.com/ai-website-operating-system/ | 1 | 14 | pass | - |
| /tools/website-opportunity-scorer/ | pass | 200 | Website Opportunity Scorer \| AgentSiteOps | https://agentsiteops.com/tools/website-opportunity-scorer/ | 1 | 14 | pass | - |
| /tools/ai-crawler-readiness/ | pass | 200 | AI Crawler Readiness Tool \| AgentSiteOps | https://agentsiteops.com/tools/ai-crawler-readiness/ | 1 | 15 | pass | - |
| /examples/agentsiteops-self-audit/ | pass | 200 | AgentSiteOps Self-Audit Sample \| AgentSiteOps | https://agentsiteops.com/examples/agentsiteops-self-audit/ | 1 | 15 | pass | - |
| /services/ai-website-opportunity-audit/ | pass | 200 | AI Website Opportunity Audit \| AgentSiteOps | https://agentsiteops.com/services/ai-website-opportunity-audit/ | 1 | 15 | pass | - |
| /tools/audit-scope-builder/ | pass | 200 | Audit Scope Builder \| AgentSiteOps | https://agentsiteops.com/tools/audit-scope-builder/ | 1 | 16 | pass | - |
| /templates/starter-pack/ | pass | 200 | AI Website Validation Starter Pack \| AgentSiteOps | https://agentsiteops.com/templates/starter-pack/ | 1 | 13 | pass | - |
| /templates/seo-repo-skeleton/ | pass | 200 | SEO Repo Skeleton \| AgentSiteOps | https://agentsiteops.com/templates/seo-repo-skeleton/ | 1 | 14 | pass | - |
| /checklists/ai-content-quality-gate/ | pass | 200 | AI Content Quality Gate \| AgentSiteOps | https://agentsiteops.com/checklists/ai-content-quality-gate/ | 1 | 14 | pass | - |
| /checklists/programmatic-seo-gate/ | pass | 200 | Programmatic SEO Gate \| AgentSiteOps | https://agentsiteops.com/checklists/programmatic-seo-gate/ | 1 | 14 | pass | - |
| /checklists/gsc-bing-indexnow-launch/ | pass | 200 | GSC, Bing, and IndexNow Launch Checklist \| AgentSiteOps | https://agentsiteops.com/checklists/gsc-bing-indexnow-launch/ | 1 | 17 | pass | - |
| /checklists/ai-citation-readiness/ | pass | 200 | AI Citation Readiness Checklist \| AgentSiteOps | https://agentsiteops.com/checklists/ai-citation-readiness/ | 1 | 16 | pass | - |
| /guides/ai-citation-grounding-metrics/ | pass | 200 | AI Citation and Grounding Metrics \| AgentSiteOps | https://agentsiteops.com/guides/ai-citation-grounding-metrics/ | 1 | 15 | pass | - |
| /guides/small-website-ai-visibility-metrics/ | pass | 200 | Small Website AI Visibility Metrics \| AgentSiteOps | https://agentsiteops.com/guides/small-website-ai-visibility-metrics/ | 1 | 15 | pass | - |
| /evidence/ | pass | 200 | Evidence Ledger \| AgentSiteOps | https://agentsiteops.com/evidence/ | 1 | 18 | pass | - |
| /reports/route-evidence-dashboard/ | pass | 200 | Route Evidence Dashboard \| AgentSiteOps | https://agentsiteops.com/reports/route-evidence-dashboard/ | 1 | 28 | pass | - |
| /methodology/website-opportunity-scoring/ | pass | 200 | Website Opportunity Scoring Methodology \| AgentSiteOps | https://agentsiteops.com/methodology/website-opportunity-scoring/ | 1 | 14 | pass | - |
| /guides/ai-search-friendly-robots-txt/ | pass | 200 | AI Search Friendly Robots.txt \| AgentSiteOps | https://agentsiteops.com/guides/ai-search-friendly-robots-txt/ | 1 | 16 | pass | - |
| /guides/indexnow-cloudflare-pages/ | pass | 200 | IndexNow on Cloudflare Pages \| AgentSiteOps | https://agentsiteops.com/guides/indexnow-cloudflare-pages/ | 1 | 16 | pass | - |
| /guides/gsc-bing-sitemap-verification/ | pass | 200 | GSC and Bing Sitemap Verification \| AgentSiteOps | https://agentsiteops.com/guides/gsc-bing-sitemap-verification/ | 1 | 17 | pass | - |
| /templates/evidence-ledger-template/ | pass | 200 | Evidence Ledger Template \| AgentSiteOps | https://agentsiteops.com/templates/evidence-ledger-template/ | 1 | 16 | pass | - |
| /templates/website-opportunity-scoring-template/ | pass | 200 | Website Opportunity Scoring Template \| AgentSiteOps | https://agentsiteops.com/templates/website-opportunity-scoring-template/ | 1 | 15 | pass | - |
| /authors/ | pass | 200 | Authors and Review Status \| AgentSiteOps | https://agentsiteops.com/authors/ | 1 | 13 | pass | - |
| /editorial-policy/ | pass | 200 | Editorial Policy \| AgentSiteOps | https://agentsiteops.com/editorial-policy/ | 1 | 13 | pass | - |
| /privacy/ | pass | 200 | Privacy Policy \| AgentSiteOps | https://agentsiteops.com/privacy/ | 1 | 13 | pass | - |
| /disclosure/ | pass | 200 | Disclosure \| AgentSiteOps | https://agentsiteops.com/disclosure/ | 1 | 13 | pass | - |
| /updates/ | pass | 200 | Updates \| AgentSiteOps | https://agentsiteops.com/updates/ | 1 | 13 | pass | - |

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
      - run: npx serve@latest out -l 3000 > serve-start.log 2>&1 &
      - run: for attempt in {1..45}; do curl -fsS "$SITE_AUDIT_BASE_URL" > /dev/null && exit 0; sleep 2; done; cat serve-start.log; exit 1
      - run: npm run seo:ci
```

## Follow-up Issues

- Add Lighthouse CI budgets after deployment target and performance budget are fixed.
- Keep `https://agentsiteops.com` aligned with the real production domain before launch.
- Keep this report in pull requests until the route registry and sitemap are stable.
