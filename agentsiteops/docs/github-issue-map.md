# GitHub Issue Map

## Milestones

| Milestone | Scope | Exit Criteria |
|---|---|---|
| M0 Blueprint | Freeze site brief, taxonomy, routes, templates, analytics | All blueprint files reviewed |
| M1 Foundation Build | Implement static site shell, trust pages, sitemap, robots, canonical | Site builds and core routes render |
| M2 First Cluster | Implement 8 core pages and scorer MVP | Core routes pass SEO and content gates |
| M3 Measurement | Add analytics events, GSC/Bing setup docs, weekly review template | Events can be verified |
| M4 30 Day Review | First data review | Continue/pivot decision documented |

## Issue Labels

| Label | Meaning |
|---|---|
| `type:blueprint` | Docs, taxonomy, route planning |
| `type:page-template` | Template implementation |
| `type:content` | Page content |
| `type:tool` | Interactive scorer or utility |
| `type:seo` | Sitemap, metadata, canonical, schema |
| `type:analytics` | Events and reporting |
| `type:trust` | Author, policy, privacy, disclosure |
| `type:ci` | Build, tests, Lighthouse, link checks |
| `gate:content-quality` | Requires AI content gate |
| `gate:pseo` | Requires programmatic SEO gate |
| `gate:compliance` | Requires monetization/compliance review |
| `status:blocked` | Missing human input or external setup |

## First Issues

1. `M0: Review and freeze site brief`
   - Files: `docs/site-brief.md`
   - Labels: `type:blueprint`

2. `M0: Review taxonomy and first route set`
   - Files: `docs/taxonomy.yaml`, `docs/routes.json`, `docs/page-registry.csv`
   - Labels: `type:blueprint`, `type:seo`

3. `M1: Implement site shell and global layout`
   - Pages: `/`, nav, footer, breadcrumbs
   - Labels: `type:page-template`, `type:seo`

4. `M1: Implement trust pages`
   - Pages: `/authors/`, `/editorial-policy/`, `/privacy/`, `/disclosure/`
   - Labels: `type:trust`, `gate:compliance`

5. `M2: Build website opportunity scorer MVP`
   - Page: `/tools/website-opportunity-scorer/`
   - Labels: `type:tool`, `type:analytics`

6. `M2: Write AI website operating system pillar`
   - Page: `/ai-website-operating-system/`
   - Labels: `type:content`, `gate:content-quality`

7. `M2: Build SEO repo skeleton template page`
   - Page: `/templates/seo-repo-skeleton/`
   - Labels: `type:content`, `type:page-template`

8. `M2: Build AI content quality gate page`
   - Page: `/checklists/ai-content-quality-gate/`
   - Labels: `type:content`, `gate:content-quality`

9. `M2: Build programmatic SEO gate page`
   - Page: `/checklists/programmatic-seo-gate/`
   - Labels: `type:content`, `gate:pseo`

10. `M2: Build AI citation metrics guide`
    - Page: `/guides/ai-citation-grounding-metrics/`
    - Labels: `type:content`, `type:analytics`

11. `M3: Add analytics events`
    - Events: `tool_completed`, `template_copy_click`, `email_signup_submit`, `github_repo_click`
    - Labels: `type:analytics`
    - Local status: first-party event layer, tool events, template copy, and checklist copy implemented
    - Evidence: `docs/analytics-events.md`
    - Remaining: choose real analytics destination, email/GitHub events if those features are added, and update privacy policy before external collection

12. `M3: Add technical SEO CI v1`
    - Checks: build, route availability, sitemap, robots, canonical, schema syntax, link check
    - Labels: `type:ci`, `type:seo`
    - Local status: implemented in `scripts/technical-seo-ci.mjs` and `.github/workflows/technical-seo-ci.yml`
    - Evidence: `reports/technical-seo-ci.md`, `docs/github-actions-release-gate.md`
    - Remaining: replace production domain placeholder and enable branch protection after GitHub repo is published

13. `M3: Add weekly growth review template`
    - Files: `docs/weekly-review-template.md`, `reports/weekly-growth-review.md`, `data/page-review-actions.csv`
    - Labels: `type:analytics`, `type:seo`
    - Local status: baseline readiness review implemented
    - Remaining: connect GSC, Bing Webmaster Tools, real analytics endpoint, and server logs after production domain

14. `M3: Prepare production data source setup`
    - Files: `docs/production-data-source-setup.md`, `docs/analytics-endpoint-contract.md`, `checklists/monetization-compliance.md`
    - Labels: `type:analytics`, `type:seo`, `gate:compliance`
    - Local status: setup order and endpoint contract implemented
    - Remaining: final domain, hosting provider, analytics destination, owner identity, and privacy review

15. `M3: Prepare launch readiness and fast validation`
    - Files: `checklists/launch-readiness.md`, `docs/fast-validation-cycle.md`, `docs/performance-budget.md`
    - Labels: `type:seo`, `type:ci`, `gate:compliance`
    - Local status: local checklist and budget draft implemented
    - Remaining: production domain, deployed preview, Lighthouse baseline

16. `M3: Draft GitHub issues`
    - Files: `docs/github-issues-ready.md`, `data/github-issues-backlog.csv`
    - Labels: `type:blueprint`
    - Local status: issue draft implemented
    - Remaining: publish issues after real GitHub repo exists

## Blocked Until Human Input

- Final site name.
- Domain.
- Preferred tech stack.
- Whether to publish GitHub repo publicly.
- Whether email signup is needed in v1.
- Whether monetization disclosure should be minimal placeholder or prepared for affiliate use.
