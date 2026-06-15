"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  ClipboardList,
  Download,
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

const planDraftStorageKey = "agentsiteops.planDraftInput.v1";
const planBriefStorageKey = "agentsiteops.planDraftBrief.v1";

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

const planFields = planQuestionGroups.flatMap((group) => group.fields);

function fieldIsComplete(input: PlanDraftInput, field: PlanField) {
  if (field.kind === "select") {
    return input[field.key].trim().length > 0;
  }

  return input[field.key].trim().length >= 4;
}

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
  const router = useRouter();
  const [input, setInput] = useState<PlanDraftInput>(emptyInput);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState("Local autosave ready");
  const draft = useMemo(() => createPlanDraft(input), [input]);
  const completedFieldCount = useMemo(
    () => planFields.filter((field) => fieldIsComplete(input, field)).length,
    [input]
  );
  const missingCoreFields = useMemo(
    () => planFields.filter((field) => field.kind !== "select" && !fieldIsComplete(input, field)),
    [input]
  );
  const nextMissingField = missingCoreFields[0];

  useEffect(() => {
    try {
      const storedInput = window.localStorage.getItem(planDraftStorageKey);

      if (storedInput) {
        const parsedInput = JSON.parse(storedInput) as Partial<PlanDraftInput>;
        setInput({ ...emptyInput, ...parsedInput });
        setSaveState("Restored local draft");
      }
    } catch {
      setSaveState("Local autosave unavailable");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(planDraftStorageKey, JSON.stringify(input));
      window.localStorage.setItem(planBriefStorageKey, draft.brief);
      setSaveState("Saved locally");
    } catch {
      setSaveState("Local autosave unavailable");
    }
  }, [draft.brief, hydrated, input]);

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
      return true;
    }

    setCopied(false);
    return false;
  }

  function loadExample() {
    setInput(exampleInput);
    setExported(false);
    setSaveState("Example loaded");
  }

  function clearDraft() {
    setInput(emptyInput);
    setCopied(false);
    setExported(false);
    setSaveState("Local draft cleared");

    try {
      window.localStorage.removeItem(planDraftStorageKey);
      window.localStorage.removeItem(planBriefStorageKey);
    } catch {
      setSaveState("Local autosave unavailable");
    }
  }

  function downloadBrief() {
    const safeName =
      input.projectName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) || "agentsiteops-plan";
    const content = [
      "# AgentSiteOps route draft",
      "",
      draft.brief,
      "",
      "## Draft status",
      "",
      `- Readiness score: ${draft.readinessScore}/100`,
      `- Confidence: ${draft.confidenceLabel}`,
      `- Next action: ${draft.nextAction}`,
      "",
      "## Boundary",
      "",
      "- This exported file is a browser-local draft.",
      "- It is not the final Route File.",
      "- Manual/operator review is still required before research acceptance or delivery."
    ].join("\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${safeName}-route-draft.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 1800);
    window.codexAnalytics?.track("plan_brief_download", {
      missing_count: missingCoreFields.length,
      readiness_score: draft.readinessScore
    });
  }

  function focusNextMissingField() {
    if (!nextMissingField) {
      return;
    }

    const control = document.querySelector<HTMLElement>(`[data-plan-control="${nextMissingField.key}"]`);
    control?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => control?.focus(), 260);
    window.codexAnalytics?.track("plan_missing_field_focus", {
      field: nextMissingField.key,
      missing_count: missingCoreFields.length
    });
  }

  async function copyAndContinue() {
    const copiedBrief = await copyBrief();
    window.codexAnalytics?.track("plan_copy_continue", {
      copied: copiedBrief,
      missing_count: missingCoreFields.length,
      readiness_score: draft.readinessScore
    });
    router.push("/intake/?from=plan");
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

          <div className="plan-input-state" aria-label="Plan Studio completion state">
            <div>
              <span>Input coverage</span>
              <strong>
                {completedFieldCount}/{planFields.length} fields ready
              </strong>
              <p>
                {saveState}. The intake page can detect the saved draft on this device.
              </p>
            </div>
            <button
              type="button"
              onClick={focusNextMissingField}
              disabled={!nextMissingField}
              data-analytics-event="plan_missing_field_focus"
              data-analytics-label={nextMissingField?.key ?? "all_fields_ready"}
              data-analytics-type="plan_studio"
            >
              {nextMissingField ? `Find next missing: ${nextMissingField.label}` : "All core fields filled"}
            </button>
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
                  {group.fields.map((field) => {
                    const isComplete = fieldIsComplete(input, field);

                    return (
                    <label
                      className={isComplete ? "plan-field-card is-filled" : "plan-field-card is-missing"}
                      data-plan-field={field.key}
                      key={field.key}
                    >
                      <span className="plan-field-label">{field.label}</span>
                      <strong>{field.prompt}</strong>
                      {field.kind === "select" ? (
                        <select
                          data-plan-control={field.key}
                          value={input[field.key]}
                          onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                        >
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.kind === "input" ? (
                        <input
                          data-plan-control={field.key}
                          value={input[field.key]}
                          placeholder={field.placeholder}
                          onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                        />
                      ) : (
                        <textarea
                          data-plan-control={field.key}
                          value={input[field.key]}
                          placeholder={field.placeholder}
                          rows={field.rows ?? 5}
                          onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                        />
                      )}
                      <small>{field.helper}</small>
                      <em className="plan-field-status">{isComplete ? "Ready" : "Needs input"}</em>
                    </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="plan-input-actions">
            <button
              type="button"
              onClick={loadExample}
              data-analytics-event="plan_example_loaded"
              data-analytics-label="plan_studio_example"
              data-analytics-type="plan_studio"
            >
              <RefreshCw aria-hidden="true" size={16} />
              Load example
            </button>
            <button type="button" onClick={clearDraft}>
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

          <section className="plan-handoff-card" aria-label="Plan Studio handoff state">
            <div>
              <ClipboardList aria-hidden="true" size={18} />
              <h3>Handoff state</h3>
            </div>
            <p>
              Copy or download the draft, then continue to intake when the project has enough
              buyer, asset, blocker, and constraint detail for manual acceptance.
            </p>
            <ul>
              <li>Automatic: browser-local draft, autosave, copied packet, email handoff.</li>
              <li>Manual: scope acceptance, research carrier choice, repair request, Route File judgment.</li>
            </ul>
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
            <button
              type="button"
              onClick={downloadBrief}
              data-analytics-event="plan_brief_download"
              data-analytics-label="download_route_draft"
              data-analytics-type="plan_studio"
            >
              <Download aria-hidden="true" size={16} />
              {exported ? "Downloaded" : "Download route draft"}
            </button>
            <button
              type="button"
              onClick={copyAndContinue}
              data-analytics-event="plan_copy_continue"
              data-analytics-label="copy_and_continue_intake"
              data-analytics-type="plan_studio"
            >
              <ClipboardList aria-hidden="true" size={16} />
              Copy + intake
            </button>
            <Link prefetch={false} href="/sample/">
              <FileText aria-hidden="true" size={16} />
              View sample
            </Link>
          </div>

          <p className="plan-next-action">
            <CheckCircle2 aria-hidden="true" size={16} />
            {draft.nextAction} Saved drafts can be detected by the intake packet builder on this device.
          </p>
        </aside>
      </div>
    </section>
  );
}
