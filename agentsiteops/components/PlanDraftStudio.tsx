"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  ClipboardList,
  FileCheck2,
  FileText,
  RefreshCw,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import {
  createPlanDraft,
  executionModeOptions,
  projectTypeOptions,
  researchCarrierOptions,
  timeWindowOptions,
  type PlanDraftInput
} from "@/lib/planDraft";

const emptyInput: PlanDraftInput = {
  projectName: "",
  projectType: "AI service or automation",
  targetUser: "",
  currentGoal: "",
  existingAssets: "",
  blocker: "",
  timeWindow: "7 days",
  executionMode: "I will execute myself",
  researchCarrier: "Carrier-neutral",
  constraints: ""
};

const exampleInput: PlanDraftInput = {
  projectName: "AI client support workflow",
  projectType: "AI service or automation",
  targetUser: "Small service teams that repeat manual support triage every week",
  currentGoal: "Choose the first service route before building a dashboard or checkout page",
  existingAssets: "One before-after workflow note, two support examples, a rough landing page, and manual delivery capacity",
  blocker: "Too many possible offers: automation setup, dashboard, training pack, or done-for-you implementation",
  timeWindow: "7 days",
  executionMode: "I need operator review",
  researchCarrier: "Operator-selected carrier",
  constraints: "No guaranteed revenue, no private customer data in public output, no claim that the website runs hidden research"
};

const textareaFields: Array<{
  key: keyof PlanDraftInput;
  label: string;
  helper: string;
  placeholder: string;
}> = [
  {
    key: "projectName",
    label: "Project name",
    helper: "A working name is enough.",
    placeholder: "Example: AI client support workflow"
  },
  {
    key: "targetUser",
    label: "Target user",
    helper: "Name the buyer or user who would care first.",
    placeholder: "Who has the repeated problem?"
  },
  {
    key: "currentGoal",
    label: "Current goal",
    helper: "State what you want the next route to decide.",
    placeholder: "Choose one first route before building more."
  },
  {
    key: "existingAssets",
    label: "Existing assets",
    helper: "Notes, links, screenshots, demos, examples, source material.",
    placeholder: "What already exists and can be inspected?"
  },
  {
    key: "blocker",
    label: "Current blocker",
    helper: "The decision that prevents the next build or launch step.",
    placeholder: "What are you unable to choose?"
  },
  {
    key: "constraints",
    label: "Constraints",
    helper: "Claims, delivery limits, data rights, risk, payment, timeline.",
    placeholder: "What must the route not claim or depend on?"
  }
];

function setInputValue(
  current: PlanDraftInput,
  key: keyof PlanDraftInput,
  value: string
): PlanDraftInput {
  return {
    ...current,
    [key]: value
  };
}

export function PlanDraftStudio() {
  const [input, setInput] = useState<PlanDraftInput>(emptyInput);
  const [copied, setCopied] = useState(false);
  const draft = useMemo(() => createPlanDraft(input), [input]);

  async function copyBrief() {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(draft.brief);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      const textarea = document.createElement("textarea");
      textarea.value = draft.brief;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      didCopy = document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      return;
    }

    setCopied(false);
  }

  return (
    <section className="plan-draft-studio" aria-label="Plan draft studio">
      <div className="plan-studio-grid">
        <form className="plan-input-panel">
          <div className="plan-panel-head">
            <span>Input</span>
            <h2>Write the project once.</h2>
            <p>
              The draft updates in the browser. No API call, account, payment, or hidden
              research run is created from this screen.
            </p>
          </div>

          <div className="plan-select-row">
            <label>
              <span>Project type</span>
              <select
                value={input.projectType}
                onChange={(event) => setInput(setInputValue(input, "projectType", event.target.value))}
              >
                {projectTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Execution mode</span>
              <select
                value={input.executionMode}
                onChange={(event) => setInput(setInputValue(input, "executionMode", event.target.value))}
              >
                {executionModeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="plan-select-row">
            <label>
              <span>Research carrier</span>
              <select
                value={input.researchCarrier}
                onChange={(event) => setInput(setInputValue(input, "researchCarrier", event.target.value))}
              >
                {researchCarrierOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Review window</span>
              <select
                value={input.timeWindow}
                onChange={(event) => setInput(setInputValue(input, "timeWindow", event.target.value))}
              >
                {timeWindowOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="plan-text-grid">
            {textareaFields.map((field) => (
              <label key={field.key}>
                <span>{field.label}</span>
                <textarea
                  value={input[field.key]}
                  placeholder={field.placeholder}
                  rows={field.key === "projectName" ? 2 : 4}
                  onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                />
                <small>{field.helper}</small>
              </label>
            ))}
          </div>

          <div className="plan-input-actions">
            <button
              type="button"
              onClick={() => setInput(exampleInput)}
              data-analytics-event="plan_example_loaded"
              data-analytics-label="plan_studio_example"
              data-analytics-type="plan_studio"
            >
              <RefreshCw aria-hidden="true" size={16} />
              Load example
            </button>
            <button type="button" onClick={() => setInput(emptyInput)}>
              Clear
            </button>
          </div>
        </form>

        <aside className="plan-output-panel" aria-live="polite">
          <div className="plan-score-card">
            <span>{draft.confidenceLabel}</span>
            <strong data-testid="plan-readiness-score">{draft.readinessScore}</strong>
            <small>/100 input readiness</small>
          </div>

          <div className="plan-route-card">
            <span>Selected draft route</span>
            <h2 data-testid="plan-selected-route">{draft.selectedRoute}</h2>
            <p>{draft.routeReason}</p>
          </div>

          <div className="plan-output-tabs">
            <section>
              <div>
                <AlertTriangle aria-hidden="true" size={18} />
                <h3>Evidence gaps</h3>
              </div>
              <ul>
                {draft.evidenceGaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <div>
                <ShieldCheck aria-hidden="true" size={18} />
                <h3>Rejected alternatives</h3>
              </div>
              <ul>
                {draft.rejectedAlternatives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="plan-seven-day">
            <div>
              <SearchCheck aria-hidden="true" size={18} />
              <h3>7-day draft path</h3>
            </div>
            <ol>
              {draft.sevenDayPlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="plan-stop-rule">
            <FileCheck2 aria-hidden="true" size={18} />
            <div>
              <h3>Stop rule</h3>
              <p>{draft.stopRule}</p>
            </div>
          </section>

          <div className="plan-output-actions">
            <button
              type="button"
              onClick={copyBrief}
              data-analytics-event="plan_brief_copy"
              data-analytics-label="copy_plan_brief"
              data-analytics-type="plan_studio"
            >
              <ClipboardCopy aria-hidden="true" size={16} />
              {copied ? "Copied" : "Copy plan brief"}
            </button>
            <Link prefetch={false} href="/intake/">
              <ClipboardList aria-hidden="true" size={16} />
              Continue to intake
            </Link>
            <Link prefetch={false} href="/sample/">
              <FileText aria-hidden="true" size={16} />
              View sample
            </Link>
          </div>

          <p className="plan-next-action">
            <CheckCircle2 aria-hidden="true" size={16} />
            {draft.nextAction}
          </p>
        </aside>
      </div>
    </section>
  );
}
