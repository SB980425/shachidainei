"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, SearchCheck, ShieldCheck } from "lucide-react";
import { IdeaRiskTestStudio } from "@/components/IdeaRiskTestStudio";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";

const pageCopy = {
  en: {
    eyebrow: "Free test window",
    title: "Paste the project idea. Let the system challenge it before any plan.",
    body:
      "This page is the first working surface. It does not need polished product language. It takes one rough description, freezes the current interpretation, shows what AI may misunderstand, asks the smallest repair questions, and returns continue, repair, or stop before any plan.",
    writeAction: "Write the idea",
    asideTitle: "The system takes the first pass",
    asideBody:
      "Write the messy project once. The page should reduce subjective drift by forcing buyer, proof, channel, boundary, and stop-rule checks before any route is treated as real.",
    flowTitle: "How the system takes over the first pass.",
    flowBody:
      "The browser-local test extracts project signals and compares them to a visible failure-node library. The result is a decision checkpoint, not a guarantee and not a polished opinion.",
    sourceTitle: "Reference sources are visible.",
    sourceBody:
      "The test uses searched and registered startup failure sources as a pattern library. These sources are useful for asking better questions, not for declaring certainty about one project.",
    notClaimTitle: "What this page will not claim.",
    continueAction: "Continue only after reading the map"
  },
  zh: {
    eyebrow: "免费测试窗口",
    title: "粘贴项目想法。先让系统挑战它，再进入任何计划。",
    body:
      "这是第一个可用工作区。你不需要会写专业产品语言。页面会读取一段粗略描述，冻结当前理解，指出 AI 可能误读的位置，提出最少修复问题，并在计划前返回继续、修复或停止。",
    writeAction: "填写想法",
    asideTitle: "系统先接管第一轮",
    asideBody:
      "只写一次混乱项目。页面通过买家、证明、渠道、边界和停止规则检查，减少主观漂移，避免把不成立的路线当成真实方向。",
    flowTitle: "系统如何接管第一轮排查。",
    flowBody:
      "浏览器本地测试会提取项目信号，并与可见的失败节点库对照。结果是一个决策检查点，不是保证，也不是包装后的主观建议。",
    sourceTitle: "参考来源是可见的。",
    sourceBody:
      "测试使用已登记的创业失败与验证方法来源作为模式库。这些来源用于提出更好的问题，不用于断言某个具体项目一定成功或失败。",
    notClaimTitle: "这个页面不会声称什么。",
    continueAction: "读完风险图后再继续"
  }
} satisfies Record<SiteLanguage, Record<string, string>>;

const flowRows = {
  en: [
    {
      label: "Write once",
      body: "Paste one messy project description. The user does not need to know the correct product or startup vocabulary."
    },
    {
      label: "System takes over",
      body: "The page extracts signals, marks what AI may misunderstand, and asks only the minimum repair questions."
    },
    {
      label: "Decide",
      body: "Continue, repair, or stop before Plan Studio. Do not add more features just because the idea feels possible."
    }
  ],
  zh: [
    {
      label: "只写一次",
      body: "粘贴一段混乱项目描述即可。用户不需要知道正确的产品、创业或技术术语。"
    },
    {
      label: "系统接管",
      body: "页面提取信号，标记 AI 可能误解的位置，并只提出最少的修复问题。"
    },
    {
      label: "做出判断",
      body: "在进入计划页前先判断继续、修复或停止。不要因为想法看起来可行就继续加功能。"
    }
  ]
} satisfies Record<SiteLanguage, Array<{ label: string; body: string }>>;

const notClaims = {
  en: [
    "It is not a success forecast.",
    "It is not investment, legal, financial, medical, or regulated advice.",
    "It does not prove product-market fit, traffic, payment, or buyer demand.",
    "It does not run hidden API research or store raw project text on the server.",
    "It does not let subjective preference override missing buyer, proof, channel, or stop-rule evidence."
  ],
  zh: [
    "它不是成功预测。",
    "它不是投资、法律、金融、医疗或受监管建议。",
    "它不能证明产品市场匹配、流量、付款或买家需求。",
    "它不会运行隐藏 API 研究，也不会把原始项目文本存到服务器。",
    "它不会让主观偏好覆盖缺失的买家、证明、渠道或停止规则证据。"
  ]
} satisfies Record<SiteLanguage, string[]>;

const sourceCopy: Record<SiteLanguage, Record<string, { name: string; useFor: string }>> = {
  en: Object.fromEntries(ideaRiskSources.map((source) => [source.id, { name: source.name, useFor: source.useFor }])),
  zh: {
    "cb-insights-failure-reasons": {
      name: "创业失败的主要原因",
      useFor: "用于检查市场需求不足、现金压力、法律风险、竞争、定价、团队和时机等失败模式。"
    },
    "lean-startup-validated-learning": {
      name: "验证式学习与构建-衡量-学习",
      useFor: "用于把想法转成可测试假设、可衡量检查点，以及继续或转向的决策。"
    },
    "yc-talk-to-users": {
      name: "如何与用户交谈",
      useFor: "用于检查目标用户、痛点和第一验证渠道是否足够具体。"
    },
    "startup-genome-premature-scaling": {
      name: "过早扩张为什么会导致失败",
      useFor: "用于在招聘、投放、多渠道增长、大批量内容或产品扩张前做检查。"
    },
    "steve-blank-customer-development": {
      name: "客户发展方法",
      useFor: "用于把创业理解为寻找可重复商业模型，而不是执行未经验证的计划。"
    }
  }
};

export function IdeaRiskTestPageContent() {
  const [language] = usePreferredLanguage();
  const labels = pageCopy[language];

  return (
    <>
      <section className="gate-hero idea-risk-hero ia-risk-hero">
        <div>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p>{labels.body}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#idea-risk-test">
              <ClipboardList aria-hidden="true" size={17} />
              {labels.writeAction}
            </a>
          </div>
        </div>
        <aside className="decision-card">
          <strong>{labels.asideTitle}</strong>
          <p>{labels.asideBody}</p>
        </aside>
      </section>

      <IdeaRiskTestStudio />

      <section className="gate-section idea-risk-flow-section ia-risk-flow">
        <div className="section-head">
          <h2>{labels.flowTitle}</h2>
          <p>{labels.flowBody}</p>
        </div>
        <div className="idea-risk-flow-grid">
          {flowRows[language].map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split idea-risk-source-boundary" id="source-basis">
        <div>
          <h2>{labels.sourceTitle}</h2>
          <p>{labels.sourceBody}</p>
          <div className="idea-risk-source-ledger">
            {ideaRiskSources.map((source) => {
              const sourceLabels = sourceCopy[language][source.id] ?? sourceCopy.en[source.id];

              return (
                <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                  <SearchCheck aria-hidden="true" size={17} />
                  <span>{source.publisher}</span>
                  <strong>{sourceLabels.name}</strong>
                  <small>{sourceLabels.useFor}</small>
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h2>{labels.notClaimTitle}</h2>
          <ul className="compact-list">
            {notClaims[language].map((item) => (
              <li key={item}>
                <ShieldCheck aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <CheckCircle2 aria-hidden="true" size={17} />
              {labels.continueAction}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
