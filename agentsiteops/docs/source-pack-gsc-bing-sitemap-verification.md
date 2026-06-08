# Source Pack: GSC and Bing Sitemap Verification

Date: 2026-06-08
Status: source pack for `/guides/gsc-bing-sitemap-verification/`

## Official Sources

| Source | URL | Use in AgentSiteOps |
|---|---|---|
| Google build and submit a sitemap | https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap | Sitemaps should use absolute URLs, live at an appropriate location, and include URLs intended for search results. |
| Google Search Console Sitemaps report | https://support.google.com/webmasters/answer/7451001 | Sitemap status can show success or couldn't fetch; fetch failures can involve robots.txt, manual actions, or other retrieval problems. |
| Google Search Console ownership verification | https://support.google.com/webmasters/answer/9008080 | Search Console data and management actions require verified ownership. |
| Bing Add and Verify Site | https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b | Bing supports importing verified Google Search Console sites or manual verification. |
| Bing Webmaster Guidelines | https://www.bing.com/webmaster/help/Webmaster-Guidelines-30fba23a | Sitemaps should reflect current canonical URLs and avoid stale or deleted URLs. |

## First-Party Sources

| Source | Path | Use in AgentSiteOps |
|---|---|---|
| Route registry | `docs/routes.json` | Defines the current indexable route list. |
| Sitemap implementation | `app/sitemap.ts` | Generates the production sitemap from route data. |
| Search evidence import contract | `docs/search-evidence-imports.md` | Defines how GSC and Bing exports become route-level evidence. |

## Claims Allowed

- Sitemap success means the sitemap file was fetched and read.
- Sitemap success does not guarantee every listed URL is indexed.
- Couldn't-fetch states require checking file availability, robots.txt, property host, redirects, manual actions, and HTTP status.
- Route expansion should wait for crawl, index, query, or user-action evidence rather than sitemap success alone.

## Claims Not Allowed

- Do not claim GSC or Bing sitemap submission guarantees indexing, ranking, AI citation, traffic, conversion, or revenue.
- Do not use a screenshot or sitemap status as proof of product-market fit.
- Do not recommend repeated resubmission loops when the submitted sitemap is already successful.
