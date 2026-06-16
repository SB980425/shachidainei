"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  FileCheck2,
  Gauge,
  RefreshCw,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import {
  createIdeaRiskReport,
  emptyIdeaRiskInput,
  exampleIdeaRiskInput,
  type IdeaRiskInput
} from "@/lib/ideaRiskEngine";

const storageKey = "agentsiteops.ideaRiskInput.v1";

const fieldGroups: Array<{
  title: string;
  body: string;
  fields: Array<{
    key: keyof IdeaRiskInput;
    label: string;
    prompt: string;
    placeholder: string;
    rows: number;
  }>;
}> = [
  {
    title: "Project idea",
    body: "Write the rough idea. It can be unclear; the test exists to expose where it may fail.",
    fields: [
      {
        key: "projectName",
        label: "Project name",
        prompt: "Give the idea a working name.",
        placeholder: "Example: AI intake helper for solo consultants",
        rows: 2
      },
      {
        key: "ideaSummary",
        label: "What are you trying to build or sell?",
        prompt: "Describe the idea in plain language.",
        placeholder: "A service, tool, workflow, content product, or route you want to test.",
        rows: 5
      }
    ]
  },
  {
    title: "Buyer and offer",
    body: "The test cannot judge the project without a reachable user and a first offer shape.",
    fields: [
      {
        key: "targetUser",
        label: "Who is this for?",
        prompt: "Name the first reachable buyer, user, reader, or operator.",
        placeholder: "Solo consultants who repeatedly receive unclear client requests.",
        rows: 4
      },
      {
        key: "offer",
        label: "What would they receive first?",
        prompt: "Write the smallest useful offer, asset, or result.",
        placeholder: "A free template, a manual setup, a narrow report, a proof asset, or one workflow.",
        rows: 4
      }
    ]
  },
  {
    title: "Proof and channel",
    body: "Reference advice is only useful when it points to evidence the user can collect.",
    fields: [
      {
        key: "existingAssets",
        label: "What proof or material already exists?",
        prompt: "List demos, screenshots, notes, examples, links, user replies, or source material.",
        placeholder: "Two examples, one screenshot, a rough landing page, a source list, or buyer messages.",
        rows: 5
      },
      {
        key: "acquisitionChannel",
        label: "How will the first people see it?",
        prompt: "Name the first reachable channel.",
        placeholder: "Manual outreach, one public walkthrough post, existing community, search page, partner list.",
        rows: 4
      }
    ]
  },
  {
    title: "Limits and validation",
    body: "The output must say when to continue, repair, pivot, or stop.",
    fields: [
      {
        key: "resources",
        label: "Time, budget, and delivery capacity",
        prompt: "State the realistic resource window.",
        placeholder: "One operator, 7 days, no paid ads, no product build before replies.",
        rows: 4
      },
      {
        key: "constraints",
        label: "Claims, data, and risk limits",
        prompt: "Name what cannot be promised or used.",
        placeholder: "No private data, no guaranteed revenue, no regulated advice, no copied content.",
        rows: 4
      },
      {
        key: "validationPlan",
        label: "What evidence would count?",
        prompt: "Define the first validation loop.",
        placeholder: "Send 30 messages, get qualified replies, record objections, stop after 7 days if no signal.",
        rows: 5
      }
    ]
  }
];

const allFields = fieldGroups.flatMap((group) => group.fields);

function updateInput(input: IdeaRiskInput, key: keyof IdeaRiskInput, value: string): IdeaRiskInput {
  return {
    ...input,
    [key]: value
  };
}

function countFilled(input: IdeaRiskInput) {
  return Object.values(input).filter((value) => value.trim().length >= 8).length;
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to textarea copy below.
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "true");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);
    return didCopy;
  } catch {
    return false;
  }
}

export function IdeaRiskTestStudio() {
  const [input, setInput] = useState<IdeaRiskInput>(emptyIdeaRiskInput);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "blocked">("idle");
  const [saveState, setSaveState] = useState("Browser-local draft");
  const [hydrated, setHydrated] = useState(false);
  const report = useMemo(() => createIdeaRiskReport(input), [input]);
  const filledCount = useMemo(() => countFilled(input), [input]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);

      if (stored) {
        setInput({ ...emptyIdeaRiskInput, ...JSON.parse(stored) });
        setSaveState("Restored local test");
      }
    } catch {
      setSaveState("Local save unavailable");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(input));
      setSaveState("Saved locally");
    } catch {
      setSaveState("Local save unavailable");
    }
  }, [hydrated, input]);

  function loadExample() {
    setInput(exampleIdeaRiskInput);
    window.codexAnalytics?.track("idea_risk_example_loaded", {
      source: "idea_risk_test"
    });
  }

  function clearInput() {
    setInput(emptyIdeaRiskInput);
    setCopyState("idle");
    setSaveState("Local test cleared");

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      setSaveState("Local save unavailable");
    }
  }

  async function copyReport() {
    const didCopy = await copyText(report.brief);
    setCopyState(didCopy ? "copied" : "blocked");
    window.codexAnalytics?.track("idea_risk_report_copy", {
      copied: didCopy,
      readiness_score: report.readinessScore,
      risk_count: report.topRisks.length
    });
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="idea-risk-studio" id="idea-risk-test" aria-label="Idea risk test studio">
      <div className="idea-risk-input-panel">
        <div className="idea-risk-panel-head">
          <span>Free test input</span>
          <h2>Write the idea once. The first output is a risk map.</h2>
          <p>
            This screen runs in the browser. It does not create an account, charge payment,
            or claim that live research has already been completed.
          </p>
          <div className="idea-risk-input-state">
            <strong>
              {filledCount}/{allFields.length} fields ready
            </strong>
            <small>{saveState}</small>
          </div>
        </div>

        <div className="idea-risk-field-stack">
          {fieldGroups.map((group, groupIndex) => (
            <fieldset key={group.title} className="idea-risk-field-group">
              <legend>
                <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                <strong>{group.title}</strong>
                <small>{group.body}</small>
              </legend>
              {group.fields.map((field) => {
                const isFilled = input[field.key].trim().length >= 8;

                return (
                  <label className={isFilled ? "is-filled" : "is-missing"} key={field.key}>
                    <span>{field.label}</span>
                    <strong>{field.prompt}</strong>
                    <textarea
                      value={input[field.key]}
                      rows={field.rows}
                      placeholder={field.placeholder}
                      onChange={(event) => setInput(updateInput(input, field.key, event.target.value))}
                    />
                    <small>{isFilled ? "Ready for risk matching" : "Needs clearer input"}</small>
                  </label>
                );
              })}
            </fieldset>
          ))}
        </div>

        <div className="idea-risk-actions">
          <button type="button" onClick={loadExample}>
            <RefreshCw aria-hidden="true" size={16} />
            Load example
          </button>
          <button type="button" onClick={copyReport}>
            <ClipboardCopy aria-hidden="true" size={16} />
            {copyState === "copied" ? "Copied" : copyState === "blocked" ? "Copy unavailable" : "Copy risk report"}
          </button>
          <button type="button" onClick={clearInput}>
            Clear
          </button>
        </div>
      </div>

      <aside className="idea-risk-output-panel" aria-live="polite">
        <div className="idea-risk-score">
          <span>{report.confidenceLabel}</span>
          <strong>{report.readinessScore}</strong>
          <small>/100 test readiness</small>
        </div>

        <div className="idea-risk-route-card">
          <span>Suggested next route</span>
          <h2>{report.selectedRoute}</h2>
          <p>{report.routeReason}</p>
        </div>

        <section className="idea-risk-node-section">
          <div className="idea-risk-section-head">
            <AlertTriangle aria-hidden="true" size={18} />
            <h3>Likely failure nodes</h3>
          </div>
          <div className="idea-risk-node-list">
            {report.topRisks.map((risk) => (
              <article className={`is-${risk.severity}`} key={risk.id}>
                <div>
                  <span>{risk.severity}</span>
                  <strong>{risk.score}/100</strong>
                </div>
                <h4>{risk.label}</h4>
                <p>{risk.why}</p>
                <dl>
                  <div>
                    <dt>Watch</dt>
                    <dd>{risk.attention}</dd>
                  </div>
                  <div>
                    <dt>Evidence needed</dt>
                    <dd>{risk.requiredEvidence}</dd>
                  </div>
                  <div>
                    <dt>Next action</dt>
                    <dd>{risk.nextAction}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="idea-risk-time-section">
          <div className="idea-risk-section-head">
            <Gauge aria-hidden="true" size={18} />
            <h3>Time checkpoints</h3>
          </div>
          <ol>
            {report.timePlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="idea-risk-source-section">
          <div className="idea-risk-section-head">
            <SearchCheck aria-hidden="true" size={18} />
            <h3>Reference basis</h3>
          </div>
          <p>
            These sources explain why the risk nodes exist. They do not prove this specific
            project will succeed or fail.
          </p>
          <div className="idea-risk-source-grid">
            {report.sourceBasis.map((source) => (
              <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                <span>{source.sourceType}</span>
                <strong>{source.publisher}</strong>
                <small>{source.name}</small>
              </a>
            ))}
          </div>
        </section>

        <section className="idea-risk-stop-rule">
          <ShieldCheck aria-hidden="true" size={18} />
          <div>
            <h3>Stop rule</h3>
            <p>{report.stopRule}</p>
          </div>
        </section>

        <div className="idea-risk-next-actions">
          <Link
            prefetch={false}
            href="/plan/"
            data-analytics-event="idea_risk_continue_plan"
            data-analytics-label="idea_risk_to_plan"
            data-analytics-type="idea_risk"
          >
            <FileCheck2 aria-hidden="true" size={16} />
            Continue to Plan Studio
          </Link>
          <Link prefetch={false} href="/review-status/">
            Review Status
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>

        <p className="idea-risk-boundary">
          <CheckCircle2 aria-hidden="true" size={15} />
          Free test output is a reference map. Final Route File acceptance still needs
          evidence review and scope lock.
        </p>
      </aside>
    </section>
  );
}
