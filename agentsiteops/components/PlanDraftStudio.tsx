"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  RefreshCw,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import {
  createPlanDraft,
  executionModeOptions,
  projectTypeOptions,
  researchCarrierOptions,
  timeWindowOptions,
  type PlanDraftInput
} from "@/lib/planDraft";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";

const emptyInput: PlanDraftInput = {
  projectName: "",
  projectType: "AI service or automation",
  targetUser: "",
  currentGoal: "",
  existingAssets: "",
  blocker: "",
  timeWindow: "7 days",
  executionMode: "I will execute myself",
  researchCarrier: "Carrier-neutral",
  constraints: ""
};

const exampleInputByLanguage: Record<SiteLanguage, PlanDraftInput> = {
  en: {
    projectName: "AI client support workflow",
    projectType: "AI service or automation",
    targetUser: "Small service teams that repeat manual support triage every week",
    currentGoal: "Choose the first service route before building a dashboard or checkout page",
    existingAssets:
      "One before-after workflow note, two support examples, a rough landing page, and manual delivery capacity",
    blocker:
      "Too many possible offers: automation setup, dashboard, training pack, or done-for-you implementation",
    timeWindow: "7 days",
    executionMode: "I need operator review",
    researchCarrier: "Operator-selected carrier",
    constraints:
      "No guaranteed revenue, no private customer data in public output, no claim that the website runs hidden research"
  },
  zh: {
    projectName: "AI 客户支持流程",
    projectType: "AI service or automation",
    targetUser: "每周重复处理客服分流的小型服务团队",
    currentGoal: "先选定第一个服务路线，再决定是否建设仪表板或收款页面",
    existingAssets: "一份前后流程笔记、两个客服案例、一个粗糙页面和人工交付能力",
    blocker: "可选方向太多：自动化搭建、仪表板、培训包或代实施服务",
    timeWindow: "7 days",
    executionMode: "I need operator review",
    researchCarrier: "Operator-selected carrier",
    constraints: "不承诺收入，不在公开输出中使用私有客户数据，不声称网站会运行隐藏研究"
  }
};

const planDraftStorageKey = "agentsiteops.planDraftInput.v1";
const planBriefStorageKey = "agentsiteops.planDraftBrief.v1";
const planDraftSourceStorageKey = "agentsiteops.planDraftSource.v1";

type PlanDraftSource = {
  rawIdeaText?: string;
  optionalAssets?: string;
  detectedSignals?: Array<{ label: string; value: string }>;
  missingHints?: string[];
  completionScore?: number;
  savedAt?: string;
  language?: SiteLanguage;
};

type PlanField = {
  key: keyof PlanDraftInput;
  label: Record<SiteLanguage, string>;
  prompt: Record<SiteLanguage, string>;
  helper: Record<SiteLanguage, string>;
} & (
  | {
      kind: "input" | "textarea";
      placeholder: Record<SiteLanguage, string>;
      rows?: number;
    }
  | {
      kind: "select";
      options: string[];
    }
);

const planQuestionGroups: Array<{
  number: string;
  title: Record<SiteLanguage, string>;
  description: Record<SiteLanguage, string>;
  fields: PlanField[];
}> = [
  {
    number: "01",
    title: { en: "Route frame", zh: "路线框架" },
    description: {
      en: "Name the project and define the decision this draft must resolve.",
      zh: "先命名项目，并定义这份草稿必须解决的决策。"
    },
    fields: [
      {
        key: "projectName",
        kind: "input",
        label: { en: "Project name", zh: "项目名称" },
        prompt: {
          en: "Give the work a short name so the route file can refer to it consistently.",
          zh: "给项目一个短名称，后续路线文件才能统一引用。"
        },
        helper: {
          en: "A working name is enough. Do not spend time branding the idea yet.",
          zh: "临时名称即可，不需要先做品牌命名。"
        },
        placeholder: {
          en: "Example: AI client support workflow",
          zh: "示例：AI 客户支持流程"
        }
      },
      {
        key: "projectType",
        kind: "select",
        label: { en: "Project type", zh: "项目类型" },
        prompt: {
          en: "Choose the closest category so the draft can pick the right route pattern.",
          zh: "选择最接近的类型，让草稿采用合适的路线模式。"
        },
        helper: {
          en: "If the project is still unclear, choose Unsure and use the blocker field to explain why.",
          zh: "如果项目仍不清楚，选择暂不确定，并在阻塞点里说明原因。"
        },
        options: projectTypeOptions
      },
      {
        key: "currentGoal",
        kind: "textarea",
        label: { en: "Current goal", zh: "当前目标" },
        prompt: {
          en: "State the one decision the plan must make before more pages, tools, or offers are built.",
          zh: "说明继续做页面、工具或报价前，当前必须先做出的一个决定。"
        },
        helper: {
          en: "Good input names the next decision, not a broad ambition.",
          zh: "有效输入应命名下一个决策，而不是宽泛愿望。"
        },
        placeholder: {
          en: "Choose one first route before building a dashboard, checkout page, or content system.",
          zh: "先选定一条路线，再决定是否建设仪表板、收款页或内容系统。"
        },
        rows: 4
      }
    ]
  },
  {
    number: "02",
    title: { en: "Audience and proof", zh: "用户与证据" },
    description: {
      en: "Separate who this is for from what evidence already exists.",
      zh: "把服务对象和已经存在的证据分开。"
    },
    fields: [
      {
        key: "targetUser",
        kind: "textarea",
        label: { en: "Target user", zh: "目标用户" },
        prompt: {
          en: "Describe the first reachable buyer, operator, reader, or user with a repeated problem.",
          zh: "描述第一个可触达、且有重复问题的买家、操作者、读者或用户。"
        },
        helper: {
          en: "Avoid everyone, creators, companies, or vague markets. Name a concrete user group.",
          zh: "避免“所有人、创作者、企业”等模糊市场，要写具体人群。"
        },
        placeholder: {
          en: "Small service teams that repeat manual support triage every week.",
          zh: "每周重复处理客服分流的小型服务团队。"
        },
        rows: 4
      },
      {
        key: "existingAssets",
        kind: "textarea",
        label: { en: "Existing assets", zh: "已有资产" },
        prompt: {
          en: "List what can be inspected now: notes, links, screenshots, demos, examples, or source material.",
          zh: "列出现在可检查的材料：笔记、链接、截图、演示、案例或来源资料。"
        },
        helper: {
          en: "Only include material you can actually provide or verify.",
          zh: "只写你确实能提供或核验的材料。"
        },
        placeholder: {
          en: "One workflow note, two examples, a rough page, screenshots, source links, manual delivery capacity.",
          zh: "一份流程笔记、两个案例、一个粗糙页面、截图、来源链接、人工交付能力。"
        },
        rows: 5
      }
    ]
  },
  {
    number: "03",
    title: { en: "Decision boundary", zh: "决策边界" },
    description: {
      en: "Make the blocked decision and the forbidden claims visible.",
      zh: "把卡住的决策和不能声称的内容暴露出来。"
    },
    fields: [
      {
        key: "blocker",
        kind: "textarea",
        label: { en: "Current blocker", zh: "当前阻塞点" },
        prompt: {
          en: "Name the choice you cannot make yet and the alternatives that keep pulling attention.",
          zh: "写出现在无法做出的选择，以及不断分散注意力的备选方向。"
        },
        helper: {
          en: "This is the reason the route draft exists.",
          zh: "这就是路线草稿存在的原因。"
        },
        placeholder: {
          en: "I cannot choose between automation setup, dashboard, training pack, and done-for-you implementation.",
          zh: "我无法在自动化搭建、仪表板、培训包和代实施服务之间选择。"
        },
        rows: 4
      },
      {
        key: "constraints",
        kind: "textarea",
        label: { en: "Constraints", zh: "约束条件" },
        prompt: {
          en: "Write the claims, data, delivery, payment, risk, and timeline limits that the route must respect.",
          zh: "写出路线必须遵守的声明、数据、交付、付款、风险和时间限制。"
        },
        helper: {
          en: "This prevents the plan from implying hidden automation, guaranteed outcomes, or unavailable proof.",
          zh: "这会防止计划暗示隐藏自动化、保证结果或不存在的证据。"
        },
        placeholder: {
          en: "No guaranteed revenue, no private customer data in public output, no hidden research claim.",
          zh: "不保证收入，不在公开输出中使用私有客户数据，不声称隐藏研究。"
        },
        rows: 5
      }
    ]
  },
  {
    number: "04",
    title: { en: "Operating choices", zh: "执行选择" },
    description: {
      en: "Choose how this draft should move from browser-local plan to review or intake.",
      zh: "选择这份浏览器本地草稿如何进入审核或提交。"
    },
    fields: [
      {
        key: "executionMode",
        kind: "select",
        label: { en: "Execution mode", zh: "执行模式" },
        prompt: {
          en: "Decide whether you want to execute alone or send this for operator review.",
          zh: "决定你是自己执行，还是发送给操作员审核。"
        },
        helper: {
          en: "This affects whether the next step is self-run, manual review, implementation help, or research only.",
          zh: "这会影响下一步是自助执行、人工审核、实施协助，还是只做研究。"
        },
        options: executionModeOptions
      },
      {
        key: "researchCarrier",
        kind: "select",
        label: { en: "Research carrier", zh: "研究载体" },
        prompt: {
          en: "Choose the research source style without locking the product to one AI platform.",
          zh: "选择研究来源方式，但不把产品绑定到某一个 AI 平台。"
        },
        helper: {
          en: "Carrier-neutral keeps the plan portable across manual review, client reports, or AI research tools.",
          zh: "载体中立能让计划在人工审查、客户报告或 AI 研究工具之间迁移。"
        },
        options: researchCarrierOptions
      },
      {
        key: "timeWindow",
        kind: "select",
        label: { en: "Review window", zh: "审核窗口" },
        prompt: {
          en: "Set the time box for deciding whether to continue, repair, pivot, or stop.",
          zh: "设定何时决定继续、修复、转向或停止。"
        },
        helper: {
          en: "Shorter windows are better for route selection than open-ended exploration.",
          zh: "路线选择更适合短窗口，不适合无限探索。"
        },
        options: timeWindowOptions
      }
    ]
  }
];

const planFields = planQuestionGroups.flatMap((group) => group.fields);

type SaveStateKey = "ready" | "restored" | "unavailable" | "saved" | "example" | "cleared";

const optionLabels: Record<SiteLanguage, Record<string, string>> = {
  en: {},
  zh: {
    "AI service or automation": "AI 服务或自动化",
    "Content or research product": "内容或研究产品",
    "Tool or dashboard": "工具或仪表板",
    "Local service offer": "本地服务报价",
    "Template or workflow pack": "模板或流程包",
    Unsure: "暂不确定",
    "I will execute myself": "我将自己执行",
    "I need operator review": "我需要操作员审核",
    "I need manual implementation help": "我需要人工实施协助",
    "I only need research first": "我只需要先做研究",
    "Carrier-neutral": "载体中立",
    "Manual source review": "人工来源审查",
    "Client-provided report": "客户提供报告",
    "ChatGPT Deep Research": "ChatGPT Deep Research",
    "Gemini or Perplexity": "Gemini 或 Perplexity",
    "Operator-selected carrier": "操作员选择载体",
    "48 hours": "48 小时",
    "7 days": "7 天",
    "14 days": "14 天",
    "30 days": "30 天",
    "No deadline": "无截止时间"
  }
};

const routeLabelsZh: Record<string, string> = {
  "Research-to-route brief": "研究到路线简报",
  "Implementation-backed route file": "实施支撑路线文件",
  "Proof asset first: micro tool or dashboard": "先做证明资产：微型工具或仪表板",
  "Research pack to public sample": "研究包转公开样例",
  "Template pack with validation channel": "带验证渠道的模板包",
  "Manual service route with first buyer proof": "带首个买家证据的人工服务路线",
  "Narrow AI-service route file": "窄 AI 服务路线文件"
};

const evidenceGapZh: Record<string, string> = {
  "Target user or buyer segment is not specific enough.": "目标用户或买家群体还不够具体。",
  "Existing assets, examples, links, or source material are missing.": "缺少已有资产、案例、链接或来源材料。",
  "The current decision blocker is not stated.": "当前决策阻塞点还没有说明。",
  "Claim limits, delivery limits, source rights, or risk boundaries are not visible.":
    "声明限制、交付限制、来源权利或风险边界还不可见。",
  "Buyer proof, first-party usage, payment evidence, and qualified replies still need validation.":
    "买家证明、第一方使用、付款证据和合格回复仍需要验证。"
};

const rejectedAlternativeZh: Record<string, string> = {
  "Build a full product before the first proof asset exists.":
    "在第一个证明资产出现之前就建设完整产品。",
  "Publish broad content before the buyer and validation channel are named.":
    "在买家和验证渠道未命名前发布宽泛内容。",
  "Treat research-tool output as final delivery without coverage review.":
    "未经覆盖检查，就把研究工具输出当成最终交付。",
  "Sell implementation before delivery capacity and scope are visible.":
    "在交付能力和范围清楚前销售实施服务。"
};

const confidenceLabelZh: Record<string, string> = {
  "Needs input": "需要补充",
  Draftable: "可生成草稿",
  "Review ready": "可进入审核"
};

const ui = {
  en: {
    aria: "Plan draft studio",
    input: "Input",
    inputTitle: "Write the project once.",
    inputBody:
      "The draft updates in the browser. No API call, account, payment, or hidden research run is created from this screen.",
    inputRulesAria: "Plan Studio input rules",
    rules: ["No API call", "One field per decision", "Draft before intake"],
    importedDraft: "Imported from your rough idea",
    importedTitle: "The system already filled a draft. Edit what is wrong.",
    importedBody:
      "These fields are inferred from the first paragraph. Treat them as a working translation of the user's words, not confirmed facts.",
    originalIdea: "Original outline",
    guessedField: "Inferred field",
    needsRepair: "Needs repair",
    noImportedDraft: "No rough-idea draft was detected. Use the fields below or start from the idea page.",
    reviewNext: "Review next missing field",
    stepsAria: "Plan Studio steps",
    completionAria: "Plan Studio completion state",
    inputCoverage: "Input coverage",
    fieldsReady: "fields ready",
    savedDraftSuffix: "The intake page can detect the saved draft on this device.",
    findNextMissing: "Find next missing",
    allCoreFields: "All core fields filled",
    ready: "Ready",
    needsInput: "Needs input",
    previous: "Previous",
    nextStep: "Next step",
    step: "Step",
    loadExample: "Load example",
    clear: "Clear",
    inputReadiness: "/100 input readiness",
    selectedDraftRoute: "Selected draft route",
    evidenceGaps: "Evidence gaps",
    rejectedAlternatives: "Rejected alternatives",
    sevenDayPath: "7-day draft path",
    stopRule: "Stop rule",
    handoffAria: "Plan Studio handoff state",
    handoffState: "Handoff state",
    handoffBody:
      "Copy or download the draft, then continue to intake when the project has enough buyer, asset, blocker, and constraint detail for manual acceptance.",
    automatic:
      "Automatic: browser-local draft, autosave, copied packet, email handoff.",
    manual:
      "Manual: scope acceptance, research carrier choice, repair request, Route File judgment.",
    copied: "Copied",
    copyBrief: "Copy plan brief",
    downloaded: "Downloaded",
    downloadDraft: "Download route draft",
    copyIntake: "Copy + intake",
    viewSample: "View sample",
    savedDraftDetected: "Saved drafts can be detected by the intake packet builder on this device.",
    saveState: {
      ready: "Local autosave ready",
      restored: "Restored local draft",
      unavailable: "Local autosave unavailable",
      saved: "Saved locally",
      example: "Example loaded",
      cleared: "Local draft cleared"
    } satisfies Record<SaveStateKey, string>,
    exportTitle: "# AgentSiteOps route draft",
    exportStatus: "## Draft status",
    exportReadiness: "Readiness score",
    exportConfidence: "Confidence",
    exportNextAction: "Next action",
    exportBoundary: "## Boundary",
    exportBoundaryItems: [
      "This exported file is a browser-local draft.",
      "It is not the final Route File.",
      "Manual/operator review is still required before research acceptance or delivery."
    ]
  },
  zh: {
    aria: "计划草稿工作台",
    input: "输入",
    inputTitle: "项目只需要写一次。",
    inputBody:
      "草稿会在浏览器中更新。这个页面不会创建 API 调用、账号、付款或隐藏研究运行。",
    inputRulesAria: "计划工作台输入规则",
    rules: ["不调用 API", "每个字段对应一个决策", "先草稿后提交"],
    importedDraft: "已从你的粗略想法带入",
    importedTitle: "系统已经填好一版草稿。你只需要改不准的地方。",
    importedBody: "这些字段来自第一段白话大纲，是系统把客户语言翻译成专业计划字段，不等于已经被证实。",
    originalIdea: "原始大纲",
    guessedField: "已猜出字段",
    needsRepair: "仍需补充",
    noImportedDraft: "未检测到从想法页带入的草稿。可以直接填写下方字段，或先回想法页输入大纲。",
    reviewNext: "检查下一个缺失项",
    stepsAria: "计划工作台步骤",
    completionAria: "计划工作台完成状态",
    inputCoverage: "输入覆盖度",
    fieldsReady: "项已准备",
    savedDraftSuffix: "提交材料页可以检测本机保存的草稿。",
    findNextMissing: "查找下一个缺失项",
    allCoreFields: "核心字段已填完",
    ready: "已准备",
    needsInput: "需要输入",
    previous: "上一步",
    nextStep: "下一步",
    step: "步骤",
    loadExample: "载入示例",
    clear: "清空",
    inputReadiness: "/100 输入准备度",
    selectedDraftRoute: "选定草稿路线",
    evidenceGaps: "证据缺口",
    rejectedAlternatives: "被否决方案",
    sevenDayPath: "7 天草稿路径",
    stopRule: "停止规则",
    handoffAria: "计划工作台交接状态",
    handoffState: "交接状态",
    handoffBody:
      "复制或下载草稿。只有项目已经具备足够的用户、资产、阻塞点和约束细节时，再继续提交审核。",
    automatic: "自动部分：浏览器本地草稿、自动保存、复制材料包、邮件交接。",
    manual: "人工部分：范围接受、研究载体选择、修复请求、路线文件判断。",
    copied: "已复制",
    copyBrief: "复制计划简报",
    downloaded: "已下载",
    downloadDraft: "下载路线草稿",
    copyIntake: "复制并提交",
    viewSample: "查看样例",
    savedDraftDetected: "提交材料生成器可以检测本机保存的草稿。",
    saveState: {
      ready: "本地自动保存已就绪",
      restored: "已恢复本地草稿",
      unavailable: "本地自动保存不可用",
      saved: "已保存到本机",
      example: "已载入示例",
      cleared: "本地草稿已清空"
    } satisfies Record<SaveStateKey, string>,
    exportTitle: "# AgentSiteOps 路线草稿",
    exportStatus: "## 草稿状态",
    exportReadiness: "准备度分数",
    exportConfidence: "信心状态",
    exportNextAction: "下一步动作",
    exportBoundary: "## 边界",
    exportBoundaryItems: [
      "这个导出文件是浏览器本地草稿。",
      "它不是最终路线文件。",
      "研究接受或交付之前，仍然需要人工或操作员审核。"
    ]
  }
} satisfies Record<SiteLanguage, unknown>;

function localizeOption(option: string, language: SiteLanguage) {
  return optionLabels[language][option] ?? option;
}

function localizeRoute(route: string, language: SiteLanguage) {
  return language === "zh" ? routeLabelsZh[route] ?? route : route;
}

function localizedConfidence(label: string, language: SiteLanguage) {
  return language === "zh" ? confidenceLabelZh[label] ?? label : label;
}

function valueOr(input: string, fallback: string) {
  return input.trim() || fallback;
}

function buildLocalizedSevenDayPlan(
  input: PlanDraftInput,
  selectedRoute: string,
  language: SiteLanguage
) {
  if (language === "en") {
    return createPlanDraft(input).sevenDayPlan;
  }

  const projectName = valueOr(input.projectName, "这个项目");
  const route = localizeRoute(selectedRoute, language);
  const carrier = localizeOption(input.researchCarrier || "Carrier-neutral", language);

  return [
    `第 1 天：冻结 ${projectName} 的路线问题，并列出不能声称的内容。`,
    `第 2 天：围绕选定路线收集资产和来源：${route}。`,
    `第 3 天：使用 ${carrier} 或人工来源审查，对照锁定简报检查。`,
    "第 4 天：检查用户逻辑、被否决方案、证据登记、证明资产、渠道和停止规则是否覆盖。",
    "第 5 天：修复缺失证据，或把弱路线标记为阻塞。",
    "第 6 天：草拟第一个可检查的证明资产或公开样例。",
    "第 7 天：依据可见证据决定继续、修复、转向或停止。"
  ];
}

function buildLocalizedDraftView(
  input: PlanDraftInput,
  draft: ReturnType<typeof createPlanDraft>,
  language: SiteLanguage
) {
  if (language === "en") {
    return {
      confidenceLabel: draft.confidenceLabel,
      selectedRoute: draft.selectedRoute,
      routeReason: draft.routeReason,
      evidenceGaps: draft.evidenceGaps,
      rejectedAlternatives: draft.rejectedAlternatives,
      sevenDayPlan: draft.sevenDayPlan,
      stopRule: draft.stopRule,
      nextAction: draft.nextAction
    };
  }

  const targetUser = valueOr(input.targetUser, "第一个可触达用户群体");
  const blocker = valueOr(input.blocker, "当前路线决策");
  const routeReason =
    draft.confidenceLabel === "Needs input"
      ? "系统可以先生成草稿结构，但当前输入还不足以进入人工审核。"
      : `当前路线围绕 ${targetUser}，先解决 ${blocker}，再扩展建设。`;
  const nextAction =
    draft.confidenceLabel === "Review ready"
      ? "复制计划简报，并继续进入人工提交审核。"
      : draft.confidenceLabel === "Draftable"
        ? "先补齐证据缺口，再复制简报进入审核。"
        : "先完成缺失字段，再把它当作路线决策使用。";

  return {
    confidenceLabel: localizedConfidence(draft.confidenceLabel, language),
    selectedRoute: localizeRoute(draft.selectedRoute, language),
    routeReason,
    evidenceGaps: draft.evidenceGaps.map((item) => evidenceGapZh[item] ?? item),
    rejectedAlternatives: draft.rejectedAlternatives.map((item) => rejectedAlternativeZh[item] ?? item),
    sevenDayPlan: buildLocalizedSevenDayPlan(input, draft.selectedRoute, language),
    stopRule:
      "如果草稿无法命名买家、首个证明资产、已接受证据、被否决方案、验证渠道和审核日期，就停止或修复。",
    nextAction
  };
}

function buildLocalizedBrief(
  input: PlanDraftInput,
  draft: ReturnType<typeof createPlanDraft>,
  language: SiteLanguage
) {
  if (language === "en") {
    return draft.brief;
  }

  const view = buildLocalizedDraftView(input, draft, language);

  return [
    `项目：${valueOr(input.projectName, "未命名项目")}`,
    `类型：${localizeOption(input.projectType || "Unsure", language)}`,
    `目标用户：${valueOr(input.targetUser, "第一个可触达用户群体")}`,
    `当前目标：${valueOr(input.currentGoal, "未说明")}`,
    `当前阻塞点：${valueOr(input.blocker, "当前路线决策")}`,
    `已有资产：${valueOr(input.existingAssets, "未说明")}`,
    `约束条件：${valueOr(input.constraints, "未说明")}`,
    `执行模式：${localizeOption(input.executionMode || "I will execute myself", language)}`,
    `研究载体：${localizeOption(input.researchCarrier || "Carrier-neutral", language)}`,
    `选定草稿路线：${view.selectedRoute}`,
    `证据缺口：${view.evidenceGaps.join(" | ")}`,
    `停止规则：${view.stopRule}`
  ].join("\n");
}

function planImportRows(input: PlanDraftInput, language: SiteLanguage) {
  const labels =
    language === "zh"
      ? {
          projectName: "项目名称",
          targetUser: "目标用户",
          currentGoal: "当前目标",
          existingAssets: "已有资产",
          blocker: "当前阻塞点",
          constraints: "约束条件"
        }
      : {
          projectName: "Project name",
          targetUser: "Target user",
          currentGoal: "Current goal",
          existingAssets: "Existing assets",
          blocker: "Current blocker",
          constraints: "Constraints"
        };

  return [
    { key: "projectName", label: labels.projectName, value: input.projectName },
    { key: "targetUser", label: labels.targetUser, value: input.targetUser },
    { key: "currentGoal", label: labels.currentGoal, value: input.currentGoal },
    { key: "existingAssets", label: labels.existingAssets, value: input.existingAssets },
    { key: "blocker", label: labels.blocker, value: input.blocker },
    { key: "constraints", label: labels.constraints, value: input.constraints }
  ].filter((row) => row.value.trim().length > 0);
}

function missingHintLabel(value: string, language: SiteLanguage) {
  if (language === "en") {
    return value;
  }

  const labels: Record<string, string> = {
    "Name the first reachable buyer or user group.": "说清第一批可触达买家或用户群体。",
    "Describe the smallest first offer or result.": "描述最小的首个交付或结果。",
    "Add one proof asset, source, screenshot, case, or link.": "补充一个证明资产、来源、截图、案例或链接。",
    "Name the first channel where real people will see it.": "说清真实用户会在哪个第一渠道看到它。",
    "Define what evidence would count within 48 hours, 7 days, or 30 days.":
      "定义 48 小时、7 天或 30 天内什么证据才算有效。",
    "State what the route must not claim, use, or promise.": "写清这条路线不能声称、使用或承诺什么。"
  };

  return labels[value] ?? value;
}

function fieldIsComplete(input: PlanDraftInput, field: PlanField) {
  if (field.kind === "select") {
    return input[field.key].trim().length > 0;
  }

  return input[field.key].trim().length >= 4;
}

function setInputValue(
  current: PlanDraftInput,
  key: keyof PlanDraftInput,
  value: string
): PlanDraftInput {
  return {
    ...current,
    [key]: value
  };
}

export function PlanDraftStudio() {
  const router = useRouter();
  const [language] = usePreferredLanguage();
  const labels = ui[language];
  const [input, setInput] = useState<PlanDraftInput>(emptyInput);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<SaveStateKey>("ready");
  const [draftSource, setDraftSource] = useState<PlanDraftSource | null>(null);
  const draft = useMemo(() => createPlanDraft(input), [input]);
  const draftView = useMemo(() => buildLocalizedDraftView(input, draft, language), [draft, input, language]);
  const localizedBrief = useMemo(() => buildLocalizedBrief(input, draft, language), [draft, input, language]);
  const importedRows = useMemo(() => planImportRows(input, language), [input, language]);
  const completedFieldCount = useMemo(
    () => planFields.filter((field) => fieldIsComplete(input, field)).length,
    [input]
  );
  const missingCoreFields = useMemo(
    () => planFields.filter((field) => field.kind !== "select" && !fieldIsComplete(input, field)),
    [input]
  );
  const nextMissingField = missingCoreFields[0];
  const activeGroup = planQuestionGroups[activeGroupIndex] ?? planQuestionGroups[0];
  const activeGroupCompleteCount = activeGroup.fields.filter((field) => fieldIsComplete(input, field)).length;

  useEffect(() => {
    try {
      const storedInput = window.localStorage.getItem(planDraftStorageKey);

      if (storedInput) {
        const parsedInput = JSON.parse(storedInput) as Partial<PlanDraftInput>;
        setInput({ ...emptyInput, ...parsedInput });
        setSaveState("restored");
      }

      const storedSource = window.localStorage.getItem(planDraftSourceStorageKey);

      if (storedSource) {
        setDraftSource(JSON.parse(storedSource) as PlanDraftSource);
      }
    } catch {
      setSaveState("unavailable");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(planDraftStorageKey, JSON.stringify(input));
      window.localStorage.setItem(planBriefStorageKey, localizedBrief);
      setSaveState("saved");
    } catch {
      setSaveState("unavailable");
    }
  }, [hydrated, input, localizedBrief]);

  async function copyBrief() {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(localizedBrief);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      const textarea = document.createElement("textarea");
      textarea.value = localizedBrief;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      didCopy = document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      return true;
    }

    setCopied(false);
    return false;
  }

  function loadExample() {
    setInput(exampleInputByLanguage[language]);
    setExported(false);
    setSaveState("example");
  }

  function clearDraft() {
    setInput(emptyInput);
    setCopied(false);
    setExported(false);
    setSaveState("cleared");

    try {
      window.localStorage.removeItem(planDraftStorageKey);
      window.localStorage.removeItem(planBriefStorageKey);
      window.localStorage.removeItem(planDraftSourceStorageKey);
      setDraftSource(null);
    } catch {
      setSaveState("unavailable");
    }
  }

  function downloadBrief() {
    const safeName =
      input.projectName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) || "agentsiteops-plan";
    const content = [
      labels.exportTitle,
      "",
      localizedBrief,
      "",
      labels.exportStatus,
      "",
      `- ${labels.exportReadiness}: ${draft.readinessScore}/100`,
      `- ${labels.exportConfidence}: ${draftView.confidenceLabel}`,
      `- ${labels.exportNextAction}: ${draftView.nextAction}`,
      "",
      labels.exportBoundary,
      "",
      ...labels.exportBoundaryItems.map((item) => `- ${item}`)
    ].join("\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${safeName}-route-draft.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 1800);
    window.codexAnalytics?.track("plan_brief_download", {
      missing_count: missingCoreFields.length,
      readiness_score: draft.readinessScore
    });
  }

  function focusNextMissingField() {
    if (!nextMissingField) {
      return;
    }

    const groupIndex = planQuestionGroups.findIndex((group) =>
      group.fields.some((field) => field.key === nextMissingField.key)
    );

    if (groupIndex >= 0) {
      setActiveGroupIndex(groupIndex);
    }

    const control = document.querySelector<HTMLElement>(`[data-plan-control="${nextMissingField.key}"]`);
    control?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => control?.focus(), 260);
    window.codexAnalytics?.track("plan_missing_field_focus", {
      field: nextMissingField.key,
      missing_count: missingCoreFields.length
    });
  }

  async function copyAndContinue() {
    const copiedBrief = await copyBrief();
    window.codexAnalytics?.track("plan_copy_continue", {
      copied: copiedBrief,
      missing_count: missingCoreFields.length,
      readiness_score: draft.readinessScore
    });
    router.push("/intake/?from=plan");
  }

  function goToPreviousGroup() {
    setActiveGroupIndex((current) => Math.max(0, current - 1));
    window.codexAnalytics?.track("plan_step_selected", {
      step: Math.max(0, activeGroupIndex - 1) + 1
    });
  }

  function goToNextGroup() {
    setActiveGroupIndex((current) => Math.min(planQuestionGroups.length - 1, current + 1));
    window.codexAnalytics?.track("plan_step_selected", {
      step: Math.min(planQuestionGroups.length - 1, activeGroupIndex + 1) + 1
    });
  }

  return (
    <section className="plan-draft-studio" aria-label={labels.aria}>
      <div className="plan-studio-grid">
        <form className="plan-input-panel" onSubmit={(event) => event.preventDefault()}>
          <div className="plan-panel-head">
            <span>{labels.input}</span>
            <h2>{labels.inputTitle}</h2>
            <p>{labels.inputBody}</p>
          </div>

          <div className="plan-input-summary" aria-label={labels.inputRulesAria}>
            {labels.rules.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <section className="plan-import-summary">
            <div className="plan-import-head">
              <span>{labels.importedDraft}</span>
              <h3>{draftSource ? labels.importedTitle : labels.noImportedDraft}</h3>
              {draftSource ? <p>{labels.importedBody}</p> : null}
            </div>

            {draftSource?.rawIdeaText ? (
              <blockquote>
                <span>{labels.originalIdea}</span>
                <p>{draftSource.rawIdeaText}</p>
              </blockquote>
            ) : null}

            {importedRows.length ? (
              <div className="plan-import-grid">
                {importedRows.map((row) => (
                  <article key={row.key}>
                    <span>{labels.guessedField}</span>
                    <strong>{row.label}</strong>
                    <p>{row.value}</p>
                  </article>
                ))}
                {draftSource?.missingHints?.slice(0, 3).map((item) => (
                  <article className="is-missing" key={item}>
                    <span>{labels.needsRepair}</span>
                    <strong>{missingHintLabel(item, language)}</strong>
                  </article>
                ))}
              </div>
            ) : null}

            <button type="button" onClick={focusNextMissingField} disabled={!nextMissingField}>
              {nextMissingField
                ? `${labels.reviewNext}: ${nextMissingField.label[language]}`
                : labels.allCoreFields}
            </button>
          </section>

          <div className="plan-stepper" aria-label={labels.stepsAria}>
            {planQuestionGroups.map((group, index) => {
              const isActive = index === activeGroupIndex;
              const readyCount = group.fields.filter((field) => fieldIsComplete(input, field)).length;

              return (
                <button
                  aria-current={isActive ? "step" : undefined}
                  className={isActive ? "is-active" : readyCount === group.fields.length ? "is-complete" : undefined}
                  data-analytics-event="plan_step_selected"
                  data-analytics-label={group.title.en}
                  data-analytics-type="plan_studio"
                  key={group.number}
                  onClick={() => setActiveGroupIndex(index)}
                  type="button"
                >
                  <span>{group.number}</span>
                  <strong>{group.title[language]}</strong>
                  <small>
                    {readyCount}/{group.fields.length}
                  </small>
                </button>
              );
            })}
          </div>

          <div className="plan-input-state" aria-label={labels.completionAria}>
            <div>
              <span>{labels.inputCoverage}</span>
              <strong>
                {completedFieldCount}/{planFields.length} {labels.fieldsReady}
              </strong>
              <p>
                {labels.saveState[saveState]}. {labels.savedDraftSuffix}
              </p>
            </div>
            <button
              type="button"
              onClick={focusNextMissingField}
              disabled={!nextMissingField}
              data-analytics-event="plan_missing_field_focus"
              data-analytics-label={nextMissingField?.key ?? "all_fields_ready"}
              data-analytics-type="plan_studio"
            >
              {nextMissingField
                ? `${labels.findNextMissing}: ${nextMissingField.label[language]}`
                : labels.allCoreFields}
            </button>
          </div>

          <div className="plan-question-stack">
            <fieldset className="plan-question-group">
              <legend>
                <span>{activeGroup.number}</span>
                <strong>{activeGroup.title[language]}</strong>
                <small>{activeGroup.description[language]}</small>
              </legend>

              <div className="plan-field-stack">
                {activeGroup.fields.map((field) => {
                  const isComplete = fieldIsComplete(input, field);

                  return (
                  <label
                    className={isComplete ? "plan-field-card is-filled" : "plan-field-card is-missing"}
                    data-plan-field={field.key}
                    key={field.key}
                  >
                    <span className="plan-field-label">{field.label[language]}</span>
                    <strong>{field.prompt[language]}</strong>
                    {field.kind === "select" ? (
                      <select
                        data-plan-control={field.key}
                        value={input[field.key]}
                        onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {localizeOption(option, language)}
                          </option>
                        ))}
                      </select>
                    ) : field.kind === "input" ? (
                      <input
                        data-plan-control={field.key}
                        value={input[field.key]}
                        placeholder={field.placeholder[language]}
                        onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                      />
                    ) : (
                      <textarea
                        data-plan-control={field.key}
                        value={input[field.key]}
                        placeholder={field.placeholder[language]}
                        rows={field.rows ?? 5}
                        onChange={(event) => setInput(setInputValue(input, field.key, event.target.value))}
                      />
                    )}
                    <small>{field.helper[language]}</small>
                    <em className="plan-field-status">{isComplete ? labels.ready : labels.needsInput}</em>
                  </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="plan-step-actions">
            <button type="button" onClick={goToPreviousGroup} disabled={activeGroupIndex === 0}>
              {labels.previous}
            </button>
            <span>
              {labels.step} {activeGroupIndex + 1}: {activeGroupCompleteCount}/{activeGroup.fields.length}{" "}
              {labels.fieldsReady}
            </span>
            <button type="button" onClick={goToNextGroup} disabled={activeGroupIndex === planQuestionGroups.length - 1}>
              {labels.nextStep}
            </button>
          </div>

          <div className="plan-input-actions">
            <button
              type="button"
              onClick={loadExample}
              data-analytics-event="plan_example_loaded"
              data-analytics-label="plan_studio_example"
              data-analytics-type="plan_studio"
            >
              <RefreshCw aria-hidden="true" size={16} />
              {labels.loadExample}
            </button>
            <button type="button" onClick={clearDraft}>
              {labels.clear}
            </button>
          </div>
        </form>

        <aside className="plan-output-panel" aria-live="polite">
          <div className="plan-score-card">
            <span>{draftView.confidenceLabel}</span>
            <strong data-testid="plan-readiness-score">{draft.readinessScore}</strong>
            <small>{labels.inputReadiness}</small>
          </div>

          <div className="plan-route-card">
            <span>{labels.selectedDraftRoute}</span>
            <h2 data-testid="plan-selected-route">{draftView.selectedRoute}</h2>
            <p>{draftView.routeReason}</p>
          </div>

          <div className="plan-output-tabs">
            <section>
              <div>
                <AlertTriangle aria-hidden="true" size={18} />
                <h3>{labels.evidenceGaps}</h3>
              </div>
              <ul>
                {draftView.evidenceGaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <div>
                <ShieldCheck aria-hidden="true" size={18} />
                <h3>{labels.rejectedAlternatives}</h3>
              </div>
              <ul>
                {draftView.rejectedAlternatives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="plan-seven-day">
            <div>
              <SearchCheck aria-hidden="true" size={18} />
              <h3>{labels.sevenDayPath}</h3>
            </div>
            <ol>
              {draftView.sevenDayPlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="plan-stop-rule">
            <FileCheck2 aria-hidden="true" size={18} />
            <div>
              <h3>{labels.stopRule}</h3>
              <p>{draftView.stopRule}</p>
            </div>
          </section>

          <section className="plan-handoff-card" aria-label={labels.handoffAria}>
            <div>
              <ClipboardList aria-hidden="true" size={18} />
              <h3>{labels.handoffState}</h3>
            </div>
            <p>{labels.handoffBody}</p>
            <ul>
              <li>{labels.automatic}</li>
              <li>{labels.manual}</li>
            </ul>
          </section>

          <div className="plan-output-actions">
            <button
              type="button"
              onClick={copyBrief}
              data-analytics-event="plan_brief_copy"
              data-analytics-label="copy_plan_brief"
              data-analytics-type="plan_studio"
            >
              <ClipboardCopy aria-hidden="true" size={16} />
              {copied ? labels.copied : labels.copyBrief}
            </button>
            <button
              type="button"
              onClick={downloadBrief}
              data-analytics-event="plan_brief_download"
              data-analytics-label="download_route_draft"
              data-analytics-type="plan_studio"
            >
              <Download aria-hidden="true" size={16} />
              {exported ? labels.downloaded : labels.downloadDraft}
            </button>
            <button
              type="button"
              onClick={copyAndContinue}
              data-analytics-event="plan_copy_continue"
              data-analytics-label="copy_and_continue_intake"
              data-analytics-type="plan_studio"
            >
              <ClipboardList aria-hidden="true" size={16} />
              {labels.copyIntake}
            </button>
            <Link prefetch={false} href="/sample/">
              <FileText aria-hidden="true" size={16} />
              {labels.viewSample}
            </Link>
          </div>

          <p className="plan-next-action">
            <CheckCircle2 aria-hidden="true" size={16} />
            {draftView.nextAction} {labels.savedDraftDetected}
          </p>
        </aside>
      </div>
    </section>
  );
}
