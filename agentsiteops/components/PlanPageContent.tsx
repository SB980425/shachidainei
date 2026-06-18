"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  ShieldCheck
} from "lucide-react";
import { ClientRouteStatePanel } from "@/components/ClientRouteStatePanel";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { PlanDraftStudio } from "@/components/PlanDraftStudio";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteProjectLifecycle } from "@/components/RouteProjectLifecycle";
import { RouteStageHeader } from "@/components/RouteStageHeader";

const pageCopy = {
  en: {
    heroEyebrow: "Plan Studio",
    heroTitle: "Fill in your project plan before asking for a Route File.",
    heroBody:
      "This is the missing customer entry point: write what you want to do, what exists, what is blocked, and what cannot be claimed. The page creates a preliminary route draft before manual intake or final delivery.",
    startDrafting: "Start drafting",
    riskTest: "Run free risk test",
    briefLabel: "What happens here",
    briefTitle: "A draft is not the final Route File.",
    briefItems: [
      "You can test the input flow without payment.",
      "Research carrier stays replaceable.",
      "Human review still gates the route."
    ],
    stageTitle: "Plan Draft is the first usable product step.",
    stageBody:
      "Fill one staged draft before the project becomes intake, scope, research, gate, Route File, or validation work.",
    bridgeEyebrow: "Plan context",
    continueIntake: "Continue to intake",
    lifecycleEyebrow: "Current state",
    lifecycleTitle: "Plan Studio is the first Route Project state.",
    lifecycleBody:
      "The page is not only a form. It creates the first project object that can later be reviewed, repaired, blocked, researched, and delivered.",
    clientStateTitle: "Plan Studio tells the visitor what happens before intake.",
    clientStateBody:
      "The draft, autosave, export, and copy actions are automatic. Acceptance, scope lock, and Route File judgment remain manual.",
    flowAria: "Plan Studio flow",
    boundaryEyebrow: "Boundary",
    boundaryTitle: "The page gives visitors a clear place to act.",
    boundaryBody:
      "Plan Studio sits before intake. It reduces confusion by separating preliminary draft, operator review, and final Route File delivery.",
    afterLabel: "After the draft",
    afterTitle: "Use the draft to decide whether manual intake is worth opening.",
    afterBody:
      "If the draft cannot name buyer, route, failure node, evidence gaps, rejected alternatives, validation channel, and stop rule, keep repairing the plan before submitting it.",
    retest: "Re-test idea risk"
  },
  zh: {
    heroEyebrow: "计划工作台",
    heroTitle: "先填写项目计划，再请求路线文件。",
    heroBody:
      "这里是客户进入项目的明确入口：写清想做什么、已经有什么、卡在哪里、哪些话不能声称。页面会先生成初步路线草稿，再决定是否进入人工提交或最终交付。",
    startDrafting: "开始填写计划",
    riskTest: "先做免费风险测试",
    briefLabel: "这里会发生什么",
    briefTitle: "草稿不是最终路线文件。",
    briefItems: [
      "不付款也可以测试填写流程。",
      "研究载体不会被固定在某一个平台。",
      "路线是否通过仍由人工审核把关。"
    ],
    stageTitle: "计划草稿是第一个可用产品步骤。",
    stageBody:
      "先完成一份分阶段草稿，再进入提交材料、锁定范围、研究运行、覆盖检查、路线文件或验证。",
    bridgeEyebrow: "计划上下文",
    continueIntake: "继续提交材料",
    lifecycleEyebrow: "当前状态",
    lifecycleTitle: "计划工作台是路线项目的第一个状态。",
    lifecycleBody:
      "这个页面不只是表单。它会创建第一个项目对象，后续才能被审核、修复、阻塞、研究和交付。",
    clientStateTitle: "计划工作台说明提交前会发生什么。",
    clientStateBody:
      "草稿、自动保存、导出和复制由网站自动完成。通过、锁定范围和路线文件判断仍然是人工步骤。",
    flowAria: "计划工作台流程",
    boundaryEyebrow: "边界",
    boundaryTitle: "页面要给访客一个明确可操作的位置。",
    boundaryBody:
      "计划工作台位于提交材料之前。它把初步草稿、人工审核和最终路线文件交付分开，减少客户不知道点哪里、填什么、等什么结果的问题。",
    afterLabel: "草稿之后",
    afterTitle: "用草稿判断是否值得开启人工提交。",
    afterBody:
      "如果草稿不能说清用户、路线、失败节点、证据缺口、被否决方案、验证渠道和停止规则，就先继续修复计划，不要直接提交。",
    retest: "重新测试想法风险"
  }
} satisfies Record<SiteLanguage, Record<string, string | string[]>>;

const flowRows = {
  en: [
    { label: "Browse", body: "Use the top path to confirm you are in the planning step." },
    { label: "Write", body: "Fill the project plan in plain language, one decision group at a time." },
    { label: "Repair", body: "Use missing-field prompts to add buyer, proof, blocker, and limits." },
    { label: "Read output", body: "Inspect route, gaps, rejected alternatives, 7-day path, and stop rule." },
    { label: "Continue", body: "Copy or download the brief, then submit only when the draft is specific." }
  ],
  zh: [
    { label: "浏览定位", body: "先看顶部路径，确认当前处在“计划”步骤。" },
    { label: "填写计划", body: "按一个决策组一个决策组填写，不需要专业术语。" },
    { label: "补齐缺口", body: "根据缺失提示补用户、证据、阻塞点和限制条件。" },
    { label: "读取输出", body: "检查选定路线、证据缺口、被否决方案、7 天路径和停止规则。" },
    { label: "继续提交", body: "复制或下载简报，只有草稿足够具体时再提交审核。" }
  ]
} satisfies Record<SiteLanguage, Array<{ label: string; body: string }>>;

const boundaryCards = {
  en: [
    {
      title: "Browser-local draft",
      body:
        "The page turns your fields into a preliminary route draft in the browser. It does not call an API or create a hidden research result.",
      Icon: ClipboardList
    },
    {
      title: "Operator review next",
      body:
        "A ready draft can be copied into intake so a person can accept, repair, block, or scope the route before research.",
      Icon: FileCheck2
    },
    {
      title: "Route File is later",
      body:
        "The final Route File still requires accepted evidence, rejected alternatives, a proof asset, validation channel, and stop rule.",
      Icon: FileText
    }
  ],
  zh: [
    {
      title: "浏览器本地草稿",
      body:
        "页面会在浏览器中把填写内容转成初步路线草稿。它不调用 API，也不会生成隐藏研究结果。",
      Icon: ClipboardList
    },
    {
      title: "下一步才是人工审核",
      body:
        "足够具体的草稿可以复制进提交材料，由人工判断通过、修复、阻塞或锁定研究范围。",
      Icon: FileCheck2
    },
    {
      title: "路线文件在后面",
      body:
        "最终路线文件仍需要已接受证据、被否决方案、证明资产、验证渠道和停止规则。",
      Icon: FileText
    }
  ]
} satisfies Record<SiteLanguage, Array<{ title: string; body: string; Icon: typeof ClipboardList }>>;

function text(value: string | string[]) {
  return Array.isArray(value) ? value.join(" ") : value;
}

export function PlanPageContent() {
  const [language] = usePreferredLanguage();
  const labels = pageCopy[language];

  return (
    <main className="page-main plan-page">
      <section className="frontstage-hero plan-hero">
        <div className="frontstage-hero-copy">
          <p className="eyebrow">{text(labels.heroEyebrow)}</p>
          <h1>{text(labels.heroTitle)}</h1>
          <p>{text(labels.heroBody)}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#plan-draft">
              <ClipboardList aria-hidden="true" size={17} />
              {text(labels.startDrafting)}
            </a>
            <Link prefetch={false} className="secondary-action" href="/idea-risk-test/">
              <Gauge aria-hidden="true" size={17} />
              {text(labels.riskTest)}
            </Link>
          </div>
        </div>

        <aside className="route-file-brief plan-brief" aria-label={text(labels.briefLabel)}>
          <span>{text(labels.briefLabel)}</span>
          <h2>{text(labels.briefTitle)}</h2>
          <ul>
            {(labels.briefItems as string[]).map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <RouteStageHeader
        current="plan"
        title={text(labels.stageTitle)}
        body={text(labels.stageBody)}
        language={language}
      />

      <RouteFlowBridge
        current="plan"
        eyebrow={text(labels.bridgeEyebrow)}
        nextHref="/intake/"
        nextLabel={text(labels.continueIntake)}
        language={language}
      />

      <RouteProjectLifecycle
        current="plan"
        eyebrow={text(labels.lifecycleEyebrow)}
        title={text(labels.lifecycleTitle)}
        body={text(labels.lifecycleBody)}
        language={language}
      />

      <ClientRouteStatePanel
        current="plan"
        title={text(labels.clientStateTitle)}
        body={text(labels.clientStateBody)}
        compact
        language={language}
      />

      <section className="plan-flow-strip" aria-label={text(labels.flowAria)}>
        {flowRows[language].map((item, index) => (
          <article key={item.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{item.label}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="route-foundation-section plan-boundary-section">
        <div className="route-section-heading">
          <span>{text(labels.boundaryEyebrow)}</span>
          <h2>{text(labels.boundaryTitle)}</h2>
          <p>{text(labels.boundaryBody)}</p>
        </div>
        <div className="plan-boundary-grid">
          {boundaryCards[language].map((item) => {
            const Icon = item.Icon;

            return (
              <article key={item.title}>
                <Icon aria-hidden="true" size={21} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div id="plan-draft">
        <PlanDraftStudio />
      </div>

      <section className="route-final-cta plan-final-cta">
        <div>
          <span>{text(labels.afterLabel)}</span>
          <h2>{text(labels.afterTitle)}</h2>
          <p>{text(labels.afterBody)}</p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="secondary-action" href="/idea-risk-test/">
            <Gauge aria-hidden="true" size={17} />
            {text(labels.retest)}
          </Link>
          <Link prefetch={false} className="primary-action" href="/intake/">
            <ClipboardList aria-hidden="true" size={17} />
            {text(labels.continueIntake)}
          </Link>
        </div>
      </section>
    </main>
  );
}
