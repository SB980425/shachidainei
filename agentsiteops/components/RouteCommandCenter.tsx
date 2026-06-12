"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  FileText,
  Gauge,
  GitBranch,
  RotateCcw,
  ShieldCheck,
  Sun,
  TimerReset
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  projectRouteFitMatrix,
  routeConfidenceBands,
  routeSourceMap
} from "@/lib/routeEvidence";

type ThemeMode = "night" | "day";

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
    title: "Foundation",
    window: "Day 1",
    metric: "Scope locked",
    tasks: ["Name project type", "Select buyer or internal user", "Record hard risks"],
    output: "One-page route brief with rejected assumptions."
  },
  {
    id: "evidence",
    title: "Evidence",
    window: "Day 1-2",
    metric: "Sources mapped",
    tasks: ["Attach search, buyer, proof, or usage evidence", "Mark missing facts"],
    output: "Evidence ledger and route confidence band."
  },
  {
    id: "selection",
    title: "Route Select",
    window: "Day 2",
    metric: "Weak paths pruned",
    tasks: ["Score candidate routes", "Explain rejected paths", "Lock first asset"],
    output: "Selected route plus why alternatives were not selected."
  },
  {
    id: "prototype",
    title: "Prototype",
    window: "Day 3-5",
    metric: "Artifact visible",
    tasks: ["Build checker, sample, page skeleton, or workflow screenshot"],
    output: "Public proof asset that the route can be inspected."
  },
  {
    id: "launch",
    title: "Launch",
    window: "Day 5-7",
    metric: "Exposure started",
    tasks: ["Submit sitemap or IndexNow", "Send narrow outreach", "Record replies"],
    output: "First traffic and buyer-response evidence."
  },
  {
    id: "growth",
    title: "Growth",
    window: "After signal",
    metric: "Only if proven",
    tasks: ["Expand pages", "Add paid path", "Package reusable workflow"],
    output: "Growth only after the stop rule is cleared."
  }
];

const defaultProjectType = "Micro tool or dashboard";

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
  selectedRoute: (typeof projectRouteFitMatrix)[number] & {
    score: number;
    decision: string;
    why: string[];
  };
  score: number;
  band: string;
  evidence: string;
  proof: string;
  delivery: string;
  dataRights: string;
  constraints: string[];
  activeStage: typeof executionStages[number];
}) {
  return [
    "AgentSiteOps Custom Route Map",
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
  const [theme, setTheme] = useState<ThemeMode>("night");
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
  const [copyState, setCopyState] = useState("Copy route map");

  const evidenceLevel = evidenceLevels.find((item) => item.label === evidence) ?? evidenceLevels[0];
  const proofLevel = proofLevels.find((item) => item.label === proof) ?? proofLevels[0];
  const deliveryLevel = deliveryLevels.find((item) => item.label === delivery) ?? deliveryLevels[0];
  const dataRightsLevel = dataRightsLevels.find((item) => item.label === dataRights) ?? dataRightsLevels[0];

  const routeCandidates = useMemo(() => {
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

        const why = [
          route.strongestRouteWhen,
          `First asset: ${route.firstAsset}`,
          `Evidence needed: ${route.evidenceBeforePayment}`
        ];

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
          why
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
  const visibleCandidates = routeCandidates.slice(0, 4);

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

  function toggleTheme() {
    const nextTheme = theme === "night" ? "day" : "night";
    setTheme(nextTheme);
    track("route_theme_changed", { theme: nextTheme });
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

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("Copied");
      track("route_map_exported", { export_method: "clipboard" });
    } catch {
      setCopyState("Copy failed");
    }

    window.setTimeout(() => setCopyState("Copy route map"), 1600);
  }

  return (
    <section className="route-command-shell" data-route-theme={theme}>
      <div className="route-command-bg" aria-hidden="true" />

      <div className="route-command-topbar">
        <BrandLogo />
        <nav aria-label="Route command navigation">
          <span className="is-active">Command Center</span>
          <Link prefetch={false} href="/tools/website-opportunity-scorer/">
            Scorer
          </Link>
          <Link prefetch={false} href="/tools/route-confidence-checker/">
            Route Checker
          </Link>
          <Link prefetch={false} href="/methodology/route-selection/">
            Method
          </Link>
          <Link prefetch={false} href="/sample/">
            Sample
          </Link>
        </nav>
        <button className="route-theme-toggle" type="button" onClick={toggleTheme}>
          <Sun aria-hidden="true" size={16} />
          {theme === "night" ? "Night" : "Day"}
        </button>
      </div>

      <div className="route-command-layout">
        <aside className="route-input-panel" aria-label="Project route inputs">
          <div className="panel-caption">
            <FileText aria-hidden="true" size={16} />
            Project input
          </div>

          <label className="route-field">
            <span>Project name</span>
            <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
          </label>

          <label className="route-field">
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

          <label className="route-field">
            <span>Primary goal</span>
            <select value={goal} onChange={(event) => setGoal(event.target.value)}>
              {projectGoals.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="route-field">
            <span>Demand evidence</span>
            <select value={evidence} onChange={(event) => setEvidence(event.target.value)}>
              {evidenceLevels.map((item) => (
                <option key={item.label}>{item.label}</option>
              ))}
            </select>
            <small>{evidenceLevel.detail}</small>
          </label>

          <div className="route-split-fields">
            <label className="route-field">
              <span>Proof asset</span>
              <select value={proof} onChange={(event) => setProof(event.target.value)}>
                {proofLevels.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="route-field">
              <span>Data rights</span>
              <select value={dataRights} onChange={(event) => setDataRights(event.target.value)}>
                {dataRightsLevels.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="route-field">
            <span>Delivery boundary</span>
            <select value={delivery} onChange={(event) => setDelivery(event.target.value)}>
              {deliveryLevels.map((item) => (
                <option key={item.label}>{item.label}</option>
              ))}
            </select>
          </label>

          <div className="route-constraint-list" aria-label="Route constraints">
            <span>Constraints</span>
            {routeConstraints.map((item) => (
              <label key={item.id}>
                <input
                  checked={constraints.includes(item.label)}
                  type="checkbox"
                  onChange={() => toggleConstraint(item.label)}
                />
                {item.label}
              </label>
            ))}
          </div>

          <button
            className="route-rerun-button"
            type="button"
            onClick={() => {
              setActiveRouteType(topRoute.projectType);
              track("route_analysis_rerun", { top_route: topRoute.projectType });
            }}
          >
            <RotateCcw aria-hidden="true" size={16} />
            Re-run analysis
          </button>
        </aside>

        <div className="route-main-panel">
          <div className="route-main-heading">
            <div>
              <h1>AI Route Selection Engine</h1>
              <p>
                Turn a project idea into one selected route, rejected alternatives, a
                first asset, and a 7-day execution path.
              </p>
            </div>
            <div className="analysis-pill">
              <Activity aria-hidden="true" size={15} />
              Analysis complete
            </div>
          </div>

          <div className="route-graph" aria-label="Candidate route graph">
            <div className="route-origin-node">
              <span>Your project</span>
              <strong>{projectType}</strong>
              <small>{goal}</small>
            </div>

            <div className="route-candidate-stack">
              {visibleCandidates.map((route, index) => {
                const isSelected = route.projectType === selectedRoute.projectType;
                const isTop = route.projectType === topRoute.projectType;

                return (
                  <button
                    className={`route-candidate route-candidate-${index + 1} ${
                      isSelected ? "is-selected" : ""
                    } ${isTop ? "is-top-route" : ""}`}
                    key={route.projectType}
                    type="button"
                    onClick={() => {
                      setActiveRouteType(route.projectType);
                      track("route_candidate_selected", { candidate: route.projectType });
                    }}
                  >
                    <span className="route-node-icon">
                      {isTop ? (
                        <CheckCircle2 aria-hidden="true" size={18} />
                      ) : (
                        <GitBranch aria-hidden="true" size={18} />
                      )}
                    </span>
                    <span>
                      <strong>{route.projectType}</strong>
                      <small>{route.strongestRouteWhen}</small>
                    </span>
                    <em>{route.score}/100</em>
                  </button>
                );
              })}
            </div>

            <div className="route-output-node">
              <span>Recommended route</span>
              <strong>{topRoute.projectType}</strong>
              <small>{topRoute.decision}</small>
              <Link prefetch={false} href="/tools/route-confidence-checker/">
                Inspect route <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </div>
          </div>

          <div className="route-timeline" aria-label="Execution timeline">
            <div className="timeline-head">
              <h2>Execution Roadmap</h2>
              <span>Route: {selectedRoute.projectType}</span>
            </div>

            <div className="timeline-rail">
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
                  <small>{stage.window}</small>
                </button>
              ))}
            </div>

            <article className="stage-detail-card">
              <div>
                <span>{activeStage.metric}</span>
                <h3>{activeStage.title}</h3>
                <p>{activeStage.output}</p>
              </div>
              <ul>
                {activeStage.tasks.map((task) => (
                  <li key={task}>
                    <CheckCircle2 aria-hidden="true" size={15} />
                    {task}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <aside className="route-inspector-panel" aria-label="Route confidence inspector">
          <div className="confidence-ring" style={{ "--score": activeScore } as CSSProperties}>
            <strong>{activeScore}</strong>
            <span>/100</span>
          </div>

          <div className={`confidence-badge confidence-${band.toLowerCase()}`}>
            {band} confidence
          </div>
          <p>{bandDetail.allowedOutput}</p>

          <section>
            <h2>Evidence strength</h2>
            <div className="evidence-bar">
              <span style={{ width: `${Math.min(100, evidenceLevel.score * 25 + proofLevel.score * 12)}%` }} />
            </div>
            <small>{bandDetail.requiredEvidence}</small>
          </section>

          <section>
            <h2>Why selected</h2>
            <ul className="route-reason-list">
              {selectedRoute.why.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Failure gate</h2>
            <p>{selectedRoute.weakRouteWhen}</p>
          </section>

          <section>
            <h2>Next 3 actions</h2>
            <ol className="next-action-list">
              <li>Turn the selected route into one public sample.</li>
              <li>Collect one search, buyer, usage, or payment signal.</li>
              <li>Re-score before adding pages, payment, or automation.</li>
            </ol>
          </section>

          <div className="route-inspector-actions">
            <button className="primary-action" type="button" onClick={copyRouteMap}>
              {copyState}
            </button>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              Route basis
            </Link>
          </div>
        </aside>
      </div>

      <div className="route-basis-strip" aria-label="Route basis">
        <div>
          <h2>How this creates our own roadmap</h2>
          <p>
            The system does not start from a score. It starts from project facts, then
            selects a route only when evidence, proof, delivery, data rights, and risk
            boundaries support it.
          </p>
        </div>
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
            <article key={item.dimension}>
              <span>{item.dimension}</span>
              <strong>{item.acceptedEvidence}</strong>
              <small>{item.stopRule}</small>
            </article>
          ))}
      </div>

      <div className="route-command-cta">
        <div>
          <h2>Use this before building the next project.</h2>
          <p>
            For each new site or product, enter the project type, attach evidence, prune
            weak paths, and export a route map before code, content, or UI work starts.
          </p>
        </div>
        <div>
          <Link prefetch={false} className="primary-action" href="/tools/website-opportunity-scorer/">
            <Gauge aria-hidden="true" size={17} />
            Score a new direction
          </Link>
          <Link prefetch={false} className="secondary-action" href="/starter-review/">
            <BadgeDollarSign aria-hidden="true" size={17} />
            Fit review path
          </Link>
        </div>
      </div>
    </section>
  );
}
