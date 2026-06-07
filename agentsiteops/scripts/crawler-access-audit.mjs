import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "crawler-access-audit.md");
const siteUrl = process.env.CRAWLER_AUDIT_URL ?? "https://agentsiteops.com";
const targetPath = process.env.CRAWLER_AUDIT_PATH ?? "/checklists/ai-citation-readiness/";
const blockers = [];
const warnings = [];

const crawlerChecks = [
  { userAgent: "Googlebot", expectedRobots: "allow", purpose: "google_search" },
  { userAgent: "Bingbot", expectedRobots: "allow", purpose: "bing_search" },
  { userAgent: "OAI-SearchBot", expectedRobots: "allow", purpose: "chatgpt_search" },
  { userAgent: "ChatGPT-User", expectedRobots: "allow", purpose: "chatgpt_user_retrieval" },
  { userAgent: "Claude-SearchBot", expectedRobots: "allow", purpose: "claude_search" },
  { userAgent: "Claude-User", expectedRobots: "allow", purpose: "claude_user_retrieval" },
  { userAgent: "PerplexityBot", expectedRobots: "allow", purpose: "perplexity_search" },
  { userAgent: "GPTBot", expectedRobots: "disallow", purpose: "openai_training" },
  { userAgent: "ClaudeBot", expectedRobots: "disallow", purpose: "anthropic_training" }
];

function joinUrl(path) {
  return new URL(path, siteUrl).toString();
}

function stripHtml(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : "";
}

function parseRobots(robotsText) {
  const groups = [];
  let current = null;

  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (!line) continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (key === "user-agent") {
      if (!current || current.seenRule) {
        current = { agents: [], allow: [], disallow: [], seenRule: false };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      continue;
    }

    if (!current) continue;

    if (key === "allow") {
      current.allow.push(value || "/");
      current.seenRule = true;
    }

    if (key === "disallow") {
      current.disallow.push(value || "");
      current.seenRule = true;
    }
  }

  return groups;
}

function ruleFor(groups, userAgent) {
  const lower = userAgent.toLowerCase();
  const exact = groups.find((group) => group.agents.includes(lower));
  const wildcard = groups.find((group) => group.agents.includes("*"));
  const group = exact ?? wildcard;

  if (!group) return "unknown";
  if (group.disallow.includes("/")) return "disallow";
  if (group.allow.includes("/") || group.allow.length > 0) return "allow";
  return "unknown";
}

async function fetchText(url, userAgent = "AgentSiteOpsCrawlerAudit/1.0") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": userAgent },
      redirect: "manual",
      signal: controller.signal
    });
    const text = await response.text();
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      location: response.headers.get("location") ?? "",
      server: response.headers.get("server") ?? "",
      text
    };
  } finally {
    clearTimeout(timeout);
  }
}

function row(values) {
  return `| ${values.map((value) => String(value ?? "").replace(/\|/g, "\\|")).join(" | ")} |`;
}

function addBlocker(scope, message) {
  blockers.push({ scope, message });
}

function addWarning(scope, message) {
  warnings.push({ scope, message });
}

const robotsUrl = joinUrl("/robots.txt");
const sitemapUrl = joinUrl("/sitemap.xml");
const targetUrl = joinUrl(targetPath);

const robots = await fetchText(robotsUrl);
const sitemap = await fetchText(sitemapUrl);
const target = await fetchText(targetUrl);

if (!robots.ok) addBlocker("robots", `robots.txt returned HTTP ${robots.status}`);
if (!sitemap.ok) addBlocker("sitemap", `sitemap.xml returned HTTP ${sitemap.status}`);
if (!target.ok) addBlocker("target", `${targetUrl} returned HTTP ${target.status}`);

const robotsGroups = parseRobots(robots.text);
const hasCloudflareManaged = /Cloudflare Managed|Content-signal/i.test(robots.text);

if (hasCloudflareManaged) {
  addWarning("cloudflare", "Cloudflare managed robots or content signals appear in robots.txt; verify they match the AgentSiteOps crawler policy.");
}

const sitemapLocs = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (!sitemapLocs.includes(targetUrl)) {
  addBlocker("sitemap", `${targetUrl} is missing from sitemap.xml`);
}

const crawlerResults = [];
for (const check of crawlerChecks) {
  const robotsDecision = ruleFor(robotsGroups, check.userAgent);
  let pageResult;

  try {
    pageResult = await fetchText(targetUrl, check.userAgent);
  } catch (error) {
    pageResult = {
      ok: false,
      status: "ERR",
      location: "",
      server: "",
      text: error.message
    };
  }

  const title = pageResult.ok ? extractTitle(pageResult.text) : "";

  if (robotsDecision !== check.expectedRobots) {
    addBlocker(
      check.userAgent,
      `Expected robots ${check.expectedRobots}, got ${robotsDecision}`
    );
  }

  if (check.expectedRobots === "allow" && !pageResult.ok) {
    addBlocker(check.userAgent, `Expected page access, got HTTP ${pageResult.status}`);
  }

  if (check.expectedRobots === "allow" && !title.includes("AI Citation Readiness Checklist")) {
    addWarning(check.userAgent, "Page returned without expected title text");
  }

  crawlerResults.push({
    ...check,
    robotsDecision,
    httpStatus: pageResult.status,
    title,
    server: pageResult.server,
    location: pageResult.location
  });
}

const status = blockers.length ? "BLOCKED" : "PASS";
const generatedAt = new Date().toISOString();
const lines = [
  "# Crawler Access Audit",
  "",
  `- Generated: ${generatedAt}`,
  `- Status: ${status}`,
  `- Site: ${siteUrl}`,
  `- Target: ${targetUrl}`,
  `- Sitemap URLs: ${sitemapLocs.length}`,
  `- Cloudflare managed robots detected: ${hasCloudflareManaged ? "yes" : "no"}`,
  "",
  "## Summary",
  "",
  row(["Check", "Result"]),
  row(["---", "---"]),
  row(["robots.txt", robots.ok ? `pass HTTP ${robots.status}` : `fail HTTP ${robots.status}`]),
  row(["sitemap.xml", sitemap.ok ? `pass HTTP ${sitemap.status}` : `fail HTTP ${sitemap.status}`]),
  row(["target page", target.ok ? `pass HTTP ${target.status}` : `fail HTTP ${target.status}`]),
  row(["blockers", blockers.length]),
  row(["warnings", warnings.length]),
  "",
  "## Crawler Results",
  "",
  row(["User agent", "Purpose", "Expected robots", "Actual robots", "HTTP", "Title"]),
  row(["---", "---", "---", "---", "---", "---"]),
  ...crawlerResults.map((result) =>
    row([
      result.userAgent,
      result.purpose,
      result.expectedRobots,
      result.robotsDecision,
      result.httpStatus,
      result.title || result.location || "-"
    ])
  ),
  "",
  "## robots.txt",
  "",
  "```txt",
  robots.text.trim(),
  "```",
  "",
  "## Blocking Issues",
  "",
  ...(blockers.length ? blockers.map((item) => `- ${item.scope}: ${item.message}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length ? warnings.map((item) => `- ${item.scope}: ${item.message}`) : ["- None"]),
  "",
  "## Interpretation",
  "",
  "- Search and user-retrieval crawlers should be allowed when AI discovery is the goal.",
  "- Training crawlers can be disallowed without claiming that search visibility is guaranteed.",
  "- HTTP 200 for a crawler does not override robots preference; robots directives are a policy signal and are voluntary for crawlers.",
  "- CDN, WAF, and bot-protection settings must be checked again if this report changes from PASS to BLOCKED."
];

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status,
      reportPath,
      blockers: blockers.length,
      warnings: warnings.length,
      crawlerResults
    },
    null,
    2
  )
);

if (blockers.length) {
  process.exit(1);
}
