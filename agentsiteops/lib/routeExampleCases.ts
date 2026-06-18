import type { SiteLanguage } from "@/components/LanguageToggle";

export type RouteExampleCase = {
  id: string;
  title: Record<SiteLanguage, string>;
  roughInput: Record<SiteLanguage, string>;
  systemRead: Record<SiteLanguage, string>;
  failureNode: Record<SiteLanguage, string>;
  selectedRoute: Record<SiteLanguage, string>;
  evidenceNeeded: Record<SiteLanguage, string[]>;
  stopRule: Record<SiteLanguage, string>;
};

export const routeExampleCases: RouteExampleCase[] = [
  {
    id: "ai-companion",
    title: {
      en: "AI companion memory service",
      zh: "长期记忆型 AI 伴侣服务"
    },
    roughInput: {
      en: "People who believe in AI may want to start shaping a future companion now, with memory preserved until the day the assistant can live beside them.",
      zh: "真正相信 AI 的人，现在已经在想如何指定未来的 AI 伴侣。先建立记忆和关系，期待有一天把她接回家。"
    },
    systemRead: {
      en: "The idea is not only a companion product. It touches privacy, memory custody, emotional dependency, consent, age groups, and long-term trust.",
      zh: "这不只是陪伴产品，还涉及隐私、记忆托管、情感依赖、同意边界、年龄人群和长期信任。"
    },
    failureNode: {
      en: "Rights, privacy, and emotional safety are unclear before any product promise.",
      zh: "在承诺产品前，权利、隐私和情感安全边界不清。"
    },
    selectedRoute: {
      en: "Run a privacy-first memory prototype with fictional data and a consent checklist before selling relationship continuity.",
      zh: "先做隐私优先的记忆原型，用虚构数据和同意清单测试，不直接销售关系延续承诺。"
    },
    evidenceNeeded: {
      en: ["One consent and data-deletion model", "A fictional memory demo", "Five user reactions to the boundary"],
      zh: ["一套同意和删除机制", "一个虚构记忆演示", "五个用户对边界的真实反馈"]
    },
    stopRule: {
      en: "Stop if users ask for therapy, regulated care, hidden identity simulation, or permanent memory custody before trust is proven.",
      zh: "如果用户期待治疗、养老监管服务、隐藏身份模拟或永久托管记忆，先停止该路线。"
    }
  },
  {
    id: "ai-service",
    title: {
      en: "AI workflow service",
      zh: "AI 工作流服务"
    },
    roughInput: {
      en: "I can build AI automations for small businesses, but I do not know whether to sell setup, dashboards, prompts, or consulting.",
      zh: "我能给小商家做 AI 自动化，但不知道该卖搭建、看板、提示词包还是咨询。"
    },
    systemRead: {
      en: "The capability is broad. The first route must isolate one buyer, one repeated manual task, one proof asset, and one delivery boundary.",
      zh: "能力太宽。第一条路线必须锁定一个买家、一个重复手工任务、一个证明资产和一个交付边界。"
    },
    failureNode: {
      en: "Premature product build: the service may become an agency menu before one buyer pain is proven.",
      zh: "过早产品化：还没证明一个买家痛点，就变成服务菜单。"
    },
    selectedRoute: {
      en: "Offer a narrow 72-hour intake and follow-up workflow setup before building dashboards or selling prompt packs.",
      zh: "先提供 72 小时客户接入与跟进工作流搭建，不先做看板或提示词包。"
    },
    evidenceNeeded: {
      en: ["One before/after workflow screenshot", "Ten targeted outreach messages", "A qualified reply or concrete rejection"],
      zh: ["一张前后对比流程截图", "十条定向触达消息", "一个合格回复或具体拒绝理由"]
    },
    stopRule: {
      en: "Stop if 30 targeted messages produce no qualified reply or buyers only ask for unrelated implementation.",
      zh: "如果 30 条定向触达没有合格回复，或买家只要求无关实施，就停止或改路线。"
    }
  },
  {
    id: "content-tool",
    title: {
      en: "Short-content planning tool",
      zh: "短内容选题规划工具"
    },
    roughInput: {
      en: "I want a tool that helps creators turn scattered topic ideas into a posting plan, hooks, and validation tasks.",
      zh: "我想做一个工具，把创作者零散选题变成发布计划、标题钩子和验证任务。"
    },
    systemRead: {
      en: "The danger is building a generic content generator. The route must prove a specific creator segment and one repeated planning pain.",
      zh: "风险是变成通用内容生成器。路线必须证明一个具体创作者人群和一个重复规划痛点。"
    },
    failureNode: {
      en: "Weak acquisition channel: no first creator segment or proof that they will change workflow.",
      zh: "获客渠道薄弱：没有第一类创作者，也没有证明他们会改变工作流。"
    },
    selectedRoute: {
      en: "Create a manual planning sample for one niche creator group before building software.",
      zh: "先给一个细分创作者群体做人工规划样例，再决定是否做软件。"
    },
    evidenceNeeded: {
      en: ["Three creator profiles", "One manual plan sample", "A reply showing the plan changed what they would post"],
      zh: ["三个创作者画像", "一个人工规划样例", "一条证明计划改变发布动作的反馈"]
    },
    stopRule: {
      en: "Stop if creators praise the output but do not use it to choose a post, channel, or test date.",
      zh: "如果创作者只夸输出但不用它决定内容、渠道或测试日期，就停止继续开发。"
    }
  }
];
