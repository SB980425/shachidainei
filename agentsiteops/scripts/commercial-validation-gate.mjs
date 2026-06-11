import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "commercial-validation-gate.md");

const requiredRoutes = [
  "/tools/ai-crawler-readiness/",
  "/examples/agentsiteops-self-audit/",
  "/examples/fit-review-sample/",
  "/services/ai-website-opportunity-audit/",
  "/tools/audit-scope-builder/",
  "/tools/launch-blueprint-fit-checker/",
  "/pricing/",
  "/compare/",
  "/starter-review/",
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
  const starterReviewPage = read("app/starter-review/page.tsx");
  const fitReviewSamplePage = read("app/examples/fit-review-sample/page.tsx");
  const buyPage = read("app/buy/page.tsx");
  const intakePage = read("app/intake/page.tsx");
  const revenue = read("data/revenue-experiments.csv");
  const compliance = read("checklists/monetization-compliance.md");
  const terms = read("app/terms/page.tsx");
  const refund = read("app/refund-policy/page.tsx");
  const disclaimer = read("app/disclaimer/page.tsx");
  const fulfillmentTemplate = read("data/manual-fulfillment-log-template.csv");
  const fulfillmentRunbook = read("docs/manual-fulfillment-runbook.md");
  const fitReviewDeliveryTemplate = read("docs/delivery-fit-review-template.md");
  const launchBlueprintDeliveryTemplate = read("docs/delivery-launch-blueprint-template.md");
  const deliveryQualityChecklist = read("data/delivery-quality-checklist.csv");
  const outreachTemplates = read("data/outreach-templates.json");
  const outreachRunbook = read("docs/manual-outreach-runbook.md");
  const outreachTracker = read("data/outreach-tracker-template.csv");

  requireText("payment_path", payments, "https://paypal.me/agentsiteops/99USD", "live USD 99 PayPal link is configured");
  requireText("payment_path", payments, "https://paypal.me/agentsiteops/29USD", "live USD 29 PayPal link is configured");
  addCheck("payment_path", !/testPayment|test_payment|temporary_payment/i.test(payments) ? "pass" : "fail", "payment config contains only current paid offer paths");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(pricingPage) ? "pass" : "fail", "pricing page contains only current paid offer CTA");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(starterReviewPage) ? "pass" : "fail", "starter review page contains only current paid offer CTA");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(buyPage) ? "pass" : "fail", "buy page contains only current paid offer CTA");
  requireText("payment_path", starterReviewPage, "Pay USD {starterOffer.price}", "starter review page has paid CTA");
  requireText("service_boundary", starterReviewPage, "reject the larger sale", "starter review can reject the full blueprint sale");
  requireText("service_boundary", fitReviewSamplePage, "Do not buy the USD 99 blueprint yet", "fit review sample can recommend not buying the full blueprint");
  requireText("service_boundary", fitReviewSamplePage, "It does not prove traffic, revenue, citations, or demand.", "fit review sample states proof boundary");
  requireText("service_boundary", launch, "No guaranteed traffic, rankings, revenue, customers, AI citations", "launch product blocks guarantee claims");
  requireText("service_boundary", disclaimer, "No guaranteed traffic", "disclaimer blocks guarantee claims");
  requireText("trust_pages", terms, "PayPal", "terms page covers PayPal payment path");
  requireText("trust_pages", refund, "refund", "refund page exists and states refund boundary");
  requireText("revenue_experiments", revenue, '"R006","2026-06-11","AgentSiteOps Launch Blueprint","99","live_validation"', "Launch Blueprint is recorded as live validation");
  requireText("revenue_experiments", revenue, '"R007","2026-06-11","AgentSiteOps Fit Review","29","live_validation"', "Fit Review is recorded as live validation");
  addCheck("revenue_experiments", !/temporary_payment|payment path test/i.test(revenue) ? "pass" : "fail", "revenue experiment table contains only active or planned commercial hypotheses");
  requireText("revenue_experiments", revenue, '"R005","2026-06-07","SaaS subscription","TBD","blocked"', "subscription remains blocked");
  requireText("compliance", compliance, "| Launch Blueprint payment path | `pass_with_boundary` |", "current payment path has compliance boundary");
  requireText("compliance", compliance, "| Manual PayPal payment path disclosed | `pass` |", "manual PayPal path is disclosed");
  requireText("compliance", compliance, "| No card data collected by site | `pass` |", "site does not collect card data");
  requireText("manual_fulfillment", intakePage, "Payment confirmation", "intake page requests payment confirmation");
  requireText("manual_fulfillment", intakePage, "Manual delivery process", "intake page explains manual delivery process");
  requireText("manual_fulfillment", fulfillmentTemplate, "paypal_reference", "manual fulfillment template records payment reference");
  requireText("manual_fulfillment", fulfillmentTemplate, "fit_review|launch_blueprint", "manual fulfillment template records purchased product");
  requireText("manual_fulfillment", fulfillmentTemplate, "Do not store card data", "manual fulfillment template blocks sensitive payment data storage");
  requireText("manual_fulfillment", fulfillmentRunbook, "Do not store", "manual fulfillment runbook states data boundary");
  requireText("manual_fulfillment", fulfillmentRunbook, "docs/delivery-fit-review-template.md", "manual fulfillment runbook links Fit Review delivery template");
  requireText("manual_fulfillment", fulfillmentRunbook, "docs/delivery-launch-blueprint-template.md", "manual fulfillment runbook links Launch Blueprint delivery template");
  requireText("manual_fulfillment", fitReviewDeliveryTemplate, "Verdict: go | narrow | stop", "Fit Review delivery template has verdict boundary");
  requireText("manual_fulfillment", fitReviewDeliveryTemplate, "Do not claim", "Fit Review delivery template blocks guarantee claims");
  requireText("manual_fulfillment", launchBlueprintDeliveryTemplate, "Selected First Offer", "Launch Blueprint delivery template selects one offer");
  requireText("manual_fulfillment", launchBlueprintDeliveryTemplate, "Missing Evidence Ledger", "Launch Blueprint delivery template includes evidence ledger");
  requireText("manual_fulfillment", deliveryQualityChecklist, "No card data passwords API keys bank details or private customer lists are stored", "delivery checklist blocks sensitive data storage");
  requireText("manual_fulfillment", deliveryQualityChecklist, "No guaranteed traffic ranking AI citation revenue or customer response is claimed", "delivery checklist blocks guarantee claims");
  requireText("manual_outreach", outreachTemplates, "Do not promise traffic, rankings, AI citations, revenue", "outreach templates block inflated claims");
  requireText("manual_outreach", outreachTemplates, "Keep names, emails, handles, and private replies outside public files", "outreach templates keep private replies out of the repo");
  requireText("manual_outreach", outreachRunbook, "Do not use automated DMs", "outreach runbook blocks automated direct messages");
  requireText("manual_outreach", outreachRunbook, "Do not promise traffic, rankings, AI citations, revenue", "outreach runbook blocks guarantee claims");
  requireText("manual_outreach", outreachRunbook, "Do not store names emails handles private replies or payment identifiers", "outreach runbook blocks public storage of private lead data");
  requireText("manual_outreach", outreachRunbook, "20 manual prospects", "outreach runbook sets a small-batch validation limit");
  requireText("manual_outreach", outreachTracker, "confirmed_payment_count", "outreach tracker separates confirmed payments");
  requireText("manual_outreach", outreachTracker, "usable_intake_count", "outreach tracker separates usable intake");
  requireText("manual_outreach", outreachTracker, "Aggregate only", "outreach tracker stores only aggregate records");

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

function checkLaunchFitChecker() {
  const tool = read("components/LaunchBlueprintFitChecker.tsx");
  const page = read("app/tools/launch-blueprint-fit-checker/page.tsx");

  requireText("launch_fit_checker", tool, "Do not buy", "fit checker can block bad-fit buyers");
  requireText("launch_fit_checker", tool, "guaranteed traffic or revenue", "fit checker blocks guarantee expectations");
  requireText("launch_fit_checker", page, "No request, account, payment, or personal data is submitted.", "fit checker page states local-only boundary");

  addCheck(
    "launch_fit_checker",
    !/fetch\(|XMLHttpRequest|sendBeacon|form action=|stripe|lemonsqueezy/i.test(tool)
      ? "pass"
      : "fail",
    "fit checker has no network submit or third-party payment integration"
  );
}

function checkMojibake() {
  const files = [
    "components/CopyAction.tsx",
    "components/AICrawlerReadinessTool.tsx",
    "components/AuditScopeBuilder.tsx",
    "data/outreach-templates.json",
    "docs/manual-outreach-runbook.md",
    "lib/site.ts",
    "lib/launch.ts",
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
  checkLaunchFitChecker();
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
