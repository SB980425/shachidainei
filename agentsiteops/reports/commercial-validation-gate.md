# Commercial Validation Gate

- Generated: 2026-06-12T05:02:09.996Z
- Status: pass
- Checks: 304
- Blockers: 0

## Summary

| Scope | Status | Detail |
|---|---|---|
| routes | pass | /tools/ai-crawler-readiness/ registered in docs/routes.json |
| app | pass | /tools/ai-crawler-readiness/ has app page |
| routes | pass | /examples/agentsiteops-self-audit/ registered in docs/routes.json |
| app | pass | /examples/agentsiteops-self-audit/ has app page |
| routes | pass | /examples/fit-review-sample/ registered in docs/routes.json |
| app | pass | /examples/fit-review-sample/ has app page |
| routes | pass | /services/ai-website-opportunity-audit/ registered in docs/routes.json |
| app | pass | /services/ai-website-opportunity-audit/ has app page |
| routes | pass | /tools/audit-scope-builder/ registered in docs/routes.json |
| app | pass | /tools/audit-scope-builder/ has app page |
| routes | pass | /tools/launch-blueprint-fit-checker/ registered in docs/routes.json |
| app | pass | /tools/launch-blueprint-fit-checker/ has app page |
| routes | pass | /checklists/launch-validation-decision-gate/ registered in docs/routes.json |
| app | pass | /checklists/launch-validation-decision-gate/ has app page |
| routes | pass | /methodology/route-selection/ registered in docs/routes.json |
| app | pass | /methodology/route-selection/ has app page |
| routes | pass | /reports/route-basis/ registered in docs/routes.json |
| app | pass | /reports/route-basis/ has app page |
| routes | pass | /guides/first-traffic-system/ registered in docs/routes.json |
| app | pass | /guides/first-traffic-system/ has app page |
| routes | pass | /guides/48-hour-exposure-sprint/ registered in docs/routes.json |
| app | pass | /guides/48-hour-exposure-sprint/ has app page |
| routes | pass | /launch-kit/ registered in docs/routes.json |
| app | pass | /launch-kit/ has app page |
| routes | pass | /pricing/ registered in docs/routes.json |
| app | pass | /pricing/ has app page |
| routes | pass | /compare/ registered in docs/routes.json |
| app | pass | /compare/ has app page |
| routes | pass | /starter-review/ registered in docs/routes.json |
| app | pass | /starter-review/ has app page |
| routes | pass | /buy/ registered in docs/routes.json |
| app | pass | /buy/ has app page |
| routes | pass | /intake/ registered in docs/routes.json |
| app | pass | /intake/ has app page |
| routes | pass | /terms/ registered in docs/routes.json |
| app | pass | /terms/ has app page |
| routes | pass | /refund-policy/ registered in docs/routes.json |
| app | pass | /refund-policy/ has app page |
| routes | pass | /disclaimer/ registered in docs/routes.json |
| app | pass | /disclaimer/ has app page |
| routes | pass | /contact/ registered in docs/routes.json |
| app | pass | /contact/ has app page |
| payment_path | pass | live USD 99 PayPal link is configured |
| payment_path | pass | live USD 29 PayPal link is configured |
| payment_path | pass | payment config contains only current paid offer paths |
| payment_path | pass | pricing page contains only current paid offer CTA |
| payment_path | pass | starter review page contains only current paid offer CTA |
| payment_path | pass | buy page contains only current paid offer CTA |
| payment_path | pass | starter review page has paid CTA |
| service_boundary | pass | starter review can reject the full blueprint sale |
| service_boundary | pass | fit review sample can recommend not buying the full blueprint |
| service_boundary | pass | fit review sample states proof boundary |
| service_boundary | pass | launch product blocks guarantee claims |
| service_boundary | pass | launch objections include generic AI alternative |
| service_boundary | pass | launch objections include implementation-demand mismatch |
| service_boundary | pass | pricing page shows objection-based payment redirects |
| service_boundary | pass | pricing page can tell unclear buyers not to pay |
| service_boundary | pass | pricing page addresses new-site PayPal trust objection |
| service_boundary | pass | homepage shows evidence-before-roadmap proof layer |
| service_boundary | pass | homepage shows paid artifact boundary |
| service_boundary | pass | homepage separates market research from validation proof |
| service_boundary | pass | pricing page explains paid route-selection value |
| service_boundary | pass | pricing page shows delivery standard for USD 99 offer |
| service_boundary | pass | buy page blocks software expectation |
| service_boundary | pass | disclaimer blocks guarantee claims |
| trust_pages | pass | terms page covers PayPal payment path |
| trust_pages | pass | refund page exists and states refund boundary |
| revenue_experiments | pass | Launch Blueprint is recorded as live validation |
| revenue_experiments | pass | Fit Review is recorded as live validation |
| revenue_experiments | pass | revenue experiment table contains only active or planned commercial hypotheses |
| revenue_experiments | pass | subscription remains blocked |
| compliance | pass | current payment path has compliance boundary |
| compliance | pass | manual PayPal path is disclosed |
| compliance | pass | site does not collect card data |
| manual_fulfillment | pass | intake page requests payment confirmation |
| manual_fulfillment | pass | intake page explains manual delivery process |
| manual_fulfillment | pass | manual fulfillment template records payment reference |
| manual_fulfillment | pass | manual fulfillment template records purchased product |
| manual_fulfillment | pass | manual fulfillment template blocks sensitive payment data storage |
| manual_fulfillment | pass | manual fulfillment runbook states data boundary |
| manual_fulfillment | pass | manual fulfillment runbook links Fit Review delivery template |
| manual_fulfillment | pass | manual fulfillment runbook links Launch Blueprint delivery template |
| manual_fulfillment | pass | Fit Review delivery template has verdict boundary |
| manual_fulfillment | pass | Fit Review delivery template blocks guarantee claims |
| manual_fulfillment | pass | Launch Blueprint delivery template selects one offer |
| manual_fulfillment | pass | Launch Blueprint delivery template includes evidence ledger |
| manual_fulfillment | pass | delivery checklist blocks sensitive data storage |
| manual_fulfillment | pass | delivery checklist blocks guarantee claims |
| manual_outreach | pass | outreach templates block inflated claims |
| manual_outreach | pass | outreach templates keep private replies out of the repo |
| manual_outreach | pass | outreach runbook blocks automated direct messages |
| manual_outreach | pass | outreach runbook blocks guarantee claims |
| manual_outreach | pass | outreach runbook blocks public storage of private lead data |
| manual_outreach | pass | outreach runbook sets a small-batch validation limit |
| manual_outreach | pass | outreach tracker separates confirmed payments |
| manual_outreach | pass | outreach tracker separates usable intake |
| manual_outreach | pass | outreach tracker stores only aggregate records |
| validation_decision_gate | pass | validation gate states anti-scaling decision boundary |
| validation_decision_gate | pass | validation gate names the strongest early proof |
| validation_decision_gate | pass | validation gate blocks payment-click-as-revenue logic |
| validation_decision_gate | pass | validation gate blocks technical success as demand proof |
| validation_decision_gate | pass | validation gate includes implementation-demand pivot path |
| validation_decision_gate | pass | validation CSV records confirmed payment plus usable intake threshold |
| validation_decision_gate | pass | validation CSV records implementation pivot |
| validation_decision_gate | pass | validation CSV blocks payment clicks without confirmation |
| self_score | pass | self-audit states objective current score and verdict |
| self_score | pass | self-audit blocks premature scaling |
| self_score | pass | self-score CSV records overall 52 score |
| self_score | pass | self-score CSV records missing commercial proof |
| self_score | pass | self-score CSV records commercial verdict |
| self_score | pass | evidence page shows score update rules |
| self_score | pass | evidence page blocks weak self-score increases |
| self_score | pass | self-score protocol records current score |
| self_score | pass | self-score protocol blocks technical-only score increases |
| self_score | pass | self-score protocol allows immediate score decreases |
| self_score | pass | self-score change log template records commercial threshold |
| self_score | pass | self-score change log template blocks private data storage |
| route_selection | pass | route methodology states score is not the route itself |
| route_selection | pass | route methodology names the route-pattern library |
| route_selection | pass | route methodology exposes confidence bands |
| route_selection | pass | route methodology exposes project-to-route fit |
| route_selection | pass | route methodology includes stop conditions |
| route_selection | pass | route basis report is visible in site data |
| route_selection | pass | route basis report exposes rejection logic |
| route_selection | pass | AI context links the route basis report |
| route_selection | pass | route-pattern library includes AI workflow setup service |
| route_selection | pass | route-pattern library includes marketplace or matching route |
| route_selection | pass | route-pattern library includes data route |
| route_selection | pass | route-pattern library records stop rules |
| route_selection | pass | route source map includes generic AI substitute risk |
| route_selection | pass | route source map ties monetization fit to confirmed payment and usable intake |
| route_selection | pass | route source map blocks search scaling without first-party data |
| route_selection | pass | confidence rubric requires payment plus usable intake for high confidence |
| route_selection | pass | confidence rubric can reject assumption-led routes |
| route_selection | pass | project fit matrix includes content or SEO site route |
| route_selection | pass | project fit matrix includes implementation route |
| route_selection | pass | route confidence report preserves no-demand boundary |
| route_selection | pass | route decision engine blocks assumption-only confidence |
| route_selection | pass | route decision engine blocks unsupported high-confidence selling |
| route_selection | pass | route decision engine explains fit matrix use |
| route_selection | pass | route decision engine blocks advice-only mismatch |
| route_selection | pass | route decision engine requires one selected route |
| first_traffic | pass | first traffic guide states multi-channel exposure |
| first_traffic | pass | first traffic guide includes 48-hour loop |
| first_traffic | pass | first traffic channel plan includes manual outreach |
| first_traffic | pass | first traffic channel plan includes launch listing channel |
| first_traffic | pass | first traffic channel plan records stop rules |
| exposure_sprint | pass | 48-hour sprint page states exposure validation boundary |
| exposure_sprint | pass | 48-hour sprint page names decision outcomes |
| exposure_sprint | pass | 48-hour sprint table includes first execution window |
| exposure_sprint | pass | 48-hour sprint table tracks confirmed payment separately |
| exposure_sprint | pass | exposure targets include Product Hunt prep |
| exposure_sprint | pass | exposure targets include Show HN prep |
| exposure_sprint | pass | exposure targets block automated direct messages |
| exposure_sprint | pass | exposure evidence template separates confirmed payments |
| exposure_sprint | pass | exposure evidence template separates usable intake |
| exposure_sprint | pass | exposure evidence template separates qualified replies |
| exposure_sprint | pass | exposure evidence template separates sample views |
| exposure_sprint | pass | exposure evidence template separates objections |
| exposure_sprint | pass | 48-hour status requires sealing if metrics are absent |
| exposure_sprint | pass | 48-hour status records the decision report path |
| exposure_sprint | pass | 48-hour thresholds include the deadline seal rule |
| exposure_sprint | pass | 48-hour thresholds prioritize confirmed payment plus usable intake |
| exposure_sprint | pass | 48-hour decision script can require sealing |
| exposure_sprint | pass | 48-hour decision script supports deterministic deadline tests |
| exposure_sprint | pass | 48-hour decision script fails CI when sealing is required |
| exposure_sprint | pass | exposure copy pack blocks inflated claims |
| exposure_sprint | pass | exposure copy pack tests implementation-pivot risk |
| exposure_sprint | pass | exposure action ledger records GitHub metadata update |
| exposure_sprint | pass | exposure action ledger records GitHub prerelease creation |
| exposure_sprint | pass | exposure action ledger records GitHub feedback issue creation |
| exposure_sprint | pass | exposure action ledger records GitHub traffic snapshot import |
| exposure_sprint | pass | exposure action ledger records public feedback checkpoint comment |
| exposure_sprint | pass | exposure action ledger records GitHub feedback snapshot import |
| exposure_sprint | pass | exposure action ledger records external search discoverability snapshot |
| exposure_sprint | pass | exposure action ledger records Launch Kit visibility reinforcement |
| exposure_sprint | pass | exposure action ledger records Launch Kit external search recheck |
| exposure_sprint | pass | exposure action ledger records hourly execution cadence update |
| exposure_sprint | pass | exposure action ledger records social preview asset addition |
| exposure_sprint | pass | exposure action ledger records GitHub release refresh |
| exposure_sprint | pass | exposure action ledger marks GitHub traffic as aggregate evidence |
| exposure_sprint | pass | exposure action ledger separates public actions from threshold evidence |
| exposure_sprint | pass | exposure action ledger blocks public-action-as-demand logic |
| exposure_sprint | pass | exposure action ledger blocks issue-creation-as-reply logic |
| exposure_sprint | pass | exposure action ledger blocks maintainer-comment-as-reply logic |
| exposure_sprint | pass | exposure action ledger records aggregate-only feedback snapshot |
| exposure_sprint | pass | exposure action ledger blocks search-result-as-demand logic |
| exposure_sprint | pass | exposure action ledger blocks internal-link-as-demand logic |
| exposure_sprint | pass | exposure action ledger blocks adjacent-search-results-as-launch-kit-proof logic |
| exposure_sprint | pass | exposure action ledger blocks cadence-as-demand logic |
| exposure_sprint | pass | exposure action ledger blocks social-preview-as-demand logic |
| social_preview | pass | Open Graph preview image exists |
| social_preview | pass | Twitter preview image exists |
| social_preview | pass | Open Graph metadata points to preview image |
| social_preview | pass | Twitter card uses large image format |
| social_preview | pass | Twitter metadata points to preview image |
| social_preview | pass | social preview asset CSV records OG image URL |
| social_preview | pass | social preview report preserves no-demand boundary |
| github_traffic | pass | GitHub traffic script imports aggregate repo views |
| github_traffic | pass | GitHub traffic script imports aggregate repo clones |
| github_traffic | pass | GitHub traffic script imports aggregate referrers |
| github_traffic | pass | GitHub traffic script imports aggregate paths |
| github_traffic | pass | GitHub traffic snapshot preserves no-threshold boundary |
| github_traffic | pass | GitHub traffic report preserves threshold boundary |
| github_feedback | pass | GitHub feedback script imports public issue comments |
| github_feedback | pass | GitHub feedback script avoids storing usernames |
| github_feedback | pass | GitHub feedback script avoids storing comment bodies |
| github_feedback | pass | GitHub feedback script tracks structured feedback label |
| github_feedback | pass | GitHub feedback snapshot does not auto-count qualified replies |
| github_feedback | pass | GitHub feedback snapshot records structured feedback issue associations |
| github_feedback | pass | GitHub feedback report preserves manual qualification boundary |
| github_feedback | pass | GitHub feedback report links structured issue template |
| github_feedback_label | pass | GitHub label script uses credential store without writing tokens |
| github_feedback_label | pass | GitHub feedback label snapshot records label |
| github_feedback_label | pass | GitHub feedback label report blocks label-as-demand logic |
| github_feedback_template | pass | GitHub issue template blocks sensitive public data |
| github_feedback_template | pass | GitHub issue template captures implementation-pivot signal |
| github_feedback_template | pass | GitHub issue template captures proof and objection signals |
| github_feedback_template | pass | GitHub issue template config disables blank public issues |
| github_feedback_thread | pass | GitHub feedback thread script preserves maintainer boundary |
| github_feedback_thread | pass | GitHub feedback thread CSV records refresh action |
| github_feedback_thread | pass | GitHub feedback thread report blocks maintainer-edit-as-demand logic |
| github_feedback_thread | pass | public GitHub feedback thread report preserves threshold boundary |
| github_feedback_thread | pass | exposure action ledger records GitHub feedback thread refresh |
| github_release_refresh | pass | GitHub release refresh script avoids making the prerelease latest |
| github_release_refresh | pass | GitHub release refresh links route basis report |
| github_release_refresh | pass | GitHub release refresh snapshot records release URL |
| github_release_refresh | pass | GitHub release refresh report blocks release-as-demand logic |
| github_release_refresh | pass | public GitHub release refresh report includes route basis link |
| github_release_refresh | pass | public GitHub release refresh report preserves threshold boundary |
| github_discovery_surface | pass | GitHub discovery surface script manages topics |
| github_discovery_surface | pass | GitHub discovery surface CSV records refresh action |
| github_discovery_surface | pass | GitHub discovery surface report blocks metadata-as-demand logic |
| github_discovery_surface | pass | public GitHub discovery surface report preserves threshold boundary |
| github_discovery_surface | pass | exposure action ledger records GitHub discovery surface refresh |
| external_search_discoverability | pass | external search discoverability snapshot includes the home page |
| external_search_discoverability | pass | external search discoverability snapshot includes evidence dashboard |
| external_search_discoverability | pass | external search discoverability snapshot carries threshold boundary column |
| external_search_discoverability | pass | external search discoverability report blocks search-result-as-GSC logic |
| external_search_discoverability | pass | external search discoverability report records missing launch kit visibility |
| launch_kit_visibility | pass | Launch Kit visibility snapshot records global footer link |
| launch_kit_visibility | pass | Launch Kit visibility snapshot records self-audit related link |
| launch_kit_visibility | pass | Launch Kit visibility snapshot records evidence dashboard related link |
| launch_kit_visibility | pass | Launch Kit visibility report blocks internal-link-as-demand logic |
| launch_kit_visibility | pass | global footer links to Launch Kit |
| launch_kit_visibility | pass | homepage links to Launch Kit |
| launch_kit_visibility | pass | route related links include Launch Kit |
| launch_kit_external_search | pass | Launch Kit external search recheck records direct confirmation field |
| launch_kit_external_search | pass | Launch Kit external search recheck records home page fallback result |
| launch_kit_external_search | pass | Launch Kit external search recheck preserves missing visibility finding |
| launch_kit_external_search | pass | Launch Kit external search recheck blocks internal-link-as-search-proof logic |
| exposure_cadence | pass | exposure automation cadence is hourly |
| exposure_cadence | pass | exposure automation cadence records one-hour execution block purpose |
| exposure_cadence | pass | exposure automation cadence report blocks cadence-as-demand logic |
| launch_kit | pass | launch kit page is wired to static route data |
| launch_kit | pass | launch kit route data exists |
| launch_kit | pass | launch kit states current validation status |
| launch_kit | pass | launch kit exposes seal rule |
| launch_kit | pass | launch kit blocks bad-fit purchase intent |
| launch_kit | pass | llms.txt points AI readers to launch kit |
| launch_kit | pass | llms.txt carries no-guarantee boundary |
| launch_kit | pass | llms.txt carries seal decision rule |
| launch_kit | pass | llms-full.txt explains evidence hierarchy |
| launch_kit | pass | llms-full.txt explains 48-hour rule |
| service_boundary | pass | launch copy avoids guarantee claims |
| readiness_tool | pass | readiness tool has 13 weighted checks; found 13 |
| readiness_tool | pass | readiness tool weights total 100 |
| readiness_tool | pass | tool states evidence boundary |
| audit_scope_builder | pass | scope builder states local-only boundary |
| audit_scope_builder | pass | scope builder blocks request-submission claim |
| audit_scope_builder | pass | scope page states no payment or account step |
| audit_scope_builder | pass | scope builder has no network submit or payment integration |
| launch_fit_checker | pass | fit checker can block bad-fit buyers |
| launch_fit_checker | pass | fit checker blocks guarantee expectations |
| launch_fit_checker | pass | fit checker page states local-only boundary |
| launch_fit_checker | pass | fit checker has no network submit or third-party payment integration |
| mojibake | pass | components/CopyAction.tsx has no visible mojibake marker |
| mojibake | pass | components/AICrawlerReadinessTool.tsx has no visible mojibake marker |
| mojibake | pass | components/AuditScopeBuilder.tsx has no visible mojibake marker |
| mojibake | pass | data/outreach-templates.json has no visible mojibake marker |
| mojibake | pass | data/launch-validation-decision-gate.csv has no visible mojibake marker |
| mojibake | pass | data/agentsiteops-self-score-2026-06-11.csv has no visible mojibake marker |
| mojibake | pass | data/self-score-change-log-template.csv has no visible mojibake marker |
| mojibake | pass | data/route-confidence-rubric.csv has no visible mojibake marker |
| mojibake | pass | data/project-route-fit-matrix.csv has no visible mojibake marker |
| mojibake | pass | data/social-preview-assets.csv has no visible mojibake marker |
| mojibake | pass | data/github-feedback-label.csv has no visible mojibake marker |
| mojibake | pass | data/github-exposure-release-refresh.csv has no visible mojibake marker |
| mojibake | pass | docs/self-score-maintenance-protocol.md has no visible mojibake marker |
| mojibake | pass | docs/manual-outreach-runbook.md has no visible mojibake marker |
| mojibake | pass | docs/route-selection-decision-engine.md has no visible mojibake marker |
| mojibake | pass | reports/route-confidence-system.md has no visible mojibake marker |
| mojibake | pass | reports/social-preview-assets.md has no visible mojibake marker |
| mojibake | pass | reports/github-feedback-label.md has no visible mojibake marker |
| mojibake | pass | reports/github-exposure-release-refresh.md has no visible mojibake marker |
| mojibake | pass | public/reports/github-exposure-release-refresh.md has no visible mojibake marker |
| mojibake | pass | scripts/ensure-github-feedback-label.mjs has no visible mojibake marker |
| mojibake | pass | scripts/refresh-github-exposure-release.mjs has no visible mojibake marker |
| mojibake | pass | ../.github/ISSUE_TEMPLATE/agentsiteops-route-feedback.yml has no visible mojibake marker |
| mojibake | pass | ../.github/ISSUE_TEMPLATE/config.yml has no visible mojibake marker |
| mojibake | pass | lib/site.ts has no visible mojibake marker |
| mojibake | pass | lib/launch.ts has no visible mojibake marker |
| mojibake | pass | docs/site-brief.md has no visible mojibake marker |
| mojibake | pass | checklists/monetization-compliance.md has no visible mojibake marker |

## Blocking Issues

- None

## Interpretation

- This gate checks whether the live manual PayPal path has visible scope, limits, refund, contact, and evidence boundaries.
- It does not prove buyer demand, paid conversion, revenue, or product-market fit.
- Payment validation now relies on the current paid offer path and production evidence checks.
