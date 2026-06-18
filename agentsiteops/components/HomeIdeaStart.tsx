"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  FileCheck2,
  Gauge,
  ShieldCheck
} from "lucide-react";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { createIdeaRiskReport, type IdeaRiskNode } from "@/lib/ideaRiskEngine";
import { interpretProjectBrief } from "@/lib/projectBriefInterpreter";

const storageKey = "agentsiteops.projectBriefInput.v1";
const planDraftStorageKey = "agentsiteops.planDraftInput.v1";
const planBriefStorageKey = "agentsiteops.planDraftBrief.v1";
const planDraftSourceStorageKey = "agentsiteops.planDraftSource.v1";

const copy = {
  en: {
    eyebrow: "Start here",
    title: "Paste the idea once.",
    body:
      "Use plain language. The site will extract the first buyer, offer, proof, channel, constraints, and validation gaps on this page before asking you to continue.",
    placeholder:
      "Example: I want to build an AI service for small agencies. They lose time turning messy client requests into scope. I have one screenshot, a few workflow notes, no paid ads, and I want to test outreach for 7 days...",
    local: "Browser-local draft",
    noApi: "No hidden API research",
    source: "Source-backed risk map",
    hintShort: "Write two or three specific sentences to unlock the first decomposition.",
    hintReady: "The page has enough text to show a first project interpretation.",
    emptyTitle: "Your first result appears here.",
    emptyBody:
      "A rough sentence is enough. The output is not a final plan; it shows what the system understood and what must be repaired before planning.",
    score: "initial clarity",
    understood: "System understood",
    route: "Likely next route",
    missing: "Missing before planning",
    risk: "First failure node",
    evidence: "Evidence needed",
    decision: "Current decision",
    plan: "Continue to editable plan",
    fullMap: "Open full risk map",
    boundary: "This is a free reference pass, not delivery acceptance."
  },
  zh: {
    eyebrow: "从这里开始",
    title: "先把想法写一次。",
    body:
      "按自然语言写，不需要懂专业字段。首页会先提取用户、交付物、证据、渠道、约束和验证缺口，让你在继续之前先看懂当前想法。",
    placeholder:
      "示例：真正相信 AI 的人，现在已经在想如何指定未来的 AI 伴侣。不管是中年的陪伴，还是老年的养老，都需要这样的 AI 在身边。我们会按照用户提供的内容，为他训练最适合的另一半 AI，并先验证隐私、记忆和陪伴边界...",
    local: "浏览器本地草稿",
    noApi: "不伪装隐藏 API 研究",
    source: "有来源依据的风险图",
    hintShort: "先写两三句具体想法，就能解锁第一版拆解。",
    hintReady: "文本已足够显示第一版项目理解。",
    emptyTitle: "你的第一版结果会出现在这里。",
    emptyBody:
      "一句粗略描述也可以开始。这里不会直接给最终计划，而是先展示系统理解了什么、哪里可能误读、继续前缺什么。",
    score: "初步清晰度",
    understood: "系统当前理解",
    route: "可能的下一步路线",
    missing: "进入计划前缺什么",
    risk: "第一个失败节点",
    evidence: "需要的证据",
    decision: "当前判断",
    plan: "带着草稿继续计划",
    fullMap: "查看完整风险图",
    boundary: "这是免费参考拆解，不等于交付已通过。"
  }
} satisfies Record<SiteLanguage, Record<string, string>>;

const routeZh: Record<string, string> = {
  "Buyer-definition sprint": "用户定义冲刺",
  "First proof asset sprint": "第一证明资产冲刺",
  "Channel validation sprint": "渠道验证冲刺",
  "Repair before Route File": "Route File 前修复",
  "Manual service route test": "人工服务路线测试",
  "Route File candidate": "Route File 候选路线"
};

const decisionZh = {
  stop: "先停止建设",
  repair: "先修复输入",
  continue: "继续收窄路线"
} satisfies Record<string, string>;

const riskZh: Record<string, Pick<IdeaRiskNode, "label" | "requiredEvidence">> = {
  "unclear-buyer": {
    label: "用户或买家过于宽泛",
    requiredEvidence: "写出一个细分用户、重复行为、可触达渠道、现有替代方案，以及他们为什么现在会回应。"
  },
  "weak-pain": {
    label: "问题可能不够痛",
    requiredEvidence: "收集问题描述、重复手工流程、当前替代方案，以及本周行动的原因。"
  },
  "missing-proof-asset": {
    label: "缺少可检查的证明资产",
    requiredEvidence: "一个演示、截图、流程说明、匿名案例、来源笔记、用户回复或付款记录。"
  },
  "premature-product-build": {
    label: "过早做产品",
    requiredEvidence: "一个窄证明资产、一条合格用户回复，以及一个可以人工交付的版本。"
  },
  "premature-scaling": {
    label: "过早扩张风险",
    requiredEvidence: "可重复的用户回应、可运行的获客渠道、交付能力和停止规则。"
  },
  "weak-acquisition-channel": {
    label: "获客渠道不可测试",
    requiredEvidence: "一个渠道、目标名单、信息模板、潜在用户来源，以及什么算兴趣信号。"
  },
  "resource-runway": {
    label: "时间或资源窗口不清楚",
    requiredEvidence: "可用工时、预算上限、负责人、交付能力和复盘日期。"
  },
  "rights-or-compliance": {
    label: "权利、隐私或合规边界",
    requiredEvidence: "允许使用的来源、禁止承诺、隐私边界和交付排除项。"
  },
  "no-validation-plan": {
    label: "缺少验证渠道",
    requiredEvidence: "首个渠道、目标数量、测试资产、有效信号、无效信号和复盘日期。"
  },
  "route-file-incomplete": {
    label: "Route File 信息不完整",
    requiredEvidence: "项目摘要、用户、交付物、证明资产、渠道、资源窗口、约束和验证计划。"
  }
};

const missingHintsZh: Record<string, string> = {
  "Name the first reachable buyer or user group.": "说清第一批可触达买家或用户群体。",
  "Describe the smallest first offer or result.": "描述最小的首个交付或结果。",
  "Add one proof asset, source, screenshot, case, or link.": "补充一个证明资产、来源、截图、案例或链接。",
  "Name the first channel where real people will see it.": "说清真实用户会在哪个第一渠道看到它。",
  "Define what evidence would count within 48 hours, 7 days, or 30 days.":
    "定义 48 小时、7 天或 30 天内什么证据才算有效。",
  "State what the route must not claim, use, or promise.": "写清这条路线不能声称、使用或承诺什么。"
};

function routeLabel(route: string, language: SiteLanguage) {
  return language === "zh" ? routeZh[route] ?? route : route;
}

function decisionLabel(state: keyof typeof decisionZh | string, fallback: string, language: SiteLanguage) {
  return language === "zh" ? decisionZh[state as keyof typeof decisionZh] ?? fallback : fallback;
}

function riskLabel(risk: IdeaRiskNode | undefined, language: SiteLanguage) {
  if (!risk) {
    return language === "zh" ? "路线不清" : "Unclear route";
  }

  return language === "zh" ? riskZh[risk.id]?.label ?? risk.label : risk.label;
}

function riskEvidence(risk: IdeaRiskNode | undefined, language: SiteLanguage) {
  if (!risk) {
    return language === "zh" ? "先补充用户、证据、渠道和停止规则。" : "Add buyer, proof, channel, and stop rule.";
  }

  return language === "zh" ? riskZh[risk.id]?.requiredEvidence ?? risk.requiredEvidence : risk.requiredEvidence;
}

function missingHint(value: string, language: SiteLanguage) {
  return language === "zh" ? missingHintsZh[value] ?? value : value;
}

function buildHomeBrief(
  language: SiteLanguage,
  projectName: string,
  route: string,
  decision: string,
  missing: string[],
  risk: string
) {
  if (language === "zh") {
    return [
      `项目：${projectName}`,
      `首页初步判断：${decision}`,
      `可能路线：${routeLabel(route, "zh")}`,
      `第一失败节点：${risk}`,
      "进入计划前缺口：",
      ...(missing.length ? missing.map((item) => `- ${missingHint(item, "zh")}`) : ["- 当前没有阻塞缺口，但仍需证据审核。"])
    ].join("\n");
  }

  return [
    `Project: ${projectName}`,
    `Home decision: ${decision}`,
    `Likely route: ${route}`,
    `First failure node: ${risk}`,
    "Missing before planning:",
    ...(missing.length ? missing.map((item) => `- ${item}`) : ["- No blocking gap detected; evidence review is still required."])
  ].join("\n");
}

export function HomeIdeaStart() {
  const [language] = usePreferredLanguage();
  const labels = copy[language];
  const [idea, setIdea] = useState("");
  const input = useMemo(
    () => ({
      rawIdeaText: idea,
      optionalAssets: ""
    }),
    [idea]
  );
  const interpretation = useMemo(() => interpretProjectBrief(input), [input]);
  const report = useMemo(() => createIdeaRiskReport(interpretation.ideaRiskInput), [interpretation]);
  const hasIdea = idea.trim().length >= 12;
  const topRisk = report.topRisks[0];
  const readiness = hasIdea ? report.readinessScore : Math.min(100, Math.round((idea.trim().length / 180) * 100));
  const projectName =
    language === "zh" && interpretation.ideaRiskInput.projectName === "Untitled project"
      ? "未命名项目"
      : interpretation.ideaRiskInput.projectName;
  const missing = interpretation.missingHints.slice(0, 3);
  const homeBrief = buildHomeBrief(
    language,
    projectName,
    report.selectedRoute,
    decisionLabel(report.decision.state, report.decision.label, language),
    missing,
    riskLabel(topRisk, language)
  );

  function persistIdea() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(input));
      window.localStorage.setItem(planDraftStorageKey, JSON.stringify(interpretation.planDraftInput));
      window.localStorage.setItem(planBriefStorageKey, homeBrief);
      window.localStorage.setItem(
        planDraftSourceStorageKey,
        JSON.stringify({
          rawIdeaText: input.rawIdeaText,
          optionalAssets: input.optionalAssets,
          detectedSignals: interpretation.detectedSignals,
          missingHints: interpretation.missingHints,
          completionScore: interpretation.completionScore,
          savedAt: new Date().toISOString(),
          language
        })
      );
    } catch {
      // The next pages remain usable without browser storage; they will just start without imported draft data.
    }

    window.codexAnalytics?.track("home_idea_start", {
      length: idea.trim().length,
      readiness,
      route: report.selectedRoute,
      decision: report.decision.state
    });
  }

  return (
    <section className="home-idea-start" id="start-idea" aria-label="Start with project idea">
      <span>{labels.eyebrow}</span>
      <h2>{labels.title}</h2>
      <p>{labels.body}</p>
      <textarea
        value={idea}
        rows={8}
        placeholder={labels.placeholder}
        onChange={(event) => setIdea(event.target.value)}
      />
      <div className="home-idea-meter" aria-label="Input readiness">
        <i style={{ width: `${readiness}%` }} />
      </div>
      <p className="home-idea-hint">{hasIdea ? labels.hintReady : labels.hintShort}</p>

      <section className={hasIdea ? "home-idea-preview" : "home-idea-preview is-empty"} aria-live="polite">
        <div className="home-idea-score">
          <Gauge aria-hidden="true" size={17} />
          <span>{labels.score}</span>
          <strong>{readiness}/100</strong>
        </div>

        {hasIdea ? (
          <>
            <div className="home-idea-result-grid">
              <article>
                <span>{labels.understood}</span>
                <strong>{projectName}</strong>
                <p>{interpretation.ideaRiskInput.targetUser || interpretation.ideaRiskInput.ideaSummary}</p>
              </article>
              <article>
                <span>{labels.route}</span>
                <strong>{routeLabel(report.selectedRoute, language)}</strong>
                <p>{decisionLabel(report.decision.state, report.decision.label, language)}</p>
              </article>
            </div>

            <div className="home-idea-risk-card">
              <AlertTriangle aria-hidden="true" size={18} />
              <div>
                <span>{labels.risk}</span>
                <strong>{riskLabel(topRisk, language)}</strong>
                <p>
                  <b>{labels.evidence}: </b>
                  {riskEvidence(topRisk, language)}
                </p>
              </div>
            </div>

            <div className="home-idea-missing">
              <strong>{labels.missing}</strong>
              {missing.length ? (
                <ul>
                  {missing.map((item) => (
                    <li key={item}>{missingHint(item, language)}</li>
                  ))}
                </ul>
              ) : (
                <p>{language === "zh" ? "当前没有阻塞缺口，但仍需要证据审核。" : "No blocking gap detected; evidence review is still required."}</p>
              )}
            </div>
          </>
        ) : (
          <div className="home-idea-empty-state">
            <strong>{labels.emptyTitle}</strong>
            <p>{labels.emptyBody}</p>
          </div>
        )}
      </section>

      <div className="home-idea-actions">
        <Link prefetch={false} className="primary-action" href="/plan/" onClick={persistIdea}>
          <FileCheck2 aria-hidden="true" size={17} />
          {labels.plan}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
        <Link prefetch={false} className="secondary-action" href="/idea-risk-test/#idea-risk-test" onClick={persistIdea}>
          <ClipboardList aria-hidden="true" size={17} />
          {labels.fullMap}
        </Link>
      </div>

      <dl>
        <div>
          <ShieldCheck aria-hidden="true" size={15} />
          <dd>{labels.local}</dd>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" size={15} />
          <dd>{labels.noApi}</dd>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" size={15} />
          <dd>{labels.source}</dd>
        </div>
      </dl>
      <p className="home-idea-boundary">{labels.boundary}</p>
    </section>
  );
}
