export type SocialChannel = "founder" | "technical" | "wechat" | "public-update";
export type SocialLanguage = "en" | "zh";

export const socialVariants: Record<
  SocialChannel,
  { label: string; context: string; en: string; zh: string }
> = {
  founder: {
    label: "Founder update",
    context: "Personal build progress",
    en:
      "AgentSiteOps turns messy project material into one Route File: selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule. It does not promise traffic or revenue.",
    zh:
      "AgentSiteOps 把混乱项目材料整理成一份 Route File：选定路线、被否决方案、证据台账、第一证明资产、验证渠道和停止规则。它不承诺流量或收入。"
  },
  technical: {
    label: "Technical audience",
    context: "Builder or operator channel",
    en:
      "The website does not create hidden research results. It prepares route briefs, checks returned reports, creates gap prompts, and fuses accepted research into a Route File.",
    zh:
      "这个网站不生成隐藏研究结果。它负责准备路线简报、检查返回报告、生成补研提示词，并把通过验收的研究融合成 Route File。"
  },
  wechat: {
    label: "Chinese social",
    context: "WeChat, Xiaohongshu, or Zhihu style",
    en:
      "Use AgentSiteOps before building more pages, tools, checkout, or content. The first output is a route decision file, not a growth promise.",
    zh:
      "在继续做页面、工具、支付或内容前，先用 AgentSiteOps 产出一份路线决策文件。它交付的是路线判断，不是增长承诺。"
  },
  "public-update": {
    label: "Public changelog",
    context: "Product update or launch note",
    en:
      "New execution workbench: intake, scope, approved research channel, coverage gate, Route File, and bilingual social copy now sit in one visible path.",
    zh:
      "新增执行工作台：项目接入、边界锁定、研究通道、覆盖验收、Route File 和中英文社交文案已经整合进一条可见路径。"
  }
};

export const socialCopyPreviewRows = [
  {
    language: "中文",
    text: socialVariants.founder.zh
  },
  {
    language: "English",
    text: socialVariants.founder.en
  }
];

export const socialCopyBoundaryRows = [
  {
    label: "Translate tone",
    body: "Language, channel, and length can change."
  },
  {
    label: "Keep evidence",
    body: "Route File sections and research-channel boundary must stay present."
  },
  {
    label: "Block promises",
    body: "No added traffic, ranking, revenue, buyer response, or hidden automation claim."
  }
];
