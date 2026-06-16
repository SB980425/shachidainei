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
  buyer: ["target", "buyer", "user", "customer", "audience", "for ", "用户", "客户", "受众", "人群", "买家", "目标"],
  offer: ["offer", "receive", "deliver", "service", "tool", "product", "提供", "交付", "服务", "工具", "产品", "得到"],
  assets: ["asset", "proof", "demo", "screenshot", "source", "case", "link", "已有", "证据", "截图", "链接", "案例", "材料", "演示"],
  channel: ["channel", "outreach", "search", "community", "post", "email", "渠道", "推广", "流量", "私信", "社群", "搜索", "发布"],
  resources: ["resource", "budget", "operator", "days", "week", "time", "资源", "预算", "人手", "时间", "天", "周"],
  constraints: ["constraint", "risk", "no ", "not ", "without", "限制", "风险", "不能", "不要", "不得", "合规", "隐私"],
  validation: ["validate", "validation", "test", "reply", "message", "signal", "验证", "测试", "回复", "反馈", "信号", "访谈"]
};

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

function firstMatchingLine(lines: string[], terms: string[]) {
  return lines.find((line) => includesAny(line, terms)) ?? "";
}

function firstMeaningfulLine(lines: string[]) {
  return lines.find((line) => line.length >= 4 && line.length <= 90) ?? "";
}

function inferProjectName(lines: string[], raw: string) {
  const firstLine = firstMeaningfulLine(lines);
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

  return firstLine || "Untitled project";
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
  const targetUser = firstMatchingLine(lines, signalRules.buyer);
  const offer = firstMatchingLine(lines, signalRules.offer);
  const existingAssets = assets || firstMatchingLine(lines, signalRules.assets);
  const acquisitionChannel = firstMatchingLine(lines, signalRules.channel);
  const resources = firstMatchingLine(lines, signalRules.resources);
  const constraints = firstMatchingLine(lines, signalRules.constraints);
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
    currentGoal: ideaSummary,
    existingAssets,
    blocker: constraints || validationPlan || "The route is not ready until buyer, proof, channel, and stop rule are visible.",
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
