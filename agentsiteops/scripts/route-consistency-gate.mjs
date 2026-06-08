import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "route-consistency-gate.md");

const checks = [];
const blockers = [];
const warnings = [];

function read(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), "utf8");
}

function addCheck(scope, status, detail) {
  checks.push({ scope, status, detail });
  if (status === "fail") {
    blockers.push({ scope, detail });
  }
  if (status === "warn") {
    warnings.push({ scope, detail });
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""]))
  );
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function asSet(values) {
  return new Set(values);
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function diffSets(expected, actual) {
  return {
    missing: sorted([...expected].filter((value) => !actual.has(value))),
    extra: sorted([...actual].filter((value) => !expected.has(value)))
  };
}

function checkNoDuplicates(scope, values) {
  const seen = new Set();
  const duplicates = [];

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.push(value);
    }
    seen.add(value);
  }

  addCheck(scope, duplicates.length ? "fail" : "pass", duplicates.length ? `duplicates: ${duplicates.join(", ")}` : "no duplicates");
}

function pathToAppPage(routePath) {
  if (routePath === "/") {
    return resolve(rootDir, "app", "page.tsx");
  }

  return resolve(rootDir, "app", routePath.slice(1), "page.tsx");
}

function parseSitePaths() {
  const site = read("lib/site.ts");
  const paths = [...site.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
  return ["/", ...paths, "/updates/"];
}

function parsePathViewEvents() {
  const analytics = read("components/SiteAnalytics.tsx");
  const blockMatch = analytics.match(/const pathViewEvents:[\s\S]*?=\s*\{([\s\S]*?)\};/);
  const block = blockMatch?.[1] ?? "";
  const routeEvents = new Map();
  const allEvents = [];

  for (const match of block.matchAll(/"([^"]+)":\s*\[([^\]]*)\]/g)) {
    const events = [...match[2].matchAll(/"([^"]+)"/g)].map((eventMatch) => eventMatch[1]);
    routeEvents.set(match[1], events);
    allEvents.push(...events);
  }

  return { routeEvents, allEvents };
}

function parseEventAllowlist() {
  const doc = read("docs/analytics-events.md");
  const currentEvents = doc.match(/## Current Events([\s\S]*?)## Storage Locations/);
  if (!currentEvents) {
    addCheck("analytics_events", "fail", "docs/analytics-events.md missing Current Events section");
    return new Set();
  }

  return asSet([...currentEvents[1].matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]));
}

function compareRows(scope, expectedPaths, actualPaths) {
  const diff = diffSets(expectedPaths, actualPaths);
  const status = diff.missing.length || diff.extra.length ? "fail" : "pass";
  addCheck(
    scope,
    status,
    status === "pass"
      ? `${expectedPaths.size} routes aligned`
      : `missing: ${diff.missing.join(", ") || "none"}; extra: ${diff.extra.join(", ") || "none"}`
  );
}

function checkRouteShapes(routeRows) {
  for (const route of routeRows) {
    const path = route.path;
    const validShape = path.startsWith("/") && (path === "/" || path.endsWith("/"));
    addCheck("route_shape", validShape ? "pass" : "fail", `${path} has canonical slash shape`);
    addCheck("route_index", route.index === true ? "pass" : "warn", `${path} index flag is ${route.index}`);
  }
}

function checkAppPages(routeRows) {
  for (const route of routeRows) {
    const appPath = pathToAppPage(route.path);
    addCheck("app_page", existsSync(appPath) ? "pass" : "fail", `${route.path} app page exists`);
  }
}

function checkAnalytics(routeRows) {
  const { routeEvents, allEvents } = parsePathViewEvents();
  const allowlist = parseEventAllowlist();

  for (const eventName of allEvents) {
    addCheck("analytics_allowlist", allowlist.has(eventName) ? "pass" : "fail", `${eventName} is registered`);
  }

  for (const route of routeRows) {
    if (route.path === "/") {
      continue;
    }

    if (routeEvents.has(route.path)) {
      addCheck("route_view_event", "pass", `${route.path} has view event`);
    } else {
      addCheck("route_view_event", "warn", `${route.path} has no route-specific view event`);
    }
  }
}

function checkSnapshot(expectedPaths) {
  const snapshotPath = resolve(rootDir, "data", "growth-evidence-snapshot.csv");
  if (!existsSync(snapshotPath)) {
    addCheck("growth_snapshot", "fail", "data/growth-evidence-snapshot.csv missing");
    return;
  }

  const rows = parseCsv(read("data/growth-evidence-snapshot.csv"));
  compareRows("growth_snapshot", expectedPaths, asSet(rows.map((row) => row.url)));
}

function renderReport(generatedAt) {
  const status = blockers.length ? "blocked" : warnings.length ? "warning" : "pass";
  const lines = [
    "# Route Consistency Gate",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    `- Checks: ${checks.length}`,
    `- Blockers: ${blockers.length}`,
    `- Warnings: ${warnings.length}`,
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
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((item) => `- ${item.scope}: ${item.detail}`) : ["- None"]),
    "",
    "## Interpretation",
    "",
    "- This gate checks route registry, page registry, review actions, app pages, analytics events, and growth snapshot alignment.",
    "- Warnings are review prompts; blockers prevent release.",
    "- It does not prove indexing, AI citation, traffic, conversion, or revenue."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return status;
}

function main() {
  const generatedAt = new Date().toISOString();
  const routeDoc = JSON.parse(read("docs/routes.json"));
  const routeRows = routeDoc.routes;
  const routePaths = routeRows.map((route) => route.path);
  const routeSet = asSet(routePaths);
  const registryRows = parseCsv(read("docs/page-registry.csv"));
  const actionRows = parseCsv(read("data/page-review-actions.csv"));
  const sitePaths = parseSitePaths();

  checkNoDuplicates("routes", routePaths);
  checkNoDuplicates("page_registry", registryRows.map((row) => row.url));
  checkNoDuplicates("page_review_actions", actionRows.map((row) => row.url));
  compareRows("site_routes", routeSet, asSet(sitePaths));
  compareRows("page_registry", routeSet, asSet(registryRows.map((row) => row.url)));
  compareRows("page_review_actions", routeSet, asSet(actionRows.map((row) => row.url)));
  checkRouteShapes(routeRows);
  checkAppPages(routeRows);
  checkAnalytics(routeRows);
  checkSnapshot(routeSet);

  const status = renderReport(generatedAt);
  console.log(
    JSON.stringify(
      {
        status,
        checks: checks.length,
        blockers: blockers.length,
        warnings: warnings.length,
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
