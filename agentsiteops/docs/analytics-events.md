# Analytics Events

本文件登记站内事件层。当前实现是第一方轻量事件层：默认只写入浏览器内存和 `sessionStorage`，只有设置 `NEXT_PUBLIC_ANALYTICS_ENDPOINT` 时才会上报。

## 事件原则

- 不采集敏感个人数据。
- 不记录表单原文、邮箱、电话、账号、IP、cookie 或设备指纹。
- 事件 payload 只允许字符串、数字、布尔值和 null。
- 字符串会截断到 200 字符，key 会截断到 64 字符。
- 浏览器内最多保留最近 100 条事件。
- 事件用于 30/60/90 天复盘，不用于诱导点击。

## 当前事件

| Event | Trigger | Payload |
|---|---|---|
| `page_view` | 任意路由加载 | `path` |
| `update_log_view` | `/updates/` 加载 | `path` |
| `tool_page_view` | `/tools/website-opportunity-scorer/` 加载 | `path` |
| `tool_started` | 用户首次修改评分器输入、滑块或硬阻断 | `tool`, `trigger`, `score`, `decision` |
| `tool_completed` | 用户复制结果或下载 CSV | `tool`, `export_method`, `score`, `decision` |
| `tool_result_export` | 用户复制结果或下载 CSV | `tool`, `export_method`, `score`, `decision` |
| `template_copy_click` | 用户复制 Repo Skeleton 模板 | `label`, `length` |
| `checklist_copy_click` | 用户复制 AI 内容门禁或 pSEO 门禁 | `label`, `length` |
| `repo_skeleton_matrix_view` | `/templates/seo-repo-skeleton/` 加载 | `path` |
| `ci_gate_matrix_view` | `/templates/seo-repo-skeleton/` 加载 | `path` |
| `pseo_batch_audit_view` | `/checklists/programmatic-seo-gate/` 加载 | `path` |
| `pseo_index_map_view` | `/checklists/programmatic-seo-gate/` 加载 | `path` |
| `ai_metric_matrix_view` | `/guides/ai-citation-grounding-metrics/` 加载 | `path` |
| `review_window_view` | `/guides/ai-citation-grounding-metrics/` 加载 | `path` |
| `scoring_methodology_view` | `/methodology/website-opportunity-scoring/` 加载 | `path` |
| `scoring_model_limit_view` | `/methodology/website-opportunity-scoring/` 加载 | `path` |
| `trust_policy_view` | 作者、编辑政策、隐私或披露页加载 | `path` |
| `cta_click` | 带 `data-analytics-event` 的 CTA 被点击 | `label`, `target`, `type` |
| `source_link_click` | 用户点击外部来源链接 | `href`, `label` |

## 存储位置

| Location | Purpose |
|---|---|
| `window.__codexAnalyticsEvents` | 当前页面调试与浏览器验证 |
| `sessionStorage["codex-seo-events"]` | 当前会话最近 100 条事件 |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | 可选真实上报接口 |

## 后续接入条件

- 接入 GA4、Plausible、Umami、PostHog、BigQuery 或自建 endpoint 前，先更新隐私政策。
- 若使用 cookie、广告功能、跨站追踪或邮箱订阅，先执行 monetization/compliance gate。
- 若 endpoint 接收用户标识，必须重新定义 consent、保留周期和删除路径。
