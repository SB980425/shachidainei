# Weekly Growth Review Template

用途：每周把搜索、AI 引用、站内事件、技术 SEO 和内容质量转成页面动作，而不是只看流量报表。

## 固定输入

| 输入 | 文件或来源 | 当前状态 |
|---|---|---|
| 页面注册表 | `docs/page-registry.csv` | 已有 |
| 事件登记 | `docs/analytics-events.md` | 已有本地事件层 |
| 技术 SEO 报告 | `reports/technical-seo-ci.md` | 已有本地 CI |
| 快速验证周期 | `docs/fast-validation-cycle.md` | 已有 |
| GSC 数据 | Google Search Console | 未接入 |
| Bing AI Performance | Bing Webmaster Tools | 未接入 |
| 真实用户事件 | 自建 endpoint / GA4 / Plausible / Umami | 未接入 |
| 服务器日志 | 托管平台日志 | 未接入 |
| 收入或线索 | 订阅、咨询、模板下载、GitHub | 未接入 |

## 每周问题

1. 哪些页面获得了 impressions、clicks、AI citations 或 direct/referral 访问？
2. 哪些页面未索引、错误索引、canonical 冲突或从 sitemap 中丢失？
3. 哪些页面有曝光但 CTR 低，需要改 title、description、首屏 answer 或内链？
4. 哪些页面有访问但没有 `tool_completed`、`tool_result_export`、`source_link_click` 或下一步动作？
5. 哪些页面应该 keep、rewrite、merge、noindex 或 delete？
6. 哪些页面值得打开下周 issue？
7. 是否可以新增第二内容集群，还是必须先修当前集群？

## 页面动作规则

| 动作 | 使用条件 | 下一步 |
|---|---|---|
| `keep` | 可抓取、可索引、有明确用途，且指标或战略位置仍成立 | 维持，按周期复查 |
| `rewrite` | 有曝光或重要战略位置，但 CTR、继续动作或内容完整度弱 | 改标题、首屏 answer、结构、来源、CTA |
| `merge` | 与其他页面意图重叠，独立价值不足 | 合并到更强页面，更新 canonical 和内链 |
| `noindex` | 页面暂时有用但不适合索引，如低价值参数页、空结果页、内部状态页 | 移出 sitemap，设置 noindex |
| `delete` | 无战略价值、无数据、无使用、无来源或长期低质 | 删除或 410，更新内链 |
| `block` | 合规、来源、隐私、披露或技术门禁失败 | 不发布，不扩量 |

## 3 / 7 / 14 / 30 快速验证

| 时间 | 判断重点 | 可执行动作 |
|---|---|---|
| Day 1-3 | 本地验证、部署准备、域名替换、CI 通过 | 修技术，不新增泛内容 |
| Day 4-7 | 真实域名抓取、sitemap、robots、GSC/Bing 验证 | 修 canonical、robots、sitemap、部署问题 |
| Day 8-14 | 早期索引、impressions、crawler 日志、站内事件 | 改标题、description、首屏 answer、内链、复制动作 |
| Day 15-30 | 第一轮页面动作表 | keep / rewrite / merge / noindex / delete；最多补一个小批次 |

## 60 / 90 天长期决策

| 时间 | 主要判断 | 不应过度解读 | 可执行动作 |
|---|---|---|---|
| Day 60 | query breadth、CTR、工具完成、导出、来源点击、直接访问 | 单日波动、少量 bot 流量 | 改标题摘要、强化工具/模板、补来源和对比 |
| Day 90 | keep/rewrite/merge/noindex/delete，是否扩第二集群 | 只看总访问，不看页面动作 | 保留强页、合并弱页、停止无信号方向 |

## 周报模板

```md
# Weekly Growth Review

## 结论

- 继续 / 暂停扩张 / 重写核心页 / 合并弱页 / 等待数据。

## 已确认

- 技术 SEO CI：
- 事件层：
- GSC：
- Bing AI Performance：
- 真实事件：

## 未验证

- <缺少的数据源或样本限制>

## 页面动作表

| URL | Page type | Evidence | Recommended action | Next issue |
|---|---|---|---|---|
|  |  |  |  |  |

## 下周 backlog

1. <最重要的一项>
2. <第二项>
3. <第三项>
```

## 执行边界

- 没有外部数据时，只能做 readiness review，不能声称增长有效。
- 技术 SEO 通过不等于内容有效。
- 站内事件出现不等于商业价值成立，需要继续看回访、订阅、下载、GitHub 或收入。
- 任何变现、邮箱、广告、联盟或跨站追踪上线前，先执行合规门禁。
