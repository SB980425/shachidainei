import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "commercial-validation-gate.md");

const requiredRoutes = [
  "/tools/ai-crawler-readiness/",
  "/examples/agentsiteops-self-audit/",
  "/services/ai-website-opportunity-audit/",
  "/tools/audit-scope-builder/",
  "/pricing/",
  "/compare/",
  "/buy/",
  "/intake/",
  "/terms/",
  "/refund-policy/",
  "/disclaimer/",
  "/contact/"
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
  const payments = read("lib/payments.ts");
  const launch = read("lib/launch.ts");
  const pricingPage = read("app/pricing/page.tsx");
  const buyPage = read("app/buy/page.tsx");
  const revenue = read("data/revenue-experiments.csv");
  const compliance = read("checklists/monetization-compliance.md");
  const terms = read("app/terms/page.tsx");
  const refund = read("app/refund-policy/page.tsx");
  const disclaimer = read("app/disclaimer/page.tsx");

  requireText("payment_path", payments, "https://paypal.me/agentsiteops/99USD", "live USD 99 PayPal link is configured");
  addCheck("payment_path", !/testPayment|test_payment|temporary_payment/i.test(payments) ? "pass" : "fail", "payment config contains only current paid offer paths");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(pricingPage) ? "pass" : "fail", "pricing page contains only current paid offer CTA");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(buyPage) ? "pass" : "fail", "buy page contains only current paid offer CTA");
  requireText("service_boundary", launch, "No guaranteed traffic, rankings, revenue, customers, AI citations", "launch product blocks guarantee claims");
  requireText("service_boundary", disclaimer, "No guaranteed traffic", "disclaimer blocks guarantee claims");
  requireText("trust_pages", terms, "PayPal", "terms page covers PayPal payment path");
  requireText("trust_pages", refund, "refund", "refund page exists and states refund boundary");
  requireText("revenue_experiments", revenue, '"R006","2026-06-11","AgentSiteOps Launch Blueprint","99","live_validation"', "Launch Blueprint is recorded as live validation");
  addCheck("revenue_experiments", !/temporary_payment|payment path test/i.test(revenue) ? "pass" : "fail", "revenue experiment table contains only active or planned commercial hypotheses");
  requireText("revenue_experiments", revenue, '"R005","2026-06-07","SaaS subscription","TBD","blocked"', "subscription remains blocked");
  requireText("compliance", compliance, "| Launch Blueprint payment path | `pass_with_boundary` |", "current payment path has compliance boundary");
  requireText("compliance", compliance, "| Manual PayPal payment path disclosed | `pass` |", "manual PayPal path is disclosed");
  requireText("compliance", compliance, "| No card data collected by site | `pass` |", "site does not collect card data");

  addCheck("service_boundary", !/guaranteed rankings|guaranteed revenue|guaranteed customers/i.test(launch) ? "pass" : "fail", "launch copy avoids guarantee claims");
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

function checkAuditScopeBuilder() {
  const tool = read("components/AuditScopeBuilder.tsx");
  const page = read("app/tools/audit-scope-builder/page.tsx");

  requireText("audit_scope_builder", tool, "local-only", "scope builder states local-only boundary");
  requireText("audit_scope_builder", tool, "does not submit a request", "scope builder blocks request-submission claim");
  requireText("audit_scope_builder", page, "No payment, account, identity, or external platform step is required.", "scope page states no payment or account step");

  addCheck(
    "audit_scope_builder",
    !/fetch\(|XMLHttpRequest|sendBeacon|form action=|paypal|stripe|lemonsqueezy/i.test(tool)
      ? "pass"
      : "fail",
    "scope builder has no network submit or payment integration"
  );
}

function checkMojibake() {
  const files = [
    "components/CopyAction.tsx",
    "components/AICrawlerReadinessTool.tsx",
    "components/AuditScopeBuilder.tsx",
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
    "- This gate checks whether the live manual PayPal path has visible scope, limits, refund, contact, and evidence boundaries.",
    "- It does not prove buyer demand, paid conversion, revenue, or product-market fit.",
    "- Payment validation now relies on the current paid offer path and production evidence checks."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return status;
}

function main() {
  checkRoutes();
  checkCommercialBoundary();
  checkReadinessTool();
  checkAuditScopeBuilder();
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
