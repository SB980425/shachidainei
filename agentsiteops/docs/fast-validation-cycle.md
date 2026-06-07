# Fast Validation Cycle

用途：替代“等待 30/60/90 天再判断”的慢节奏。`30/60/90` 只保留为长期复盘框架；当前新站执行采用 `3/7/14/30`。

## Current Decision

| Cycle | Role | Decision |
|---|---|---|
| Day 1-3 | 本地与部署准备 | 修基础，不看增长 |
| Day 4-7 | 上线与抓取验证 | 看抓取、sitemap、robots、canonical、GSC/Bing 接入 |
| Day 8-14 | 早期索引与事件验证 | 看索引、impressions、工具完成、复制事件 |
| Day 15-30 | 第一轮页面动作 | 改标题、首屏、内链、模板、CTA；决定是否补第二小批页面 |
| Day 60 | 中期质量判断 | 只用于判断 query breadth、CTR、工具/复制动作是否稳定 |
| Day 90 | 战略取舍 | keep / rewrite / merge / noindex / delete / expand / stop |

## 3 / 7 / 14 / 30 Gate

| Time | Required evidence | Allowed action | Blocked action |
|---|---|---|---|
| Day 1-3 | `npm run seo:ci` pass, production build pass, launch checklist ready | 修技术、补文档、准备域名替换 | 新增泛内容、接广告、接联盟 |
| Day 4-7 | 真实域名、GSC/Bing 验证、sitemap 提交、production crawl pass | 修 deployment、canonical、robots、sitemap | 扩第二内容集群 |
| Day 8-14 | 至少确认索引状态、早期 impressions 或 crawler 日志；事件层能记录 | 改标题、description、首屏 answer、内链、复制块 | 根据小样本声称增长成功 |
| Day 15-30 | 页面动作表更新；核心页有搜索或事件信号，或明确无信号 | keep / rewrite / merge / noindex / delete；最多补一个小批次 | 大规模 pSEO 放量 |

## Early Stop Conditions

- 真实域名上线后，canonical、sitemap 或 robots 与生产域名冲突。
- GSC/Bing 无法验证所有权。
- sitemap 提交失败且无法定位原因。
- 技术 SEO CI 在生产或预览环境失败。
- 事件 endpoint 收集敏感数据或不能拒绝异常 payload。
- 核心页面 14 天后仍无抓取、无索引、无事件且技术问题无法修复。

## What Not To Wait For

- 不等 30 天才修 title、description、内链、首屏 answer。
- 不等 60 天才修工具完成路径。
- 不等 90 天才 noindex 明显低价值或错误页面。
- 不用短期排名波动判断站点方向成功。

## What Still Needs 60 / 90 Days

- 是否扩第二内容集群。
- 是否加入变现。
- 是否继续投入 pSEO。
- 是否把某类页面永久合并或删除。
- 是否把网站方向判定为 stop。
