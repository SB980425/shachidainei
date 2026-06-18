import type { IdeaRiskInput } from "@/lib/ideaRiskEngine";
import type { PlanDraftInput } from "@/lib/planDraft";

export type ProjectBriefInput = {
  rawIdeaText: string;
  optionalAssets: string;
};

export type ProjectBriefInterpretation = {
  ideaRiskInput: IdeaRiskInput;
  planDraftInput: PlanDraftInput;
  detectedSignals: Array<{ label: string; value: string }>;
  missingHints: string[];
  completionScore: number;
};

export const emptyProjectBriefInput: ProjectBriefInput = {
  rawIdeaText: "",
  optionalAssets: ""
};

export const exampleProjectBriefInput: ProjectBriefInput = {
  rawIdeaText: [
    "AI intake helper for solo consultants",
    "",
    "I want to make a lightweight service that turns messy client requests into a scoped project brief, follow-up questions, and a first deliverable checklist.",
    "Target users are solo consultants and small service operators who repeatedly receive unclear client requests and lose time clarifying scope.",
    "The first offer could be a free intake template plus a manual setup offer that configures the first client intake workflow in 72 hours.",
    "The first channel is direct outreach to consultants with public service pages, plus one public walkthrough post showing the before-after workflow.",
    "Resources: one operator, 7-day validation window, no paid ads, no engineering build before at least five qualified replies.",
    "Constraints: no private client data in public output, no revenue guarantee, no automated account access, no regulated advice.",
    "Validation: send 30 targeted messages, collect qualified replies, record objections, and stop if no one agrees to review the workflow."
  ].join("\n"),
  optionalAssets:
    "Two before-after workflow notes, one screenshot of the intake sheet, and three example client request messages with private details removed."
};

const signalRules = {
  buyer: [
    "target",
    "buyer",
    "user",
    "customer",
    "audience",
    "for ",
    "用户",
    "客户",
    "受众",
    "人群",
    "买家",
    "目标",
    "中年",
    "老年",
    "老人",
    "相信ai",
    "相信 ai"
  ],
  offer: [
    "offer",
    "receive",
    "deliver",
    "service",
    "tool",
    "product",
    "提供",
    "交付",
    "服务",
    "工具",
    "产品",
    "得到",
    "训练",
    "陪伴",
    "女伴",
    "另一半",
    "记忆"
  ],
  assets: ["asset", "proof", "demo", "screenshot", "source", "case", "link", "已有", "证据", "截图", "链接", "案例", "材料", "演示"],
  channel: ["channel", "outreach", "search", "community", "post", "email", "渠道", "推广", "流量", "私信", "社群", "搜索", "发布"],
  resources: ["resource", "budget", "operator", "days", "week", "time", "资源", "预算", "人手", "时间", "天", "周"],
  constraints: [
    "constraint",
    "risk",
    "no ",
    "not ",
    "without",
    "限制",
    "风险",
    "不能",
    "不要",
    "不得",
    "合规",
    "隐私",
    "记忆",
    "永远保存",
    "养老",
    "另一半"
  ],
  validation: ["validate", "validation", "test", "reply", "message", "signal", "验证", "测试", "回复", "反馈", "信号", "访谈"]
};

const aiCompanionTerms = [
  "ai女伴",
  "ai 女伴",
  "ai伴侣",
  "ai 伴侣",
  "另一半ai",
  "另一半 ai",
  "未来的ai",
  "未来的 ai",
  "陪伴",
  "养老",
  "建立感情",
  "记忆永远保存",
  "接回家",
  "ai companion",
  "ai partner",
  "virtual companion",
  "digital companion"
];

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function includesAny(value: string, terms: string[]) {
  const text = value.toLowerCase();
  return terms.some((term) => text.includes(term.toLowerCase()));
}

function isAiCompanionIdea(raw: string) {
  return includesAny(raw, aiCompanionTerms);
}

function firstMatchingLine(lines: string[], terms: string[]) {
  return lines.find((line) => includesAny(line, terms)) ?? "";
}

function firstMeaningfulLine(lines: string[]) {
  return lines.find((line) => line.length >= 4 && line.length <= 90) ?? "";
}

function inferProjectName(lines: string[], raw: string) {
  const firstLine = firstMeaningfulLine(lines);
  if (isAiCompanionIdea(raw) && (!firstLine || /[，。；,.]|需要|训练|记忆|陪伴|养老/.test(firstLine))) {
    return "长期记忆型 AI 伴侣服务";
  }

  if (
    firstLine &&
    !/^(i|we)\s+(want|need|plan|will|am|are)\b/i.test(firstLine) &&
    !/^(我|我们)(想|想要|需要|准备|打算|正在)/.test(firstLine)
  ) {
    return firstLine;
  }

  const normalized = normalizeText(raw);
  const englishBuildMatch = normalized.match(
    /\b(?:build|make|create|launch|develop|ship)\s+(?:an?\s+|the\s+)?([^.,;\n]{8,90})/i
  );
  if (englishBuildMatch?.[1]) {
    return englishBuildMatch[1].trim();
  }

  const chineseBuildMatch = normalized.match(
    /(?:我想|我想要|我们想|准备|打算|计划)(?:做|开发|打造|建立|构建|推出|上线)(?:一个|一款|一种)?([^，。；,.]{4,50})/
  );
  if (chineseBuildMatch?.[1]) {
    return chineseBuildMatch[1].trim();
  }

  const namedMatch = normalized.match(
    /(?:project|product|tool|service|项目|产品|工具|服务|网站)(?:\s+is|\s+called|叫|名称是|名字是)?[:：]?\s*([^，。；,.]{4,60})/i
  );
  if (namedMatch?.[1]) {
    return namedMatch[1].trim();
  }

  if (isAiCompanionIdea(raw)) {
    return "长期记忆型 AI 伴侣服务";
  }

  return firstLine || "Untitled project";
}

function inferTargetUser(lines: string[], raw: string) {
  const explicit = firstMatchingLine(lines, signalRules.buyer);

  if (isAiCompanionIdea(raw) && (!explicit || explicit.length > 60 || /训练|记忆|接回家/.test(explicit))) {
    return "相信 AI 陪伴、提前规划中老年陪伴或养老陪伴的人群，尤其是愿意为长期情感陪伴建立个人资料的人。";
  }

  if (explicit) {
    return explicit;
  }

  if (isAiCompanionIdea(raw)) {
    return "相信 AI 陪伴、提前规划中老年陪伴或养老陪伴的人群，尤其是愿意为长期情感陪伴建立个人资料的人。";
  }

  return "";
}

function inferOffer(lines: string[], raw: string) {
  const explicit = firstMatchingLine(lines, signalRules.offer);

  if (isAiCompanionIdea(raw) && (!explicit || explicit.length > 60 || /养老|接回家/.test(explicit))) {
    return "根据用户提供的内容，先训练一个带长期记忆和陪伴设定的 AI 伴侣档案或原型体验。";
  }

  if (explicit) {
    return explicit;
  }

  if (isAiCompanionIdea(raw)) {
    return "根据用户提供的内容，先训练一个带长期记忆和陪伴设定的 AI 伴侣档案或原型体验。";
  }

  return "";
}

function inferConstraints(lines: string[], raw: string) {
  const explicit = firstMatchingLine(lines, signalRules.constraints);

  if (isAiCompanionIdea(raw)) {
    return [
      explicit && /不能|不要|不得|隐私|合规|限制|no |not |without/i.test(explicit) ? explicit : "",
      "涉及长期记忆、亲密关系、隐私数据、情感依赖和养老陪伴；不能承诺替代真实伴侣、医疗养老照护、永久保存、安全无风险或未来硬件接回。"
    ]
      .filter(Boolean)
      .join(" ");
  }

  return explicit;
}

function inferBlocker(input: IdeaRiskInput) {
  if (isAiCompanionIdea(Object.values(input).join(" "))) {
    return "需要先验证用户是否愿意提交私人内容来建立 AI 伴侣档案，以及长期记忆、隐私保存、情感依赖和养老陪伴承诺是否安全可交付。";
  }

  return (
    input.constraints ||
    input.validationPlan ||
    "The route is not ready until buyer, proof, channel, and stop rule are visible."
  );
}

function clipped(value: string, maxLength = 360) {
  const text = normalizeText(value);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function fallbackSummary(lines: string[], raw: string) {
  const withoutTitle = lines.slice(1).join(" ");
  return clipped(withoutTitle || raw, 520);
}

function completionScore(input: IdeaRiskInput) {
  const fields = Object.values(input);
  return Math.round((fields.filter((value) => value.trim().length >= 8).length / fields.length) * 100);
}

function missingHintsFor(input: IdeaRiskInput) {
  const missing: string[] = [];

  if (input.targetUser.trim().length < 18) {
    missing.push("Name the first reachable buyer or user group.");
  }

  if (input.offer.trim().length < 18) {
    missing.push("Describe the smallest first offer or result.");
  }

  if (input.existingAssets.trim().length < 18) {
    missing.push("Add one proof asset, source, screenshot, case, or link.");
  }

  if (input.acquisitionChannel.trim().length < 18) {
    missing.push("Name the first channel where real people will see it.");
  }

  if (input.validationPlan.trim().length < 18) {
    missing.push("Define what evidence would count within 48 hours, 7 days, or 30 days.");
  }

  if (input.constraints.trim().length < 18) {
    missing.push("State what the route must not claim, use, or promise.");
  }

  return missing.slice(0, 6);
}

function detected(label: string, value: string) {
  return value.trim().length
    ? {
        label,
        value: clipped(value, 150)
      }
    : null;
}

export function interpretProjectBrief(input: ProjectBriefInput): ProjectBriefInterpretation {
  const raw = input.rawIdeaText.trim();
  const assets = input.optionalAssets.trim();
  const lines = splitLines(raw);
  const projectName = clipped(inferProjectName(lines, raw), 90);
  const ideaSummary = fallbackSummary(lines, raw);
  const targetUser = inferTargetUser(lines, raw);
  const offer = inferOffer(lines, raw);
  const existingAssets = assets || firstMatchingLine(lines, signalRules.assets);
  const acquisitionChannel = firstMatchingLine(lines, signalRules.channel);
  const resources = firstMatchingLine(lines, signalRules.resources);
  const constraints = inferConstraints(lines, raw);
  const validationPlan = firstMatchingLine(lines, signalRules.validation);

  const ideaRiskInput: IdeaRiskInput = {
    projectName,
    ideaSummary,
    targetUser,
    offer,
    existingAssets,
    acquisitionChannel,
    resources,
    constraints,
    validationPlan
  };

  const planDraftInput: PlanDraftInput = {
    projectName,
    projectType: includesAny(raw, ["content", "research", "内容", "研究"])
      ? "Content or research product"
      : includesAny(raw, ["dashboard", "tool", "app", "平台", "应用", "工具", "看板"])
        ? "Tool or dashboard"
        : "AI service or automation",
    targetUser,
    currentGoal: isAiCompanionIdea(raw)
      ? "先判断能否做出安全、可解释、可验证的首个 AI 伴侣档案体验，而不是直接建设完整平台或承诺未来长期保存。"
      : ideaSummary,
    existingAssets,
    blocker: inferBlocker(ideaRiskInput),
    timeWindow: includesAny(raw, ["48", "两天", "2天"]) ? "48 hours" : includesAny(raw, ["30", "一个月"]) ? "30 days" : "7 days",
    executionMode: includesAny(raw, ["帮我", "operator", "review", "人工", "服务"])
      ? "I need operator review"
      : "I will execute myself",
    researchCarrier: "Carrier-neutral",
    constraints
  };

  const detectedSignals = [
    detected("Project", projectName),
    detected("Idea", ideaSummary),
    detected("Buyer", targetUser),
    detected("Offer", offer),
    detected("Proof", existingAssets),
    detected("Channel", acquisitionChannel),
    detected("Validation", validationPlan)
  ].filter(Boolean) as ProjectBriefInterpretation["detectedSignals"];

  return {
    ideaRiskInput,
    planDraftInput,
    detectedSignals,
    missingHints: missingHintsFor(ideaRiskInput),
    completionScore: completionScore(ideaRiskInput)
  };
}
