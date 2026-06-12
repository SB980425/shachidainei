# Route Selection Decision Engine

This document defines the operating basis behind AgentSiteOps route recommendations. It is not a claim of market authority, customer volume, or guaranteed accuracy.

## Purpose

The route engine exists to prevent three failure modes:

1. Treating a 0-100 score as the final answer.
2. Forcing every project into a website, content cluster, or SaaS route.
3. Selling a polished roadmap when the honest answer is narrow, pivot, implementation, refund, or stop.

## Inputs

Every paid or sample route decision should inspect these inputs:

- Builder ability and proof asset.
- Buyer problem and reachable first segment.
- Delivery capacity and turnaround boundary.
- Data rights, source quality, and update model.
- Search evidence and AI visibility evidence.
- Payment path, price risk, and monetization fit.
- YMYL, privacy, account, platform, and processor risk.
- Whether generic AI can produce the same useful output without manual evidence review.

## Evidence Tiers

| Tier | Evidence type | Route confidence effect |
|---|---|---|
| 1 | Confirmed payment plus usable intake, qualified buyer replies, delivered artifact feedback, first-party GSC or Bing export, verified AI referral or citation | Can support continue, narrow, or price validation |
| 2 | Public demo, repo, portfolio, sample artifact, workflow screenshot, source-backed comparison, manually verifiable delivery ability | Can support a small launch route or pilot |
| 3 | Competitor pages, community questions, public market signals, third-party keyword estimates, AI visibility research | Useful context only; cannot prove demand alone |
| 4 | Founder assumptions, model-generated ideas, unsourced claims, guessed audience, guessed pricing | Must lower confidence; cannot justify scaling |

## Selection Rules

1. Score first, but treat the score as a gate, not the route.
2. Reject hard blockers before choosing a route.
3. Match the remaining project to a route archetype in `data/route-pattern-library.csv`.
4. Use `data/route-selection-source-map.csv` to decide which evidence raises confidence, which evidence lowers confidence, and which condition forces stop.
5. Use `data/route-confidence-rubric.csv` to assign high, medium, low, or reject confidence before naming the paid output.
6. Use `data/project-route-fit-matrix.csv` to map the project type to the strongest route, weak-route condition, first asset, and pre-payment evidence.
7. Select one first route only.
8. List rejected routes and the reason each was rejected.
9. Produce a page asset, outreach path, and evidence ledger that can be executed within 7 days.

## Confidence Rules

- Never raise route confidence from assumptions alone.
- Never raise route confidence from sitemap success, IndexNow success, crawler access, or GitHub traffic alone.
- Never treat PayPal clicks as revenue without confirmed payment plus usable intake.
- Never sell a subscription or dashboard path before manual delivery proves the buyer problem and fulfillment model.
- Never keep a route when the buyer needs implementation and the product only delivers advice.
- Never claim authority from this site's own score; AgentSiteOps is currently technically launchable and commercially unvalidated.
- Never sell high-confidence route selection when the rubric only supports medium, low, or reject confidence.
- Never choose the route that is easier to sell if the project-route fit matrix shows the buyer needs implementation, data rights work, a free diagnostic, or a stop decision first.

## Required Output

A useful route file must contain:

- One selected route.
- One first paid or free validation offer.
- Rejected routes with reasons.
- Required page structure.
- First channel or outreach path.
- Missing evidence ledger.
- Stop, narrow, rewrite, pivot, or continue rules.

If these fields cannot be completed from evidence, the correct output is not a confident roadmap. The correct output is narrow, refund, reject, or stop.

## Fit Matrix Use

The fit matrix keeps route selection practical:

- Service routes need a named manual workflow, reachable buyer, safe access boundary, and proof that the operator can deliver.
- Content routes need source-backed search intent, original tools or templates, and a maintainable update owner.
- Tool routes need repeated user action, manual proof, data rights, and support capacity.
- Template routes need domain constraints and examples that generic AI cannot reproduce from the same prompt.
- Directory and marketplace routes need defensible data, unique entity value, and manual seeding proof.
- Implementation routes should replace advice products when the buyer already knows the offer and needs setup work.

If a project lands in the wrong route, the route file must reject the sale or redirect the buyer before payment.
