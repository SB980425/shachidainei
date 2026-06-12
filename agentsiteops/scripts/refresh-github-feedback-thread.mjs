import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(rootDir, "..");
const csvPath = resolve(rootDir, "data", "github-feedback-thread-refresh.csv");
const reportPath = resolve(rootDir, "reports", "github-feedback-thread-refresh.md");
const publicReportPath = resolve(rootDir, "public", "reports", "github-feedback-thread-refresh.md");
const issueNumber = 2;

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
const issueUrl = `${repoUrl}/issues/${issueNumber}`;

const title = "AgentSiteOps 48-hour route feedback request";
const body = [
  "AgentSiteOps is in a 48-hour exposure validation window.",
  "",
  "Current state:",
  "",
  "- Live site: https://agentsiteops.com",
  "- Launch kit: https://agentsiteops.com/launch-kit/",
  "- Route basis report: https://agentsiteops.com/reports/route-basis/",
  "- Route selection method: https://agentsiteops.com/methodology/route-selection/",
  "- Fit Review sample: https://agentsiteops.com/examples/fit-review-sample/",
  "- Launch Blueprint sample: https://agentsiteops.com/sample/",
  "- Pricing: https://agentsiteops.com/pricing/",
  "- AI-readable summary: https://agentsiteops.com/llms.txt",
  "- Analytics summary: https://agentsiteops.com/api/events/summary?days=2",
  "",
  "Current validation boundary:",
  "",
  "- Public self-score: 52/100.",
  "- Technical launch is live.",
  "- Commercial validation is not proven.",
  "- PayPal clicks, GitHub traffic, sitemap success, IndexNow success, crawler access, endpoint availability, and release updates are not demand proof.",
  "",
  "Useful external feedback:",
  "",
  "1. Is the Route Basis enough to make the roadmap less generic than a normal AI answer?",
  "2. Does the USD 29 Fit Review solve a narrow enough first problem?",
  "3. Does the USD 99 Launch Blueprint justify its price from the visible sample?",
  "4. Would the buyer need implementation instead of advice?",
  "5. What trust, proof, or outcome gap would block payment?",
  "",
  "Do not include private customer data, payment data, account credentials, personal contact details, or private replies.",
  "",
  "This issue is public. Maintainer edits and comments do not count as qualified external replies. Only external comments with concrete buyer problems, objections, pricing blockers, sample critique, or implementation-pivot signals can become candidate threshold evidence after manual review."
].join("\n");

const issue = await githubRequest(`issues/${issueNumber}`, token, {
  method: "PATCH",
  body: {
    title,
    body,
    labels: ["agentsiteops-feedback"]
  }
});

const rows = [
  {
    generated_at: generatedAt,
    repo_url: repoUrl,
    issue_url: issue.html_url,
    action: "github_feedback_thread_refreshed",
    counts_toward_48h_threshold: "no",
    note:
      "Feedback thread body refresh improves public feedback routing only; maintainer edits do not prove replies, visits, payments, usable intake, objections, or revenue."
  }
];
const header = Object.keys(rows[0]);
const csv = [
  header.join(","),
  ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(","))
].join("\n");

const report = [
  "# GitHub Feedback Thread Refresh",
  "",
  `- Generated: ${generatedAt}`,
  `- Repository: ${repoUrl}`,
  `- Issue: ${issue.html_url}`,
  `- Title: ${issue.title}`,
  "- Counts toward 48-hour continuation threshold: no",
  "",
  "## Updated Links",
  "",
  "- Live site: https://agentsiteops.com",
  "- Analytics summary: https://agentsiteops.com/api/events/summary?days=2",
  "- Route basis report: https://agentsiteops.com/reports/route-basis/",
  "- Fit Review sample: https://agentsiteops.com/examples/fit-review-sample/",
  "- Launch Blueprint sample: https://agentsiteops.com/sample/",
  "",
  "## Feedback Questions",
  "",
  "- Is the Route Basis enough to make the roadmap less generic than a normal AI answer?",
  "- Does the USD 29 Fit Review solve a narrow enough first problem?",
  "- Does the USD 99 Launch Blueprint justify its price from the visible sample?",
  "- Would the buyer need implementation instead of advice?",
  "- What trust, proof, or outcome gap would block payment?",
  "",
  "## Boundary",
  "",
  "- This is a maintainer-controlled public feedback surface update.",
  "- It does not prove impressions, clicks, visits, replies, payments, usable intake, objections, or revenue.",
  "- Only downstream external feedback can become candidate threshold evidence after manual review."
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
      status: "github_feedback_thread_refreshed",
      generatedAt,
      issueUrl: issue.html_url,
      countsToward48HourThreshold: false,
      csvPath,
      reportPath,
      publicReportPath
    },
    null,
    2
  )
);
