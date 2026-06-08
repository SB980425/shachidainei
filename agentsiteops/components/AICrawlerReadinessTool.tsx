"use client";

import { useMemo, useRef, useState } from "react";

type CheckItem = {
  id: string;
  label: string;
  group: "access" | "structure" | "trust" | "continuation";
  weight: number;
};

const groupLabels = {
  access: "Crawler access",
  structure: "AI-readable structure",
  trust: "Trust and evidence",
  continuation: "Human continuation"
};

const checks: CheckItem[] = [
  {
    id: "https_200",
    label: "The page returns HTTP 200 on the canonical HTTPS URL.",
    group: "access",
    weight: 10
  },
  {
    id: "sitemap",
    label: "The canonical URL appears in a public XML sitemap.",
    group: "access",
    weight: 8
  },
  {
    id: "robots_search",
    label: "robots.txt does not block Googlebot, Bingbot, OAI-SearchBot, or PerplexityBot.",
    group: "access",
    weight: 10
  },
  {
    id: "cdn",
    label: "The CDN or WAF does not challenge intended crawlers with login, JavaScript, or bot walls.",
    group: "access",
    weight: 8
  },
  {
    id: "canonical",
    label: "The canonical tag points to the production URL and avoids parameter or redirect variants.",
    group: "structure",
    weight: 8
  },
  {
    id: "answer_block",
    label: "A short answer block near the top states what the page solves.",
    group: "structure",
    weight: 8
  },
  {
    id: "tables",
    label: "Important decisions, steps, or comparisons are visible in tables or structured lists.",
    group: "structure",
    weight: 7
  },
  {
    id: "internal_links",
    label: "The page links to supporting methodology, evidence, policy, or template pages.",
    group: "structure",
    weight: 7
  },
  {
    id: "sources",
    label: "Claims that affect trust are tied to official sources, first-party evidence, or a clear method.",
    group: "trust",
    weight: 9
  },
  {
    id: "updated",
    label: "The page shows a current update path and does not fake freshness.",
    group: "trust",
    weight: 6
  },
  {
    id: "boundaries",
    label: "The page states what it cannot prove, such as guaranteed ranking, citation, revenue, or traffic.",
    group: "trust",
    weight: 8
  },
  {
    id: "action",
    label: "A visitor can continue with a tool, checklist, template, issue, or sample report.",
    group: "continuation",
    weight: 8
  },
  {
    id: "measurement",
    label: "There is a review signal such as GSC, Bing, analytics, copy action, or audit request intent.",
    group: "continuation",
    weight: 3
  }
];

function groupedChecks() {
  return checks.reduce(
    (groups, item) => {
      groups[item.group].push(item);
      return groups;
    },
    { access: [], structure: [], trust: [], continuation: [] } as Record<
      keyof typeof groupLabels,
      CheckItem[]
    >
  );
}

function scoreLabel(score: number) {
  if (score >= 80) return "ready for focused review";
  if (score >= 65) return "repair before outreach";
  if (score >= 45) return "blocked by missing evidence";
  return "not ready";
}

function toReport(targetUrl: string, selected: string[], score: number) {
  const selectedSet = new Set(selected);
  const rows = checks.map((item) => {
    const status = selectedSet.has(item.id) ? "pass" : "missing";
    return `- ${status}: ${item.label}`;
  });

  return [
    `Target URL: ${targetUrl || "not provided"}`,
    `AI crawler readiness score: ${score}`,
    `Decision: ${scoreLabel(score)}`,
    "",
    ...rows,
    "",
    "Boundary: this score is a readiness checklist. It does not prove indexing, AI citation, ranking, traffic, or revenue."
  ].join("\n");
}

export function AICrawlerReadinessTool() {
  const [targetUrl, setTargetUrl] = useState("https://agentsiteops.com/");
  const [selected, setSelected] = useState<string[]>([
    "https_200",
    "sitemap",
    "robots_search",
    "canonical",
    "answer_block",
    "internal_links",
    "boundaries",
    "action"
  ]);
  const [copyState, setCopyState] = useState("Copy readiness report");
  const startedRef = useRef(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const score = useMemo(
    () => selected.reduce((total, id) => total + (checks.find((item) => item.id === id)?.weight ?? 0), 0),
    [selected]
  );
  const groups = useMemo(groupedChecks, []);
  const decision = scoreLabel(score);

  function track(name: string, payload: Record<string, string | number | boolean> = {}) {
    window.codexAnalytics?.track(name, {
      tool: "ai_crawler_readiness",
      score,
      decision,
      ...payload
    });
  }

  function trackStarted(trigger: string) {
    if (startedRef.current) return;
    startedRef.current = true;
    track("tool_started", { trigger });
  }

  function toggle(id: string) {
    trackStarted(`check:${id}`);
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function copyReport() {
    const text = toReport(targetUrl, selected, score);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopyState("Copied");
      track("tool_completed", { export_method: "copy" });
      track("tool_result_export", { export_method: "copy" });
      window.dispatchEvent(new CustomEvent("tool_completed", { detail: { score, decision } }));
    } catch {
      setCopyState("Copy failed");
    }
    window.setTimeout(() => setCopyState("Copy readiness report"), 1600);
  }

  return (
    <section className="scorer-workspace" aria-label="AI crawler readiness scoring tool">
      <div className="scorer-inputs">
        <label className="field-block">
          <span>Target URL</span>
          <input
            value={targetUrl}
            onChange={(event) => {
              trackStarted("target_url");
              setTargetUrl(event.target.value);
            }}
          />
        </label>
        <label className="field-block">
          <span>Scoring model</span>
          <input readOnly value="Manual readiness checklist; no live crawl; no ranking guarantee" />
        </label>
      </div>

      <div className="scorer-layout">
        <div className="scorer-fields">
          {Object.entries(groups).map(([group, items]) => (
            <section className="scorer-group" key={group}>
              <h2>{groupLabels[group as keyof typeof groupLabels]}</h2>
              <div className="blocker-list">
                {items.map((item) => (
                  <label key={item.id}>
                    <input
                      checked={selectedSet.has(item.id)}
                      type="checkbox"
                      onChange={() => toggle(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="scorer-result">
          <div className={`decision-badge ${score >= 65 ? "decision-proceed" : "decision-pivot"}`}>
            {decision}
          </div>
          <strong>{score}</strong>
          <h2>Readiness score</h2>
          <p>
            This tool checks whether a page is structured for discovery and review. It does not
            run a live crawl and does not prove indexing, AI citation, traffic, conversion, or
            revenue.
          </p>
          <div className="result-actions">
            <button className="primary-action" type="button" onClick={copyReport}>
              {copyState}
            </button>
            <a className="secondary-action" href="/examples/agentsiteops-self-audit/">
              View sample audit
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
