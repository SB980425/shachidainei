"use client";

import { useMemo, useRef, useState } from "react";

const statusOptions = [
  "idea only",
  "draft pages exist",
  "site is live",
  "search consoles connected",
  "has first-party search data"
];

const defaultEvidence = {
  productionUrl: true,
  sitemap: true,
  robots: true,
  sourcePack: false,
  gsc: false,
  bing: false,
  analytics: false,
  revenue: false
};

type EvidenceKey = keyof typeof defaultEvidence;

const evidenceLabels: Record<EvidenceKey, string> = {
  productionUrl: "Production URL is live",
  sitemap: "Sitemap URL is available",
  robots: "Robots.txt policy is known",
  sourcePack: "Source pack or source list exists",
  gsc: "Google Search Console export exists",
  bing: "Bing Webmaster Tools export exists",
  analytics: "Onsite event data exists",
  revenue: "Payment or customer request evidence exists"
};

function decisionFor(score: number, hasYMYL: boolean) {
  if (hasYMYL) {
    return "blocked until qualified review";
  }

  if (score >= 70) {
    return "ready for manual audit scope review";
  }

  if (score >= 45) {
    return "needs evidence before audit";
  }

  return "not ready for audit";
}

function buildScopeText(input: {
  siteUrl: string;
  candidateIdea: string;
  targetMarket: string;
  currentStatus: string;
  decisionNeeded: string;
  pageCount: string;
  evidence: Record<EvidenceKey, boolean>;
  hasYMYL: boolean;
  score: number;
  decision: string;
  missingEvidence: string[];
}) {
  return [
    "AgentSiteOps audit scope draft",
    "",
    `Public URL: ${input.siteUrl || "not provided"}`,
    `Candidate idea: ${input.candidateIdea || "not provided"}`,
    `Target market: ${input.targetMarket || "not provided"}`,
    `Current status: ${input.currentStatus}`,
    `Decision needed: ${input.decisionNeeded || "not provided"}`,
    `Approximate page count: ${input.pageCount || "not provided"}`,
    `YMYL or regulated topic: ${input.hasYMYL ? "yes" : "no"}`,
    "",
    `Scope readiness score: ${input.score}`,
    `Scope decision: ${input.decision}`,
    "",
    "Evidence available:",
    ...Object.entries(input.evidence).map(
      ([key, enabled]) => `- ${enabled ? "yes" : "no"}: ${evidenceLabels[key as EvidenceKey]}`
    ),
    "",
    "Missing evidence:",
    ...(input.missingEvidence.length ? input.missingEvidence.map((item) => `- ${item}`) : ["- none"]),
    "",
    "Boundary: this scope draft is local-only. It does not submit a request, collect payment, store personal data, or guarantee indexing, AI citation, traffic, conversion, revenue, legal, financial, or tax outcomes."
  ].join("\n");
}

async function writeClipboardWithFallback(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea copy path for restricted browser modes.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

export function AuditScopeBuilder() {
  const [siteUrl, setSiteUrl] = useState("https://agentsiteops.com/");
  const [candidateIdea, setCandidateIdea] = useState("AI website operating system for small site builders");
  const [targetMarket, setTargetMarket] = useState("English-speaking indie builders and small operators");
  const [currentStatus, setCurrentStatus] = useState("site is live");
  const [decisionNeeded, setDecisionNeeded] = useState("Which search-entry pages should be repaired, expanded, merged, or paused first?");
  const [pageCount, setPageCount] = useState("28");
  const [hasYMYL, setHasYMYL] = useState(false);
  const [evidence, setEvidence] = useState(defaultEvidence);
  const [copyState, setCopyState] = useState("Copy scope draft");
  const startedRef = useRef(false);

  const score = useMemo(() => {
    const evidenceScore = Object.values(evidence).filter(Boolean).length * 8;
    const fieldScore = [siteUrl, candidateIdea, targetMarket, decisionNeeded, pageCount].filter(
      (value) => value.trim().length > 0
    ).length * 6;
    const statusScore = statusOptions.indexOf(currentStatus) >= 2 ? 10 : 4;
    const penalty = hasYMYL ? 35 : 0;
    return Math.max(0, Math.min(100, evidenceScore + fieldScore + statusScore - penalty));
  }, [candidateIdea, currentStatus, decisionNeeded, evidence, hasYMYL, pageCount, siteUrl, targetMarket]);

  const decision = decisionFor(score, hasYMYL);

  const missingEvidence = useMemo(
    () =>
      (Object.keys(evidence) as EvidenceKey[])
        .filter((key) => !evidence[key])
        .map((key) => evidenceLabels[key]),
    [evidence]
  );

  function track(name: string, payload: Record<string, string | number | boolean> = {}) {
    window.codexAnalytics?.track(name, {
      tool: "audit_scope_builder",
      score,
      decision,
      ...payload
    });
  }

  function trackStarted(trigger: string) {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    track("tool_started", { trigger });
  }

  function updateEvidence(key: EvidenceKey) {
    trackStarted(`evidence:${key}`);
    setEvidence((current) => ({ ...current, [key]: !current[key] }));
  }

  async function copyScope() {
    const text = buildScopeText({
      siteUrl,
      candidateIdea,
      targetMarket,
      currentStatus,
      decisionNeeded,
      pageCount,
      evidence,
      hasYMYL,
      score,
      decision,
      missingEvidence
    });

    try {
      const copied = await writeClipboardWithFallback(text);

      if (!copied) {
        throw new Error("Clipboard unavailable");
      }

      setCopyState("Copied");
      track("tool_completed", { export_method: "copy" });
      track("tool_result_export", { export_method: "copy" });
      window.dispatchEvent(new CustomEvent("tool_completed", { detail: { score, decision } }));
    } catch {
      setCopyState("Copy failed");
    }

    window.setTimeout(() => setCopyState("Copy scope draft"), 1600);
  }

  return (
    <section className="scope-builder" aria-label="Audit scope builder">
      <div className="scope-form">
        <label className="field-block">
          <span>Public URL</span>
          <input
            value={siteUrl}
            onChange={(event) => {
              trackStarted("site_url");
              setSiteUrl(event.target.value);
            }}
          />
        </label>
        <label className="field-block">
          <span>Candidate idea</span>
          <input
            value={candidateIdea}
            onChange={(event) => {
              trackStarted("candidate_idea");
              setCandidateIdea(event.target.value);
            }}
          />
        </label>
        <label className="field-block">
          <span>Target market</span>
          <input
            value={targetMarket}
            onChange={(event) => {
              trackStarted("target_market");
              setTargetMarket(event.target.value);
            }}
          />
        </label>
        <label className="field-block">
          <span>Current status</span>
          <select
            value={currentStatus}
            onChange={(event) => {
              trackStarted("current_status");
              setCurrentStatus(event.target.value);
            }}
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Decision needed</span>
          <textarea
            value={decisionNeeded}
            onChange={(event) => {
              trackStarted("decision_needed");
              setDecisionNeeded(event.target.value);
            }}
          />
        </label>
        <label className="field-block">
          <span>Approximate page count</span>
          <input
            value={pageCount}
            onChange={(event) => {
              trackStarted("page_count");
              setPageCount(event.target.value);
            }}
          />
        </label>
        <label className="checkbox-row">
          <input
            checked={hasYMYL}
            type="checkbox"
            onChange={() => {
              trackStarted("ymyl");
              setHasYMYL((current) => !current);
            }}
          />
          <span>YMYL, legal, medical, financial, tax, or safety topic</span>
        </label>
      </div>

      <div className="scope-panel">
        <div className="scope-score">
          <span>{score}</span>
          <div>
            <strong>{decision}</strong>
            <p>Local-only scope readiness. No request or payment is submitted.</p>
          </div>
        </div>

        <section>
          <h2>Evidence checklist</h2>
          <div className="scope-check-grid">
            {(Object.keys(evidence) as EvidenceKey[]).map((key) => (
              <label className="checkbox-row" key={key}>
                <input checked={evidence[key]} type="checkbox" onChange={() => updateEvidence(key)} />
                <span>{evidenceLabels[key]}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2>Missing evidence</h2>
          <ul className="compact-list">
            {missingEvidence.length ? (
              missingEvidence.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>No missing evidence in the current local draft.</li>
            )}
          </ul>
        </section>

        <button className="primary-action" type="button" onClick={copyScope}>
          {copyState}
        </button>
      </div>
    </section>
  );
}
