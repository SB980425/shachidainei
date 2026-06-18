export type RouteProjectStageId =
  | "plan"
  | "intake"
  | "scope"
  | "research"
  | "gate"
  | "route-file"
  | "validation";

export type RouteProjectIconKey =
  | "clipboard"
  | "fileCheck"
  | "lock"
  | "search"
  | "fileText"
  | "activity"
  | "shield";

export type RouteProjectStage = {
  id: RouteProjectStageId;
  label: string;
  title: string;
  body: string;
  href: string;
  owner: string;
  input: string;
  output: string;
  pass: string;
  repair: string;
  notDelivery: string;
  icon: RouteProjectIconKey;
};

export type RouteProjectClientState = {
  stage: RouteProjectStageId;
  customerAction: string;
  websiteAction: string;
  manualAction: string;
  nextVisibleResult: string;
  stopOrRepair: string;
};

export type RouteProjectLanguage = "en" | "zh";

export const routeProjectStages: RouteProjectStage[] = [
  {
    id: "plan",
    label: "Plan Draft",
    title: "Turn messy intent into a route question",
    body:
      "The visitor writes the project, target user, proof, alternatives, blocker, constraints, execution mode, and review window in plain language.",
    href: "/plan/",
    owner: "Visitor and browser-local draft",
    input: "Unclear project material",
    output: "Preliminary route brief",
    pass: "Buyer, goal, assets, blocker, rejected alternatives, and constraints are visible.",
    repair: "Ask for missing buyer, proof, blocker, or delivery-limit details.",
    notDelivery: "A broad ambition with no route question or inspectable input.",
    icon: "clipboard"
  },
  {
    id: "intake",
    label: "Intake",
    title: "Convert the draft into a reviewable packet",
    body:
      "The packet separates submission from acceptance and shows whether the request is ready, needs repair, is blocked, or is not delivery.",
    href: "/intake/",
    owner: "Website receipt plus operator review",
    input: "Plan brief and safe source material",
    output: "Ready, repair, blocked, or not-delivery state",
    pass: "Facts, rights, risks, payment role, and review boundary are explicit.",
    repair: "Request only the missing fields needed to judge the route.",
    notDelivery: "Secrets, private data, unsafe claims, or impossible delivery promises.",
    icon: "fileCheck"
  },
  {
    id: "scope",
    label: "Scope Lock",
    title: "Freeze claims, sources, routes, and non-goals",
    body:
      "Accepted intake becomes a locked decision frame so research cannot drift into broad market advice or unsupported build work.",
    href: "/scope/",
    owner: "Operator",
    input: "Accepted intake packet",
    output: "Locked research and delivery boundary",
    pass: "Allowed sources, blocked claims, candidate routes, and stop conditions are named.",
    repair: "Narrow the buyer, source set, route alternatives, or delivery scope.",
    notDelivery: "Research request without source rights, route alternatives, or forbidden-claim limits.",
    icon: "lock"
  },
  {
    id: "research",
    label: "Research Run",
    title: "Use an approved evidence carrier",
    body:
      "Research can come from manual source review, client reports, operator-controlled AI research, or another approved carrier. The carrier can change; the acceptance standard does not.",
    href: "/templates/route-research-prompt-pack/",
    owner: "Approved carrier",
    input: "Locked brief and source boundary",
    output: "Source-backed findings and rejected paths",
    pass: "The returned material includes sources, buyer logic, alternatives, uncertainty, and proof needs.",
    repair: "Generate a second-pass research brief for uncovered claims or weak sources.",
    notDelivery: "Hidden automatic research claims or unsupported summaries without inspectable source coverage.",
    icon: "search"
  },
  {
    id: "gate",
    label: "Coverage Gate",
    title: "Accept, repair, block, or reject returned material",
    body:
      "Returned research is checked before synthesis so a confident-looking report cannot become a weak Route File.",
    href: "/delivery-gate/",
    owner: "Quality gate",
    input: "Returned research or manual source notes",
    output: "Pass, repair prompt, blocked reason, or rejection",
    pass: "Buyer logic, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule are covered.",
    repair: "Send a focused gap request rather than synthesizing around missing evidence.",
    notDelivery: "A clean report that lacks rejection logic, evidence tags, or stop conditions.",
    icon: "shield"
  },
  {
    id: "route-file",
    label: "Route File",
    title: "Fuse accepted evidence into one decision package",
    body:
      "Only accepted material becomes the selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
    href: "/sample/",
    owner: "Operator handoff",
    input: "Coverage-gated research and intake facts",
    output: "Client-readable Route File",
    pass: "The client can see what to do first, what not to build, what is still missing, and when to stop.",
    repair: "Downgrade confidence or request missing evidence before final delivery.",
    notDelivery: "A plan with multiple equal directions, no evidence ledger, or no stop rule.",
    icon: "fileText"
  },
  {
    id: "validation",
    label: "Validation",
    title: "Run the first proof asset and stop rule",
    body:
      "The Route File is not the end of the system. It must point to a first proof asset, counted signal, ignored weak signal, and stop or repair decision.",
    href: "/guides/48-hour-exposure-sprint/",
    owner: "Visitor, operator, or founder",
    input: "Delivered Route File",
    output: "Continue, repair, pivot, or stop evidence",
    pass: "Qualified replies, usable intake, payment plus intake, repeated objections, or source-backed search evidence are recorded.",
    repair: "Rewrite the offer, proof asset, buyer segment, or channel before expansion.",
    notDelivery: "Treating page views, AI praise, sitemap success, or PayPal clicks as validated demand.",
    icon: "activity"
  }
];

export const routeProjectClientStates: RouteProjectClientState[] = [
  {
    stage: "plan",
    customerAction: "Write the messy project once: buyer, goal, assets, blocker, constraints, execution mode, and review window.",
    websiteAction: "Create a browser-local preliminary route draft, readiness score, evidence gaps, rejected alternatives, and exportable brief.",
    manualAction: "No manual work starts yet. Operator review begins only after the draft is sent through intake.",
    nextVisibleResult: "A copied or downloaded plan brief that can be included in the intake packet.",
    stopOrRepair: "Repair before intake if buyer, assets, blocker, constraints, or forbidden claims are still vague."
  },
  {
    stage: "intake",
    customerAction: "Send the plan brief plus safe source material, links, screenshots, constraints, and optional order confirmation.",
    websiteAction: "Format the packet, detect a saved Plan Studio draft, copy the packet, and open a clean email handoff.",
    manualAction: "A person accepts, requests repair, blocks, or marks the request as not delivery.",
    nextVisibleResult: "Ready, repair, blocked, or not-delivery state before research starts.",
    stopOrRepair: "Stop or repair when private data, unsafe claims, source-right gaps, or impossible delivery promises appear."
  },
  {
    stage: "scope",
    customerAction: "Confirm the route question, allowed sources, non-goals, blocked claims, and delivery boundary.",
    websiteAction: "Show the frozen scope path and keep the project from drifting into unrelated templates or broad advice.",
    manualAction: "The operator locks the brief, names route alternatives, and decides which evidence carrier is acceptable.",
    nextVisibleResult: "A narrow research and delivery boundary that can be checked later.",
    stopOrRepair: "Repair if the brief cannot name sources, alternatives, unacceptable claims, or a stop condition."
  },
  {
    stage: "research",
    customerAction: "Provide approved source material or wait while the selected carrier returns coverage against the locked brief.",
    websiteAction: "Keep the carrier-neutral research standard visible instead of claiming one hidden AI platform owns the workflow.",
    manualAction: "Manual review, client reports, operator-controlled AI research, or another approved carrier can be used.",
    nextVisibleResult: "Returned findings with sources, uncertainty, alternatives, and proof needs.",
    stopOrRepair: "Trigger second-pass research when buyer logic, source coverage, alternatives, or proof needs are missing."
  },
  {
    stage: "gate",
    customerAction: "Inspect whether returned material covers the route decision before accepting a polished handoff.",
    websiteAction: "Expose pass, repair, blocked, and not-delivery logic so weak reports do not become Route Files.",
    manualAction: "The operator checks coverage and either synthesizes, repairs, blocks, or rejects the material.",
    nextVisibleResult: "Coverage verdict plus missing-evidence request when needed.",
    stopOrRepair: "Repair or block if the report lacks evidence tags, rejected alternatives, proof asset, channel, or stop rule."
  },
  {
    stage: "route-file",
    customerAction: "Read one selected route, the rejected paths, evidence ledger, first proof asset, validation channel, and stop rule.",
    websiteAction: "Present sample and proof-case structure so the final handoff is inspectable before trust is requested.",
    manualAction: "The operator fuses accepted evidence into the Route File and downgrades confidence where proof is weak.",
    nextVisibleResult: "A client-readable Route File that explains what to do first and what not to build.",
    stopOrRepair: "Do not deliver if multiple equal routes remain, no ledger exists, or the stop rule is absent."
  },
  {
    stage: "validation",
    customerAction: "Run the first proof asset in the chosen channel and record counted signals, ignored weak signals, and objections.",
    websiteAction: "Provide the validation sprint and evidence language so page activity is not mistaken for demand.",
    manualAction: "The operator or founder interprets signals and decides continue, repair, pivot, or stop.",
    nextVisibleResult: "A validation decision backed by qualified replies, usable intake, payment plus intake, or repeated objections.",
    stopOrRepair: "Stop or repair when only page views, AI praise, sitemap success, or unqualified clicks appear."
  }
];

const routeProjectStageZh: Record<
  RouteProjectStageId,
  Omit<RouteProjectStage, "id" | "href" | "icon">
> = {
  plan: {
    label: "计划草稿",
    title: "把零散想法整理成一个路线问题",
    body:
      "访客用普通语言写下项目、目标用户、证据、备选方向、阻塞点、约束、执行方式和审核窗口。",
    owner: "访客和浏览器本地草稿",
    input: "尚不清晰的项目材料",
    output: "初步路线简报",
    pass: "用户、目标、资产、阻塞点、被否决方向和约束已经可见。",
    repair: "只补充缺失的用户、证据、阻塞点或交付边界。",
    notDelivery: "没有路线问题或可检查输入的宽泛愿望。"
  },
  intake: {
    label: "提交材料",
    title: "把草稿转成可审核材料包",
    body:
      "材料包把提交和通过分开，并显示请求是可审核、需修复、被阻塞，还是不属于交付。",
    owner: "网站回执和人工审核",
    input: "计划简报和安全来源材料",
    output: "通过、修复、阻塞或不交付状态",
    pass: "事实、权利、风险、付款角色和审核边界已经明确。",
    repair: "只要求能判断路线所必需的缺失字段。",
    notDelivery: "秘密信息、私有数据、危险承诺或无法兑现的交付承诺。"
  },
  scope: {
    label: "锁定范围",
    title: "冻结声明、来源、路线和非目标",
    body:
      "通过审核的材料会变成锁定决策框架，避免研究漂移成宽泛市场建议或无证据建设。",
    owner: "操作员",
    input: "已接受的材料包",
    output: "锁定的研究和交付边界",
    pass: "允许来源、禁止声明、候选路线和停止条件已经命名。",
    repair: "收窄用户、来源集合、路线备选或交付范围。",
    notDelivery: "没有来源权利、路线备选或禁止声明限制的研究请求。"
  },
  research: {
    label: "研究运行",
    title: "使用被批准的证据载体",
    body:
      "研究可以来自人工来源审查、客户报告、操作员控制的 AI 研究或其他被批准载体。载体可以更换，验收标准不变。",
    owner: "被批准的载体",
    input: "锁定简报和来源边界",
    output: "带来源的发现和被否决路径",
    pass: "返回材料包含来源、用户逻辑、备选方向、不确定性和证据需求。",
    repair: "对未覆盖声明或弱来源生成二次补研简报。",
    notDelivery: "隐藏自动研究承诺，或没有可检查来源覆盖的摘要。"
  },
  gate: {
    label: "覆盖检查",
    title: "接受、修复、阻塞或拒绝返回材料",
    body:
      "返回研究会先被检查，再进入综合，避免看起来很自信的报告变成弱路线文件。",
    owner: "质量检查",
    input: "返回研究或人工来源笔记",
    output: "通过、修复提示、阻塞原因或拒绝",
    pass: "用户逻辑、被否决备选、证据登记、首个证明资产、验证渠道和停止规则均已覆盖。",
    repair: "发送聚焦缺口请求，而不是绕过缺失证据直接综合。",
    notDelivery: "缺少否决逻辑、证据标签或停止条件的干净报告。"
  },
  "route-file": {
    label: "路线文件",
    title: "把已接受证据融合成一个决策包",
    body:
      "只有已接受材料会进入选定路线、被否决备选、证据登记、首个证明资产、验证渠道和停止规则。",
    owner: "操作员交付",
    input: "通过覆盖检查的研究和提交事实",
    output: "客户可读路线文件",
    pass: "客户能看到先做什么、不做什么、还缺什么、什么时候停止。",
    repair: "在最终交付前降低信心或请求缺失证据。",
    notDelivery: "多个方向并列、没有证据登记或没有停止规则的计划。"
  },
  validation: {
    label: "验证",
    title: "运行首个证明资产和停止规则",
    body:
      "路线文件不是系统终点。它必须指向首个证明资产、计数信号、忽略的弱信号，以及停止或修复决定。",
    owner: "访客、操作员或创始人",
    input: "已交付路线文件",
    output: "继续、修复、转向或停止证据",
    pass: "记录了合格回复、可用提交、付款加提交、重复异议或有来源的搜索证据。",
    repair: "扩张前重写报价、证明资产、用户群或渠道。",
    notDelivery: "把页面浏览、AI 夸奖、站点地图成功或 PayPal 点击当成需求验证。"
  }
};

const routeProjectClientStateZh: Record<
  RouteProjectStageId,
  Omit<RouteProjectClientState, "stage">
> = {
  plan: {
    customerAction: "只写一次混乱项目：用户、目标、资产、阻塞点、约束、执行方式和审核窗口。",
    websiteAction: "在浏览器本地生成初步路线草稿、准备度分数、证据缺口、被否决方案和可导出简报。",
    manualAction: "此时不会启动人工工作。只有草稿通过提交材料进入审核后，操作员才开始判断。",
    nextVisibleResult: "一个可复制或下载的计划简报，可放入提交材料包。",
    stopOrRepair: "如果用户、资产、阻塞点、约束或禁止声明仍然模糊，先修复再提交。"
  },
  intake: {
    customerAction: "发送计划简报、安全来源材料、链接、截图、约束和可选订单确认。",
    websiteAction: "整理材料包，检测本机保存的计划工作台草稿，复制材料包，并打开干净的邮件交接。",
    manualAction: "人工判断通过、要求修复、阻塞，或标记为不交付。",
    nextVisibleResult: "研究开始前显示通过、修复、阻塞或不交付状态。",
    stopOrRepair: "出现私有数据、危险声明、来源权利缺口或无法交付承诺时，停止或修复。"
  },
  scope: {
    customerAction: "确认路线问题、允许来源、非目标、禁止声明和交付边界。",
    websiteAction: "显示冻结后的范围路径，避免项目漂移到无关模板或宽泛建议。",
    manualAction: "操作员锁定简报、命名路线备选，并决定哪些证据载体可接受。",
    nextVisibleResult: "一个之后可以检查的窄研究和交付边界。",
    stopOrRepair: "如果简报不能命名来源、备选、不可接受声明或停止条件，先修复。"
  },
  research: {
    customerAction: "提供被批准的来源材料，或等待选定载体按锁定简报返回覆盖结果。",
    websiteAction: "保持载体中立的研究标准可见，不宣称某个隐藏 AI 平台拥有流程。",
    manualAction: "可使用人工审查、客户报告、操作员控制的 AI 研究或其他被批准载体。",
    nextVisibleResult: "带来源、不确定性、备选方向和证据需求的返回发现。",
    stopOrRepair: "当用户逻辑、来源覆盖、备选方向或证明需求缺失时，触发二次补研。"
  },
  gate: {
    customerAction: "先检查返回材料是否覆盖路线决策，再接受看起来完整的交付。",
    websiteAction: "暴露通过、修复、阻塞和不交付逻辑，避免弱报告变成路线文件。",
    manualAction: "操作员检查覆盖度，然后综合、修复、阻塞或拒绝材料。",
    nextVisibleResult: "覆盖结论，以及需要时的缺失证据请求。",
    stopOrRepair: "缺少证据标签、被否决备选、证明资产、渠道或停止规则时，修复或阻塞。"
  },
  "route-file": {
    customerAction: "阅读一条选定路线、被否决路径、证据登记、首个证明资产、验证渠道和停止规则。",
    websiteAction: "展示样例和证明案例结构，让最终交付在被信任前可检查。",
    manualAction: "操作员把已接受证据融合成路线文件，并在证据弱时降低信心。",
    nextVisibleResult: "客户可读的路线文件，解释先做什么以及不建设什么。",
    stopOrRepair: "仍有多个并列路线、没有登记账或没有停止规则时，不交付。"
  },
  validation: {
    customerAction: "在选定渠道运行首个证明资产，记录计数信号、忽略的弱信号和异议。",
    websiteAction: "提供验证冲刺和证据语言，避免把页面活动误判为需求。",
    manualAction: "操作员或创始人解释信号，并决定继续、修复、转向或停止。",
    nextVisibleResult: "由合格回复、可用提交、付款加提交或重复异议支撑的验证决定。",
    stopOrRepair: "只有页面浏览、AI 夸奖、站点地图成功或不合格点击时，停止或修复。"
  }
};

export const routeProjectObjects = [
  {
    name: "Route Project",
    definition:
      "The central object: one client project moving through plan, intake, scope, research, gate, Route File, and validation states.",
    owns: "Current state, owner, missing fields, evidence status, and next action."
  },
  {
    name: "Intake Packet",
    definition:
      "The reviewable input bundle created from the visitor's plain-language plan and safe supporting material.",
    owns: "Project facts, buyer, assets, source boundaries, constraints, payment role, and blocked claims."
  },
  {
    name: "Evidence Ledger",
    definition:
      "The claim table that prevents inference, public context, page activity, or market signals from becoming proof.",
    owns: "Verified, inferred, pending, stale, blocked, and not-claimed statuses."
  },
  {
    name: "Route File",
    definition:
      "The final decision artifact, not a dashboard or generic report.",
    owns: "Selected route, rejected alternatives, first proof asset, validation channel, and stop rule."
  }
];

export const routeProjectSupportLayer = [
  {
    label: "SEO and AI visibility pages",
    role:
      "Support discovery and measurement. They should not compete with the Route File as the main product."
  },
  {
    label: "Templates and checklists",
    role:
      "Support delivery quality. They are backend method assets unless a visitor needs that exact artifact."
  },
  {
    label: "Launch Kit and exposure pages",
    role:
      "Support validation after a Route File exists. They do not prove demand on their own."
  }
];

export function getRouteProjectStage(id: RouteProjectStageId) {
  return routeProjectStages.find((stage) => stage.id === id) ?? routeProjectStages[0];
}

export function getRouteProjectClientState(id: RouteProjectStageId) {
  return routeProjectClientStates.find((state) => state.stage === id) ?? routeProjectClientStates[0];
}

export function getLocalizedRouteProjectStages(language: RouteProjectLanguage = "en") {
  if (language === "en") {
    return routeProjectStages;
  }

  return routeProjectStages.map((stage) => ({
    ...stage,
    ...routeProjectStageZh[stage.id]
  }));
}

export function getLocalizedRouteProjectStage(
  id: RouteProjectStageId,
  language: RouteProjectLanguage = "en"
) {
  return getLocalizedRouteProjectStages(language).find((stage) => stage.id === id) ?? getLocalizedRouteProjectStages(language)[0];
}

export function getLocalizedRouteProjectClientState(
  id: RouteProjectStageId,
  language: RouteProjectLanguage = "en"
) {
  if (language === "en") {
    return getRouteProjectClientState(id);
  }

  const base = getRouteProjectClientState(id);
  return {
    ...base,
    ...routeProjectClientStateZh[id]
  };
}
