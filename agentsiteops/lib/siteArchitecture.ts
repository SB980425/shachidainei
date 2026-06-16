export type SiteLanguage = "en" | "zh";
export type MainJourneyStageId = "test" | "plan" | "submit" | "status" | "output";
export type PageRole = "main" | "reference" | "proof" | "legal" | "support";

export type LocalizedLabel = Record<SiteLanguage, string>;

export type MainJourneyStage = {
  id: MainJourneyStageId;
  href: string;
  shortLabel: LocalizedLabel;
  label: LocalizedLabel;
  body: LocalizedLabel;
};

export type SiteRouteContext = {
  role: PageRole;
  stage: MainJourneyStageId;
  title: LocalizedLabel;
  body: LocalizedLabel;
  primaryHref?: string;
  primaryLabel?: LocalizedLabel;
};

type RouteRule = SiteRouteContext & {
  match: string[];
};

export const mainJourneyStages: MainJourneyStage[] = [
  {
    id: "test",
    href: "/idea-risk-test/",
    shortLabel: { en: "Test", zh: "测试" },
    label: { en: "Test idea", zh: "测试想法" },
    body: {
      en: "Paste scattered project notes and get failure nodes before planning.",
      zh: "粘贴散碎项目信息，先看失败节点，再进入计划。"
    }
  },
  {
    id: "plan",
    href: "/plan/",
    shortLabel: { en: "Plan", zh: "计划" },
    label: { en: "Draft plan", zh: "生成计划" },
    body: {
      en: "Turn the tested idea into a browser-local route draft.",
      zh: "把测试后的想法整理成本地路线草稿。"
    }
  },
  {
    id: "submit",
    href: "/intake/",
    shortLabel: { en: "Submit", zh: "提交" },
    label: { en: "Submit packet", zh: "提交材料" },
    body: {
      en: "Send the plan packet for manual review when it is specific enough.",
      zh: "计划足够具体后，再提交给人工审核。"
    }
  },
  {
    id: "status",
    href: "/review-status/",
    shortLabel: { en: "Status", zh: "状态" },
    label: { en: "Check status", zh: "查看状态" },
    body: {
      en: "See ready, repair, blocked, or not-delivery before research starts.",
      zh: "在研究开始前，看见通过、修复、阻塞或不交付状态。"
    }
  },
  {
    id: "output",
    href: "/sample/",
    shortLabel: { en: "Output", zh: "输出" },
    label: { en: "Inspect output", zh: "查看输出" },
    body: {
      en: "Inspect the Route File shape before trusting the final handoff.",
      zh: "先查看 Route File 输出形态，再理解最终交付。"
    }
  }
];

const routeRules: RouteRule[] = [
  {
    match: ["/", "/start/"],
    role: "main",
    stage: "test",
    title: { en: "Start at the first decision.", zh: "从第一个决策开始。" },
    body: {
      en: "The main path is one line: test idea, draft plan, submit packet, check status, inspect output.",
      zh: "主路径只有一条：测试想法、生成计划、提交材料、查看状态、查看输出。"
    },
    primaryHref: "/idea-risk-test/",
    primaryLabel: { en: "Start free test", zh: "开始免费测试" }
  },
  {
    match: ["/idea-risk-test/"],
    role: "main",
    stage: "test",
    title: { en: "You are testing the idea.", zh: "当前在测试想法。" },
    body: {
      en: "This page is the first action. Do not jump to research or delivery until the failure map is readable.",
      zh: "这是第一个动作。失败地图清楚前，不进入研究或交付。"
    }
  },
  {
    match: ["/plan/"],
    role: "main",
    stage: "plan",
    title: { en: "You are drafting the plan.", zh: "当前在生成计划。" },
    body: {
      en: "Use the draft to decide whether the project is specific enough to submit.",
      zh: "用草稿判断项目是否足够具体，是否能提交审核。"
    }
  },
  {
    match: ["/intake/", "/contact/", "/thank-you/"],
    role: "main",
    stage: "submit",
    title: { en: "You are preparing submission.", zh: "当前在准备提交。" },
    body: {
      en: "Submission creates a packet. It does not mean automatic acceptance or hidden research.",
      zh: "提交只会形成材料包，不代表自动通过或隐藏研究。"
    }
  },
  {
    match: ["/review-status/", "/scope/"],
    role: "main",
    stage: "status",
    title: { en: "You are checking review state.", zh: "当前在查看审核状态。" },
    body: {
      en: "The valid states are ready, repair, blocked, or not-delivery.",
      zh: "有效状态只有通过、修复、阻塞或不交付。"
    }
  },
  {
    match: ["/sample/", "/examples/"],
    role: "proof",
    stage: "output",
    title: { en: "You are inspecting output proof.", zh: "当前在查看输出样例。" },
    body: {
      en: "This is proof of the handoff shape, not the next action for a new project.",
      zh: "这里用于查看交付形态，不是新项目的下一步操作。"
    }
  },
  {
    match: ["/how-it-works/", "/execution/", "/delivery-gate/", "/templates/", "/reports/", "/methodology/", "/evidence/"],
    role: "reference",
    stage: "status",
    title: { en: "This is a reference page.", zh: "这是参考页面。" },
    body: {
      en: "Read it only when you need method details. Return to the main path to continue using the site.",
      zh: "需要方法细节时再阅读。继续使用网站时，回到主流程。"
    },
    primaryHref: "/idea-risk-test/",
    primaryLabel: { en: "Return to main path", zh: "返回主流程" }
  },
  {
    match: ["/tools/", "/checklists/", "/guides/", "/answers/", "/launch-kit/", "/compare/", "/starter-review/", "/website-opportunity-audit/", "/ai-website-operating-system/"],
    role: "support",
    stage: "test",
    title: { en: "This is a support tool or article.", zh: "这是辅助工具或文章。" },
    body: {
      en: "Support content helps diagnosis, but the product path still starts with one project idea.",
      zh: "辅助内容能帮助判断，但产品路径仍从一个项目想法开始。"
    },
    primaryHref: "/idea-risk-test/",
    primaryLabel: { en: "Start with your idea", zh: "从想法开始" }
  },
  {
    match: ["/pricing/", "/buy/", "/terms/", "/refund-policy/", "/privacy/", "/disclaimer/", "/disclosure/", "/authors/", "/editorial-policy/", "/updates/"],
    role: "legal",
    stage: "test",
    title: { en: "This is not the work surface.", zh: "这里不是执行工作区。" },
    body: {
      en: "Policy, pricing, and update pages are supporting context. Use the main path to work on a project.",
      zh: "政策、价格和更新页只是背景信息。处理项目请回到主路径。"
    },
    primaryHref: "/idea-risk-test/",
    primaryLabel: { en: "Open free test", zh: "打开免费测试" }
  }
];

export function localize(label: LocalizedLabel, language: SiteLanguage) {
  return label[language] ?? label.en;
}

export function normalizeSitePath(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function getMainStage(id: MainJourneyStageId) {
  return mainJourneyStages.find((stage) => stage.id === id) ?? mainJourneyStages[0];
}

export function getNextMainStage(id: MainJourneyStageId) {
  const index = mainJourneyStages.findIndex((stage) => stage.id === id);
  if (index < 0 || index >= mainJourneyStages.length - 1) {
    return mainJourneyStages[0];
  }

  return mainJourneyStages[index + 1];
}

export function getSiteRouteContext(pathname: string): SiteRouteContext {
  const normalized = normalizeSitePath(pathname);
  const match = routeRules.find((rule) =>
    rule.match.some((path) =>
      path === "/" ? normalized === "/" : path.endsWith("/") ? normalized.startsWith(path) : normalized === path
    )
  );

  return (
    match ?? {
      role: "reference",
      stage: "test",
      title: { en: "This page supports the main path.", zh: "这个页面用于支持主路径。" },
      body: {
        en: "If the next action is unclear, return to the idea test and proceed step by step.",
        zh: "如果下一步不清楚，回到想法测试并按步骤继续。"
      },
      primaryHref: "/idea-risk-test/",
      primaryLabel: { en: "Return to main path", zh: "返回主流程" }
    }
  );
}
