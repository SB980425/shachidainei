export const routeSourceMap = [
  {
    dimension: "Builder ability",
    acceptedEvidence: "Work sample, repo, portfolio, workflow screenshot, delivered artifact, or repeatable manual process",
    downgradeWhen: "Only claimed skill with no public or buyer-provided proof",
    stopRule: "Stop paid blueprint if delivery requires abilities the buyer cannot show or safely access",
    outputEffect: "Select service, tool, content, data, or implementation route based on what can actually be delivered"
  },
  {
    dimension: "Buyer problem",
    acceptedEvidence: "Qualified reply, buyer wording, support ticket, forum question, search query, sales call note, or first-party intake",
    downgradeWhen: "Problem is described only by the builder or by generic model output",
    stopRule: "Stop if no reachable buyer segment can name the pain in concrete language",
    outputEffect: "Choose first page angle, offer promise boundary, and outreach question"
  },
  {
    dimension: "Proof asset",
    acceptedEvidence: "Before-after sample, checklist result, calculator output, audit excerpt, public demo, or source-backed comparison",
    downgradeWhen: "Proof is only a mockup, broad claim, or copied public advice",
    stopRule: "Stop or narrow if the route cannot show a concrete artifact before payment",
    outputEffect: "Require sample, fit checker, demo, source pack, or page skeleton before promotion"
  },
  {
    dimension: "Target segment",
    acceptedEvidence: "Specific role, company type, workflow owner, tool user, budget owner, or community cluster",
    downgradeWhen: "Segment is everyone, all AI users, all founders, or all websites",
    stopRule: "Stop if the first 20 manual prospects cannot be listed without spam or scraping",
    outputEffect: "Pick first traffic channel and manual outreach batch"
  },
  {
    dimension: "Delivery capacity",
    acceptedEvidence: "Weekly hours, turnaround, scope boundary, revision limit, and manual fulfillment checklist",
    downgradeWhen: "Capacity is unknown or depends on untested automation",
    stopRule: "Reject subscription or dashboard claims until manual delivery works",
    outputEffect: "Set one-time review, fixed-scope setup, or manual audit instead of SaaS"
  },
  {
    dimension: "Data rights",
    acceptedEvidence: "Owned data, public source terms, permitted API, export, source register, update owner, and freshness plan",
    downgradeWhen: "Data is copied, stale, unverifiable, or legally unclear",
    stopRule: "Stop data or directory route if rights, freshness, or unique value cannot be defended",
    outputEffect: "Permit or block directory, comparison, report, or programmatic page route"
  },
  {
    dimension: "Risk boundary",
    acceptedEvidence: "YMYL classification, privacy exposure, account access, platform policy, payment processor limits, and regulated-advice check",
    downgradeWhen: "Risk is unknown, hidden, or shifted to the buyer without disclosure",
    stopRule: "Stop legal, medical, financial, tax, safety, or account-risk advice without qualified support",
    outputEffect: "Add disclaimer, refund boundary, intake limits, or route rejection"
  },
  {
    dimension: "Monetization fit",
    acceptedEvidence: "Confirmed payment, payment click plus usable intake, buyer budget signal, comparable price anchor, or low-risk manual sale",
    downgradeWhen: "Only projected revenue, pageviews, or AI confidence supports price",
    stopRule: "Stop price increase, subscription, or paid software build without payment evidence",
    outputEffect: "Choose USD 29 review, USD 99 blueprint, free sample, or no payment"
  },
  {
    dimension: "Search evidence",
    acceptedEvidence: "GSC export, Bing export, query list, source-backed SERP review, index status, or cited URL evidence",
    downgradeWhen: "Only sitemap success, IndexNow success, or third-party estimate exists",
    stopRule: "Do not scale content cluster when first-party search data is missing",
    outputEffect: "Limit to a small page set and keep search evidence pending"
  },
  {
    dimension: "AI visibility evidence",
    acceptedEvidence: "AI referral, Bing AI Performance export, cited URL, crawler log, retrieval test, or answer inclusion with source URL",
    downgradeWhen: "Only AI-readiness checklist or crawler allowance exists",
    stopRule: "Do not claim AI traffic or citations without a captured source and timestamp",
    outputEffect: "Keep AI-readable pages, llms files, and crawler checks as readiness only"
  },
  {
    dimension: "Implementation need",
    acceptedEvidence: "Buyer says they need setup/build/done-for-you, not a plan; existing offer is already clear",
    downgradeWhen: "Advice artifact would not remove the buyer's blocker",
    stopRule: "Pivot from blueprint to implementation or reject payment if a route file is the wrong product",
    outputEffect: "Route to setup service, build package, or refund/reject decision"
  },
  {
    dimension: "Generic AI substitute",
    acceptedEvidence: "Evidence that a manual route file adds sequencing, rejection, source review, risk boundary, or execution backlog beyond generic model output",
    downgradeWhen: "Output can be produced by a prompt without buyer-specific evidence or stop rules",
    stopRule: "Do not sell if generic AI can produce the same useful result from the same inputs",
    outputEffect: "Require rejected routes, evidence ledger, channel plan, and stop rules in delivery"
  }
];

export const routeConfidenceBands = [
  {
    band: "High",
    requiredEvidence: "Confirmed payment plus usable intake, qualified buyer replies, first-party search or analytics evidence, and a proof asset that matches the selected route",
    allowedOutput: "Proceed with one narrow route, one offer, one page asset, one channel, rejected alternatives, and a 7-day validation plan",
    blockedClaims: "Guaranteed rankings, guaranteed AI citations, guaranteed revenue, market authority, or subscription readiness",
    nextAction: "Deliver the route file, record outcome, and update the evidence ledger"
  },
  {
    band: "Medium",
    requiredEvidence: "Public demo, repo, sample artifact, workflow screenshot, source-backed comparison, or manually verifiable delivery ability, but no payment or first-party demand signal",
    allowedOutput: "Pilot a small free or paid test with explicit missing evidence and a narrow outreach batch",
    blockedClaims: "Product-market fit, pricing certainty, recurring demand, or traffic scale",
    nextAction: "Run a bounded exposure test and request external objections before building more pages"
  },
  {
    band: "Low",
    requiredEvidence: "Competitor pages, public market signals, community questions, keyword ideas, third-party tool estimates, or AI visibility research without first-party proof",
    allowedOutput: "Publish a diagnostic page, source pack, checklist, or free tool only if it adds original value",
    blockedClaims: "Demand proof, buyer willingness to pay, or confidence above the proceed threshold",
    nextAction: "Collect search exports, replies, sample usage, or manual outreach evidence"
  },
  {
    band: "Reject",
    requiredEvidence: "Founder assumptions, model-generated ideas, unclear buyer segment, unsupported YMYL advice, unclear data rights, private account dependency, or generic-AI-equivalent output",
    allowedOutput: "Stop, narrow, refund, or pivot to implementation if advice is the wrong product",
    blockedClaims: "Any paid roadmap confidence, scale recommendation, or subscription path",
    nextAction: "Name the blocker and record the condition needed to reopen the route"
  }
];

export const projectRouteFitMatrix = [
  {
    projectType: "AI automation service",
    strongestRouteWhen: "The buyer has a repeated manual workflow, can name the handoff pain, and the builder can show a before-after workflow",
    weakRouteWhen: "The buyer only wants vague AI adoption advice or private account takeover is required",
    firstAsset: "Workflow screenshot, scope page, intake checklist, and setup boundary",
    evidenceBeforePayment: "Qualified reply or paid pilot request plus safe access boundary"
  },
  {
    projectType: "Content or SEO site",
    strongestRouteWhen: "The topic has source-backed search intent, original tools or templates, and a maintainable update owner",
    weakRouteWhen: "Pages would repeat public advice, copy competitors, or rely only on third-party volume estimates",
    firstAsset: "Guide hub, source register, quality gate, and small route batch",
    evidenceBeforePayment: "GSC or Bing export, source-backed SERP review, or sample user action"
  },
  {
    projectType: "Micro tool or dashboard",
    strongestRouteWhen: "The user repeats a measurable task, manual proof exists, and support capacity is realistic",
    weakRouteWhen: "The task is rare, data rights are unclear, or maintenance cost exceeds expected price",
    firstAsset: "Free checker, sample output, event list, and upgrade boundary",
    evidenceBeforePayment: "Tool completion evidence, repeated requests, or confirmed setup budget"
  },
  {
    projectType: "Template or prompt pack",
    strongestRouteWhen: "The buyer repeats a narrow task and the pack includes domain constraints, examples, and rejection rules",
    weakRouteWhen: "Generic AI can create equivalent output from the same inputs",
    firstAsset: "Preview page, before-after examples, refund boundary, and usage limits",
    evidenceBeforePayment: "Sample usage, buyer reply, or low-risk payment test"
  },
  {
    projectType: "Directory or marketplace",
    strongestRouteWhen: "Owned or permitted data exists, entities have unique value, and supply can be seeded manually",
    weakRouteWhen: "Data is copied, stale, undifferentiated, or either marketplace side cannot be sourced manually",
    firstAsset: "Entity model, noindex rules, trust boundary, and manual seed list",
    evidenceBeforePayment: "Data-rights evidence plus buyer or supplier request proof"
  },
  {
    projectType: "Done-for-you implementation",
    strongestRouteWhen: "The buyer already has an offer and needs build/setup work more than a plan",
    weakRouteWhen: "The buyer wants broad strategy, guaranteed traffic, or an undefined product",
    firstAsset: "Before-after sample, revision limit, delivery checklist, and handoff plan",
    evidenceBeforePayment: "Confirmed implementation need plus capacity and scope boundary"
  }
];
