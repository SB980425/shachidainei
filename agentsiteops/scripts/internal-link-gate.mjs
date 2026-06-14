import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(rootDir, "out");
const reportPath = resolve(rootDir, "reports", "internal-link-gate.md");

const checks = [];

function addCheck(scope, status, detail, source = "") {
  checks.push({ scope, status, detail, source });
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function shouldIgnoreHref(href) {
  if (!href || href.startsWith("#")) return true;
  if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return true;
  if (/^(https?:)?\/\//i.test(href)) return true;
  if (!href.startsWith("/")) return true;

  return [
    "/_next/",
    "/api/",
    "/favicon",
    "/icon",
    "/manifest",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
    "/llms-full.txt",
    "/32bc6ba6e277f850a701747381a57c48.txt"
  ].some((prefix) => href.startsWith(prefix));
}

function cleanHref(href) {
  return href.split("#")[0].split("?")[0];
}

function targetExists(href) {
  const target = cleanHref(href);
  const withoutLead = target.replace(/^\/+/, "");

  if (target.endsWith("/")) {
    return existsSync(resolve(outDir, withoutLead, "index.html"));
  }

  if (extname(target)) {
    return existsSync(resolve(outDir, withoutLead));
  }

  return (
    existsSync(resolve(outDir, withoutLead, "index.html")) ||
    existsSync(resolve(outDir, `${withoutLead}.html`))
  );
}

function writeReport(generatedAt, status) {
  mkdirSync(dirname(reportPath), { recursive: true });
  const rows = checks.map(
    (check) =>
      `| ${check.scope} | ${check.status} | ${check.detail.replaceAll("|", "\\|")} | ${check.source.replaceAll("|", "\\|")} |`
  );
  const blockers = checks.filter((check) => check.status === "fail");

  writeFileSync(
    reportPath,
    [
      "# Internal Link Gate",
      "",
      `- Generated: ${generatedAt}`,
      `- Status: ${status}`,
      `- Checks: ${checks.length}`,
      `- Blockers: ${blockers.length}`,
      "",
      "## Summary",
      "",
      "| Scope | Status | Detail | Source |",
      "|---|---|---|---|",
      ...rows,
      "",
      "## Blocking Issues",
      "",
      ...(blockers.length
        ? blockers.map((check) => `- ${check.detail} (${check.source})`)
        : ["- None"]),
      "",
      "## Interpretation",
      "",
      "- This gate scans generated static HTML in `out/` after `npm run build`.",
      "- It verifies same-site links resolve to a generated page or static public file.",
      "- It ignores external links, mailto links, hashed anchors, Next assets, API routes, sitemap, robots, and llms files.",
      ""
    ].join("\n"),
    "utf8"
  );
}

function main() {
  const generatedAt = new Date().toISOString();

  if (!existsSync(outDir)) {
    addCheck("build_output", "fail", "`out/` does not exist. Run `npm run build` first.", "");
    writeReport(generatedAt, "blocked");
    process.exitCode = 1;
    return;
  }

  const htmlFiles = walk(outDir);
  const links = new Map();

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (shouldIgnoreHref(href)) continue;

      const clean = cleanHref(href);
      if (!links.has(clean)) links.set(clean, new Set());
      links.get(clean).add(relative(outDir, file));
    }
  }

  addCheck("html_files", "pass", `${htmlFiles.length} generated HTML files scanned`, "out/");
  addCheck("internal_links", "pass", `${links.size} same-site link targets discovered`, "out/");

  for (const [href, sources] of [...links.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (targetExists(href)) {
      addCheck("internal_link", "pass", href, [...sources].slice(0, 3).join(", "));
    } else {
      addCheck("internal_link", "fail", `Missing generated target for ${href}`, [...sources].slice(0, 3).join(", "));
    }
  }

  const blocked = checks.some((check) => check.status === "fail");
  writeReport(generatedAt, blocked ? "blocked" : "pass");

  const summary = {
    status: blocked ? "blocked" : "pass",
    checks: checks.length,
    blockers: checks.filter((check) => check.status === "fail").length,
    reportPath
  };
  console.log(JSON.stringify(summary, null, 2));

  if (blocked) {
    process.exitCode = 1;
  }
}

main();
