"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Gauge, SearchCheck, ShieldCheck } from "lucide-react";
import { HomeIdeaStart } from "@/components/HomeIdeaStart";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";

const copy = {
  en: {
    eyebrow: "Free test window",
    title: "Write one messy idea. Get the first route diagnosis on this page.",
    body:
      "The current version is no longer a page directory. It is a first-pass idea triage surface: one rough description becomes a project read, failure node, missing evidence, 7-day test, and stop rule before any plan.",
    promiseA: "One input, no professional brief required",
    promiseB: "Browser-local draft; no hidden API research",
    promiseC: "No success, revenue, traffic, or buyer-demand claim",
    basisEyebrow: "Decision basis",
    basisTitle: "The output must be different from a generic AI answer.",
    basisBody:
      "A useful first pass is not a motivational plan. It must show what the system inferred, which assumption can fail first, what proof is missing, and when to stop.",
    validationEyebrow: "14-day validation",
    validationTitle: "Keep the project only if the first evidence appears.",
    validationBody:
      "The site should help decide whether an idea deserves more work. It should not create a larger plan when the buyer, proof, channel, or boundary is still missing.",
    sourceLabel: "Reference sources used for risk checks",
    routeFileTitle: "If the idea survives, it becomes a Route File.",
    routeFileBody:
      "The next artifact is still small: selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
    planAction: "Open editable plan",
    sampleAction: "Inspect Route File sample"
  },
  zh: {
    eyebrow: "免费测试窗口",
    title: "只写一个混乱想法，先在首页看到第一版路线诊断。",
    body:
      "当前版本不再把首页当成页面目录。它只做第一轮想法排查：一段粗糙描述会变成项目理解、失败节点、证据缺口、7 天验证动作和停止规则，然后才决定要不要继续计划。",
    promiseA: "只需要一个输入，不要求专业项目书",
    promiseB: "浏览器本地草稿，不伪装隐藏 API 研究",
    promiseC: "不承诺成功、收入、流量或买家需求",
    basisEyebrow: "判断依据",
    basisTitle: "输出必须区别于随便问一个通用 AI。",
    basisBody:
      "有价值的第一版不是鼓励式计划。它必须显示系统理解了什么、哪个假设最可能先失败、缺什么证据、什么时候该停止。",
    validationEyebrow: "14 天验证",
    validationTitle: "只有出现第一批证据，项目才值得继续。",
    validationBody:
      "网站的作用是判断想法是否值得继续投入。买家、证明、渠道或边界仍然不清楚时，不应该生成更大的计划。",
    sourceLabel: "风险判断参考来源",
    routeFileTitle: "如果想法通过第一轮，再进入 Route File。",
    routeFileBody:
      "下一步产物仍然要小：选定路线、被否方案、证据账本、第一证明资产、验证渠道和停止规则。",
    planAction: "打开可编辑计划",
    sampleAction: "查看 Route File 样例"
  }
} satisfies Record<SiteLanguage, Record<string, string>>;

const basisCards = {
  en: [
    {
      title: "It translates messy language",
      body: "The user can write in plain speech. The system extracts buyer, offer, proof, channel, constraint, and missing fields."
    },
    {
      title: "It challenges the first weak node",
      body: "The output names the most likely failure point instead of expanding the idea into more features."
    },
    {
      title: "It gives a stop condition",
      body: "Every route needs a test window and a condition for continue, repair, pivot, or stop."
    }
  ],
  zh: [
    {
      title: "它先翻译混乱表达",
      body: "用户可以说白话。系统负责提取买家、交付物、证明、渠道、约束和缺失字段。"
    },
    {
      title: "它先挑战最弱节点",
      body: "输出要指出最可能先失败的地方，而不是把想法扩写成更多功能。"
    },
    {
      title: "它必须给出停止条件",
      body: "每条路线都要有测试窗口，以及继续、修复、转向或停止的条件。"
    }
  ]
} satisfies Record<SiteLanguage, Array<{ title: string; body: string }>>;

const validationRows = {
  en: [
    "Day 0: write the rough idea once and freeze the current interpretation.",
    "48 hours: repair the highest-risk missing fact before adding features.",
    "Day 7: test one channel or proof asset and record replies, objections, or silence.",
    "Day 14: continue, repair, pivot, or stop. Do not scale without evidence."
  ],
  zh: [
    "第 0 天：只写一次粗糙想法，并冻结当前系统理解。",
    "48 小时：先修复最高风险缺口，不增加功能。",
    "第 7 天：测试一个渠道或证明资产，记录回复、反对意见或沉默。",
    "第 14 天：继续、修复、转向或停止。没有证据前不扩张。"
  ]
} satisfies Record<SiteLanguage, string[]>;

const sourceUses: Record<SiteLanguage, Record<string, string>> = {
  en: Object.fromEntries(ideaRiskSources.map((source) => [source.id, source.useFor])),
  zh: {
    "cb-insights-failure-reasons": "用于识别缺少市场需求、现金压力、法律风险、竞争、定价、团队和时机等失败模式。",
    "lean-startup-validated-learning": "用于把想法拆成可测试假设、可衡量检查点，以及继续或转向的决策。",
    "yc-talk-to-users": "用于检查目标用户、痛点和第一验证渠道是否具体到可以行动。",
    "startup-genome-premature-scaling": "用于检查是否在核心证据出现前过早招聘、投放、扩渠道、扩内容或扩产品。",
    "steve-blank-customer-development": "用于把创业理解为寻找可重复商业模式，而不是执行一个未经验证的计划。"
  }
};

const routeFileParts = {
  en: ["Selected route", "Rejected alternatives", "Evidence ledger", "First proof asset", "Validation channel", "Stop rule"],
  zh: ["选定路线", "被否方案", "证据账本", "第一证明资产", "验证渠道", "停止规则"]
} satisfies Record<SiteLanguage, string[]>;

export function HomePageContent() {
  const [language] = usePreferredLanguage();
  const labels = copy[language];

  return (
    <>
      <section className="ia-hero ia-hero-workbench home-core-hero">
        <div className="ia-hero-copy home-core-copy">
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

      <section className="route-foundation-section ia-section home-core-basis">
        <div className="route-section-heading">
          <span>{labels.basisEyebrow}</span>
          <h2>{labels.basisTitle}</h2>
          <p>{labels.basisBody}</p>
        </div>
        <div className="home-core-card-grid">
          {basisCards[language].map((item) => (
            <article key={item.title}>
              <SearchCheck aria-hidden="true" size={18} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <strong className="home-core-source-label">{labels.sourceLabel}</strong>
        <div className="home-core-source-rail" aria-label={labels.sourceLabel}>
          {ideaRiskSources.map((source) => (
            <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
              <strong>{source.publisher}</strong>
              <span>{sourceUses[language][source.id] ?? source.useFor}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section home-core-validation">
        <div>
          <span>{labels.validationEyebrow}</span>
          <h2>{labels.validationTitle}</h2>
          <p>{labels.validationBody}</p>
          <ol>
            {validationRows[language].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <aside className="home-core-route-file">
          <FileText aria-hidden="true" size={24} />
          <h3>{labels.routeFileTitle}</h3>
          <p>{labels.routeFileBody}</p>
          <ul>
            {routeFileParts[language].map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={15} />
                {item}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              {labels.planAction}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              {labels.sampleAction}
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
