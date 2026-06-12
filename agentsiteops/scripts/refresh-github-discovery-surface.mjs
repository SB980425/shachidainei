import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(rootDir, "..");
const csvPath = resolve(rootDir, "data", "github-discovery-surface.csv");
const reportPath = resolve(rootDir, "reports", "github-discovery-surface.md");
const publicReportPath = resolve(rootDir, "public", "reports", "github-discovery-surface.md");

const desiredTopics = [
  "ai-search",
  "seo",
  "ai-agents",
  "generative-ai",
  "nextjs",
  "website",
  "launch",
  "productized-service",
  "validation",
  "llms",
  "analytics"
];

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
  const suffix = path ? `/${path}` : "";
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}${suffix}`, {
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

const beforeRepo = await githubRequest("", token);
const beforeTopics = await githubRequest("topics", token);
const mergedTopics = [...new Set([...(beforeTopics.names ?? []), ...desiredTopics])]
  .map((topic) => topic.toLowerCase())
  .filter((topic) => /^[a-z0-9][a-z0-9-]{0,49}$/.test(topic))
  .slice(0, 20);

const description =
  "AgentSiteOps: route-basis, confidence checker, samples, and 48-hour validation for one sellable AI service offer.";
const homepage = "https://agentsiteops.com/launch-kit/";

const afterRepo = await githubRequest("", token, {
  method: "PATCH",
  body: {
    description,
    homepage,
    has_issues: true
  }
});

const afterTopics = await githubRequest("topics", token, {
  method: "PUT",
  body: {
    names: mergedTopics
  }
});

const rows = [
  {
    generated_at: generatedAt,
    repo_url: repoUrl,
    action: "github_discovery_surface_refreshed",
    homepage: afterRepo.homepage ?? "",
    description: afterRepo.description ?? "",
    topics: (afterTopics.names ?? []).join(";"),
    counts_toward_48h_threshold: "no",
    note:
      "GitHub metadata and topics improve public discovery only; they do not prove impressions, clicks, visits, replies, payments, usable intake, objections, or revenue."
  }
];
const header = Object.keys(rows[0]);
const csv = [
  header.join(","),
  ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(","))
].join("\n");

const report = [
  "# GitHub Discovery Surface",
  "",
  `- Generated: ${generatedAt}`,
  `- Repository: ${repoUrl}`,
  `- Homepage: ${afterRepo.homepage ?? ""}`,
  `- Description: ${afterRepo.description ?? ""}`,
  `- Previous topics: ${(beforeTopics.names ?? []).join(", ") || "none"}`,
  `- Current topics: ${(afterTopics.names ?? []).join(", ")}`,
  "- Counts toward 48-hour continuation threshold: no",
  "",
  "## Public Entry Points",
  "",
  "- Launch kit: https://agentsiteops.com/launch-kit/",
  "- Route basis report: https://agentsiteops.com/reports/route-basis/",
  "- Route selection method: https://agentsiteops.com/methodology/route-selection/",
  "- Route Confidence Checker: https://agentsiteops.com/tools/route-confidence-checker/",
  "- Analytics summary: https://agentsiteops.com/api/events/summary?days=2",
  "- Fit Review sample: https://agentsiteops.com/examples/fit-review-sample/",
  "- Public feedback thread: https://github.com/SB980425/shachidainei/issues/2",
  "",
  "## Boundary",
  "",
  "- Repository metadata and topics are public discovery infrastructure.",
  "- They do not prove impressions, clicks, visits, replies, payments, usable intake, objections, or revenue.",
  "- Only downstream first-party or external feedback evidence can count toward the 48-hour threshold."
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
      status: "github_discovery_surface_refreshed",
      generatedAt,
      repoUrl,
      homepage: afterRepo.homepage,
      topics: afterTopics.names,
      countsToward48HourThreshold: false,
      csvPath,
      reportPath,
      publicReportPath
    },
    null,
    2
  )
);
