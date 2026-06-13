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
  MousePointerClick,
  SearchCheck,
  ShieldCheck
} from "lucide-react";

type StageId = "intake" | "scope" | "research" | "gate" | "route" | "social";
type SocialChannel = "founder" | "technical" | "wechat" | "public-update";
type SocialLanguage = "en" | "zh";
type CopyStatus = "idle" | "copied" | "failed";
type StageStatus = "pass" | "repair" | "blocked" | "not_delivery";

const stages: Array<{
  id: StageId;
  label: string;
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
    title: "Collect usable project facts",
    state: "Ready",
    icon: ClipboardList,
    purpose:
      "Capture the project, target user, source material, constraints, assets, and the decision that is blocking execution.",
    pass: "Project facts, target user, current assets, blocked claims, and decision question are present.",
    trigger: "Client opens the start path or sends a project packet.",
    next: "Move to scope lock when the input exposes the real route decision.",
    notDelivery: "A vague idea, pasted notes, or a private chat dump without a decision question.",
    href: "/start/"
  },
  {
    id: "scope",
    label: "Scope",
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
    title: "Run manual Deep Research",
    state: "Manual",
    icon: SearchCheck,
    purpose:
      "Use the prompt pack in the user's own ChatGPT Deep Research allowance. The website prepares prompts and checks returned reports.",
    pass: "Returned report includes sources, buyer logic, alternatives, proof needs, and validation limits.",
    trigger: "A locked prompt pack is ready to run outside the website.",
    next: "Check coverage before synthesis.",
    notDelivery: "Hidden automatic research claims, unsupported summaries, or report text without source coverage.",
    href: "/templates/route-research-prompt-pack/"
  },
  {
    id: "gate",
    label: "Gate",
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
  { label: "Start", href: "/start/", result: "Project facts and constraints" },
  { label: "Prompt pack", href: "/templates/route-research-prompt-pack/", result: "Manual research brief" },
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

const stageStatusOptions: Array<{ id: StageStatus; label: string; detail: string }> = [
  {
    id: "pass",
    label: "Pass",
    detail: "Move to the next stage."
  },
  {
    id: "repair",
    label: "Repair",
    detail: "Generate a focused repair prompt or missing-input request."
  },
  {
    id: "blocked",
    label: "Blocked",
    detail: "Pause because evidence, rights, or delivery capacity is missing."
  },
  {
    id: "not_delivery",
    label: "Not delivery",
    detail: "Reject the output as outside the Route File contract."
  }
];

const moduleMerges = [
  {
    from: "Homepage long explanation",
    to: "Keep the short input -> research -> check -> route sequence and send detailed operation to this workbench."
  },
  {
    from: "Prompt pack and client workflow overlap",
    to: "Prompt pack owns research text; client workflow owns visible progress; this page owns the click path."
  },
  {
    from: "Delivery caveats repeated on many pages",
    to: "Delivery gate owns pass, repair, blocked, and not-delivery definitions."
  },
  {
    from: "Paid-product caveats in front-stage CTAs",
    to: "Pricing stays available, but primary navigation points to execution, sample, and delivery logic first."
  }
];

const socialVariants: Record<
  SocialChannel,
  { label: string; context: string; en: string; zh: string }
> = {
  founder: {
    label: "Founder update",
    context: "Personal build progress",
    en:
      "AgentSiteOps turns messy project material into one Route File: selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule. It does not promise traffic or revenue.",
    zh:
      "AgentSiteOps 把混乱项目资料整理成一个 Route File：选定路线、被拒方案、证据台账、第一个证明资产、验证渠道和停止规则。不承诺流量或收入。"
  },
  technical: {
    label: "Technical audience",
    context: "Builder or operator channel",
    en:
      "The website does not call the OpenAI API for Deep Research. It prepares prompt packs, checks returned reports, creates gap prompts, and fuses accepted research into a Route File.",
    zh:
      "这个网站不调用 OpenAI API 执行 Deep Research。它负责准备提示词包、检查返回报告、生成补研提示词，并把通过验收的研究融合成 Route File。"
  },
  wechat: {
    label: "Chinese social",
    context: "WeChat, Xiaohongshu, or Zhihu style",
    en:
      "Use AgentSiteOps before building more pages, tools, checkout, or content. The first output is a route decision file, not a growth promise.",
    zh:
      "在继续做页面、工具、支付或内容前，先用 AgentSiteOps 产出一个路线决策文件。它交付的是路线判断，不是增长承诺。"
  },
  "public-update": {
    label: "Public changelog",
    context: "Product update or launch note",
    en:
      "New execution workbench: intake, scope, manual research, coverage gate, Route File, and bilingual social copy now sit in one visible path.",
    zh:
      "新增执行工作台：intake、边界锁定、手动研究、覆盖度验收、Route File 和中英文社交文案已经整合进一条可见路径。"
  }
};

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
  const [activeStageId, setActiveStageId] = useState<StageId>("intake");
  const [activeChannel, setActiveChannel] = useState<SocialChannel>("founder");
  const [activeLanguage, setActiveLanguage] = useState<SocialLanguage>("en");
  const [stageDecisions, setStageDecisions] = useState(defaultStageDecisions);
  const [copyState, setCopyState] = useState("Copy");
  const [primaryCopyStatus, setPrimaryCopyStatus] = useState<CopyStatus>("idle");
  const [pairCopyStatus, setPairCopyStatus] = useState<CopyStatus>("idle");
  const [skeletonCopyStatus, setSkeletonCopyStatus] = useState<CopyStatus>("idle");

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) ?? stages[0],
    [activeStageId]
  );
  const activeSocial = socialVariants[activeChannel];
  const activeSocialText = activeLanguage === "en" ? activeSocial.en : activeSocial.zh;
  const pairedSocialText = activeLanguage === "en" ? activeSocial.zh : activeSocial.en;
  const activeStageStatus = stageDecisions[activeStageId];
  const activeStatusDetail =
    stageStatusOptions.find((option) => option.id === activeStageStatus)?.detail ??
    stageStatusOptions[0].detail;
  const routeSkeleton = buildRouteSkeleton(stageDecisions);
  const primaryCopyLabel =
    primaryCopyStatus === "copied"
      ? "Copied"
      : primaryCopyStatus === "failed"
        ? "Copy failed"
        : `Copy ${activeLanguage === "en" ? "English" : "Chinese"}`;
  const pairCopyLabel =
    pairCopyStatus === "copied" ? "Copied" : pairCopyStatus === "failed" ? "Copy failed" : "Copy pair";
  const skeletonCopyLabel =
    skeletonCopyStatus === "copied"
      ? "Skeleton copied"
      : skeletonCopyStatus === "failed"
        ? "Copy failed"
        : "Copy Route File skeleton";

  function resetSocialCopyStatus() {
    setPrimaryCopyStatus("idle");
    setPairCopyStatus("idle");
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

  async function copyText(
    text: string,
    label: string,
    eventName: "social_copy_variant_copied" | "template_copy_click",
    payload: Record<string, string | number | boolean>
  ) {
    const copied = await writeClipboard(text);

    if (copied) {
      setCopyState(label);
      track(eventName, payload);
    } else {
      setCopyState("Copy failed");
    }

    window.setTimeout(() => setCopyState("Copy"), 1600);
  }

  async function copySocialText(
    text: string,
    variant: "primary" | "paired",
    language: SocialLanguage
  ) {
    const copied = await writeClipboard(text);
    const setStatus = variant === "primary" ? setPrimaryCopyStatus : setPairCopyStatus;

    if (copied) {
      setStatus("copied");
      track("social_copy_variant_copied", {
        channel: activeChannel,
        lang: language,
        variant
      });
    } else {
      setStatus("failed");
    }

    window.setTimeout(() => setStatus("idle"), 1600);
  }

  async function copyRouteSkeleton() {
    const copied = await writeClipboard(routeSkeleton);

    if (copied) {
      setSkeletonCopyStatus("copied");
      track("template_copy_click", {
        label: "route_file_skeleton",
        length: routeSkeleton.length
      });
    } else {
      setSkeletonCopyStatus("failed");
    }

    window.setTimeout(() => setSkeletonCopyStatus("idle"), 1600);
  }

  return (
    <section className="execution-workbench" aria-label="Execution Workbench">
      <div className="execution-stage-rail" aria-label="Execution stages">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStageId;

          return (
            <button
              className={isActive ? "is-active" : ""}
              key={stage.id}
              type="button"
              onClick={() => selectStage(stage.id)}
            >
              <Icon aria-hidden="true" size={17} />
              <span>{stage.label}</span>
              <small>{stage.state}</small>
            </button>
          );
        })}
      </div>

      <div className="execution-layout">
        <article className="execution-stage-panel">
          <div className="execution-panel-kicker">
            <MousePointerClick aria-hidden="true" size={17} />
            <span>Active step</span>
          </div>
          <h2>{activeStage.title}</h2>
          <p>{activeStage.purpose}</p>

          <dl className="execution-state-list">
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

          <section className="execution-decision-strip" aria-label="Current decision">
            <div>
              <span>Current decision</span>
              <strong>{stageStatusOptions.find((option) => option.id === activeStageStatus)?.label}</strong>
              <p>{activeStatusDetail}</p>
            </div>
            <div className="execution-status-buttons">
              {stageStatusOptions.map((option) => (
                <button
                  className={option.id === activeStageStatus ? "is-active" : ""}
                  key={option.id}
                  type="button"
                  onClick={() => setStageStatus(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <div className="execution-panel-actions">
            <Link prefetch={false} className="primary-action" href={activeStage.href}>
              Open step
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <button
              className="secondary-action"
              type="button"
              onClick={() =>
                copyText(buildStagePacket(activeStage), "Stage copied", "template_copy_click", {
                  label: activeStage.id,
                  length: buildStagePacket(activeStage).length
                })
              }
            >
              <Copy aria-hidden="true" size={16} />
              {copyState}
            </button>
          </div>
        </article>

        <aside className="execution-event-panel" aria-label="Event logic">
          <div className="execution-panel-kicker">
            <FileCheck2 aria-hidden="true" size={17} />
            <span>Event logic</span>
          </div>
          <ul>
            <li>
              <strong>execution_workbench_view</strong>
              <span>Route-specific page view for the new workbench.</span>
            </li>
            <li>
              <strong>execution_stage_selected</strong>
              <span>Stage click, payload only stores the stage id.</span>
            </li>
            <li>
              <strong>social_copy_variant_copied</strong>
              <span>Social copy export, payload stores channel, language, and variant.</span>
            </li>
            <li>
              <strong>cta_click</strong>
              <span>Existing safe link event for marked actions.</span>
            </li>
          </ul>
        </aside>
      </div>

      <section className="execution-clickpath" aria-label="Click path">
        <div className="route-section-heading execution-heading">
          <span>Click path</span>
          <h2>Each click has one clear next state.</h2>
          <p>
            The site path now moves from project facts to research, coverage, Route File,
            and observable client progress without making payment the first decision.
          </p>
        </div>
        <div className="execution-path-grid">
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

      <section className="execution-output-grid" aria-label="Route File and module merge">
        <article className="execution-route-preview">
          <div className="execution-panel-kicker">
            <FileText aria-hidden="true" size={17} />
            <span>Route File preview</span>
          </div>
          <h2>Final file structure stays compact.</h2>
          <ul>
            {routeFilePreview.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="execution-route-skeleton">
            <strong>Route File skeleton</strong>
            <div>
              {stages.map((stage) => (
                <span key={stage.id}>
                  {stage.label}: {stageDecisions[stage.id]}
                </span>
              ))}
            </div>
            <button
              className="secondary-action"
              type="button"
              onClick={copyRouteSkeleton}
            >
              <Copy aria-hidden="true" size={16} />
              {skeletonCopyLabel}
            </button>
          </div>
        </article>

        <article className="execution-merge-panel">
          <div className="execution-panel-kicker">
            <GitMerge aria-hidden="true" size={17} />
            <span>Module merge</span>
          </div>
          <h2>Repeated modules get one owner.</h2>
          <div className="execution-merge-list">
            {moduleMerges.map((item) => (
              <div key={item.from}>
                <strong>{item.from}</strong>
                <p>{item.to}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="execution-social-panel" aria-label="Bilingual social copy">
        <div className="route-section-heading execution-heading">
          <span>Bilingual social copy</span>
          <h2>Convert public updates between English and Chinese.</h2>
          <p>
            These variants keep the same claim boundary: route decision, research
            process, visible artifact, and no unsupported growth promise.
          </p>
        </div>

        <div className="execution-social-controls">
          <div className="execution-segmented" aria-label="Social channel">
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
          <div className="execution-segmented is-language" aria-label="Language">
            {(["en", "zh"] as SocialLanguage[]).map((language) => (
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

        <div className="execution-copy-grid">
          <article>
            <span>{activeSocial.context}</span>
            <p>{activeSocialText}</p>
            <button
              className="primary-action"
              type="button"
              onClick={() => copySocialText(activeSocialText, "primary", activeLanguage)}
            >
              <Copy aria-hidden="true" size={16} />
              {primaryCopyLabel}
            </button>
          </article>

          <article>
            <span>{activeLanguage === "en" ? "Chinese pair" : "English pair"}</span>
            <p>{pairedSocialText}</p>
            <button
              className="secondary-action"
              type="button"
              onClick={() =>
                copySocialText(pairedSocialText, "paired", activeLanguage === "en" ? "zh" : "en")
              }
            >
              <Copy aria-hidden="true" size={16} />
              {pairCopyLabel}
            </button>
          </article>
        </div>
      </section>
    </section>
  );
}
