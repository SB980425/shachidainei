import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "technical-seo-ci.md");
const defaultBrowserPath =
  "C:/Users/98043/AppData/Local/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-win64/chrome-headless-shell.exe";

const sitePublicUrl = stripTrailingSlash(process.env.SITE_PUBLIC_URL ?? "https://agentsiteops.com");
const baseUrl = stripTrailingSlash(process.env.SITE_AUDIT_BASE_URL ?? "http://127.0.0.1:3000");
const siteOrigin = new URL(sitePublicUrl).origin;
const baseOrigin = new URL(baseUrl).origin;
const blockers = [];
const warnings = [];
const routeResults = [];

const mojibakePatterns = [
  "�",
  "缃戠珯",
  "寤虹珯",
  "鎶€鏈",
  "妧鏈",
  "鐐瑰嚮",
  "鍐呭",
  "闂ㄧ",
  "銆",
  "鍦",
  "鏂",
  "璁",
  "鏈",
  "鐢",
  "丆",
  "疭EO"
];

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function htmlDecode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function compact(value) {
  return value.replace(/\s+/g, " ").trim();
}

function markdownEscape(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ")
    .trim();
}

function hasMojibake(value) {
  return mojibakePatterns.find((pattern) => value.includes(pattern));
}

function normalizeRoutePath(input) {
  const url = new URL(input, sitePublicUrl);
  let routePath = url.pathname || "/";

  if (!routePath.startsWith("/")) {
    routePath = `/${routePath}`;
  }

  if (routePath !== "/" && !routePath.endsWith("/") && !/\.[a-z0-9]+$/i.test(routePath)) {
    routePath = `${routePath}/`;
  }

  return routePath;
}

async function fetchText(pathOrUrl, options = {}) {
  const target = pathOrUrl.startsWith("http") ? pathOrUrl : `${baseUrl}${pathOrUrl}`;
  const { timeoutMs = 10000, ...requestOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  let text;
  try {
    response = await fetch(target, {
      redirect: "manual",
      signal: controller.signal,
      ...requestOptions
    });
    text = await response.text();
  } finally {
    clearTimeout(timeout);
  }

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    url: target,
    text
  };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? compact(htmlDecode(match[1])) : "";
}

function extractJsonLd(html) {
  const scripts = [];
  const scriptPattern =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = scriptPattern.exec(html);

  while (match) {
    const raw = htmlDecode(match[1]).trim();
    try {
      scripts.push({ ok: true, value: JSON.parse(raw) });
    } catch (error) {
      scripts.push({ ok: false, error: error.message, raw });
    }
    match = scriptPattern.exec(html);
  }

  return scripts;
}

function parseAttributes(tag) {
  const attrs = new Map();
  const attrPattern = /([a-zA-Z_:.-]+)\s*=\s*(["'])(.*?)\2/g;
  let match = attrPattern.exec(tag);

  while (match) {
    attrs.set(match[1].toLowerCase(), htmlDecode(match[3]));
    match = attrPattern.exec(tag);
  }

  return attrs;
}

function extractMeta(html, name) {
  const metaPattern = /<meta\b[^>]*>/gi;
  let match = metaPattern.exec(html);

  while (match) {
    const attrs = parseAttributes(match[0]);
    if ((attrs.get("name") ?? "").toLowerCase() === name.toLowerCase()) {
      return compact(attrs.get("content") ?? "");
    }
    match = metaPattern.exec(html);
  }

  return "";
}

function extractCanonical(html) {
  const linkPattern = /<link\b[^>]*>/gi;
  let match = linkPattern.exec(html);

  while (match) {
    const attrs = parseAttributes(match[0]);
    const rel = (attrs.get("rel") ?? "").toLowerCase().split(/\s+/);
    if (rel.includes("canonical")) {
      return htmlDecode(attrs.get("href") ?? "").trim();
    }
    match = linkPattern.exec(html);
  }

  return "";
}

function extractAnchorHrefs(html) {
  const hrefs = [];
  const anchorPattern = /<a\b[^>]*\bhref=(["'])(.*?)\1/gi;
  let match = anchorPattern.exec(html);

  while (match) {
    hrefs.push(htmlDecode(match[2]));
    match = anchorPattern.exec(html);
  }

  return hrefs;
}

function internalRouteFromHref(href, currentRoute) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return null;
  }

  const url = new URL(href, `${sitePublicUrl}${currentRoute}`);

  if (![siteOrigin, baseOrigin].includes(url.origin)) {
    return null;
  }

  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname === "/favicon.ico" ||
    /\.[a-z0-9]+$/i.test(url.pathname)
  ) {
    return null;
  }

  return normalizeRoutePath(url.pathname);
}

function expectedCanonical(route) {
  return `${sitePublicUrl}${route}`;
}

function addBlocker(scope, message) {
  blockers.push({ scope, message });
}

function addWarning(scope, message) {
  warnings.push({ scope, message });
}

async function loadRoutesFromSitemap() {
  const sitemap = await fetchText("/sitemap.xml");
  const robots = await fetchText("/robots.txt");
  const routes = [];

  if (!sitemap.ok) {
    addBlocker("/sitemap.xml", `sitemap returned ${sitemap.status}`);
  } else {
    const locPattern = /<loc>([\s\S]*?)<\/loc>/gi;
    let match = locPattern.exec(sitemap.text);

    while (match) {
      routes.push(normalizeRoutePath(htmlDecode(match[1].trim())));
      match = locPattern.exec(sitemap.text);
    }

    if (routes.length === 0) {
      addBlocker("/sitemap.xml", "sitemap has no loc entries");
    }

    const duplicateRoutes = routes.filter((route, index) => routes.indexOf(route) !== index);
    for (const route of new Set(duplicateRoutes)) {
      addWarning("/sitemap.xml", `duplicate route ${route}`);
    }

    if (!routes.includes("/")) {
      addBlocker("/sitemap.xml", "home route is missing");
    }
  }

  if (!robots.ok) {
    addBlocker("/robots.txt", `robots returned ${robots.status}`);
  } else {
    const expectedSitemapLine = `Sitemap: ${sitePublicUrl}/sitemap.xml`;
    if (!robots.text.includes(expectedSitemapLine)) {
      addBlocker("/robots.txt", `missing ${expectedSitemapLine}`);
    }
    if (/disallow:\s*\/\s*$/im.test(robots.text)) {
      addBlocker("/robots.txt", "global disallow conflicts with sitemap");
    }
  }

  return [...new Set(routes)];
}

async function auditRoute(route, knownRoutes) {
  const result = {
    route,
    status: "pass",
    http: "",
    title: "",
    description: "",
    canonical: "",
    jsonLd: "",
    links: "",
    mobile: "pending",
    issues: []
  };

  try {
    const page = await fetchText(route);
    result.http = String(page.status);

    if (!page.ok) {
      result.status = "fail";
      result.issues.push(`HTTP ${page.status}`);
      addBlocker(route, `route returned ${page.status}`);
      routeResults.push(result);
      return;
    }

    const title = extractTitle(page.text);
    const description = extractMeta(page.text, "description");
    const canonical = extractCanonical(page.text);
    const robots = extractMeta(page.text, "robots").toLowerCase();
    const jsonLd = extractJsonLd(page.text);
    const hrefs = extractAnchorHrefs(page.text);
    const internalLinks = hrefs
      .map((href) => internalRouteFromHref(href, route))
      .filter(Boolean);
    const brokenLinks = internalLinks.filter((href) => !knownRoutes.has(href));
    const expected = expectedCanonical(route);
    const visibleText = page.text.replace(/<script[\s\S]*?<\/script>/gi, "");

    result.title = title;
    result.description = description;
    result.canonical = canonical;
    result.jsonLd = String(jsonLd.length);
    result.links = String(new Set(internalLinks).size);

    if (!title) {
      result.issues.push("missing title");
      addBlocker(route, "missing title");
    }
    if (!description) {
      result.issues.push("missing description");
      addBlocker(route, "missing description");
    }
    if (!canonical) {
      result.issues.push("missing canonical");
      addBlocker(route, "missing canonical");
    } else if (canonical !== expected) {
      result.issues.push(`canonical mismatch: ${canonical}`);
      addBlocker(route, `canonical mismatch, expected ${expected}`);
    }
    if (robots.includes("noindex")) {
      result.issues.push("noindex in sitemap route");
      addBlocker(route, "noindex route is present in sitemap");
    }
    if (jsonLd.length === 0) {
      result.issues.push("missing JSON-LD");
      addBlocker(route, "missing JSON-LD");
    }
    for (const item of jsonLd) {
      if (!item.ok) {
        result.issues.push(`invalid JSON-LD: ${item.error}`);
        addBlocker(route, `invalid JSON-LD: ${item.error}`);
      }
    }
    if (brokenLinks.length > 0) {
      const uniqueBroken = [...new Set(brokenLinks)].join(", ");
      result.issues.push(`broken internal links: ${uniqueBroken}`);
      addBlocker(route, `broken internal links: ${uniqueBroken}`);
    }

    const badTextPattern = hasMojibake(`${title} ${description} ${visibleText}`);
    if (badTextPattern) {
      result.issues.push(`possible mojibake: ${badTextPattern}`);
      addBlocker(route, `possible mojibake detected: ${badTextPattern}`);
    }

    if (result.issues.length > 0) {
      result.status = "fail";
    }
  } catch (error) {
    result.status = "fail";
    result.issues.push(error.message);
    addBlocker(route, error.message);
  }

  routeResults.push(result);
}

async function auditMobile(routes) {
  if (process.env.SEO_CI_SKIP_MOBILE === "1") {
    addWarning("mobile", "mobile checks skipped by SEO_CI_SKIP_MOBILE=1");
    for (const result of routeResults) {
      result.mobile = "skipped";
    }
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (error) {
    addWarning("mobile", `Playwright import failed: ${error.message}`);
    for (const result of routeResults) {
      result.mobile = "skipped";
    }
    return;
  }

  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? defaultBrowserPath;
  const launchOptions = {
    headless: true
  };

  if (existsSync(executablePath)) {
    launchOptions.executablePath = executablePath;
  }

  let browser;
  try {
    browser = await chromium.launch(launchOptions);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true
    });

    for (const route of routes) {
      console.log(`mobile check ${route}`);
      const result = routeResults.find((item) => item.route === route);
      if (!result || result.status === "fail") {
        if (result) {
          result.mobile = "not checked";
        }
        continue;
      }

      const page = await context.newPage();
      let metrics;

      try {
        await page.goto(`${baseUrl}${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 8000
        });
        await page.waitForLoadState("networkidle", { timeout: 1000 }).catch(() => {});

        metrics = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const scrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        );
        const offenders = Array.from(document.querySelectorAll("body *"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            };
          })
          .filter((item) => item.width > 0 && (item.left < -2 || item.right > viewportWidth + 2))
          .slice(0, 5);

        return {
          viewportWidth,
          scrollWidth,
          offenders
        };
        });
      } finally {
        await page.close();
      }

      if (metrics.scrollWidth > metrics.viewportWidth + 2) {
        const offenderText = metrics.offenders
          .map((item) => `${item.tag}:${item.text || item.width}`)
          .join("; ");
        result.mobile = "fail";
        result.status = "fail";
        result.issues.push(`mobile overflow ${metrics.scrollWidth}/${metrics.viewportWidth}`);
        addBlocker(
          route,
          `mobile overflow ${metrics.scrollWidth}/${metrics.viewportWidth}; ${offenderText}`
        );
      } else {
        result.mobile = "pass";
      }
    }

    await context.close();
  } catch (error) {
    addWarning("mobile", `Playwright mobile check skipped: ${error.message}`);
    for (const result of routeResults) {
      if (result.mobile === "pending") {
        result.mobile = "skipped";
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function renderReport(routes) {
  const status = blockers.length === 0 ? "PASS" : "FAIL";
  const generatedAt = new Date().toISOString();
  const passedRoutes = routeResults.filter((route) => route.status === "pass").length;
  const failedRoutes = routeResults.length - passedRoutes;
  const lines = [
    "# Technical SEO CI Report",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    `- Base URL: ${baseUrl}`,
    `- Public URL: ${sitePublicUrl}`,
    `- Sitemap routes: ${routes.length}`,
    "",
    "## Summary",
    "",
    "| Check | Result |",
    "| --- | --- |",
    `| Routes passed | ${passedRoutes} |`,
    `| Routes failed | ${failedRoutes} |`,
    `| Blocking issues | ${blockers.length} |`,
    `| Warnings | ${warnings.length} |`,
    "",
    "## Route Results",
    "",
    "| Route | Status | HTTP | Title | Canonical | JSON-LD | Links | Mobile | Issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...routeResults.map(
      (route) =>
        `| ${markdownEscape(route.route)} | ${route.status} | ${route.http} | ${markdownEscape(
          route.title
        )} | ${markdownEscape(route.canonical)} | ${route.jsonLd} | ${route.links} | ${
          route.mobile
        } | ${markdownEscape(route.issues.join("; ") || "-")} |`
    ),
    "",
    "## Blocking Issues",
    "",
    ...(blockers.length
      ? blockers.map((item) => `- ${item.scope}: ${item.message}`)
      : ["- None"]),
    "",
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((item) => `- ${item.scope}: ${item.message}`) : ["- None"]),
    "",
    "## Suggested GitHub Actions Gate",
    "",
    "```yaml",
    "name: technical-seo-ci",
    "on:",
    "  pull_request:",
    "  push:",
    "    branches: [main]",
    "jobs:",
    "  technical-seo:",
    "    runs-on: ubuntu-latest",
    "    env:",
    "      SITE_AUDIT_BASE_URL: http://127.0.0.1:3000",
    `      SITE_PUBLIC_URL: ${sitePublicUrl}`,
    "    steps:",
    "      - uses: actions/checkout@v6",
    "      - uses: actions/setup-node@v6",
    "        with:",
    "          node-version: 24",
    "          cache: npm",
    "      - run: npm ci",
    "      - run: node --check scripts/technical-seo-ci.mjs",
    "      - run: npm run typecheck",
    "      - run: npm audit --audit-level=moderate",
    "      - run: npx playwright install --with-deps chromium",
    "      - run: npm run build",
    "      - run: npx serve@latest out -l 3000 > serve-start.log 2>&1 &",
    "      - run: for attempt in {1..45}; do curl -fsS \"$SITE_AUDIT_BASE_URL\" > /dev/null && exit 0; sleep 2; done; cat serve-start.log; exit 1",
    "      - run: npm run seo:ci",
    "```",
    "",
    "## Follow-up Issues",
    "",
    "- Add Lighthouse CI budgets after deployment target and performance budget are fixed.",
    `- Keep \`${sitePublicUrl}\` aligned with the real production domain before launch.`,
    "- Keep this report in pull requests until the route registry and sitemap are stable.",
    ""
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, lines.join("\n"), "utf8");

  return { status, generatedAt, passedRoutes, failedRoutes };
}

async function main() {
  console.log(`technical-seo-ci start: ${baseUrl}`);
  const routes = await loadRoutesFromSitemap();
  const knownRoutes = new Set(routes);
  console.log(`routes discovered: ${routes.length}`);

  for (const route of routes) {
    console.log(`route check ${route}`);
    await auditRoute(route, knownRoutes);
  }

  console.log("mobile checks start");
  await auditMobile(routes);
  const summary = renderReport(routes);

  console.log(
    `technical-seo-ci ${summary.status}: ${summary.passedRoutes} passed, ${summary.failedRoutes} failed, ${blockers.length} blockers, ${warnings.length} warnings`
  );
  console.log(`report: ${reportPath}`);

  if (blockers.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  addBlocker("runtime", error.message);
  const summary = renderReport([]);
  console.error(`technical-seo-ci ${summary.status}: ${error.message}`);
  process.exitCode = 1;
});
