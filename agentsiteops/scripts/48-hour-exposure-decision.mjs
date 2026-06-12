import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const statusPath = resolve(rootDir, "data", "48-hour-exposure-status.json");
const evidencePath = resolve(rootDir, "data", "48-hour-exposure-evidence-template.csv");
const thresholdsPath = resolve(rootDir, "data", "48-hour-exposure-thresholds.csv");
const reportPath = resolve(rootDir, "reports", "48-hour-exposure-decision.md");
const jsonPath = resolve(rootDir, "data", "48-hour-exposure-decision.json");

const numericFields = [
  "referral_visit_count",
  "source_link_click_count",
  "sample_view_count",
  "paypal_click_count",
  "qualified_reply_count",
  "confirmed_payment_count",
  "usable_intake_count",
  "objection_count"
];

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let inQuote = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];

    if (character === '"' && inQuote && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      inQuote = !inQuote;
      continue;
    }

    if (character === "," && !inQuote) {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += character;
  }

  cells.push(cell);
  return cells;
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function sumEvidence(rows) {
  return Object.fromEntries(
    numericFields.map((field) => [field, rows.reduce((sum, row) => sum + numberValue(row[field]), 0)])
  );
}

function decide(totals, deadlinePassed) {
  if (totals.confirmed_payment_count >= 1 && totals.usable_intake_count >= 1) {
    return {
      decision: "continue",
      status: "signal_found",
      reason: "Confirmed payment plus usable intake exists."
    };
  }

  if (totals.qualified_reply_count >= 2) {
    return {
      decision: "continue_or_rewrite",
      status: "signal_found",
      reason: "At least two qualified replies exist."
    };
  }

  if (totals.sample_view_count >= 10 && totals.source_link_click_count >= 3) {
    return {
      decision: "rewrite_or_narrow",
      status: "signal_found",
      reason: "Sample inspection and evidence-link inspection reached the minimum threshold."
    };
  }

  if (totals.objection_count >= 3) {
    return {
      decision: "rewrite_or_pivot",
      status: "signal_found",
      reason: "Repeated objections reached the minimum useful-pattern threshold."
    };
  }

  if (deadlinePassed) {
    return {
      decision: "seal_required",
      status: "failed_validation",
      reason: "No measurable exposure threshold was reached by the 48-hour deadline."
    };
  }

  return {
    decision: "active_collect_evidence",
    status: "active",
    reason: "The 48-hour window is still open and no continuation threshold has been reached."
  };
}

function renderReport({ generatedAt, status, deadline, deadlinePassed, evidenceRows, totals, thresholds, result }) {
  const lines = [
    "# 48-Hour Exposure Decision",
    "",
    `- Generated: ${generatedAt}`,
    `- Project: ${status.project}`,
    `- Sprint status: ${result.status}`,
    `- Decision: ${result.decision}`,
    `- Reason: ${result.reason}`,
    `- Started UTC: ${status.started_at_utc}`,
    `- Deadline UTC: ${status.deadline_at_utc}`,
    `- Deadline passed: ${deadlinePassed ? "yes" : "no"}`,
    `- Seconds until deadline: ${Math.max(0, Math.floor((deadline.getTime() - new Date(generatedAt).getTime()) / 1000))}`,
    "",
    "## Totals",
    "",
    "| Metric | Count |",
    "|---|---:|",
    ...numericFields.map((field) => `| ${field} | ${totals[field]} |`),
    "",
    "## Thresholds",
    "",
    "| Rule | Minimum | Decision | Reason |",
    "|---|---|---|---|",
    ...thresholds.map(
      (row) =>
        `| ${mdEscape(row.rule)} | ${mdEscape(row.minimum)} | ${mdEscape(row.decision)} | ${mdEscape(row.reason)} |`
    ),
    "",
    "## Evidence Rows",
    "",
    "| Window | Channel | Qualified replies | Sample views | PayPal clicks | Payments | Intake | Objections |",
    "|---|---|---:|---:|---:|---:|---:|---:|",
    ...evidenceRows.map(
      (row) =>
        `| ${mdEscape(row.window)} | ${mdEscape(row.channel)} | ${numberValue(row.qualified_reply_count)} | ${numberValue(
          row.sample_view_count
        )} | ${numberValue(row.paypal_click_count)} | ${numberValue(row.confirmed_payment_count)} | ${numberValue(
          row.usable_intake_count
        )} | ${numberValue(row.objection_count)} |`
    ),
    "",
    "## Rule",
    "",
    "- If the decision is `seal_required`, stop publishing new commercial content for this offer, freeze payment expansion, and archive the project as a failed validation until a materially different offer is selected.",
    "- PayPal clicks, sitemap success, IndexNow success, crawler access, and page existence are not revenue or demand proof.",
    "- Only aggregate counts belong in public files."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);
}

function main() {
  const status = JSON.parse(readFileSync(statusPath, "utf8"));
  const evidenceRows = parseCsv(readFileSync(evidencePath, "utf8"));
  const thresholds = parseCsv(readFileSync(thresholdsPath, "utf8"));
  const generatedAt = new Date(process.env.EXPOSURE_DECISION_NOW ?? Date.now()).toISOString();
  const now = new Date(generatedAt);
  const deadline = new Date(status.deadline_at_utc);
  const deadlinePassed = now.getTime() >= deadline.getTime();
  const totals = sumEvidence(evidenceRows);
  const result = decide(totals, deadlinePassed);
  const output = {
    generatedAt,
    status: result.status,
    decision: result.decision,
    reason: result.reason,
    deadlinePassed,
    totals,
    reportPath,
    jsonPath
  };

  renderReport({ generatedAt, status, deadline, deadlinePassed, evidenceRows, totals, thresholds, result });
  writeFileSync(jsonPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));

  if (result.decision === "seal_required") {
    process.exitCode = 1;
  }
}

main();
