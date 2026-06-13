type PayloadValue = string | number | boolean | null;

type AnalyticsEvent = {
  name: string;
  payload: Record<string, PayloadValue>;
  page_url?: string;
  path: string;
  timestamp: string;
};

const siteOrigin = "https://agentsiteops.com";
const maxBodyBytes = 8 * 1024;
const maxPayloadKeyLength = 64;
const maxPayloadStringLength = 200;
const maxPastMs = 24 * 60 * 60 * 1000;
const maxFutureMs = 10 * 60 * 1000;
const kvPrefix = "analytics:v1:daily";

const allowedEvents = new Set([
  "page_view",
  "update_log_view",
  "start_page_view",
  "how_it_works_view",
  "execution_workbench_view",
  "operating_system_view",
  "tool_page_view",
  "ai_crawler_readiness_view",
  "sample_audit_view",
  "fit_review_sample_view",
  "audit_intent_page_view",
  "audit_scope_builder_view",
  "launch_blueprint_fit_checker_view",
  "route_file_fit_checker_view",
  "route_confidence_checker_view",
  "starter_pack_view",
  "repo_skeleton_matrix_view",
  "ci_gate_matrix_view",
  "content_quality_gate_view",
  "search_console_launch_checklist_view",
  "ai_citation_readiness_view",
  "launch_validation_decision_gate_view",
  "delivery_gate_alias_view",
  "route_file_delivery_gate_view",
  "pseo_batch_audit_view",
  "pseo_index_map_view",
  "ai_search_robots_guide_view",
  "indexnow_cloudflare_pages_view",
  "gsc_bing_sitemap_verification_view",
  "small_ai_visibility_metrics_view",
  "ai_metric_matrix_view",
  "review_window_view",
  "evidence_ledger_view",
  "route_evidence_dashboard_view",
  "route_basis_report_view",
  "agentsiteops_route_run_view",
  "client_route_workflow_view",
  "route_evidence_filter_used",
  "evidence_ledger_template_view",
  "route_research_prompt_pack_view",
  "opportunity_scoring_template_view",
  "scoring_methodology_view",
  "scoring_model_limit_view",
  "route_selection_methodology_view",
  "first_traffic_system_view",
  "exposure_sprint_48h_view",
  "launch_kit_view",
  "answer_offer_validation_view",
  "answer_route_vs_chatgpt_view",
  "answer_stop_rule_view",
  "launch_blueprint_legacy_view",
  "route_file_service_view",
  "launch_blueprint_pricing_view",
  "route_file_pricing_view",
  "launch_blueprint_sample_view",
  "sample_route_file_view",
  "launch_blueprint_compare_view",
  "route_file_compare_view",
  "starter_review_view",
  "launch_blueprint_buy_view",
  "route_file_buy_view",
  "launch_blueprint_intake_view",
  "route_file_intake_view",
  "launch_blueprint_thank_you_view",
  "route_file_thank_you_view",
  "contact_page_view",
  "trust_policy_view",
  "tool_started",
  "tool_completed",
  "tool_result_export",
  "template_copy_click",
  "checklist_copy_click",
  "execution_stage_selected",
  "execution_stage_status_changed",
  "social_copy_variant_copied",
  "payment_cta_click",
  "intake_email_click",
  "contact_email_click",
  "cta_click",
  "source_link_click"
]);

const sensitiveKeyPattern =
  /(email|mail|phone|tel|account|payment|card|password|secret|token|ip|cookie|fingerprint|device|raw|message|comment|text)/i;
const emailValuePattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneValuePattern = /(?:\+?\d[\d\s().-]{7,}\d)/;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8"
    },
    status
  });
}

function noContent(status = 204) {
  return new Response(null, { status });
}

function reject(reason: string) {
  return { ok: false, reason };
}

function isPlainPayloadValue(value: unknown): value is PayloadValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function normalizePath(path: string) {
  const url = new URL(path, siteOrigin);
  const pathname = url.pathname.startsWith("/") ? url.pathname : "/";
  return pathname === "/" || pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function validateEvent(event: unknown) {
  const bodySize = new TextEncoder().encode(JSON.stringify(event ?? {})).length;

  if (bodySize > maxBodyBytes) {
    return reject("request body over 8 KB");
  }

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return reject("event body must be an object");
  }

  const candidate = event as Record<string, unknown>;

  if (typeof candidate.name !== "string" || !candidate.name) {
    return reject("missing event name");
  }

  if (!allowedEvents.has(candidate.name)) {
    return reject("unknown event name");
  }

  if (typeof candidate.path !== "string" || !candidate.path.startsWith("/")) {
    return reject("path must start with slash");
  }

  if (typeof candidate.timestamp !== "string" || !candidate.timestamp) {
    return reject("missing timestamp");
  }

  const timestamp = Date.parse(candidate.timestamp);
  const now = Date.now();

  if (!Number.isFinite(timestamp)) {
    return reject("invalid timestamp");
  }

  if (now - timestamp > maxPastMs) {
    return reject("timestamp older than 24 hours");
  }

  if (timestamp - now > maxFutureMs) {
    return reject("timestamp more than 10 minutes in the future");
  }

  if (candidate.page_url !== undefined) {
    if (typeof candidate.page_url !== "string") {
      return reject("page_url must be a string");
    }

    try {
      const pageUrl = new URL(candidate.page_url);
      if (pageUrl.origin !== siteOrigin) {
        return reject("page_url origin is not allowed");
      }
    } catch {
      return reject("invalid page_url");
    }
  }

  const payload = candidate.payload ?? {};

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return reject("payload must be an object");
  }

  const cleanPayload: AnalyticsEvent["payload"] = {};

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

    cleanPayload[key] = value;
  }

  return {
    event: {
      name: candidate.name,
      page_url: typeof candidate.page_url === "string" ? candidate.page_url : undefined,
      path: normalizePath(candidate.path),
      payload: cleanPayload,
      timestamp: candidate.timestamp
    },
    ok: true
  };
}

async function increment(kv: KVNamespace, key: string) {
  const current = Number(await kv.get(key));
  const next = Number.isFinite(current) ? current + 1 : 1;
  await kv.put(key, String(next));
}

async function persistEvent(kv: KVNamespace, event: AnalyticsEvent) {
  const date = new Date(event.timestamp).toISOString().slice(0, 10);
  const pathKey = event.path.replace(/[^a-zA-Z0-9/_-]/g, "").slice(0, 160) || "/";
  const eventKey = event.name.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);

  await Promise.all([
    increment(kv, `${kvPrefix}:${date}:event:${eventKey}`),
    increment(kv, `${kvPrefix}:${date}:path:${pathKey}`),
    increment(kv, `${kvPrefix}:${date}:event_path:${eventKey}:${pathKey}`),
    increment(kv, `${kvPrefix}:${date}:total`)
  ]);
}

export function onRequestOptions() {
  return noContent();
}

export async function onRequestPost(context: {
  env: { AGENTSITEOPS_ANALYTICS?: KVNamespace };
  request: Request;
}) {
  const kv = context.env.AGENTSITEOPS_ANALYTICS;

  if (!kv) {
    return jsonResponse({ error: "analytics namespace is not configured" }, 503);
  }

  const contentType = context.request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return jsonResponse({ error: "content-type must be application/json" }, 415);
  }

  const origin = context.request.headers.get("origin");
  if (origin && origin !== siteOrigin) {
    return jsonResponse({ error: "origin is not allowed" }, 403);
  }

  const text = await context.request.text();
  if (new TextEncoder().encode(text).length > maxBodyBytes) {
    return jsonResponse({ error: "request body over 8 KB" }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return jsonResponse({ error: "invalid JSON" }, 400);
  }

  const result = validateEvent(body);
  if (!result.ok) {
    return jsonResponse({ error: result.reason }, 400);
  }

  await persistEvent(kv, result.event);
  return noContent();
}

export function onRequestGet() {
  return jsonResponse({ error: "use /api/events/summary for aggregate counts" }, 405);
}
