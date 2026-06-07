# AgentSiteOps Starter Pack

Version: 2026-06-07
Site: https://agentsiteops.com

This pack is a copy-ready operating set for validating an AI-assisted website before scaling content or adding payment.

## 1. Opportunity Scorecard

Use this before building.

| Field | Score 1-5 | Evidence required |
|---|---:|---|
| Search demand |  | Query examples, competitor pages, or search console evidence |
| AI citation fit |  | Does an AI answer need a citeable source, table, checklist, or tool? |
| Original value |  | Data, calculation, workflow, tool output, checklist, or first-party method |
| Commercial path |  | Template, audit, subscription, affiliate, lead, or product path |
| Compliance safety |  | YMYL, claims, personal data, payment, tax, copyright, or policy risks |
| 30-day validation |  | Indexing, impressions, referrals, completion events, or direct replies |

Decision:

- 70-100: proceed to blueprint.
- 55-69: pilot only.
- 45-54: revise angle.
- 0-44: stop.

## 2. Site Blueprint

Freeze this before writing pages.

```yaml
site:
  name:
  domain:
  audience:
  language:
  region:
  monetization:
  ymyl_flag:
routes:
  - path:
    type:
    intent:
    canonical:
    index_policy:
    schema:
    internal_links:
    review_date:
```

## 3. Content Quality Gate

Publish only if each item has a clear answer.

| Gate | Pass condition | Status |
|---|---|---|
| Intent fit | The page answers one specific job |  |
| Source basis | Claims are sourced or marked as internal method |  |
| Original value | The page adds a tool, checklist, template, data, or decision method |  |
| Risk boundary | No legal, medical, financial, or safety advice without review |  |
| Disclosure | Affiliate, sponsor, AI assistance, and paid links are visible when used |  |
| Technical SEO | Title, description, canonical, sitemap, robots, and schema are aligned |  |
| Review rule | Day 30, 60, and 90 actions are defined |  |

Decision: pass / revise / block

## 4. Technical SEO Release Check

Minimum checks before deployment:

- Build passes.
- All sitemap URLs return 200.
- No noindex page appears in sitemap.
- Canonical URLs use the production domain.
- `robots.txt` allows intended crawlers.
- `sitemap.xml` is reachable.
- `www` redirects to the canonical host.
- GSC and Bing properties are verified.
- IndexNow key is reachable before URL submission.

## 5. 30-Day Review Sheet

| URL | Indexed | Impressions | Clicks | AI referrals | Completion event | Action |
|---|---:|---:|---:|---:|---:|---|
| / |  |  |  |  |  | keep / rewrite / merge / noindex / delete |

Use this review to decide whether to expand, rewrite, merge, noindex, or stop the route.
