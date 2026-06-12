import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const eventsDocPath = resolve(rootDir, "docs", "analytics-events.md");
const endpointContractPath = resolve(rootDir, "docs", "analytics-endpoint-contract.md");
const siteAnalyticsPath = resolve(rootDir, "components", "SiteAnalytics.tsx");
const endpointFunctionPath = resolve(rootDir, "functions", "api", "events.ts");
const summaryFunctionPath = resolve(rootDir, "functions", "api", "events", "summary.ts");
const trustPagesPath = resolve(rootDir, "lib", "trustPages.ts");
const wranglerPath = resolve(rootDir, "wrangler.toml");
const reportPath = resolve(rootDir, "reports", "analytics-endpoint-gate.md");
const siteOrigin = "https://agentsiteops.com";
const maxBodyBytes = 8 * 1024;
const maxPayloadKeyLength = 64;
const maxPayloadStringLength = 200;
const maxPastMs = 24 * 60 * 60 * 1000;
const maxFutureMs = 10 * 60 * 1000;

const sensitiveKeyPattern =
  /(email|mail|phone|tel|account|payment|card|password|secret|token|ip|cookie|fingerprint|device|raw|message|comment|text)/i;
const emailValuePattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneValuePattern = /(?:\+?\d[\d\s().-]{7,}\d)/;

function read(path) {
  return readFileSync(path, "utf8");
}

function parseEventAllowlist(doc) {
  const currentEvents = doc.match(/## Current Events([\s\S]*?)## Storage Locations/);
  if (!currentEvents) {
    throw new Error("analytics events doc missing Current Events table");
  }

  return new Set(
    [...currentEvents[1].matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1])
  );
}

function isPlainPayloadValue(value) {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function reject(reason) {
  return { ok: false, status: 400, reason };
}

export function validateAnalyticsEvent(event, options = {}) {
  const allowlist = options.allowlist ?? parseEventAllowlist(read(eventsDocPath));
  const now = options.now ?? Date.now();
  const bodySize = Buffer.byteLength(JSON.stringify(event ?? {}), "utf8");

  if (bodySize > maxBodyBytes) {
    return reject("request body over 8 KB");
  }

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return reject("event body must be an object");
  }

  if (typeof event.name !== "string" || !event.name) {
    return reject("missing event name");
  }

  if (!allowlist.has(event.name)) {
    return reject("unknown event name");
  }

  if (typeof event.path !== "string" || !event.path.startsWith("/")) {
    return reject("path must start with slash");
  }

  if (typeof event.timestamp !== "string" || !event.timestamp) {
    return reject("missing timestamp");
  }

  const timestamp = Date.parse(event.timestamp);
  if (!Number.isFinite(timestamp)) {
    return reject("invalid timestamp");
  }

  if (now - timestamp > maxPastMs) {
    return reject("timestamp older than 24 hours");
  }

  if (timestamp - now > maxFutureMs) {
    return reject("timestamp more than 10 minutes in the future");
  }

  if (event.page_url !== undefined) {
    try {
      const pageUrl = new URL(event.page_url);
      if (pageUrl.origin !== siteOrigin) {
        return reject("page_url origin is not allowed");
      }
    } catch {
      return reject("invalid page_url");
    }
  }

  const payload = event.payload ?? {};
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return reject("payload must be an object");
  }

  for (const [key, value] of Object.entries(payload)) {
    if (key.length > maxPayloadKeyLength) {
      return reject("payload key longer than 64 characters");
    }

    if (!isPlainPayloadValue(value)) {
      return reject("payload value must be string, number, boolean, or null");
    }

    if (sensitiveKeyPattern.test(key)) {
      return reject(`sensitive payload key rejected: ${key}`);
    }

    if (typeof value === "string") {
      if (value.length > maxPayloadStringLength) {
        return reject("payload string longer than 200 characters");
      }

      if (emailValuePattern.test(value)) {
        return reject("email-like payload value rejected");
      }

      if (phoneValuePattern.test(value)) {
        return reject("phone-like payload value rejected");
      }
    }
  }

  return { ok: true, status: 204, reason: "accepted" };
}

function validEvent(now) {
  return {
    name: "tool_completed",
    payload: {
      tool: "website_opportunity_scorer",
      score: 82.5,
      decision: "proceed",
      export_method: "copy"
    },
    page_url: "https://agentsiteops.com/tools/website-opportunity-scorer/",
    path: "/tools/website-opportunity-scorer/",
    timestamp: new Date(now).toISOString()
  };
}

function runCases() {
  const now = Date.now();
  const allowlist = parseEventAllowlist(read(eventsDocPath));
  const cases = [
    {
      name: "valid tool_completed event",
      event: validEvent(now),
      expectedOk: true
    },
    {
      name: "unknown event rejected",
      event: { ...validEvent(now), name: "unknown_event" },
      expectedOk: false
    },
    {
      name: "nested payload rejected",
      event: { ...validEvent(now), payload: { nested: { bad: true } } },
      expectedOk: false
    },
    {
      name: "sensitive email payload rejected",
      event: { ...validEvent(now), payload: { label: "contact test@example.com" } },
      expectedOk: false
    },
    {
      name: "sensitive key rejected",
      event: { ...validEvent(now), payload: { email: "redacted" } },
      expectedOk: false
    },
    {
      name: "old timestamp rejected",
      event: { ...validEvent(now), timestamp: new Date(now - maxPastMs - 1000).toISOString() },
      expectedOk: false
    },
    {
      name: "future timestamp rejected",
      event: { ...validEvent(now), timestamp: new Date(now + maxFutureMs + 1000).toISOString() },
      expectedOk: false
    },
    {
      name: "invalid path rejected",
      event: { ...validEvent(now), path: "tools/website-opportunity-scorer/" },
      expectedOk: false
    },
    {
      name: "external page url rejected",
      event: { ...validEvent(now), page_url: "https://example.com/" },
      expectedOk: false
    },
    {
      name: "large body rejected",
      event: {
        ...validEvent(now),
        payload: { label: "x".repeat(maxBodyBytes + 1) }
      },
      expectedOk: false
    }
  ];

  return cases.map((testCase) => {
    const result = validateAnalyticsEvent(testCase.event, { allowlist, now });
    return {
      ...testCase,
      ok: result.ok,
      status: result.status,
      reason: result.reason,
      passed: result.ok === testCase.expectedOk
    };
  });
}

function runImplementationChecks() {
  const docs = read(eventsDocPath);
  const contract = read(endpointContractPath);
  const siteAnalytics = read(siteAnalyticsPath);
  const endpointFunction = read(endpointFunctionPath);
  const summaryFunction = read(summaryFunctionPath);
  const trustPages = read(trustPagesPath);
  const wrangler = read(wranglerPath);

  const checks = [
    {
      name: "Cloudflare KV binding configured",
      passed:
        wrangler.includes('binding = "AGENTSITEOPS_ANALYTICS"') &&
        /id = "[a-f0-9]{32}"/.test(wrangler),
      detail: "wrangler.toml includes the production analytics KV binding"
    },
    {
      name: "frontend defaults to first-party endpoint",
      passed: siteAnalytics.includes('?? "/api/events"'),
      detail: "SiteAnalytics sends production events to /api/events by default"
    },
    {
      name: "frontend avoids full external URL payloads",
      passed:
        siteAnalytics.includes("source_host") &&
        siteAnalytics.includes("source_path") &&
        !/\bhref\s*:/.test(siteAnalytics),
      detail: "source-link events store source host and path instead of full href"
    },
    {
      name: "write endpoint uses aggregate KV counters",
      passed:
        endpointFunction.includes("AGENTSITEOPS_ANALYTICS") &&
        endpointFunction.includes("analytics:v1:daily") &&
        endpointFunction.includes("event_path") &&
        !endpointFunction.includes("user-agent") &&
        !endpointFunction.includes("cf-connecting-ip"),
      detail: "/api/events writes aggregate event, path, event-path, and total counters"
    },
    {
      name: "summary endpoint returns aggregate-only fields",
      passed:
        summaryFunction.includes("threshold_snapshot") &&
        summaryFunction.includes("counts_by_event") &&
        summaryFunction.includes("No IP address") &&
        !summaryFunction.includes("request.headers.get"),
      detail: "/api/events/summary exposes counts only"
    },
    {
      name: "daily summary uses total keys only",
      passed:
        summaryFunction.includes('if (kind === "total")') &&
        summaryFunction.includes("addCount(countsByDay, date, count)"),
      detail: "counts_by_day is not inflated by event, path, and event-path keys"
    },
    {
      name: "privacy page describes aggregate endpoint",
      passed:
        trustPages.includes("first-party analytics store aggregate counters only") &&
        trustPages.includes("without IP address, user agent, cookies") &&
        trustPages.includes("not full URLs or query strings"),
      detail: "/privacy/ copy matches the endpoint behavior"
    },
    {
      name: "analytics docs describe active aggregate endpoint",
      passed:
        docs.includes("first-party aggregate endpoint active") &&
        docs.includes("Do not store full external URLs") &&
        docs.includes("AGENTSITEOPS_ANALYTICS"),
      detail: "analytics event registry matches production collection"
    },
    {
      name: "endpoint contract forbids raw event retention",
      passed:
        contract.includes("Do not store raw events in KV") &&
        contract.includes("Full external URL storage") &&
        !contract.includes("90 days unless"),
      detail: "endpoint contract blocks raw event retention"
    }
  ];

  return checks;
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function renderReport(results, implementationChecks) {
  const generatedAt = new Date().toISOString();
  const failures = results.filter((result) => !result.passed);
  const implementationFailures = implementationChecks.filter((result) => !result.passed);
  const status = failures.length || implementationFailures.length ? "blocked" : "gate_ready_endpoint_active";

  const lines = [
    "# Analytics Endpoint Gate",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    "- Endpoint enabled: yes, first-party aggregate counters only",
    `- Test cases: ${results.length}`,
    `- Failed cases: ${failures.length + implementationFailures.length}`,
    "",
    "## Decision",
    "",
    "- The local event buffer remains active for browser verification.",
    "- The production endpoint may remain active only while it stores aggregate counters and does not store raw events, visitor identifiers, account data, or payment data.",
    "- Current validation rejects unknown events, sensitive payloads, nested payload values, invalid paths, stale timestamps, future timestamps, external page URLs, and oversized bodies.",
    "- Current implementation checks require Cloudflare KV binding, first-party endpoint default, sanitized source-link payloads, aggregate summary output, daily total-key counting, privacy copy, and no raw event retention.",
    "",
    "## Implementation Checks",
    "",
    "| Check | Status | Detail |",
    "|---|---|---|",
    ...implementationChecks.map((result) =>
      [
        "|",
        mdEscape(result.name),
        "|",
        result.passed ? "pass" : "fail",
        "|",
        mdEscape(result.detail),
        "|"
      ].join(" ")
    ),
    "",
    "## Test Results",
    "",
    "| Case | Expected | Actual | Status | Reason |",
    "|---|---|---|---|---|",
    ...results.map((result) =>
      [
        "|",
        mdEscape(result.name),
        "|",
        result.expectedOk ? "accept" : "reject",
        "|",
        result.ok ? "accept" : "reject",
        "|",
        result.passed ? "pass" : "fail",
        "|",
        mdEscape(result.reason),
        "|"
      ].join(" ")
    ),
    "",
    "## Required Before Activation",
    "",
    "- Keep the actual endpoint first-party unless a new privacy and compliance review passes.",
    "- Do not add raw event retention without a new privacy review and gate update.",
    "- Keep IP address, user agent, cookies, raw form text, full external URLs, email, phone, account IDs, and payment data out of the event table.",
    "- Run `npm run analytics:gate`, `npm run seo:ci`, `npm run crawler:audit`, and `npm run growth:snapshot` before activation."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);

  return { status, generatedAt, failures: [...failures, ...implementationFailures] };
}

const results = runCases();
const implementationChecks = runImplementationChecks();
const report = renderReport(results, implementationChecks);

console.log(
  JSON.stringify(
    {
      status: report.status,
      tests: results.length,
      implementationChecks: implementationChecks.length,
      failures: report.failures.length,
      reportPath
    },
    null,
    2
  )
);

if (report.failures.length) {
  process.exitCode = 1;
}
