# Semrush Trial Extraction Plan

Date: 2026-06-07
Status: internal operating plan

## Cost Boundary

Semrush is useful as a temporary market-intelligence tool, not as a fixed monthly dependency for this site. The current operating decision is to use the 7-day trial window to extract reusable data, then stop unless AgentSiteOps has revenue or a specific experiment that needs paid monitoring.

Observed public pricing context:

- Semrush pricing page states a 7-day free trial.
- Semrush One public search snippets show Starter around $199/month and Pro+ around $299/month.
- The user reported the relevant post-trial plan is around $300/month.

## What To Extract During Trial

1. AI visibility prompts
   - Export prompt examples around AI search visibility, GEO, AI Overviews, ChatGPT search, Perplexity visibility, crawler access, and citation tracking.
   - Convert them into AgentSiteOps page ideas and review checks.

2. SERP and content gaps
   - Export competing page titles, URL patterns, headings, and missing execution artifacts.
   - Do not copy layouts or claims. Convert gaps into original checklists, source packs, and tools.

3. Keyword clusters
   - Group terms into citation readiness, crawler access, search console launch, AI visibility metrics, content quality gates, and technical SEO CI.
   - Mark each cluster as publish now, hold for data, or reject.

4. Competitor feature claims
   - Record what paid platforms claim: prompts tracked, domains monitored, AI engines covered, report frequency, and alerts.
   - Convert only defensible parts into low-cost manual workflows until revenue supports automation.

5. Export evidence
   - Save CSV/PDF exports under `docs/market-research/semrush/`.
   - Record query date, tool name, filters, and limits.

## Stop Rules

- Do not renew if monthly recurring revenue is below the tool cost.
- Do not renew if exports have not produced at least 10 actionable page/tool ideas.
- Do not renew only for curiosity, vanity traffic, or dashboard screenshots.
- Do not use Semrush data to make unsupported traffic or revenue forecasts.

## Reuse Plan

- Convert trial data into page briefs, not bulk AI articles.
- Update `docs/page-registry.csv` only when a route has a source pack and human continuation action.
- Revisit paid subscription only after the first 30-day GSC/Bing evidence window.
