import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "commercial-validation-gate.md");

const requiredRoutes = [
  "/tools/ai-crawler-readiness/",
  "/examples/agentsiteops-self-audit/",
  "/services/ai-website-opportunity-audit/"
];

const checks = [];
const blockers = [];

function read(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), "utf8");
}

function addCheck(scope, status, detail) {
  checks.push({ scope, status, detail });
  if (status === "fail") {
    blockers.push({ scope, detail });
  }
}

function requireText(scope, text, expected, detail) {
  addCheck(scope, text.includes(expected) ? "pass" : "fail", detail);
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function hasMojibake(text) {
  return /[�锟鐠閺閻涓]/.test(text);
}

function checkRoutes() {
  const routes = JSON.parse(read("docs/routes.json"));
  const paths = new Set(routes.routes.map((route) => route.path));

  for (const route of requiredRoutes) {
    addCheck("routes", paths.has(route) ? "pass" : "fail", `${route} registered in docs/routes.json`);
    addCheck("app", existsSync(resolve(rootDir, "app", route.slice(1), "page.tsx")) ? "pass" : "fail", `${route} has app page`);
  }
}

function checkCommercialBoundary() {
  const site = read("lib/site.ts");
  const revenue = read("data/revenue-experiments.csv");
  const compliance = read("checklists/monetization-compliance.md");

  requireText("service_boundary", site, "Checkout remains disabled", "service page states checkout is disabled");
  requireText("service_boundary", site, "It does not promise rankings", "service page blocks ranking and revenue promises");
  requireText("revenue_experiments", revenue, '"R001","2026-06-08","AI Website Opportunity Audit","49-99","intent_test"', "audit price is intent test, not active checkout");
  requireText("revenue_experiments", revenue, '"R005","2026-06-07","SaaS subscription","TBD","blocked"', "subscription remains blocked");
  requireText("compliance", compliance, "| Audit intent page | `pass_with_boundary` |", "audit intent page has compliance boundary");
  requireText("compliance", compliance, "| No payment or account system | `pass` |", "payment and account system remain absent");

  addCheck("service_boundary", !/Buy now|Start checkout|Subscribe now/.test(site) ? "pass" : "fail", "no active checkout CTA copy in site data");
}

function checkReadinessTool() {
  const tool = read("components/AICrawlerReadinessTool.tsx");
  const weights = [...tool.matchAll(/weight:\s*(\d+)/g)].map((match) => Number(match[1]));
  const total = weights.reduce((sum, value) => sum + value, 0);

  addCheck("readiness_tool", weights.length === 13 ? "pass" : "fail", `readiness tool has 13 weighted checks; found ${weights.length}`);
  addCheck("readiness_tool", total === 100 ? "pass" : "fail", `readiness tool weights total ${total}`);
  const hasBoundary =
    tool.includes("does not prove indexing") &&
    tool.includes("AI citation") &&
    tool.includes("traffic") &&
    tool.includes("conversion") &&
    tool.includes("revenue");
  addCheck("readiness_tool", hasBoundary ? "pass" : "fail", "tool states evidence boundary");
}

function checkMojibake() {
  const files = [
    "components/CopyAction.tsx",
    "components/AICrawlerReadinessTool.tsx",
    "lib/site.ts",
    "docs/site-brief.md",
    "checklists/monetization-compliance.md"
  ];

  for (const file of files) {
    addCheck("mojibake", hasMojibake(read(file)) ? "fail" : "pass", `${file} has no visible mojibake marker`);
  }
}

function renderReport(generatedAt) {
  const status = blockers.length ? "blocked" : "pass";
  const lines = [
    "# Commercial Validation Gate",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    `- Checks: ${checks.length}`,
    `- Blockers: ${blockers.length}`,
    "",
    "## Summary",
    "",
    "| Scope | Status | Detail |",
    "|---|---|---|",
    ...checks.map((check) => `| ${mdEscape(check.scope)} | ${check.status} | ${mdEscape(check.detail)} |`),
    "",
    "## Blocking Issues",
    "",
    ...(blockers.length ? blockers.map((item) => `- ${item.scope}: ${item.detail}`) : ["- None"]),
    "",
    "## Interpretation",
    "",
    "- This gate checks whether commercial pages remain in intent-test mode.",
    "- It does not prove buyer demand, paid conversion, revenue, or product-market fit.",
    "- Checkout remains blocked until identity, terms, refund policy, payment support, and first request evidence exist."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return status;
}

function main() {
  checkRoutes();
  checkCommercialBoundary();
  checkReadinessTool();
  checkMojibake();

  const status = renderReport(new Date().toISOString());
  console.log(
    JSON.stringify(
      {
        status,
        checks: checks.length,
        blockers: blockers.length,
        reportPath
      },
      null,
      2
    )
  );

  if (blockers.length) {
    process.exitCode = 1;
  }
}

main();
