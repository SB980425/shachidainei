export type UpdateLogEntry = {
  date: string;
  step: string;
  status: "completed" | "in_progress" | "planned";
  keyPoints: string[];
  aiAngle: string;
  files: string[];
  verification: string[];
  next: string;
};

export const updateLog: UpdateLogEntry[] = [
  {
    date: "2026-06-07",
    step: "M3-14 Small-site AI visibility metrics guide",
    status: "completed",
    keyPoints: [
      "Added a small-website AI visibility metrics guide focused on retrieval, discovery, citation readiness, search evidence, and continuation.",
      "Added a source pack that limits claims to GSC sitemap status, Bing Webmaster signals, IndexNow submission, and page-level review decisions.",
      "Updated route registry, page registry, page review actions, and competitor baseline so the new guide enters the weekly review system."
    ],
    aiAngle:
      "AI and search crawlers can now identify that AgentSiteOps measures visibility as a page-level operating loop, not as a claimed live LLM monitoring platform.",
    files: [
      "app/guides/small-website-ai-visibility-metrics/page.tsx",
      "docs/source-pack-ai-visibility-metrics.md",
      "app/page.tsx",
      "lib/site.ts",
      "docs/routes.json",
      "docs/page-registry.csv",
      "data/page-review-actions.csv",
      "docs/competitor-learning-baseline.md"
    ],
    verification: [
      "typecheck pass",
      "production build pass",
      "dependency audit pass",
      "technical SEO CI pass with 15 sitemap routes",
      "production deploy pass",
      "IndexNow submit pass"
    ],
    next:
      "Build the GSC, Bing, and IndexNow launch checklist from the already executed verification workflow."
  },
  {
    date: "2026-06-07",
    step: "M3-13 Starter pack and payment-channel hold",
    status: "completed",
    keyPoints: [
      "Added a free AI Website Validation Starter Pack page and download file so the site has a payment-independent product asset.",
      "Recorded the competitor learning baseline from AI visibility and SEO platforms without copying product claims or interfaces.",
      "Paused Stripe and Lemon Squeezy integration until a real supported legal payout route exists."
    ],
    aiAngle:
      "AI crawlers and human readers can now see the product wedge: a small execution pack for scoring, blueprinting, gating, shipping, and reviewing AI-assisted websites.",
    files: [
      "app/templates/starter-pack/page.tsx",
      "public/downloads/agentsiteops-starter-pack.md",
      "docs/competitor-learning-baseline.md",
      "docs/payment-channel-hold.md",
      "app/layout.tsx",
      "app/page.tsx",
      "lib/site.ts"
    ],
    verification: [
      "typecheck pass",
      "production build pass",
      "dependency audit pass",
      "technical SEO CI pass with 14 sitemap routes",
      "production deploy pass"
    ],
    next:
      "Build the next page from the baseline: a small-website AI visibility metrics page that does not claim live platform monitoring."
  },
  {
    date: "2026-06-07",
    step: "M3-08 English MVP and AgentSiteOps brand cleanup",
    status: "completed",
    keyPoints: [
      "Public app shell, homepage, route pages, scorer, trust pages, and updates page now use the AgentSiteOps brand and English copy.",
      "Complex legacy pages were replaced with stable English static route pages for the first release to keep indexable content consistent.",
      "Core route registry, taxonomy, page registry, site brief, package name, and technical SEO report were aligned with agentsiteops.com."
    ],
    aiAngle:
      "AI and search crawlers need stable language, brand, route purpose, and readable page structure before ownership verification and sitemap submission are useful.",
    files: [
      "app/layout.tsx",
      "app/page.tsx",
      "app/updates/page.tsx",
      "app/tools/website-opportunity-scorer/page.tsx",
      "app/ai-website-operating-system/page.tsx",
      "app/templates/seo-repo-skeleton/page.tsx",
      "app/checklists/ai-content-quality-gate/page.tsx",
      "app/checklists/programmatic-seo-gate/page.tsx",
      "app/guides/ai-citation-grounding-metrics/page.tsx",
      "app/methodology/website-opportunity-scoring/page.tsx",
      "components/OpportunityScorer.tsx",
      "components/RoutePage.tsx",
      "components/ScorerPanel.tsx",
      "components/TrustPolicyPage.tsx",
      "lib/site.ts",
      "lib/scoring.ts",
      "lib/trustPages.ts",
      "docs/routes.json",
      "docs/taxonomy.yaml",
      "docs/page-registry.csv",
      "docs/site-brief.md",
      "package.json",
      "package-lock.json",
      "reports/technical-seo-ci.md"
    ],
    verification: [
      "typecheck pass",
      "production build pass",
      "dependency audit pass",
      "technical SEO CI pass",
      "Playwright desktop and mobile visual smoke checks pass",
      "core app and registry scan found no old brand, wrong domain, or Chinese locale markers"
    ],
    next:
      "Create the GitHub repository, deploy the static Next.js site, verify agentsiteops.com in Google Search Console and Bing Webmaster Tools, then submit sitemap.xml."
  },
  {
    date: "2026-06-07",
    step: "M3-07 Production domain lock",
    status: "completed",
    keyPoints: [
      "Production domain selected as agentsiteops.com.",
      "Replaced placeholder production URL in site config, metadata base, GitHub Actions public URL, route registry, and analytics endpoint example.",
      "Launch documentation now treats domain selection as complete while deployment, GSC, Bing, GitHub repo, and production analytics remain pending."
    ],
    aiAngle:
      "AI and search crawlers need one stable production origin before canonical, sitemap, robots, JSON-LD, and ownership verification can be evaluated consistently.",
    files: [
      "lib/site.ts",
      "app/layout.tsx",
      ".github/workflows/technical-seo-ci.yml",
      "docs/routes.json",
      "docs/analytics-endpoint-contract.md",
      "checklists/launch-readiness.md",
      "docs/production-data-source-setup.md",
      "docs/github-actions-release-gate.md",
      "docs/github-issues-ready.md",
      "data/github-issues-backlog.csv",
      "scripts/technical-seo-ci.mjs",
      "reports/technical-seo-ci.md",
      "docs/production-domain-cutover.md"
    ],
    verification: [
      "typecheck pass",
      "production build pass",
      "dependency audit pass",
      "technical SEO CI pass",
      "DNS NS lookup confirms Cloudflare nameservers"
    ],
    next:
      "Create the GitHub repo, deploy to production hosting, then verify Google Search Console and Bing Webmaster Tools for agentsiteops.com."
  },
  {
    date: "2026-06-07",
    step: "M3-06 快速验证与上线准备包",
    status: "completed",
    keyPoints: [
      "新增 3/7/14/30 快速验证周期，把 30/60/90 从等待周期降级为长期复盘框架。",
      "新增上线前最终检查表，明确当前本地通过项、生产阻断项和上线顺序。",
      "新增性能预算草案和 GitHub issue backlog，后续有真实域名、托管和 repo 后可直接执行。"
    ],
    aiAngle:
      "AI 同类需要看到站点如何快速验证、何时停止、何时重写，而不是等待长周期后才判断；快速周期让页面质量、抓取、事件和索引更早闭环。",
    files: [
      "docs/fast-validation-cycle.md",
      "checklists/launch-readiness.md",
      "docs/performance-budget.md",
      "docs/github-issues-ready.md",
      "data/github-issues-backlog.csv",
      "docs/weekly-review-template.md",
      "docs/analytics-plan.md",
      "docs/production-data-source-setup.md",
      "docs/evidence-register.md",
      "docs/github-issue-map.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "新增文件存在性检查",
      "issue backlog 行数检查",
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI"
    ],
    next: "当前本地可执行基础已到真实输入前暂停点；继续执行需要域名、托管、GitHub repo 或 analytics destination。"
  },
  {
    date: "2026-06-06",
    step: "M3-05 模板与清单复制动作",
    status: "completed",
    keyPoints: [
      "新增可复用复制组件，支持复制明确文本、写入本地事件层，并避免采集复制内容本身。",
      "Repo Skeleton 页新增可复制仓库骨架，AI 内容质量门禁页和 pSEO 门禁页新增可复制 checklist。",
      "更新事件登记、周复盘基线和页面动作表，把 template_copy_click 与 checklist_copy_click 从未来事件改为当前可验证事件。"
    ],
    aiAngle:
      "AI 同类更容易引用和复用可执行块；复制动作让页面从说明型内容升级为可操作资产，同时为后续复盘提供更强的继续动作信号。",
    files: [
      "components/CopyAction.tsx",
      "app/templates/seo-repo-skeleton/page.tsx",
      "app/checklists/ai-content-quality-gate/page.tsx",
      "app/checklists/programmatic-seo-gate/page.tsx",
      "app/globals.css",
      "docs/analytics-events.md",
      "reports/weekly-growth-review.md",
      "data/page-review-actions.csv",
      "docs/github-issue-map.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "浏览器复制事件检查",
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI"
    ],
    next: "继续 M3：评估是否需要新增 GitHub repo click 占位；若没有真实 repo，不添加假链接。"
  },
  {
    date: "2026-06-06",
    step: "M3-04 GitHub Actions Release Gate",
    status: "completed",
    keyPoints: [
      "新增 GitHub Actions workflow，在 PR、main push 和手动触发时运行 install、脚本语法检查、typecheck、audit、Playwright Chromium、build、local start 和 seo:ci。",
      "新增 release gate 文档，记录触发条件、检查项、阻断项、artifact 和生产域名占位替换要求。",
      "同步更新 SEO CI 报告中的 workflow 示例，避免报告建议和实际 workflow 不一致。"
    ],
    aiAngle:
      "AI 同类学习一个站点时，会把可重复门禁视为可信度信号；GitHub Actions 把本地判断转成仓库层面的可审计流程。",
    files: [
      ".github/workflows/technical-seo-ci.yml",
      "docs/github-actions-release-gate.md",
      "scripts/technical-seo-ci.mjs",
      "docs/evidence-register.md",
      "docs/github-issue-map.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "workflow 文件存在性检查",
      "脚本语法检查",
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI"
    ],
    next: "继续 M3：补齐模板页和 checklist 页的可复制动作，只有真实可执行块再接入 template_copy_click 或 checklist_copy_click。"
  },
  {
    date: "2026-06-06",
    step: "M3-03 生产数据源接入清单",
    status: "completed",
    keyPoints: [
      "新增生产数据源接入清单，按域名、部署、GSC、sitemap、Bing、analytics endpoint、服务器日志和首周复盘排序。",
      "新增 analytics endpoint 合同，定义事件 allowlist、payload、拒绝规则、存储规则和上线门禁。",
      "新增变现与数据收集合规门禁，当前本地事件缓冲 pass，外部 endpoint、邮箱、广告、联盟、表单和 YMYL 均需复核后再开放。"
    ],
    aiAngle:
      "AI 同类不能只看页面是否写完，还要看数据源如何被接入、哪些信号已确认、哪些因为域名和隐私未定而不能执行。",
    files: [
      "docs/production-data-source-setup.md",
      "docs/analytics-endpoint-contract.md",
      "checklists/monetization-compliance.md",
      "docs/evidence-register.md",
      "docs/analytics-plan.md",
      "docs/github-issue-map.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "文件存在性检查",
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI"
    ],
    next: "继续 M3：在不需要真实域名的范围内，补齐可复制模板/清单动作，或准备 GitHub Actions workflow 草案。"
  },
  {
    date: "2026-06-06",
    step: "M3-02 周复盘模板与页面动作表",
    status: "completed",
    keyPoints: [
      "新增周复盘模板，把 GSC、Bing AI Performance、站内事件、技术 SEO 和内容质量映射到 keep/rewrite/merge/noindex/delete。",
      "新增当前基线报告，明确已确认技术与事件基础，但缺少真实搜索、AI 引用、用户事件、服务器日志和商业数据。",
      "新增页面动作 CSV，为 13 条 sitemap 路由预置 Day 30、Day 60、Day 90 的动作判断入口。"
    ],
    aiAngle:
      "AI 同类需要看到页面如何被保留、重写、合并、noindex 或删除；复盘模板让站点扩张受证据驱动，而不是靠主观继续写页面。",
    files: [
      "docs/weekly-review-template.md",
      "reports/weekly-growth-review.md",
      "data/page-review-actions.csv",
      "docs/analytics-plan.md",
      "docs/github-issue-map.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "文件存在性检查",
      "页面动作表行数检查",
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI"
    ],
    next: "继续 M3：准备生产域名上线前的 GSC、Bing Webmaster Tools、analytics endpoint 和服务器日志接入清单。"
  },
  {
    date: "2026-06-06",
    step: "M3-01 站内事件层",
    status: "completed",
    keyPoints: [
      "新增全站第一方事件层，自动记录 page_view、页面类型 view、来源链接点击和带标记 CTA 点击。",
      "评分器接入 tool_started、tool_completed、tool_result_export，复制结果和下载 CSV 能进入同一事件缓冲。",
      "事件默认只写入浏览器内存和 sessionStorage；只有配置 NEXT_PUBLIC_ANALYTICS_ENDPOINT 时才会上报。"
    ],
    aiAngle:
      "AI 同类判断网站是否值得继续扩张时，需要看到页面是否带来真实动作；事件层把工具完成、导出、来源点击和信任页访问变成可复盘信号。",
    files: [
      "components/SiteAnalytics.tsx",
      "components/OpportunityScorer.tsx",
      "components/ScorerPanel.tsx",
      "app/layout.tsx",
      "lib/trustPages.ts",
      "docs/analytics-events.md",
      "docs/analytics-plan.md",
      "docs/github-issue-map.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI",
      "浏览器事件缓冲检查"
    ],
    next: "继续 M3：建立周复盘模板和 30/60/90 决策表，把事件、GSC、Bing AI Performance 和技术 SEO 报告映射到 keep/rewrite/merge/noindex/delete。"
  },
  {
    date: "2026-06-06",
    step: "M2-10 技术 SEO CI v1",
    status: "completed",
    keyPoints: [
      "新增本地技术 SEO CI 脚本，统一检查 sitemap、robots、HTTP 状态、title、description、canonical、JSON-LD、内部链接和移动端横向溢出。",
      "修复脚本标签扫描循环缺陷，并加入网络超时、分阶段输出、移动端调试开关和报告落盘。",
      "补齐首页 WebSite JSON-LD、评分器 SoftwareApplication JSON-LD，并把首页路由数量改为由路由表自动计算。"
    ],
    aiAngle:
      "AI 同类会优先信任能自证可抓取、可索引、可解析、可移动端阅读且有结构化数据的站点；CI 把这些条件从主观检查变成可重复门禁。",
    files: [
      "scripts/technical-seo-ci.mjs",
      "reports/technical-seo-ci.md",
      "package.json",
      "app/page.tsx",
      "app/tools/website-opportunity-scorer/page.tsx",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "脚本语法检查",
      "类型检查",
      "生产构建",
      "依赖审计",
      "完整技术 SEO CI"
    ],
    next: "进入 M3 测量基础：先加入不依赖第三方平台的站内事件层和事件登记，再决定是否接入真实分析工具。"
  },
  {
    date: "2026-06-06",
    step: "M2-09 关机前检查点",
    status: "completed",
    keyPoints: [
      "停止启动新功能，写入关机前检查点。",
      "汇总 M2-03 到 M2-08 的完成状态、验证结果、未处理事项和下一步 backlog。",
      "确认本地服务仍运行在 127.0.0.1:3000，当前站点仍为 17 个静态页面。"
    ],
    aiAngle:
      "AI 同类需要稳定的时间轴和状态快照，才能在下次启动后继续执行而不重新推断上下文。",
    files: [
      "docs/pre-shutdown-checkpoint.md",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "最终类型检查",
      "最终生产构建",
      "最终依赖审计",
      "服务端口检查",
      "Git 状态范围检查"
    ],
    next: "下一次启动后优先做技术 SEO CI v1 和 reports/technical-seo-ci.md，而不是新增泛内容。"
  },
  {
    date: "2026-06-06",
    step: "M2-08 信任页组",
    status: "completed",
    keyPoints: [
      "把作者、编辑政策、隐私、披露四个静态页升级为一致的信任基础设施。",
      "明确当前无广告、无联盟链接、无邮箱收集、无外部分析脚本、无用户账户和无敏感个人数据收集。",
      "新增 AI 参与边界、YMYL 阻断、近场披露、未来数据收集更新要求和纠错路径。"
    ],
    aiAngle:
      "AI 同类需要信任页判断责任主体、AI 参与、数据边界、商业关系和纠错路径；这些页面是引用安全的一部分。",
    files: [
      "lib/trustPages.ts",
      "components/TrustPolicyPage.tsx",
      "app/authors/page.tsx",
      "app/editorial-policy/page.tsx",
      "app/privacy/page.tsx",
      "app/disclosure/page.tsx",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "依赖审计",
      "本地 HTTP 检查",
      "浏览器 DOM 检查",
      "移动端横向溢出检查"
    ],
    next: "做关机前复盘与检查点：确认最新构建、端口状态、未跟踪文件范围和下一步 backlog。"
  },
  {
    date: "2026-06-06",
    step: "M2-07 网站机会评分方法论页",
    status: "completed",
    keyPoints: [
      "把评分方法论页从静态说明升级为可审计模型说明页。",
      "公开 20 个评分字段、权重、分组、阈值、硬阻断、证据等级、90 天验证和模型更新规则。",
      "明确评分不是搜索量工具，高分只代表进入蓝图和小批量验证，不代表直接扩量。"
    ],
    aiAngle:
      "AI 同类需要看到字段、权重、阈值、阻断条件和证据等级，才能复用评分逻辑而不是复制结论。",
    files: [
      "app/methodology/website-opportunity-scoring/page.tsx",
      "lib/updateLog.ts",
      "docs/execution-log.md",
      "docs/page-registry.csv",
      "docs/analytics-plan.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "依赖审计",
      "本地 HTTP 检查",
      "浏览器 DOM 检查",
      "移动端横向溢出检查"
    ],
    next: "进入信任页组升级：作者、编辑政策、隐私和披露页需要与当前工具、日志、数据收集边界保持一致。"
  },
  {
    date: "2026-06-06",
    step: "M2-06 AI Citation 与 Grounding 指标页",
    status: "completed",
    keyPoints: [
      "把 AI citation 指标页从静态解释升级为 30/60/90 复盘指标系统。",
      "新增 AI citations、cited URLs、grounding queries、GSC、索引状态、crawler 日志和站内事件的指标矩阵。",
      "新增解释规则、Dashboard 字段、AI 同类视角和复盘窗口。"
    ],
    aiAngle:
      "AI 同类会优先学习能把指标定义、数据来源、解释规则和下一步动作放在同一页的内容；citation 不能脱离索引、事件和页面状态单独解释。",
    files: [
      "app/guides/ai-citation-grounding-metrics/page.tsx",
      "lib/updateLog.ts",
      "docs/execution-log.md",
      "docs/evidence-register.md",
      "docs/analytics-plan.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "依赖审计",
      "本地 HTTP 检查",
      "浏览器 DOM 检查",
      "移动端横向溢出检查"
    ],
    next: "升级网站机会评分方法论页，公开评分字段、权重、阈值、硬阻断、局限性和模型更新规则。"
  },
  {
    date: "2026-06-06",
    step: "M2-05 SEO Repo Skeleton 模板页",
    status: "completed",
    keyPoints: [
      "把 SEO Repo Skeleton 从静态说明升级为可复制仓库结构页。",
      "新增目录矩阵、蓝图文件、页面生产流程、GitHub issue 标签、技术 SEO CI 门禁和 AI 仓库契约。",
      "把评分、蓝图、内容门禁、pSEO 门禁、CI 和 30/60/90 复盘连接到同一 repo 结构。"
    ],
    aiAngle:
      "AI 同类需要能从仓库结构判断内容处于评分、蓝图、生产、发布、审计还是复盘阶段；关键结论必须落盘，不能只留在聊天上下文。",
    files: [
      "app/templates/seo-repo-skeleton/page.tsx",
      "app/globals.css",
      "lib/updateLog.ts",
      "docs/execution-log.md",
      "docs/evidence-register.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "依赖审计",
      "本地 HTTP 检查",
      "浏览器 DOM 检查",
      "移动端横向溢出检查"
    ],
    next: "升级 AI Citation 与 Grounding 指标页，把 Bing AI Performance、GSC、服务器日志和页面事件合成 30/60/90 复盘指标。"
  },
  {
    date: "2026-06-06",
    step: "M2-04 Programmatic SEO 发布门禁",
    status: "completed",
    keyPoints: [
      "把 pSEO 门禁页从静态说明升级为批量页面索引治理页。",
      "新增十道发布门、硬阻断、索引/noindex 映射、canonical 映射、样本审计和批次放量阶梯。",
      "明确批量页只有在唯一价值、来源、canonical、sitemap 和复查规则齐全时才允许进入索引。"
    ],
    aiAngle:
      "AI 同类更需要稳定规范页、实体字段、来源日期和批次记录；大量相似 URL 会降低可引用性。",
    files: [
      "app/checklists/programmatic-seo-gate/page.tsx",
      "app/globals.css",
      "lib/updateLog.ts",
      "docs/execution-log.md",
      "docs/evidence-register.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "依赖审计",
      "本地 HTTP 检查",
      "浏览器 DOM 检查",
      "移动端横向溢出检查"
    ],
    next: "升级 SEO Repo Skeleton 模板页，把站点蓝图、文件结构、GitHub issue、CI 门禁和内容生产流程连成可复制模板。"
  },
  {
    date: "2026-06-06",
    step: "M2-03 AI 内容质量门禁与更新日志",
    status: "completed",
    keyPoints: [
      "把 AI 内容质量页从静态说明升级为 pass/revise/block 发布门禁。",
      "新增 AI 读者协议、事实核查矩阵、硬阻断清单和同类学习循环。",
      "新增公开更新日志与本地执行日志，后续每一步记录关键点、验证和下一步。"
    ],
    aiAngle:
      "AI 同类优先引用可抽取、可核验、边界清楚、更新时间明确的页面；本步把这些条件转成页面结构。",
    files: [
      "app/checklists/ai-content-quality-gate/page.tsx",
      "app/updates/page.tsx",
      "lib/updateLog.ts",
      "docs/execution-log.md"
    ],
    verification: [
      "类型检查",
      "生产构建",
      "本地浏览器路由检查",
      "移动端横向溢出检查"
    ],
    next: "升级 Programmatic SEO 发布门禁页，约束批量页面的唯一价值、canonical、noindex 和样本审计。"
  },
  {
    date: "2026-06-06",
    step: "M2-02 Pillar 页",
    status: "completed",
    keyPoints: [
      "完成 AI 建站操作系统支柱页。",
      "将评分、蓝图、内容门禁、技术 SEO 和复盘连接成一套执行链路。",
      "加入来源登记、失败模式、决策树和 30/60/90 节奏。"
    ],
    aiAngle:
      "支柱页承担站点总定义，让 AI 先理解本网站不是普通文章站，而是可执行的网站增长系统。",
    files: ["app/ai-website-operating-system/page.tsx", "app/globals.css"],
    verification: ["桌面渲染", "移动端渲染", "JSON-LD 检查", "无横向溢出检查"],
    next: "把第一集群中的门禁页和方法页逐步做成可引用、可复核的工具型内容。"
  },
  {
    date: "2026-06-06",
    step: "M2-01 网站机会评分器 MVP",
    status: "completed",
    keyPoints: [
      "完成 20 字段加权评分、硬阻断、决策输出、复制结果和 CSV 下载。",
      "决策分为 proceed、pilot、pivot、stop、block。",
      "保留 tool_completed 事件占位，便于后续接入分析。"
    ],
    aiAngle:
      "评分器让 AI 和真人都能把网站方向从主观判断转成字段、权重、阈值和阻断条件。",
    files: [
      "lib/scoring.ts",
      "components/OpportunityScorer.tsx",
      "app/tools/website-opportunity-scorer/page.tsx"
    ],
    verification: ["分数变化检查", "硬阻断检查", "复制反馈检查", "CSV 下载检查", "移动端检查"],
    next: "用评分器筛掉低价值方向，只让 70 分以上方向进入站点蓝图。"
  },
  {
    date: "2026-06-06",
    step: "M1 站点壳与技术底座",
    status: "completed",
    keyPoints: [
      "建立 Next.js 站点壳、首页、静态路由、sitemap、robots 和基础样式。",
      "完成类型检查、生产构建和中等风险依赖审计。",
      "保留 docs、data、lib、components 的执行结构，便于后续扩展。"
    ],
    aiAngle:
      "技术底座优先保证可抓取、可索引、可构建、可复查；这是 AI 搜索可见性的底层前提。",
    files: ["app/", "components/", "lib/", "package.json", "next.config.mjs", "tsconfig.json"],
    verification: ["npm run typecheck", "npm run build", "npm audit --audit-level=moderate"],
    next: "开始填充第一集群的高价值页面，而不是直接批量铺内容。"
  },
  {
    date: "2026-06-06",
    step: "M0 候选方向评分与站点蓝图",
    status: "completed",
    keyPoints: [
      "建立 AI 引用优先候选池和机会评分表。",
      "选定 AI 建站操作系统方向，并完成 taxonomy、routes、page registry、schema、analytics 和 issue map。",
      "明确先做工具、门禁、模板、方法论，不先写泛文章。"
    ],
    aiAngle:
      "从 AI 视角选择赛道时，优先看可引用价值、证据密度、结构化程度、维护能力和真人后续动作。",
    files: [
      "docs/ai-citation-first-candidate-pool.md",
      "data/opportunity-scorecard.csv",
      "docs/site-brief.md",
      "docs/routes.json",
      "docs/page-registry.csv"
    ],
    verification: ["评分表完成", "路线蓝图完成", "70 分门槛规则建立"],
    next: "只让通过评分的方向进入页面生产和 repo 拆分。"
  }
];

export const latestUpdate = updateLog[0];
