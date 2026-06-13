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
