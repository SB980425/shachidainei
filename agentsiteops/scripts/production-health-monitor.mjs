import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const routesPath = resolve(rootDir, "docs", "routes.json");
const reportPath = resolve(rootDir, "reports", "production-health-monitor.md");
const csvPath = resolve(rootDir, "data", "production-health-snapshot.csv");
const siteUrl = "https://agentsiteops.com";
const wwwUrl = "https://www.agentsiteops.com/";
const indexNowKeyPath = "/32bc6ba6e277f850a701747381a57c48.txt";

const checks = [];
const blockers = [];
const warnings = [];

function read(path) {
  return readFileSync(path, "utf8");
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

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  try {
    const response = await fetch(url, {
      redirect: options.redirect ?? "follow",
      signal: controller.signal
    });
    const text = await response.text();
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      url: response.url,
      headers: response.headers,
      text
    };
  } finally {
    clearTimeout(timeout);
  }
}

function addCheck(scope, status, detail, url = "") {
  checks.push({ scope, status, detail, url });
  if (status === "fail") {
    blockers.push({ scope, detail });
  }
  if (status === "warn") {
    warnings.push({ scope, detail });
  }
}

function requireText(scope, text, pattern, detail, url) {
  if (typeof pattern === "string" ? text.includes(pattern) : pattern.test(text)) {
    addCheck(scope, "pass", detail, url);
    return;
  }

  addCheck(scope, "fail", `Missing expected text: ${detail}`, url);
}

function countSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

async function checkPage(path, requiredText) {
  const url = `${siteUrl}${path}`;
  const response = await fetchText(url);
  addCheck(path, response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  requireText(path, response.text, "<title>", "HTML title exists", url);
  requireText(path, response.text, `href="${siteUrl}${path}"`, "canonical points to production URL", url);

  for (const item of requiredText) {
    requireText(path, response.text, item, item, url);
  }
}

async function checkWwwRedirect() {
  const response = await fetchText(wwwUrl, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  const isRedirect = [301, 302, 307, 308].includes(response.status);

  if (isRedirect && location.startsWith(siteUrl)) {
    addCheck("www_redirect", "pass", `HTTP ${response.status} to ${location}`, wwwUrl);
    return;
  }

  addCheck("www_redirect", "fail", `Expected redirect to ${siteUrl}; got HTTP ${response.status} ${location}`, wwwUrl);
}

async function checkSitemap(routeDoc) {
  const url = `${siteUrl}/sitemap.xml`;
  const response = await fetchText(url);
  addCheck("sitemap", response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  const locs = countSitemapLocs(response.text);
  const expected = routeDoc.routes.map((route) => `${siteUrl}${route.path}`);
  const missing = expected.filter((routeUrl) => !locs.includes(routeUrl));

  if (locs.length === expected.length && missing.length === 0) {
    addCheck("sitemap", "pass", `${locs.length} URLs match route registry`, url);
  } else {
    addCheck(
      "sitemap",
      "fail",
      `Expected ${expected.length} URLs; found ${locs.length}; missing ${missing.join(", ") || "none"}`,
      url
    );
  }
}

async function checkRobots() {
  const url = `${siteUrl}/robots.txt`;
  const response = await fetchText(url);
  addCheck("robots", response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  requireText("robots", response.text, "OAI-SearchBot", "OAI-SearchBot policy visible", url);
  requireText("robots", response.text, "ChatGPT-User", "ChatGPT-User policy visible", url);
  requireText("robots", response.text, "PerplexityBot", "PerplexityBot policy visible", url);
  requireText("robots", response.text, "User-Agent: GPTBot", "GPTBot policy visible", url);
  requireText("robots", response.text, "Disallow: /", "training crawler disallow visible", url);
  requireText("robots", response.text, "Sitemap: https://agentsiteops.com/sitemap.xml", "sitemap pointer visible", url);
}

async function checkIndexNowKey() {
  const url = `${siteUrl}${indexNowKeyPath}`;
  const response = await fetchText(url);
  addCheck("indexnow_key", response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  requireText("indexnow_key", response.text.trim(), "32bc6ba6e277f850a701747381a57c48", "key file content matches public key", url);
}

function renderReport(generatedAt) {
  const status = blockers.length ? "blocked" : warnings.length ? "warning" : "pass";
  const lines = [
    "# Production Health Monitor",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    `- Site: ${siteUrl}`,
    `- Checks: ${checks.length}`,
    `- Blockers: ${blockers.length}`,
    `- Warnings: ${warnings.length}`,
    "",
    "## Summary",
    "",
    "| Scope | Status | Detail | URL |",
    "|---|---|---|---|",
    ...checks.map((check) =>
      [
        "|",
        mdEscape(check.scope),
        "|",
        check.status,
        "|",
        mdEscape(check.detail),
        "|",
        check.url ? `[link](${check.url})` : "-",
        "|"
      ].join(" ")
    ),
    "",
    "## Blocking Issues",
    "",
    ...(blockers.length ? blockers.map((item) => `- ${item.scope}: ${item.detail}`) : ["- None"]),
    "",
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((item) => `- ${item.scope}: ${item.detail}`) : ["- None"]),
    "",
    "## Interpretation",
    "",
    "- This monitor checks production availability and proof-boundary pages.",
    "- It does not prove indexing, AI citation, traffic, conversion, or revenue.",
    "- Run it after deployment and before claiming production readiness."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);

  const csvHeader = ["generated_at", "scope", "status", "detail", "url"];
  const csvLines = [
    csvHeader.join(","),
    ...checks.map((check) =>
      [
        generatedAt,
        check.scope,
        check.status,
        check.detail,
        check.url
      ].map(csvEscape).join(",")
    )
  ];

  mkdirSync(dirname(csvPath), { recursive: true });
  writeFileSync(csvPath, `${csvLines.join("\n")}\n`);

  return { status };
}

async function main() {
  const generatedAt = new Date().toISOString();
  const routeDoc = JSON.parse(read(routesPath));

  await checkWwwRedirect();
  await checkSitemap(routeDoc);
  await checkRobots();
  await checkIndexNowKey();
  await checkPage("/", ["AI Website Operating System", "Score a site idea"]);
  await checkPage("/evidence/", ["Evidence Ledger", "Verified evidence", "Pending evidence", "Claims not made"]);
  await checkPage("/privacy/", ["Analytics endpoint gate", "Cloudflare hosting analytics", "not enabled"]);
  await checkPage("/updates/", ["Updates", "M3-21 Analytics endpoint compliance gate", "IndexNow submit pass with 18 URLs"]);

  const report = renderReport(generatedAt);

  console.log(
    JSON.stringify(
      {
        status: report.status,
        checks: checks.length,
        blockers: blockers.length,
        warnings: warnings.length,
        reportPath,
        csvPath
      },
      null,
      2
    )
  );

  if (blockers.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  addCheck("runtime", "fail", error.message);
  const report = renderReport(new Date().toISOString());
  console.error(`production-health-monitor ${report.status}: ${error.message}`);
  process.exitCode = 1;
});
