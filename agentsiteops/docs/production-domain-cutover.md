# Production Domain Cutover

Date: 2026-06-07

## Conclusion

The production domain is `agentsiteops.com`.

The site configuration has moved from the placeholder origin to:

```text
https://agentsiteops.com
```

## Completed Locally

- `lib/site.ts` now uses `https://agentsiteops.com`.
- `app/layout.tsx` metadata base now uses `https://agentsiteops.com`.
- `.github/workflows/technical-seo-ci.yml` now sets `SITE_PUBLIC_URL` to `https://agentsiteops.com`.
- `docs/routes.json` now uses the production base URL.
- `docs/analytics-endpoint-contract.md` example URL now uses the production origin.
- Launch readiness and production setup docs now mark the domain decision as complete.
- DNS NS lookup confirms `agentsiteops.com` uses Cloudflare nameservers.
- Local technical SEO CI passes with `https://agentsiteops.com` as the public URL.

## Still Pending

- GitHub repository creation.
- Production hosting deployment.
- Cloudflare Pages or equivalent custom domain attachment.
- Google Search Console verification.
- Bing Webmaster Tools verification.
- Sitemap submission after production deployment.
- Real analytics endpoint review and enablement.
- Server log or host log access.

## Rule

Search validation must not start until production deployment returns HTTP 200 and canonical, sitemap, robots, JSON-LD, and CI all use the same origin.
