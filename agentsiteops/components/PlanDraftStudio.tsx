"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
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

type PlanField = {
  key: keyof PlanDraftInput;
  label: string;
  prompt: string;
  helper: string;
} & (
  | {
      kind: "input" | "textarea";
      placeholder: string;
      rows?: number;
    }
  | {
      kind: "select";
      options: string[];
    }
);

const planQuestionGroups: Array<{
  number: string;
  title: string;
  description: string;
  fields: PlanField[];
}> = [
  {
    number: "01",
    title: "Route frame",
    description: "Name the project and define the decision this draft must resolve.",
    fields: [
      {
        key: "projectName",
        kind: "input",
        label: "Project name",
        prompt: "Give the work a short name so the route file can refer to it consistently.",
        helper: "A working name is enough. Do not spend time branding the idea yet.",
        placeholder: "Example: AI client support workflow"
      },
      {
        key: "projectType",
        kind: "select",
        label: "Project type",
        prompt: "Choose the closest category so the draft can pick the right route pattern.",
        helper: "If the project is still unclear, choose Unsure and use the blocker field to explain why.",
        options: projectTypeOptions
      },
      {
        key: "currentGoal",
        kind: "textarea",
        label: "Current goal",
        prompt: "State the one decision the plan must make before more pages, tools, or offers are built.",
        helper: "Good input names the next decision, not a broad ambition.",
        placeholder: "Choose one first route before building a dashboard, checkout page, or content system.",
        rows: 4
      }
    ]
  },
  {
    number: "02",
    title: "Audience and proof",
    description: "Separate who this is for from what evidence already exists.",
    fields: [
      {
        key: "targetUser",
        kind: "textarea",
        label: "Target user",
        prompt: "Describe the first reachable buyer, operator, reader, or user with a repeated problem.",
        helper: "Avoid everyone, creators, companies, or vague markets. Name a concrete user group.",
        placeholder: "Small service teams that repeat manual support triage every week.",
        rows: 4
      },
      {
        key: "existingAssets",
        kind: "textarea",
        label: "Existing assets",
        prompt: "List what can be inspected now: notes, links, screenshots, demos, examples, or source material.",
        helper: "Only include material you can actually provide or verify.",
        placeholder: "One workflow note, two examples, a rough page, screenshots, source links, manual delivery capacity.",
        rows: 5
      }
    ]
  },
  {
    number: "03",
    title: "Decision boundary",
    description: "Make the blocked decision and the forbidden claims visible.",
    fields: [
      {
        key: "blocker",
        kind: "textarea",
        label: "Current blocker",
        prompt: "Name the choice you cannot make yet and the alternatives that keep pulling attention.",
        helper: "This is the reason the route draft exists.",
        placeholder: "I cannot choose between automation setup, dashboard, training pack, and done-for-you implementation.",
        rows: 4
      },
      {
        key: "constraints",
        kind: "textarea",
        label: "Constraints",
        prompt: "Write the claims, data, delivery, payment, risk, and timeline limits that the route must respect.",
        helper: "This prevents the plan from implying hidden automation, guaranteed outcomes, or unavailable proof.",
        placeholder: "No guaranteed revenue, no private customer data in public output, no hidden research claim.",
        rows: 5
      }
    ]
  },
  {
    number: "04",
    title: "Operating choices",
    description: "Choose how this draft should move from browser-local plan to review or intake.",
    fields: [
      {
        key: "executionMode",
        kind: "select",
        label: "Execution mode",
        prompt: "Decide whether you want to execute alone or send this for operator review.",
        helper: "This affects whether the next step is self-run, manual review, implementation help, or research only.",
        options: executionModeOptions
      },
      {
        key: "researchCarrier",
        kind: "select",
        label: "Research carrier",
        prompt: "Choose the research source style without locking the product to one AI platform.",
        helper: "Carrier-neutral keeps the plan portable across manual review, client reports, or AI research tools.",
        options: researchCarrierOptions
      },
      {
        key: "timeWindow",
        kind: "select",
        label: "Review window",
        prompt: "Set the time box for deciding whether to continue, repair, pivot, or stop.",
        helper: "Shorter windows are better for route selection than open-ended exploration.",
        options: timeWindowOptions
      }
    ]
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
        <form className="plan-input-panel" onSubmit={(event) => event.preventDefault()}>
          <div className="plan-panel-head">
            <span>Input</span>
            <h2>Write the project once.</h2>
            <p>
              The draft updates in the browser. No API call, account, payment, or hidden
              research run is created from this screen.
            </p>
          </div>

          <div className="plan-input-summary" aria-label="Plan Studio input rules">
            <span>No API call</span>
            <span>One field per decision</span>
            <span>Draft before intake</span>
          </div>

          <div className="plan-question-stack">
            {planQuestionGroups.map((group) => (
              <fieldset className="plan-question-group" key={group.number}>
                <legend>
                  <span>{group.number}</span>
                  <strong>{group.title}</strong>
                  <small>{group.description}</small>
                </legend>

                <div className="plan-field-stack">
                  {group.fields.map((field) => (
                    <label className="plan-field-card" key={field.key}>
                      <span className="plan-field-label">{field.label}</span>
                      <strong>{field.prompt}</strong>
                      {field.kind === "select" ? (
                        <select
                          value={input[field.key]}
                          onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                        >
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.kind === "input" ? (
                        <input
                          value={input[field.key]}
                          placeholder={field.placeholder}
                          onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                        />
                      ) : (
                        <textarea
                          value={input[field.key]}
                          placeholder={field.placeholder}
                          rows={field.rows ?? 5}
                          onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                        />
                      )}
                      <small>{field.helper}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
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
