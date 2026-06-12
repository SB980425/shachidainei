import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(rootDir, "..");
const csvPath = resolve(rootDir, "data", "github-exposure-release-refresh.csv");
const reportPath = resolve(rootDir, "reports", "github-exposure-release-refresh.md");
const publicReportPath = resolve(rootDir, "public", "reports", "github-exposure-release-refresh.md");
const tag = "agentsiteops-48h-exposure-2026-06-12";

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
  const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (!match) {
    throw new Error("GitHub owner/repo could not be parsed from origin remote");
  }

  return {
    owner: match[1],
    repo: match[2]
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

async function githubRequest(path, token, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/${path}`, {
    method: options.method ?? "GET",
    headers: {
      "User-Agent": "Codex-AgentSiteOps",
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
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

const remoteUrl = runGit(["remote", "get-url", "origin"]);
const repo = parseRemote(remoteUrl);
const repoUrl = `https://github.com/${repo.owner}/${repo.repo}`;
const token = credentialToken();
const generatedAt = new Date().toISOString();

const release = await githubRequest(`releases/tags/${encodeURIComponent(tag)}`, token);
const body = [
  "AgentSiteOps 48-hour exposure validation artifact.",
  "",
  "## Current status",
  "",
  "- Live site: https://agentsiteops.com",
  "- Public self-score: 52/100; technically launchable and commercially unvalidated.",
  "- Current decision: active_collect_evidence until the 48-hour deadline or a valid continuation threshold is reached.",
  "- No guarantee of traffic, ranking, AI citation, customer response, revenue, or payback.",
  "",
  "## Inspect first",
  "",
  "- Launch kit: https://agentsiteops.com/launch-kit/",
  "- Route basis report: https://agentsiteops.com/reports/route-basis/",
  "- Route method: https://agentsiteops.com/methodology/route-selection/",
  "- Route confidence system: https://agentsiteops.com/reports/route-confidence-system.md",
  "- Fit Review sample: https://agentsiteops.com/examples/fit-review-sample/",
  "- Launch Blueprint sample: https://agentsiteops.com/sample/",
  "- Pricing: https://agentsiteops.com/pricing/",
  "- AI-readable summary: https://agentsiteops.com/llms.txt",
  "- Analytics summary: https://agentsiteops.com/api/events/summary?days=2",
  "- Social preview image: https://agentsiteops.com/og-image.png",
  "",
  "## Feedback requested",
  "",
  "- Structured route feedback: https://github.com/SB980425/shachidainei/issues/new?template=agentsiteops-route-feedback.yml",
  "- Public feedback thread: https://github.com/SB980425/shachidainei/issues/2",
  "",
  "Useful feedback is one of these:",
  "",
  "- The route file is clear or unclear.",
  "- The USD 29 Fit Review scope or price is wrong.",
  "- The USD 99 Launch Blueprint scope or price is wrong.",
  "- The buyer would need implementation instead of advice.",
  "- The trust or proof gap blocks payment.",
  "",
  "## Evidence boundary",
  "",
  "This release update and endpoint availability do not count as demand. They are public artifacts only. The 48-hour threshold can move only from confirmed payment plus usable intake, qualified external replies, sample views plus source-link clicks, or repeated objections."
].join("\n");

const updatedRelease = await githubRequest(`releases/${release.id}`, token, {
  method: "PATCH",
  body: {
    name: "AgentSiteOps 48-hour exposure validation",
    body,
    prerelease: true,
    make_latest: "false"
  }
});

const rows = [
  {
    generated_at: generatedAt,
    repo_url: repoUrl,
    tag,
    release_url: updatedRelease.html_url,
    action: "refreshed",
    counts_toward_48h_threshold: "no",
    note:
      "Release refresh improves public context and feedback routing only; it does not prove visits, replies, payments, usable intake, objections, or revenue."
  }
];
const header = Object.keys(rows[0]);
const csv = [
  header.join(","),
  ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(","))
].join("\n");

const report = [
  "# GitHub Exposure Release Refresh",
  "",
  `- Generated: ${generatedAt}`,
  `- Repository: ${repoUrl}`,
  `- Release: ${updatedRelease.html_url}`,
  `- Tag: ${tag}`,
  "- Counts toward 48-hour continuation threshold: no",
  "",
  "## Updated Links",
  "",
  "- Live site: https://agentsiteops.com",
  "- Route basis report: https://agentsiteops.com/reports/route-basis/",
  "- Route confidence system: https://agentsiteops.com/reports/route-confidence-system.md",
  "- Analytics summary: https://agentsiteops.com/api/events/summary?days=2",
  "- Structured route feedback: https://github.com/SB980425/shachidainei/issues/new?template=agentsiteops-route-feedback.yml",
  "- Public feedback thread: https://github.com/SB980425/shachidainei/issues/2",
  "- Social preview image: https://agentsiteops.com/og-image.png",
  "",
  "## Boundary",
  "",
  "- A release refresh is a public context update only.",
  "- It does not prove impressions, clicks, visits, replies, payments, usable intake, objections, or revenue.",
  "- Only downstream first-party or external feedback evidence can count toward the threshold."
];

mkdirSync(dirname(csvPath), { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });
mkdirSync(dirname(publicReportPath), { recursive: true });
writeFileSync(csvPath, `${csv}\n`, "utf8");
const reportText = `${report.join("\n")}\n`;
writeFileSync(reportPath, reportText, "utf8");
writeFileSync(publicReportPath, reportText, "utf8");

console.log(
  JSON.stringify(
    {
      status: "github_exposure_release_refreshed",
      generatedAt,
      releaseUrl: updatedRelease.html_url,
      tag,
      countsToward48HourThreshold: false,
      csvPath,
      reportPath,
      publicReportPath
    },
    null,
    2
  )
);
