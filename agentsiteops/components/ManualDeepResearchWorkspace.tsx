"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCopy, FileCheck2, RefreshCw, SearchCheck } from "lucide-react";
import {
  buildGapResearchPrompt,
  buildManualDeepResearchPrompt,
  buildRouteSynthesisTemplate,
  manualResearchFields,
  researchCoverageChecks
} from "@/lib/routeResearchPromptPack";

const initialFields = Object.fromEntries(
  manualResearchFields.map((field) => [field.id, field.defaultValue])
) as Record<string, string>;

function hasKeyword(report: string, keywords: string[]) {
  const normalized = report.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function ManualDeepResearchWorkspace() {
  const [fields, setFields] = useState<Record<string, string>>(initialFields);
  const [report, setReport] = useState("");
  const [copyState, setCopyState] = useState("Nothing copied yet.");

  const masterPrompt = useMemo(() => buildManualDeepResearchPrompt(fields), [fields]);

  const coverage = useMemo(
    () =>
      researchCoverageChecks.map((check) => ({
        ...check,
        passed: report.trim().length > 0 && hasKeyword(report, check.keywords)
      })),
    [report]
  );

  const missingChecks = coverage.filter((check) => !check.passed);
  const coveragePercent =
    report.trim().length === 0
      ? 0
      : Math.round(((coverage.length - missingChecks.length) / coverage.length) * 100);
  const gapPrompt = buildGapResearchPrompt(fields, missingChecks);
  const synthesisTemplate = buildRouteSynthesisTemplate(fields, missingChecks);

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(`${label} copied.`);
    } catch {
      setCopyState("Copy failed. Select the text block and copy it manually.");
    }
  }

  function updateField(id: string, value: string) {
    setFields((current) => ({ ...current, [id]: value }));
  }

  function resetFields() {
    setFields(initialFields);
    setReport("");
    setCopyState("Workspace reset to the AgentSiteOps internal route example.");
  }

  return (
    <div className="manual-workspace" id="manual-research-workspace">
      <div className="manual-workspace-head">
        <div>
          <p className="eyebrow">Local workspace</p>
          <h2>Generate, check, repair, and fuse the route research.</h2>
          <p>
            This workspace does not run Deep Research by itself. It prepares the prompt
            for ChatGPT, checks the pasted report locally, then creates the gap prompt
            and route-file skeleton.
          </p>
        </div>
        <div className="manual-workspace-meter" aria-label={`Coverage ${coveragePercent}%`}>
          <span>{coveragePercent}%</span>
          <strong>{missingChecks.length === 0 && report ? "Ready to synthesize" : "Coverage gate"}</strong>
          <div>
            <i style={{ width: `${coveragePercent}%` }} />
          </div>
        </div>
      </div>

      <div className="manual-workspace-grid">
        <section className="manual-input-panel" aria-labelledby="manual-brief-title">
          <div className="manual-panel-head">
            <SearchCheck aria-hidden="true" size={18} />
            <div>
              <h3 id="manual-brief-title">1. Project facts</h3>
              <p>Edit these fields before copying the Deep Research prompt.</p>
            </div>
          </div>
          <div className="manual-field-grid">
            {manualResearchFields.map((field) => (
              <label key={field.id}>
                <span>{field.label}</span>
                <small>{field.helper}</small>
                <textarea
                  value={fields[field.id] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => updateField(field.id, event.target.value)}
                  rows={field.id === "constraints" || field.id === "proofAssets" ? 4 : 3}
                />
              </label>
            ))}
          </div>
          <button type="button" className="secondary-action" onClick={resetFields}>
            <RefreshCw aria-hidden="true" size={15} />
            Reset internal example
          </button>
        </section>

        <section className="manual-output-panel" aria-labelledby="manual-prompt-title">
          <div className="manual-panel-head">
            <ClipboardCopy aria-hidden="true" size={18} />
            <div>
              <h3 id="manual-prompt-title">2. Copy to ChatGPT Deep Research</h3>
              <p>Use this prompt in ChatGPT web. The site does not call the OpenAI API.</p>
            </div>
          </div>
          <textarea className="manual-generated-text" readOnly value={masterPrompt} rows={18} />
          <button type="button" className="primary-action" onClick={() => copyText("Deep Research prompt", masterPrompt)}>
            <ClipboardCopy aria-hidden="true" size={15} />
            Copy Deep Research prompt
          </button>
        </section>
      </div>

      <div className="manual-workspace-grid is-review-grid">
        <section className="manual-input-panel" aria-labelledby="manual-report-title">
          <div className="manual-panel-head">
            <FileCheck2 aria-hidden="true" size={18} />
            <div>
              <h3 id="manual-report-title">3. Paste completed research report</h3>
              <p>The local checker only tests coverage. Human review still decides quality.</p>
            </div>
          </div>
          <textarea
            className="manual-report-text"
            value={report}
            onChange={(event) => setReport(event.target.value)}
            placeholder="Paste the completed ChatGPT Deep Research report here..."
            rows={16}
          />
        </section>

        <section className="manual-output-panel" aria-labelledby="manual-coverage-title">
          <div className="manual-panel-head">
            {missingChecks.length === 0 && report ? (
              <CheckCircle2 aria-hidden="true" size={18} />
            ) : (
              <AlertTriangle aria-hidden="true" size={18} />
            )}
            <div>
              <h3 id="manual-coverage-title">4. Local acceptance check</h3>
              <p>Missing items become a focused second-pass prompt.</p>
            </div>
          </div>
          <div className="coverage-list">
            {coverage.map((check) => (
              <article className={check.passed ? "is-passed" : ""} key={check.id}>
                {check.passed ? (
                  <CheckCircle2 aria-hidden="true" size={16} />
                ) : (
                  <AlertTriangle aria-hidden="true" size={16} />
                )}
                <div>
                  <h4>{check.label}</h4>
                  <p>{check.whyRequired}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="manual-workspace-grid is-synthesis-grid">
        <section className="manual-output-panel" aria-labelledby="manual-gap-title">
          <div className="manual-panel-head">
            <SearchCheck aria-hidden="true" size={18} />
            <div>
              <h3 id="manual-gap-title">5. Second-pass gap prompt</h3>
              <p>Run this only when the first report misses required modules.</p>
            </div>
          </div>
          <textarea className="manual-generated-text" readOnly value={gapPrompt} rows={12} />
          <button type="button" className="secondary-action" onClick={() => copyText("Gap prompt", gapPrompt)}>
            <ClipboardCopy aria-hidden="true" size={15} />
            Copy gap prompt
          </button>
        </section>

        <section className="manual-output-panel" aria-labelledby="manual-synthesis-title">
          <div className="manual-panel-head">
            <FileCheck2 aria-hidden="true" size={18} />
            <div>
              <h3 id="manual-synthesis-title">6. Route-file synthesis skeleton</h3>
              <p>Use this after the first report and any gap response are accepted.</p>
            </div>
          </div>
          <textarea className="manual-generated-text" readOnly value={synthesisTemplate} rows={12} />
          <button
            type="button"
            className="secondary-action"
            onClick={() => copyText("Route synthesis skeleton", synthesisTemplate)}
          >
            <ClipboardCopy aria-hidden="true" size={15} />
            Copy synthesis skeleton
          </button>
        </section>
      </div>

      <p className="manual-copy-state" aria-live="polite">
        {copyState}
      </p>
    </div>
  );
}
