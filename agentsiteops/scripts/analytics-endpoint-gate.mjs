import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const eventsDocPath = resolve(rootDir, "docs", "analytics-events.md");
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

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function renderReport(results) {
  const generatedAt = new Date().toISOString();
  const failures = results.filter((result) => !result.passed);
  const status = failures.length ? "blocked" : "gate_ready_endpoint_disabled";

  const lines = [
    "# Analytics Endpoint Gate",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    "- Endpoint enabled: no",
    `- Test cases: ${results.length}`,
    `- Failed cases: ${failures.length}`,
    "",
    "## Decision",
    "",
    "- The local event buffer may remain active.",
    "- A real analytics endpoint must not be enabled until this gate passes and the privacy page is updated for the selected endpoint, retention period, and deletion path.",
    "- Current validation rejects unknown events, sensitive payloads, nested payload values, invalid paths, stale timestamps, future timestamps, external page URLs, and oversized bodies.",
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
    "- Select the actual endpoint or first-party proxy.",
    "- Define raw event retention and deletion path.",
    "- Update `/privacy/` before production collection.",
    "- Keep IP address, user agent, cookies, raw form text, email, phone, account IDs, and payment data out of the event table.",
    "- Run `npm run analytics:gate`, `npm run seo:ci`, `npm run crawler:audit`, and `npm run growth:snapshot` before activation."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);

  return { status, generatedAt, failures };
}

const results = runCases();
const report = renderReport(results);

console.log(
  JSON.stringify(
    {
      status: report.status,
      tests: results.length,
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
