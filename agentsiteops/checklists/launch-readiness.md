# Launch Readiness Checklist

用途：真实上线前的最终检查。当前状态是本地可运行，不是生产已上线。

## Decision

| Area | Current status | Launch decision |
|---|---|---|
| Local build | pass | 可继续 |
| Technical SEO CI | pass | 可继续 |
| Content/trust base | pass for current scope | 可继续 |
| Production domain | `agentsiteops.com` selected | continue |
| Hosting provider | missing | block launch |
| Owner identity | missing | block public trust finalization |
| GSC/Bing | missing | block search validation |
| Real analytics endpoint | first-party aggregate endpoint configured | continue |
| Monetization | not enabled | pass; do not add until reviewed |

## Pre-Launch Checklist

| Gate | Required check | Status |
|---|---|---|
| Domain | Final production domain selected | `pass` |
| Canonical | `lib/site.ts` `siteUrl` replaced with production domain | `pass` |
| Build | `npm run build` passes | `pass` |
| Typecheck | `npm run typecheck` passes | `pass` |
| Dependency audit | `npm audit --audit-level=moderate` passes | `pass` |
| Technical SEO | `npm run seo:ci` passes after domain replacement | `pass local` |
| Sitemap | `/sitemap.xml` uses production domain | `pass local` |
| Robots | `/robots.txt` declares production sitemap | `pass local` |
| JSON-LD | All sitemap routes have valid JSON-LD | `pass local` |
| Mobile | 390px mobile overflow check passes | `pass local` |
| Trust | Author/owner identity finalized | `missing` |
| Privacy | Data collection matches actual scripts and endpoint | `pass` |
| Disclosure | Ads, affiliate, sponsor, paid placement absent or disclosed | `pass current` |
| GSC | Search Console property verified | `missing` |
| Bing | Bing Webmaster Tools site verified | `missing` |
| Analytics | Endpoint or analytics destination reviewed and enabled | `pass first-party aggregate` |
| Server logs | Hosting logs accessible for crawler review | `missing` |

## Launch Sequence

1. Select production domain. Done: `agentsiteops.com`.
2. Select hosting provider.
3. Replace `siteUrl` in `lib/site.ts`.
4. Set workflow `SITE_PUBLIC_URL` to the production domain.
5. Run `npm run typecheck`.
6. Run `npm run build`.
7. Run `npm run seo:ci`.
8. Deploy preview.
9. Run `npm run seo:ci` against preview or production base URL.
10. Verify GSC and Bing.
11. Submit sitemap.
12. Start Day 4-7 crawl validation from `docs/fast-validation-cycle.md`.

## Blockers

- Do not launch while canonical uses a non-production placeholder.
- Do not add third-party analytics, cookies, identifiers, raw event storage, or personal data collection before privacy and endpoint contract review.
- Do not add email, ads, affiliate, sponsor, form, payment, or account features before compliance review.
- Do not add fake GitHub repo links or fake download links.
- Do not scale content before GSC/Bing/index/event signals exist.
