export type RouteResearchPrompt = {
  id: string;
  title: string;
  objective: string;
  useWhen: string;
  prompt: string;
  requiredOutput: string[];
  rejectionRules: string[];
};

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
