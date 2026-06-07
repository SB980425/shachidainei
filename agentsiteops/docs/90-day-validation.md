# 90 天验证标准

## 目标方向

主方向：Codex 建站 SEO 自动化模板站。

第一集群：AI 搜索 / GEO 可引用内容方法库与检查器。

## 90 天内验证的不是收入最大化

第一阶段验证的是：

- AI 和传统搜索是否能发现页面。
- 页面是否能被引用、收藏、下载或复制。
- 真人是否愿意继续使用模板、评分器、checklist。
- 站点是否具备可持续更新和扩展能力。

## Day 0-7

交付物：

- `docs/site-brief.md`
- `docs/taxonomy.yaml`
- `docs/routes.json`
- `docs/page-registry.csv`
- `docs/page-templates.md`
- `docs/analytics-plan.md`
- 第一版网站机会评分器规格。

验收：

- 第一批 5-8 个 URL 已确定。
- 每个 URL 有页面类型、搜索意图、AI 引用目标、真人转化出口。
- 不进入大规模内容生产。

## Day 8-30

交付物：

- 首页。
- Pillar：AI 建站操作系统。
- Tool：网站机会评分器 MVP。
- Checklist：AI 内容质量门禁。
- Checklist：Programmatic SEO 发布门禁。
- Guide：AI citation / grounding / Search Console / Bing Webmaster 指标解释。
- Author、Methodology、Editorial Policy、Privacy、Affiliate/Disclosure。

领先指标：

- 核心页面可被抓取和索引。
- Bing Webmaster / GSC 可接入。
- 工具完成事件 `tool_completed` 可记录。
- 邮件订阅或模板下载入口可记录。

停止/转向：

- 工具无法形成明确输入输出，改为可下载评分表。
- 页面只能写成泛泛 SEO 文章，停止扩展，回到方法论和模板资产。

## Day 31-60

动作：

- 根据 query / grounding query / impressions 调整页面标题、结构、表格和 answer block。
- 增加 repo skeleton、CI checklist、GitHub issue 模板。
- 增加 5-10 个可复制模板页。

领先指标：

- 页面 query breadth 增长。
- 工具完成、模板复制、下载、订阅中至少一个出现信号。
- 非 Google 入口开始出现：直接访问、收藏、社群分享、邮件。

转向条件：

- 有曝光无点击：重写标题、开头 answer block、结构化摘要。
- 有点击无继续动作：强化工具、模板、下载和下一步流程。
- 无曝光无索引：先处理技术 SEO 和内链，不扩内容。

## Day 61-90

动作：

- 决定保留、重写、合并、noindex 或删除页面。
- 判断是否开启第二个集群：AI 视频提示词与镜头运动资料库。
- 判断是否产品化网站机会评分器或 SEO CI 检查器。

继续条件：

- 核心模板页面稳定索引。
- 至少一个转化事件成立：工具完成、模板下载、邮件订阅、咨询、GitHub star/fork。
- 至少一个页面类型证明有效：tool、checklist、guide、template。

停止条件：

- 90 天内无索引、无使用、无订阅、无引用、无直接访问增长。
- 内容只能依赖重复改写。
- 用户继续动作无法设计。

## 第一批事件命名

| 事件 | 含义 |
|---|---|
| `tool_completed` | 用户完成机会评分器 |
| `template_copy_click` | 用户复制模板 |
| `template_download_click` | 用户下载模板 |
| `email_signup_submit` | 邮件订阅 |
| `github_repo_click` | 点击 GitHub repo |
| `checklist_expand` | 展开 checklist |
| `internal_search_used` | 使用站内搜索 |

