# AgentSiteOps Post-Research Execution Plan

Updated: 2026-06-11

## Current Decision

Continue the project, but rebuild the product foundation.

The core product is no longer "AI Website Opportunity Audit" or a three-tier website scoring ladder. The first sellable product is:

**AgentSiteOps Launch Blueprint**

- Price: USD 99.
- Target user: English-market AI automation freelancer, technical solo founder, no-code builder, or small operator who can build but cannot package the first sellable offer.
- Promise: one clear offer, one target buyer, one landing page structure, one pricing angle, one first outreach path, and one 7-day validation sequence.
- Non-promise: no guaranteed traffic, ranking, revenue, customers, AI citation, payment approval, or platform account safety.

## Why The Plan Changed

The Deep Research report rejects the old core logic:

- A one-time scorer does not justify subscription.
- Generic website audits compete with mature free and paid SEO tools.
- AI visibility and SEO evidence are not the same as buyer demand.
- The first three days cannot rely on search traffic.
- Payment and delivery can be tested without login, database, or Stripe.
- The valuable first product is compressed execution judgment, not more information.

## Current Local State

Confirmed from the local repo:

- The homepage now presents the Launch Blueprint as the primary offer.
- The pricing page now shows one USD 99 offer instead of three tiers.
- `lib/payments.ts` now exports one primary Launch Blueprint product.
- `/website-opportunity-audit/` remains as a legacy compatibility route, but its visible copy now points to the Launch Blueprint.
- Launch-validation routes now exist: `/sample/`, `/buy/`, `/intake/`, `/thank-you/`, `/terms/`, `/refund-policy/`, `/disclaimer/`, `/contact/`.
- Outreach and objection files exist under `data/outreach-templates.json` and `data/objections.csv`.
- No Git remote is configured in this local checkout.

## Product Architecture

### Keep

- Brand: AgentSiteOps.
- Domain: `agentsiteops.com`.
- Static site approach.
- PayPal link first.
- Free scorer as a diagnostic and lead-in.
- Technical SEO, sitemap, robots, privacy, disclosure, and validation gates.

### Replace

- Replace `AI Website Opportunity Audit` with `AgentSiteOps Launch Blueprint`.
- Replace three-tier pricing with one primary USD 99 product.
- Replace "build websites that can be scored, cited, shipped, and reviewed" with "turn scattered AI capability into one sellable offer and first launch path."
- Replace 30-day search-first validation with 72-hour payment-first validation.

### Defer

- Login.
- Dashboard.
- Subscription.
- Database.
- Payment API and webhooks.
- Bulk SEO page expansion.
- Automated outreach or social automation.
- Complex tool-directory content.

## Three-Day Relaunch Plan

### Day 1: Rebuild The Offer And Payment Path

Target duration: 2-3 hours.

Required output:

- Rewrite homepage around the Launch Blueprint.
- Rewrite pricing into a single USD 99 offer.
- Replace the audit route or redirect it toward the Blueprint offer.
- Add `/sample/` with a realistic sample report outline.
- Add `/buy/` with PayPal payment link, delivery scope, refund boundary, and no-guarantee language.
- Add `/intake/` with copyable intake fields and an email handoff path.
- Add `/thank-you/` explaining delivery steps.
- Add `/terms/`, `/refund-policy/`, `/disclaimer/`, `/contact/`.
- Update `lib/payments.ts` to a single primary product.

Blocking standard:

- Do not start outreach until a buyer can understand the product, pay, and know what to send after payment.

### Day 2: Trust, Tracking, And Outreach Assets

Target duration: 2-3 hours.

Required output:

- Add sample report content.
- Add 5 English outreach messages and 5 Chinese warm outreach messages as local data.
- Add objection tracking file.
- Add CTA analytics labels for PayPal clicks, sample view, intake view, and contact clicks.
- Add smoke tests for homepage, buy page, sample page, legal pages, and PayPal link presence.
- Run build, typecheck, and SEO CI.

Blocking standard:

- If the page still reads like "another audit," rewrite copy before any deployment.

### Day 3: Production And Decision Gate

Target duration: 1.5-2.5 hours plus manual outreach time.

Required output:

- Build and deploy only after local checks pass.
- Verify production URLs and sitemap.
- Submit or refresh GSC/Bing only after production content is updated.
- Start manual outreach.
- Track three numbers only: payments, qualified replies, and repeated objections.

Decision rule after 72 hours:

- Continue if at least 1 payment occurs.
- Repackage if 0 payments but at least 5 qualified replies say the value is unclear.
- Test a lower founding price only if people want it but object to price.
- Pivot if 0 payments and fewer than 3 qualified replies.
- Do not treat UI quality, page count, impressions, or sitemap success as product validation.

## Expected Future Paths

### Path A: One Or More Payments In 72 Hours

Interpretation:

- The Launch Blueprint has initial demand.

Next actions:

- Fulfill manually.
- Turn the first delivery into an anonymized sample.
- Keep USD 99 until at least 3 paid deliveries.
- Add better intake and case-study pages.
- Do not build SaaS yet.

### Path B: No Payment, But Qualified Replies Exist

Interpretation:

- Demand may exist, but offer language, price, proof, or payment trust is weak.

Next actions:

- Rewrite landing page based on objections.
- Add stronger sample deliverable.
- Consider USD 79 founding price for 72 hours.
- Keep product direction for one more short cycle only.

### Path C: No Payment And Few Replies

Interpretation:

- Targeting or channel is wrong, or the product is still too abstract.

Next actions:

- Stop selling Launch Blueprint as the primary product.
- Pivot to `Done-for-you AI Offer Page + Intake Funnel Setup`.
- Sell a more direct outcome: landing page copy, intake structure, PayPal path, and trust pages.

### Path D: People Ask For Implementation Instead Of Advice

Interpretation:

- The market wants execution, not judgment.

Next actions:

- Convert the offer to a productized implementation service.
- Keep Blueprint as a pre-work asset, not the product.
- Raise price only after the exact scope is stable.

### Path E: People Ask For Tool Stack Or Deployment Help

Interpretation:

- A content/tool library may be useful, but not first.

Next actions:

- Create comparison pages for Dify, n8n, Flowise, and related tools.
- Keep tool content as SEO and trust support.
- Do not make open-source tools the core promise unless licenses and maintenance are verified.

## User Input Needed Later

Only after local implementation is ready:

- Confirm whether the PayPal.me `agentsiteops` link is still active and owned by the correct account.
- If a real form provider is preferred, provide or approve Tally, Google Forms, Formspree, or another endpoint.
- Approve production deployment if the current checkout still has no Git remote or Cloudflare deployment command available.
- Provide actual customer support email if `sun19980425s@gmail.com` should not be public.
