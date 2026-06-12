import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(rootDir, "..");
const csvPath = resolve(rootDir, "data", "github-feedback-label.csv");
const reportPath = resolve(rootDir, "reports", "github-feedback-label.md");
const labelName = "agentsiteops-feedback";

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

  if (response.status === 404 && options.allowNotFound) {
    return null;
  }

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

let label = await githubRequest(`labels/${encodeURIComponent(labelName)}`, token, {
  allowNotFound: true
});
let action = "existing";

if (!label) {
  label = await githubRequest("labels", token, {
    method: "POST",
    body: {
      name: labelName,
      color: "1769ff",
      description: "Public AgentSiteOps route feedback and objections"
    }
  });
  action = "created";
}

const issueTemplateUrl = `${repoUrl}/issues/new?template=agentsiteops-route-feedback.yml`;
const rows = [
  {
    generated_at: generatedAt,
    repo_url: repoUrl,
    label: labelName,
    action,
    label_url: label.url,
    issue_template_url: issueTemplateUrl,
    counts_toward_48h_threshold: "no",
    note:
      "Label availability supports structured feedback intake only; it does not prove external replies or demand."
  }
];

const header = Object.keys(rows[0]);
const csv = [
  header.join(","),
  ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(","))
].join("\n");

const report = [
  "# GitHub Feedback Label",
  "",
  `- Generated: ${generatedAt}`,
  `- Repository: ${repoUrl}`,
  `- Label: ${labelName}`,
  `- Action: ${action}`,
  `- Structured issue template: ${issueTemplateUrl}`,
  "- Counts toward 48-hour continuation threshold: no",
  "",
  "## Boundary",
  "",
  "- The label and issue template make public feedback easier to submit and classify.",
  "- They do not prove replies, demand, visits, payments, usable intake, objections, or revenue.",
  "- Only submitted external issues or comments can become candidate signals after manual review."
];

mkdirSync(dirname(csvPath), { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(csvPath, `${csv}\n`, "utf8");
writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "github_feedback_label_ready",
      generatedAt,
      repoUrl,
      label: labelName,
      action,
      issueTemplateUrl,
      countsToward48HourThreshold: false,
      csvPath,
      reportPath
    },
    null,
    2
  )
);
