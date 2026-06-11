# Internal Linking Rules

## Goal

Internal links must help search crawlers, AI retrieval systems, and human readers understand page hierarchy, topic relationships, proof boundaries, and next actions.

## Link Hierarchy

| Source page | Must link to | Reason |
|---|---|---|
| Home | Pillar, scorer, crawler readiness tool, audit scope builder, route evidence dashboard, starter pack, launch checklist, citation readiness, evidence ledger, and methodology | Establish the main entry points and proof boundary. |
| Pillar | First-cluster execution pages | Keep the operating system as the topic center. |
| Tool | Methodology, pillar, repo skeleton, and evidence ledger | Explain scoring basis and connect results to execution and review. |
| Crawler readiness tool | Sample audit, citation readiness, small-site metrics, and evidence ledger | Convert free diagnosis into a visible proof and repair path. |
| Sample audit | Readiness tool, evidence ledger, service page, and updates | Show the audit format before any buyer request. |
| Service page | Sample audit, readiness tool, scorer, audit scope builder, and disclosure | Keep commercial intent behind proof and compliance boundaries. |
| Starter pack | Scorer, repo skeleton, content gate, and evidence ledger | Connect downloadable assets to reviewable proof. |
| Repo template | Pillar, pSEO gate, AI content gate, and GitHub CI evidence | Tie structure to release controls. |
| AI content gate | Editorial policy, disclosure, pSEO gate, and evidence ledger | Reinforce review, risk, and proof boundaries. |
| pSEO gate | Repo template, methodology, and weekly review evidence | Keep batch pages governed by evidence. |
| Launch checklist | AI citation readiness, small-site metrics, and evidence ledger | Connect search setup to measured outcomes. |
| AI citation readiness | AI search friendly robots.txt, crawler access audit, small-site metrics, and evidence ledger | Separate crawl eligibility from guaranteed citation claims. |
| Search verification guides | Launch checklist, IndexNow guide, sitemap verification guide, metrics, and evidence ledger | Keep submit, fetch, inspect, and evidence capture as separate steps. |
| Metrics guides | Evidence ledger, weekly review, scorer, launch checklist, and sitemap verification | Connect measurement language to route decisions. |
| Methodology | Tool, pillar, route selection, 48-hour exposure sprint, first traffic system, and evidence ledger | Explain score inputs, route selection, validation limits, and first exposure actions. |
| Evidence ledger | Route evidence dashboard, evidence template, updates, metrics guide, launch checklist, and citation readiness | Show verified and pending evidence with next review paths. |
| Evidence template | Evidence ledger, sample audit, updates, and metrics guide | Convert proof boundaries into a reusable worksheet. |
| Scoring template | Scorer, methodology, pillar, and evidence template | Convert candidate selection into a reusable worksheet. |
| Trust pages | Editorial policy, author page, privacy, disclosure, and evidence ledger | Build responsibility and correction paths. |
| Updates | Evidence ledger, content gates, and launch checklist | Connect execution logs to current proof status. |

## Anchor Text Rules

Use descriptive anchors:

- Good: `website opportunity scorer`
- Good: `AI citation readiness checklist`
- Good: `search evidence import contract`
- Good: `Evidence Ledger`
- Bad: `click here`
- Bad: `more`

## First Cluster Required Links

Every first-cluster page must include:

1. A link back to `/ai-website-operating-system/` or a directly related operating-system page.
2. A link to one adjacent execution page.
3. A link to one trust, methodology, evidence, or update page.
4. A link to one human continuation action.

## Conversion Paths

| User state | Next link |
|---|---|
| Does not know whether a site idea is worth building | `/tools/website-opportunity-scorer/` |
| Has a direction but no structure | `/templates/seo-repo-skeleton/` |
| Needs a free working asset | `/templates/starter-pack/` |
| Worries AI content is low quality | `/checklists/ai-content-quality-gate/` |
| Wants batch or programmatic pages | `/checklists/programmatic-seo-gate/` |
| Needs search-console setup | `/checklists/gsc-bing-indexnow-launch/` |
| Needs sitemap submission troubleshooting | `/guides/gsc-bing-sitemap-verification/` |
| Needs IndexNow deployment steps | `/guides/indexnow-cloudflare-pages/` |
| Wants AI citation readiness | `/checklists/ai-citation-readiness/` |
| Wants crawler policy separation | `/guides/ai-search-friendly-robots-txt/` |
| Wants a crawler-readiness score | `/tools/ai-crawler-readiness/` |
| Wants a local audit scope draft | `/tools/audit-scope-builder/` |
| Wants to see the paid audit format first | `/examples/agentsiteops-self-audit/` |
| Wants manual help after reviewing proof | `/services/ai-website-opportunity-audit/` |
| Wants metrics and review rules | `/guides/small-website-ai-visibility-metrics/` |
| Wants proof boundaries | `/evidence/` |
| Wants route-level evidence status | `/reports/route-evidence-dashboard/` |
| Wants a proof ledger worksheet | `/templates/evidence-ledger-template/` |
| Wants a candidate scoring worksheet | `/templates/website-opportunity-scoring-template/` |
| Wants to understand how a score becomes a route | `/methodology/route-selection/` |
| Wants to know how the site gets first visitors | `/guides/first-traffic-system/` |
| Wants the active 48-hour exposure plan | `/guides/48-hour-exposure-sprint/` |

## Noindex Link Policy

Future noindex pages may be linked for user value, but they must not be included in sitemap.

Examples:

- Tool result share pages: noindex by default until enough unique value exists.
- Filtered result pages: noindex unless explicitly approved by pSEO gate.
- Draft or experimental pages: noindex and excluded from sitemap.
