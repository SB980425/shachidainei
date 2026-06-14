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

const manualBoundaryRows = [
  {
    title: "Brief only",
    body:
      "AgentSiteOps prepares the research brief and required output contract.",
    Icon: ClipboardCopy
  },
  {
    title: "Replaceable carrier",
    body:
      "The research run happens outside the site through an approved channel, manual source review, or client-provided report path.",
    Icon: SearchCheck
  },
  {
    title: "Local gate",
    body:
      "The pasted report is checked in this browser session for required coverage.",
    Icon: FileCheck2
  },
  {
    title: "Fuse or repair",
    body:
      "Missing coverage creates a focused gap prompt before final route synthesis.",
    Icon: CheckCircle2
  }
];

function hasKeyword(report: string, keywords: string[]) {
  const normalized = report.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function ManualDeepResearchWorkspace() {
  const [fields, setFields] = useState<Record<string, string>>(initialFields);
  const [report, setReport] = useState("");
  const [copyState, setCopyState] = useState(
    "Nothing copied yet. Report text stays in this browser session until reload."
  );

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
            This workspace does not run research by itself. It prepares the brief for an
            approved research channel, checks the pasted report locally, then creates the
            gap brief and route-file skeleton. It does not create a hidden model/API run
            or upload the pasted report from this component.
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

      <div className="manual-mode-strip" aria-label="Manual research boundaries">
        {manualBoundaryRows.map((item) => {
          const Icon = item.Icon;

          return (
            <article key={item.title}>
              <Icon aria-hidden="true" size={17} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="manual-workspace-grid">
        <section className="manual-input-panel" aria-labelledby="manual-brief-title">
          <div className="manual-panel-head">
            <SearchCheck aria-hidden="true" size={18} />
            <div>
              <h3 id="manual-brief-title">1. Project facts</h3>
              <p>Edit these fields before copying the research brief.</p>
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
              <h3 id="manual-prompt-title">2. Copy to an approved research channel</h3>
              <p>Use this brief in the selected research channel. The site does not create a hidden research run.</p>
            </div>
          </div>
          <textarea className="manual-generated-text" readOnly value={masterPrompt} rows={18} />
          <button type="button" className="primary-action" onClick={() => copyText("Research brief", masterPrompt)}>
            <ClipboardCopy aria-hidden="true" size={15} />
            Copy research brief
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
            placeholder="Paste the completed research report here..."
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
