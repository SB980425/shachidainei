# Internal Linking Rules

## Goal

Internal links must help search crawlers, AI retrieval systems, and human readers understand page hierarchy, topic relationships, proof boundaries, and next actions.

## Link Hierarchy

| Source page | Must link to | Reason |
|---|---|---|
| Home | Pillar, scorer, crawler readiness tool, starter pack, launch checklist, citation readiness, evidence ledger, and methodology | Establish the main entry points and proof boundary. |
| Pillar | First-cluster execution pages | Keep the operating system as the topic center. |
| Tool | Methodology, pillar, repo skeleton, and evidence ledger | Explain scoring basis and connect results to execution and review. |
| Crawler readiness tool | Sample audit, citation readiness, small-site metrics, and evidence ledger | Convert free diagnosis into a visible proof and repair path. |
| Sample audit | Readiness tool, evidence ledger, service page, and updates | Show the audit format before any buyer request. |
| Service page | Sample audit, readiness tool, scorer, and disclosure | Keep commercial intent behind proof and compliance boundaries. |
| Starter pack | Scorer, repo skeleton, content gate, and evidence ledger | Connect downloadable assets to reviewable proof. |
| Repo template | Pillar, pSEO gate, AI content gate, and GitHub CI evidence | Tie structure to release controls. |
| AI content gate | Editorial policy, disclosure, pSEO gate, and evidence ledger | Reinforce review, risk, and proof boundaries. |
| pSEO gate | Repo template, methodology, and weekly review evidence | Keep batch pages governed by evidence. |
| Launch checklist | AI citation readiness, small-site metrics, and evidence ledger | Connect search setup to measured outcomes. |
| AI citation readiness | Crawler access audit, small-site metrics, and evidence ledger | Separate crawl eligibility from guaranteed citation claims. |
| Metrics guides | Evidence ledger, weekly review, scorer, and launch checklist | Connect measurement language to route decisions. |
| Methodology | Tool, pillar, and evidence ledger | Explain score inputs and validation limits. |
| Evidence ledger | Updates, metrics guide, launch checklist, and citation readiness | Show verified and pending evidence with next review paths. |
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
| Wants AI citation readiness | `/checklists/ai-citation-readiness/` |
| Wants a crawler-readiness score | `/tools/ai-crawler-readiness/` |
| Wants to see the paid audit format first | `/examples/agentsiteops-self-audit/` |
| Wants manual help after reviewing proof | `/services/ai-website-opportunity-audit/` |
| Wants metrics and review rules | `/guides/small-website-ai-visibility-metrics/` |
| Wants proof boundaries | `/evidence/` |

## Noindex Link Policy

Future noindex pages may be linked for user value, but they must not be included in sitemap.

Examples:

- Tool result share pages: noindex by default until enough unique value exists.
- Filtered result pages: noindex unless explicitly approved by pSEO gate.
- Draft or experimental pages: noindex and excluded from sitemap.
