# GitHub Actions Release Gate

用途：把本地验证流程固定为 GitHub PR 和 main 分支门禁。

## Workflow

| Field | Value |
|---|---|
| File | `.github/workflows/technical-seo-ci.yml` |
| Triggers | `pull_request`, `push` to `main`, `workflow_dispatch` |
| Runner | `ubuntu-latest` |
| Node | 24 |
| Public URL | `https://agentsiteops.com` |
| Local audit URL | `http://127.0.0.1:3000` |

## Checks

| Check | Command | Blocks release when |
|---|---|---|
| Dependency install | `npm ci` | lockfile or install fails |
| Script syntax | `node --check scripts/technical-seo-ci.mjs` | SEO CI script cannot parse |
| Typecheck | `npm run typecheck` | TypeScript fails |
| Dependency audit | `npm audit --audit-level=moderate` | moderate or higher vulnerability exists |
| Browser install | `npx playwright install --with-deps chromium` | Chromium cannot install |
| Production build | `npm run build` | Next build fails |
| Local server | `npx serve@latest out -l 3000` | static export server does not respond |
| Technical SEO CI | `npm run seo:ci` | route, metadata, canonical, JSON-LD, internal links, mojibake, noindex, sitemap, robots, or mobile check fails |

## Artifacts

The workflow uploads:

- `reports/technical-seo-ci.md`
- `serve-start.log`

## Release Blockers

- `reports/technical-seo-ci.md` status is `FAIL`.
- Any sitemap route returns non-2xx.
- A route in sitemap has missing or mismatched canonical.
- A sitemap route is noindex.
- JSON-LD is missing or invalid.
- Internal links point outside the registered route set.
- Mobile viewport has horizontal overflow.
- `npm audit --audit-level=moderate` fails.

## Before Production

- Confirm `SITE_PUBLIC_URL` remains `https://agentsiteops.com`.
- Confirm `siteUrl` in `lib/site.ts` remains `https://agentsiteops.com`.
- Rerun `npm run seo:ci` locally with the production public URL.
- Decide whether `main` is the production branch.
- Add branch protection requiring `technical-seo-ci`.
- Do not replace the production domain with a placeholder after launch.

## Sources

- GitHub Actions workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- actions/checkout: https://github.com/actions/checkout
- actions/setup-node: https://github.com/actions/setup-node
