# Crawler Access Audit

- Generated: 2026-06-08T06:31:47.769Z
- Status: PASS
- Site: https://agentsiteops.com
- Target: https://agentsiteops.com/checklists/ai-citation-readiness/
- Sitemap URLs: 26
- Cloudflare managed robots detected: no

## Summary

| Check | Result |
| --- | --- |
| robots.txt | pass HTTP 200 |
| sitemap.xml | pass HTTP 200 |
| target page | pass HTTP 200 |
| blockers | 0 |
| warnings | 0 |

## Crawler Results

| User agent | Purpose | Expected robots | Actual robots | HTTP | Title |
| --- | --- | --- | --- | --- | --- |
| Googlebot | google_search | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| Bingbot | bing_search | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| OAI-SearchBot | chatgpt_search | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| ChatGPT-User | chatgpt_user_retrieval | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| Claude-SearchBot | claude_search | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| Claude-User | claude_user_retrieval | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| PerplexityBot | perplexity_search | allow | allow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| GPTBot | openai_training | disallow | disallow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |
| ClaudeBot | anthropic_training | disallow | disallow | 200 | AI Citation Readiness Checklist \| AgentSiteOps |

## robots.txt

```txt
User-Agent: Googlebot
User-Agent: Bingbot
User-Agent: OAI-SearchBot
User-Agent: ChatGPT-User
User-Agent: Claude-SearchBot
User-Agent: Claude-User
User-Agent: PerplexityBot
Allow: /

User-Agent: GPTBot
User-Agent: ClaudeBot
Disallow: /

User-Agent: *
Allow: /

Sitemap: https://agentsiteops.com/sitemap.xml
```

## Blocking Issues

- None

## Warnings

- None

## Interpretation

- Search and user-retrieval crawlers should be allowed when AI discovery is the goal.
- Training crawlers can be disallowed without claiming that search visibility is guaranteed.
- HTTP 200 for a crawler does not override robots preference; robots directives are a policy signal and are voluntary for crawlers.
- CDN, WAF, and bot-protection settings must be checked again if this report changes from PASS to BLOCKED.
