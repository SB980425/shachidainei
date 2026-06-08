# Source Pack: IndexNow on Cloudflare Pages

Date: 2026-06-08
Status: source pack for `/guides/indexnow-cloudflare-pages/`

## Official Sources

| Source | URL | Use in AgentSiteOps |
|---|---|---|
| IndexNow getting started | https://www.bing.com/indexnow/IndexNowView/IndexNowGetStartedView | IndexNow uses a public key file, URL submission, response codes, and Bing Webmaster Tools verification. |
| IndexNow protocol documentation | https://www.indexnow.org/documentation | Bulk submission uses host, key, keyLocation, and urlList fields. |
| Bing URL Submission | https://www.bing.com/webmasters/help/URL-Submission-62f2860b | Bing recommends automated URL submission paths and still requires Webmaster Tools for evidence review. |

## First-Party Sources

| Source | Path | Use in AgentSiteOps |
|---|---|---|
| IndexNow submit script | `scripts/submit-indexnow.mjs` | Provides the current production URL list submission workflow. |
| Public key file | `public/32bc6ba6e277f850a701747381a57c48.txt` | Confirms the key file is part of the static deployment. |
| Updates log | `lib/updateLog.ts` | Records deployment and IndexNow submission results after release. |

## Claims Allowed

- IndexNow needs a hosted key and changed URL list.
- HTTP 200 means the submitted URL set was accepted by the endpoint.
- Response codes such as 400, 403, 422, and 429 need different fixes.
- IndexNow does not guarantee crawl, indexing, ranking, AI citation, traffic, conversion, or revenue.
- Submit changed production canonical URLs, not stale preview URLs.

## Claims Not Allowed

- Do not claim IndexNow replaces sitemap submission, Search Console, Bing Webmaster Tools, internal links, or content quality.
- Do not claim IndexNow guarantees indexing or faster revenue.
- Do not submit historical unchanged URL batches as if they were new changes.
