# Monetization And Data Collection Compliance Gate

Status: active gate.

## Current Decision

| Path | Decision | Reason |
|---|---|---|
| Local event buffer | `pass` | Events stay in browser memory and `sessionStorage`; no external collection is enabled by default. |
| Analytics endpoint validator | `pass` | `npm run analytics:gate` rejects unknown events, sensitive payloads, stale timestamps, future timestamps, external URLs, and oversized bodies. |
| External analytics endpoint | `block_until_review` | Requires selected endpoint, retention period, privacy notice, deletion path, security review, and production activation decision. |
| Cloudflare managed analytics or edge logs | `disclose_and_review` | Production hosting may include Cloudflare scripts, web analytics, or edge logs that are separate from the first-party event endpoint. |
| Launch Blueprint payment path | `pass_with_boundary` | PayPal.me handles payment externally; the site shows price, scope, delivery timing, refund policy, limits, contact route, and manual intake before delivery. |
| Audit intent page | `legacy_pass_with_boundary` | The older audit page remains public context, but qualified commercial intent should route to the Launch Blueprint pricing, sample, buy, and intake path. |
| Email signup | `block_until_review` | Requires purpose, sender, frequency, unsubscribe path, and retention notice. |
| Ads | `block_until_review` | Requires content quality review, ad placement review, privacy/cookie disclosure, and platform policy review. |
| Affiliate links | `block_until_review` | Requires near-page material-connection disclosure. |
| Sponsorship or paid placement | `block_until_review` | Requires clear disclosure of commercial relationship and ranking influence. |
| Lead form | `block_until_review` | Requires usage, sharing, retention, follow-up boundary, and deletion path. |
| YMYL advice content | `block` | Current site lacks qualified author or reviewer support for regulated advice. |

## Required Checks

| Area | Required before publish |
|---|---|
| Privacy | Explain what is collected, why it is collected, how it is used, retention, sharing, contact path, and deletion path. |
| Cookie / consent | If cookies, advertising features, or cross-site tracking are used, consent and withdrawal must match the target geography. |
| Affiliate disclosure | Commercial recommendations need visible near-page disclosure, not only a footer disclosure page. |
| Ads | Ads must not overwhelm thin, copied, or low-value pages; ad scripts must be covered by privacy and consent notes. |
| Email | Signup area must explain purpose, frequency if relevant, sender, retention, and unsubscribe path. |
| Lead forms | Forms must explain purpose, sharing, retention, follow-up boundary, and deletion path. |
| Analytics | Endpoint must reject sensitive payloads and avoid IP, user agent, cookie, device fingerprint, raw form text, email, phone, account ID, and payment data in the event table. |
| YMYL | Advice-like pages require qualified author or reviewer support, scope boundaries, and disclaimers. |
| AI content | Do not invent experience, testing, credentials, rankings, sponsorships, or commercial relationships. |

## Hard Blockers

- Data collection without a matching privacy notice.
- Email capture without unsubscribe path.
- Commercial recommendation without near-page disclosure.
- User data shared with third parties without clear disclosure.
- Ads or affiliate links placed on low-value, copied, or thin AI-written pages.
- YMYL advice without qualified author or reviewer support.
- Analytics endpoint accepts raw form content, email, phone, account ID, IP address, cookie ID, payment data, device fingerprint, or nested payload objects.

## Release Checklist

| Item | Status |
|---|---|
| Current privacy page matches code | `pass` |
| Current disclosure page matches code | `pass` |
| No ads | `pass` |
| No affiliate links | `pass` |
| No email signup | `pass` |
| No lead form | `pass` |
| Manual PayPal payment path disclosed | `pass` |
| No card data collected by site | `pass` |
| No user account system | `pass` |
| Audit intent page routes commercial intent to current Launch Blueprint path | `pass` |
| No external analytics endpoint enabled | `pass` |
| Cloudflare managed analytics disclosed | `pass` |
| Local event buffer disclosed | `pass` |
| Analytics endpoint validation script | `pass` |
| Production analytics collection reviewed | `pending` |

## Human Review Required

- Final target region and language.
- Real owner or organization identity.
- Analytics destination or first-party proxy.
- Retention period and deletion path.
- Whether email, affiliate, ads, sponsorship, paid templates, forms, or accounts will be used.
- Whether the USD 1 payment test should remain public after PayPal path verification.
- Legal review for jurisdiction-specific privacy, cookie, tax, professional advice, or advertising obligations.
