# Source Pack: AI Citation Readiness Checklist

Date: 2026-06-07
Status: source pack for `/checklists/ai-citation-readiness/`

## Official Sources

| Source | URL | Use in AgentSiteOps |
|---|---|---|
| Google AI features and your website | https://developers.google.com/search/docs/appearance/ai-features | Google says AI features use the same SEO fundamentals, require indexability and snippet eligibility, and do not require special AI markup. |
| Google Search Essentials | https://developers.google.com/search/docs/essentials | Search eligibility still depends on technical requirements, spam policies, helpful content, crawlable links, and content that can be understood. |
| Google helpful, reliable, people-first content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | Original value, clear sourcing, authorship, how/why disclosure, and avoiding search-engine-first content are required quality checks. |
| Google robots.txt guide | https://developers.google.com/search/docs/crawling-indexing/robots/intro | robots.txt manages crawler access but is not a secure hiding mechanism; noindex or access control is required when a page must not appear. |
| OpenAI Publishers and Developers FAQ | https://help.openai.com/en/articles/12627856-publishers-and-developers-faq | ChatGPT discovery and citation require OAI-SearchBot access, and ChatGPT referrals may use `utm_source=chatgpt.com`. |
| OpenAI ChatGPT Search help | https://help.openai.com/en/articles/9237897-chatgpt-search%25252525252525252525252525252525252525252525252525252525252525253F.avif | ChatGPT Search may cite sources, has no guaranteed placement, and requires OAI-SearchBot plus host/CDN access. |
| Anthropic crawler guidance | https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler | Claude separates training, user-directed retrieval, and search crawlers; blocking search/user crawlers can reduce visibility in Claude search experiences. |
| Perplexity robots.txt guidance | https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt | Perplexity states that PerplexityBot respects robots.txt for full or partial text indexing, with limited domain/headline/summary behavior possible. |
| Cloudflare managed robots.txt documentation | https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/ | Cloudflare managed robots.txt can prepend AI crawler rules and content signals, so CDN-level settings must be checked in addition to app-level robots.txt. |

## Claims Allowed

- AI citation readiness starts with crawl access, index eligibility, snippet eligibility, visible text, internal links, and clear page purpose.
- Google does not require special AI markup or a separate AI file for AI Overviews or AI Mode eligibility.
- OpenAI, Anthropic, and Perplexity each document crawler access paths that can affect discovery or citation.
- CDN and bot-protection settings can block crawlers even when the application-level robots.txt appears permissive.
- No checklist can guarantee indexing, AI citation, rankings, traffic, or revenue.

## Claims Not Allowed

- Do not claim AgentSiteOps can guarantee ChatGPT, Claude, Perplexity, Gemini, AI Overview, or AI Mode citations.
- Do not claim `llms.txt` or any special AI file is required for Google AI features.
- Do not claim allowing training crawlers is required for AI search visibility.
- Do not claim a paid tool is required before first-party crawl, sitemap, search console, and referral evidence exists.
