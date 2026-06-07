# Internal Linking Rules

## Goal

让 AI crawler、传统搜索引擎和真人用户都能理解页面层级、主题关系和下一步动作。

## Link Hierarchy

| Source Page | Must Link To | Reason |
|---|---|---|
| Home | Pillar, scorer, repo template, AI content gate, pSEO gate, AI metrics guide | 建立主入口与核心动作。 |
| Pillar | All first-cluster pages | 作为主题中心。 |
| Tool | Methodology, pillar, repo template, analytics plan later | 解释评分依据，并引导进入执行。 |
| Repo template | Pillar, technical SEO CI page later, pSEO gate, AI content gate | 把模板与发布门禁绑定。 |
| AI content gate | Content brief template, editorial policy, pillar | 强化审稿与信任。 |
| pSEO gate | Repo template, methodology, pillar | 把批量页面治理与技术执行绑定。 |
| AI metrics guide | 90-day validation, weekly review later, scorer | 把指标解释和行动连接。 |
| Methodology | Tool, pillar, evidence register | 解释评分模型来源。 |
| Trust pages | Editorial policy, author, privacy, disclosure | 建立责任链。 |

## Anchor Text Rules

Use descriptive anchors:

- Good: `网站机会评分器`
- Good: `Programmatic SEO 发布门禁`
- Good: `AI citation 与 grounding query 指标`
- Bad: `点击这里`
- Bad: `更多`

## First Cluster Required Links

Every first-cluster page must include:

1. Link back to `/ai-website-operating-system/`.
2. Link to one adjacent execution page.
3. Link to one trust or methodology page.
4. Link to one conversion action.

## Conversion Paths

| User State | Next Link |
|---|---|
| 不知道做什么网站 | `/tools/website-opportunity-scorer/` |
| 已有方向但不会建结构 | `/templates/seo-repo-skeleton/` |
| 担心 AI 内容低质 | `/checklists/ai-content-quality-gate/` |
| 想批量做页面 | `/checklists/programmatic-seo-gate/` |
| 想理解 AI 搜索指标 | `/guides/ai-citation-grounding-metrics/` |
| 想质疑评分模型 | `/methodology/website-opportunity-scoring/` |

## Noindex Link Policy

Future noindex pages may be linked for user value, but they must not be included in sitemap.

Examples:

- Tool result share pages: noindex by default until enough unique value exists.
- Filtered result pages: noindex unless explicitly approved by pSEO gate.
- Draft or experimental pages: noindex and excluded from sitemap.

