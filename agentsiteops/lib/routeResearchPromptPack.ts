export type RouteResearchPrompt = {
  id: string;
  title: string;
  objective: string;
  useWhen: string;
  prompt: string;
  requiredOutput: string[];
  rejectionRules: string[];
};

export type ResearchDeliveryStage = {
  percent: number;
  title: string;
  window: string;
  visibleStatus: string;
  output: string;
};

export type ResearchAcceptanceGate = {
  title: string;
  passStandard: string;
  failAction: string;
};

export type ManualDeepResearchStep = {
  title: string;
  owner: string;
  costBoundary: string;
  instruction: string;
  output: string;
};

export type ManualResearchField = {
  id: string;
  label: string;
  helper: string;
  placeholder: string;
  defaultValue: string;
};

export type ResearchCoverageCheck = {
  id: string;
  label: string;
  keywords: string[];
  whyRequired: string;
  gapInstruction: string;
};

export const manualResearchFields: ManualResearchField[] = [
  {
    id: "projectName",
    label: "Project or site direction",
    helper: "Name the project, route, product, or website direction being tested.",
    placeholder: "Example: AgentSiteOps route planner for new AI projects",
    defaultValue: "AgentSiteOps route planner for internal and client project decisions"
  },
  {
    id: "projectType",
    label: "Possible project shape",
    helper: "List the shapes that should be compared before selecting one route.",
    placeholder: "Service, micro tool, template pack, guide cluster, dashboard, implementation service...",
    defaultValue:
      "Manual route-planning system, website opportunity scorer, AI crawler readiness checker, prompt-pack library, and fixed-scope launch blueprint service"
  },
  {
    id: "targetUser",
    label: "Target user and buyer",
    helper: "Describe the real user, budget owner, and urgency trigger.",
    placeholder: "Solo builders, small teams, agencies, operators, marketers...",
    defaultValue:
      "AI-capable solo builders and small operators who can build with AI but need a concrete route, proof asset, and first validation path before creating another site"
  },
  {
    id: "regionLanguage",
    label: "Region and language",
    helper: "State the language, market, and any regional payment or compliance constraints.",
    placeholder: "English-speaking global market, US/EU search demand, China-based operator constraints...",
    defaultValue:
      "English-language global web; China-based operator constraints; manual PayPal payment path; no Stripe dependency"
  },
  {
    id: "monetization",
    label: "Monetization hypothesis",
    helper: "State the paid path, free path, and what evidence would justify charging.",
    placeholder: "Free checker, $29 review, $99 blueprint, implementation upsell, no subscription yet...",
    defaultValue:
      "Free local tools and samples; low-ticket fit review; $99 manual launch blueprint only when the buyer has a concrete project and needs a route file; subscription is blocked until repeat-use evidence exists"
  },
  {
    id: "proofAssets",
    label: "Existing proof assets",
    helper: "List pages, samples, tools, analytics, buyer evidence, or files that can be inspected.",
    placeholder: "Current site URL, sample audit, GitHub repo, GSC/Bing data, reports, screenshots...",
    defaultValue:
      "agentsiteops.com, sample route file, route selection methodology, scorer, crawler readiness tool, evidence ledger, pricing page, PayPal manual payment path, GSC/Bing verification, IndexNow submissions"
  },
  {
    id: "dataSources",
    label: "Allowed research sources",
    helper: "Name the data sources the research can use and the sources that need caution.",
    placeholder: "Public competitor pages, docs, forums, GSC, Bing, Semrush export, customer interviews...",
    defaultValue:
      "Public search results, competitor service pages, official docs, GSC and Bing aggregate data, Semrush trial exports if available, GitHub public repos, user-provided project facts"
  },
  {
    id: "constraints",
    label: "Hard constraints and blocked claims",
    helper: "Name cost, legal, delivery, data, quality, and claim boundaries.",
    placeholder: "No API spend, no guaranteed rankings, no private scraping, no fake metrics...",
    defaultValue:
      "No OpenAI API cost for the free workflow; manual ChatGPT Deep Research only; no guaranteed traffic, ranking, AI citation, or revenue claims; no copied competitor data; no subscription claim without repeat-use evidence"
  },
  {
    id: "decisionNeed",
    label: "Decision needed from research",
    helper: "Define the exact output required before building or selling.",
    placeholder: "Proceed, pilot, pivot, stop; first proof asset; 7-day validation path...",
    defaultValue:
      "Decide whether AgentSiteOps should continue as a route-planning system, which first proof asset should be improved next, what alternatives should be rejected, and what evidence is required before asking for payment"
  }
];

export const researchCoverageChecks: ResearchCoverageCheck[] = [
  {
    id: "route-archetypes",
    label: "Route archetypes compared",
    keywords: ["archetype", "route", "alternative", "comparison", "reject"],
    whyRequired:
      "The route is not credible if it jumps directly to one answer without comparing plausible shapes.",
    gapInstruction:
      "Compare at least eight route archetypes and reject weak alternatives with evidence, delivery burden, generic-AI substitution risk, and stop rule."
  },
  {
    id: "buyer-problem",
    label: "Buyer problem in buyer language",
    keywords: ["buyer", "pain", "problem", "job", "trigger", "budget"],
    whyRequired:
      "A route map has no value if the buyer problem is invented internally.",
    gapInstruction:
      "Find direct buyer wording, urgency triggers, budget owner, problem severity, and what would make the buyer seek help now."
  },
  {
    id: "source-table",
    label: "Source table with dates",
    keywords: ["source", "citation", "date", "published", "evidence"],
    whyRequired:
      "The route cannot be audited if sources, dates, and evidence types are not visible.",
    gapInstruction:
      "Return a source table with source URL or name, publication/update date where visible, evidence type, and claim supported."
  },
  {
    id: "proof-asset",
    label: "First proof asset",
    keywords: ["proof asset", "sample", "demo", "checker", "template", "report"],
    whyRequired:
      "The project needs an inspectable asset before asking for trust or payment.",
    gapInstruction:
      "Select one first proof asset, explain what it proves, what it cannot prove, and the build checklist."
  },
  {
    id: "data-rights",
    label: "Data rights and source boundary",
    keywords: ["data rights", "terms", "license", "allowed", "attribution", "freshness"],
    whyRequired:
      "Data-heavy pages can become copied, stale, or risky without source rules.",
    gapInstruction:
      "Audit source rights, allowed use, blocked use, attribution, freshness cadence, and owner for updates."
  },
  {
    id: "pricing-fit",
    label: "Pricing and offer fit",
    keywords: ["pricing", "price", "offer", "payment", "refund", "scope"],
    whyRequired:
      "A paid route needs a value exchange, not just a checkout link.",
    gapInstruction:
      "Compare free diagnostic, low-ticket review, fixed-scope blueprint, implementation service, and subscription; state what evidence justifies payment."
  },
  {
    id: "validation-channel",
    label: "First validation channel",
    keywords: ["validation", "channel", "outreach", "search", "traffic", "signal"],
    whyRequired:
      "The plan needs a reachable path to evidence, not passive waiting for search discovery.",
    gapInstruction:
      "Select the first validation channel, first asset to show, counted signals, rejected vanity signals, and first 20 queries or prospects."
  },
  {
    id: "stop-rule",
    label: "Stop or pivot rule",
    keywords: ["stop", "pivot", "kill", "threshold", "blocked", "decision rule"],
    whyRequired:
      "The project must know when to stop instead of continuing because a page exists.",
    gapInstruction:
      "Define the proceed, pilot, pivot, stop, and blocked conditions for the next 7 to 14 days."
  },
  {
    id: "delivery-blueprint",
    label: "Delivery blueprint",
    keywords: ["blueprint", "7-day", "task", "owner", "deadline", "deliverable"],
    whyRequired:
      "Research must become an execution file that can guide the next build.",
    gapInstruction:
      "Convert the selected route into a 7-day task plan with owner, first asset, required page changes, evidence capture, and final decision."
  }
];

export const manualDeepResearchSteps: ManualDeepResearchStep[] = [
  {
    title: "Generate the research brief",
    owner: "AgentSiteOps",
    costBoundary: "No OpenAI API call",
    instruction:
      "Collect project facts, constraints, target user, available proof, data rights, payment boundary, and weak assumptions into one copy-ready prompt.",
    output: "One prompt pack plus a checklist of required report sections."
  },
  {
    title: "Run Deep Research in ChatGPT",
    owner: "User or operator",
    costBoundary: "Uses the user's ChatGPT Deep Research allowance",
    instruction:
      "Open ChatGPT, select Deep research, paste the AgentSiteOps prompt, choose public web, uploaded files, or specific sites, then let the report complete.",
    output: "A cited research report from ChatGPT, exported or copied back as text."
  },
  {
    title: "Check coverage",
    owner: "AgentSiteOps",
    costBoundary: "No OpenAI API call",
    instruction:
      "Compare the report against the acceptance gates: route archetypes, buyer problem, proof asset, evidence weighting, data rights, pricing, traffic entry, and delivery blueprint.",
    output: "Pass, blocked, or gap brief."
  },
  {
    title: "Run a second manual research pass if needed",
    owner: "User or operator",
    costBoundary: "Uses the user's ChatGPT Deep Research allowance only when required",
    instruction:
      "If the report misses a required module, paste the focused gap brief into a second Deep Research task instead of rerunning the whole prompt.",
    output: "Focused gap response covering only missing evidence, risks, comparisons, or pricing logic."
  },
  {
    title: "Fuse the route file",
    owner: "AgentSiteOps",
    costBoundary: "No OpenAI API call",
    instruction:
      "Merge the first report and gap response into one route map, rejecting unsupported claims and preserving alternatives that were not selected.",
    output: "Selected route, rejected alternatives, evidence ledger, first asset, 7-day plan, and stop rule."
  }
];

export const researchDeliveryStages: ResearchDeliveryStage[] = [
  {
    percent: 12,
    title: "Intake normalization",
    window: "5-10 min",
    visibleStatus: "Project facts are being converted into a research brief.",
    output: "Clean brief, hard constraints, unavailable claims, and missing inputs."
  },
  {
    percent: 34,
    title: "Manual Deep Research pass",
    window: "35-55 min",
    visibleStatus: "The copy-ready brief is run in ChatGPT Deep Research using the user's own allowance.",
    output: "Primary cited research report with source table and candidate route comparison."
  },
  {
    percent: 52,
    title: "Coverage gate",
    window: "10-15 min",
    visibleStatus: "The report is checked against the prompt pack and acceptance gates.",
    output: "Pass, second-pass required, or blocked decision with missing evidence list."
  },
  {
    percent: 72,
    title: "Second manual pass when needed",
    window: "45-70 min",
    visibleStatus: "Missing points are converted into a focused follow-up brief for a second manual Deep Research task.",
    output: "Gap response covering omitted route, evidence, risk, pricing, or validation details."
  },
  {
    percent: 88,
    title: "Synthesis",
    window: "15-25 min",
    visibleStatus: "The first pass and gap response are fused into one route file.",
    output: "Selected route, rejected alternatives, evidence ledger, first asset, 7-day plan, and stop rule."
  },
  {
    percent: 100,
    title: "Delivery review",
    window: "5-10 min",
    visibleStatus: "The route file is checked for unsupported claims before delivery.",
    output: "Client-ready route map with clear limits and next action."
  }
];

export const researchAcceptanceGates: ResearchAcceptanceGate[] = [
  {
    title: "Prompt coverage",
    passStandard:
      "The report answers route archetypes, buyer problem, proof asset, evidence weighting, data rights, pricing, traffic entry, and delivery blueprint.",
    failAction:
      "Create a gap brief naming the missing modules and run a focused second research pass."
  },
  {
    title: "Source and evidence quality",
    passStandard:
      "Claims are tied to dated sources, first-party evidence, or clearly marked inference; weak public context cannot raise route confidence.",
    failAction:
      "Downgrade the claim, mark it pending, or request more evidence before selecting the route."
  },
  {
    title: "Rejected alternatives",
    passStandard:
      "At least three plausible routes are rejected with concrete reasons, not merely ignored.",
    failAction:
      "Ask for a comparison rewrite focused only on rejected alternatives and failure rules."
  },
  {
    title: "Actionability",
    passStandard:
      "The final output names one first asset, one validation channel, one 7-day execution sequence, and one stop condition.",
    failAction:
      "Block delivery until the report becomes an execution file instead of a general research summary."
  }
];

export const routeResearchPrompts: RouteResearchPrompt[] = [
  {
    id: "project-route-archetypes",
    title: "Project Route Archetype Research",
    objective:
      "Map a new project idea to route archetypes before any website, UI, article, or checkout work begins.",
    useWhen:
      "Use this when a project has several possible shapes: service, micro tool, template pack, guide cluster, directory, comparison system, dashboard, plugin, course, marketplace, or implementation service.",
    prompt:
      "Research route archetypes for the project described below. Do not recommend one route until you compare at least eight possible archetypes. For each archetype, identify the buyer job, minimum evidence, first proof asset, delivery burden, data-rights risk, monetization fit, generic-AI substitution risk, and stop rule. Use public sources where applicable, but separate public market context from first-party proof. Return one selected route only if the evidence passes the stated threshold. Project: [paste project facts, target user, builder ability, available assets, data sources, constraints, weekly hours, and payment boundary].",
    requiredOutput: [
      "Route archetype comparison table",
      "Selected route plus rejected alternatives",
      "Minimum first asset before public launch",
      "Evidence still missing before paid claims",
      "Stop, pilot, or proceed decision"
    ],
    rejectionRules: [
      "Reject route choices based only on founder preference",
      "Reject routes that require private account access without a safety boundary",
      "Reject routes where generic AI can create the same useful output from the same inputs"
    ]
  },
  {
    id: "buyer-problem-evidence",
    title: "Buyer Problem Evidence Research",
    objective:
      "Confirm whether a route solves a buyer-recognized problem instead of an internally invented problem.",
    useWhen:
      "Use this before writing a landing page, pricing a service, or turning a route into a paid offer.",
    prompt:
      "Investigate whether the target buyer can name this problem in their own language. Look for public discussions, support questions, comparison pages, forum threads, product reviews, job descriptions, workflows, and service pages. Separate evidence types into direct buyer wording, indirect workflow evidence, competitor positioning, and weak assumptions. Do not treat search volume, sitemap success, or AI confidence as buyer proof. Project and buyer hypothesis: [paste].",
    requiredOutput: [
      "Buyer wording table with source, date, role, and pain phrase",
      "Problem severity ranking",
      "Buyer trigger that would make the problem urgent",
      "First outreach question to test the problem",
      "What evidence would be needed before asking for payment"
    ],
    rejectionRules: [
      "Reject broad segments like all founders or all AI users",
      "Reject demand claims without exact buyer language",
      "Reject payment assumptions when no budget owner or urgent trigger is visible"
    ]
  },
  {
    id: "proof-asset-design",
    title: "Proof Asset Design Research",
    objective:
      "Define the smallest public proof asset that makes a route inspectable before payment.",
    useWhen:
      "Use this when the project has claims but no visible sample, checker, report, template, before-after result, or source-backed comparison.",
    prompt:
      "Design the minimum proof asset for this route. Compare proof options including sample report, calculator, readiness checker, before-after artifact, source register, template preview, benchmark table, and demo workflow. For each option, estimate what it proves, what it does not prove, build time, maintenance burden, buyer trust impact, and whether it can be inspected without account creation. Route: [paste route]. Existing assets: [paste].",
    requiredOutput: [
      "Proof asset options table",
      "One recommended proof asset",
      "Claims the asset is allowed to support",
      "Claims the asset cannot support",
      "Build checklist for the first asset"
    ],
    rejectionRules: [
      "Reject proof assets that only look polished but do not reduce buyer uncertainty",
      "Reject fake dashboards, fake metrics, or unverified case studies",
      "Reject assets that require sensitive user data before trust exists"
    ]
  },
  {
    id: "evidence-weighting",
    title: "Evidence Weighting and Confidence Research",
    objective:
      "Turn messy project facts into confidence levels without random 0-100 scoring.",
    useWhen:
      "Use this after collecting source notes, buyer wording, sample usage, search exports, analytics events, or payment signals.",
    prompt:
      "Audit the evidence set for this route. Classify every signal as verified, pending, inferred, stale, blocked, or not claimed. Weight first-party buyer, payment, search, analytics, delivered artifact, and usage evidence above public market context. Identify contradictions and missing evidence. Then assign a confidence band: High, Medium, Low, or Reject. Do not raise confidence because the narrative sounds plausible. Evidence set: [paste evidence ledger].",
    requiredOutput: [
      "Evidence ledger with status and source",
      "Confidence band with reason",
      "Claims allowed at this band",
      "Claims blocked at this band",
      "Next evidence required to raise confidence"
    ],
    rejectionRules: [
      "Reject confidence upgrades based on page existence or internal links",
      "Reject AI traffic, ranking, or revenue claims without first-party evidence",
      "Reject stale or unsourced public claims"
    ]
  },
  {
    id: "data-rights-and-source-governance",
    title: "Data Rights and Source Governance Research",
    objective:
      "Prevent data-heavy routes from becoming copied, stale, illegal, or impossible to maintain.",
    useWhen:
      "Use this for directories, comparison pages, reports, dashboards, benchmarks, templates that cite examples, or content clusters that depend on public sources.",
    prompt:
      "Review the data and source rights for this route. Identify owned data, public sources, permitted APIs, export permissions, terms constraints, freshness requirements, citation needs, and update owner. For every planned page or asset, state whether the source can be used, summarized, cited, transformed, or must be excluded. Data/source plan: [paste].",
    requiredOutput: [
      "Source register",
      "Allowed and blocked use cases",
      "Freshness and update schedule",
      "Citation or attribution plan",
      "Noindex or stop rule for weak data pages"
    ],
    rejectionRules: [
      "Reject copied data without rights or transformation",
      "Reject programmatic pages with no unique value field",
      "Reject source plans without an owner and update rhythm"
    ]
  },
  {
    id: "pricing-and-offer-fit",
    title: "Pricing and Offer Fit Research",
    objective:
      "Determine whether the route should be free, low-ticket, manual service, implementation, subscription, or blocked.",
    useWhen:
      "Use this before adding checkout, raising price, creating subscription claims, or treating a one-time route file as recurring value.",
    prompt:
      "Research monetization fit for this route. Compare free diagnostic, paid template, fixed-scope review, manual blueprint, implementation service, dashboard subscription, and consulting. Use comparable offers only as price context, not proof of demand. Identify what buyer outcome would justify payment, what would make the offer not worth buying, and what evidence is needed before checkout. Route and deliverable: [paste].",
    requiredOutput: [
      "Offer-shape comparison table",
      "Price test range and reason",
      "Buyer value exchange statement",
      "Pre-payment qualification rules",
      "Refund, scope, and no-guarantee boundary"
    ],
    rejectionRules: [
      "Reject subscription before repeat usage or recurring demand evidence",
      "Reject high pricing when deliverable is generic advice",
      "Reject payment flow if scope, refund, privacy, or delivery boundary is incomplete"
    ]
  },
  {
    id: "traffic-entry-and-validation",
    title: "Traffic Entry and Validation Research",
    objective:
      "Choose the first reachable validation channel without pretending visibility equals demand.",
    useWhen:
      "Use this before publishing a content batch, outreach campaign, GitHub release, social post, or search-oriented page set.",
    prompt:
      "Find the first validation channel for this route. Compare search pages, GitHub discovery, manual outreach, community feedback, partner links, source-link outreach, AI-readable pages, and existing audience channels. For each channel, define the page or asset to show, the signal that counts, the signal that does not count, the first 20 prospects or queries, and the stop condition. Route and current assets: [paste].",
    requiredOutput: [
      "Channel comparison table",
      "First channel and first asset",
      "Signals that count as real evidence",
      "Signals that must not be counted",
      "7-day validation plan"
    ],
    rejectionRules: [
      "Reject internal links as demand proof",
      "Reject search-result appearance as buyer intent without click or query data",
      "Reject traffic that does not reach the target buyer or decision owner"
    ]
  },
  {
    id: "route-delivery-blueprint",
    title: "Route Delivery Blueprint Research",
    objective:
      "Turn the selected route into a concrete execution file we can use internally before selling it externally.",
    useWhen:
      "Use this after a route has enough evidence to create a first asset or manual delivery package.",
    prompt:
      "Create a delivery blueprint for this selected route. The output must include selected route, rejected alternatives, evidence ledger, proof asset, page structure, first traffic channel, 7-day task plan, delivery capacity, risks, stop rule, and what must be learned before scaling. Do not include generic advice or unsupported growth promises. Selected route and evidence: [paste].",
    requiredOutput: [
      "One-page route file",
      "Rejected alternatives and reasons",
      "First asset build plan",
      "7-day execution sequence",
      "Scale or stop decision rule"
    ],
    rejectionRules: [
      "Reject route files that do not include rejected alternatives",
      "Reject plans without owner, deadline, and stop condition",
      "Reject claims of authority that are not tied to the evidence ledger"
    ]
  }
];

export const routeResearchProtocol = [
  "Start with project facts, not desired website shape.",
  "Compare routes before selecting one route.",
  "Separate public context from first-party proof.",
  "Name what would make the route wrong.",
  "Record rejected paths so the recommendation can be audited later.",
  "Turn every research result into one rule, one first asset, and one stop condition."
];

export function buildManualDeepResearchPrompt(fields: Record<string, string>) {
  const value = (id: string) => fields[id]?.trim() || "[not provided]";

  return `Run a deep research route audit for this project. The goal is not to write marketing copy. The goal is to decide whether this project direction should proceed, pilot, pivot, stop, or stay blocked before more website, UI, checkout, or content work is built.

PROJECT FACTS
- Project or direction: ${value("projectName")}
- Possible project shape: ${value("projectType")}
- Target user and buyer: ${value("targetUser")}
- Region and language: ${value("regionLanguage")}
- Monetization hypothesis: ${value("monetization")}
- Existing proof assets: ${value("proofAssets")}
- Allowed research sources: ${value("dataSources")}
- Hard constraints and blocked claims: ${value("constraints")}
- Decision needed: ${value("decisionNeed")}

RESEARCH TASK
1. Compare at least eight route archetypes before selecting one route.
2. Identify buyer problem evidence in the buyer's own language where possible.
3. Separate public market context from first-party proof and clearly mark inference.
4. Design the smallest inspectable proof asset needed before payment or wider promotion.
5. Audit data rights, source freshness, citation needs, and maintenance burden.
6. Compare monetization shapes: free diagnostic, low-ticket review, manual blueprint, implementation service, template pack, and subscription. Block subscription if repeat-use evidence is absent.
7. Choose the first reachable validation channel and define what counts as real evidence.
8. Produce a stop, pivot, pilot, proceed, or blocked decision with reasons.

REQUIRED OUTPUT
- Source table with source, date if visible, evidence type, and claim supported.
- Route archetype comparison table.
- Input-to-route decision matrix showing how buyer problem, proof asset, delivery capacity, data rights, monetization fit, search evidence, AI visibility evidence, implementation need, and generic-AI substitution risk changed the route.
- Selected route and at least three rejected alternatives.
- Buyer problem evidence and confidence level.
- First proof asset, what it proves, and what it cannot prove.
- Data rights and source-governance notes.
- Pricing and offer-fit recommendation.
- First validation channel and first asset to show.
- 7-day execution plan with owner, task, artifact, and expected evidence.
- Stop or pivot rule.
- Final delivery acceptance checklist: supported claims, blocked claims, missing evidence, and the next evidence required to raise confidence.

REJECT THE RECOMMENDATION IF
- It relies on generic optimism, internal preference, or page existence.
- It treats IndexNow, sitemap success, or search-result visibility as buyer demand.
- It claims traffic, ranking, AI citation, or revenue without first-party evidence.
- It recommends subscription without repeat-use evidence.
- It fails to name rejected alternatives.`;
}

export function buildGapResearchPrompt(
  fields: Record<string, string>,
  missingChecks: ResearchCoverageCheck[]
) {
  const projectName = fields.projectName?.trim() || "[project not provided]";
  const gaps = missingChecks.length
    ? missingChecks.map((check, index) => `${index + 1}. ${check.gapInstruction}`).join("\n")
    : "No required gap detected. Do not run a second pass unless a human reviewer finds a material omission.";

  return `Run a focused second-pass deep research task for ${projectName}. Do not repeat the full report. Only repair the missing modules below.

MISSING MODULES
${gaps}

OUTPUT FORMAT
- Missing module repaired.
- New sources or evidence used.
- Confidence impact.
- Whether this changes the selected route.
- Whether the final route file can now be delivered.

BOUNDARY
Do not introduce new growth, ranking, traffic, AI citation, or revenue claims unless the evidence directly supports them.`;
}

export function buildRouteSynthesisTemplate(
  fields: Record<string, string>,
  missingChecks: ResearchCoverageCheck[]
) {
  const status =
    missingChecks.length === 0
      ? "Ready for synthesis if the pasted report is source-backed."
      : `Blocked from final delivery until ${missingChecks.length} gap item(s) are repaired.`;

  return `# Route File Synthesis

## Project
${fields.projectName?.trim() || "[project not provided]"}

## Current Synthesis Status
${status}

## Selected Route
[Name the route only after the report compares alternatives.]

## Route Decision Matrix
| Input dimension | Evidence used | Route effect | Confidence effect | Missing or weak evidence |
| --- | --- | --- | --- | --- |
| Buyer problem | [buyer wording or source] | [effect on route] | high/medium/low/reject | [gap] |
| Proof asset | [sample, demo, checker, report, or template] | [effect on route] | high/medium/low/reject | [gap] |
| Delivery capacity | [hours, skill, workflow, support boundary] | [effect on route] | high/medium/low/reject | [gap] |
| Data rights | [owned, public, permitted API, export, or blocked source] | [effect on route] | high/medium/low/reject | [gap] |
| Monetization fit | [payment, budget signal, comparable price, or blocked claim] | [effect on route] | high/medium/low/reject | [gap] |
| Search evidence | [GSC, Bing, query, SERP review, or pending] | [effect on route] | high/medium/low/reject | [gap] |
| AI visibility evidence | [AI referral, crawler log, cited URL, or pending] | [effect on route] | high/medium/low/reject | [gap] |
| Implementation need | [plan needed vs build needed] | [effect on route] | high/medium/low/reject | [gap] |
| Generic AI substitute | [why this is or is not stronger than a generic prompt] | [effect on route] | high/medium/low/reject | [gap] |

## Rejected Alternatives
1. [Alternative]
   - Rejection reason:
   - Evidence:
2. [Alternative]
   - Rejection reason:
   - Evidence:
3. [Alternative]
   - Rejection reason:
   - Evidence:

## Evidence Ledger
| Claim | Evidence | Source | Status | Confidence impact |
| --- | --- | --- | --- | --- |
| [claim] | [evidence] | [source/date] | verified/pending/inferred/stale/blocked | [impact] |

## First Proof Asset
- Asset:
- What it proves:
- What it cannot prove:
- Build checklist:

## Pricing Boundary
- Free path:
- Paid path:
- What must be true before payment:
- Refund or no-go condition:
- Why this is not generic AI advice:

## First Validation Channel
- Channel:
- First asset to show:
- Signals that count:
- Signals that do not count:

## 7-Day Execution Plan
| Day | Task | Artifact | Evidence expected |
| --- | --- | --- | --- |
| 1 | [task] | [artifact] | [evidence] |
| 2 | [task] | [artifact] | [evidence] |
| 3 | [task] | [artifact] | [evidence] |
| 4 | [task] | [artifact] | [evidence] |
| 5 | [task] | [artifact] | [evidence] |
| 6 | [task] | [artifact] | [evidence] |
| 7 | [decision] | [report] | [proceed/pilot/pivot/stop] |

## Stop or Pivot Rule
[State the exact threshold that stops the project or changes the route.]

## Delivery Acceptance Checklist
- [ ] Selected route is tied to evidence, not preference.
- [ ] At least three alternatives were rejected with reasons.
- [ ] Source table includes dates where visible and marks inference.
- [ ] Claims that cannot be supported are explicitly blocked.
- [ ] First proof asset can be built before broader content, UI, or checkout work.
- [ ] Payment, subscription, traffic, ranking, AI citation, and revenue claims stay inside the evidence boundary.
- [ ] The route names the next evidence required to raise confidence.`;
}
