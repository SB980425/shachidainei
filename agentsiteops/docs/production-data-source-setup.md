# Production Data Source Setup

用途：真实域名上线前后，按顺序接入 Search Console、Bing Webmaster Tools、站内事件 endpoint 和服务器日志。

当前状态：未上线，生产域名已定为 `agentsiteops.com`，`siteUrl` 已替换为 `https://agentsiteops.com`。本文件是接入顺序，不代表已经完成 GSC/Bing/analytics 接入。

Related local gates:

- Launch readiness: `checklists/launch-readiness.md`
- Fast validation cycle: `docs/fast-validation-cycle.md`
- Performance budget: `docs/performance-budget.md`
- Issue backlog: `docs/github-issues-ready.md`

## Blocking Inputs

| Input | Why it matters | Current status |
|---|---|---|
| Final domain | Search Console、Bing、canonical、sitemap、robots 和 endpoint 都依赖真实域名 | `agentsiteops.com` selected |
| Hosting provider | 决定服务器日志、headers、redirect、environment variables 和 deployment workflow | missing |
| Analytics destination | 决定隐私说明、endpoint、安全和数据保留 | missing |
| Owner identity | 作者页、Search Console/Bing 权限、隐私联系方式需要真实责任主体 | missing |

## Setup Order

| Step | Action | Gate |
|---|---|---|
| 1 | Replace `siteUrl` from placeholder to `https://agentsiteops.com` | `npm run seo:ci` must pass with `SITE_PUBLIC_URL` |
| 2 | Verify production build and deployment URL | HTTP 200, canonical, sitemap, robots, JSON-LD |
| 3 | Add Google Search Console property | Ownership verified |
| 4 | Submit `/sitemap.xml` in Search Console | Sitemap accepted or error recorded |
| 5 | Check Page indexing report after crawl window | Submitted pages are discovered/indexed or issue logged |
| 6 | Add Bing Webmaster Tools site or import from GSC | Ownership verified |
| 7 | Submit sitemap in Bing Webmaster Tools | Sitemap accepted or error recorded |
| 8 | Enable real analytics endpoint only after privacy review | `checklists/monetization-compliance.md` must pass |
| 9 | Enable server log review | crawler and status logs can be exported or queried |
| 10 | Run first weekly review | `reports/weekly-growth-review.md` updated with real data |

## Search Console Setup

Use official Search Console ownership verification. Preferred production route is DNS/domain verification when domain control is available; URL-prefix verification can work but is narrower.

Minimum actions:

1. Add the production property in Google Search Console.
2. Verify ownership.
3. Submit `https://<domain>/sitemap.xml`.
4. Track Page indexing for submitted URLs.
5. Export weekly metrics: `page_url`, `query`, `impressions`, `clicks`, `ctr`, `avg_position`, `index_status`.

Official references:

- https://support.google.com/webmasters/answer/9008080
- https://support.google.com/webmasters/answer/7451001
- https://support.google.com/webmasters/answer/7440203

## Bing Webmaster Tools Setup

Bing can add and verify a site directly or import verified sites from Google Search Console. Use direct verification if GSC import is unavailable.

Minimum actions:

1. Add or import the production site.
2. Verify ownership.
3. Submit `https://<domain>/sitemap.xml`.
4. Track search performance, URL/index signals, and AI Performance when available.
5. Export weekly metrics: `page_url`, `query`, `clicks`, `impressions`, `ai_citations`, `cited_urls`, `grounding_queries`.

Official references:

- https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b
- https://www.bing.com/webmasters/help/refreshed-webmaster-tools-7c7d2533

## Analytics Endpoint Setup

Current event layer only sends data if `NEXT_PUBLIC_ANALYTICS_ENDPOINT` exists.

Do not set this environment variable until:

- Privacy page describes the endpoint.
- Retention period is defined.
- Sensitive fields are blocked.
- Endpoint rejects unknown payload shapes.
- Consent/cookie requirements are reviewed for target geography.

Use `docs/analytics-endpoint-contract.md` as the implementation contract.

## Server Log Setup

Server logs should answer:

- Did Googlebot, Bingbot, OAI-SearchBot, GPTBot, or other known crawlers request the pages?
- Which routes return 200, 3xx, 4xx, or 5xx in production?
- Are sitemap and robots requested?
- Are static assets and pages served within acceptable response times?

Do not store raw logs longer than necessary without a retention policy.

## First Production Review

After the site is live and verified:

1. Run `npm run seo:ci` against production or a deployed preview.
2. Confirm sitemap submission in GSC and Bing.
3. Export first baseline search data when available.
4. Export first real event data if endpoint is enabled.
5. Update `reports/weekly-growth-review.md`.
6. Update `data/page-review-actions.csv`.
7. Do not scale content until Day 30 readiness review is complete.
