import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const routesPath = resolve(rootDir, "docs", "routes.json");
const importDir = resolve(rootDir, "data", "search-evidence-imports");
const templateDir = resolve(rootDir, "data", "search-evidence-import-templates");
const outputPath = resolve(rootDir, "data", "search-evidence-normalized.csv");
const reportPath = resolve(rootDir, "reports", "search-evidence-import.md");

const importSpecs = [
  { file: "gsc-pages.csv", source: "gsc", grain: "page" },
  { file: "gsc-queries.csv", source: "gsc", grain: "query" },
  { file: "bing-pages.csv", source: "bing", grain: "page" },
  { file: "bing-queries.csv", source: "bing", grain: "query" }
];

const outputColumns = [
  "source",
  "grain",
  "page_url",
  "page_path",
  "query",
  "clicks",
  "impressions",
  "ctr",
  "average_position",
  "import_file"
];

function read(path) {
  return readFileSync(path, "utf8");
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
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell.trim());
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
    row.push(cell.trim());
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const [header, ...body] = rows;
  return body
    .filter((values) => values.some((value) => value.length > 0))
    .map((values) =>
      Object.fromEntries(header.map((key, index) => [normalizeHeader(key), values[index] ?? ""]))
    );
}

function normalizeHeader(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function get(row, keys) {
  for (const key of keys) {
    const normalized = normalizeHeader(key);
    if (row[normalized] !== undefined && row[normalized] !== "") {
      return row[normalized];
    }
  }
  return "";
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

function parseMetric(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const percent = text.endsWith("%");
  const parsed = Number(text.replace(/[%,$,\s]/g, ""));
  if (!Number.isFinite(parsed)) return "";
  return String(percent ? parsed / 100 : parsed);
}

function normalizePageUrl(value, siteBaseUrl) {
  const text = String(value ?? "").trim();
  if (!text) {
    return { pageUrl: "", pagePath: "" };
  }

  try {
    const url = new URL(text, siteBaseUrl);
    let pagePath = url.pathname || "/";
    if (pagePath !== "/" && !pagePath.endsWith("/") && !/\.[a-z0-9]+$/i.test(pagePath)) {
      pagePath = `${pagePath}/`;
    }
    return {
      pageUrl: `${url.origin}${pagePath}`,
      pagePath
    };
  } catch {
    return { pageUrl: text, pagePath: "" };
  }
}

function normalizeRows(spec, rows, siteBaseUrl) {
  return rows.map((row) => {
    const pageValue = get(row, [
      "page",
      "top pages",
      "url",
      "page url",
      "address",
      "pages",
      "landing page"
    ]);
    const query = get(row, ["query", "top queries", "keyword", "search keyword", "search term"]);
    const { pageUrl, pagePath } = normalizePageUrl(pageValue, siteBaseUrl);

    return {
      source: spec.source,
      grain: spec.grain,
      page_url: pageUrl,
      page_path: pagePath,
      query,
      clicks: parseMetric(get(row, ["clicks", "click"])),
      impressions: parseMetric(get(row, ["impressions", "impression"])),
      ctr: parseMetric(get(row, ["ctr", "click through rate", "click_through_rate"])),
      average_position: parseMetric(get(row, ["position", "avg position", "average position"])),
      import_file: spec.file
    };
  });
}

function summarizeRouteCoverage(routes, rows, source) {
  return routes.map((route) => {
    const matching = rows.filter((row) => row.source === source && row.page_path === route.path);
    const clicks = matching.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
    const impressions = matching.reduce((sum, row) => sum + Number(row.impressions || 0), 0);
    return {
      route: route.path,
      rows: matching.length,
      clicks,
      impressions
    };
  });
}

const generatedAt = new Date().toISOString();
const routeDoc = JSON.parse(read(routesPath));
const normalizedRows = [];
const fileSummaries = [];

mkdirSync(dirname(outputPath), { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });
mkdirSync(importDir, { recursive: true });

for (const spec of importSpecs) {
  const path = resolve(importDir, spec.file);
  if (!existsSync(path)) {
    fileSummaries.push({ ...spec, status: "missing", inputRows: 0, normalizedRows: 0 });
    continue;
  }

  const parsedRows = parseCsv(read(path));
  const importedRows = normalizeRows(spec, parsedRows, routeDoc.site.baseUrl);
  normalizedRows.push(...importedRows);
  fileSummaries.push({
    ...spec,
    status: "imported",
    inputRows: parsedRows.length,
    normalizedRows: importedRows.length
  });
}

const outputLines = [
  outputColumns.join(","),
  ...normalizedRows.map((row) => outputColumns.map((column) => csvEscape(row[column])).join(","))
];

writeFileSync(outputPath, `${outputLines.join("\n")}\n`);

const gscCoverage = summarizeRouteCoverage(routeDoc.routes, normalizedRows, "gsc");
const bingCoverage = summarizeRouteCoverage(routeDoc.routes, normalizedRows, "bing");
const importedFileCount = fileSummaries.filter((file) => file.status === "imported").length;
const status = importedFileCount > 0 ? "imported" : "waiting_for_exports";

const report = [
  "# Search Evidence Import",
  "",
  `- Generated: ${generatedAt}`,
  `- Status: ${status}`,
  `- Import files found: ${importedFileCount}`,
  `- Normalized rows: ${normalizedRows.length}`,
  `- Import directory: ${importDir}`,
  `- Template directory: ${templateDir}`,
  "",
  "## File Status",
  "",
  "| File | Source | Grain | Status | Input rows | Normalized rows |",
  "|---|---|---|---|---|---|",
  ...fileSummaries.map((file) =>
    [
      "|",
      mdEscape(file.file),
      "|",
      mdEscape(file.source),
      "|",
      mdEscape(file.grain),
      "|",
      mdEscape(file.status),
      "|",
      file.inputRows,
      "|",
      file.normalizedRows,
      "|"
    ].join(" ")
  ),
  "",
  "## Route Coverage",
  "",
  "| Route | GSC rows | GSC impressions | GSC clicks | Bing rows | Bing impressions | Bing clicks |",
  "|---|---|---|---|---|---|---|",
  ...routeDoc.routes.map((route, index) => {
    const gsc = gscCoverage[index];
    const bing = bingCoverage[index];
    return [
      "|",
      mdEscape(route.path),
      "|",
      gsc.rows,
      "|",
      gsc.impressions,
      "|",
      gsc.clicks,
      "|",
      bing.rows,
      "|",
      bing.impressions,
      "|",
      bing.clicks,
      "|"
    ].join(" ");
  }),
  "",
  "## Interpretation",
  "",
  "- Missing files mean exports have not been added yet; they do not mean zero traffic.",
  "- Page-level rows are used for route coverage.",
  "- Query-level rows are used for query breadth and language review after a real export exists.",
  "- Raw export files remain untracked in Git by default."
];

writeFileSync(reportPath, `${report.join("\n")}\n`);

console.log(
  JSON.stringify(
    {
      status,
      importedFileCount,
      normalizedRows: normalizedRows.length,
      output: outputPath,
      report: reportPath
    },
    null,
    2
  )
);
