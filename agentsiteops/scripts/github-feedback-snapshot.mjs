import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(rootDir, "..");
const snapshotPath = resolve(rootDir, "data", "github-feedback-snapshot.json");
const csvPath = resolve(rootDir, "data", "github-feedback-summary.csv");
const reportPath = resolve(rootDir, "reports", "github-feedback-snapshot.md");

const issueNumber = 2;
const feedbackLabel = "agentsiteops-feedback";
const internalAssociations = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
const boundary =
  "Maintainer comments, issue creation, and feedback template availability do not count as qualified external replies. External comments and structured feedback issues are candidates only until manually reviewed for a concrete buyer problem, objection, pricing blocker, sample critique, or implementation-pivot signal.";

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

function latestTimestamp(comments) {
  const timestamps = comments
    .map((comment) => comment.created_at)
    .filter(Boolean)
    .sort();
  return timestamps.at(-1) ?? "";
}

const remoteUrl = runGit(["remote", "get-url", "origin"]);
const repo = parseRemote(remoteUrl);
const repoUrl = `https://github.com/${repo.owner}/${repo.repo}`;
const issueUrl = `${repoUrl}/issues/${issueNumber}`;
const token = credentialToken();

const [issue, comments] = await Promise.all([
  githubGet(`issues/${issueNumber}`, token),
  githubGet(`issues/${issueNumber}/comments?per_page=100`, token)
]);

const feedbackIssues = (await githubGet(
  `issues?state=open&labels=${encodeURIComponent(feedbackLabel)}&per_page=100`,
  token
)).filter((item) => !item.pull_request);

const commentsByAssociation = comments.reduce((counts, comment) => {
  const association = comment.author_association || "UNKNOWN";
  counts[association] = (counts[association] ?? 0) + 1;
  return counts;
}, {});

const maintainerCommentCount = comments.filter((comment) =>
  internalAssociations.has(comment.author_association)
).length;
const externalCommentCount = comments.length - maintainerCommentCount;
const feedbackIssuesByAssociation = feedbackIssues.reduce((counts, issueItem) => {
  const association = issueItem.author_association || "UNKNOWN";
  counts[association] = (counts[association] ?? 0) + 1;
  return counts;
}, {});
const maintainerFeedbackIssueCount = feedbackIssues.filter((issueItem) =>
  internalAssociations.has(issueItem.author_association)
).length;
const externalFeedbackIssueCount = feedbackIssues.length - maintainerFeedbackIssueCount;
const candidateExternalReplyCount = externalCommentCount + externalFeedbackIssueCount;
const qualifiedReplyCount = 0;
const manualReviewRequired = candidateExternalReplyCount > 0;

const generatedAt = new Date().toISOString();
const snapshot = {
  generatedAt,
  repo,
  repoUrl,
  issue: {
    number: issueNumber,
    url: issue.html_url || issueUrl,
    state: issue.state,
    publicCommentCount: issue.comments ?? comments.length,
    fetchedCommentCount: comments.length,
    latestCommentAt: latestTimestamp(comments)
  },
  structuredFeedback: {
    label: feedbackLabel,
    newIssueUrl: `${repoUrl}/issues/new?template=agentsiteops-route-feedback.yml`,
    issueCount: feedbackIssues.length,
    maintainerFeedbackIssueCount,
    externalFeedbackIssueCount
  },
  countsToward48HourThreshold: false,
  boundary,
  classification: {
    maintainerCommentCount,
    externalCommentCount,
    candidateExternalReplyCount,
    qualifiedReplyCount,
    manualReviewRequired,
    commentsByAssociation,
    feedbackIssuesByAssociation
  },
  privacy: {
    storesUsernames: false,
    storesCommentBodies: false,
    storesPrivateReplies: false
  }
};

const csvRows = [
  {
    metric: "issue_public_comment_count",
    value: snapshot.issue.publicCommentCount,
    counts_toward_48h_threshold: "no",
    note: "Total public GitHub issue comment count; includes maintainer comments."
  },
  {
    metric: "maintainer_comment_count",
    value: maintainerCommentCount,
    counts_toward_48h_threshold: "no",
    note: "Maintainer comments do not count as qualified external replies."
  },
  {
    metric: "candidate_external_reply_count",
    value: candidateExternalReplyCount,
    counts_toward_48h_threshold: "no",
    note: "External comments and structured feedback issues require manual review before any threshold update."
  },
  {
    metric: "structured_feedback_issue_count",
    value: feedbackIssues.length,
    counts_toward_48h_threshold: "no",
    note: "Total open issues carrying the agentsiteops-feedback label."
  },
  {
    metric: "candidate_external_feedback_issue_count",
    value: externalFeedbackIssueCount,
    counts_toward_48h_threshold: "no",
    note: "External structured feedback issues require manual review before any threshold update."
  },
  {
    metric: "qualified_reply_count",
    value: qualifiedReplyCount,
    counts_toward_48h_threshold: "no",
    note: "No GitHub comment has been manually qualified in this snapshot."
  }
];

const csvHeader = [
  "generated_at",
  "issue_url",
  "metric",
  "value",
  "counts_toward_48h_threshold",
  "note"
];

const csvLines = [
  csvHeader.join(","),
  ...csvRows.map((row) =>
    csvHeader
      .map((key) =>
        csvEscape(key === "generated_at" ? generatedAt : key === "issue_url" ? issueUrl : row[key])
      )
      .join(",")
  )
];

const associationRows = Object.entries(commentsByAssociation).length
  ? Object.entries(commentsByAssociation).map(
      ([association, count]) => `| ${mdEscape(association)} | ${count} |`
    )
  : ["| None | 0 |"];
const feedbackAssociationRows = Object.entries(feedbackIssuesByAssociation).length
  ? Object.entries(feedbackIssuesByAssociation).map(
      ([association, count]) => `| ${mdEscape(association)} | ${count} |`
    )
  : ["| None | 0 |"];

const report = [
  "# GitHub Feedback Snapshot",
  "",
  `- Generated: ${generatedAt}`,
  `- Repository: ${repoUrl}`,
  `- Issue: ${issueUrl}`,
  `- Structured feedback template: ${repoUrl}/issues/new?template=agentsiteops-route-feedback.yml`,
  `- Issue state: ${issue.state}`,
  `- Public comment count: ${snapshot.issue.publicCommentCount}`,
  `- Fetched comments: ${comments.length}`,
  "- Counts toward 48-hour continuation threshold: no",
  `- Boundary: ${boundary}`,
  "",
  "## Classification",
  "",
  "| Metric | Count |",
  "|---|---:|",
  `| Maintainer comments | ${maintainerCommentCount} |`,
  `| Structured feedback issues | ${feedbackIssues.length} |`,
  `| External structured feedback issues | ${externalFeedbackIssueCount} |`,
  `| Candidate external replies | ${candidateExternalReplyCount} |`,
  `| Qualified replies counted | ${qualifiedReplyCount} |`,
  `| Manual review required | ${manualReviewRequired ? 1 : 0} |`,
  "",
  "## Author Associations",
  "",
  "| Association | Count |",
  "|---|---:|",
  ...associationRows,
  "",
  "## Structured Feedback Issue Associations",
  "",
  "| Association | Count |",
  "|---|---:|",
  ...feedbackAssociationRows,
  "",
  "## Privacy Boundary",
  "",
  "- This snapshot stores aggregate counts only.",
  "- It does not store usernames, handles, emails, comment bodies, payment identifiers, or private replies.",
  "- If candidate external replies or structured feedback issues appear, review the public thread or issue manually and update the exposure evidence template only when the reply contains a concrete buyer problem, objection, pricing blocker, sample critique, or implementation-pivot signal."
];

mkdirSync(dirname(snapshotPath), { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
writeFileSync(csvPath, `${csvLines.join("\n")}\n`, "utf8");
writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "github_feedback_snapshot_imported",
      generatedAt,
      issueUrl,
      countsToward48HourThreshold: false,
      classification: snapshot.classification,
      snapshotPath,
      csvPath,
      reportPath
    },
    null,
    2
  )
);
