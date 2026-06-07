# Source Pack: Small Website AI Visibility Metrics

Date: 2026-06-07
Status: source pack for `/guides/small-website-ai-visibility-metrics/`

## Official Sources

| Source | URL | Use in AgentSiteOps |
|---|---|---|
| Google Search Console Sitemaps report | https://support.google.com/webmasters/answer/7451001 | Sitemap status is a discovery and retrieval signal, not an index or traffic guarantee. |
| Bing URL Submission help | https://www.bing.com/webmasters/help/URL-Submission-62f2860b | Bing still supports URL submission but recommends IndexNow where possible. |
| Bing Webmaster Guidelines | https://www.bing.com/webmaster/help/Webmaster-Guidelines-30fba23a | `noindex` affects Bing search, Copilot experiences, and grounding API eligibility. |
| IndexNow documentation | https://www.indexnow.org/documentation | A host-controlled key file and URL list submission can notify participating search engines about changed URLs. |

## Claims Allowed

- A sitemap can show whether Google could retrieve the sitemap file, but it does not prove that every URL is indexed or valuable.
- IndexNow is useful for notifying participating search engines about changed URLs, but accepted submission is not an indexing guarantee.
- Small sites should review sample URLs in GSC and Bing instead of assuming one dashboard metric explains visibility.
- No page should optimize only for AI crawler arrival. A page still needs a human continuation action.

## Claims Not Allowed

- Do not claim AgentSiteOps has live LLM visibility monitoring.
- Do not claim IndexNow guarantees indexing.
- Do not claim GSC or Bing metrics measure all AI answer exposure.
- Do not claim traffic or revenue uplift without first-party evidence.
