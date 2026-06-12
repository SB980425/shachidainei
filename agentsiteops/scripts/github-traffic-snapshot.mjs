import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(rootDir, "..");
const snapshotPath = resolve(rootDir, "data", "github-traffic-snapshot.json");
const csvPath = resolve(rootDir, "data", "github-traffic-summary.csv");
const reportPath = resolve(rootDir, "reports", "github-traffic-snapshot.md");

const noThresholdBoundary =
  "GitHub traffic is aggregate repo exposure. It does not prove website visits, sample views, source-link clicks, qualified replies, payments, usable intake, or objections.";
const noThresholdRule = "Do not use GitHub traffic to increase 48-hour continuation thresholds.";

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: options.cwd ?? repoRoot,
    input: options.input,
    encoding: "utf8",
    windowsHide: true
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
}

function parseRemote(remoteUrl) {
  const httpsMatch = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (!httpsMatch) {
    throw new Error("GitHub owner/repo could not be parsed from origin remote");
  }

  return {
    owner: httpsMatch[1],
    repo: httpsMatch[2]
  };
}

function credentialToken() {
  const output = runGit(["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n"
  });
  const passwordLine = output
    .split(/\r?\n/)
    .find((line) => line.startsWith("password="));

  if (!passwordLine) {
    throw new Error("GitHub credential token is unavailable from git credential store");
  }

  return passwordLine.slice("password=".length).trim();
}

async function githubGet(path, token) {
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/${path}`, {
    headers: {
      "User-Agent": "Codex-AgentSiteOps",
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${path} failed: ${response.status} ${body}`);
  }

  return response.json();
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

function summarizeSeries(series, countKey) {
  return (series ?? []).map((row) => ({
    timestamp: row.timestamp,
    count: row[countKey] ?? 0,
    uniques: row.uniques ?? 0
  }));
}

const remoteUrl = runGit(["remote", "get-url", "origin"]);
const repo = parseRemote(remoteUrl);
const repoUrl = `https://github.com/${repo.owner}/${repo.repo}`;
const token = credentialToken();

const [views, clones, referrers, paths] = await Promise.all([
  githubGet("traffic/views", token),
  githubGet("traffic/clones", token),
  githubGet("traffic/popular/referrers", token),
  githubGet("traffic/popular/paths", token)
]);

const generatedAt = new Date().toISOString();
const snapshot = {
  generatedAt,
  repo,
  repoUrl,
  evidenceType: "verified_aggregate_repo_exposure",
  countsToward48HourThreshold: false,
  boundary: noThresholdBoundary,
  rule: noThresholdRule,
  endpoints: [
    "traffic/views",
    "traffic/clones",
    "traffic/popular/referrers",
    "traffic/popular/paths"
  ],
  totals: {
    views: {
      count: views.count ?? 0,
      uniques: views.uniques ?? 0
    },
    clones: {
      count: clones.count ?? 0,
      uniques: clones.uniques ?? 0
    },
    referrers: {
      count: referrers.length
    },
    paths: {
      count: paths.length
    }
  },
  series: {
    views: summarizeSeries(views.views, "count"),
    clones: summarizeSeries(clones.clones, "count")
  },
  referrers: referrers.map((item) => ({
    referrer: item.referrer,
    count: item.count,
    uniques: item.uniques
  })),
  paths: paths.map((item) => ({
    path: item.path,
    title: item.title,
    count: item.count,
    uniques: item.uniques
  }))
};

const csvRows = [
  {
    metric: "github_views_total",
    value: snapshot.totals.views.count,
    uniques: snapshot.totals.views.uniques,
    source: "traffic/views",
    counts_toward_48h_threshold: "no",
    note: noThresholdBoundary
  },
  {
    metric: "github_clones_total",
    value: snapshot.totals.clones.count,
    uniques: snapshot.totals.clones.uniques,
    source: "traffic/clones",
    counts_toward_48h_threshold: "no",
    note: noThresholdRule
  },
  {
    metric: "github_referrers_count",
    value: snapshot.totals.referrers.count,
    uniques: "",
    source: "traffic/popular/referrers",
    counts_toward_48h_threshold: "no",
    note: "Aggregate referrer list only; no private visitor identity is stored."
  },
  {
    metric: "github_paths_count",
    value: snapshot.totals.paths.count,
    uniques: "",
    source: "traffic/popular/paths",
    counts_toward_48h_threshold: "no",
    note: "Aggregate path list only; no website conversion or buyer intent is proven."
  }
];

const csvHeader = [
  "generated_at",
  "repo_url",
  "metric",
  "value",
  "uniques",
  "source",
  "counts_toward_48h_threshold",
  "note"
];
const csvLines = [
  csvHeader.join(","),
  ...csvRows.map((row) =>
    csvHeader
      .map((key) =>
        csvEscape(
          key === "generated_at" ? generatedAt : key === "repo_url" ? repoUrl : row[key]
        )
      )
      .join(",")
  )
];

const referrerRows = snapshot.referrers.length
  ? snapshot.referrers.map(
      (item) =>
        `| ${mdEscape(item.referrer)} | ${item.count} | ${item.uniques} |`
    )
  : ["| None returned | 0 | 0 |"];

const pathRows = snapshot.paths.length
  ? snapshot.paths.map(
      (item) =>
        `| ${mdEscape(item.path)} | ${mdEscape(item.title)} | ${item.count} | ${item.uniques} |`
    )
  : ["| None returned |  | 0 | 0 |"];

const report = [
  "# GitHub Traffic Snapshot",
  "",
  `- Generated: ${generatedAt}`,
  `- Repository: ${repoUrl}`,
  "- Evidence type: verified aggregate repo exposure",
  "- Counts toward 48-hour continuation threshold: no",
  `- Boundary: ${noThresholdBoundary}`,
  `- Rule: ${noThresholdRule}`,
  "",
  "## Totals",
  "",
  "| Metric | Count | Uniques | Source |",
  "|---|---:|---:|---|",
  `| Views | ${snapshot.totals.views.count} | ${snapshot.totals.views.uniques} | traffic/views |`,
  `| Clones | ${snapshot.totals.clones.count} | ${snapshot.totals.clones.uniques} | traffic/clones |`,
  `| Referrer rows | ${snapshot.totals.referrers.count} |  | traffic/popular/referrers |`,
  `| Path rows | ${snapshot.totals.paths.count} |  | traffic/popular/paths |`,
  "",
  "## Referrers",
  "",
  "| Referrer | Count | Uniques |",
  "|---|---:|---:|",
  ...referrerRows,
  "",
  "## Paths",
  "",
  "| Path | Title | Count | Uniques |",
  "|---|---|---:|---:|",
  ...pathRows,
  "",
  "## Interpretation",
  "",
  "- This is useful for confirming that the public GitHub surface is visible enough to produce aggregate repository events.",
  "- It does not prove website visits, source-link clicks, sample inspection, qualified replies, payments, usable intake, or objections.",
  "- The 48-hour exposure decision must continue to use only the dedicated exposure evidence template and confirmed external platform signals."
];

mkdirSync(dirname(snapshotPath), { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
writeFileSync(csvPath, `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "github_traffic_snapshot_imported",
      generatedAt,
      repoUrl,
      countsToward48HourThreshold: false,
      totals: snapshot.totals,
      snapshotPath,
      csvPath,
      reportPath
    },
    null,
    2
  )
);
