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
    href: "/#start-idea",
    shortLabel: { en: "Start", zh: "开始" },
    label: { en: "Write one idea", zh: "填写一个想法" },
    body: {
      en: "The homepage gives the first diagnosis from one rough description.",
      zh: "首页用一段粗略描述给出第一轮判断。"
    }
  },
  {
    id: "plan",
    href: "/plan/",
    shortLabel: { en: "Plan", zh: "计划" },
    label: { en: "Draft plan", zh: "生成计划" },
    body: {
      en: "Turn the tested idea into a narrow route draft.",
      zh: "把测试后的想法整理成窄路线草稿。"
    }
  },
  {
    id: "submit",
    href: "/intake/",
    shortLabel: { en: "Submit", zh: "提交" },
    label: { en: "Submit packet", zh: "提交材料" },
    body: {
      en: "Submit only when buyer, proof, channel, and limits are visible.",
      zh: "用户、证据、渠道和限制清楚后再提交。"
    }
  },
  {
    id: "status",
    href: "/review-status/",
    shortLabel: { en: "Review", zh: "审核" },
    label: { en: "Check review", zh: "查看审核" },
    body: {
      en: "See ready, repair, blocked, or not-delivery.",
      zh: "查看通过、修复、阻塞或不交付状态。"
    }
  },
  {
    id: "output",
    href: "/sample/",
    shortLabel: { en: "Output", zh: "输出" },
    label: { en: "Inspect output", zh: "查看输出" },
    body: {
      en: "Inspect the Route File shape before trusting the handoff.",
      zh: "先查看 Route File 的输出形态。"
    }
  }
];

const routeRules: RouteRule[] = [
  {
    match: ["/", "/start/"],
    role: "main",
    stage: "test",
    title: { en: "Start on the homepage input.", zh: "从首页输入框开始。" },
    body: {
      en: "Write the rough idea once. The first diagnosis appears before any page jump.",
      zh: "只写一次粗略想法。第一轮判断会先在首页出现，不需要先跳页。"
    },
    primaryHref: "/#start-idea",
    primaryLabel: { en: "Write one idea", zh: "填写一个想法" }
  },
  {
    match: ["/idea-risk-test/"],
    role: "main",
    stage: "test",
    title: { en: "You are at the first action.", zh: "当前是第一步。" },
    body: {
      en: "Write the rough project first. Research, review, and delivery come later.",
      zh: "先写粗略项目。研究、审核和交付都在后面。"
    },
    primaryHref: "#idea-risk-test",
    primaryLabel: { en: "Write idea", zh: "填写想法" }
  },
  {
    match: ["/plan/"],
    role: "main",
    stage: "plan",
    title: { en: "You are drafting the route.", zh: "当前在生成路线草稿。" },
    body: {
      en: "Use the draft to decide whether the project is specific enough to submit.",
      zh: "用草稿判断项目是否具体到可以提交审核。"
    },
    primaryHref: "/intake/",
    primaryLabel: { en: "Prepare submission", zh: "准备提交" }
  },
  {
    match: ["/intake/", "/contact/", "/thank-you/"],
    role: "main",
    stage: "submit",
    title: { en: "You are preparing submission.", zh: "当前在准备提交。" },
    body: {
      en: "Submission creates a packet. It is not automatic acceptance.",
      zh: "提交只生成材料包，不代表自动通过。"
    },
    primaryHref: "/review-status/",
    primaryLabel: { en: "Check review state", zh: "查看审核状态" }
  },
  {
    match: ["/review-status/", "/scope/"],
    role: "main",
    stage: "status",
    title: { en: "You are checking review state.", zh: "当前在查看审核状态。" },
    body: {
      en: "The valid states are ready, repair, blocked, or not-delivery.",
      zh: "有效状态只有通过、修复、阻塞或不交付。"
    },
    primaryHref: "/sample/",
    primaryLabel: { en: "Inspect output shape", zh: "查看输出样例" }
  },
  {
    match: ["/sample/", "/examples/"],
    role: "proof",
    stage: "output",
    title: { en: "You are inspecting output proof.", zh: "当前在查看输出样例。" },
    body: {
      en: "This is proof of handoff shape, not the next action for a new project.",
      zh: "这里用于查看交付形态，不是新项目的下一步操作。"
    },
    primaryHref: "/idea-risk-test/",
    primaryLabel: { en: "Test another idea", zh: "测试另一个想法" }
  },
  {
    match: ["/how-it-works/", "/execution/", "/delivery-gate/", "/templates/", "/reports/", "/methodology/", "/evidence/"],
    role: "reference",
    stage: "status",
    title: { en: "This is method reference.", zh: "这是方法参考页。" },
    body: {
      en: "Use it for details after the first idea is written.",
      zh: "先写想法，需要细节时再看这里。"
    },
    primaryHref: "/idea-risk-test/",
    primaryLabel: { en: "Return to idea input", zh: "回到想法输入" }
  },
  {
    match: ["/tools/", "/checklists/", "/guides/", "/answers/", "/launch-kit/", "/compare/", "/starter-review/", "/website-opportunity-audit/", "/ai-website-operating-system/"],
    role: "support",
    stage: "test",
    title: { en: "This is support content.", zh: "这是辅助内容。" },
    body: {
      en: "Support pages help diagnosis, but the product path starts with one project idea.",
      zh: "辅助页面可以帮助判断，但产品路径从一个项目想法开始。"
    },
    primaryHref: "/#start-idea",
    primaryLabel: { en: "Start with idea", zh: "从想法开始" }
  },
  {
    match: ["/pricing/", "/buy/", "/terms/", "/refund-policy/", "/privacy/", "/disclaimer/", "/disclosure/", "/authors/", "/editorial-policy/", "/updates/"],
    role: "legal",
    stage: "test",
    title: { en: "This is not the work surface.", zh: "这里不是工作区。" },
    body: {
      en: "Policy and update pages are supporting context. Use the idea input to work on a project.",
      zh: "政策和更新页只是背景信息。处理项目请回到想法输入。"
    },
    primaryHref: "/#start-idea",
    primaryLabel: { en: "Open idea input", zh: "打开想法输入" }
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
      title: { en: "This page supports the main path.", zh: "这个页面支持主路径。" },
      body: {
        en: "If the next action is unclear, return to the idea input.",
        zh: "如果下一步不清楚，回到想法输入。"
      },
      primaryHref: "/#start-idea",
      primaryLabel: { en: "Return to idea input", zh: "回到想法输入" }
    }
  );
}
