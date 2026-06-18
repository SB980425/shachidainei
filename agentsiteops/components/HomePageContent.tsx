"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Gauge,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { HomeIdeaStart } from "@/components/HomeIdeaStart";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { RouteExampleCaseGrid } from "@/components/RouteExampleCaseGrid";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";

const copy = {
  en: {
    eyebrow: "One input first",
    title: "Put the rough idea here. See the first route diagnosis before you move.",
    body:
      "AgentSiteOps is not a menu of research pages. The product starts when a visitor writes one unclear project idea and receives a first interpretation, failure-node warning, evidence gap, and next route.",
    promiseA: "No setup vocabulary required.",
    promiseB: "No hidden research or server-side idea storage.",
    promiseC: "No success, revenue, traffic, or buyer-demand guarantee.",
    processEyebrow: "What happens after typing",
    processTitle: "The site should take over the first pass.",
    examplesEyebrow: "What this looks like",
    examplesTitle: "A rough sentence should become a route, evidence gap, and stop rule.",
    examplesBody:
      "These examples show the expected product behavior. The system does not praise the idea first; it translates the idea into a reviewable route object.",
    sourceEyebrow: "Why this is different from asking any AI",
    sourceTitle: "The answer is useful only when the decision trail is visible.",
    outputEyebrow: "Where it can go next",
    outputTitle: "If the idea survives the first pass, it becomes an editable route draft.",
    outputBody:
      "The next useful page is Plan Studio. It receives the homepage interpretation and lets the visitor repair fields instead of starting from a blank form.",
    planAction: "Open editable plan",
    sampleAction: "Inspect Route File sample"
  },
  zh: {
    eyebrow: "先填一个输入框",
    title: "把粗略想法写在这里。跳转之前先看第一轮路线判断。",
    body:
      "AgentSiteOps 不是一堆研究页面菜单。这个产品从一个动作开始：客户写下一段不清晰的项目想法，然后立即看到系统理解、失败节点、证据缺口和下一步路线。",
    promiseA: "不需要懂产品、创业或技术术语。",
    promiseB: "不运行隐藏研究，也不把想法存到服务器。",
    promiseC: "不承诺成功、收入、流量或买家需求。",
    processEyebrow: "输入后发生什么",
    processTitle: "网站必须接管第一轮排查。",
    examplesEyebrow: "示例",
    examplesTitle: "一句粗略想法，应该变成路线、证据缺口和停止规则。",
    examplesBody:
      "这些示例展示产品应该怎样工作。系统不是先夸想法，而是把想法翻译成可审查的路线对象。",
    sourceEyebrow: "为什么不是随便问 AI",
    sourceTitle: "答案本身不稀缺，可见的决策轨迹才有价值。",
    outputEyebrow: "下一步去哪里",
    outputTitle: "如果想法通过第一轮，它会进入可编辑路线草稿。",
    outputBody:
      "下一页是 Plan Studio。它会接收首页解释出来的字段，让客户修改，而不是重新面对空白表单。",
    planAction: "打开可编辑计划",
    sampleAction: "查看 Route File 样例"
  }
} satisfies Record<SiteLanguage, Record<string, string>>;

const processRows = {
  en: [
    {
      label: "1. Interpret",
      body: "Extract the likely project, buyer, first offer, proof, channel, constraints, and missing fields."
    },
    {
      label: "2. Challenge",
      body: "Name the first likely failure node and the evidence needed before more planning."
    },
    {
      label: "3. Move",
      body: "Continue to an imported editable plan, open the full risk map, or stop and repair the idea."
    }
  ],
  zh: [
    {
      label: "1. 理解",
      body: "提取可能的项目、用户、首个交付、证明资产、渠道、约束和缺失字段。"
    },
    {
      label: "2. 挑战",
      body: "指出第一个可能失败节点，以及继续计划前必须补的证据。"
    },
    {
      label: "3. 移动",
      body: "带着已识别字段进入计划页，查看完整风险图，或者先停止修复想法。"
    }
  ]
} satisfies Record<SiteLanguage, Array<{ label: string; body: string }>>;

const proofRows = {
  en: [
    {
      label: "Evidence used, not guessed",
      body: "The page shows what it inferred, what is missing, what route it selected, and what still needs evidence before a roadmap."
    },
    {
      label: "Market signals are context, not proof",
      body: "Failure nodes are tied to startup failure, validated learning, user-discovery, premature-scaling, and customer-development sources."
    },
    {
      label: "What the buyer receives is a route file, not a score",
      body: "If buyer, proof, channel, rights, or validation remain vague, the correct output is repair or stop, not a bigger plan."
    }
  ],
  zh: [
    {
      label: "决策轨迹",
      body: "页面会显示系统理解了什么、缺什么、选了哪条路线，以及哪些判断仍需要证据。"
    },
    {
      label: "来源依据",
      body: "失败节点对应创业失败、验证式学习、用户访谈、过早扩张和客户发展等公开来源。"
    },
    {
      label: "停止规则",
      body: "如果用户、证据、渠道、权利或验证仍然模糊，正确输出是修复或停止，而不是扩展计划。"
    }
  ]
} satisfies Record<SiteLanguage, Array<{ label: string; body: string }>>;

const contractRows = {
  en: ["Selected route", "Rejected alternatives", "Evidence ledger", "First proof asset", "Validation channel", "Stop rule"],
  zh: ["选定路线", "被否替代方案", "证据账本", "第一证明资产", "验证渠道", "停止规则"]
};

const sourceUses: Record<SiteLanguage, Record<string, string>> = {
  en: Object.fromEntries(ideaRiskSources.map((source) => [source.id, source.useFor])),
  zh: {
    "cb-insights-failure-reasons": "用于识别缺少市场需求、现金压力、法律风险、竞争、定价、团队和时机等失败模式。",
    "lean-startup-validated-learning": "用于把想法拆成可测试假设、可衡量检查点，以及继续或转向的决策。",
    "yc-talk-to-users": "用于检查目标用户、痛点和第一验证渠道是否具体到可以行动。",
    "startup-genome-premature-scaling": "用于检查是否在核心证据出现前过早招聘、投放、扩渠道、扩内容或扩产品。",
    "steve-blank-customer-development": "用于把创业理解为寻找可重复商业模型，而不是执行一个未经验证的计划。"
  }
};

export function HomePageContent() {
  const [language] = usePreferredLanguage();
  const labels = copy[language];

  return (
    <>
      <section className="ia-hero ia-hero-workbench">
        <div className="ia-hero-copy">
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p>{labels.body}</p>
          <ul className="ia-hero-points">
            {[labels.promiseA, labels.promiseB, labels.promiseC].map((item, index) => {
              const Icon = index === 0 ? CheckCircle2 : index === 1 ? ShieldCheck : Gauge;

              return (
                <li key={item}>
                  <Icon aria-hidden="true" size={16} />
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
        <HomeIdeaStart />
      </section>

      <section className="route-foundation-section ia-section ia-process-section">
        <div className="route-section-heading">
          <span>{labels.processEyebrow}</span>
          <h2>{labels.processTitle}</h2>
        </div>
        <div className="ia-process-grid">
          {processRows[language].map((item) => (
            <article key={item.label}>
              <Gauge aria-hidden="true" size={18} />
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section ia-example-section">
        <div className="route-section-heading">
          <span>{labels.examplesEyebrow}</span>
          <h2>{labels.examplesTitle}</h2>
          <p>{labels.examplesBody}</p>
        </div>
        <RouteExampleCaseGrid />
      </section>

      <section className="route-foundation-section ia-section ia-proof-section">
        <div className="route-section-heading">
          <span>{labels.sourceEyebrow}</span>
          <h2>{labels.sourceTitle}</h2>
        </div>
        <div className="ia-proof-grid">
          {proofRows[language].map((item) => (
            <article key={item.label}>
              <SearchCheck aria-hidden="true" size={18} />
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="ia-source-ticker" aria-label="Reference basis">
          {ideaRiskSources.map((source) => (
            <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
              <strong>{source.publisher}</strong>
              <span>{sourceUses[language][source.id] ?? source.useFor}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section ia-output-section">
        <div>
          <span>{labels.outputEyebrow}</span>
          <h2>{labels.outputTitle}</h2>
          <p>{labels.outputBody}</p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              {labels.planAction}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              {labels.sampleAction}
            </Link>
            <Link prefetch={false} className="secondary-action" href="/evidence/">
              {language === "zh" ? "查看证据库" : "Evidence library"}
            </Link>
          </div>
        </div>
        <div className="ia-contract-card">
          <FileText aria-hidden="true" size={24} />
          <h3>Route File</h3>
          <ul>
            {contractRows[language].map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={15} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
