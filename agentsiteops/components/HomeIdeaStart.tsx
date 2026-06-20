"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  ClipboardList,
  Copy,
  FileCheck2,
  Gauge,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { createIdeaRiskReport, type IdeaRiskNode } from "@/lib/ideaRiskEngine";
import { interpretProjectBrief } from "@/lib/projectBriefInterpreter";

const storageKey = "agentsiteops.projectBriefInput.v1";
const planDraftStorageKey = "agentsiteops.planDraftInput.v1";
const planBriefStorageKey = "agentsiteops.planDraftBrief.v1";
const planDraftSourceStorageKey = "agentsiteops.planDraftSource.v1";

const sampleIdea =
  "真正相信 AI 的人，现在已经在想如何指定未来的 AI 女伴了。不管是中年的陪伴，还是老年的养老，都需要一个这样的 AI 在身边。现在加入我们，我们会按照你提供的内容，为你训练最适合你的另一半 AI；她的记忆会长期保存，期待有一天你把她接回家。";

const sampleIdeaEn =
  "People who truly believe in AI are already thinking about a future AI companion. The use case may be middle-age companionship or elder care. The offer is to start training a personal AI partner from the user's own content now, preserve her memory over time, and prepare for the day when the user can bring that companion home.";

const sampleIdeas = {
  en: sampleIdeaEn,
  zh: sampleIdea
} satisfies Record<SiteLanguage, string>;

const copy = {
  en: {
    eyebrow: "Start here",
    title: "Paste one rough idea.",
    body:
      "Write naturally. Do not fill separate forms. The page extracts the likely buyer, offer, proof, channel, constraints, and missing facts before sending you anywhere else.",
    placeholder:
      "Example: I want to build an AI service for small agencies. They lose time turning messy client requests into scope. I have one screenshot, a few workflow notes, no paid ads, and I want to test outreach for 7 days...",
    loadSample: "Load sample",
    clear: "Clear",
    local: "Browser-local draft",
    noApi: "No hidden API research",
    source: "Source-backed risk map",
    hintShort: "Write one or two concrete sentences to unlock the first diagnosis.",
    hintReady: "First diagnosis is visible. Repair the missing facts before planning.",
    emptyTitle: "Your first diagnosis appears here.",
    emptyBody:
      "The output is not a final plan. It shows what the system understood, where it may fail first, and what evidence is needed before more work.",
    score: "initial clarity",
    understood: "System read",
    target: "Likely user or buyer",
    route: "Likely route",
    missing: "Missing before planning",
    risk: "First failure node",
    evidence: "Evidence needed",
    decision: "Current decision",
    sevenDay: "7-day validation",
    stopRule: "Stop rule",
    copyReport: "Copy diagnosis",
    copied: "Copied",
    plan: "Continue to editable plan",
    fullMap: "Open full risk map",
    boundary: "Free reference pass only. It does not prove demand, safety, revenue, or product-market fit."
  },
  zh: {
    eyebrow: "从这里开始",
    title: "先粘贴一个粗糙想法。",
    body:
      "按自然语言写，不要分开填很多表单。页面会先提取可能的买家、交付物、证明、渠道、约束和缺失事实，然后再决定是否继续。",
    placeholder:
      "示例：真正相信 AI 的人，现在已经在想如何指定未来的 AI 女伴了。不管是中年的陪伴，还是老年的养老，都需要一个这样的 AI 在身边。我们会按照用户提供的内容，为他训练最适合的另一半 AI，并先验证隐私、记忆和陪伴边界...",
    loadSample: "填入示例",
    clear: "清空",
    local: "浏览器本地草稿",
    noApi: "不伪装隐藏 API 研究",
    source: "有来源依据的风险图",
    hintShort: "写一两句具体想法，就能看到第一版诊断。",
    hintReady: "第一版诊断已显示。进入计划前，先修复缺失事实。",
    emptyTitle: "你的第一版诊断会出现在这里。",
    emptyBody:
      "这里不会直接给最终计划，而是先展示系统理解了什么、哪里可能先失败、继续前缺什么证据。",
    score: "初步清晰度",
    understood: "系统理解",
    target: "可能用户或买家",
    route: "可能路线",
    missing: "进入计划前缺什么",
    risk: "第一失败节点",
    evidence: "需要的证据",
    decision: "当前判断",
    sevenDay: "7 天验证",
    stopRule: "停止规则",
    copyReport: "复制诊断",
    copied: "已复制",
    plan: "带着草稿继续计划",
    fullMap: "打开完整风险图",
    boundary: "这里只是免费参考排查，不证明需求、安全性、收入或产品市场匹配。"
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

const decisionZh: Record<string, string> = {
  stop: "先停止建议",
  repair: "先修复输入",
  continue: "继续收窄路线"
};

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
    label: "权利、隐私或合规边界不清楚",
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
  "State what the route must not claim, use, or promise.": "写清这条路线不能声明、使用或承诺什么。"
};

function routeLabel(route: string, language: SiteLanguage) {
  return language === "zh" ? routeZh[route] ?? route : route;
}

function decisionLabel(state: string, fallback: string, language: SiteLanguage) {
  return language === "zh" ? decisionZh[state] ?? fallback : fallback;
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

function validationPlan(language: SiteLanguage, risk: string) {
  if (language === "zh") {
    return [
      `0-24 小时：锁定当前问题，不继续增加产品、支付或内容范围。`,
      `48 小时：先修复最高风险节点：${risk}。`,
      "第 7 天：只测试一个渠道或证明资产，记录回复、反对意见或沉默。",
      "第 14 天：决定继续、修复、转向或停止。没有证据前不扩张。"
    ];
  }

  return [
    "0-24 hours: Freeze the current project question; do not add product, checkout, or content scope.",
    `48 hours: Repair the highest-risk node first: ${risk}.`,
    "Day 7: Test one channel or proof asset and record replies, objections, or silence.",
    "Day 14: Decide continue, repair, pivot, or stop. Do not scale without evidence."
  ];
}

function buildHomeBrief(
  language: SiteLanguage,
  projectName: string,
  targetUser: string,
  route: string,
  decision: string,
  missing: string[],
  risk: string,
  evidence: string,
  stopRule: string
) {
  if (language === "zh") {
    return [
      `项目：${projectName}`,
      `系统理解：${targetUser}`,
      `当前判断：${decision}`,
      `可能路线：${routeLabel(route, "zh")}`,
      `第一失败节点：${risk}`,
      `需要证据：${evidence}`,
      "进入计划前缺口：",
      ...(missing.length ? missing.map((item) => `- ${missingHint(item, "zh")}`) : ["- 当前没有阻塞缺口，但仍需要证据审核。"]),
      `停止规则：${stopRule}`
    ].join("\n");
  }

  return [
    `Project: ${projectName}`,
    `System read: ${targetUser}`,
    `Current decision: ${decision}`,
    `Likely route: ${route}`,
    `First failure node: ${risk}`,
    `Evidence needed: ${evidence}`,
    "Missing before planning:",
    ...(missing.length ? missing.map((item) => `- ${item}`) : ["- No blocking gap detected; evidence review is still required."]),
    `Stop rule: ${stopRule}`
  ].join("\n");
}

export function HomeIdeaStart() {
  const [language] = usePreferredLanguage();
  const labels = copy[language];
  const [idea, setIdea] = useState("");
  const [copied, setCopied] = useState(false);
  const input = useMemo(
    () => ({
      rawIdeaText: idea,
      optionalAssets: ""
    }),
    [idea]
  );
  const interpretation = useMemo(() => interpretProjectBrief(input), [input]);
  const report = useMemo(() => createIdeaRiskReport(interpretation.ideaRiskInput), [interpretation]);
  const hasIdea = idea.trim().length >= 10;
  const topRisk = report.topRisks[0];
  const firstRiskLabel = riskLabel(topRisk, language);
  const readiness = hasIdea ? report.readinessScore : Math.min(100, Math.round((idea.trim().length / 160) * 100));
  const projectName =
    language === "zh" && interpretation.ideaRiskInput.projectName === "Untitled project"
      ? "未命名项目"
      : interpretation.ideaRiskInput.projectName;
  const targetUser = interpretation.ideaRiskInput.targetUser || interpretation.ideaRiskInput.ideaSummary;
  const missing = interpretation.missingHints.slice(0, 4);
  const evidence = riskEvidence(topRisk, language);
  const decision = decisionLabel(report.decision.state, report.decision.label, language);
  const shortValidationPlan = validationPlan(language, firstRiskLabel);
  const stopRule =
    language === "zh"
      ? "如果第 14 天仍没有买家回应、证明资产、可测试渠道或明确边界，就停止扩张并重写想法。"
      : report.stopRule;
  const homeBrief = buildHomeBrief(
    language,
    projectName,
    targetUser,
    report.selectedRoute,
    decision,
    missing,
    firstRiskLabel,
    evidence,
    stopRule
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

  async function copyDiagnosis() {
    persistIdea();
    try {
      await navigator.clipboard.writeText(homeBrief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  function loadSample() {
    setIdea(sampleIdeas[language]);
    setCopied(false);
  }

  function clearIdea() {
    setIdea("");
    setCopied(false);
  }

  return (
    <section className="home-idea-start home-idea-console" id="start-idea" aria-label="Start with project idea">
      <div className="home-idea-input-side">
        <span>{labels.eyebrow}</span>
        <h2>{labels.title}</h2>
        <p>{labels.body}</p>
        <div className="home-idea-tools">
          <button type="button" onClick={loadSample}>
            <Sparkles aria-hidden="true" size={15} />
            {labels.loadSample}
          </button>
          <button type="button" onClick={clearIdea}>
            <RotateCcw aria-hidden="true" size={15} />
            {labels.clear}
          </button>
        </div>
        <textarea value={idea} rows={10} placeholder={labels.placeholder} onChange={(event) => setIdea(event.target.value)} />
        <div className="home-idea-meter" aria-label="Input readiness">
          <i style={{ width: `${readiness}%` }} />
        </div>
        <p className="home-idea-hint">{hasIdea ? labels.hintReady : labels.hintShort}</p>
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
      </div>

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
                <p>{targetUser}</p>
              </article>
              <article>
                <span>{labels.route}</span>
                <strong>{routeLabel(report.selectedRoute, language)}</strong>
                <p>
                  <b>{labels.decision}: </b>
                  {decision}
                </p>
              </article>
            </div>

            <div className="home-idea-risk-card">
              <AlertTriangle aria-hidden="true" size={18} />
              <div>
                <span>{labels.risk}</span>
                <strong>{firstRiskLabel}</strong>
                <p>
                  <b>{labels.evidence}: </b>
                  {evidence}
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

            <div className="home-idea-validation-card">
              <ClipboardCheck aria-hidden="true" size={18} />
              <div>
                <span>{labels.sevenDay}</span>
                <ol>
                  {shortValidationPlan.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="home-idea-stop-card">
              <span>{labels.stopRule}</span>
              <p>{stopRule}</p>
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
        <button className="secondary-action" type="button" onClick={copyDiagnosis} disabled={!hasIdea}>
          <Copy aria-hidden="true" size={17} />
          {copied ? labels.copied : labels.copyReport}
        </button>
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

      <p className="home-idea-boundary">{labels.boundary}</p>
    </section>
  );
}
