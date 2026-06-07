"use client";

import { useMemo, useRef, useState } from "react";
import {
  calculateScore,
  defaultScoreValues,
  getDecision,
  getDecisionLabel,
  scoreFields,
  type ScoreKey,
  type ScoreValues
} from "@/lib/scoring";

const blockers = [
  "YMYL topic lacks a qualified author or reviewer",
  "Directory, comparison, or data site lacks a stable legal data source",
  "The plan relies only on AI rewrites of public content",
  "SERP is fully dominated by official, platform, map, video, or answer-box results",
  "Monetization conflicts with user trust or compliance"
];

const groupLabels = {
  market: "Market and validation",
  asset: "Assets and moat",
  ai: "AI citation and structure",
  risk: "Risk control"
};

function toCsvRow(values: string[]) {
  return values.map((value) => `"${value.replaceAll('"', '""')}"`).join(",");
}

export function OpportunityScorer() {
  const [idea, setIdea] = useState("AI website operating system for indie builders");
  const [siteType, setSiteType] = useState("Template site + tool site + methodology library");
  const [values, setValues] = useState<ScoreValues>(defaultScoreValues);
  const [activeBlockers, setActiveBlockers] = useState<string[]>([]);
  const [copyState, setCopyState] = useState("Copy result");
  const startedRef = useRef(false);

  const score = useMemo(() => calculateScore(values), [values]);
  const decision = getDecision(score, activeBlockers.length > 0);
  const decisionLabel = getDecisionLabel(decision);

  const groupedFields = scoreFields.reduce(
    (groups, field) => {
      groups[field.group].push(field);
      return groups;
    },
    { market: [], asset: [], ai: [], risk: [] } as Record<keyof typeof groupLabels, typeof scoreFields>
  );

  function track(name: string, payload: Record<string, string | number | boolean> = {}) {
    window.codexAnalytics?.track(name, {
      tool: "website_opportunity_scorer",
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

  function updateScore(key: ScoreKey, nextValue: number) {
    trackStarted(`score:${key}`);
    setValues((current) => ({ ...current, [key]: nextValue }));
  }

  function toggleBlocker(blocker: string) {
    trackStarted("blocker");
    setActiveBlockers((current) =>
      current.includes(blocker) ? current.filter((item) => item !== blocker) : [...current, blocker]
    );
  }

  function buildResultText() {
    const fieldLines = scoreFields.map((field) => `${field.label}: ${values[field.key]}/5`);
    return [
      `Website idea: ${idea}`,
      `Site type: ${siteType}`,
      `Score: ${score}`,
      `Decision: ${decision} - ${decisionLabel}`,
      `Hard blockers: ${activeBlockers.length ? activeBlockers.join("; ") : "none"}`,
      "",
      ...fieldLines
    ].join("\n");
  }

  async function copyResult() {
    const text = buildResultText();
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
    window.setTimeout(() => setCopyState("Copy result"), 1600);
  }

  function downloadCsv() {
    const header = ["field", "score", "weight"];
    const rows = scoreFields.map((field) =>
      toCsvRow([field.label, String(values[field.key]), String(field.weight)])
    );
    const meta = [
      toCsvRow(["idea", idea, ""]),
      toCsvRow(["site_type", siteType, ""]),
      toCsvRow(["weighted_score", String(score), ""]),
      toCsvRow(["decision", decision, decisionLabel]),
      toCsvRow(["blockers", activeBlockers.join("; "), ""])
    ];
    const csv = [toCsvRow(header), ...meta, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "website-opportunity-score.csv";
    link.click();
    URL.revokeObjectURL(url);
    track("tool_completed", { export_method: "csv_download" });
    track("tool_result_export", { export_method: "csv_download" });
    window.dispatchEvent(new CustomEvent("tool_completed", { detail: { score, decision } }));
  }

  return (
    <section className="scorer-workspace" aria-label="Website opportunity scorer">
      <div className="scorer-inputs">
        <label className="field-block">
          <span>Website idea</span>
          <input
            value={idea}
            onChange={(event) => {
              trackStarted("idea");
              setIdea(event.target.value);
            }}
          />
        </label>
        <label className="field-block">
          <span>Site type</span>
          <select
            value={siteType}
            onChange={(event) => {
              trackStarted("site_type");
              setSiteType(event.target.value);
            }}
          >
            <option>Template site + tool site + methodology library</option>
            <option>Resource library + tool site</option>
            <option>Comparison site + data library</option>
            <option>Content site + newsletter</option>
            <option>Lead site + tool site</option>
          </select>
        </label>
      </div>

      <div className="scorer-layout">
        <div className="scorer-fields">
          {Object.entries(groupedFields).map(([group, fields]) => (
            <section className="scorer-group" key={group}>
              <h2>{groupLabels[group as keyof typeof groupLabels]}</h2>
              {fields.map((field) => (
                <label className="range-row" key={field.key}>
                  <span className="range-title">
                    <strong>{field.label}</strong>
                    <small>
                      {field.low} / {field.high}
                    </small>
                  </span>
                  <input
                    min="1"
                    max="5"
                    step="1"
                    type="range"
                    value={values[field.key]}
                    onChange={(event) => updateScore(field.key, Number(event.target.value))}
                  />
                  <output>{values[field.key]}</output>
                </label>
              ))}
            </section>
          ))}

          <section className="scorer-group">
            <h2>Hard blockers</h2>
            <div className="blocker-list">
              {blockers.map((blocker) => (
                <label key={blocker}>
                  <input
                    checked={activeBlockers.includes(blocker)}
                    type="checkbox"
                    onChange={() => toggleBlocker(blocker)}
                  />
                  <span>{blocker}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="scorer-result">
          <div className={`decision-badge decision-${decision}`}>{decision}</div>
          <strong>{score}</strong>
          <h2>{decisionLabel}</h2>
          <p>
            {decision === "block"
              ? "Clear hard blockers before entering site blueprint."
              : "Use this as a first-pass decision. Search volume and SERP conditions still need real validation."}
          </p>
          <div className="result-actions">
            <button className="primary-action" type="button" onClick={copyResult}>
              {copyState}
            </button>
            <button className="secondary-action" type="button" onClick={downloadCsv}>
              Download CSV
            </button>
          </div>
          <dl className="result-summary">
            <div>
              <dt>AI citation</dt>
              <dd>{values.aiCitationProbability}/5</dd>
            </div>
            <div>
              <dt>Original value</dt>
              <dd>{values.originalValue}/5</dd>
            </div>
            <div>
              <dt>Compliance safety</dt>
              <dd>{values.complianceSafety}/5</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
