"use client";

import { useMemo, useRef, useState } from "react";

const projectOptions = [
  {
    type: "AI automation service",
    route: "AI workflow setup service",
    weak: "vague AI adoption advice or private account takeover",
    asset: "Workflow screenshot, scope page, intake checklist, and setup boundary",
    evidence: "Qualified reply or paid pilot request plus safe access boundary"
  },
  {
    type: "Content or SEO site",
    route: "SEO or AI visibility guide cluster",
    weak: "public-advice repetition or third-party volume estimates only",
    asset: "Guide hub, source register, quality gate, and small route batch",
    evidence: "GSC or Bing export, source-backed SERP review, or sample user action"
  },
  {
    type: "Micro tool or dashboard",
    route: "Micro SaaS utility",
    weak: "rare task, unclear data rights, or maintenance cost above price",
    asset: "Free checker, sample output, event list, and upgrade boundary",
    evidence: "Tool completion evidence, repeated requests, or confirmed setup budget"
  },
  {
    type: "Template or prompt pack",
    route: "Prompt or template pack",
    weak: "generic AI can create equivalent output from the same inputs",
    asset: "Preview page, before-after examples, refund boundary, and usage limits",
    evidence: "Sample usage, buyer reply, or low-risk payment test"
  },
  {
    type: "Directory or marketplace",
    route: "Programmatic directory or marketplace",
    weak: "copied, stale, or undifferentiated data with no manual supply path",
    asset: "Entity model, noindex rules, trust boundary, and manual seed list",
    evidence: "Data-rights evidence plus buyer or supplier request proof"
  },
  {
    type: "Done-for-you implementation",
    route: "Done-for-you landing page setup",
    weak: "broad strategy, guaranteed traffic, or undefined product",
    asset: "Before-after sample, revision limit, delivery checklist, and handoff plan",
    evidence: "Confirmed implementation need plus capacity and scope boundary"
  }
];

const evidenceOptions = [
  "Founder assumption only",
  "Public market or competitor signal",
  "Public demo, repo, sample, or source-backed comparison",
  "Qualified buyer replies or first-party search or analytics export",
  "Confirmed payment plus usable intake"
];

const proofOptions = [
  "No proof asset",
  "Private examples only",
  "Public sample or workflow screenshot",
  "Delivered artifact, usage evidence, or customer response"
];

const deliveryOptions = [
  "Safe manual delivery is possible",
  "Delivery path is unclear",
  "Delivery requires private account takeover",
  "Builder cannot execute the first route"
];

const blockerOptions = [
  "Regulated legal, medical, financial, tax, or safety advice",
  "Unclear data rights",
  "Guaranteed traffic, ranking, AI citation, customer, or revenue expectation",
  "No reachable buyer segment",
  "Generic AI can produce the same useful output",
  "Private account takeover is required"
];

type ConfidenceBand = "high" | "medium" | "low" | "reject";

const confidenceCopy: Record<
  ConfidenceBand,
  { label: string; action: string; next: string; blocked: string }
> = {
  high: {
    label: "High confidence",
    action: "Proceed with one narrow route, one offer, one page asset, one channel, rejected alternatives, and a 7-day validation plan.",
    next: "Deliver the route file, record outcome, and update the evidence ledger.",
    blocked: "Do not claim guaranteed rankings, AI citations, revenue, market authority, or subscription readiness."
  },
  medium: {
    label: "Medium confidence",
    action: "Pilot a small free or paid test with explicit missing evidence and a narrow outreach batch.",
    next: "Run a bounded exposure test and request external objections before building more pages.",
    blocked: "Do not claim product-market fit, pricing certainty, recurring demand, or traffic scale."
  },
  low: {
    label: "Low confidence",
    action: "Publish a diagnostic page, source pack, checklist, or free tool only if it adds original value.",
    next: "Collect search exports, replies, sample usage, or manual outreach evidence.",
    blocked: "Do not claim demand proof, buyer willingness to pay, or confidence above the proceed threshold."
  },
  reject: {
    label: "Reject or stop",
    action: "Stop, narrow, refund, or pivot to implementation if advice is the wrong product.",
    next: "Name the blocker and record the condition needed to reopen the route.",
    blocked: "Do not sell a paid roadmap, scale recommendation, or subscription path."
  }
};

function evidenceScore(value: string) {
  return evidenceOptions.indexOf(value);
}

function proofScore(value: string) {
  return proofOptions.indexOf(value);
}

function isHardBlocked(blockers: string[], delivery: string) {
  return (
    blockers.length > 0 ||
    delivery === "Delivery requires private account takeover" ||
    delivery === "Builder cannot execute the first route"
  );
}

function getBand(evidence: string, proof: string, delivery: string, blockers: string[]): ConfidenceBand {
  if (isHardBlocked(blockers, delivery)) {
    return "reject";
  }

  const evidenceLevel = evidenceScore(evidence);
  const proofLevel = proofScore(proof);

  if (evidenceLevel >= 4 && proofLevel >= 2 && delivery === "Safe manual delivery is possible") {
    return "high";
  }

  if (evidenceLevel >= 2 && proofLevel >= 2 && delivery !== "Delivery path is unclear") {
    return "medium";
  }

  if (evidenceLevel >= 1 || proofLevel >= 1) {
    return "low";
  }

  return "reject";
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Restricted browser modes fall back to textarea copy.
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

export function RouteConfidenceChecker() {
  const [projectType, setProjectType] = useState(projectOptions[0].type);
  const [evidence, setEvidence] = useState(evidenceOptions[1]);
  const [proof, setProof] = useState(proofOptions[1]);
  const [delivery, setDelivery] = useState(deliveryOptions[0]);
  const [blockers, setBlockers] = useState<string[]>([]);
  const [copyState, setCopyState] = useState("Copy route verdict");
  const startedRef = useRef(false);

  const selectedProject = useMemo(
    () => projectOptions.find((option) => option.type === projectType) ?? projectOptions[0],
    [projectType]
  );
  const band = useMemo(
    () => getBand(evidence, proof, delivery, blockers),
    [blockers, delivery, evidence, proof]
  );
  const result = confidenceCopy[band];
  const score = useMemo(() => {
    if (band === "reject") {
      return 0;
    }

    return Math.min(
      100,
      Math.round(evidenceScore(evidence) * 16 + proofScore(proof) * 12 + (delivery === "Safe manual delivery is possible" ? 20 : 5))
    );
  }, [band, delivery, evidence, proof]);

  function track(name: string, payload: Record<string, string | number | boolean> = {}) {
    window.codexAnalytics?.track(name, {
      tool: "route_confidence_checker",
      score,
      decision: band,
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

  function toggleBlocker(blocker: string) {
    trackStarted("blocker");
    setBlockers((current) =>
      current.includes(blocker)
        ? current.filter((item) => item !== blocker)
        : [...current, blocker]
    );
  }

  function buildResultText() {
    return [
      "AgentSiteOps Route Confidence Check",
      "",
      `Project type: ${projectType}`,
      `Selected route: ${selectedProject.route}`,
      `Confidence: ${result.label}`,
      `Route score: ${score}`,
      "",
      `Evidence level: ${evidence}`,
      `Proof asset: ${proof}`,
      `Delivery boundary: ${delivery}`,
      `Weak route condition: ${selectedProject.weak}`,
      `Recommended first asset: ${selectedProject.asset}`,
      `Evidence needed before payment: ${selectedProject.evidence}`,
      "",
      `Allowed output: ${result.action}`,
      `Blocked claims: ${result.blocked}`,
      `Next action: ${result.next}`,
      "",
      "Blockers:",
      ...(blockers.length ? blockers.map((item) => `- ${item}`) : ["- none selected"]),
      "",
      "Boundary: this checker runs locally in the browser. It does not submit a request, store personal data, collect payment data, or guarantee traffic, ranking, AI citation, customers, revenue, or payback."
    ].join("\n");
  }

  async function copyResult() {
    try {
      const copied = await copyText(buildResultText());

      if (!copied) {
        throw new Error("Clipboard unavailable");
      }

      setCopyState("Copied");
      track("tool_completed", { export_method: "copy" });
      track("tool_result_export", { export_method: "copy" });
      window.dispatchEvent(new CustomEvent("tool_completed", { detail: { score, decision: band } }));
    } catch {
      setCopyState("Copy failed");
    }

    window.setTimeout(() => setCopyState("Copy route verdict"), 1600);
  }

  return (
    <section className="scope-builder" aria-label="Route confidence checker">
      <div className="scope-form">
        <label className="field-block">
          <span>Project type</span>
          <select
            value={projectType}
            onChange={(event) => {
              trackStarted("project_type");
              setProjectType(event.target.value);
            }}
          >
            {projectOptions.map((option) => (
              <option key={option.type}>{option.type}</option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span>Demand evidence</span>
          <select
            value={evidence}
            onChange={(event) => {
              trackStarted("evidence");
              setEvidence(event.target.value);
            }}
          >
            {evidenceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span>Proof asset</span>
          <select
            value={proof}
            onChange={(event) => {
              trackStarted("proof");
              setProof(event.target.value);
            }}
          >
            {proofOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span>Delivery boundary</span>
          <select
            value={delivery}
            onChange={(event) => {
              trackStarted("delivery");
              setDelivery(event.target.value);
            }}
          >
            {deliveryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <div className="scope-check-grid" aria-label="Hard blockers">
          {blockerOptions.map((blocker) => (
            <label className="checkbox-row" key={blocker}>
              <input
                checked={blockers.includes(blocker)}
                type="checkbox"
                onChange={() => toggleBlocker(blocker)}
              />
              <span>{blocker}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="scope-panel">
        <div className={`scope-score fit-score-${band === "high" ? "fit" : band === "medium" ? "possible" : "blocked"}`}>
          <span>{score}</span>
          <div>
            <strong>{result.label}</strong>
            <p>{result.action}</p>
          </div>
        </div>

        <section>
          <h2>Selected route</h2>
          <ul className="compact-list">
            <li>{selectedProject.route}</li>
            <li>{selectedProject.asset}</li>
            <li>{selectedProject.evidence}</li>
          </ul>
        </section>

        <section>
          <h2>Blocked claims</h2>
          <p>{result.blocked}</p>
        </section>

        <section>
          <h2>Next action</h2>
          <p>{result.next}</p>
        </section>

        <button className="primary-action" type="button" onClick={copyResult}>
          {copyState}
        </button>
      </div>
    </section>
  );
}
