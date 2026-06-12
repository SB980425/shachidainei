import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = process.env.AGENTSITEOPS_SITE_URL ?? "https://agentsiteops.com";
const days = Number(process.env.AGENTSITEOPS_ANALYTICS_DAYS ?? "2");
const summaryUrl = `${siteUrl}/api/events/summary?days=${Number.isFinite(days) ? days : 2}`;
const jsonPath = resolve(rootDir, "data", "analytics-summary-snapshot.json");
const csvPath = resolve(rootDir, "data", "analytics-summary-snapshot.csv");
const reportPath = resolve(rootDir, "reports", "analytics-summary-snapshot.md");

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

function numeric(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 160)}`);
    }

    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}

function validateSummary(summary) {
  const issues = [];

  if (!summary || typeof summary !== "object" || Array.isArray(summary)) {
    return ["summary must be an object"];
  }

  if (!summary.counts_by_event || typeof summary.counts_by_event !== "object") {
    issues.push("counts_by_event missing");
  }

  if (!summary.counts_by_path || typeof summary.counts_by_path !== "object") {
    issues.push("counts_by_path missing");
  }

  if (!summary.threshold_snapshot || typeof summary.threshold_snapshot !== "object") {
    issues.push("threshold_snapshot missing");
  }

  for (const key of [
    "sample_view_count",
    "source_link_click_count",
    "paypal_click_count"
  ]) {
    if (!Number.isFinite(Number(summary.threshold_snapshot?.[key] ?? 0))) {
      issues.push(`threshold_snapshot.${key} must be numeric`);
    }
  }

  return issues;
}

function renderRows(summary) {
  const eventRows = Object.entries(summary.counts_by_event ?? {}).map(([name, count]) => ({
    grain: "event",
    key: name,
    count: numeric(count)
  }));
  const pathRows = Object.entries(summary.counts_by_path ?? {}).map(([path, count]) => ({
    grain: "path",
    key: path,
    count: numeric(count)
  }));
  return [...eventRows, ...pathRows].sort((a, b) =>
    a.grain === b.grain ? b.count - a.count : a.grain.localeCompare(b.grain)
  );
}

function writeOutputs(summary, issues) {
  const generatedAt = new Date().toISOString();
  const rows = renderRows(summary);
  const threshold = summary.threshold_snapshot ?? {};
  const totalEvents = Object.values(summary.counts_by_event ?? {}).reduce(
    (sum, count) => sum + numeric(count),
    0
  );
  const totalThresholdSignals =
    numeric(threshold.sample_view_count) +
    numeric(threshold.source_link_click_count) +
    numeric(threshold.paypal_click_count);
  const status = issues.length
    ? "blocked"
    : totalThresholdSignals > 0
      ? "imported"
      : totalEvents > 0
        ? "events_seen_no_threshold"
        : "waiting_for_events";

  mkdirSync(dirname(jsonPath), { recursive: true });
  mkdirSync(dirname(reportPath), { recursive: true });

  writeFileSync(
    jsonPath,
    `${JSON.stringify(
      {
        generated_at: generatedAt,
        status,
        source_url: summaryUrl,
        summary
      },
      null,
      2
    )}\n`
  );

  const csvLines = [
    ["generated_at", "grain", "key", "count"].join(","),
    ...rows.map((row) =>
      [generatedAt, row.grain, row.key, row.count].map(csvEscape).join(",")
    )
  ];
  writeFileSync(csvPath, `${csvLines.join("\n")}\n`);

  const report = [
    "# Analytics Summary Snapshot",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    `- Source: ${summaryUrl}`,
    `- Days: ${summary.days ?? "unknown"}`,
    `- Sample views: ${numeric(threshold.sample_view_count)}`,
    `- Source-link clicks: ${numeric(threshold.source_link_click_count)}`,
    `- PayPal CTA clicks: ${numeric(threshold.paypal_click_count)}`,
    `- Total event counts: ${totalEvents}`,
    "",
    "## Validation Issues",
    "",
    ...(issues.length ? issues.map((issue) => `- ${mdEscape(issue)}`) : ["- None"]),
    "",
    "## Threshold Snapshot",
    "",
    "| Metric | Count |",
    "|---|---:|",
    `| sample_view_count | ${numeric(threshold.sample_view_count)} |`,
    `| source_link_click_count | ${numeric(threshold.source_link_click_count)} |`,
    `| paypal_click_count | ${numeric(threshold.paypal_click_count)} |`,
    "",
    "## Aggregate Rows",
    "",
    "| Grain | Key | Count |",
    "|---|---|---:|",
    ...(rows.length
      ? rows.map((row) => `| ${mdEscape(row.grain)} | ${mdEscape(row.key)} | ${row.count} |`)
      : ["| none | none | 0 |"]),
    "",
    "## Interpretation",
    "",
    "- This report imports first-party aggregate event counters.",
    "- It does not prove revenue, qualified demand, or search indexing.",
    "- Self-visits and unqualified traffic should not be treated as commercial proof.",
    "- Confirmed payment, usable intake, qualified replies, and repeated objections remain stronger validation signals."
  ];

  writeFileSync(reportPath, `${report.join("\n")}\n`);

  return { generatedAt, status, rows, threshold };
}

try {
  const summary = await fetchJson(summaryUrl);
  const issues = validateSummary(summary);
  const output = writeOutputs(summary, issues);
  console.log(
    JSON.stringify(
      {
        status: output.status,
        source: summaryUrl,
        rows: output.rows.length,
        threshold: output.threshold,
        reportPath,
        jsonPath,
        csvPath
      },
      null,
      2
    )
  );

  if (issues.length) {
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const output = writeOutputs(
    {
      days,
      counts_by_event: {},
      counts_by_path: {},
      threshold_snapshot: {
        paypal_click_count: 0,
        sample_view_count: 0,
        source_link_click_count: 0
      }
    },
    [`summary fetch failed: ${message}`]
  );

  console.log(
    JSON.stringify(
      {
        status: output.status,
        source: summaryUrl,
        error: message,
        reportPath,
        jsonPath,
        csvPath
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
