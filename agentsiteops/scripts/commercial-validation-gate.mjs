import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "commercial-validation-gate.md");

const requiredRoutes = [
  "/tools/ai-crawler-readiness/",
  "/examples/agentsiteops-self-audit/",
  "/examples/fit-review-sample/",
  "/services/ai-website-opportunity-audit/",
  "/tools/audit-scope-builder/",
  "/tools/launch-blueprint-fit-checker/",
  "/checklists/launch-validation-decision-gate/",
  "/methodology/route-selection/",
  "/reports/route-basis/",
  "/guides/first-traffic-system/",
  "/guides/48-hour-exposure-sprint/",
  "/launch-kit/",
  "/pricing/",
  "/compare/",
  "/starter-review/",
  "/buy/",
  "/intake/",
  "/terms/",
  "/refund-policy/",
  "/disclaimer/",
  "/contact/"
];

const checks = [];
const blockers = [];

function read(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), "utf8");
}

function addCheck(scope, status, detail) {
  checks.push({ scope, status, detail });
  if (status === "fail") {
    blockers.push({ scope, detail });
  }
}

function requireText(scope, text, expected, detail) {
  addCheck(scope, text.includes(expected) ? "pass" : "fail", detail);
}

function mdEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function hasMojibake(text) {
  return /[�锟鐠閺閻涓]/.test(text);
}

function checkRoutes() {
  const routes = JSON.parse(read("docs/routes.json"));
  const paths = new Set(routes.routes.map((route) => route.path));

  for (const route of requiredRoutes) {
    addCheck("routes", paths.has(route) ? "pass" : "fail", `${route} registered in docs/routes.json`);
    addCheck("app", existsSync(resolve(rootDir, "app", route.slice(1), "page.tsx")) ? "pass" : "fail", `${route} has app page`);
  }
}

function checkCommercialBoundary() {
  const payments = read("lib/payments.ts");
  const launch = read("lib/launch.ts");
  const site = read("lib/site.ts");
  const layout = read("app/layout.tsx");
  const siteFooter = read("components/SiteFooter.tsx");
  const pricingPage = read("app/pricing/page.tsx");
  const homePage = `${read("app/page.tsx")}\n${read("components/HomePageContent.tsx")}`;
  const starterReviewPage = read("app/starter-review/page.tsx");
  const fitReviewSamplePage = read("app/examples/fit-review-sample/page.tsx");
  const buyPage = read("app/buy/page.tsx");
  const intakePage = read("app/intake/page.tsx");
  const revenue = read("data/revenue-experiments.csv");
  const compliance = read("checklists/monetization-compliance.md");
  const terms = read("app/terms/page.tsx");
  const refund = read("app/refund-policy/page.tsx");
  const disclaimer = read("app/disclaimer/page.tsx");
  const fulfillmentTemplate = read("data/manual-fulfillment-log-template.csv");
  const fulfillmentRunbook = read("docs/manual-fulfillment-runbook.md");
  const fitReviewDeliveryTemplate = read("docs/delivery-fit-review-template.md");
  const launchBlueprintDeliveryTemplate = read("docs/delivery-launch-blueprint-template.md");
  const deliveryQualityChecklist = read("data/delivery-quality-checklist.csv");
  const outreachTemplates = read("data/outreach-templates.json");
  const outreachRunbook = read("docs/manual-outreach-runbook.md");
  const outreachTracker = read("data/outreach-tracker-template.csv");
  const validationGate = read("data/launch-validation-decision-gate.csv");
  const selfScore = read("data/agentsiteops-self-score-2026-06-11.csv");
  const selfScoreProtocol = read("docs/self-score-maintenance-protocol.md");
  const selfScoreChangeLog = read("data/self-score-change-log-template.csv");
  const routePatterns = read("data/route-pattern-library.csv");
  const routeSourceMap = read("data/route-selection-source-map.csv");
  const routeConfidenceRubric = read("data/route-confidence-rubric.csv");
  const projectRouteFitMatrix = read("data/project-route-fit-matrix.csv");
  const routeDecisionEngine = read("docs/route-selection-decision-engine.md");
  const routeConfidenceReport = read("reports/route-confidence-system.md");
  const trafficChannels = read("data/first-traffic-channel-plan.csv");
  const exposureSprint = read("data/48-hour-exposure-sprint.csv");
  const exposureTargets = read("data/exposure-submission-targets.csv");
  const exposureEvidence = read("data/48-hour-exposure-evidence-template.csv");
  const exposureActionLedger = read("data/exposure-action-ledger.csv");
  const exposureStatus = read("data/48-hour-exposure-status.json");
  const exposureThresholds = read("data/48-hour-exposure-thresholds.csv");
  const exposureDecisionScript = read("scripts/48-hour-exposure-decision.mjs");
  const launchKitPage = read("app/launch-kit/page.tsx");
  const llmsText = read("public/llms.txt");
  const llmsFullText = read("public/llms-full.txt");
  const exposureCopy = read("docs/exposure-copy-pack.md");
  const githubTrafficScript = read("scripts/github-traffic-snapshot.mjs");
  const githubTrafficSnapshot = read("data/github-traffic-snapshot.json");
  const githubTrafficReport = read("reports/github-traffic-snapshot.md");
  const githubFeedbackScript = read("scripts/github-feedback-snapshot.mjs");
  const githubFeedbackSnapshot = read("data/github-feedback-snapshot.json");
  const githubFeedbackReport = read("reports/github-feedback-snapshot.md");
  const githubFeedbackLabelScript = read("scripts/ensure-github-feedback-label.mjs");
  const githubFeedbackLabel = read("data/github-feedback-label.csv");
  const githubFeedbackLabelReport = read("reports/github-feedback-label.md");
  const githubFeedbackThreadScript = read("scripts/refresh-github-feedback-thread.mjs");
  const githubFeedbackThread = read("data/github-feedback-thread-refresh.csv");
  const githubFeedbackThreadReport = read("reports/github-feedback-thread-refresh.md");
  const publicGithubFeedbackThreadReport = read("public/reports/github-feedback-thread-refresh.md");
  const githubReleaseRefreshScript = read("scripts/refresh-github-exposure-release.mjs");
  const githubReleaseRefresh = read("data/github-exposure-release-refresh.csv");
  const githubReleaseRefreshReport = read("reports/github-exposure-release-refresh.md");
  const publicGithubReleaseRefreshReport = read("public/reports/github-exposure-release-refresh.md");
  const githubDiscoverySurfaceScript = read("scripts/refresh-github-discovery-surface.mjs");
  const githubDiscoverySurface = read("data/github-discovery-surface.csv");
  const githubDiscoverySurfaceReport = read("reports/github-discovery-surface.md");
  const publicGithubDiscoverySurfaceReport = read("public/reports/github-discovery-surface.md");
  const githubIssueTemplate = read("../.github/ISSUE_TEMPLATE/agentsiteops-route-feedback.yml");
  const githubIssueTemplateConfig = read("../.github/ISSUE_TEMPLATE/config.yml");
  const externalSearchDiscoverability = read("data/external-search-discoverability-snapshot.csv");
  const externalSearchDiscoverabilityReport = read("reports/external-search-discoverability-snapshot.md");
  const launchKitVisibility = read("data/launch-kit-visibility-reinforcement.csv");
  const launchKitVisibilityReport = read("reports/launch-kit-visibility-reinforcement.md");
  const launchKitExternalSearchRecheck = read("data/launch-kit-external-search-recheck.csv");
  const launchKitExternalSearchRecheckReport = read("reports/launch-kit-external-search-recheck.md");
  const exposureAutomationCadence = read("data/exposure-automation-cadence.csv");
  const exposureAutomationCadenceReport = read("reports/exposure-automation-cadence.md");
  const socialPreviewAssets = read("data/social-preview-assets.csv");
  const socialPreviewAssetsReport = read("reports/social-preview-assets.md");

  requireText("payment_path", payments, "https://paypal.me/agentsiteops/99USD", "live USD 99 PayPal link is configured");
  requireText("payment_path", payments, "https://paypal.me/agentsiteops/29USD", "live USD 29 PayPal link is configured");
  addCheck("payment_path", !/testPayment|test_payment|temporary_payment/i.test(payments) ? "pass" : "fail", "payment config contains only current paid offer paths");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(pricingPage) ? "pass" : "fail", "pricing page contains only current paid offer CTA");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(starterReviewPage) ? "pass" : "fail", "starter review page contains only current paid offer CTA");
  addCheck("payment_path", !/testPayment|test_payment|Test PayPal|Test USD/i.test(buyPage) ? "pass" : "fail", "buy page contains only current paid offer CTA");
  requireText("payment_path", starterReviewPage, "Pay USD {starterOffer.price}", "starter review page has paid CTA");
  requireText("service_boundary", starterReviewPage, "reject the larger sale", "starter review can reject the full blueprint sale");
  requireText("service_boundary", fitReviewSamplePage, "Move to the full Route File only", "fit review sample can recommend not buying the full Route File yet");
  requireText("service_boundary", fitReviewSamplePage, "It does not prove traffic, revenue, citations, or demand.", "fit review sample states proof boundary");
  requireText("service_boundary", launch, "No guaranteed traffic, rankings, revenue, customers, AI citations", "launch product blocks guarantee claims");
  requireText("service_boundary", launch, "I can ask ChatGPT for this.", "launch objections include generic AI alternative");
  requireText("service_boundary", launch, "I need someone to build it, not just advise.", "launch objections include implementation-demand mismatch");
  requireText("service_boundary", pricingPage, "Objections that should block or redirect payment", "pricing page shows objection-based payment redirects");
  requireText("service_boundary", pricingPage, "do not pay", "pricing page can tell unclear buyers not to pay");
  requireText("service_boundary", pricingPage, "does not collect card data directly", "pricing page addresses new-site PayPal trust objection");
  requireText("service_boundary", homePage, "Evidence used, not guessed", "homepage shows evidence-before-roadmap proof layer");
  requireText("service_boundary", homePage, "What the buyer receives is a route file, not a score", "homepage shows paid artifact boundary");
  requireText("service_boundary", homePage, "Market signals are context, not proof", "homepage separates market research from validation proof");
  requireText("service_boundary", pricingPage, "Why pay for a manual route", "pricing page explains paid route-selection value");
  requireText("service_boundary", pricingPage, "What USD {primaryOffer.price} must produce", "pricing page shows delivery standard for USD 99 offer");
  requireText("service_boundary", buyPage, "No login account, dashboard, or subscription workspace", "buy page blocks software expectation");
  requireText("service_boundary", disclaimer, "No guaranteed traffic", "disclaimer blocks guarantee claims");
  requireText("trust_pages", terms, "PayPal", "terms page covers PayPal payment path");
  requireText("trust_pages", refund, "refund", "refund page exists and states refund boundary");
  requireText("revenue_experiments", revenue, '"R006","2026-06-11","AgentSiteOps Research-to-Route File","99","live_validation"', "Route File is recorded as live validation");
  requireText("revenue_experiments", revenue, '"R007","2026-06-11","AgentSiteOps Fit Review","29","live_validation"', "Fit Review is recorded as live validation");
  addCheck("revenue_experiments", !/temporary_payment|payment path test/i.test(revenue) ? "pass" : "fail", "revenue experiment table contains only active or planned commercial hypotheses");
  requireText("revenue_experiments", revenue, '"R005","2026-06-07","SaaS subscription","TBD","blocked"', "subscription remains blocked");
  requireText("compliance", compliance, "| Launch Blueprint payment path | `pass_with_boundary` |", "current payment path has compliance boundary");
  requireText("compliance", compliance, "| Manual PayPal payment path disclosed | `pass` |", "manual PayPal path is disclosed");
  requireText("compliance", compliance, "| No card data collected by site | `pass` |", "site does not collect card data");
  requireText("manual_fulfillment", intakePage, "Payment confirmation", "intake page requests payment confirmation");
  requireText("manual_fulfillment", intakePage, "Manual delivery process", "intake page explains manual delivery process");
  requireText("manual_fulfillment", fulfillmentTemplate, "paypal_reference", "manual fulfillment template records payment reference");
  requireText("manual_fulfillment", fulfillmentTemplate, "fit_review|launch_blueprint", "manual fulfillment template records purchased product");
  requireText("manual_fulfillment", fulfillmentTemplate, "Do not store card data", "manual fulfillment template blocks sensitive payment data storage");
  requireText("manual_fulfillment", fulfillmentRunbook, "Do not store", "manual fulfillment runbook states data boundary");
  requireText("manual_fulfillment", fulfillmentRunbook, "docs/delivery-fit-review-template.md", "manual fulfillment runbook links Fit Review delivery template");
  requireText("manual_fulfillment", fulfillmentRunbook, "docs/delivery-launch-blueprint-template.md", "manual fulfillment runbook links Launch Blueprint delivery template");
  requireText("manual_fulfillment", fitReviewDeliveryTemplate, "Verdict: go | narrow | stop", "Fit Review delivery template has verdict boundary");
  requireText("manual_fulfillment", fitReviewDeliveryTemplate, "Do not claim", "Fit Review delivery template blocks guarantee claims");
  requireText("manual_fulfillment", launchBlueprintDeliveryTemplate, "Selected Route", "Route File delivery template selects one route");
  requireText("manual_fulfillment", launchBlueprintDeliveryTemplate, "Evidence Ledger", "Route File delivery template includes evidence ledger");
  requireText("manual_fulfillment", deliveryQualityChecklist, "No card data passwords API keys bank details or private customer lists are stored", "delivery checklist blocks sensitive data storage");
  requireText("manual_fulfillment", deliveryQualityChecklist, "No guaranteed traffic ranking AI citation revenue or customer response is claimed", "delivery checklist blocks guarantee claims");
  requireText("manual_outreach", outreachTemplates, "Do not promise traffic, rankings, AI citations, revenue", "outreach templates block inflated claims");
  requireText("manual_outreach", outreachTemplates, "Keep names, emails, handles, and private replies outside public files", "outreach templates keep private replies out of the repo");
  requireText("manual_outreach", outreachRunbook, "Do not use automated DMs", "outreach runbook blocks automated direct messages");
  requireText("manual_outreach", outreachRunbook, "Do not promise traffic, rankings, AI citations, revenue", "outreach runbook blocks guarantee claims");
  requireText("manual_outreach", outreachRunbook, "Do not store names emails handles private replies or payment identifiers", "outreach runbook blocks public storage of private lead data");
  requireText("manual_outreach", outreachRunbook, "20 manual prospects", "outreach runbook sets a small-batch validation limit");
  requireText("manual_outreach", outreachTracker, "confirmed_payment_count", "outreach tracker separates confirmed payments");
  requireText("manual_outreach", outreachTracker, "usable_intake_count", "outreach tracker separates usable intake");
  requireText("manual_outreach", outreachTracker, "Aggregate only", "outreach tracker stores only aggregate records");
  requireText("validation_decision_gate", site, "Stop, rewrite, or pivot before scaling", "validation gate states anti-scaling decision boundary");
  requireText("validation_decision_gate", site, "Confirmed payment plus usable intake", "validation gate names the strongest early proof");
  requireText("validation_decision_gate", site, "PayPal clicks without confirmed payment are not revenue", "validation gate blocks payment-click-as-revenue logic");
  requireText("validation_decision_gate", site, "IndexNow success is not demand", "validation gate blocks technical success as demand proof");
  requireText("validation_decision_gate", site, "pivot_to_implementation", "validation gate includes implementation-demand pivot path");
  requireText("validation_decision_gate", validationGate, "confirmed_payment_plus_usable_intake", "validation CSV records confirmed payment plus usable intake threshold");
  requireText("validation_decision_gate", validationGate, "pivot_to_implementation", "validation CSV records implementation pivot");
  requireText("validation_decision_gate", validationGate, "PayPal_click_without_confirmed_payment", "validation CSV blocks payment clicks without confirmation");
  requireText("self_score", site, "52/100: technically launchable, commercially unvalidated.", "self-audit states objective current score and verdict");
  requireText("self_score", site, "do not scale content, paid tools, higher pricing, or subscriptions yet", "self-audit blocks premature scaling");
  requireText("self_score", selfScore, '"overall","100","52"', "self-score CSV records overall 52 score");
  requireText("self_score", selfScore, "confirmed payment plus usable intake is absent", "self-score CSV records missing commercial proof");
  requireText("self_score", selfScore, "commercially_unvalidated", "self-score CSV records commercial verdict");
  requireText("self_score", site, "Score update rules", "evidence page shows score update rules");
  requireText("self_score", site, "cannot increase from pageviews, sitemap success, IndexNow success, crawler access", "evidence page blocks weak self-score increases");
  requireText("self_score", selfScoreProtocol, "The current public score is `52/100`", "self-score protocol records current score");
  requireText("self_score", selfScoreProtocol, "Do not raise the overall score from pageviews, sitemap success, IndexNow success, crawler access", "self-score protocol blocks technical-only score increases");
  requireText("self_score", selfScoreProtocol, "Decrease a score immediately when a gate fails", "self-score protocol allows immediate score decreases");
  requireText("self_score", selfScoreChangeLog, "confirmed_payment_plus_usable_intake", "self-score change log template records commercial threshold");
  requireText("self_score", selfScoreChangeLog, "Aggregate only; do not store names emails payment identifiers", "self-score change log template blocks private data storage");
  requireText("route_selection", site, "The score is a gate; the route is selected", "route methodology states score is not the route itself");
  requireText("route_selection", site, "12 operating archetypes", "route methodology names the route-pattern library");
  requireText("route_selection", site, "Confidence rubric", "route methodology exposes confidence bands");
  requireText("route_selection", site, "Project fit matrix", "route methodology exposes project-to-route fit");
  requireText("route_selection", site, "When the answer must be stop", "route methodology includes stop conditions");
  requireText("route_selection", site, "Route Basis Report", "route basis report is visible in site data");
  requireText("route_selection", site, "What forces rejection", "route basis report exposes rejection logic");
  requireText("route_selection", llmsText, "Route basis report", "AI context links the route basis report");
  requireText("route_selection", routePatterns, "AI workflow setup service", "route-pattern library includes AI workflow setup service");
  requireText("route_selection", routePatterns, "Marketplace or matching service", "route-pattern library includes marketplace or matching route");
  requireText("route_selection", routePatterns, "Programmatic directory", "route-pattern library includes data route");
  requireText("route_selection", routePatterns, "common_stop_rule", "route-pattern library records stop rules");
  requireText("route_selection", routeSourceMap, "generic_ai_substitute", "route source map includes generic AI substitute risk");
  requireText("route_selection", routeSourceMap, "Confirmed payment, payment click plus usable intake", "route source map ties monetization fit to confirmed payment and usable intake");
  requireText("route_selection", routeSourceMap, "Do not scale content cluster when first-party search data is missing", "route source map blocks search scaling without first-party data");
  requireText("route_selection", routeConfidenceRubric, '"high","Confirmed payment plus usable intake', "confidence rubric requires payment plus usable intake for high confidence");
  requireText("route_selection", routeConfidenceRubric, '"reject","Founder assumptions', "confidence rubric can reject assumption-led routes");
  requireText("route_selection", projectRouteFitMatrix, '"Content or SEO site"', "project fit matrix includes content or SEO site route");
  requireText("route_selection", projectRouteFitMatrix, '"Done-for-you implementation"', "project fit matrix includes implementation route");
  requireText("route_selection", routeConfidenceReport, "This does not prove search demand", "route confidence report preserves no-demand boundary");
  requireText("route_selection", routeDecisionEngine, "Never raise route confidence from assumptions alone.", "route decision engine blocks assumption-only confidence");
  requireText("route_selection", routeDecisionEngine, "Never sell high-confidence route selection", "route decision engine blocks unsupported high-confidence selling");
  requireText("route_selection", routeDecisionEngine, "Fit Matrix Use", "route decision engine explains fit matrix use");
  requireText("route_selection", routeDecisionEngine, "Never keep a route when the buyer needs implementation and the product only delivers advice.", "route decision engine blocks advice-only mismatch");
  requireText("route_selection", routeDecisionEngine, "One selected route", "route decision engine requires one selected route");
  requireText("first_traffic", site, "The first traffic plan does not wait for Google alone", "first traffic guide states multi-channel exposure");
  requireText("first_traffic", site, "48-hour exposure loop", "first traffic guide includes 48-hour loop");
  requireText("first_traffic", trafficChannels, "Manual founder outreach", "first traffic channel plan includes manual outreach");
  requireText("first_traffic", trafficChannels, "Directory and launch listing", "first traffic channel plan includes launch listing channel");
  requireText("first_traffic", trafficChannels, "stop_or_rewrite_rule", "first traffic channel plan records stop rules");
  requireText("exposure_sprint", site, "The 48-hour sprint treats exposure as a validation system", "48-hour sprint page states exposure validation boundary");
  requireText("exposure_sprint", site, "continue, rewrite, narrow, pivot_to_implementation, or stop", "48-hour sprint page names decision outcomes");
  requireText("exposure_sprint", exposureSprint, "0-4h", "48-hour sprint table includes first execution window");
  requireText("exposure_sprint", exposureSprint, "confirmed payments", "48-hour sprint table tracks confirmed payment separately");
  requireText("exposure_sprint", exposureTargets, "Product Hunt", "exposure targets include Product Hunt prep");
  requireText("exposure_sprint", exposureTargets, "Show HN", "exposure targets include Show HN prep");
  requireText("exposure_sprint", exposureTargets, "Do not automate DMs", "exposure targets block automated direct messages");
  requireText("exposure_sprint", exposureEvidence, "confirmed_payment_count", "exposure evidence template separates confirmed payments");
  requireText("exposure_sprint", exposureEvidence, "usable_intake_count", "exposure evidence template separates usable intake");
  requireText("exposure_sprint", exposureEvidence, "qualified_reply_count", "exposure evidence template separates qualified replies");
  requireText("exposure_sprint", exposureEvidence, "sample_view_count", "exposure evidence template separates sample views");
  requireText("exposure_sprint", exposureEvidence, "objection_count", "exposure evidence template separates objections");
  requireText("exposure_sprint", exposureStatus, '"seal_if_no_metric": true', "48-hour status requires sealing if metrics are absent");
  requireText("exposure_sprint", exposureStatus, '"decision_report": "reports/48-hour-exposure-decision.md"', "48-hour status records the decision report path");
  requireText("exposure_sprint", exposureThresholds, "all_above_missing_at_deadline", "48-hour thresholds include the deadline seal rule");
  requireText("exposure_sprint", exposureThresholds, "confirmed_payment_count>=1 and usable_intake_count>=1", "48-hour thresholds prioritize confirmed payment plus usable intake");
  requireText("exposure_sprint", exposureDecisionScript, "seal_required", "48-hour decision script can require sealing");
  requireText("exposure_sprint", exposureDecisionScript, "EXPOSURE_DECISION_NOW", "48-hour decision script supports deterministic deadline tests");
  requireText("exposure_sprint", exposureDecisionScript, "process.exitCode = 1", "48-hour decision script fails CI when sealing is required");
  requireText("exposure_sprint", exposureCopy, "Do not claim revenue, traffic, ranking, or AI-citation proof", "exposure copy pack blocks inflated claims");
  requireText("exposure_sprint", exposureCopy, "Would this need to pivot toward implementation", "exposure copy pack tests implementation-pivot risk");
  requireText("exposure_sprint", exposureActionLedger, "repo_metadata_updated", "exposure action ledger records GitHub metadata update");
  requireText("exposure_sprint", exposureActionLedger, "prerelease_created", "exposure action ledger records GitHub prerelease creation");
  requireText("exposure_sprint", exposureActionLedger, "feedback_issue_created", "exposure action ledger records GitHub feedback issue creation");
  requireText("exposure_sprint", exposureActionLedger, "github_traffic_snapshot_imported", "exposure action ledger records GitHub traffic snapshot import");
  requireText("exposure_sprint", exposureActionLedger, "feedback_checkpoint_comment", "exposure action ledger records public feedback checkpoint comment");
  requireText("exposure_sprint", exposureActionLedger, "github_feedback_snapshot_imported", "exposure action ledger records GitHub feedback snapshot import");
  requireText("exposure_sprint", exposureActionLedger, "external_search_discoverability_snapshot", "exposure action ledger records external search discoverability snapshot");
  requireText("exposure_sprint", exposureActionLedger, "launch_kit_visibility_reinforcement", "exposure action ledger records Launch Kit visibility reinforcement");
  requireText("exposure_sprint", exposureActionLedger, "launch_kit_external_search_recheck", "exposure action ledger records Launch Kit external search recheck");
  requireText("exposure_sprint", exposureActionLedger, "hourly_execution_cadence_updated", "exposure action ledger records hourly execution cadence update");
  requireText("exposure_sprint", exposureActionLedger, "social_preview_assets_added", "exposure action ledger records social preview asset addition");
  requireText("exposure_sprint", exposureActionLedger, "exposure_release_refreshed", "exposure action ledger records GitHub release refresh");
  requireText("exposure_sprint", exposureActionLedger, "verified_aggregate", "exposure action ledger marks GitHub traffic as aggregate evidence");
  requireText("exposure_sprint", exposureActionLedger, "counts_toward_threshold", "exposure action ledger separates public actions from threshold evidence");
  requireText("exposure_sprint", exposureActionLedger, "This improves public discoverability but is not demand proof.", "exposure action ledger blocks public-action-as-demand logic");
  requireText("exposure_sprint", exposureActionLedger, "Creation itself is not a qualified reply", "exposure action ledger blocks issue-creation-as-reply logic");
  requireText("exposure_sprint", exposureActionLedger, "This maintainer comment does not count as a qualified external reply.", "exposure action ledger blocks maintainer-comment-as-reply logic");
  requireText("exposure_sprint", exposureActionLedger, "aggregate public comment counts only", "exposure action ledger records aggregate-only feedback snapshot");
  requireText("exposure_sprint", exposureActionLedger, "discoverability only, not impressions, clicks, visits, replies, payments, usable intake, or objections", "exposure action ledger blocks search-result-as-demand logic");
  requireText("exposure_sprint", exposureActionLedger, "internal discovery only and does not prove impressions, clicks, visits, replies, payments, usable intake, or objections", "exposure action ledger blocks internal-link-as-demand logic");
  requireText("exposure_sprint", exposureActionLedger, "not Launch Kit indexing or demand proof", "exposure action ledger blocks adjacent-search-results-as-launch-kit-proof logic");
  requireText("exposure_sprint", exposureActionLedger, "does not prove traffic, replies, payments, usable intake, or objections", "exposure action ledger blocks cadence-as-demand logic");
  requireText("exposure_sprint", exposureActionLedger, "does not prove impressions, clicks, visits, replies, payments, usable intake, objections, or revenue", "exposure action ledger blocks social-preview-as-demand logic");
  addCheck("social_preview", existsSync(resolve(rootDir, "public", "og-image.png")) ? "pass" : "fail", "Open Graph preview image exists");
  addCheck("social_preview", existsSync(resolve(rootDir, "public", "twitter-image.png")) ? "pass" : "fail", "Twitter preview image exists");
  requireText("social_preview", layout, 'url: "/og-image.png"', "Open Graph metadata points to preview image");
  requireText("social_preview", layout, 'card: "summary_large_image"', "Twitter card uses large image format");
  requireText("social_preview", layout, 'images: ["/twitter-image.png"]', "Twitter metadata points to preview image");
  requireText("social_preview", socialPreviewAssets, "https://agentsiteops.com/og-image.png", "social preview asset CSV records OG image URL");
  requireText("social_preview", socialPreviewAssetsReport, "They do not prove impressions, clicks, visits", "social preview report preserves no-demand boundary");
  requireText("github_traffic", githubTrafficScript, "traffic/views", "GitHub traffic script imports aggregate repo views");
  requireText("github_traffic", githubTrafficScript, "traffic/clones", "GitHub traffic script imports aggregate repo clones");
  requireText("github_traffic", githubTrafficScript, "traffic/popular/referrers", "GitHub traffic script imports aggregate referrers");
  requireText("github_traffic", githubTrafficScript, "traffic/popular/paths", "GitHub traffic script imports aggregate paths");
  requireText("github_traffic", githubTrafficSnapshot, "GitHub traffic is aggregate repo exposure. It does not prove website visits, sample views, source-link clicks, qualified replies, payments, usable intake, or objections.", "GitHub traffic snapshot preserves no-threshold boundary");
  requireText("github_traffic", githubTrafficReport, "Do not use GitHub traffic to increase 48-hour continuation thresholds.", "GitHub traffic report preserves threshold boundary");
  requireText("github_feedback", githubFeedbackScript, "issues/${issueNumber}/comments?per_page=100", "GitHub feedback script imports public issue comments");
  requireText("github_feedback", githubFeedbackScript, "storesUsernames: false", "GitHub feedback script avoids storing usernames");
  requireText("github_feedback", githubFeedbackScript, "storesCommentBodies: false", "GitHub feedback script avoids storing comment bodies");
  requireText("github_feedback", githubFeedbackScript, "agentsiteops-feedback", "GitHub feedback script tracks structured feedback label");
  requireText("github_feedback", githubFeedbackSnapshot, '"qualifiedReplyCount": 0', "GitHub feedback snapshot does not auto-count qualified replies");
  requireText("github_feedback", githubFeedbackSnapshot, '"feedbackIssuesByAssociation"', "GitHub feedback snapshot records structured feedback issue associations");
  requireText("github_feedback", githubFeedbackReport, "External comments and structured feedback issues are candidates only until manually reviewed", "GitHub feedback report preserves manual qualification boundary");
  requireText("github_feedback", githubFeedbackReport, "Structured feedback template", "GitHub feedback report links structured issue template");
  requireText("github_feedback_label", githubFeedbackLabelScript, "GitHub credential token is unavailable", "GitHub label script uses credential store without writing tokens");
  requireText("github_feedback_label", githubFeedbackLabel, "agentsiteops-feedback", "GitHub feedback label snapshot records label");
  requireText("github_feedback_label", githubFeedbackLabelReport, "They do not prove replies, demand, visits", "GitHub feedback label report blocks label-as-demand logic");
  requireText("github_feedback_template", githubIssueTemplate, "Do not include private customer data", "GitHub issue template blocks sensitive public data");
  requireText("github_feedback_template", githubIssueTemplate, "Need implementation instead of advice", "GitHub issue template captures implementation-pivot signal");
  requireText("github_feedback_template", githubIssueTemplate, "Trust, proof, or objection", "GitHub issue template captures proof and objection signals");
  requireText("github_feedback_template", githubIssueTemplateConfig, "blank_issues_enabled: false", "GitHub issue template config disables blank public issues");
  requireText("github_feedback_thread", githubFeedbackThreadScript, "Maintainer edits and comments do not count", "GitHub feedback thread script preserves maintainer boundary");
  requireText("github_feedback_thread", githubFeedbackThread, "github_feedback_thread_refreshed", "GitHub feedback thread CSV records refresh action");
  requireText("github_feedback_thread", githubFeedbackThreadReport, "Only downstream external feedback can become candidate threshold evidence", "GitHub feedback thread report blocks maintainer-edit-as-demand logic");
  requireText("github_feedback_thread", publicGithubFeedbackThreadReport, "Counts toward 48-hour continuation threshold: no", "public GitHub feedback thread report preserves threshold boundary");
  requireText("github_feedback_thread", exposureActionLedger, "github_feedback_thread_refreshed", "exposure action ledger records GitHub feedback thread refresh");
  requireText("github_release_refresh", githubReleaseRefreshScript, "make_latest", "GitHub release refresh script avoids making the prerelease latest");
  requireText("github_release_refresh", githubReleaseRefreshScript, "Route basis report", "GitHub release refresh links route basis report");
  requireText("github_release_refresh", githubReleaseRefresh, "github.com/SB980425/shachidainei/releases/tag/agentsiteops-48h-exposure-2026-06-12", "GitHub release refresh snapshot records release URL");
  requireText("github_release_refresh", githubReleaseRefreshReport, "does not prove impressions, clicks, visits", "GitHub release refresh report blocks release-as-demand logic");
  requireText("github_release_refresh", publicGithubReleaseRefreshReport, "Route basis report", "public GitHub release refresh report includes route basis link");
  requireText("github_release_refresh", publicGithubReleaseRefreshReport, "Counts toward 48-hour continuation threshold: no", "public GitHub release refresh report preserves threshold boundary");
  requireText("github_discovery_surface", githubDiscoverySurfaceScript, "desiredTopics", "GitHub discovery surface script manages topics");
  requireText("github_discovery_surface", githubDiscoverySurface, "github_discovery_surface_refreshed", "GitHub discovery surface CSV records refresh action");
  requireText("github_discovery_surface", githubDiscoverySurfaceReport, "They do not prove impressions, clicks, visits", "GitHub discovery surface report blocks metadata-as-demand logic");
  requireText("github_discovery_surface", publicGithubDiscoverySurfaceReport, "Counts toward 48-hour continuation threshold: no", "public GitHub discovery surface report preserves threshold boundary");
  requireText("github_discovery_surface", exposureActionLedger, "github_discovery_surface_refreshed", "exposure action ledger records GitHub discovery surface refresh");
  requireText("external_search_discoverability", externalSearchDiscoverability, "https://agentsiteops.com/", "external search discoverability snapshot includes the home page");
  requireText("external_search_discoverability", externalSearchDiscoverability, "https://agentsiteops.com/reports/route-evidence-dashboard/", "external search discoverability snapshot includes evidence dashboard");
  requireText("external_search_discoverability", externalSearchDiscoverability, "counts_toward_48h_threshold", "external search discoverability snapshot carries threshold boundary column");
  requireText("external_search_discoverability", externalSearchDiscoverabilityReport, "This does not prove Google Search Console impressions", "external search discoverability report blocks search-result-as-GSC logic");
  requireText("external_search_discoverability", externalSearchDiscoverabilityReport, "The Launch Kit page was not confirmed in this snapshot", "external search discoverability report records missing launch kit visibility");
  requireText("launch_kit_visibility", launchKitVisibility, '"global_footer","all_pages","/launch-kit/"', "Launch Kit visibility snapshot records global footer link");
  requireText("launch_kit_visibility", launchKitVisibility, '"/examples/agentsiteops-self-audit/","/launch-kit/"', "Launch Kit visibility snapshot records self-audit related link");
  requireText("launch_kit_visibility", launchKitVisibility, '"/reports/route-evidence-dashboard/","/launch-kit/"', "Launch Kit visibility snapshot records evidence dashboard related link");
  requireText("launch_kit_visibility", launchKitVisibilityReport, "does not prove search impressions, ranking, clicks", "Launch Kit visibility report blocks internal-link-as-demand logic");
  requireText("launch_kit_visibility", siteFooter, '["Launch Kit", "/launch-kit/"]', "global footer links to Launch Kit");
  requireText("launch_kit_visibility", homePage, '"/launch-kit/"', "homepage links to Launch Kit");
  requireText("launch_kit_visibility", site, '{ label: "Launch Kit", href: "/launch-kit/" }', "route related links include Launch Kit");
  requireText("launch_kit_external_search", launchKitExternalSearchRecheck, '"confirmed_launch_kit_result"', "Launch Kit external search recheck records direct confirmation field");
  requireText("launch_kit_external_search", launchKitExternalSearchRecheck, '"no","https://agentsiteops.com/"', "Launch Kit external search recheck records home page fallback result");
  requireText("launch_kit_external_search", launchKitExternalSearchRecheckReport, "The Launch Kit page itself is not yet confirmed", "Launch Kit external search recheck preserves missing visibility finding");
  requireText("launch_kit_external_search", launchKitExternalSearchRecheckReport, "not proof of search visibility", "Launch Kit external search recheck blocks internal-link-as-search-proof logic");
  requireText("exposure_cadence", exposureAutomationCadence, "FREQ=HOURLY;INTERVAL=1", "exposure automation cadence is hourly");
  requireText("exposure_cadence", exposureAutomationCadence, "one-hour execution blocks", "exposure automation cadence records one-hour execution block purpose");
  requireText("exposure_cadence", exposureAutomationCadenceReport, "does not prove traffic, search impressions, clicks", "exposure automation cadence report blocks cadence-as-demand logic");
  requireText("launch_kit", launchKitPage, 'path = "/launch-kit/"', "launch kit page is wired to static route data");
  requireText("launch_kit", site, "AgentSiteOps Launch Kit", "launch kit route data exists");
  requireText("launch_kit", site, "technically launchable, commercially unvalidated", "launch kit states current validation status");
  requireText("launch_kit", site, "48-hour seal rule", "launch kit exposes seal rule");
  requireText("launch_kit", site, "Do not buy if", "launch kit blocks bad-fit purchase intent");
  requireText("launch_kit", llmsText, "Launch kit: https://agentsiteops.com/launch-kit/", "llms.txt points AI readers to launch kit");
  requireText("launch_kit", llmsText, "No guaranteed traffic", "llms.txt carries no-guarantee boundary");
  requireText("launch_kit", llmsText, "seal_required", "llms.txt carries seal decision rule");
  requireText("launch_kit", llmsFullText, "Evidence Hierarchy", "llms-full.txt explains evidence hierarchy");
  requireText("launch_kit", llmsFullText, "48-Hour Rule", "llms-full.txt explains 48-hour rule");

  addCheck("service_boundary", !/guaranteed rankings|guaranteed revenue|guaranteed customers/i.test(launch) ? "pass" : "fail", "launch copy avoids guarantee claims");
}

function checkReadinessTool() {
  const tool = read("components/AICrawlerReadinessTool.tsx");
  const weights = [...tool.matchAll(/weight:\s*(\d+)/g)].map((match) => Number(match[1]));
  const total = weights.reduce((sum, value) => sum + value, 0);

  addCheck("readiness_tool", weights.length === 13 ? "pass" : "fail", `readiness tool has 13 weighted checks; found ${weights.length}`);
  addCheck("readiness_tool", total === 100 ? "pass" : "fail", `readiness tool weights total ${total}`);
  const hasBoundary =
    tool.includes("does not prove indexing") &&
    tool.includes("AI citation") &&
    tool.includes("traffic") &&
    tool.includes("conversion") &&
    tool.includes("revenue");
  addCheck("readiness_tool", hasBoundary ? "pass" : "fail", "tool states evidence boundary");
}

function checkAuditScopeBuilder() {
  const tool = read("components/AuditScopeBuilder.tsx");
  const page = read("app/tools/audit-scope-builder/page.tsx");

  requireText("audit_scope_builder", tool, "local-only", "scope builder states local-only boundary");
  requireText("audit_scope_builder", tool, "does not submit a request", "scope builder blocks request-submission claim");
  requireText("audit_scope_builder", page, "No payment, account, identity, or external platform step is required.", "scope page states no payment or account step");

  addCheck(
    "audit_scope_builder",
    !/fetch\(|XMLHttpRequest|sendBeacon|form action=|paypal|stripe|lemonsqueezy/i.test(tool)
      ? "pass"
      : "fail",
    "scope builder has no network submit or payment integration"
  );
}

function checkLaunchFitChecker() {
  const tool = read("components/LaunchBlueprintFitChecker.tsx");
  const page = read("app/tools/launch-blueprint-fit-checker/page.tsx");

  requireText("launch_fit_checker", tool, "Do not buy", "fit checker can block bad-fit buyers");
  requireText("launch_fit_checker", tool, "guaranteed traffic or revenue", "fit checker blocks guarantee expectations");
  requireText("launch_fit_checker", page, "No request, account, payment, or personal data is submitted.", "fit checker page states local-only boundary");

  addCheck(
    "launch_fit_checker",
    !/fetch\(|XMLHttpRequest|sendBeacon|form action=|stripe|lemonsqueezy/i.test(tool)
      ? "pass"
      : "fail",
    "fit checker has no network submit or third-party payment integration"
  );
}

function checkMojibake() {
  const files = [
    "components/CopyAction.tsx",
    "components/AICrawlerReadinessTool.tsx",
    "components/AuditScopeBuilder.tsx",
    "data/outreach-templates.json",
    "data/launch-validation-decision-gate.csv",
    "data/agentsiteops-self-score-2026-06-11.csv",
    "data/self-score-change-log-template.csv",
    "data/route-confidence-rubric.csv",
    "data/project-route-fit-matrix.csv",
    "data/social-preview-assets.csv",
    "data/github-feedback-label.csv",
    "data/github-exposure-release-refresh.csv",
    "docs/self-score-maintenance-protocol.md",
    "docs/manual-outreach-runbook.md",
    "docs/route-selection-decision-engine.md",
    "reports/route-confidence-system.md",
    "reports/social-preview-assets.md",
    "reports/github-feedback-label.md",
    "reports/github-exposure-release-refresh.md",
    "public/reports/github-exposure-release-refresh.md",
    "scripts/ensure-github-feedback-label.mjs",
    "scripts/refresh-github-exposure-release.mjs",
    "../.github/ISSUE_TEMPLATE/agentsiteops-route-feedback.yml",
    "../.github/ISSUE_TEMPLATE/config.yml",
    "lib/site.ts",
    "lib/launch.ts",
    "docs/site-brief.md",
    "checklists/monetization-compliance.md"
  ];

  for (const file of files) {
    addCheck("mojibake", hasMojibake(read(file)) ? "fail" : "pass", `${file} has no visible mojibake marker`);
  }
}

function renderReport(generatedAt) {
  const status = blockers.length ? "blocked" : "pass";
  const lines = [
    "# Commercial Validation Gate",
    "",
    `- Generated: ${generatedAt}`,
    `- Status: ${status}`,
    `- Checks: ${checks.length}`,
    `- Blockers: ${blockers.length}`,
    "",
    "## Summary",
    "",
    "| Scope | Status | Detail |",
    "|---|---|---|",
    ...checks.map((check) => `| ${mdEscape(check.scope)} | ${check.status} | ${mdEscape(check.detail)} |`),
    "",
    "## Blocking Issues",
    "",
    ...(blockers.length ? blockers.map((item) => `- ${item.scope}: ${item.detail}`) : ["- None"]),
    "",
    "## Interpretation",
    "",
    "- This gate checks whether the live manual PayPal path has visible scope, limits, refund, contact, and evidence boundaries.",
    "- It does not prove buyer demand, paid conversion, revenue, or product-market fit.",
    "- Payment validation now relies on the current paid offer path and production evidence checks."
  ];

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return status;
}

function main() {
  checkRoutes();
  checkCommercialBoundary();
  checkReadinessTool();
  checkAuditScopeBuilder();
  checkLaunchFitChecker();
  checkMojibake();

  const status = renderReport(new Date().toISOString());
  console.log(
    JSON.stringify(
      {
        status,
        checks: checks.length,
        blockers: blockers.length,
        reportPath
      },
      null,
      2
    )
  );

  if (blockers.length) {
    process.exitCode = 1;
  }
}

main();
