# Monetization And Data Collection Compliance Gate

本文件约束广告、联盟、赞助、邮箱、表单、分析 endpoint、cookie、用户数据和 YMYL 内容上线前的判断。

## Current Decision

| Path | Decision | Reason |
|---|---|---|
| Local event buffer | `pass` | 只写入浏览器内存和 `sessionStorage`，不外发，不采集敏感个人数据 |
| External analytics endpoint | `block_until_review` | 需要真实 endpoint、保留周期、隐私说明、退出路径和安全策略 |
| Email signup | `block_until_review` | 需要说明用途、发送者、频率、退订路径和数据保留 |
| Ads | `block_until_review` | 需要确认内容质量、广告位置、隐私/cookie 和平台政策 |
| Affiliate links | `block_until_review` | 需要近场披露 material connection |
| Sponsorship / paid placement | `block_until_review` | 需要清楚披露商业关系和排序影响 |
| Lead form | `block_until_review` | 需要说明用途、共享、保留、后续联系和删除路径 |
| YMYL advice content | `block` | 当前无合格作者或审校人支持 |

## Required Checks

| Area | Required before publish |
|---|---|
| Privacy | 页面说明收集什么、为什么收集、如何使用、保留多久、是否共享、如何联系或退出 |
| Cookie / consent | 若使用 cookie、广告功能或跨站追踪，必须按目标地区设计 consent 和撤回路径 |
| Affiliate disclosure | 商业推荐附近必须清晰披露，不能只放在页脚或披露页 |
| Ads | 广告不能覆盖低价值、复制或薄内容，广告脚本必须写入隐私说明 |
| Email | signup 附近说明用途、频率、发送者和退订方式 |
| Lead forms | 表单附近说明用途、共享、保留和后续联系边界 |
| YMYL | 建议型内容必须有合格作者、审校人、地区边界和免责声明 |
| AI content | 不虚构体验、测试、作者资质或商业关系 |

## Hard Blockers

- 数据收集没有隐私说明。
- 邮箱捕获没有退订路径。
- 商业推荐没有近场披露。
- 用户数据与第三方共享但页面未说明。
- 广告或联盟链接放在低价值、复制或 AI 改写页上。
- YMYL 建议缺少合格作者或审校人。
- endpoint 接收原始表单内容、邮箱、电话、IP、账号、cookie 或设备指纹，但没有明确用途和合规处理。

## Release Checklist

| Item | Status |
|---|---|
| Current privacy page matches code | `pass` |
| Current disclosure page matches code | `pass` |
| No ads | `pass` |
| No affiliate links | `pass` |
| No email signup | `pass` |
| No lead form | `pass` |
| No payment or account system | `pass` |
| No external analytics script | `pass` |
| Optional endpoint disabled by default | `pass` |
| Production data collection reviewed | `pending` |

## Human Review Required

- Final target region and language.
- Real owner or organization identity.
- Domain and hosting provider.
- Analytics destination.
- Whether email, affiliate, ads, sponsorship, paid templates, forms, or accounts will be used.
- Legal review for jurisdiction-specific privacy, cookie, tax, professional advice, or advertising obligations.
