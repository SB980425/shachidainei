"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type RouteEvidenceRow = {
  url: string;
  page_type: string;
  cluster: string;
  technical_seo_status: string;
  crawler_access_status: string;
  gsc_status: string;
  bing_status: string;
  ai_referral_status: string;
  onsite_event_status: string;
  current_action: string;
  next_required_evidence: string;
};

const evidenceModes = [
  { label: "All evidence states", value: "all" },
  { label: "Missing search exports", value: "missing_search" },
  { label: "Missing AI referral evidence", value: "missing_ai_referral" },
  { label: "Local-only onsite events", value: "local_events" },
  { label: "Technical release ready", value: "technical_ready" }
];

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function matchesEvidenceMode(row: RouteEvidenceRow, mode: string) {
  if (mode === "missing_search") {
    return row.gsc_status === "pending_export" || row.bing_status === "pending_export";
  }

  if (mode === "missing_ai_referral") {
    return row.ai_referral_status.includes("pending");
  }

  if (mode === "local_events") {
    return row.onsite_event_status === "local_buffer_only";
  }

  if (mode === "technical_ready") {
    return row.technical_seo_status === "pass" && row.crawler_access_status === "site_pass";
  }

  return true;
}

function rowSearchText(row: RouteEvidenceRow) {
  return [
    row.url,
    row.page_type,
    row.cluster,
    row.technical_seo_status,
    row.crawler_access_status,
    row.gsc_status,
    row.bing_status,
    row.current_action,
    row.next_required_evidence
  ]
    .join(" ")
    .toLowerCase();
}

export function RouteEvidenceExplorer({ rows }: { rows: RouteEvidenceRow[] }) {
  const [query, setQuery] = useState("");
  const [pageType, setPageType] = useState("all");
  const [action, setAction] = useState("all");
  const [evidenceMode, setEvidenceMode] = useState("all");

  const pageTypes = useMemo(() => unique(rows.map((row) => row.page_type)), [rows]);
  const actions = useMemo(() => unique(rows.map((row) => row.current_action)), [rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (pageType !== "all" && row.page_type !== pageType) {
        return false;
      }

      if (action !== "all" && row.current_action !== action) {
        return false;
      }

      if (!matchesEvidenceMode(row, evidenceMode)) {
        return false;
      }

      if (normalizedQuery && !rowSearchText(row).includes(normalizedQuery)) {
        return false;
      }

      return true;
    });
  }, [action, evidenceMode, pageType, query, rows]);

  function trackFilter(filterType: string, value: string) {
    window.codexAnalytics?.track("route_evidence_filter_used", {
      filter_type: filterType,
      filter_value: filterType === "query" ? "redacted" : value,
      has_query: query.trim().length > 0,
      visible_count: filteredRows.length
    });
  }

  function clearFilters() {
    setQuery("");
    setPageType("all");
    setAction("all");
    setEvidenceMode("all");
    window.codexAnalytics?.track("route_evidence_filter_used", {
      filter_type: "clear",
      filter_value: "all",
      has_query: false,
      visible_count: rows.length
    });
  }

  return (
    <section className="route-evidence-explorer" aria-label="route evidence explorer">
      <div className="dashboard-filters">
        <label className="field-block">
          <span>Search route evidence</span>
          <input
            value={query}
            onBlur={() => trackFilter("query", "redacted")}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by URL, type, cluster, status, or next evidence"
          />
        </label>
        <label className="field-block">
          <span>Page type</span>
          <select
            value={pageType}
            onChange={(event) => {
              setPageType(event.target.value);
              trackFilter("page_type", event.target.value);
            }}
          >
            <option value="all">All page types</option>
            {pageTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Evidence state</span>
          <select
            value={evidenceMode}
            onChange={(event) => {
              setEvidenceMode(event.target.value);
              trackFilter("evidence_mode", event.target.value);
            }}
          >
            {evidenceModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Current action</span>
          <select
            value={action}
            onChange={(event) => {
              setAction(event.target.value);
              trackFilter("current_action", event.target.value);
            }}
          >
            <option value="all">All actions</option>
            {actions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-result-bar">
        <strong>{filteredRows.length} visible routes</strong>
        <span>{rows.length} total routes in the current growth evidence snapshot.</span>
        <button type="button" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      <div className="table-scroll">
        <table className="data-table route-evidence-table">
          <thead>
            <tr>
              <th scope="col">URL</th>
              <th scope="col">Type</th>
              <th scope="col">Tech</th>
              <th scope="col">Crawler</th>
              <th scope="col">GSC</th>
              <th scope="col">Bing</th>
              <th scope="col">Action</th>
              <th scope="col">Next evidence</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.url}>
                <th scope="row">
                  <Link href={row.url}>{row.url}</Link>
                </th>
                <td>{row.page_type}</td>
                <td>{row.technical_seo_status}</td>
                <td>{row.crawler_access_status}</td>
                <td>{row.gsc_status}</td>
                <td>{row.bing_status}</td>
                <td>{row.current_action}</td>
                <td>{row.next_required_evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
