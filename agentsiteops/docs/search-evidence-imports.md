# Search Evidence Imports

Status: ready for exports; no live GSC or Bing data imported yet.

## Purpose

This document defines the file contract for importing first-party search evidence into AgentSiteOps. It prevents weekly reviews from relying on screenshots, memory, or third-party estimates when GSC and Bing exports are available.

## Input Directory

Place raw export files in:

```text
data/search-evidence-imports/
```

The directory is ignored by Git so raw exports are not committed by default.

Tracked column templates are stored in:

```text
data/search-evidence-import-templates/
```

Use those files only as shape examples. Copy the matching template, replace the
sample rows with exported data, then save it under `data/search-evidence-imports/`
with the exact accepted filename.

## Accepted Files

| File | Source | Grain | Required useful columns |
|---|---|---|---|
| `gsc-pages.csv` | Google Search Console | page | page URL, clicks, impressions, CTR, position |
| `gsc-queries.csv` | Google Search Console | query | query, clicks, impressions, CTR, position |
| `bing-pages.csv` | Bing Webmaster Tools | page | page URL, clicks, impressions, CTR, position |
| `bing-queries.csv` | Bing Webmaster Tools | query | query, clicks, impressions, CTR, position |

The importer accepts common column names such as `Page`, `Top pages`, `URL`, `Query`, `Top queries`, `Clicks`, `Impressions`, `CTR`, `Position`, and `Avg Position`.

## Export Handling Rules

- Use page exports for route coverage; query exports alone cannot prove which site route earned the signal unless the export also includes a page or URL column.
- Keep the export date range in the filename notes or in the report that accompanies the import.
- Do not paste screenshots into the evidence workflow. Use CSV rows so route evidence can be reproduced.
- If a platform export has different column names, keep the original file and update `scripts/import-search-evidence.mjs` only after confirming the column meaning.

## Commands

```text
npm run search:evidence
npm run growth:snapshot
```

## Outputs

| Output | Purpose |
|---|---|
| `data/search-evidence-normalized.csv` | Normalized source, grain, URL, query, click, impression, CTR, and position rows |
| `reports/search-evidence-import.md` | Import status, source coverage, and route coverage summary |
| `data/growth-evidence-snapshot.csv` | Route-level evidence snapshot with GSC and Bing status |
| `reports/growth-evidence-snapshot.md` | Route-level evidence report |

## Review Rules

- Treat missing exports as `pending_export`, not as zero traffic.
- Treat imported rows with zero impressions as evidence of no observed search exposure in that export window only.
- Do not scale a new content cluster from query data until page-level indexing and crawler access are also confirmed.
- Do not commit raw GSC or Bing exports unless a deliberate reporting archive is needed.
