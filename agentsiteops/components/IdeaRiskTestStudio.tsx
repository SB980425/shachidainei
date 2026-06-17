"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  FileCheck2,
  Gauge,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { createIdeaRiskReport, type IdeaRiskNode } from "@/lib/ideaRiskEngine";
import {
  emptyProjectBriefInput,
  exampleProjectBriefInput,
  interpretProjectBrief,
  type ProjectBriefInput
} from "@/lib/projectBriefInterpreter";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";

const storageKey = "agentsiteops.projectBriefInput.v1";
const planDraftStorageKey = "agentsiteops.planDraftInput.v1";
const planBriefStorageKey = "agentsiteops.planDraftBrief.v1";

const ui = {
  en: {
    freeInput: "Free idea input",
    title: "Write one rough project description.",
    body:
      "Do not split the idea into many forms. Paste the messy version; the page extracts buyer, offer, proof, channel, constraints, and validation signals.",
    mainLabel: "Project idea",
    mainPrompt: "Paste notes, voice-dump text, or a rough plan.",
    mainPlaceholder:
      "Example: I want to build an AI workflow service for solo consultants. They receive messy client requests and lose time clarifying scope. I have two screenshots, one workflow note, no paid ads, and I want to test outreach for 7 days...",
    assetsLabel: "Optional proof or material",
    assetsPrompt: "Add links, screenshots described in text, examples, buyer replies, or existing assets.",
    assetsPlaceholder:
      "Example: one screenshot, two before-after notes, three anonymized client messages, one public walkthrough link.",
    extracted: "Extracted signals",
    missing: "Missing information",
    noSignals: "Add a few sentences and the page will extract the first useful signals.",
    allSet: "Enough input for a first reference pass. Stronger evidence can still improve it.",
    saved: "Saved locally",
    restored: "Restored local draft",
    unavailable: "Local save unavailable",
    cleared: "Local test cleared",
    loadExample: "Load example",
    copyReport: "Copy report",
    copied: "Copied",
    copyUnavailable: "Copy unavailable",
    clear: "Clear",
    suggestedRoute: "Suggested next route",
    systemDecision: "System decision",
    systemTakesOver: "System takeover",
    systemTakesOverBody:
      "Do not defend the original idea. The page freezes the current interpretation, marks where AI may misread it, and asks only the minimum questions needed to repair the route.",
    misreadChecks: "AI misread checks",
    interpretedAs: "Interpreted as",
    riskIfWrong: "Risk if wrong",
    repairPrompt: "Repair prompt",
    systemQuestions: "Answer only these questions",
    noSystemQuestions: "No blocking questions. Keep the route narrow and preserve the stop rule.",
    extractedStatus: "extracted",
    missingStatus: "missing",
    riskNodes: "Likely failure nodes",
    watch: "Watch",
    evidence: "Evidence needed",
    action: "Next action",
    time: "Time checkpoints",
    sources: "Reference basis",
    sourceBody:
      "These sources explain why the risk nodes exist. They do not prove this specific project will succeed or fail.",
    stopRule: "Stop rule",
    continue: "Continue to Plan Studio",
    boundary:
      "Free test output is a reference map. Final Route File acceptance still needs evidence review and scope lock.",
    extractedScore: "input extracted"
  },
  zh: {
    freeInput: "免费想法输入",
    title: "先写一段粗略项目描述。",
    body:
      "不要把想法拆成很多表单。直接粘贴混乱版本，页面会提取用户、交付物、证据、渠道、约束和验证信号。",
    mainLabel: "项目想法",
    mainPrompt: "粘贴笔记、口述稿、粗略计划或零散描述。",
    mainPlaceholder:
      "示例：我想做一个给独立顾问用的 AI 工作流服务。他们经常收到很乱的客户需求，花很多时间确认范围。我现在有两张截图、一份流程笔记，没有广告预算，想用 7 天做私信验证...",
    assetsLabel: "可选证据或材料",
    assetsPrompt: "补充链接、截图说明、案例、客户回复或已有资产。",
    assetsPlaceholder: "示例：一张截图、两份前后对比笔记、三条匿名客户消息、一个公开演示链接。",
    extracted: "已提取信号",
    missing: "缺失信息",
    noSignals: "先写几句项目想法，页面会提取第一批有用信号。",
    allSet: "已足够生成第一版参考建议；更多证据仍能提升判断质量。",
    saved: "已本地保存",
    restored: "已恢复本地草稿",
    unavailable: "本地保存不可用",
    cleared: "本地测试已清空",
    loadExample: "载入示例",
    copyReport: "复制报告",
    copied: "已复制",
    copyUnavailable: "复制不可用",
    clear: "清空",
    suggestedRoute: "建议下一步路线",
    systemDecision: "系统判断",
    systemTakesOver: "系统接管",
    systemTakesOverBody:
      "不要替原始想法辩护。页面会冻结当前理解，标记 AI 可能误读的位置，并只提出修复路线所需的最少问题。",
    misreadChecks: "AI 可能误读的位置",
    interpretedAs: "当前理解为",
    riskIfWrong: "如果理解错了",
    repairPrompt: "修复提示",
    systemQuestions: "只需要回答这些问题",
    noSystemQuestions: "当前没有阻塞问题。继续时保持路线收窄，并保留停止规则。",
    extractedStatus: "已提取",
    missingStatus: "缺失",
    riskNodes: "可能失败节点",
    watch: "注意",
    evidence: "需要证据",
    action: "下一步",
    time: "时间节点",
    sources: "参考依据",
    sourceBody: "这些来源解释风险节点为什么存在，但不能证明某个具体项目一定成功或失败。",
    stopRule: "停止规则",
    continue: "进入计划页",
    boundary: "免费测试输出只是参考地图。最终 Route File 仍需要证据审核和范围锁定。",
    extractedScore: "已提取信息"
  }
} satisfies Record<SiteLanguage, Record<string, string>>;

const riskZh: Record<
  string,
  Pick<IdeaRiskNode, "label" | "why" | "attention" | "requiredEvidence" | "nextAction">
> = {
  "unclear-buyer": {
    label: "用户或买家过于宽泛",
    why: "第一个可触达用户还不够具体，无法判断痛点、渠道、预算或证据。",
    attention: "宽泛人群会让计划看起来合理，但很难真正验证。",
    requiredEvidence: "写出一个细分用户、重复行为、可触达渠道、现有替代方案，以及他们为什么现在会回应。",
    nextAction: "把目标用户改写成一个窄人群，并列出 10 个可触达样本。"
  },
  "weak-pain": {
    label: "问题可能不够痛",
    why: "想法或交付物还没有体现重复发生的问题、紧急触发点或明确前后变化。",
    attention: "可有可无的工具容易获得口头认可，但很难让用户改变行为。",
    requiredEvidence: "收集问题描述、重复手工流程、当前替代方案，以及本周行动的原因。",
    nextAction: "询问 5 个目标用户最近一次这个问题造成的时间、金钱、信誉或交付损失。"
  },
  "missing-proof-asset": {
    label: "缺少可检查的证明资产",
    why: "项目还没有提供别人可以检查的样例、截图、演示、来源或回复。",
    attention: "没有证明资产时，输出会变成观点，而不是可验证路线。",
    requiredEvidence: "一个演示、截图、流程说明、匿名案例、来源笔记、用户回复或付款记录。",
    nextAction: "先做一个小型公开或私有证明资产，再考虑更大的产品或页面系统。"
  },
  "premature-product-build": {
    label: "过早做产品",
    why: "描述已经指向产品、平台或系统，但第一份买家证据还不清楚。",
    attention: "早期常见陷阱是产品表面积扩大，但路线还没被市场接受。",
    requiredEvidence: "一个窄证明资产、一条合格用户回复，以及一个可以人工交付的版本。",
    nextAction: "把产品建设替换成 48 小时手动证明或一页流程演示。"
  },
  "premature-scaling": {
    label: "过早扩张风险",
    why: "项目提到增长、投放、招聘或多渠道扩张，但还没有可重复验证信号。",
    attention: "扩张会消耗预算和注意力，同时掩盖基础路线尚未成立。",
    requiredEvidence: "可重复的用户回应、可运行的获客渠道、交付能力和停止规则。",
    nextAction: "冻结扩张，直到第一轮验证产生合格回复或明确拒绝模式。"
  },
  "weak-acquisition-channel": {
    label: "获客渠道不可测试",
    why: "项目还没有说明第一批真实用户或买家从哪里来。",
    attention: "没有可触达渠道，再好的想法也无法验证。",
    requiredEvidence: "一个渠道、目标名单、信息模板、潜在用户来源，以及什么算兴趣信号。",
    nextAction: "选一个渠道测试 7 天，并定义什么回应才算合格。"
  },
  "resource-runway": {
    label: "时间或资源窗口不清楚",
    why: "项目没有说明时间、预算、人手、交付能力或复盘日期。",
    attention: "资源不清会让计划看起来有用，但无法形成执行决策。",
    requiredEvidence: "可用工时、预算上限、负责人、交付能力和复盘日期。",
    nextAction: "设定 7 天或 14 天验证窗口，并写明缺少证据时停止什么。"
  },
  "rights-or-compliance": {
    label: "权利、隐私或合规边界",
    why: "项目涉及数据、承诺、复制、监管领域或账号访问，但边界不清楚。",
    attention: "路线可以有商业价值，但如果数据权利或承诺不安全，仍应阻断。",
    requiredEvidence: "允许使用的来源、禁止承诺、隐私边界和交付排除项。",
    nextAction: "在发布、销售或研究之前，先写清被禁止的承诺和数据。"
  },
  "no-validation-plan": {
    label: "缺少验证渠道",
    why: "项目还不能说明哪些证据会让它继续、修复、转向或停止。",
    attention: "没有验证渠道，计划会一直内部优化，却不碰真实信号。",
    requiredEvidence: "首个渠道、目标数量、测试资产、有效信号、无效信号和复盘日期。",
    nextAction: "先建立 48 小时或 7 天验证循环，再投入产品、内容或投放。"
  },
  "route-file-incomplete": {
    label: "Route File 信息不完整",
    why: "当前输入还不足以生成选定路线、被否路线、证据账本、验证渠道和停止规则。",
    attention: "这本身不是失败，只说明项目还应停留在免费测试或计划页。",
    requiredEvidence: "项目摘要、用户、交付物、证明资产、渠道、资源窗口、约束和验证计划。",
    nextAction: "补齐缺失信息，再进入计划页或审核状态，而不是直接要求最终交付。"
  }
};

const routeZh: Record<string, string> = {
  "Buyer-definition sprint": "用户定义冲刺",
  "First proof asset sprint": "第一证明资产冲刺",
  "Channel validation sprint": "渠道验证冲刺",
  "Repair before Route File": "Route File 前修复",
  "Manual service route test": "人工服务路线测试",
  "Route File candidate": "Route File 候选路线"
};

const confidenceZh = {
  "Needs input": "需要补充",
  "Testable draft": "可测试草稿",
  "Ready for review": "可进入审核"
} as const;

const decisionZh = {
  stop: {
    label: "先停止建设",
    reason: "项目触碰权利、隐私、合规或承诺边界，但禁止事项还没有说清。",
    nextStep: "先写清不能使用的数据、不能做出的承诺、不能发布的内容，再继续研究或建设。"
  },
  repair: {
    label: "先修复输入",
    reason: "系统可以画出风险，但当前描述仍给 AI 留下太多自我发挥空间。",
    nextStep: "只回答下面的系统问题，然后重新运行同一个想法，不要新增功能、页面或方向。"
  },
  continue: {
    label: "继续收窄路线",
    reason: "当前输入已经包含足够的用户、证明、渠道、约束和验证材料，可以进入一条窄路线。",
    nextStep: "继续时只保留一条验证路线，同时保留被否方案和停止规则。"
  }
} as const;

const assumptionZh = {
  buyer: {
    label: "第一批可触达买家",
    riskIfWrong: "如果买家太模糊，AI 会围绕虚构人群优化，让项目看起来比实际更可行。",
    repairPrompt: "说清一个可触达买家群体、在哪里能找到他们、什么重复行为证明问题存在。"
  },
  offer: {
    label: "最小首个交付",
    riskIfWrong: "如果交付物太宽，AI 可能把想法扩展成平台、课程、工具或内容计划。",
    repairPrompt: "写出真实用户最先能收到的最小结果，不要新增产品范围。"
  },
  proof: {
    label: "可检查证明资产",
    riskIfWrong: "如果没有证明资产，AI 只能根据意图推理，并可能把观点当成证据。",
    repairPrompt: "提供一个截图、演示、买家回复、来源笔记、样例、流程说明或付款信号。"
  },
  channel: {
    label: "第一验证渠道",
    riskIfWrong: "如果缺少第一渠道，AI 可能推荐无法触达真实用户的工作。",
    repairPrompt: "选择一个渠道、一组目标名单，以及什么回应算合格兴趣。"
  },
  constraints: {
    label: "承诺与权利边界",
    riskIfWrong: "如果边界缺失，AI 可能提出应该被阻止的承诺、数据使用或交付步骤。",
    repairPrompt: "列出这条路线不能承诺、爬取、复制、访问、发布或自动化的内容。"
  },
  validation: {
    label: "继续或停止规则",
    riskIfWrong: "如果停止规则缺失，AI 可能一直优化计划，但项目从不接触买家证据。",
    repairPrompt: "定义复盘日期、有效信号、无效弱信号，以及没有证据时停止什么。"
  }
} as const;

function localizeRisk(risk: IdeaRiskNode, language: SiteLanguage) {
  if (language === "en") {
    return risk;
  }

  return {
    ...risk,
    ...riskZh[risk.id]
  };
}

function routeLabel(route: string, language: SiteLanguage) {
  return language === "zh" ? routeZh[route] ?? route : route;
}

function confidenceLabel(label: keyof typeof confidenceZh | string, language: SiteLanguage) {
  return language === "zh" ? confidenceZh[label as keyof typeof confidenceZh] ?? label : label;
}

function decisionView(report: ReturnType<typeof createIdeaRiskReport>, language: SiteLanguage) {
  if (language === "en") {
    return report.decision;
  }

  return decisionZh[report.decision.state];
}

function localizeAssumption(
  check: ReturnType<typeof createIdeaRiskReport>["assumptionChecks"][number],
  language: SiteLanguage
) {
  if (language === "en") {
    return check;
  }

  const localized = assumptionZh[check.id];
  return {
    ...check,
    label: localized.label,
    riskIfWrong:
      check.status === "extracted"
        ? "这只是系统当前理解，不等于事实。后续证据可以覆盖它。"
        : localized.riskIfWrong,
    repairPrompt: localized.repairPrompt
  };
}

function localizeQuestion(
  question: ReturnType<typeof createIdeaRiskReport>["handoffQuestions"][number],
  language: SiteLanguage
) {
  if (language === "en") {
    return question;
  }

  if (question.id in assumptionZh) {
    const localized = assumptionZh[question.id as keyof typeof assumptionZh];
    return {
      ...question,
      question: localized.repairPrompt,
      reason: localized.riskIfWrong
    };
  }

  if (question.id in riskZh) {
    const localized = riskZh[question.id];
    return {
      ...question,
      question: localized.nextAction,
      reason: localized.attention
    };
  }

  return question;
}

function statusLabel(status: "extracted" | "missing", labels: Record<string, string>) {
  return status === "extracted" ? labels.extractedStatus : labels.missingStatus;
}

function signalLabel(label: string, language: SiteLanguage) {
  if (language === "en") {
    return label;
  }

  const labels: Record<string, string> = {
    Project: "项目",
    Idea: "想法",
    Buyer: "用户",
    Offer: "交付",
    Proof: "证据",
    Channel: "渠道",
    Validation: "验证"
  };

  return labels[label] ?? label;
}

function sourceTypeLabel(value: string, language: SiteLanguage) {
  if (language === "en") {
    return value;
  }

  const labels: Record<string, string> = {
    "failure analysis": "失败分析",
    "research report": "研究报告",
    "case library": "案例库",
    "management research": "方法研究"
  };

  return labels[value] ?? value;
}

function localizedTimePlan(language: SiteLanguage, projectName: string, route: string, topRisk: string) {
  if (language === "en") {
    return null;
  }

  const project = projectName.trim() || "这个项目";
  return [
    `0-24 小时：冻结 ${project} 的核心问题，不新增产品、付款页或内容范围。`,
    `48 小时：先修复最高风险节点：${topRisk}。只收集这个节点需要的证据。`,
    `第 3 天：为建议路线做一个可检查证明资产：${routeLabel(route, "zh")}。`,
    "第 7 天：测试一个获客或验证渠道，记录合格回复、反对意见或沉默。",
    "第 14 天：决定继续、修复、转向或停止。没有证据前不要扩内容、投广告、招人或做产品。",
    "第 30 天：重新检查证据账本，只保留有来源、用户回应、使用或付款记录支持的判断。"
  ];
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to textarea copy below.
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "true");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);
    return didCopy;
  } catch {
    return false;
  }
}

function buildLocalizedBrief(
  language: SiteLanguage,
  input: ProjectBriefInput,
  interpretation: ReturnType<typeof interpretProjectBrief>,
  report: ReturnType<typeof createIdeaRiskReport>
) {
  if (language === "en") {
    return [
      report.brief,
      "",
      "Raw user input:",
      input.rawIdeaText.trim() || "Not provided",
      "",
      "Optional assets:",
      input.optionalAssets.trim() || "Not provided"
    ].join("\n");
  }

  const topRisks = report.topRisks.map((risk) => localizeRisk(risk, "zh"));
  const localizedDecision = decisionView(report, "zh");
  const localizedQuestions = report.handoffQuestions.map((question) => localizeQuestion(question, "zh"));
  const localizedAssumptions = report.assumptionChecks.map((check) => localizeAssumption(check, "zh"));
  const timePlan =
    localizedTimePlan(
      "zh",
      interpretation.ideaRiskInput.projectName,
      report.selectedRoute,
      topRisks[0]?.label ?? "路线不清"
    ) ?? [];

  return [
    `项目：${interpretation.ideaRiskInput.projectName || "未命名项目"}`,
    `系统判断：${localizedDecision.label}`,
    `判断原因：${localizedDecision.reason}`,
    `下一步：${localizedDecision.nextStep}`,
    `建议测试路线：${routeLabel(report.selectedRoute, "zh")}`,
    `准备度：${report.readinessScore}/100（${confidenceLabel(report.confidenceLabel, "zh")}）`,
    "",
    "AI 可能误读的位置：",
    ...localizedAssumptions.map(
      (check) =>
        `- ${check.label}：${check.status === "extracted" ? "已提取" : "缺失"}。当前理解：${check.value}。修复：${check.repairPrompt}`
    ),
    "",
    "只需要回答这些问题：",
    ...(localizedQuestions.length ? localizedQuestions.map((item) => `- ${item.question}`) : ["- 当前没有阻塞问题。"]),
    "",
    "主要失败节点：",
    ...topRisks.map((risk) => `- ${risk.label}：${risk.why} 需要证据：${risk.requiredEvidence}`),
    "",
    "时间节点：",
    ...timePlan.map((item) => `- ${item}`),
    "",
    "参考来源：",
    ...report.sourceBasis.map((source) => `- ${source.publisher}: ${source.name} (${source.url})`),
    "",
    "原始输入：",
    input.rawIdeaText.trim() || "未填写",
    "",
    "可选资料：",
    input.optionalAssets.trim() || "未填写"
  ].join("\n");
}

export function IdeaRiskTestStudio() {
  const [language] = usePreferredLanguage();
  const labels = ui[language];
  const [input, setInput] = useState<ProjectBriefInput>(emptyProjectBriefInput);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "blocked">("idle");
  const [saveState, setSaveState] = useState(labels.saved);
  const [hydrated, setHydrated] = useState(false);
  const interpretation = useMemo(() => interpretProjectBrief(input), [input]);
  const report = useMemo(() => createIdeaRiskReport(interpretation.ideaRiskInput), [interpretation]);
  const displayRisks = report.topRisks.map((risk) => localizeRisk(risk, language));
  const displayDecision = decisionView(report, language);
  const displayAssumptions = report.assumptionChecks.map((check) => localizeAssumption(check, language));
  const visibleAssumptions = displayAssumptions.some((check) => check.status === "missing")
    ? displayAssumptions.filter((check) => check.status === "missing")
    : displayAssumptions.slice(0, 3);
  const displayQuestions = report.handoffQuestions.map((question) => localizeQuestion(question, language));
  const displayTimePlan =
    localizedTimePlan(
      language,
      interpretation.ideaRiskInput.projectName,
      report.selectedRoute,
      displayRisks[0]?.label ?? "Unclear route"
    ) ?? report.timePlan;
  const localizedBrief = useMemo(
    () => buildLocalizedBrief(language, input, interpretation, report),
    [input, interpretation, language, report]
  );

  useEffect(() => {
    setSaveState((current) => {
      if (current === ui.en.saved || current === ui.zh.saved) {
        return labels.saved;
      }
      if (current === ui.en.restored || current === ui.zh.restored) {
        return labels.restored;
      }
      if (current === ui.en.unavailable || current === ui.zh.unavailable) {
        return labels.unavailable;
      }
      if (current === ui.en.cleared || current === ui.zh.cleared) {
        return labels.cleared;
      }
      return current;
    });
  }, [labels.cleared, labels.restored, labels.saved, labels.unavailable]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);

      if (stored) {
        setInput({ ...emptyProjectBriefInput, ...JSON.parse(stored) });
        setSaveState(labels.restored);
      }
    } catch {
      setSaveState(labels.unavailable);
    } finally {
      setHydrated(true);
    }
  }, [labels.restored, labels.unavailable]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(input));
      setSaveState(labels.saved);
    } catch {
      setSaveState(labels.unavailable);
    }
  }, [hydrated, input, labels.saved, labels.unavailable]);

  function updateInput(key: keyof ProjectBriefInput, value: string) {
    setInput((current) => ({
      ...current,
      [key]: value
    }));
  }

  function loadExample() {
    setInput(exampleProjectBriefInput);
    window.codexAnalytics?.track("idea_risk_example_loaded", {
      source: "single_input"
    });
  }

  function clearInput() {
    setInput(emptyProjectBriefInput);
    setCopyState("idle");
    setSaveState(labels.cleared);

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      setSaveState(labels.unavailable);
    }
  }

  function persistPlanDraft() {
    try {
      window.localStorage.setItem(planDraftStorageKey, JSON.stringify(interpretation.planDraftInput));
      window.localStorage.setItem(planBriefStorageKey, localizedBrief);
    } catch {
      // Plan Studio can still open; it will simply not find a saved draft.
    }

    window.codexAnalytics?.track("idea_risk_continue_plan", {
      label: "idea_risk_to_plan",
      readiness_score: report.readinessScore,
      extracted_score: interpretation.completionScore
    });
  }

  async function copyReport() {
    const didCopy = await copyText(localizedBrief);
    setCopyState(didCopy ? "copied" : "blocked");
    window.codexAnalytics?.track("idea_risk_report_copy", {
      copied: didCopy,
      readiness_score: report.readinessScore,
      risk_count: report.topRisks.length
    });
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="idea-risk-studio idea-risk-studio-unified" id="idea-risk-test" aria-label="Idea risk test studio">
      <div className="idea-risk-input-panel">
        <div className="idea-risk-panel-head">
          <span>{labels.freeInput}</span>
          <h2>{labels.title}</h2>
          <p>{labels.body}</p>
          <div className="idea-risk-input-state">
            <strong>
              {interpretation.completionScore}/100 {labels.extractedScore}
            </strong>
            <small>{saveState}</small>
          </div>
        </div>

        <div className="idea-risk-raw-card">
          <label>
            <span>{labels.mainLabel}</span>
            <strong>{labels.mainPrompt}</strong>
            <textarea
              value={input.rawIdeaText}
              rows={14}
              placeholder={labels.mainPlaceholder}
              onChange={(event) => updateInput("rawIdeaText", event.target.value)}
            />
          </label>
          <label>
            <span>{labels.assetsLabel}</span>
            <strong>{labels.assetsPrompt}</strong>
            <textarea
              value={input.optionalAssets}
              rows={5}
              placeholder={labels.assetsPlaceholder}
              onChange={(event) => updateInput("optionalAssets", event.target.value)}
            />
          </label>
        </div>

        <section className="idea-risk-extraction-card">
          <div className="idea-risk-section-head">
            <Sparkles aria-hidden="true" size={18} />
            <h3>{labels.extracted}</h3>
          </div>
          {interpretation.detectedSignals.length ? (
            <div className="idea-risk-detected-grid">
              {interpretation.detectedSignals.map((item) => (
                <article key={item.label}>
                  <span>{signalLabel(item.label, language)}</span>
                  <p>{item.value}</p>
                </article>
              ))}
            </div>
          ) : (
            <p>{labels.noSignals}</p>
          )}

          <div className="idea-risk-missing-strip">
            <strong>{labels.missing}</strong>
            {interpretation.missingHints.length ? (
              <ul>
                {interpretation.missingHints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{labels.allSet}</p>
            )}
          </div>
        </section>

        <div className="idea-risk-actions">
          <button type="button" onClick={loadExample}>
            <RefreshCw aria-hidden="true" size={16} />
            {labels.loadExample}
          </button>
          <button type="button" onClick={copyReport}>
            <ClipboardCopy aria-hidden="true" size={16} />
            {copyState === "copied" ? labels.copied : copyState === "blocked" ? labels.copyUnavailable : labels.copyReport}
          </button>
          <button type="button" onClick={clearInput}>
            {labels.clear}
          </button>
        </div>
      </div>

      <aside className="idea-risk-output-panel" aria-live="polite">
        <div className="idea-risk-score">
          <span>{confidenceLabel(report.confidenceLabel, language)}</span>
          <strong>{report.readinessScore}</strong>
          <small>/100</small>
        </div>

        <div className="idea-risk-route-card">
          <span>{labels.suggestedRoute}</span>
          <h2>{routeLabel(report.selectedRoute, language)}</h2>
          <p>
            {language === "zh"
              ? report.confidenceLabel === "Needs input"
                ? "这个想法可以测试，但输入还不足以形成路线决策。"
                : `当前应优先处理的路径是：${routeLabel(report.selectedRoute, "zh")}。`
              : report.routeReason}
          </p>
        </div>

        <section className={`idea-risk-decision-card is-${report.decision.state}`}>
          <span>{labels.systemDecision}</span>
          <h3>{displayDecision.label}</h3>
          <p>{displayDecision.reason}</p>
          <strong>{displayDecision.nextStep}</strong>
        </section>

        <section className="idea-risk-takeover-card">
          <div className="idea-risk-section-head">
            <Sparkles aria-hidden="true" size={18} />
            <h3>{labels.systemTakesOver}</h3>
          </div>
          <p>{labels.systemTakesOverBody}</p>
          <div className="idea-risk-question-list">
            <strong>{labels.systemQuestions}</strong>
            {displayQuestions.length ? (
              <ol>
                {displayQuestions.map((question) => (
                  <li key={question.id}>
                    <span>{question.question}</span>
                    <small>{question.reason}</small>
                  </li>
                ))}
              </ol>
            ) : (
              <p>{labels.noSystemQuestions}</p>
            )}
          </div>
        </section>

        <section className="idea-risk-assumption-section">
          <div className="idea-risk-section-head">
            <ShieldCheck aria-hidden="true" size={18} />
            <h3>{labels.misreadChecks}</h3>
          </div>
          <div className="idea-risk-assumption-list">
            {visibleAssumptions.map((check) => (
              <article className={`is-${check.status}`} key={check.id}>
                <div>
                  <span>{statusLabel(check.status, labels)}</span>
                  <strong>{check.label}</strong>
                </div>
                <dl>
                  <div>
                    <dt>{labels.interpretedAs}</dt>
                    <dd>{check.value}</dd>
                  </div>
                  <div>
                    <dt>{labels.riskIfWrong}</dt>
                    <dd>{check.riskIfWrong}</dd>
                  </div>
                  <div>
                    <dt>{labels.repairPrompt}</dt>
                    <dd>{check.repairPrompt}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="idea-risk-node-section">
          <div className="idea-risk-section-head">
            <AlertTriangle aria-hidden="true" size={18} />
            <h3>{labels.riskNodes}</h3>
          </div>
          <div className="idea-risk-node-list">
            {displayRisks.map((risk) => (
              <article className={`is-${risk.severity}`} key={risk.id}>
                <div>
                  <span>{risk.severity}</span>
                  <strong>{risk.score}/100</strong>
                </div>
                <h4>{risk.label}</h4>
                <p>{risk.why}</p>
                <dl>
                  <div>
                    <dt>{labels.watch}</dt>
                    <dd>{risk.attention}</dd>
                  </div>
                  <div>
                    <dt>{labels.evidence}</dt>
                    <dd>{risk.requiredEvidence}</dd>
                  </div>
                  <div>
                    <dt>{labels.action}</dt>
                    <dd>{risk.nextAction}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="idea-risk-time-section">
          <div className="idea-risk-section-head">
            <Gauge aria-hidden="true" size={18} />
            <h3>{labels.time}</h3>
          </div>
          <ol>
            {displayTimePlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="idea-risk-source-section">
          <div className="idea-risk-section-head">
            <SearchCheck aria-hidden="true" size={18} />
            <h3>{labels.sources}</h3>
          </div>
          <p>{labels.sourceBody}</p>
          <div className="idea-risk-source-grid">
            {report.sourceBasis.map((source) => (
              <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                <span>{sourceTypeLabel(source.sourceType, language)}</span>
                <strong>{source.publisher}</strong>
                <small>{source.name}</small>
              </a>
            ))}
          </div>
        </section>

        <section className="idea-risk-stop-rule">
          <ShieldCheck aria-hidden="true" size={18} />
          <div>
            <h3>{labels.stopRule}</h3>
            <p>
              {language === "zh"
                ? "如果项目无法说明具体用户、第一证明资产、验证渠道、来源边界和复盘日期，就先停止或修复，不进入建设。"
                : report.stopRule}
            </p>
          </div>
        </section>

        <div className="idea-risk-next-actions is-single">
          <Link prefetch={false} href="/plan/" onClick={persistPlanDraft}>
            <FileCheck2 aria-hidden="true" size={16} />
            {labels.continue}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>

        <p className="idea-risk-boundary">
          <CheckCircle2 aria-hidden="true" size={15} />
          {labels.boundary}
        </p>
      </aside>
    </section>
  );
}
