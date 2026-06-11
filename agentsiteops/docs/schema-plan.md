# Schema Plan

## Rules

- Structured data must match the real page type.
- Do not add schema only for rich-result speculation.
- Every page can use `BreadcrumbList` where breadcrumbs are visible.
- Home can use `WebSite` and `Organization` after real brand details exist.
- Author pages can use `ProfilePage` and `Person`.

## Page Schema Map

| URL | Schema Candidate | Required Fields | Notes |
|---|---|---|---|
| `/` | `WebSite`, `Organization`, `BreadcrumbList` | site name, url, publisher | Organization fields stay minimal until brand identity is real. |
| `/ai-website-operating-system/` | `Article`, `BreadcrumbList` | headline, datePublished, dateModified, author, publisher | Use when article-like pillar is published. |
| `/tools/website-opportunity-scorer/` | `SoftwareApplication` or `WebApplication`, `BreadcrumbList` | name, applicationCategory, operatingSystem, offers if paid | Do not claim ratings before real reviews exist. |
| `/tools/ai-crawler-readiness/` | `SoftwareApplication` or `WebApplication`, `BreadcrumbList` | name, applicationCategory, operatingSystem, offers | Manual checklist tool; do not claim live crawl coverage. |
| `/examples/agentsiteops-self-audit/` | `WebPage`, `BreadcrumbList` | name, dateModified, mainEntity if sample is expanded | Sample report must not imply customer proof. |
| `/services/ai-website-opportunity-audit/` | `Service`, `WebPage`, `BreadcrumbList` | name, serviceType, provider, areaServed if enabled | Checkout is disabled; no aggregate ratings or fake offers. |
| `/tools/audit-scope-builder/` | `SoftwareApplication` or `WebApplication`, `BreadcrumbList` | name, applicationCategory, operatingSystem | Local-only scope builder; no request submission, payment, account, or guarantee claims. |
| `/templates/seo-repo-skeleton/` | `TechArticle`, `BreadcrumbList` | headline, dependencies, proficiencyLevel if useful | Use code/template examples visibly on page. |
| `/checklists/ai-content-quality-gate/` | `HowTo`, `BreadcrumbList` | name, steps | Only use if checklist is presented as steps. |
| `/checklists/programmatic-seo-gate/` | `HowTo`, `BreadcrumbList` | name, steps | Avoid false claims of guaranteed indexing. |
| `/guides/ai-search-friendly-robots-txt/` | `Article`, `BreadcrumbList` | headline, author, dateModified, citations | Crawler policy guide; no claim of guaranteed citation. |
| `/guides/indexnow-cloudflare-pages/` | `TechArticle`, `BreadcrumbList` | headline, dateModified, dependencies | Deployment workflow; no claim of indexing guarantee. |
| `/guides/gsc-bing-sitemap-verification/` | `TechArticle`, `BreadcrumbList` | headline, dateModified, citations | Troubleshooting workflow for sitemap fetch and inspection states. |
| `/guides/first-traffic-system/` | `TechArticle`, `BreadcrumbList` | headline, dateModified, dependencies | First-visitor workflow; no traffic, ranking, or revenue guarantee. |
| `/guides/48-hour-exposure-sprint/` | `TechArticle`, `BreadcrumbList` | headline, dateModified, dependencies | Active two-day exposure plan; no artificial engagement or revenue guarantee. |
| `/guides/ai-citation-grounding-metrics/` | `Article`, `BreadcrumbList` | headline, author, dateModified, citations | Include source register on page. |
| `/evidence/` | `CollectionPage`, `BreadcrumbList` | name, dateModified, hasPart | Public proof boundary for verified and pending evidence. |
| `/reports/route-evidence-dashboard/` | `Dataset`, `WebPage`, `BreadcrumbList` | name, description, variableMeasured | Must match the generated route evidence snapshot and no-guarantee boundary. |
| `/templates/evidence-ledger-template/` | `TechArticle`, `BreadcrumbList` | headline, dateModified, dependencies | Copy-ready proof worksheet; no fake downloads or claims. |
| `/templates/website-opportunity-scoring-template/` | `TechArticle`, `BreadcrumbList` | headline, dateModified, dependencies | Copy-ready scoring worksheet tied to scorer and methodology. |
| `/methodology/website-opportunity-scoring/` | `TechArticle`, `BreadcrumbList` | headline, author, dateModified | Explain scoring model and limitations. |
| `/methodology/route-selection/` | `TechArticle`, `BreadcrumbList` | headline, author, dateModified, dependencies | Explain evidence hierarchy, route archetypes, and stop rules behind route selection. |
| `/authors/` | `ProfilePage`, `Person`, `BreadcrumbList` | name, url, sameAs if available | Keep only true credentials. |
| `/editorial-policy/` | `WebPage`, `BreadcrumbList` | name, dateModified | Explain AI content, fact-check, correction process. |
| `/privacy/` | `WebPage`, `BreadcrumbList` | name, dateModified | Must match actual data collection. |
| `/disclosure/` | `WebPage`, `BreadcrumbList` | name, dateModified | Must match actual monetization. |
| `/updates/` | `CollectionPage`, `BreadcrumbList` | name, dateModified, hasPart | Public execution log for AI and human readers. |

## Validation

Before release:

- Validate JSON-LD syntax.
- Confirm visible page content supports schema claims.
- Confirm dates update when content changes.
- Confirm no noindex page is treated as a major structured-data asset.
