# 证据登记

## AI 搜索与抓取依据

| 来源 | URL | 本次用途 |
|---|---|---|
| Google Search Central: Top ways to ensure your content performs well in Google's AI experiences on Search | https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search | 确认 AI 搜索仍强调 unique, valuable, non-commodity content。 |
| Google Search Central: Spam policies for Google web search | https://developers.google.com/search/docs/essentials/spam-policies | 确认 scaled content abuse、scraping、misleading functionality 等风险。 |
| Bing Webmaster Guidelines | https://www.bing.com/webmaster/help/Webmaster-Guidelines-30fba23a | 确认 Bing/Copilot/grounding/citations 仍依赖 crawl、indexing、content clarity 等基础。 |
| Bing Webmaster Blog: Introducing AI Performance in Bing Webmaster Tools Public Preview | https://blogs.bing.com/webmaster/February-2026-284b440771373a5a245425a5d31a8ad6/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview | 确认 AI citations、cited URLs、grounding queries 可作为 AI 搜索可见性指标。 |
| OpenAI: Overview of OpenAI Crawlers | https://platform.openai.com/docs/bots | 确认 OAI-SearchBot、GPTBot 与 robots.txt 管理边界。 |

## 候选方向竞争信号

| 信号 | URL | 用途 |
|---|---|---|
| Promtable prompt library | https://promtable.com/ | 说明普通 prompt library 已有竞争，必须差异化。 |
| AIPromptary prompt library | https://aipromptary.com/ | 说明图像/视频 prompt 聚合站已存在。 |
| CinePrompt video prompts | https://www.cineprompt.pro/prompts | 说明 AI video prompt generator 已有商业化页面。 |
| VideoPrompt app | https://videoprompt.app/ | 说明视频 prompt library 不是空白赛道。 |
| Kompozy AI video generator comparison | https://kompozy.io/ai-content/video-generator-comparison | 说明 AI video tools comparison 已有内容竞争，但仍可用评测方法和数据更新差异化。 |

## Programmatic SEO 与索引治理依据

| 来源 | URL | 本次用途 |
|---|---|---|
| Google Search Central: Spam policies for Google web search | https://developers.google.com/search/docs/essentials/spam-policies | 确认批量低价值生成、拼贴、抓取和误导性功能属于高风险。 |
| Google Search Central: Robots meta tag specifications | https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag | 确认 noindex 需要通过 meta 或 HTTP header，并且 crawler 必须能访问页面才能读取。 |
| Google Search Central: How to specify a canonical URL | https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls | 确认 canonical、redirect、sitemap 都会影响规范 URL 判断，robots.txt 不应用作 canonical。 |
| Google Search Central: Technical requirements | https://developers.google.com/search/docs/essentials/technical | 确认不希望被索引的页面应使用 noindex，并允许 Google 抓取该 URL。 |
| Google Search Central Blog: Crawling December faceted navigation | https://developers.google.com/search/blog/2024/12/crawling-december-faceted-nav | 确认筛选导航会制造大量低价值 URL，需要 crawl/index 治理。 |

## Repo Skeleton 与 GitHub/Next.js 技术依据

| 来源 | URL | 本次用途 |
|---|---|---|
| GitHub Docs: Workflow syntax for GitHub Actions | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 确认 GitHub Actions workflow 由 YAML 定义，可按事件运行自动化检查。 |
| GitHub Actions: checkout | https://github.com/actions/checkout | 确认 `actions/checkout@v6` 当前 README 用法和权限建议。 |
| GitHub Actions: setup-node | https://github.com/actions/setup-node | 确认 `actions/setup-node@v6` 当前 README 用法、Node 24 与 npm cache 配置。 |
| GitHub Docs: Issues quickstart | https://docs.github.com/issues/tracking-your-work-with-issues/quickstart | 确认 GitHub Issues 可用 labels、milestones、assignees、projects 跟踪工作。 |
| Next.js Docs: generateMetadata | https://nextjs.org/docs/app/api-reference/functions/generate-metadata | 确认 Next.js App Router 可在 layout/page 中导出 metadata 或 generateMetadata。 |
| Next.js Docs: sitemap.xml | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap | 确认 `sitemap.ts` 可生成 sitemap.xml。 |
| Next.js Docs: robots.txt | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots | 确认 `robots.ts` 可生成 robots.txt 并声明 sitemap。 |

## AI Citation 与 Grounding 指标依据

| 来源 | URL | 本次用途 |
|---|---|---|
| Bing Webmaster Blog: Introducing AI Performance in Bing Webmaster Tools Public Preview | https://blogs.bing.com/webmaster/February-2026-284b440771373a5a245425a5d31a8ad6/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview | 确认 AI Performance 提供 AI citations、cited URLs、grounding query phrases 和趋势视图。 |
| Bing Search Blog: Elevating the Role of Grounding on the AI Web | https://blogs.bing.com/search/February-2026/Elevating-the-Role-of-Grounding-on-the-AI-Web | 确认 Bing 将 citation 和 grounding signals 作为 AI 生成体验中的可见性信号。 |
| Google Search Central: Top ways to ensure your content performs well in Google's AI experiences on Search | https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search | 确认 AI 搜索仍依赖独特、有价值、可抓取、可索引且体验良好的内容。 |
| OpenAI: Overview of OpenAI Crawlers | https://platform.openai.com/docs/bots | 确认 OAI-SearchBot、GPTBot、ChatGPT-User 的 crawler 用途与 robots.txt 管理边界。 |

## 信任页、隐私与披露依据

| 来源 | URL | 本次用途 |
|---|---|---|
| FTC: Disclosures 101 for Social Media Influencers | https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers | 确认 material connection 应让读者明显知道。 |
| FTC: Endorsement Guides FAQ | https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides | 确认意料之外且影响评价的连接应清楚、显著披露。 |

## 技术 SEO CI 依据与本地证据

| 来源 | URL / 文件 | 本次用途 |
|---|---|---|
| Next.js Docs: generateMetadata | https://nextjs.org/docs/app/api-reference/functions/generate-metadata | 确认页面 metadata、canonical、description 可由 App Router 页面或 layout 导出。 |
| Next.js Docs: sitemap.xml | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap | 确认 `app/sitemap.ts` 可生成 sitemap.xml，并作为 CI 路由来源。 |
| Next.js Docs: robots.txt | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots | 确认 `app/robots.ts` 可声明抓取规则和 sitemap。 |
| GitHub Docs: Workflow syntax for GitHub Actions | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 确认后续可把 `npm run seo:ci` 接入 pull request 和 main 分支门禁。 |
| GitHub Actions: checkout | https://github.com/actions/checkout | 确认 `actions/checkout@v6` 当前用法。 |
| GitHub Actions: setup-node | https://github.com/actions/setup-node | 确认 `actions/setup-node@v6` 当前用法。 |
| Local report: Technical SEO CI | reports/technical-seo-ci.md | 确认 13 条 sitemap 路由在本地通过 HTTP、metadata、canonical、JSON-LD、内链和移动端检查。 |

## 生产数据源接入依据

| 来源 | URL / 文件 | 本次用途 |
|---|---|---|
| Google Search Console Help: Verify your site ownership | https://support.google.com/webmasters/answer/9008080 | 确认 Search Console 需要站点所有权验证。 |
| Google Search Console Help: Sitemaps report | https://support.google.com/webmasters/answer/7451001 | 确认可在 Search Console 提交和管理 sitemap。 |
| Google Search Console Help: Page indexing report | https://support.google.com/webmasters/answer/7440203 | 确认可用 Page indexing report 查看已提交页面索引状态。 |
| Bing Webmaster Tools: Add and Verify site | https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b | 确认 Bing 可直接验证站点或从 GSC 导入已验证站点。 |
| Bing Webmaster Tools: Refreshed Webmaster Tools | https://www.bing.com/webmasters/help/refreshed-webmaster-tools-7c7d2533 | 确认 Bing Webmaster Tools 提供搜索表现和站点管理入口。 |
| Local contract: Analytics Endpoint | docs/analytics-endpoint-contract.md | 定义未来事件 endpoint 的 payload、拒绝规则、保留和上线门禁。 |

## 性能预算与快速验证依据

| 来源 | URL / 文件 | 本次用途 |
|---|---|---|
| Google Search Central: Core Web Vitals and Google Search results | https://developers.google.com/search/docs/appearance/core-web-vitals | 确认 Google Search 使用 LCP、INP、CLS 等 Core Web Vitals 信号。 |
| web.dev: Web Vitals | https://web.dev/articles/vitals | 确认 Core Web Vitals 推荐按至少 75% 页面访问达到阈值来衡量。 |
| web.dev: Defining Core Web Vitals thresholds | https://web.dev/articles/defining-core-web-vitals-thresholds | 确认 LCP、INP、CLS 阈值方法论。 |
| Lighthouse CI | https://github.com/GoogleChrome/lighthouse-ci | 确认 Lighthouse CI 可用于持续检查性能和质量。 |
| Local plan: Fast Validation Cycle | docs/fast-validation-cycle.md | 将 30/60/90 慢周期改成 3/7/14/30 快速验证。 |
| Local checklist: Launch Readiness | checklists/launch-readiness.md | 定义上线前阻断项和本地可通过项。 |
| Local budget: Performance Budget | docs/performance-budget.md | 定义上线前 Lighthouse/Core Web Vitals 目标。 |

## 使用限制

- 以上资料用于第一轮方向筛选，不等同于关键词搜索量验证。
- 搜索需求、关键词难度、SERP 机会目前属于推断，后续需要用 GSC、Bing Webmaster Tools、Google Trends、Ahrefs/Semrush 或人工 SERP 核查补证。
- 合规相关方向不得把本文件作为法律意见。
