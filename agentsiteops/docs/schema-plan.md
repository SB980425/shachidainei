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
| `/templates/seo-repo-skeleton/` | `TechArticle`, `BreadcrumbList` | headline, dependencies, proficiencyLevel if useful | Use code/template examples visibly on page. |
| `/checklists/ai-content-quality-gate/` | `HowTo`, `BreadcrumbList` | name, steps | Only use if checklist is presented as steps. |
| `/checklists/programmatic-seo-gate/` | `HowTo`, `BreadcrumbList` | name, steps | Avoid false claims of guaranteed indexing. |
| `/guides/ai-citation-grounding-metrics/` | `Article`, `BreadcrumbList` | headline, author, dateModified, citations | Include source register on page. |
| `/evidence/` | `CollectionPage`, `BreadcrumbList` | name, dateModified, hasPart | Public proof boundary for verified and pending evidence. |
| `/methodology/website-opportunity-scoring/` | `TechArticle`, `BreadcrumbList` | headline, author, dateModified | Explain scoring model and limitations. |
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
