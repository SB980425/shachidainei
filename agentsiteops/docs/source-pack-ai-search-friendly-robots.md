# Source Pack: AI Search Friendly Robots.txt

Date: 2026-06-08
Status: source pack for `/guides/ai-search-friendly-robots-txt/`

## Official Sources

| Source | URL | Use in AgentSiteOps |
|---|---|---|
| Google robots.txt introduction | https://developers.google.com/search/docs/crawling-indexing/robots/intro | robots.txt controls crawler access but is not a secure hiding method, so noindex or access control is needed when pages should not appear. |
| OpenAI Publishers and Developers FAQ | https://help.openai.com/en/articles/12627856-publishers-and-developers-faq | OAI-SearchBot access affects ChatGPT search discovery and citation; GPTBot is documented separately for training opt-out. |
| Perplexity crawler documentation | https://docs.perplexity.ai/docs/resources/perplexity-crawlers | Perplexity separates `PerplexityBot` from `Perplexity-User` and recommends using official IP range endpoints for WAF allow rules. |
| Cloudflare managed robots.txt documentation | https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/ | CDN-level robots and bot settings can affect what crawlers see, so app-level robots.txt is not the only control. |

## Claims Allowed

- Crawler policies should separate search discovery, user-directed retrieval, and training crawlers.
- OAI-SearchBot access can affect ChatGPT search discovery and cited summaries.
- Perplexity documents both a search crawler and user-triggered fetcher, with WAF guidance for official IP ranges.
- CDN or WAF controls can block crawlers even when the app-level robots.txt is permissive.
- Crawler access is an eligibility signal, not proof of indexing, AI citation, traffic, conversion, or revenue.

## Claims Not Allowed

- Do not claim allowing every AI crawler is required.
- Do not claim allowing training crawlers is required for AI search visibility.
- Do not claim robots.txt alone removes a URL from all search or AI systems.
- Do not claim AgentSiteOps can guarantee ChatGPT, Perplexity, Google, Bing, Claude, or Copilot citations.
