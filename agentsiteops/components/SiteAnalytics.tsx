"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type AnalyticsEvent = {
  name: string;
  payload: Record<string, string | number | boolean | null>;
  page_url: string;
  path: string;
  timestamp: string;
};

declare global {
  interface Window {
    codexAnalytics?: {
      track: (name: string, payload?: AnalyticsPayload) => void;
    };
    __codexAnalyticsEvents?: AnalyticsEvent[];
  }
}

const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
const sessionKey = "codex-seo-events";

const pathViewEvents: Record<string, string[]> = {
  "/updates/": ["update_log_view"],
  "/ai-website-operating-system/": ["operating_system_view"],
  "/tools/website-opportunity-scorer/": ["tool_page_view"],
  "/tools/ai-crawler-readiness/": ["ai_crawler_readiness_view"],
  "/examples/agentsiteops-self-audit/": ["sample_audit_view"],
  "/examples/fit-review-sample/": ["fit_review_sample_view"],
  "/services/ai-website-opportunity-audit/": ["audit_intent_page_view"],
  "/tools/audit-scope-builder/": ["audit_scope_builder_view"],
  "/tools/launch-blueprint-fit-checker/": ["launch_blueprint_fit_checker_view"],
  "/templates/starter-pack/": ["starter_pack_view"],
  "/templates/seo-repo-skeleton/": ["repo_skeleton_matrix_view", "ci_gate_matrix_view"],
  "/checklists/ai-content-quality-gate/": ["content_quality_gate_view"],
  "/checklists/gsc-bing-indexnow-launch/": ["search_console_launch_checklist_view"],
  "/checklists/ai-citation-readiness/": ["ai_citation_readiness_view"],
  "/checklists/launch-validation-decision-gate/": ["launch_validation_decision_gate_view"],
  "/checklists/programmatic-seo-gate/": ["pseo_batch_audit_view", "pseo_index_map_view"],
  "/guides/ai-search-friendly-robots-txt/": ["ai_search_robots_guide_view"],
  "/guides/indexnow-cloudflare-pages/": ["indexnow_cloudflare_pages_view"],
  "/guides/gsc-bing-sitemap-verification/": ["gsc_bing_sitemap_verification_view"],
  "/guides/small-website-ai-visibility-metrics/": ["small_ai_visibility_metrics_view"],
  "/guides/ai-citation-grounding-metrics/": ["ai_metric_matrix_view", "review_window_view"],
  "/evidence/": ["evidence_ledger_view"],
  "/reports/route-evidence-dashboard/": ["route_evidence_dashboard_view"],
  "/templates/evidence-ledger-template/": ["evidence_ledger_template_view"],
  "/templates/website-opportunity-scoring-template/": ["opportunity_scoring_template_view"],
  "/methodology/website-opportunity-scoring/": [
    "scoring_methodology_view",
    "scoring_model_limit_view"
  ],
  "/methodology/route-selection/": ["route_selection_methodology_view"],
  "/guides/first-traffic-system/": ["first_traffic_system_view"],
  "/website-opportunity-audit/": ["launch_blueprint_legacy_view"],
  "/pricing/": ["launch_blueprint_pricing_view"],
  "/sample/": ["launch_blueprint_sample_view"],
  "/compare/": ["launch_blueprint_compare_view"],
  "/starter-review/": ["starter_review_view"],
  "/buy/": ["launch_blueprint_buy_view"],
  "/intake/": ["launch_blueprint_intake_view"],
  "/thank-you/": ["launch_blueprint_thank_you_view"],
  "/terms/": ["trust_policy_view"],
  "/refund-policy/": ["trust_policy_view"],
  "/disclaimer/": ["trust_policy_view"],
  "/contact/": ["contact_page_view"],
  "/authors/": ["trust_policy_view"],
  "/editorial-policy/": ["trust_policy_view"],
  "/privacy/": ["trust_policy_view"],
  "/disclosure/": ["trust_policy_view"]
};

function normalizePath(pathname: string) {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function sanitizePayload(payload: AnalyticsPayload = {}) {
  const clean: AnalyticsEvent["payload"] = {};

  for (const [rawKey, rawValue] of Object.entries(payload)) {
    if (rawValue === undefined) {
      continue;
    }

    const key = rawKey.slice(0, 64);

    if (typeof rawValue === "string") {
      clean[key] = rawValue.slice(0, 200);
    } else if (
      typeof rawValue === "number" ||
      typeof rawValue === "boolean" ||
      rawValue === null
    ) {
      clean[key] = rawValue;
    }
  }

  return clean;
}

function storeEvent(event: AnalyticsEvent) {
  window.__codexAnalyticsEvents = [...(window.__codexAnalyticsEvents ?? []), event].slice(-100);

  try {
    const current = JSON.parse(window.sessionStorage.getItem(sessionKey) ?? "[]") as AnalyticsEvent[];
    window.sessionStorage.setItem(sessionKey, JSON.stringify([...current, event].slice(-100)));
  } catch {
    // sessionStorage can be unavailable in restricted browser modes.
  }
}

function sendEvent(event: AnalyticsEvent) {
  if (!endpoint) {
    return;
  }

  const body = JSON.stringify(event);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(endpoint, {
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST"
  }).catch(() => {});
}

function createTracker(pathname: string) {
  const path = normalizePath(pathname);

  return function track(name: string, payload: AnalyticsPayload = {}) {
    const event: AnalyticsEvent = {
      name,
      payload: sanitizePayload(payload),
      page_url: window.location.href,
      path,
      timestamp: new Date().toISOString()
    };

    storeEvent(event);
    sendEvent(event);
    window.dispatchEvent(new CustomEvent("codex:analytics-recorded", { detail: event }));
  };
}

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const track = createTracker(pathname);
    window.codexAnalytics = { track };

    track("page_view", { path: normalizePath(pathname) });

    for (const eventName of pathViewEvents[normalizePath(pathname)] ?? []) {
      track(eventName, { path: normalizePath(pathname) });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest("a[href]");
      const markedElement = target?.closest("[data-analytics-event]");

      if (markedElement instanceof HTMLElement) {
        track(markedElement.dataset.analyticsEvent ?? "cta_click", {
          label: markedElement.dataset.analyticsLabel,
          target: markedElement.dataset.analyticsTarget,
          type: markedElement.dataset.analyticsType
        });
        return;
      }

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const href = link.getAttribute("href") ?? "";

      if (link.origin !== window.location.origin) {
        track("source_link_click", {
          href,
          label: link.textContent?.replace(/\s+/g, " ").trim().slice(0, 120) ?? ""
        });
      }
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  return null;
}
