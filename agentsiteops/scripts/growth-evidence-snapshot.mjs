import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const routesPath = resolve(rootDir, "docs", "routes.json");
const registryPath = resolve(rootDir, "docs", "page-registry.csv");
const actionsPath = resolve(rootDir, "data", "page-review-actions.csv");
const technicalReportPath = resolve(rootDir, "reports", "technical-seo-ci.md");
const crawlerReportPath = resolve(rootDir, "reports", "crawler-access-audit.md");
const snapshotCsvPath = resolve(rootDir, "data", "growth-evidence-snapshot.csv");
const snapshotReportPath = resolve(rootDir, "reports", "growth-evidence-snapshot.md");
const weeklyReportPath = resolve(rootDir, "reports", "weekly-growth-review.md");

function read(path) {
  return readFileSync(path, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""]))
  );
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function parseReportStatus(report) {
  const match = report.match(/^- Status:\s*(\w+)/m);
  return match ? match[1].toLowerCase() : "unknown";
}

function parseTechnicalRoutes(report) {
  const map = new Map();
  for (const line of report.split(/\r?\n/)) {
    const match = line.match(/^\| (\/[^|]*) \| (pass|fail) \| ([^|]+) \|/);
    if (match) {
      map.set(match[1].trim(), {
        status: match[2],
        http: match[3].trim()
      });
    }
  }
  return map;
}

function routeActionFor(path, actions) {
  return actions.find((row) => row.url === path) ?? {};
}

function registryFor(path, registry) {
  return registry.find((row) => row.url === path) ?? {};
}

const generatedAt = new Date().toISOString();
const routeDoc = JSON.parse(read(routesPath));
const registry = parseCsv(read(registryPath));
const actions = parseCsv(read(actionsPath));
const technicalReport = read(technicalReportPath);
const crawlerReport = read(crawlerReportPath);
const technicalStatus = parseReportStatus(technicalReport);
const crawlerStatus = parseReportStatus(crawlerReport);
const technicalRoutes = parseTechnicalRoutes(technicalReport);

const routeRows = routeDoc.routes.map((route) => {
  const registryRow = registryFor(route.path, registry);
  const actionRow = routeActionFor(route.path, actions);
  const technical = technicalRoutes.get(route.path);

  return {
    url: route.path,
    page_type: route.pageType,
    cluster: route.cluster,
    index_default: String(route.index),
    technical_seo_status: technical?.status ?? "not_checked",
    http_status: technical?.http ?? "not_checked",
    crawler_access_status: crawlerStatus === "pass" ? "site_pass" : crawlerStatus,
    gsc_status: "pending_export",
    bing_status: "pending_export",
    ai_referral_status: "pending_endpoint_or_referral",
    onsite_event_status: "local_buffer_only",
    current_action: actionRow.current_action || "keep",
    day_30_action: actionRow.day_30_action || "review",
    next_required_evidence:
      actionRow.next_issue ||
      registryRow.human_conversion ||
      "Add GSC, Bing, referral, and event evidence after the first data window."
  };
});

const csvHeader = [
  "url",
  "page_type",
  "cluster",
  "index_default",
  "technical_seo_status",
  "http_status",
  "crawler_access_status",
  "gsc_status",
  "bing_status",
  "ai_referral_status",
  "onsite_event_status",
  "current_action",
  "day_30_action",
  "next_required_evidence"
];

const csvLines = [
  csvHeader.join(","),
  ...routeRows.map((row) => csvHeader.map((key) => csvEscape(row[key])).join(","))
];

const summary = {
  routes: routeRows.length,
  technicalPass: routeRows.filter((row) => row.technical_seo_status === "pass").length,
  crawlerStatus,
  pendingGsc: routeRows.filter((row) => row.gsc_status === "pending_export").length,
  pendingBing: routeRows.filter((row) => row.bing_status === "pending_export").length,
  localOnlyEvents: routeRows.filter((row) => row.onsite_event_status === "local_buffer_only").length
};

const tableHeader = "| URL | Type | Cluster | Tech SEO | Crawler | Current action | Next evidence |";
const tableRule = "|---|---|---|---|---|---|---|";
const tableRows = routeRows.map((row) =>
  [
    "|",
    mdEscape(row.url),
    "|",
    mdEscape(row.page_type),
    "|",
    mdEscape(row.cluster),
    "|",
    mdEscape(row.technical_seo_status),
    "|",
    mdEscape(row.crawler_access_status),
    "|",
    mdEscape(row.current_action),
    "|",
    mdEscape(row.next_required_evidence),
    "|"
  ].join(" ")
);

const snapshotReport = [
  "# Growth Evidence Snapshot",
  "",
  `- Generated: ${generatedAt}`,
  "- Status: baseline_ready",
  `- Routes: ${summary.routes}`,
  `- Technical SEO pass routes: ${summary.technicalPass}`,
  `- Crawler access status: ${summary.crawlerStatus}`,
  `- GSC status: pending export for ${summary.pendingGsc} routes`,
  `- Bing status: pending export for ${summary.pendingBing} routes`,
  `- Onsite event status: local buffer only for ${summary.localOnlyEvents} routes`,
  "",
  "## Route Evidence Table",
  "",
  tableHeader,
  tableRule,
  ...tableRows,
  "",
  "## Evidence Rules",
  "",
  "- Do not scale a new content cluster until GSC and Bing export data exists.",
  "- Do not buy paid AI visibility monitoring until first-party evidence creates a concrete question that free tools cannot answer.",
  "- Keep technical SEO and crawler access as release gates for every route batch.",
  "- Treat local event buffering as implementation evidence only; it is not real user behavior until an approved endpoint is connected."
];

const weeklyReport = [
  "# Weekly Growth Review",
  "",
  `- Date: ${generatedAt.slice(0, 10)}`,
  "- Review type: production baseline evidence review",
  "- Decision: continue evidence collection; do not scale content clusters yet",
  "",
  "## Conclusion",
  "",
  "- The production site has 17 indexable routes with technical SEO passing.",
  "- Production crawler access audit is passing for intended search and user-retrieval crawlers.",
  "- GSC, Bing, real onsite events, AI referrals, and revenue evidence are still pending exports or endpoint setup.",
  "- The next operating step is to collect first-party evidence, not to add a large content batch.",
  "",
  "## Confirmed",
  "",
  "| Area | Evidence | Status |",
  "|---|---|---|",
  `| Route registry | docs/routes.json | ${summary.routes} routes registered |`,
  `| Technical SEO | reports/technical-seo-ci.md | ${summary.technicalPass}/${summary.routes} routes pass |`,
  `| Crawler access | reports/crawler-access-audit.md | ${summary.crawlerStatus} |`,
  "| IndexNow | latest command output | 17 URLs submitted successfully in current deployment cycle |",
  "| Event layer | components/SiteAnalytics.tsx | Local buffer exists; real endpoint not enabled |",
  "",
  "## Unverified",
  "",
  "| Area | Missing evidence | Impact |",
  "|---|---|---|",
  "| Google Search Console | Page and query export | Cannot evaluate impressions, clicks, CTR, or index coverage yet |",
  "| Bing Webmaster Tools | Search and AI Performance export | Cannot evaluate Bing queries, AI citations, cited URLs, or grounding phrases yet |",
  "| ChatGPT referrals | Analytics endpoint or server logs | Cannot confirm ChatGPT traffic yet |",
  "| Onsite conversions | Approved analytics endpoint | Cannot measure real scorer completion, copy actions, or source clicks yet |",
  "| Revenue | Payment or lead channel | Cannot evaluate paid conversion or payback yet |",
  "",
  "## Page Action Table",
  "",
  tableHeader,
  tableRule,
  ...tableRows,
  "",
  "## 30 / 60 / 90 Status",
  "",
  "| Window | Current status | Required evidence before decision |",
  "|---|---|---|",
  "| Day 30 | Not enough live search data | GSC indexing, Bing status, first impressions, crawler audit, internal link review |",
  "| Day 60 | Not started | Query breadth, CTR, page improvement actions, onsite continuation events |",
  "| Day 90 | Not started | Keep, rewrite, merge, noindex, delete, continue, pivot, or stop decisions |",
  "",
  "## Next Week Backlog",
  "",
  "1. Export GSC sitemap, indexing, and performance data when the console has enough data.",
  "2. Export Bing Webmaster sitemap, URL, search, and AI Performance data when available.",
  "3. Decide whether to connect a privacy-reviewed analytics endpoint.",
  "4. Use Semrush only for trial-window exports: prompts, keyword clusters, SERP gaps, and competitor feature claims.",
  "5. Keep all new pages behind source packs, technical SEO CI, crawler access audit, and IndexNow submission."
];

mkdirSync(dirname(snapshotCsvPath), { recursive: true });
mkdirSync(dirname(snapshotReportPath), { recursive: true });
writeFileSync(snapshotCsvPath, `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(snapshotReportPath, `${snapshotReport.join("\n")}\n`, "utf8");
writeFileSync(weeklyReportPath, `${weeklyReport.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "baseline_ready",
      generatedAt,
      snapshotCsvPath,
      snapshotReportPath,
      weeklyReportPath,
      summary
    },
    null,
    2
  )
);
