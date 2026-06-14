import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "code-quality-gate.md");

const checks = [];
const blockers = [];

const scannedDirectories = ["app", "components", "lib", "data", "checklists"];
const scannedExtensions = new Set([".ts", ".tsx", ".mjs", ".json", ".md", ".csv"]);
const ignoredDirectories = new Set(["node_modules", ".next", "out", "output", ".wrangler"]);

function read(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), "utf8");
}

function addCheck(scope, status, detail) {
  checks.push({ scope, status, detail });
  if (status === "fail") {
    blockers.push({ scope, detail });
  }
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function collectFiles(directory) {
  const absoluteDirectory = resolve(rootDir, directory);
  const files = [];

  if (!existsSync(absoluteDirectory)) {
    return files;
  }

  for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = join(absoluteDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(relative(rootDir, absolutePath)));
      continue;
    }

    if (entry.isFile() && scannedExtensions.has(extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function hasMojibake(text) {
  const mojibakeMarkers = ["\u951f", "\u95ff", "\u95c2", "\u67e3", "\u9418", "\u7ecb", "\u5862"];
  return mojibakeMarkers.some((marker) => text.includes(marker)) || text.includes("\uFFFD") || /\?{3,}/.test(text);
}

function checkPackageScript() {
  const packageJson = JSON.parse(read("package.json"));
  const lintScript = packageJson.scripts?.lint ?? "";
  const linksScript = packageJson.scripts?.["links:gate"] ?? "";
  const rootWorkflowPath = resolve(rootDir, "..", ".github", "workflows", "agentsiteops-ci.yml");
  const rootWorkflow = existsSync(rootWorkflowPath) ? readFileSync(rootWorkflowPath, "utf8") : "";
  addCheck("package", lintScript === "node scripts/code-quality-gate.mjs" ? "pass" : "fail", "lint script runs the project code quality gate");
  addCheck("package", !/\bnext lint\b/.test(lintScript) ? "pass" : "fail", "lint script does not use removed Next lint command");
  addCheck(
    "package",
    linksScript === "node scripts/internal-link-gate.mjs" ? "pass" : "fail",
    "links:gate runs the internal link closure gate"
  );
  addCheck(
    "package",
    rootWorkflow.includes("npm run links:gate") ? "pass" : "fail",
    "root CI runs the internal link gate after build"
  );
}

function checkRetiredPaymentTestPatterns(files) {
  const retiredPaymentPattern = /paypal\.me\/agentsiteops\/1(?:USD)?\b|1USD\b|test_payment|temporary_payment/i;
  const offenders = files
    .filter((file) => !relative(rootDir, file).replaceAll("\\", "/").startsWith("reports/"))
    .filter((file) => retiredPaymentPattern.test(readFileSync(file, "utf8")))
    .map((file) => relative(rootDir, file));

  addCheck(
    "payment_boundary",
    offenders.length ? "fail" : "pass",
    offenders.length
      ? `retired payment test pattern found in ${offenders.join(", ")}`
      : "retired 1 USD payment test patterns are absent from source files"
  );
}

function checkMojibake(files) {
  const offenders = files
    .filter((file) => hasMojibake(readFileSync(file, "utf8")))
    .map((file) => relative(rootDir, file));

  addCheck(
    "encoding",
    offenders.length ? "fail" : "pass",
    offenders.length
      ? `visible mojibake markers found in ${offenders.join(", ")}`
      : "visible mojibake markers are absent from scanned source files"
  );
}

function checkProductionHealthAssertions() {
  const monitor = read("scripts/production-health-monitor.mjs");
  addCheck(
    "production_health",
    monitor.includes("Route Foundry") && monitor.includes("The site does not create a hidden research result.") ? "pass" : "fail",
    "production monitor checks the Route Foundry homepage and channel-neutral research workflow path"
  );
  addCheck(
    "production_health",
    !monitor.includes('"Buy the USD"') ? "pass" : "fail",
    "production monitor does not check retired homepage payment CTA"
  );
  addCheck(
    "production_health",
    monitor.includes("/tools/launch-blueprint-fit-checker/") && monitor.includes("Route File Fit Checker")
      ? "pass"
      : "fail",
    "production monitor checks the Route File Fit Checker route"
  );
}

function checkSearchEvidenceContract() {
  const importer = read("scripts/import-search-evidence.mjs");
  const snapshot = read("scripts/growth-evidence-snapshot.mjs");
  const templates = [
    "data/search-evidence-import-templates/gsc-pages-template.csv",
    "data/search-evidence-import-templates/gsc-queries-template.csv",
    "data/search-evidence-import-templates/bing-pages-template.csv",
    "data/search-evidence-import-templates/bing-queries-template.csv",
    "data/search-evidence-import-templates/import-manifest-template.csv"
  ];
  addCheck("search_evidence", importer.includes("search-evidence-normalized.csv") ? "pass" : "fail", "search importer writes normalized evidence CSV");
  addCheck("search_evidence", importer.includes("search-evidence-import-templates") ? "pass" : "fail", "search importer report points to tracked template directory");
  addCheck("search_evidence", importer.includes("validationIssues") ? "pass" : "fail", "search importer blocks malformed present export files");
  addCheck("search_evidence", importer.includes("waiting_for_exports") ? "pass" : "fail", "search importer treats missing exports as waiting state");
  addCheck(
    "search_evidence",
    templates.every((template) => existsSync(resolve(rootDir, template))) ? "pass" : "fail",
    "tracked GSC, Bing, and import-manifest templates exist"
  );
  addCheck("search_evidence", snapshot.includes("pending_export") ? "pass" : "fail", "growth snapshot marks missing search exports as pending");
  addCheck("search_evidence", snapshot.includes("imported_with_search_activity") ? "pass" : "fail", "growth snapshot can distinguish imported search activity");
}

function renderReport(generatedAt) {
  const status = blockers.length ? "blocked" : "pass";
  const lines = [
    "# Code Quality Gate",
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
    "- This gate replaces the removed `next lint` workflow without adding dependencies.",
    "- It checks project-specific release risks: retired payment tests, encoding corruption, production monitor drift, and search evidence contract drift.",
    "- It does not replace TypeScript, build, route, commercial, crawler, SEO, or production health gates."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return status;
}

function main() {
  const files = scannedDirectories.flatMap(collectFiles);
  checkPackageScript();
  checkRetiredPaymentTestPatterns(files);
  checkMojibake(files);
  checkProductionHealthAssertions();
  checkSearchEvidenceContract();

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
