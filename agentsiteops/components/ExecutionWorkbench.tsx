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
  GitMerge,
  Languages,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import {
  socialCopyBoundaryRows,
  socialVariants,
  type SocialChannel,
  type SocialLanguage
} from "@/lib/socialCopy";

type StageId = "intake" | "scope" | "research" | "gate" | "route" | "social";
type CopyStatus = "idle" | "copied" | "failed";
type StageStatus = "pass" | "repair" | "blocked" | "not_delivery";

const stages: Array<{
  id: StageId;
  label: string;
  zh: string;
  title: string;
  state: string;
  icon: typeof ClipboardList;
  purpose: string;
  pass: string;
  trigger: string;
  next: string;
  notDelivery: string;
  href: string;
}> = [
  {
    id: "intake",
    label: "Intake",
    zh: "项目接入",
    title: "Collect usable project facts",
    state: "Ready",
    icon: ClipboardList,
    purpose:
      "Capture the project, target user, source material, constraints, assets, and the decision that is blocking execution.",
    pass: "Project facts, target user, current assets, blocked claims, and decision question are present.",
    trigger: "Client opens the intake path or sends a project packet.",
    next: "Move to scope lock when the input exposes the real route decision.",
    notDelivery: "A vague idea, pasted notes, or a private chat dump without a decision question.",
    href: "/intake/"
  },
  {
    id: "scope",
    label: "Scope",
    zh: "边界锁定",
    title: "Lock the research boundary",
    state: "Operator",
    icon: ShieldCheck,
    purpose:
      "Turn messy input into a bounded research lane, accepted sources, blocked claims, and a stop condition.",
    pass: "Research lane, source boundary, risk limits, and non-goals are explicit.",
    trigger: "Intake has enough facts to prevent broad research drift.",
    next: "Generate the prompt pack for the exact route decision.",
    notDelivery: "A broad market research request that has no route, risk, or source boundary.",
    href: "/templates/route-research-prompt-pack/"
  },
  {
    id: "research",
    label: "Research",
    zh: "手动研究",
    title: "Run the approved research channel",
    state: "Carrier",
    icon: SearchCheck,
    purpose:
      "Use the locked brief in an approved research channel, manual source-review path, or client-provided report workflow. The website prepares the brief and checks returned reports.",
    pass: "Returned report includes sources, buyer logic, alternatives, proof needs, and validation limits.",
    trigger: "A locked prompt pack is ready to run outside the website.",
    next: "Check coverage before synthesis.",
    notDelivery: "Hidden automatic research claims, unsupported summaries, or report text without source coverage.",
    href: "/templates/route-research-prompt-pack/"
  },
  {
    id: "gate",
    label: "Gate",
    zh: "覆盖验收",
    title: "Check coverage and repair gaps",
    state: "Decision",
    icon: FileCheck2,
    purpose:
      "Accept, repair, block, or reject the report before it becomes a Route File.",
    pass: "Buyer logic, source table, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule are covered.",
    trigger: "Research returns with enough structure to inspect.",
    next: "Generate a second-pass prompt if coverage is weak, or move to route synthesis.",
    notDelivery: "A clean-looking report that misses rejected alternatives, proof, or a stop rule.",
    href: "/delivery-gate/"
  },
  {
    id: "route",
    label: "Route File",
    zh: "路线文件",
    title: "Fuse accepted research into one file",
    state: "Output",
    icon: FileText,
    purpose:
      "Produce the selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
    pass: "The client can see what to do first, what not to do, what is missing, and when to stop.",
    trigger: "Coverage gate returns pass or repaired-pass.",
    next: "Send the Route File and move only the first proof asset into execution.",
    notDelivery: "A plan with many possible directions and no selected route.",
    href: "/sample/"
  },
  {
    id: "social",
    label: "Social",
    zh: "社交转换",
    title: "Convert the Route File into public copy",
    state: "Share",
    icon: Languages,
    purpose:
      "Translate the product explanation between English and Chinese for public updates without changing the claim boundary.",
    pass: "Copy states the route-file output and no-guarantee boundary in the selected language.",
    trigger: "A public update, launch post, or feedback request is needed.",
    next: "Copy a channel-specific English or Chinese version and link back to the execution path.",
    notDelivery: "A growth promise, AI-traffic claim, or payment ask without a visible route-file artifact.",
    href: "/execution/"
  }
];

const clickPath = [
  { label: "Intake", href: "/intake/", result: "Project facts and constraints" },
  { label: "Prompt pack", href: "/templates/route-research-prompt-pack/", result: "Carrier-neutral research brief" },
  { label: "Delivery gate", href: "/delivery-gate/", result: "Pass, repair, blocked, or not delivery" },
  { label: "Sample", href: "/sample/", result: "Route File structure" },
  { label: "Client workflow", href: "/reports/client-route-workflow/", result: "Observable progress" }
];

const routeFilePreview = [
  "Selected route",
  "Rejected alternatives",
  "Evidence ledger",
  "First proof asset",
  "Validation channel",
  "Stop rule"
];

const responseLifecycle = [
  {
    label: "Auto receipt",
    zh: "自动回执",
    owner: "Website",
    body:
      "The site can confirm that a request was received, preserve the intake packet, and show which fields are missing.",
    evidence: "Timestamp, intake fields, missing-input list."
  },
  {
    label: "Operator review",
    zh: "人工验收",
    owner: "Operator",
    body:
      "A person checks whether the project can be researched, whether evidence rights are usable, and whether the request is inside the delivery boundary.",
    evidence: "Accepted, repair requested, blocked, or not delivery."
  },
  {
    label: "Research carrier",
    zh: "研究载体",
    owner: "Approved channel",
    body:
      "The research can run through any approved carrier: manual source review, a client report, a research tool, or an operator-controlled research pass.",
    evidence: "Source list, findings, rejected paths, uncertainty notes."
  },
  {
    label: "Coverage gate",
    zh: "覆盖检查",
    owner: "Quality gate",
    body:
      "Returned material is checked before synthesis. Missing buyer logic, source coverage, proof asset, or stop rule triggers repair instead of delivery.",
    evidence: "Pass, repair prompt, blocked reason, or rejection."
  }
];

const routeOutputChecks = [
  {
    label: "Selected route",
    body: "One chosen path that can be executed first, not a list of equal options."
  },
  {
    label: "Rejected alternatives",
    body: "Visible reasons for the routes that were not selected."
  },
  {
    label: "Evidence ledger",
    body: "Claims tagged as verified, inferred, pending, or not proven."
  },
  {
    label: "First proof asset",
    body: "The smallest inspectable asset needed before more build or content work."
  },
  {
    label: "Validation channel",
    body: "The first channel where buyer response, usage, search, or payment evidence can appear."
  },
  {
    label: "Stop rule",
    body: "A concrete condition that prevents endless planning or unsupported expansion."
  }
];

const nextActionCards = [
  {
    label: "Submit intake",
    href: "/intake/",
    body: "Use this when the project facts, constraints, or decision question are still incomplete."
  },
  {
    label: "Review sample",
    href: "/sample/",
    body: "Use this to inspect the exact Route File structure before expecting delivery."
  },
  {
    label: "Check gate",
    href: "/delivery-gate/",
    body: "Use this to see why a returned report becomes pass, repair, blocked, or not delivery."
  },
  {
    label: "Client workflow",
    href: "/reports/client-route-workflow/",
    body: "Use this to follow the visible client progress from intake to final handoff."
  }
];

const stageStatusOptions: Array<{ id: StageStatus; label: string; zh: string; detail: string }> = [
  {
    id: "pass",
    label: "Pass",
    zh: "通过",
    detail: "Move to the next stage."
  },
  {
    id: "repair",
    label: "Repair",
    zh: "补研",
    detail: "Generate a focused repair prompt or missing-input request."
  },
  {
    id: "blocked",
    label: "Blocked",
    zh: "阻断",
    detail: "Pause because evidence, rights, or delivery capacity is missing."
  },
  {
    id: "not_delivery",
    label: "Not delivery",
    zh: "非交付",
    detail: "Reject the output as outside the Route File contract."
  }
];

const moduleMerges = [
  {
    from: "Homepage explanation",
    to: "首页只保留强入口、路线文件预览和进入工作台的动作。"
  },
  {
    from: "Prompt pack overlap",
    to: "提示词页负责研究文本，工作台只显示当前阶段和下一步。"
  },
  {
    from: "Delivery caveats",
    to: "交付门负责 Pass、Repair、Blocked、Not delivery 的定义。"
  },
  {
    from: "Payment-first CTAs",
    to: "支付入口后置，主路径先展示执行、样本和验收逻辑。"
  }
];

function track(name: string, payload: Record<string, string | number | boolean> = {}) {
  window.codexAnalytics?.track(name, {
    surface: "execution_workbench",
    ...payload
  });
}

function buildStagePacket(stage: (typeof stages)[number]) {
  return [
    `Stage: ${stage.label}`,
    `State: ${stage.state}`,
    `Purpose: ${stage.purpose}`,
    `Pass condition: ${stage.pass}`,
    `Trigger: ${stage.trigger}`,
    `Next action: ${stage.next}`,
    `Not delivery: ${stage.notDelivery}`
  ].join("\n");
}

function defaultStageDecisions() {
  return Object.fromEntries(stages.map((stage) => [stage.id, "pass"])) as Record<
    StageId,
    StageStatus
  >;
}

function buildRouteSkeleton(decisions: Record<StageId, StageStatus>) {
  return [
    "AgentSiteOps Route File skeleton",
    "",
    "Required sections:",
    ...routeFilePreview.map((item) => `- ${item}`),
    "",
    "Execution decisions:",
    ...stages.map((stage) => `- ${stage.label}: ${decisions[stage.id]}`),
    "",
    "Stop condition:",
    "- Any repair, blocked, or not_delivery stage must be resolved before expanding pages, tools, checkout, or content."
  ].join("\n");
}

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to a temporary textarea for browsers that block navigator.clipboard.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function ExecutionWorkbench() {
  const [activeStageId, setActiveStageId] = useState<StageId>("research");
  const [activeChannel, setActiveChannel] = useState<SocialChannel>("founder");
  const [activeLanguage, setActiveLanguage] = useState<SocialLanguage>("zh");
  const [stageDecisions, setStageDecisions] = useState(defaultStageDecisions);
  const [stageCopyStatus, setStageCopyStatus] = useState<CopyStatus>("idle");
  const [primaryCopyStatus, setPrimaryCopyStatus] = useState<CopyStatus>("idle");
  const [pairCopyStatus, setPairCopyStatus] = useState<CopyStatus>("idle");
  const [bundleCopyStatus, setBundleCopyStatus] = useState<CopyStatus>("idle");
  const [skeletonCopyStatus, setSkeletonCopyStatus] = useState<CopyStatus>("idle");

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? stages[0],
    [activeStageId]
  );
  const activeSocial = socialVariants[activeChannel];
  const activeSocialText = activeLanguage === "en" ? activeSocial.en : activeSocial.zh;
  const pairedLanguage: SocialLanguage = activeLanguage === "en" ? "zh" : "en";
  const pairedSocialText = pairedLanguage === "en" ? activeSocial.en : activeSocial.zh;
  const activeLanguageLabel = activeLanguage === "en" ? "English" : "中文";
  const pairedLanguageLabel = pairedLanguage === "en" ? "English" : "中文";
  const bilingualBundle = [
    `Channel: ${activeSocial.label}`,
    `Context: ${activeSocial.context}`,
    "",
    "English:",
    activeSocial.en,
    "",
    "中文:",
    activeSocial.zh,
    "",
    "Boundary: do not add traffic, ranking, revenue, buyer response, or hidden automation claims."
  ].join("\n");
  const activeStageStatus = stageDecisions[activeStageId];
  const activeStatus =
    stageStatusOptions.find((option) => option.id === activeStageStatus) ??
    stageStatusOptions[0];
  const routeSkeleton = buildRouteSkeleton(stageDecisions);
  const stageCopyLabel =
    stageCopyStatus === "copied" ? "Stage copied" : stageCopyStatus === "failed" ? "Copy failed" : "Copy stage";
  const primaryCopyLabel =
    primaryCopyStatus === "copied"
      ? "Copied"
      : primaryCopyStatus === "failed"
        ? "Copy failed"
        : `Copy ${activeLanguage === "en" ? "English" : "Chinese"}`;
  const pairCopyLabel =
    pairCopyStatus === "copied" ? "Copied" : pairCopyStatus === "failed" ? "Copy failed" : "Copy pair";
  const bundleCopyLabel =
    bundleCopyStatus === "copied"
      ? "Pair copied"
      : bundleCopyStatus === "failed"
        ? "Copy failed"
        : "Copy bilingual pair";
  const skeletonCopyLabel =
    skeletonCopyStatus === "copied"
      ? "Skeleton copied"
      : skeletonCopyStatus === "failed"
        ? "Copy failed"
        : "Copy Route File skeleton";

  function resetSocialCopyStatus() {
    setPrimaryCopyStatus("idle");
    setPairCopyStatus("idle");
    setBundleCopyStatus("idle");
  }

  function selectStage(stageId: StageId) {
    setActiveStageId(stageId);
    track("execution_stage_selected", { stage: stageId });
  }

  function setStageStatus(status: StageStatus) {
    setStageDecisions((current) => ({
      ...current,
      [activeStageId]: status
    }));
    track("execution_stage_status_changed", { stage: activeStageId, status });
  }

  async function copyStage() {
    const copied = await writeClipboard(buildStagePacket(activeStage));
    setStageCopyStatus(copied ? "copied" : "failed");
    if (copied) {
      track("template_copy_click", {
        label: activeStage.id,
        length: buildStagePacket(activeStage).length
      });
    }
    window.setTimeout(() => setStageCopyStatus("idle"), 1600);
  }

  async function copySocialText(
    text: string,
    variant: "primary" | "paired",
    language: SocialLanguage
  ) {
    const copied = await writeClipboard(text);
    const setStatus = variant === "primary" ? setPrimaryCopyStatus : setPairCopyStatus;

    setStatus(copied ? "copied" : "failed");
    if (copied) {
      track("social_copy_variant_copied", {
        channel: activeChannel,
        lang: language,
        variant
      });
    }

    window.setTimeout(() => setStatus("idle"), 1600);
  }

  async function copyBilingualBundle() {
    const copied = await writeClipboard(bilingualBundle);
    setBundleCopyStatus(copied ? "copied" : "failed");

    if (copied) {
      track("social_copy_variant_copied", {
        channel: activeChannel,
        lang: "bilingual",
        variant: "bundle"
      });
    }

    window.setTimeout(() => setBundleCopyStatus("idle"), 1600);
  }

  async function copyRouteSkeleton() {
    const copied = await writeClipboard(routeSkeleton);
    setSkeletonCopyStatus(copied ? "copied" : "failed");

    if (copied) {
      track("template_copy_click", {
        label: "route_file_skeleton",
        length: routeSkeleton.length
      });
    }

    window.setTimeout(() => setSkeletonCopyStatus("idle"), 1600);
  }

  return (
    <section className="execution-room" aria-label="Execution Workbench">
      <div className="execution-room-head">
        <div>
          <span>Execution Command</span>
          <h2>从接入到 Route File 的一条可点击路径</h2>
          <p>
            页面结构保留 6 个阶段，但把重复解释压缩到当前阶段、决策状态、
            Route File 预览和中英文文案转换。
          </p>
        </div>
        <div className="execution-room-actions">
          <Link prefetch={false} className="route-room-primary" href={activeStage.href}>
            Open current step
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <button className="route-room-secondary" type="button" onClick={copyStage}>
            <Copy aria-hidden="true" size={15} />
            {stageCopyLabel}
          </button>
        </div>
      </div>

      <div className="execution-room-grid">
        <nav className="execution-room-rail" aria-label="Execution stages">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = stage.id === activeStageId;

            return (
              <button
                className={isActive ? "is-active" : ""}
                key={stage.id}
                type="button"
                onClick={() => selectStage(stage.id)}
              >
                <span>{index + 1}</span>
                <Icon aria-hidden="true" size={18} />
                <strong>{stage.label}</strong>
                <small>{stage.zh}</small>
              </button>
            );
          })}
        </nav>

        <article className="execution-room-stage">
          <div className="route-room-section-head">
            <span>
              <FileCheck2 aria-hidden="true" size={16} />
              Current Stage
            </span>
            <strong>{activeStage.state}</strong>
          </div>
          <h3>{activeStage.title}</h3>
          <p>{activeStage.purpose}</p>

          <dl className="execution-room-state-list">
            <div>
              <dt>Pass condition</dt>
              <dd>{activeStage.pass}</dd>
            </div>
            <div>
              <dt>Event trigger</dt>
              <dd>{activeStage.trigger}</dd>
            </div>
            <div>
              <dt>Next action</dt>
              <dd>{activeStage.next}</dd>
            </div>
            <div>
              <dt>Not delivery</dt>
              <dd>{activeStage.notDelivery}</dd>
            </div>
          </dl>
        </article>

        <aside className="execution-room-decision" aria-label="Stage decision">
          <div className="route-room-section-head">
            <span>
              <ShieldCheck aria-hidden="true" size={16} />
              Stage Decision
            </span>
            <strong>{activeStatus.label}</strong>
          </div>
          <p>{activeStatus.detail}</p>
          <div className="execution-room-status-buttons">
            {stageStatusOptions.map((option) => (
              <button
                className={`is-${option.id} ${option.id === activeStageStatus ? "is-active" : ""}`}
                key={option.id}
                type="button"
                onClick={() => setStageStatus(option.id)}
              >
                {option.label}
                <span>{option.zh}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <section className="execution-room-path" aria-label="Click path">
        <div className="route-room-section-head">
          <span>
            <GitMerge aria-hidden="true" size={16} />
            Click path
          </span>
          <strong>每个入口只负责一个下一步。</strong>
        </div>
        <div className="execution-room-path-grid">
          {clickPath.map((item, index) => (
            <Link prefetch={false} href={item.href} key={item.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <small>{item.result}</small>
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="execution-room-response" aria-label="Customer response and output path">
        <div className="route-room-section-head">
          <span>
            <ShieldCheck aria-hidden="true" size={16} />
            Client response path
          </span>
          <strong>网站负责可见状态，人工负责验收和最终判断。</strong>
        </div>
        <div className="execution-response-grid">
          {responseLifecycle.map((item, index) => (
            <article key={item.label}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{item.owner}</small>
              </div>
              <h3>{item.label}</h3>
              <strong>{item.zh}</strong>
              <p>{item.body}</p>
              <em>{item.evidence}</em>
            </article>
          ))}
        </div>
        <div className="execution-response-split">
          <article className="execution-output-checklist">
            <div className="route-room-section-head">
              <span>
                <FileText aria-hidden="true" size={16} />
                Route File output
              </span>
              <strong>交付必须同时包含 6 个部分。</strong>
            </div>
            <div>
              {routeOutputChecks.map((item) => (
                <section key={item.label}>
                  <CheckCircle2 aria-hidden="true" size={17} />
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.body}</p>
                  </div>
                </section>
              ))}
            </div>
          </article>
          <article className="execution-next-actions">
            <div className="route-room-section-head">
              <span>
                <ArrowRight aria-hidden="true" size={16} />
                Next action
              </span>
              <strong>按当前问题进入下一页。</strong>
            </div>
            <div>
              {nextActionCards.map((item) => (
                <Link prefetch={false} href={item.href} key={item.href}>
                  <strong>{item.label}</strong>
                  <small>{item.body}</small>
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="execution-room-output-grid" aria-label="Route File and module merge">
        <article className="route-file-document">
          <div className="route-file-document-head">
            <span>Route File preview</span>
            <strong>Final file structure</strong>
            <em>{activeStatus.zh}</em>
          </div>
          <div className="route-file-tabs">
            {routeFilePreview.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="execution-route-skeleton">
            <strong>Execution decisions</strong>
            <div>
              {stages.map((stage) => (
                <span key={stage.id}>
                  {stage.label}: {stageDecisions[stage.id]}
                </span>
              ))}
            </div>
            <button className="route-room-secondary" type="button" onClick={copyRouteSkeleton}>
              <Copy aria-hidden="true" size={15} />
              {skeletonCopyLabel}
            </button>
          </div>
        </article>

        <article className="execution-room-merge">
          <div className="route-room-section-head">
            <span>
              <GitMerge aria-hidden="true" size={16} />
              Module merge
            </span>
            <strong>重复内容合并到一个责任页面。</strong>
          </div>
          <div>
            {moduleMerges.map((item) => (
              <section key={item.from}>
                <h3>{item.from}</h3>
                <p>{item.to}</p>
              </section>
            ))}
          </div>
        </article>
      </section>

      <section className="route-social-dock execution-social-room" aria-label="Bilingual social copy">
        <div>
          <span>
            <Languages aria-hidden="true" size={16} />
            Bilingual social copy
          </span>
          <strong>{activeSocial.context}</strong>
        </div>
        <div className="execution-social-controls">
          <div className="route-language-switch" aria-label="Social channel">
            {(Object.keys(socialVariants) as SocialChannel[]).map((channel) => (
              <button
                className={activeChannel === channel ? "is-active" : ""}
                key={channel}
                type="button"
                onClick={() => {
                  setActiveChannel(channel);
                  resetSocialCopyStatus();
                }}
              >
                {socialVariants[channel].label}
              </button>
            ))}
          </div>
          <button className="route-room-secondary execution-copy-pair-button" type="button" onClick={copyBilingualBundle}>
            <Copy aria-hidden="true" size={15} />
            {bundleCopyLabel}
          </button>
          <div className="route-language-switch" aria-label="Language">
            {(["zh", "en"] as SocialLanguage[]).map((language) => (
              <button
                className={activeLanguage === language ? "is-active" : ""}
                key={language}
                type="button"
                onClick={() => {
                  setActiveLanguage(language);
                  resetSocialCopyStatus();
                }}
              >
                {language === "en" ? "English" : "中文"}
              </button>
            ))}
          </div>
        </div>
        <div className="execution-social-boundary" aria-label="Social copy claim boundary">
          {socialCopyBoundaryRows.map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.body}</span>
            </article>
          ))}
        </div>
        <div className="execution-social-copy-grid">
          <article className="execution-social-copy-card">
            <div>
              <span>Selected language</span>
              <strong>{activeLanguageLabel}</strong>
            </div>
            <p dir="auto">{activeSocialText}</p>
            <button
              className="route-room-primary"
              type="button"
              onClick={() => copySocialText(activeSocialText, "primary", activeLanguage)}
            >
              <Copy aria-hidden="true" size={15} />
              {primaryCopyLabel}
            </button>
          </article>

          <article className="execution-social-copy-card">
            <div>
              <span>Paired translation</span>
              <strong>{pairedLanguageLabel}</strong>
            </div>
            <p dir="auto">{pairedSocialText}</p>
            <button
              className="route-room-secondary"
              type="button"
              onClick={() => copySocialText(pairedSocialText, "paired", pairedLanguage)}
            >
              <Copy aria-hidden="true" size={15} />
              {pairCopyLabel}
            </button>
          </article>
        </div>
      </section>
    </section>
  );
}
