"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileCheck2,
  FileText,
  Languages,
  Map,
  RotateCcw,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import {
  projectRouteFitMatrix,
  routeConfidenceBands,
  routeSourceMap
} from "@/lib/routeEvidence";
import { socialVariants } from "@/lib/socialCopy";

type RouteCandidate = (typeof projectRouteFitMatrix)[number] & {
  score: number;
  decision: string;
  why: string[];
};

const evidenceLevels = [
  {
    label: "Founder assumption only",
    score: 0,
    detail: "Idea exists, but demand is not externally visible."
  },
  {
    label: "Public market signal",
    score: 1,
    detail: "Competitors, questions, search hints, or public trend evidence exists."
  },
  {
    label: "Public sample or source review",
    score: 2,
    detail: "There is a demo, repo, source-backed comparison, or artifact users can inspect."
  },
  {
    label: "First-party search or buyer reply",
    score: 3,
    detail: "Search exports, analytics, qualified replies, or tool usage support the route."
  },
  {
    label: "Payment or confirmed intake",
    score: 4,
    detail: "A buyer paid, requested the output, or supplied usable project facts."
  }
];

const proofLevels = [
  { label: "No proof asset", score: 0 },
  { label: "Private notes only", score: 1 },
  { label: "Public sample or screenshot", score: 2 },
  { label: "Delivered artifact or usage evidence", score: 3 }
];

const deliveryLevels = [
  { label: "Safe manual delivery is possible", score: 3 },
  { label: "Delivery path needs a small prototype", score: 2 },
  { label: "Delivery path is unclear", score: 1 },
  { label: "Private account takeover is required", score: 0 }
];

const dataRightsLevels = [
  { label: "Owned or permitted data", score: 3 },
  { label: "Public sources with source register", score: 2 },
  { label: "Third-party estimates only", score: 1 },
  { label: "Unclear or copied data", score: 0 }
];

const projectGoals = [
  "Build an internal route engine",
  "Validate a sellable service offer",
  "Create a search-led content asset",
  "Launch a free tool with paid upgrade",
  "Decide whether to stop or pivot"
];

const routeConstraints = [
  {
    id: "generic-ai",
    label: "Generic AI can produce similar output",
    penalty: 18
  },
  {
    id: "unclear-buyer",
    label: "No reachable buyer segment",
    penalty: 16
  },
  {
    id: "data-rights",
    label: "Data rights are unclear",
    penalty: 20
  },
  {
    id: "ymyl",
    label: "Regulated or YMYL risk",
    penalty: 24
  },
  {
    id: "guarantee",
    label: "Requires traffic, ranking, or revenue guarantee",
    penalty: 22
  }
];

const executionStages = [
  {
    id: "foundation",
    title: "Intake",
    zh: "项目接入",
    window: "Day 1",
    metric: "Scope locked",
    tasks: ["Name project type", "Select buyer or internal user", "Record hard risks"],
    output: "One-page route brief with rejected assumptions."
  },
  {
    id: "evidence",
    title: "Scope",
    zh: "边界锁定",
    window: "Day 1-2",
    metric: "Sources mapped",
    tasks: ["Attach accepted sources", "Mark missing facts", "Block unsupported claims"],
    output: "Evidence ledger and route confidence band."
  },
  {
    id: "selection",
    title: "Research",
    zh: "手动研究",
    window: "Day 2",
    metric: "Weak paths pruned",
    tasks: ["Run prompt pack", "Read source coverage", "Preserve rejected paths"],
    output: "Selected route plus why alternatives were not selected."
  },
  {
    id: "prototype",
    title: "Gate",
    zh: "覆盖验收",
    window: "Day 3-5",
    metric: "Artifact visible",
    tasks: ["Check buyer logic", "Check proof asset", "Trigger repair prompts"],
    output: "Public proof asset that the route can be inspected."
  },
  {
    id: "launch",
    title: "Route File",
    zh: "路线文件",
    window: "Day 5-7",
    metric: "Output shipped",
    tasks: ["Fuse accepted research", "Name first asset", "Set validation channel"],
    output: "First route file and buyer-response boundary."
  },
  {
    id: "growth",
    title: "Social",
    zh: "社交转换",
    window: "After signal",
    metric: "Only if proven",
    tasks: ["Translate public copy", "Keep claim boundary", "Log replies"],
    output: "Growth only after the stop rule is cleared."
  }
];

const defaultProjectType = "Micro tool or dashboard";

const routeFileSections = [
  "Selected route",
  "Rejected alternatives",
  "Evidence ledger",
  "First proof asset",
  "Validation channel",
  "Stop rule"
];

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getBand(score: number, hasHardBlocker: boolean) {
  if (hasHardBlocker || score < 35) {
    return "Reject";
  }

  if (score >= 78) {
    return "High";
  }

  if (score >= 58) {
    return "Medium";
  }

  return "Low";
}

function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return Promise.resolve(document.execCommand("copy"));
  } finally {
    document.body.removeChild(textarea);
  }
}

function buildRouteExport({
  projectName,
  projectType,
  goal,
  selectedRoute,
  score,
  band,
  evidence,
  proof,
  delivery,
  dataRights,
  constraints,
  activeStage
}: {
  projectName: string;
  projectType: string;
  goal: string;
  selectedRoute: RouteCandidate;
  score: number;
  band: string;
  evidence: string;
  proof: string;
  delivery: string;
  dataRights: string;
  constraints: string[];
  activeStage: (typeof executionStages)[number];
}) {
  return [
    "AgentSiteOps Route File",
    "",
    `Project: ${projectName}`,
    `Project type: ${projectType}`,
    `Goal: ${goal}`,
    `Selected route: ${selectedRoute.projectType}`,
    `Confidence: ${band}`,
    `Score: ${score}/100`,
    "",
    "Evidence state:",
    `- Demand evidence: ${evidence}`,
    `- Proof asset: ${proof}`,
    `- Delivery boundary: ${delivery}`,
    `- Data rights: ${dataRights}`,
    "",
    "Why this route:",
    ...selectedRoute.why.map((item) => `- ${item}`),
    "",
    "First asset:",
    `- ${selectedRoute.firstAsset}`,
    "",
    "Evidence needed before payment or scale:",
    `- ${selectedRoute.evidenceBeforePayment}`,
    "",
    "Active execution stage:",
    `- ${activeStage.title}: ${activeStage.output}`,
    "",
    "Hard constraints:",
    ...(constraints.length ? constraints.map((item) => `- ${item}`) : ["- none selected"]),
    "",
    "Stop rule:",
    `- ${selectedRoute.weakRouteWhen}`
  ].join("\n");
}

export function RouteCommandCenter() {
  const [projectName, setProjectName] = useState("AgentSiteOps internal roadmap engine");
  const [projectType, setProjectType] = useState(defaultProjectType);
  const [goal, setGoal] = useState(projectGoals[0]);
  const [evidence, setEvidence] = useState(evidenceLevels[2].label);
  const [proof, setProof] = useState(proofLevels[2].label);
  const [delivery, setDelivery] = useState(deliveryLevels[0].label);
  const [dataRights, setDataRights] = useState(dataRightsLevels[1].label);
  const [constraints, setConstraints] = useState<string[]>(["Generic AI can produce similar output"]);
  const [activeRouteType, setActiveRouteType] = useState(defaultProjectType);
  const [activeStageId, setActiveStageId] = useState("selection");
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [copyState, setCopyState] = useState("Export Route File");
  const [socialCopyState, setSocialCopyState] = useState("Copy public copy");
  const [pairCopyState, setPairCopyState] = useState("Copy bilingual pair");

  const evidenceLevel = evidenceLevels.find((item) => item.label === evidence) ?? evidenceLevels[0];
  const proofLevel = proofLevels.find((item) => item.label === proof) ?? proofLevels[0];
  const deliveryLevel = deliveryLevels.find((item) => item.label === delivery) ?? deliveryLevels[0];
  const dataRightsLevel = dataRightsLevels.find((item) => item.label === dataRights) ?? dataRightsLevels[0];

  const routeCandidates = useMemo<RouteCandidate[]>(() => {
    return projectRouteFitMatrix
      .map((route) => {
        const selectedTypeBonus = route.projectType === projectType ? 26 : 0;
        const internalBonus =
          goal === "Build an internal route engine" && route.projectType === "Micro tool or dashboard"
            ? 14
            : 0;
        const searchBonus =
          goal === "Create a search-led content asset" && route.projectType === "Content or SEO site"
            ? 12
            : 0;
        const serviceBonus =
          goal === "Validate a sellable service offer" &&
          (route.projectType === "AI automation service" ||
            route.projectType === "Done-for-you implementation")
            ? 12
            : 0;
        const toolBonus =
          goal === "Launch a free tool with paid upgrade" &&
          route.projectType === "Micro tool or dashboard"
            ? 12
            : 0;
        const constraintPenalty = routeConstraints
          .filter((item) => constraints.includes(item.label))
          .reduce((total, item) => total + item.penalty, 0);
        const dataPenalty =
          dataRightsLevel.score === 0 && route.projectType === "Directory or marketplace" ? 22 : 0;
        const genericPenalty =
          constraints.includes("Generic AI can produce similar output") &&
          (route.projectType === "Template or prompt pack" ||
            route.projectType === "Content or SEO site")
            ? 10
            : 0;
        const privateAccountPenalty =
          delivery === "Private account takeover is required" ? 30 : 0;

        const score = clampScore(
          28 +
            evidenceLevel.score * 10 +
            proofLevel.score * 9 +
            deliveryLevel.score * 7 +
            dataRightsLevel.score * 5 +
            selectedTypeBonus +
            internalBonus +
            searchBonus +
            serviceBonus +
            toolBonus -
            constraintPenalty -
            dataPenalty -
            genericPenalty -
            privateAccountPenalty
        );

        return {
          ...route,
          score,
          decision:
            score >= 78
              ? "Ready to activate"
              : score >= 58
                ? "Pilot first"
                : score >= 35
                  ? "Evidence gap"
                  : "Do not build yet",
          why: [
            route.strongestRouteWhen,
            `First asset: ${route.firstAsset}`,
            `Evidence needed: ${route.evidenceBeforePayment}`
          ]
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [
    constraints,
    dataRightsLevel.score,
    delivery,
    deliveryLevel.score,
    evidenceLevel.score,
    goal,
    projectType,
    proofLevel.score
  ]);

  const selectedRoute =
    routeCandidates.find((route) => route.projectType === activeRouteType) ?? routeCandidates[0];
  const topRoute = routeCandidates[0];
  const hasHardBlocker =
    constraints.some((item) =>
      [
        "No reachable buyer segment",
        "Data rights are unclear",
        "Regulated or YMYL risk",
        "Requires traffic, ranking, or revenue guarantee"
      ].includes(item)
    ) || delivery === "Private account takeover is required";
  const activeScore = selectedRoute.score;
  const band = getBand(activeScore, hasHardBlocker);
  const bandDetail =
    routeConfidenceBands.find((item) => item.band === band) ?? routeConfidenceBands[3];
  const activeStage =
    executionStages.find((stage) => stage.id === activeStageId) ?? executionStages[2];
  const visibleCandidates = routeCandidates.slice(0, 5);
  const activeSocialCopy = socialVariants.founder[language];
  const bilingualSocialCopy = [
    "English:",
    socialVariants.founder.en,
    "",
    "中文:",
    socialVariants.founder.zh,
    "",
    "Boundary:",
    "Language and tone can change. The Route File sections, manual research boundary, and no-growth-promise rule must stay unchanged."
  ].join("\n");

  function track(name: string, payload: Record<string, string | number | boolean> = {}) {
    window.codexAnalytics?.track(name, {
      surface: "route_command_center",
      project_type: projectType,
      route_type: selectedRoute.projectType,
      score: activeScore,
      confidence: band,
      ...payload
    });
  }

  function resetCopyStates() {
    window.setTimeout(() => {
      setCopyState("Export Route File");
      setSocialCopyState("Copy public copy");
      setPairCopyState("Copy bilingual pair");
    }, 1600);
  }

  function toggleConstraint(label: string) {
    setConstraints((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
    track("route_constraint_toggled", { constraint: label });
  }

  async function copyRouteMap() {
    const text = buildRouteExport({
      projectName,
      projectType,
      goal,
      selectedRoute,
      score: activeScore,
      band,
      evidence,
      proof,
      delivery,
      dataRights,
      constraints,
      activeStage
    });

    setCopyState((await writeClipboard(text)) ? "Route File copied" : "Copy failed");
    resetCopyStates();
    track("route_map_exported", { export_method: "clipboard" });
  }

  async function copyPublicCopy() {
    setSocialCopyState((await writeClipboard(activeSocialCopy)) ? "Copy ready" : "Copy failed");
    resetCopyStates();
    track("social_copy_variant_copied", { language, variant: "route_command_center" });
  }

  async function copyBilingualCopy() {
    setPairCopyState((await writeClipboard(bilingualSocialCopy)) ? "Pair copied" : "Copy failed");
    resetCopyStates();
    track("social_copy_variant_copied", { language: "bilingual", variant: "route_command_center" });
  }

  return (
    <section className="route-room-shell" aria-label="AgentSiteOps route workspace">
      <div className="route-room-hero">
        <img
          className="route-room-backdrop"
          src="/assets/route-room-backdrop.png"
          alt=""
          aria-hidden="true"
        />
        <div className="route-room-hero-copy">
          <span className="route-room-kicker">Route File Studio</span>
          <h2>
            <span>Route decisions are not loose advice.</span>
            <span>They are reviewable delivery files.</span>
          </h2>
          <p>
            Move from messy inputs to one executable Route File: manual research,
            evidence acceptance, rejected alternatives, first proof asset, and stop rule
            all stay in the same clickable path.
          </p>
          <div className="route-room-actions">
            <Link prefetch={false} className="route-room-primary" href="/execution/">
              Continue in workbench
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link prefetch={false} className="route-room-secondary" href="/sample/">
              View Route File sample
            </Link>
          </div>
          <div className="route-room-proof-strip" aria-label="Route File boundaries">
            <span>Manual research</span>
            <span>Traceable evidence</span>
            <span>Stop rule</span>
          </div>
        </div>

        <div className="route-room-preview" aria-label="Workspace preview">
          <article>
            <SearchCheck aria-hidden="true" size={20} />
            <strong>Research sources</strong>
            <span>12 sources</span>
          </article>
          <article className="is-active">
            <ShieldCheck aria-hidden="true" size={20} />
            <strong>Coverage gate</strong>
            <span>{band} confidence</span>
          </article>
          <article>
            <FileText aria-hidden="true" size={20} />
            <strong>Route File</strong>
            <span>v1.0 draft</span>
          </article>
        </div>
      </div>

      <div className="route-room-controls" aria-label="Route controls">
        <label>
          <span>Project name</span>
          <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
        </label>
        <label>
          <span>Project type</span>
          <select
            value={projectType}
            onChange={(event) => {
              setProjectType(event.target.value);
              setActiveRouteType(event.target.value);
              track("route_project_type_changed", { value: event.target.value });
            }}
          >
            {projectRouteFitMatrix.map((route) => (
              <option key={route.projectType}>{route.projectType}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Main goal</span>
          <select value={goal} onChange={(event) => setGoal(event.target.value)}>
            {projectGoals.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button
          className="route-room-reset"
          type="button"
          onClick={() => {
            setActiveRouteType(topRoute.projectType);
            track("route_analysis_rerun", { top_route: topRoute.projectType });
          }}
        >
          <RotateCcw aria-hidden="true" size={15} />
          Re-rank route
        </button>
      </div>

      <div className="route-room-workspace">
        <div className="route-atlas-panel">
          <div className="route-room-section-head">
            <span>
              <Map aria-hidden="true" size={16} />
              Route Atlas
            </span>
            <strong>Select one route and preserve the rejected paths.</strong>
          </div>

          <div className="route-atlas-canvas" aria-label="Candidate route map">
            {visibleCandidates.map((route, index) => {
              const isSelected = route.projectType === selectedRoute.projectType;
              const isTop = route.projectType === topRoute.projectType;

              return (
                <button
                  className={`route-atlas-card route-atlas-card-${index + 1} ${
                    isSelected ? "is-selected" : ""
                  } ${isTop ? "is-top-route" : ""}`}
                  key={route.projectType}
                  type="button"
                  onClick={() => {
                    setActiveRouteType(route.projectType);
                    track("route_candidate_selected", { candidate: route.projectType });
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{route.projectType}</strong>
                  <small>{route.decision}</small>
                  <em>{route.score}/100</em>
                </button>
              );
            })}
          </div>

          <div className="route-stage-dock" aria-label="Execution stages">
            {executionStages.map((stage, index) => (
              <button
                className={stage.id === activeStageId ? "is-active" : ""}
                key={stage.id}
                type="button"
                onClick={() => {
                  setActiveStageId(stage.id);
                  track("route_stage_selected", { stage: stage.id });
                }}
              >
                <span>{index + 1}</span>
                <strong>{stage.title}</strong>
                <small>{stage.zh}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="route-decision-panel" aria-label="Route decision console">
          <div className="route-room-section-head">
            <span>
              <FileCheck2 aria-hidden="true" size={16} />
              Decision Console
            </span>
            <strong>{activeStage.zh}</strong>
          </div>

          <section className="route-active-stage">
            <span>{activeStage.metric}</span>
            <h3>{activeStage.title}</h3>
            <p>{activeStage.output}</p>
            <ul>
              {activeStage.tasks.map((task) => (
                <li key={task}>
                  <CheckCircle2 aria-hidden="true" size={14} />
                  {task}
                </li>
              ))}
            </ul>
          </section>

          <section className="route-decision-states" aria-label="Stage decision buttons">
            <button type="button" className="is-pass">Pass<span>通过</span></button>
            <button type="button" className="is-repair">Repair<span>补研</span></button>
            <button type="button" className="is-blocked">Blocked<span>阻断</span></button>
            <button type="button" className="is-muted">Not delivery<span>非交付</span></button>
          </section>

          <section className="route-missing-panel">
            <h3>Missing evidence</h3>
            <label>
              <input
                checked={constraints.includes(routeConstraints[0].label)}
                type="checkbox"
                onChange={() => toggleConstraint(routeConstraints[0].label)}
              />
              Generic AI substitute risk
            </label>
            <label>
              <input
                checked={constraints.includes(routeConstraints[2].label)}
                type="checkbox"
                onChange={() => toggleConstraint(routeConstraints[2].label)}
              />
              Data rights boundary
            </label>
            <p>{bandDetail.requiredEvidence}</p>
          </section>
        </aside>
      </div>

      <div className="route-file-studio-grid">
        <article className="route-file-document" aria-label="Route File preview">
          <div className="route-file-document-head">
            <span>Route File v1.0</span>
            <strong>{selectedRoute.projectType}</strong>
            <em>{band} / {activeScore}</em>
          </div>
          <div className="route-file-tabs">
            {routeFileSections.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="route-file-document-body">
            <section>
              <h3>Why this route</h3>
              <ul>
                {selectedRoute.why.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Stop rule</h3>
              <p>{selectedRoute.weakRouteWhen}</p>
            </section>
          </div>
          <button className="route-room-primary" type="button" onClick={copyRouteMap}>
            <Copy aria-hidden="true" size={15} />
            {copyState}
          </button>
        </article>

        <article className="route-evidence-console" aria-label="Evidence controls">
          <div className="route-room-section-head">
            <span>
              <ClipboardList aria-hidden="true" size={16} />
              Evidence settings
            </span>
            <strong>Only keep inputs that change the route decision.</strong>
          </div>
          <div className="route-compact-fields">
            <label>
              <span>Demand evidence</span>
              <select value={evidence} onChange={(event) => setEvidence(event.target.value)}>
                {evidenceLevels.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Proof asset</span>
              <select value={proof} onChange={(event) => setProof(event.target.value)}>
                {proofLevels.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Delivery boundary</span>
              <select value={delivery} onChange={(event) => setDelivery(event.target.value)}>
                {deliveryLevels.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Data rights</span>
              <select value={dataRights} onChange={(event) => setDataRights(event.target.value)}>
                {dataRightsLevels.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>
          <small>{evidenceLevel.detail}</small>
        </article>
      </div>

      <div className="route-social-dock" aria-label="Bilingual social copy">
        <div>
          <span>
            <Languages aria-hidden="true" size={16} />
            Social copy
          </span>
          <strong>Convert the Route File into public copy without changing the claim boundary.</strong>
        </div>
        <div className="route-language-switch" aria-label="Language">
          {(["zh", "en"] as const).map((item) => (
            <button
              className={language === item ? "is-active" : ""}
              key={item}
              type="button"
              onClick={() => setLanguage(item)}
            >
              {item === "zh" ? "中文" : "English"}
            </button>
          ))}
        </div>
        <p>{activeSocialCopy}</p>
        <div className="route-social-actions">
          <button className="route-room-secondary" type="button" onClick={copyPublicCopy}>
            <Copy aria-hidden="true" size={15} />
            {socialCopyState}
          </button>
          <button className="route-room-secondary" type="button" onClick={copyBilingualCopy}>
            <Copy aria-hidden="true" size={15} />
            {pairCopyState}
          </button>
        </div>
      </div>

      <div className="route-source-ribbon" aria-label="Route basis">
        {routeSourceMap
          .filter((item) =>
            [
              "Builder ability",
              "Buyer problem",
              "Proof asset",
              "Search evidence",
              "Generic AI substitute"
            ].includes(item.dimension)
          )
          .map((item) => (
            <span key={item.dimension}>
              <strong>{item.dimension}</strong>
              {item.stopRule}
            </span>
          ))}
      </div>
    </section>
  );
}
