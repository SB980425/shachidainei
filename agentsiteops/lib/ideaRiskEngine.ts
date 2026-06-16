export type IdeaRiskInput = {
  projectName: string;
  ideaSummary: string;
  targetUser: string;
  offer: string;
  existingAssets: string;
  acquisitionChannel: string;
  resources: string;
  constraints: string;
  validationPlan: string;
};

export type IdeaRiskSource = {
  id: string;
  name: string;
  publisher: string;
  url: string;
  sourceType: "failure analysis" | "research report" | "case library" | "management research";
  useFor: string;
  limitation: string;
};

export type IdeaRiskNode = {
  id: string;
  label: string;
  severity: "high" | "medium" | "watch";
  score: number;
  why: string;
  attention: string;
  requiredEvidence: string;
  nextAction: string;
  sources: string[];
};

export type IdeaRiskReport = {
  readinessScore: number;
  confidenceLabel: "Needs input" | "Testable draft" | "Ready for review";
  selectedRoute: string;
  routeReason: string;
  topRisks: IdeaRiskNode[];
  evidenceGaps: string[];
  timePlan: string[];
  sourceBasis: IdeaRiskSource[];
  stopRule: string;
  brief: string;
};

export const emptyIdeaRiskInput: IdeaRiskInput = {
  projectName: "",
  ideaSummary: "",
  targetUser: "",
  offer: "",
  existingAssets: "",
  acquisitionChannel: "",
  resources: "",
  constraints: "",
  validationPlan: ""
};

export const exampleIdeaRiskInput: IdeaRiskInput = {
  projectName: "AI intake helper for solo consultants",
  ideaSummary:
    "A lightweight service that turns messy client requests into a scoped project brief, follow-up questions, and a first deliverable checklist.",
  targetUser:
    "Solo consultants and small service operators who repeatedly receive unclear client requests and lose time clarifying scope.",
  offer:
    "A free intake template plus a manual setup offer that configures the first client intake workflow in 72 hours.",
  existingAssets:
    "Two before-after workflow notes, one screenshot of the intake sheet, and three example client request messages with private details removed.",
  acquisitionChannel:
    "Direct outreach to consultants with public service pages, plus one public walkthrough post showing the before-after workflow.",
  resources:
    "One operator, 7-day validation window, no paid ads, no engineering build before at least five qualified replies.",
  constraints:
    "No private client data in public output, no revenue guarantee, no automated account access, no regulated advice.",
  validationPlan:
    "Send 30 targeted messages, collect qualified replies, record objections, and stop if no one agrees to review the workflow."
};

export const ideaRiskSources: IdeaRiskSource[] = [
  {
    id: "cb-insights-failure-reasons",
    name: "Why Startups Fail: Top Reasons",
    publisher: "CB Insights",
    url: "https://www.cbinsights.com/research/report/startup-failure-reasons-top/",
    sourceType: "failure analysis",
    useFor:
      "Failure-pattern checks such as lack of product-market fit, cash pressure, legal trouble, competition, pricing, team, and timing risk.",
    limitation:
      "Post-mortem categories are broad. They guide questions but do not predict one project outcome."
  },
  {
    id: "lean-startup-validated-learning",
    name: "Validated Learning and Build-Measure-Learn",
    publisher: "The Lean Startup",
    url: "https://theleanstartup.com/principles",
    sourceType: "management research",
    useFor:
      "Turning ideas into testable assumptions, measurable checkpoints, and pivot-or-persevere decisions.",
    limitation:
      "Methodology does not replace first-party buyer evidence."
  },
  {
    id: "yc-talk-to-users",
    name: "How to Talk to Users",
    publisher: "Y Combinator Startup Library",
    url: "https://www.ycombinator.com/library/Iq-how-to-talk-to-users",
    sourceType: "management research",
    useFor:
      "Checking whether the target user, pain, and first validation channel are specific enough to test.",
    limitation:
      "User interview advice must be applied to real reachable users, not abstract personas."
  },
  {
    id: "startup-genome-premature-scaling",
    name: "Why Startups Fail: Premature Scaling",
    publisher: "Startup Genome",
    url: "https://startupgenome.com/insights",
    sourceType: "research report",
    useFor:
      "Premature scaling checks before hiring, paid acquisition, multi-channel growth, large content batches, or product expansion.",
    limitation:
      "Growth-stage patterns need manual interpretation for small early projects."
  },
  {
    id: "steve-blank-customer-development",
    name: "Customer Development",
    publisher: "Steve Blank",
    url: "https://steveblank.com/category/customer-development/",
    sourceType: "management research",
    useFor:
      "Framing startups as a search for a repeatable business model rather than execution of an assumed plan.",
    limitation:
      "Customer development gives a process; it does not certify market demand by itself."
  }
];

type RiskTemplate = {
  id: string;
  label: string;
  baseScore: number;
  sources: string[];
  test: (input: IdeaRiskInput, text: string) => boolean;
  why: (input: IdeaRiskInput) => string;
  attention: string;
  requiredEvidence: string;
  nextAction: string;
};

const broadAudienceTerms = [
  "everyone",
  "anyone",
  "all users",
  "all people",
  "businesses",
  "companies",
  "creators",
  "founders",
  "users",
  "customers",
  "所有人",
  "任何人",
  "全部用户",
  "企业",
  "公司",
  "创作者",
  "用户",
  "客户",
  "大家"
];

const productBuildTerms = [
  "platform",
  "marketplace",
  "app",
  "saas",
  "dashboard",
  "automation system",
  "ai agent",
  "subscription",
  "community",
  "course",
  "平台",
  "应用",
  "小程序",
  "工具",
  "看板",
  "自动化系统",
  "智能体",
  "订阅",
  "社群",
  "课程"
];

const scaleTerms = [
  "scale",
  "viral",
  "ads",
  "paid ads",
  "hire",
  "team",
  "global",
  "international",
  "1000",
  "100k",
  "mass",
  "many channels",
  "content farm",
  "扩大",
  "规模化",
  "投放",
  "广告",
  "招聘",
  "团队",
  "全球",
  "全网",
  "爆款",
  "大量渠道",
  "内容矩阵"
];

const proofTerms = [
  "demo",
  "screenshot",
  "link",
  "customer",
  "payment",
  "reply",
  "interview",
  "case",
  "example",
  "walkthrough",
  "source",
  "data",
  "export",
  "演示",
  "截图",
  "链接",
  "客户",
  "付款",
  "回复",
  "访谈",
  "案例",
  "样例",
  "数据",
  "导出",
  "材料",
  "源码",
  "笔记"
];

const riskyBoundaryTerms = [
  "medical",
  "legal",
  "finance",
  "investment",
  "health",
  "scrape",
  "private data",
  "account access",
  "guarantee",
  "guaranteed",
  "copy",
  "copyright",
  "personal data",
  "regulated",
  "医疗",
  "法律",
  "金融",
  "投资",
  "健康",
  "爬取",
  "隐私",
  "账号",
  "保证",
  "版权",
  "个人数据",
  "监管",
  "合规"
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function hasText(value: string, minLength = 8) {
  return value.trim().length >= minLength;
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term.toLowerCase()));
}

function countCompleteFields(input: IdeaRiskInput) {
  return Object.values(input).filter((value) => hasText(value)).length;
}

const riskTemplates: RiskTemplate[] = [
  {
    id: "unclear-buyer",
    label: "Buyer is too broad",
    baseScore: 92,
    sources: ["cb-insights-failure-reasons", "yc-talk-to-users", "steve-blank-customer-development"],
    test: (input) =>
      !hasText(input.targetUser, 18) || includesAny(normalizeText(input.targetUser), broadAudienceTerms),
    why: () =>
      "The first reachable buyer is not specific enough to judge pain, channel, budget, or proof.",
    attention:
      "A broad audience makes every later output look plausible but hard to test.",
    requiredEvidence:
      "Name one buyer segment with repeated behavior, reachable channel, existing workaround, and reason to respond now.",
    nextAction:
      "Rewrite the target user as one narrow group and list 10 reachable examples before changing the offer."
  },
  {
    id: "weak-pain",
    label: "Problem may not be painful enough",
    baseScore: 84,
    sources: ["cb-insights-failure-reasons", "lean-startup-validated-learning", "yc-talk-to-users"],
    test: (input) => !hasText(input.ideaSummary, 40) || !hasText(input.offer, 24),
    why: () =>
      "The idea or offer does not yet show a repeated problem, urgent trigger, or concrete before-after change.",
    attention:
      "Nice-to-have tools are difficult to validate because users can praise them without changing behavior.",
    requiredEvidence:
      "Collect problem statements, repeated manual work examples, current workaround, and a reason the buyer would act this week.",
    nextAction:
      "Ask five target users to describe the last time this problem cost time, money, reputation, or delivery quality."
  },
  {
    id: "missing-proof-asset",
    label: "No inspectable proof asset",
    baseScore: 88,
    sources: ["lean-startup-validated-learning", "steve-blank-customer-development"],
    test: (input) => !hasText(input.existingAssets, 20) || !includesAny(normalizeText(input.existingAssets), proofTerms),
    why: () =>
      "The project does not yet provide something another person can inspect before trusting the route.",
    attention:
      "Without a proof asset, the output becomes opinion instead of a route someone can verify.",
    requiredEvidence:
      "One demo, screenshot, walkthrough, anonymized example, source note, buyer reply, or payment record.",
    nextAction:
      "Produce one small public or private proof asset before building a larger product or page system."
  },
  {
    id: "premature-product-build",
    label: "Building too much too early",
    baseScore: 80,
    sources: ["startup-genome-premature-scaling", "lean-startup-validated-learning"],
    test: (input, text) => includesAny(text, productBuildTerms) && !includesAny(normalizeText(input.existingAssets), proofTerms),
    why: () =>
      "The description points toward a product, platform, or system before the first buyer proof is visible.",
    attention:
      "This is a common early-stage trap: build surface area expands before the route has been accepted by the market.",
    requiredEvidence:
      "A narrow proof asset, a qualified buyer reply, and one manually deliverable version of the offer.",
    nextAction:
      "Replace the product build with a 48-hour manual proof or one-page walkthrough."
  },
  {
    id: "premature-scaling",
    label: "Premature scaling risk",
    baseScore: 78,
    sources: ["startup-genome-premature-scaling"],
    test: (_input, text) => includesAny(text, scaleTerms),
    why: () =>
      "The project mentions growth, paid channels, scale, hiring, or broad expansion before a repeatable validation signal is named.",
    attention:
      "Scaling work can consume budget and attention while hiding that the base route is still unproven.",
    requiredEvidence:
      "Repeatable buyer response, working acquisition channel, delivery capacity, and a stop rule.",
    nextAction:
      "Freeze expansion until the first validation loop produces qualified replies or a clear rejection pattern."
  },
  {
    id: "weak-acquisition-channel",
    label: "Acquisition channel is not testable",
    baseScore: 82,
    sources: ["yc-talk-to-users", "steve-blank-customer-development"],
    test: (input) => !hasText(input.acquisitionChannel, 20),
    why: () =>
      "The project does not yet name how the first real users or buyers will be reached.",
    attention:
      "A strong idea with no reachable channel still cannot be validated.",
    requiredEvidence:
      "A named channel, target list, message, source of prospects, and signal that counts as interest.",
    nextAction:
      "Pick one channel for seven days and define the exact action that counts as a qualified response."
  },
  {
    id: "resource-runway",
    label: "Time or resource window is unclear",
    baseScore: 74,
    sources: ["cb-insights-failure-reasons", "lean-startup-validated-learning"],
    test: (input) => !hasText(input.resources, 16),
    why: () =>
      "The project does not state time, budget, labor, delivery capacity, or the window for deciding continue versus stop.",
    attention:
      "Resource ambiguity makes planning look useful but prevents a real execution decision.",
    requiredEvidence:
      "Available hours, budget limit, owner, delivery capacity, and review date.",
    nextAction:
      "Set a 7-day or 14-day validation window and name what will be stopped if evidence does not appear."
  },
  {
    id: "rights-or-compliance",
    label: "Rights, privacy, or compliance boundary",
    baseScore: 86,
    sources: ["cb-insights-failure-reasons"],
    test: (input, text) => includesAny(text, riskyBoundaryTerms) && !hasText(input.constraints, 24),
    why: () =>
      "The project touches data, claims, copying, regulated topics, or account access without a clear boundary.",
    attention:
      "A route can be commercially interesting and still blocked if data rights or claims are unsafe.",
    requiredEvidence:
      "Allowed source material, forbidden claims, privacy boundary, and delivery exclusions.",
    nextAction:
      "Write the blocked claims and excluded data before publishing, selling, or researching the route."
  },
  {
    id: "no-validation-plan",
    label: "No validation channel",
    baseScore: 90,
    sources: ["lean-startup-validated-learning", "yc-talk-to-users", "steve-blank-customer-development"],
    test: (input) => !hasText(input.validationPlan, 24),
    why: () =>
      "The project cannot yet say what evidence would make it continue, repair, pivot, or stop.",
    attention:
      "Without a validation channel, the plan can keep improving internally while never meeting a buyer signal.",
    requiredEvidence:
      "First channel, target count, outreach or test artifact, signal that counts, signal that does not count, and review date.",
    nextAction:
      "Create a 48-hour or 7-day validation loop before committing to product, content, or paid acquisition."
  },
  {
    id: "route-file-incomplete",
    label: "Route File would be incomplete",
    baseScore: 76,
    sources: ["lean-startup-validated-learning", "steve-blank-customer-development"],
    test: (input) => countCompleteFields(input) < 7,
    why: () =>
      "The input does not yet contain enough context to produce a selected route, rejected alternatives, evidence ledger, validation channel, and stop rule.",
    attention:
      "This is not failure by itself. It means the project should stay in free test or Plan Studio before manual acceptance.",
    requiredEvidence:
      "Project summary, buyer, offer, proof asset, channel, resource window, constraints, and validation plan.",
    nextAction:
      "Fill the missing fields, then move to Plan Studio or Review Status instead of asking for final delivery."
  }
];

function severityFromScore(score: number): IdeaRiskNode["severity"] {
  if (score >= 86) {
    return "high";
  }

  if (score >= 76) {
    return "medium";
  }

  return "watch";
}

function selectedRoute(input: IdeaRiskInput, risks: IdeaRiskNode[]) {
  const text = normalizeText(Object.values(input).join(" "));
  const hasProof = includesAny(normalizeText(input.existingAssets), proofTerms);
  const hasBuyer = hasText(input.targetUser, 24) && !includesAny(normalizeText(input.targetUser), broadAudienceTerms);
  const hasChannel = hasText(input.acquisitionChannel, 20);
  const highRisk = risks.some((risk) => risk.severity === "high");

  if (!hasBuyer) {
    return "Buyer-definition sprint";
  }

  if (!hasProof) {
    return "First proof asset sprint";
  }

  if (!hasChannel) {
    return "Channel validation sprint";
  }

  if (highRisk) {
    return "Repair before Route File";
  }

  if (includesAny(text, ["service", "consultant", "done-for-you", "manual", "服务", "顾问", "人工"])) {
    return "Manual service route test";
  }

  return "Route File candidate";
}

function buildEvidenceGaps(input: IdeaRiskInput, risks: IdeaRiskNode[]) {
  const gaps = risks.slice(0, 5).map((risk) => risk.requiredEvidence);

  if (!hasText(input.validationPlan, 24)) {
    gaps.unshift("A validation plan with target count, channel, signal, and review date.");
  }

  return [...new Set(gaps)].slice(0, 6);
}

function buildTimePlan(input: IdeaRiskInput, route: string, risks: IdeaRiskNode[]) {
  const topRisk = risks[0]?.label ?? "Unclear route";
  const project = input.projectName.trim() || "this project";

  return [
    `0-24 hours: Freeze the project question for ${project}; do not add product, checkout, or content scope.`,
    `48 hours: Repair the highest-risk node first: ${topRisk}. Collect only the evidence needed for that node.`,
    `Day 3: Produce one inspectable proof asset or source note for the selected route: ${route}.`,
    "Day 7: Test one acquisition or validation channel and record qualified replies, objections, or silence.",
    "Day 14: Decide continue, repair, pivot, or stop. Do not scale content, ads, hiring, or product build without evidence.",
    "Day 30: Re-open the evidence ledger. Keep only claims supported by source material, user response, usage, or payment records."
  ];
}

function confidenceFromScore(score: number): IdeaRiskReport["confidenceLabel"] {
  if (score >= 78) {
    return "Ready for review";
  }

  if (score >= 48) {
    return "Testable draft";
  }

  return "Needs input";
}

export function createIdeaRiskReport(input: IdeaRiskInput): IdeaRiskReport {
  const text = normalizeText(Object.values(input).join(" "));
  const triggeredRisks = riskTemplates
    .filter((risk) => risk.test(input, text))
    .map<IdeaRiskNode>((risk) => ({
      id: risk.id,
      label: risk.label,
      score: risk.baseScore,
      severity: severityFromScore(risk.baseScore),
      why: risk.why(input),
      attention: risk.attention,
      requiredEvidence: risk.requiredEvidence,
      nextAction: risk.nextAction,
      sources: risk.sources
    }));
  const fallbackRiskIds = new Set(triggeredRisks.map((risk) => risk.id));
  const fallbackRisks = riskTemplates
    .filter((risk) => !fallbackRiskIds.has(risk.id))
    .slice(0, 2)
    .map<IdeaRiskNode>((risk) => ({
      id: risk.id,
      label: risk.label,
      score: Math.max(52, risk.baseScore - 24),
      severity: "watch",
      why: "No strong trigger was found yet, but this node should stay on the watch list for early projects.",
      attention: risk.attention,
      requiredEvidence: risk.requiredEvidence,
      nextAction: risk.nextAction,
      sources: risk.sources
    }));
  const topRisks = [...triggeredRisks, ...fallbackRisks].sort((a, b) => b.score - a.score).slice(0, 5);
  const completedFields = countCompleteFields(input);
  const penalty = topRisks.reduce((sum, risk) => sum + (risk.severity === "high" ? 8 : risk.severity === "medium" ? 5 : 2), 0);
  const readinessScore = Math.max(0, Math.min(100, completedFields * 11 - penalty + 12));
  const confidenceLabel = confidenceFromScore(readinessScore);
  const route = selectedRoute(input, topRisks);
  const evidenceGaps = buildEvidenceGaps(input, topRisks);
  const timePlan = buildTimePlan(input, route, topRisks);
  const sourceIds = new Set(topRisks.flatMap((risk) => risk.sources));
  const sourceBasis = ideaRiskSources.filter((source) => sourceIds.has(source.id));
  const routeReason =
    confidenceLabel === "Needs input"
      ? "The idea can be tested, but the input is not strong enough to become a route decision yet."
      : `The route focuses on the most repairable path before broader build work starts: ${route}.`;
  const stopRule =
    "Stop or repair before building if the project cannot name a specific buyer, first proof asset, validation channel, source boundary, and review date.";

  const brief = [
    `Project: ${input.projectName.trim() || "Untitled idea"}`,
    `Selected test route: ${route}`,
    `Readiness: ${readinessScore}/100 (${confidenceLabel})`,
    "",
    "Top failure nodes:",
    ...topRisks.map((risk) => `- ${risk.label}: ${risk.why} Evidence needed: ${risk.requiredEvidence}`),
    "",
    "Time checkpoints:",
    ...timePlan.map((item) => `- ${item}`),
    "",
    "Source basis:",
    ...sourceBasis.map((source) => `- ${source.publisher}: ${source.name} (${source.url})`),
    "",
    `Stop rule: ${stopRule}`
  ].join("\n");

  return {
    readinessScore,
    confidenceLabel,
    selectedRoute: route,
    routeReason,
    topRisks,
    evidenceGaps,
    timePlan,
    sourceBasis,
    stopRule,
    brief
  };
}
