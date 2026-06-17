"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Gauge,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { HomeIdeaStart } from "@/components/HomeIdeaStart";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";

const copy = {
  en: {
    heroEyebrow: "Free idea risk test",
    heroTitle: "Write the idea first. The site should prove why the next step is worth doing.",
    heroBody:
      "AgentSiteOps is not a page directory and not a hidden research promise. The useful first action is one input: describe the project, then receive a risk map, evidence gaps, time checkpoints, and the next route decision.",
    heroPoints: [
      "One clear input instead of scattered forms.",
      "Failure nodes are mapped against a visible source basis.",
      "No traffic, revenue, payment, or automatic research guarantee."
    ],
    whyEyebrow: "Why fill it in",
    whyTitle: "The page must make the input feel useful before asking for effort.",
    whyBody:
      "The test is designed for unclear early projects. It turns scattered project text into a decision surface: what may fail, what evidence is missing, and what should happen within a defined time window.",
    credibilityEyebrow: "Credibility model",
    credibilityTitle: "The output is only as strong as the evidence state behind each claim.",
    credibilityBody:
      "AgentSiteOps should not pretend to be more correct because it uses AI. Its credibility comes from traceable inputs, source status, route rejection, and explicit stop rules.",
    sourceEyebrow: "Reference basis",
    sourceTitle: "The advice is a reference map, not a guess.",
    sourceBody:
      "The failure-node library is grounded in public startup failure patterns, validated learning, user discovery, premature scaling research, and customer development methods. These sources guide questions; they do not prove one project will succeed.",
    advantageEyebrow: "Competitive edge",
    advantageTitle: "A strong free AI can answer. AgentSiteOps must audit the decision.",
    advantageBody:
      "A general model can produce similar-sounding advice if the prompt is good. The defensible product is the repeatable decision system around the answer: what was used, what was rejected, what remains unproven, and when to stop.",
    pathEyebrow: "Main path",
    pathTitle: "There is one working path. Other pages are reference material.",
    pathBody:
      "The public site should behave like a guided product, not a menu. A new visitor should understand that the next action is always the same: start with the idea input.",
    outputEyebrow: "Output contract",
    outputTitle: "The final thing is a Route File, not a loose suggestion.",
    outputBody:
      "A valid output must preserve the selected path, rejected options, source status, first proof asset, validation channel, and stop rule. Anything weaker stays in test or repair state.",
    contractTitle: "Route File must include",
    sample: "Inspect sample output",
    launchKit: "Launch Kit reference",
    finalEyebrow: "Default next action",
    finalTitle: "Start with one idea. Do not browse the method pages first.",
    finalBody:
      "If the project cannot name buyer, proof, channel, source boundary, and review date, the correct state is still test or repair.",
    finalAction: "Start free test"
  },
  zh: {
    heroEyebrow: "免费想法风险测试",
    heroTitle: "先写想法。网站必须证明下一步为什么值得做。",
    heroBody:
      "AgentSiteOps 不是页面目录，也不是隐藏研究承诺。真正有用的第一步只有一个：描述项目，然后得到风险图、证据缺口、时间节点和下一步路线决策。",
    heroPoints: [
      "一个清晰输入，而不是分散表单。",
      "失败节点必须对应可见来源依据。",
      "不承诺流量、收入、付款、自动研究或确定成功。"
    ],
    whyEyebrow: "为什么要填写",
    whyTitle: "先让用户看见输入的价值，再要求用户投入精力。",
    whyBody:
      "这个测试面向早期不清晰项目。它把零散项目文本变成决策界面：哪里可能失败、缺什么证据、什么时间点应该继续、修复或停止。",
    credibilityEyebrow: "可信度模型",
    credibilityTitle: "输出强度只取决于每条判断背后的证据状态。",
    credibilityBody:
      "AgentSiteOps 不能因为使用 AI 就显得更权威。可信度来自可追踪输入、来源状态、被否路线、证据缺口和明确停止规则。",
    sourceEyebrow: "参考依据",
    sourceTitle: "建议是参考地图，不是凭空猜测。",
    sourceBody:
      "失败节点库来自公开创业失败模式、验证学习、用户访谈、过早扩张研究和客户发展方法。这些来源用于提出更好的问题，不能证明某个项目一定成功。",
    advantageEyebrow: "竞品差异",
    advantageTitle: "强大的免费 AI 可以回答问题；AgentSiteOps 必须审计决策。",
    advantageBody:
      "如果提示词足够好，通用模型可能给出相似建议。真正可防守的产品不是答案本身，而是答案周围的决策系统：用了什么、否掉什么、仍未证明什么、什么时候停止。",
    pathEyebrow: "主路径",
    pathTitle: "只有一条工作路径。其他页面都是参考材料。",
    pathBody:
      "公开网站应该像一个引导式产品，而不是菜单。新访客必须知道下一步始终相同：先从想法输入开始。",
    outputEyebrow: "输出契约",
    outputTitle: "最终交付是 Route File，不是松散建议。",
    outputBody:
      "有效输出必须保留选定路线、被否选项、来源状态、第一证明资产、验证渠道和停止规则。更弱的输出只能停留在测试或修复状态。",
    contractTitle: "Route File 必须包含",
    sample: "查看输出样例",
    launchKit: "Launch Kit 参考",
    finalEyebrow: "默认下一步",
    finalTitle: "从一个想法开始，不要先浏览方法页。",
    finalBody:
      "如果项目无法说清买家、证据、渠道、来源边界和复盘日期，正确状态仍然是测试或修复。",
    finalAction: "开始免费测试"
  }
} satisfies Record<SiteLanguage, Record<string, string | string[]>>;

const whyFillCards = {
  en: [
    {
      title: "Evidence used, not guessed",
      body:
        "The first input can be messy. The site extracts useful signals and shows what is missing instead of forcing the visitor through many fields."
    },
    {
      title: "What the buyer receives is a route file, not a score",
      body:
        "The output is not a decorative confidence score. It must preserve the route, rejected alternatives, evidence status, proof asset, validation channel, and stop rule."
    },
    {
      title: "Market signals are context, not proof",
      body:
        "Search demand, public examples, trend reports, and market research can shape questions, but they do not prove buyer response, payment, or product-market fit."
    }
  ],
  zh: [
    {
      title: "使用证据，而不是凭感觉猜",
      body:
        "第一段输入可以很乱。网站先提取有用信号并指出缺失内容，而不是让用户被很多字段卡住。"
    },
    {
      title: "客户收到的是路线文件，不是分数",
      body:
        "输出不能只是一个好看的信心分。它必须保留选定路线、被否路线、证据状态、证明资产、验证渠道和停止规则。"
    },
    {
      title: "市场信号只是上下文，不是证明",
      body:
        "搜索需求、公开案例、趋势报告和市场研究可以帮助提问，但不能证明买家回应、付款或产品市场匹配。"
    }
  ]
};

const credibilityRules = {
  en: [
    { label: "Input completeness", body: "Buyer, offer, proof asset, channel, constraints, and validation window must be visible." },
    { label: "Evidence class", body: "First-party proof outranks public market context; unsupported claims stay low confidence." },
    { label: "Decision effect", body: "Every claim must change one route choice, rejected alternative, proof asset, or stop rule." },
    { label: "Manual review state", body: "Browser output is a reference map until a human accepts, repairs, blocks, or rejects delivery." }
  ],
  zh: [
    { label: "输入完整度", body: "必须看见买家、交付物、证明资产、渠道、约束和验证窗口。" },
    { label: "证据等级", body: "第一方证据高于公开市场上下文；无来源判断只能低置信。" },
    { label: "决策影响", body: "每条判断必须影响路线选择、被否方案、证明资产或停止规则。" },
    { label: "人工审核状态", body: "浏览器输出只是参考地图，直到人工判定通过、修复、阻塞或不交付。" }
  ]
};

const advantageCards = {
  en: [
    {
      title: "General AI gives an answer",
      body:
        "It can summarize, brainstorm, and reason from a prompt. This is useful but often collapses weak evidence into confident language."
    },
    {
      title: "AgentSiteOps gives an auditable route object",
      body:
        "The output must expose selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule."
    },
    {
      title: "The advantage is process memory",
      body:
        "A project can move from idea to plan to review to output without losing what was accepted, rejected, missing, or blocked."
    }
  ],
  zh: [
    {
      title: "通用 AI 给出答案",
      body:
        "它可以总结、发散和推理。这个能力有价值，但容易把薄弱证据包装成很自信的语言。"
    },
    {
      title: "AgentSiteOps 给出可审计路线对象",
      body:
        "输出必须暴露选定路线、被否方案、证据账本、第一证明资产、验证渠道和停止规则。"
    },
    {
      title: "优势是流程记忆",
      body:
        "项目可以从想法、计划、审核走到输出，而不会丢失哪些已接受、已否决、缺失或被阻塞。"
    }
  ]
};

const routeFileContract = {
  en: ["Selected route", "Rejected alternatives", "Evidence ledger", "First proof asset", "Validation channel", "Stop rule"],
  zh: ["选定路线", "被否替代方案", "证据账本", "第一证明资产", "验证渠道", "停止规则"]
};

const pathSteps = {
  en: [
    { label: "1. Idea", body: "Paste one rough project description." },
    { label: "2. Risk map", body: "See likely failure nodes, evidence gaps, and source basis." },
    { label: "3. Plan", body: "Convert the risk map into a narrow project route." },
    { label: "4. Review", body: "Decide ready, repair, blocked, or not-delivery before execution." },
    { label: "5. Route File", body: "Inspect one selected route with rejected alternatives and a stop rule." }
  ],
  zh: [
    { label: "1. 想法", body: "粘贴一段粗略项目描述。" },
    { label: "2. 风险图", body: "查看可能失败节点、证据缺口和来源依据。" },
    { label: "3. 计划", body: "把风险图转换成一条窄项目路线。" },
    { label: "4. 审核", body: "执行前判断通过、修复、阻塞或不交付。" },
    { label: "5. Route File", body: "查看包含被否方案和停止规则的选定路线。" }
  ]
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
      <section className="ia-hero">
        <div className="ia-hero-copy">
          <p className="eyebrow">{labels.heroEyebrow}</p>
          <h1>{labels.heroTitle}</h1>
          <p>{labels.heroBody}</p>
          <ul className="ia-hero-points">
            {(labels.heroPoints as string[]).map((item, index) => {
              const Icon = index === 0 ? CheckCircle2 : index === 1 ? SearchCheck : ShieldCheck;

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

      <section className="route-foundation-section ia-section">
        <div className="route-section-heading">
          <span>{labels.whyEyebrow}</span>
          <h2>{labels.whyTitle}</h2>
          <p>{labels.whyBody}</p>
        </div>
        <div className="ia-card-grid">
          {whyFillCards[language].map((item) => (
            <article key={item.title}>
              <Gauge aria-hidden="true" size={19} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section ia-credibility-section">
        <div className="route-section-heading">
          <span>{labels.credibilityEyebrow}</span>
          <h2>{labels.credibilityTitle}</h2>
          <p>{labels.credibilityBody}</p>
        </div>
        <div className="ia-credibility-grid">
          {credibilityRules[language].map((item, index) => (
            <article key={item.label}>
              <div className="ia-confidence-meter" aria-hidden="true">
                <i style={{ width: `${92 - index * 14}%` }} />
              </div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section ia-source-section">
        <div className="route-section-heading">
          <span>{labels.sourceEyebrow}</span>
          <h2>{labels.sourceTitle}</h2>
          <p>{labels.sourceBody}</p>
        </div>
        <div className="ia-source-grid">
          {ideaRiskSources.map((source) => (
            <article key={source.id}>
              <span>{source.publisher}</span>
              <h3>{source.name}</h3>
              <p>{sourceUses[language][source.id] ?? source.useFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section ia-advantage-section">
        <div className="route-section-heading">
          <span>{labels.advantageEyebrow}</span>
          <h2>{labels.advantageTitle}</h2>
          <p>{labels.advantageBody}</p>
        </div>
        <div className="ia-advantage-grid">
          {advantageCards[language].map((item, index) => (
            <article key={item.title}>
              <SlidersHorizontal aria-hidden="true" size={19} />
              <span>{index === 0 ? "AI" : index === 1 ? "AOS" : "STATE"}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section">
        <div className="route-section-heading">
          <span>{labels.pathEyebrow}</span>
          <h2>{labels.pathTitle}</h2>
          <p>{labels.pathBody}</p>
        </div>
        <ol className="ia-path-list">
          {pathSteps[language].map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="route-foundation-section ia-section ia-output-section">
        <div>
          <span>{labels.outputEyebrow}</span>
          <h2>{labels.outputTitle}</h2>
          <p>{labels.outputBody}</p>
        </div>
        <div className="ia-contract-card">
          <FileText aria-hidden="true" size={24} />
          <h3>{labels.contractTitle}</h3>
          <ul>
            {routeFileContract[language].map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={15} />
                {item}
              </li>
            ))}
          </ul>
          <Link prefetch={false} className="secondary-action" href="/sample/">
            {labels.sample}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
          <Link prefetch={false} className="secondary-action" href="/launch-kit/">
            {labels.launchKit}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="route-final-cta ia-final-cta">
        <div>
          <span>{labels.finalEyebrow}</span>
          <h2>{labels.finalTitle}</h2>
          <p>{labels.finalBody}</p>
        </div>
        <Link prefetch={false} className="primary-action" href="/idea-risk-test/#idea-risk-test">
          <Gauge aria-hidden="true" size={17} />
          {labels.finalAction}
        </Link>
      </section>
    </>
  );
}
