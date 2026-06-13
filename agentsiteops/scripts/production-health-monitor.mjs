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
const strictSitemap = process.env.PRODUCTION_HEALTH_STRICT_SITEMAP === "1";

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

function requireAbsentText(scope, text, pattern, detail, url) {
  if (typeof pattern === "string" ? !text.includes(pattern) : !pattern.test(text)) {
    addCheck(scope, "pass", detail, url);
    return;
  }

  addCheck(scope, "fail", `Unexpected text present: ${detail}`, url);
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

  if (path === "/buy/" || path === "/pricing/" || path === "/starter-review/") {
    requireAbsentText(path, response.text, /Test PayPal|Test USD|1USD|test_payment/i, "retired payment test copy and link are absent", url);
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
  } else if (!strictSitemap && missing.length > 0 && locs.length > 0) {
    addCheck(
      "sitemap",
      "warn",
      `Expected ${expected.length} URLs; found ${locs.length}; possible deployment lag, missing ${missing.join(", ")}`,
      url
    );
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

async function checkLlmsText() {
  const url = `${siteUrl}/llms.txt`;
  const response = await fetchText(url);
  addCheck("llms_txt", response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  requireText("llms_txt", response.text, "# AgentSiteOps", "llms.txt identifies AgentSiteOps", url);
  requireText("llms_txt", response.text, "Launch kit: https://agentsiteops.com/launch-kit/", "llms.txt points to launch kit", url);
  requireText("llms_txt", response.text, "seal_required", "llms.txt exposes seal rule", url);
  requireText("llms_txt", response.text, "No guaranteed traffic", "llms.txt exposes no-guarantee boundary", url);

  const fullUrl = `${siteUrl}/llms-full.txt`;
  const fullResponse = await fetchText(fullUrl);
  addCheck("llms_full_txt", fullResponse.ok ? "pass" : "fail", `HTTP ${fullResponse.status}`, fullUrl);

  if (!fullResponse.ok) {
    return;
  }

  requireText("llms_full_txt", fullResponse.text, "Evidence Hierarchy", "llms-full.txt exposes evidence hierarchy", fullUrl);
  requireText("llms_full_txt", fullResponse.text, "48-Hour Rule", "llms-full.txt exposes 48-hour rule", fullUrl);
  requireText("llms_full_txt", fullResponse.text, "Current State", "llms-full.txt exposes current state", fullUrl);
}

async function checkBrandIcon() {
  const faviconUrl = `${siteUrl}/favicon.ico`;
  const favicon = await fetchText(faviconUrl);
  addCheck("brand_favicon", favicon.ok ? "pass" : "fail", `HTTP ${favicon.status}`, faviconUrl);

  if (favicon.ok) {
    const contentType = favicon.headers.get("content-type") ?? "";
    if (/image\/x-icon|image\/vnd\.microsoft\.icon|application\/octet-stream/i.test(contentType)) {
      addCheck("brand_favicon", "pass", `favicon content-type ${contentType}`, faviconUrl);
    } else {
      addCheck("brand_favicon", "warn", `Unexpected favicon content-type ${contentType}`, faviconUrl);
    }
  }

  const url = `${siteUrl}/icon.svg`;
  const response = await fetchText(url);
  addCheck("brand_icon", response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  requireText("brand_icon", response.text, "<svg", "SVG icon exists", url);
  requireText("brand_icon", response.text, "AgentSiteOps", "icon has accessible brand label", url);

  const pngUrl = `${siteUrl}/icon-32.png`;
  const png = await fetchText(pngUrl);
  addCheck("brand_icon_png", png.ok ? "pass" : "fail", `HTTP ${png.status}`, pngUrl);
}

async function checkAnalyticsSummary() {
  const url = `${siteUrl}/api/events/summary?days=2`;
  const response = await fetchText(url);
  addCheck("analytics_summary", response.ok ? "pass" : "fail", `HTTP ${response.status}`, url);

  if (!response.ok) {
    return;
  }

  requireText("analytics_summary", response.text, "counts_by_event", "aggregate event counts exist", url);
  requireText("analytics_summary", response.text, "threshold_snapshot", "threshold snapshot exists", url);
  requireText("analytics_summary", response.text, "No IP address", "privacy boundary is visible", url);
  requireAbsentText("analytics_summary", response.text, /user-agent|cf-connecting-ip|set-cookie/i, "identity headers are not exposed", url);
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
    "- Sitemap route-count mismatches are warnings by default because CI can run before the newest deployment is live.",
    "- Set `PRODUCTION_HEALTH_STRICT_SITEMAP=1` after deployment when sitemap parity must block readiness.",
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
  await checkLlmsText();
  await checkBrandIcon();
  await checkAnalyticsSummary();
  await checkPage("/", [
    "Route workspace",
    "Score, prune, export",
    "How AgentSiteOps becomes our route planner.",
    "Existing functions preserved",
    "Fit Review",
    "Evidence used, not guessed",
    "What the buyer receives is a route file, not a score",
    "Market signals are context, not proof",
    "Every new project starts with a route map before a build."
  ]);
  await checkPage("/templates/route-research-prompt-pack/", [
    "Free manual Deep Research plan",
    "The free plan does not call the OpenAI API",
    "Generate, check, repair, and fuse the route research",
    "Copy Deep Research prompt",
    "Local acceptance check",
    "Second-pass gap prompt",
    "Route-file synthesis skeleton",
    "Decision matrix",
    "Research delivery loop",
    "Acceptance gate before delivery",
    "Second manual pass when needed",
    "The final delivery is one fused route file"
  ]);
  await checkPage("/reports/agentsiteops-route-run/", [
    "AgentSiteOps Route Run",
    "Selected route",
    "Rejected alternatives",
    "Evidence used",
    "First proof asset",
    "Stop or pivot rule"
  ]);
  await checkPage("/reports/route-basis/", [
    "Route pattern library",
    "Route selection source map",
    "Confidence rubric",
    "Project route fit matrix",
    "Data-backed basis"
  ]);
  await checkPage("/pricing/", [
    "Choose the smallest purchase that can answer the decision",
    "AgentSiteOps Launch Blueprint",
    "Fit Review",
    "USD",
    "PayPal",
    "Why pay for a manual route",
    "What USD 99 must produce"
  ]);
  await checkPage("/pricing/", ["Objections that should block or redirect payment", "I can ask ChatGPT for this."]);
  await checkPage("/examples/fit-review-sample/", ["A smaller paid verdict", "Do not buy the USD 99 blueprint yet", "It does not prove traffic"]);
  await checkPage("/sample/", ["What a Launch Blueprint looks like", "Sample", "What the paid file must contain", "Check fit first"]);
  await checkPage("/compare/", ["Compare AgentSiteOps before buying", "Generic AI chat", "Do not buy for these jobs"]);
  await checkPage("/compare/", ["Common objections before payment", "I need someone to build it, not just advise."]);
  await checkPage("/examples/agentsiteops-self-audit/", ["AgentSiteOps Self-Audit Sample", "52/100", "commercially unvalidated"]);
  await checkPage("/starter-review/", ["Get a go, narrow, or stop verdict", "USD", "reject the larger sale"]);
  await checkPage("/buy/", ["Get one sellable offer", "Pay with PayPal", "Acceptance criteria", "If the route is not ready"]);
  await checkPage("/intake/", ["Order Intake", "Email intake", "Payment confirmation", "Manual delivery process"]);
  await checkPage("/evidence/", ["Evidence Ledger", "Verified evidence", "Current objective self-score", "Score update rules", "52/100", "Claims not made"]);
  await checkPage("/tools/audit-scope-builder/", ["Audit Scope Builder", "local-only", "No payment, account, identity"]);
  await checkPage("/tools/launch-blueprint-fit-checker/", ["Launch Blueprint Fit Checker", "Do not buy", "No request, account, payment"]);
  await checkPage("/checklists/launch-validation-decision-gate/", [
    "Launch Validation Decision Gate",
    "Stop, rewrite, or pivot before scaling",
    "PayPal clicks without confirmed payment are not revenue",
    "IndexNow success is not demand",
    "pivot_to_implementation"
  ]);
  await checkPage("/methodology/route-selection/", [
    "Route Selection Methodology",
    "The score is only a gate. The route comes from evidence.",
    "Route source map",
    "Confidence bands",
    "Project route fit matrix"
  ]);
  await checkPage("/guides/first-traffic-system/", [
    "First Traffic System",
    "The first traffic plan does not wait for Google alone",
    "48-hour exposure loop",
    "Manual outreach",
    "Signals that count"
  ]);
  await checkPage("/guides/48-hour-exposure-sprint/", [
    "48-Hour Exposure Sprint",
    "The 48-hour sprint treats exposure as a validation system",
    "Execution windows",
    "Decision at hour 48",
    "pivot_to_implementation"
  ]);
  await checkPage("/launch-kit/", [
    "AgentSiteOps Launch Kit",
    "Current status",
    "52/100",
    "What the buyer receives",
    "Evidence to inspect first",
    "48-hour seal rule",
    "seal_required"
  ]);
  await checkPage("/reports/route-evidence-dashboard/", ["Route Evidence Dashboard", "Route evidence table", "GSC pending"]);
  await checkPage("/privacy/", ["PayPal", "manual", "no account"]);
  await checkPage("/updates/", [
    "Updates",
    "M4-22 48-hour exposure sprint",
    "M4-21 Route basis and first traffic foundation",
    "M4-20 Evidence-led value layer",
    "evidence-bounded route-selection service",
    "M4-17 Self-score maintenance protocol",
    "M4-16 Objective self-score calibration",
    "M4-15 Launch validation decision gate",
    "M4-14 Objection response conversion layer",
    "M4-13 Search evidence import guardrail",
    "M4-12 Manual outreach evidence loop",
    "M4-11 Delivery artifact templates",
    "M4-10 Fit Review sample artifact",
    "M4-09 Fit Review entry offer",
    "M4-08 Launch funnel evidence boundary",
    "M4-07 Intake and manual fulfillment path",
    "M4-06 Purchase acceptance and encoding gate",
    "M4-05 Quality gate and evidence-ready sample",
    "M4-04 Pre-purchase fit checker",
    "M4-03 Launch comparison and sample depth",
    "M4-01 Launch Blueprint reset and payment flow",
    "IndexNow submit pass"
  ]);

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
