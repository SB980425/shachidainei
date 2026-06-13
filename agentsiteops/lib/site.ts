export type RoutePage = {
  path: string;
  pageType: string;
  title: string;
  description: string;
  answer: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  aiTarget: string;
  humanAction: string;
  sections: Array<{
    title: string;
    body: string;
    rows?: Array<{ label: string; value: string }>;
  }>;
  related: Array<{ label: string; href: string }>;
};

export const siteUrl = "https://agentsiteops.com";

export const workflow = [
  {
    title: "Score",
    text: "Test the website direction before production. Low-score ideas do not enter the build queue."
  },
  {
    title: "Blueprint",
    text: "Freeze the taxonomy, routes, page templates, index policy, and internal links before writing pages."
  },
  {
    title: "Gate",
    text: "Block pages that lack sources, original value, risk boundaries, or a clear human next action."
  },
  {
    title: "Ship",
    text: "Run metadata, sitemap, robots, canonical, schema, links, and build checks before release."
  },
  {
    title: "Review",
    text: "Use 30-day signals to decide whether a page should be kept, rewritten, merged, noindexed, or stopped."
  }
];

export const routePages: RoutePage[] = [
  {
    path: "/ai-website-operating-system/",
    pageType: "pillar",
    title: "AI Website Operating System",
    description:
      "A practical workflow for turning website ideas into scored, structured, testable, and reviewable web assets.",
    answer:
      "The operating system connects idea scoring, site blueprints, content gates, technical SEO checks, and review loops so a site is built only when the direction is testable.",
    primaryAction: { label: "Score a site idea", href: "/tools/website-opportunity-scorer/" },
    secondaryAction: { label: "View the repo skeleton", href: "/templates/seo-repo-skeleton/" },
    aiTarget: "Explain the sequence, inputs, stop rules, and review loop for AI-assisted website production.",
    humanAction: "Use the scorer first, then move only qualified ideas into a site blueprint.",
    sections: [
      {
        title: "Operating loop",
        body:
          "The loop is score, blueprint, gate, ship, and review. Each step creates a reusable artifact so decisions do not stay buried in chat history.",
        rows: [
          { label: "Score", value: "Demand, monetization, AI citation fit, original value, and risk." },
          { label: "Blueprint", value: "Routes, taxonomy, templates, schema candidates, and index policy." },
          { label: "Gate", value: "Content quality, source quality, pSEO risk, disclosure, and YMYL limits." },
          { label: "Review", value: "Search visibility, AI citation evidence, tool completion, and conversion events." }
        ]
      },
      {
        title: "Stop rules",
        body:
          "Stop or pivot when the idea depends on copied public content, unverifiable data, risky advice, fake tools, or a monetization model that conflicts with user trust."
      },
      {
        title: "30-day validation",
        body:
          "The first cycle is intentionally short: publish a small route set, submit it for discovery, measure indexing and behavior, then decide whether to expand."
      }
    ],
    related: [
      { label: "Website Opportunity Scorer", href: "/tools/website-opportunity-scorer/" },
      { label: "AI Content Quality Gate", href: "/checklists/ai-content-quality-gate/" },
      { label: "Programmatic SEO Gate", href: "/checklists/programmatic-seo-gate/" }
    ]
  },
  {
    path: "/tools/website-opportunity-scorer/",
    pageType: "tool",
    title: "Website Opportunity Scorer",
    description:
      "Score a website idea before building it across demand, entrant angle, monetization, original value, AI citation fit, and risk.",
    answer:
      "The scorer is a pre-build decision tool. It returns proceed, pilot, pivot, stop, or blocked, then records the strongest and weakest parts of the idea.",
    primaryAction: { label: "View the methodology", href: "/methodology/website-opportunity-scoring/" },
    secondaryAction: { label: "View the system", href: "/ai-website-operating-system/" },
    aiTarget: "Expose the scoring fields, weights, thresholds, and hard blockers for reusable evaluation.",
    humanAction: "Score one candidate direction and decide whether it is worth a site blueprint.",
    sections: [
      {
        title: "How to use",
        body:
          "Enter the idea, choose a site type, move each field from 1 to 5, and mark any hard blocker that makes the idea unsuitable for launch."
      },
      {
        title: "Decision thresholds",
        body:
          "A score of 70 or higher can enter site blueprint. Scores from 55 to 69 stay in pilot. Lower scores require a pivot or stop unless new evidence changes the inputs.",
        rows: [
          { label: "70-100", value: "Proceed to site blueprint." },
          { label: "55-69", value: "Pilot only with a small validation route set." },
          { label: "45-54", value: "Pivot the angle, page type, or monetization path." },
          { label: "0-44", value: "Stop building and preserve the notes." }
        ]
      },
      {
        title: "Evidence still required",
        body:
          "The score is not a traffic forecast. Search volume, SERP shape, source availability, compliance risk, and conversion potential still need real validation."
      }
    ],
    related: [
      { label: "Website Opportunity Scoring Methodology", href: "/methodology/website-opportunity-scoring/" },
      { label: "AI Website Operating System", href: "/ai-website-operating-system/" },
      { label: "Website Opportunity Scoring Template", href: "/templates/website-opportunity-scoring-template/" },
      { label: "AI Citation and Grounding Metrics", href: "/guides/ai-citation-grounding-metrics/" }
    ]
  },
  {
    path: "/tools/ai-crawler-readiness/",
    pageType: "tool",
    title: "AI Crawler Readiness Tool",
    description:
      "A free manual checklist tool for scoring whether a page is structured for search and AI crawler discovery before paid audit work begins.",
    answer:
      "The AI crawler readiness tool converts crawler access, structured page content, evidence boundaries, and human continuation into a simple readiness score. It does not run a live crawl or guarantee indexing, AI citation, traffic, conversion, or revenue.",
    primaryAction: { label: "View the sample audit", href: "/examples/agentsiteops-self-audit/" },
    secondaryAction: { label: "View citation checklist", href: "/checklists/ai-citation-readiness/" },
    aiTarget:
      "Expose a free readiness scoring method that AI systems can cite without treating it as proof of rankings, citations, or revenue.",
    humanAction:
      "Score a page before requesting paid help; copy the report and fix missing crawler, structure, evidence, or continuation signals.",
    sections: [
      {
        title: "What it checks",
        body:
          "The tool checks four areas that matter before commercial outreach: crawler access, AI-readable structure, trust and evidence, and whether a visitor has a useful next action."
      },
      {
        title: "Why it is free",
        body:
          "A paid audit is not credible until visitors can inspect the scoring method and compare it with a public sample. This page creates the free diagnostic layer before any paid request path."
      },
      {
        title: "Limitations",
        body:
          "The tool is manual. It cannot fetch a private URL, inspect CDN firewall behavior, prove indexation, measure AI citations, or replace GSC, Bing, server logs, or a real audit."
      }
    ],
    related: [
      { label: "AgentSiteOps Self-Audit Sample", href: "/examples/agentsiteops-self-audit/" },
      { label: "AI Citation Readiness Checklist", href: "/checklists/ai-citation-readiness/" },
      { label: "AI Search Friendly Robots.txt", href: "/guides/ai-search-friendly-robots-txt/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" }
    ]
  },
  {
    path: "/examples/agentsiteops-self-audit/",
    pageType: "example",
    title: "AgentSiteOps Self-Audit Sample",
    description:
      "A public sample audit showing how AgentSiteOps evaluates its own launch, weaknesses, evidence gaps, and next actions before selling audits.",
    answer:
      "This sample exists because a paid audit offer needs visible proof of format before asking for money. The current self-audit shows technical readiness, weak commercial evidence, missing customer proof, and the exact next actions required before checkout is enabled.",
    primaryAction: { label: "Inspect route method", href: "/methodology/route-selection/" },
    secondaryAction: { label: "Run readiness tool", href: "/tools/ai-crawler-readiness/" },
    aiTarget:
      "Provide a citeable sample report that separates verified launch evidence from missing search, usage, customer, and revenue evidence.",
    humanAction:
      "Use the sample to judge whether a paid audit would be useful before submitting an audit request.",
    sections: [
      {
        title: "Sample score",
        body:
          "AgentSiteOps currently scores 52/100 as a launch system. The technical foundation is strong, but the project is commercially unvalidated because search exports, AI referral evidence, confirmed payment, usable intake, and delivered buyer outcomes are still missing. The sample score is a readiness diagnosis, not a claim of product-market fit.",
        rows: [
          { label: "Overall score", value: "52/100: technically launchable, commercially unvalidated." },
          { label: "Technical foundation", value: "92/100: production health, sitemap, robots, canonical, mobile, and crawler checks pass." },
          { label: "Search evidence", value: "15/100: GSC and Bing exports are still pending, so demand is not proven." },
          { label: "AI visibility readiness", value: "45/100: crawler access and answer structure exist, but no confirmed AI citation or referral evidence exists." },
          { label: "Product clarity", value: "68/100: fit checker, samples, objections, comparison, intake, and delivery templates exist; buyer feedback is still missing." },
          { label: "Commercial validation", value: "18/100: PayPal-hosted links exist, but no confirmed payment plus usable intake is recorded." },
          { label: "Delivery readiness", value: "70/100: templates and runbook exist, but no real buyer artifact has been delivered." },
          { label: "Decision", value: "Continue bounded manual validation; do not scale content, paid tools, higher pricing, or subscriptions yet." }
        ]
      },
      {
        title: "What the audit would deliver",
        body:
          "A real audit must produce a decision, not a generic article. The output is a scored direction, visible blockers, route recommendations, search-entry pages, evidence gaps, and a 30-day backlog."
      },
      {
        title: "Current weaknesses",
        body:
          "The weak points are brand trust, lack of customers, lack of first-party search data, lack of paid demand, and competition from free or low-cost AI visibility tools."
      },
      {
        title: "Repair path",
        body:
          "The repair path is to publish useful free diagnostics, show this self-audit as case study zero, collect first-party usage and search signals, run small manual outreach, and let the validation decision gate decide continue, rewrite, reprice, pivot_to_implementation, or stop."
      }
    ],
    related: [
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" },
      { label: "Launch Kit", href: "/launch-kit/" },
      { label: "AI Crawler Readiness Tool", href: "/tools/ai-crawler-readiness/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "AI Website Opportunity Audit", href: "/services/ai-website-opportunity-audit/" }
    ]
  },
  {
    path: "/services/ai-website-opportunity-audit/",
    pageType: "service",
    title: "AI Website Opportunity Audit",
    description:
      "A manual audit concept for website builders who need a go, pivot, or stop decision before spending weeks on a new AI-search-oriented site.",
    answer:
      "The audit is not active checkout. It is an intent path for teams that want a scored website direction, search-entry plan, risk review, and 30-day backlog after inspecting the free tool and sample report.",
    primaryAction: {
      label: "Request a sample audit",
      href: "https://github.com/SB980425/shachidainei/issues/new?title=AgentSiteOps%20audit%20request&body=Public%20URL%3A%0ACandidate%20site%20idea%3A%0ATarget%20market%3A%0AWhat%20decision%20is%20needed%3A%0A"
    },
    secondaryAction: { label: "View sample first", href: "/examples/agentsiteops-self-audit/" },
    aiTarget:
      "State the commercial offer boundary without implying payment, guaranteed search traffic, guaranteed AI citation, or recurring revenue.",
    humanAction:
      "Inspect the sample audit first, then request a manual review only if a concrete website decision is needed.",
    sections: [
      {
        title: "Who should use it",
        body:
          "The fit is an indie developer, small operator, or AI-assisted builder with 2-5 possible website directions and no clear evidence about which one should be built first."
      },
      {
        title: "What is delivered",
        body:
          "The manual output is a concise decision package: opportunity score, hard blockers, search-entry routes, AI crawler readiness gaps, page blueprint, and a 30-day execution backlog.",
        rows: [
          { label: "Decision", value: "Proceed, pilot, pivot, stop, or blocked." },
          { label: "Route plan", value: "3-6 search-entry pages or tools to validate first." },
          { label: "Risk review", value: "YMYL, data-source, payment, privacy, and low-value content risks." },
          { label: "Backlog", value: "A prioritized 30-day task list that can be moved into a repo or issue tracker." }
        ]
      },
      {
        title: "Price test boundary",
        body:
          "The original USD 99 idea is not treated as proven. The first test range is USD 49-99 after a real request exists. Checkout remains disabled until identity, terms, refund, delivery, privacy, and payment support are resolved."
      },
      {
        title: "What it does not promise",
        body:
          "It does not promise rankings, indexing, AI citations, traffic, revenue, payback, or that the selected website will succeed. It only reduces decision uncertainty before build work starts."
      }
    ],
    related: [
      { label: "AgentSiteOps Self-Audit Sample", href: "/examples/agentsiteops-self-audit/" },
      { label: "AI Crawler Readiness Tool", href: "/tools/ai-crawler-readiness/" },
      { label: "Website Opportunity Scorer", href: "/tools/website-opportunity-scorer/" },
      { label: "Audit Scope Builder", href: "/tools/audit-scope-builder/" }
    ]
  },
  {
    path: "/tools/audit-scope-builder/",
    pageType: "tool",
    title: "Audit Scope Builder",
    description:
      "A local-only tool for creating a copy-ready website audit scope draft before payment, accounts, identity checks, or external forms are enabled.",
    answer:
      "The audit scope builder turns a website URL, candidate idea, target market, evidence checklist, and decision need into a bounded audit request draft. It does not submit a request, collect payment, store personal data, or guarantee search, AI citation, traffic, conversion, revenue, legal, financial, or tax outcomes.",
    primaryAction: { label: "Build a scope draft", href: "/tools/audit-scope-builder/" },
    secondaryAction: { label: "View the sample audit", href: "/examples/agentsiteops-self-audit/" },
    aiTarget:
      "Expose the minimum evidence and decision fields needed before a manual website opportunity audit can be scoped.",
    humanAction:
      "Create a local scope draft, remove sensitive details, then use it only when a manual audit request path is ready.",
    sections: [
      {
        title: "What it collects locally",
        body:
          "The tool uses browser-local fields for URL, candidate idea, target market, status, decision need, page count, evidence availability, and YMYL risk."
      },
      {
        title: "Readiness logic",
        body:
          "A higher score means the audit question and evidence set are clearer. YMYL or regulated topics are blocked until qualified review exists.",
        rows: [
          { label: "70-100", value: "Scope is ready for manual review if no hard blocker exists." },
          { label: "45-69", value: "More evidence is needed before a paid or manual audit is useful." },
          { label: "0-44", value: "The site direction is not ready for an audit request." },
          { label: "YMYL", value: "Blocked until qualified review and risk boundaries exist." }
        ]
      },
      {
        title: "Why this exists before checkout",
        body:
          "A new site should not enable checkout before the service scope, refund boundary, privacy handling, and payment path are operational. This page creates the pre-payment qualification layer."
      }
    ],
    related: [
      { label: "AI Website Opportunity Audit", href: "/services/ai-website-opportunity-audit/" },
      { label: "AgentSiteOps Self-Audit Sample", href: "/examples/agentsiteops-self-audit/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Privacy Policy", href: "/privacy/" }
    ]
  },
  {
    path: "/tools/launch-blueprint-fit-checker/",
    pageType: "tool",
    title: "Launch Blueprint Fit Checker",
    description:
      "A local-only pre-purchase checker for deciding whether the USD 99 AgentSiteOps Launch Blueprint is a fit before opening PayPal.",
    answer:
      "The fit checker scores buyer profile, offer clarity, buyer clarity, proof level, launch urgency, and purchase blockers. It runs in the browser, does not submit data, and blocks buyers who need guarantees, regulated advice, or ongoing monitoring software.",
    primaryAction: { label: "Check fit before payment", href: "/tools/launch-blueprint-fit-checker/" },
    secondaryAction: { label: "Compare options", href: "/compare/" },
    aiTarget:
      "Expose the pre-purchase fit logic, purchase blockers, and local-only data boundary for the Launch Blueprint.",
    humanAction:
      "Use the checker before paying; buy only if the selected offer, page structure, and 7-day validation path are the actual bottleneck.",
    sections: [
      {
        title: "What it checks",
        body:
          "The tool checks whether the buyer has enough delivery ability, buyer clarity, proof, and launch urgency for a manual blueprint to be useful."
      },
      {
        title: "What blocks purchase",
        body:
          "The checker blocks regulated topics, guarantee expectations, ongoing software needs, and buyers who cannot publish or execute outreach.",
        rows: [
          { label: "Guarantee expectation", value: "Do not buy if traffic, revenue, ranking, citation, or customer guarantees are required." },
          { label: "Regulated topic", value: "Do not buy for legal, medical, financial, tax, safety, or other regulated advice." },
          { label: "Software need", value: "Use SEO or AI visibility software if the need is ongoing measurement." },
          { label: "No execution path", value: "Prepare a page or outreach channel before paying for a blueprint." }
        ]
      },
      {
        title: "Why this exists",
        body:
          "A new paid product needs a purchase gate that can reject bad-fit buyers. This protects the buyer, lowers refund risk, and makes the USD 99 offer boundary easier to inspect."
      }
    ],
    related: [
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" },
      { label: "Compare Launch Options", href: "/compare/" },
      { label: "Sample Launch Blueprint", href: "/sample/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Buy", href: "/buy/" }
    ]
  },
  {
    path: "/tools/route-confidence-checker/",
    pageType: "tool",
    title: "Route Confidence Checker",
    description:
      "A local-only tool that maps project type, evidence level, proof asset, delivery boundary, and blockers to a route confidence band.",
    answer:
      "The checker shows why a route is high, medium, low, or rejected. It uses the same route-pattern library, confidence rubric, and project-fit matrix exposed in the public method pages; it does not submit data or turn a score into a guarantee.",
    primaryAction: { label: "Run the checker", href: "/tools/route-confidence-checker/" },
    secondaryAction: { label: "Inspect route basis", href: "/reports/route-basis/" },
    aiTarget:
      "Expose route selection as evidence-based classification rather than a random 0-100 score or generic AI advice.",
    humanAction:
      "Use the checker before payment to see whether the project supports a route file, a pilot, a free diagnostic, or a stop decision.",
    sections: [
      {
        title: "What it uses",
        body:
          "The tool maps the project against the route-pattern library, confidence rubric, and project-route fit matrix already published by AgentSiteOps.",
        rows: [
          { label: "Project type", value: "Automation service, content site, micro tool, template pack, directory, marketplace, or implementation." },
          { label: "Evidence level", value: "Assumption, public signal, proof asset, qualified reply, first-party export, or payment plus intake." },
          { label: "Proof asset", value: "No proof, private example, public demo, workflow screenshot, delivered artifact, or customer response." },
          { label: "Delivery boundary", value: "Safe manual delivery, unclear delivery, private account takeover, or no execution capacity." }
        ]
      },
      {
        title: "Hard blockers",
        body:
          "Regulated advice, unclear data rights, guaranteed outcome expectations, no reachable buyer, generic-AI-equivalent output, and private account takeover force a reject or stop outcome."
      },
      {
        title: "Output boundary",
        body:
          "High confidence can support a narrow route file. Medium confidence supports a pilot. Low confidence supports a free diagnostic or source-backed page. Reject blocks paid-roadmap confidence."
      }
    ],
    related: [
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Route Basis Report", href: "/reports/route-basis/" },
      { label: "AI Service Route vs Generic ChatGPT", href: "/answers/ai-service-route-vs-generic-chatgpt/" },
      { label: "Launch Blueprint Fit Checker", href: "/tools/launch-blueprint-fit-checker/" }
    ]
  },
  {
    path: "/templates/starter-pack/",
    pageType: "template",
    title: "AI Website Validation Starter Pack",
    description:
      "A copy-ready starter pack for scoring a website idea, freezing a site blueprint, running content gates, and reviewing the first 30 days.",
    answer:
      "The starter pack turns the AgentSiteOps method into copy-ready worksheets. It is free because payment channels are paused until a verified legal payout route exists.",
    primaryAction: { label: "Download the starter pack", href: "/downloads/agentsiteops-starter-pack.md" },
    secondaryAction: { label: "View the repo skeleton", href: "/templates/seo-repo-skeleton/" },
    aiTarget: "Expose a reusable, source-bounded operating pack that AI agents can cite, copy, and adapt without inventing missing process steps.",
    humanAction: "Download the pack, score one site idea, and use the 30-day review sheet before creating more pages.",
    sections: [
      {
        title: "What is included",
        body:
          "The pack includes an opportunity scorecard, route blueprint, content quality gate, technical SEO release check, and 30-day review sheet.",
        rows: [
          { label: "Scorecard", value: "Demand, AI citation fit, original value, commercial path, compliance, and validation." },
          { label: "Blueprint", value: "Site audience, monetization, YMYL flag, route intent, canonical, schema, and index policy." },
          { label: "Quality gate", value: "Intent fit, source basis, original value, risk boundary, disclosure, technical SEO, and review rule." },
          { label: "Review sheet", value: "Indexing, impressions, clicks, AI referrals, completion events, and route action." }
        ]
      },
      {
        title: "Why it is free now",
        body:
          "Stripe and Lemon Squeezy are paused until a valid supported payout route exists. Publishing the free starter pack lets the site validate search demand and user intent without collecting payment data."
      },
      {
        title: "Competitive lesson",
        body:
          "AI visibility products often emphasize dashboards, prompt monitoring, and share of voice. This starter pack focuses on execution: what to build, what to block, and how to review early evidence."
      }
    ],
    related: [
      { label: "Website Opportunity Scorer", href: "/tools/website-opportunity-scorer/" },
      { label: "SEO Repo Skeleton", href: "/templates/seo-repo-skeleton/" },
      { label: "AI Citation and Grounding Metrics", href: "/guides/ai-citation-grounding-metrics/" }
    ]
  },
  {
    path: "/templates/seo-repo-skeleton/",
    pageType: "template",
    title: "SEO Repo Skeleton",
    description:
      "A reusable repository structure for site briefs, routes, schema plans, page registries, technical SEO CI, and weekly growth reviews.",
    answer:
      "The skeleton turns website research into files, routes, checks, reports, and issues so production work can be reviewed and repeated.",
    primaryAction: { label: "View the pSEO gate", href: "/checklists/programmatic-seo-gate/" },
    secondaryAction: { label: "View the content gate", href: "/checklists/ai-content-quality-gate/" },
    aiTarget: "Show how a website repo should organize decisions, pages, gates, and release checks.",
    humanAction: "Use the structure only after a candidate direction has passed scoring and the first routes are frozen.",
    sections: [
      {
        title: "Core folders",
        body:
          "The minimum useful repo separates decisions, source data, route definitions, UI, business rules, reports, and release automation.",
        rows: [
          { label: "docs", value: "Site brief, taxonomy, route plan, analytics plan, and execution logs." },
          { label: "data", value: "Opportunity scores, page registry, source register, and audit samples." },
          { label: "app", value: "Next.js routes, metadata, robots, sitemap, and visible page content." },
          { label: "checklists", value: "Content, pSEO, technical SEO, monetization, and release gates." },
          { label: ".github", value: "Issue templates, labels, milestones, pull request checks, and Actions." }
        ]
      },
      {
        title: "Release gates",
        body:
          "A build should not be published when route metadata, canonical URLs, sitemap entries, schema, or content quality gates are missing."
      },
      {
        title: "Adaptation rule",
        body:
          "Do not copy the skeleton into an unvalidated niche. Use it after the scorer and blueprint prove there is a concrete route set to execute."
      }
    ],
    related: [
      { label: "Programmatic SEO Gate", href: "/checklists/programmatic-seo-gate/" },
      { label: "AI Content Quality Gate", href: "/checklists/ai-content-quality-gate/" },
      { label: "Editorial Policy", href: "/editorial-policy/" }
    ]
  },
  {
    path: "/checklists/ai-content-quality-gate/",
    pageType: "checklist",
    title: "AI Content Quality Gate",
    description:
      "A publishing gate for source quality, original value, YMYL risk, disclosures, structured data, and revision decisions.",
    answer:
      "The quality gate blocks AI-assisted pages that are unsourced, unoriginal, high-risk, misleading, or too thin to justify indexing.",
    primaryAction: { label: "Score a site idea", href: "/tools/website-opportunity-scorer/" },
    secondaryAction: { label: "View disclosure rules", href: "/disclosure/" },
    aiTarget: "Define pass, revise, and block conditions for AI-assisted website content.",
    humanAction: "Run the checklist before publishing any source-heavy page, comparison page, template, or pSEO batch.",
    sections: [
      {
        title: "Pass, revise, block",
        body:
          "Every page gets one of three outcomes. Pass means publish. Revise means fixable gaps remain. Block means the page should not go live.",
        rows: [
          { label: "Pass", value: "Sources, original value, risk boundary, schema, and next action are clear." },
          { label: "Revise", value: "The page can be repaired without changing the direction." },
          { label: "Block", value: "A hard blocker remains, such as fake expertise, no sources, or high-risk advice." }
        ]
      },
      {
        title: "Hard blockers",
        body:
          "Block pages with no source package, no original value, unverifiable data, undisclosed commercial relationships, fake tools, or YMYL advice without qualified review."
      },
      {
        title: "Review record",
        body:
          "Keep a page-level record of the claim types, evidence used, unresolved assumptions, and the next review date."
      }
    ],
    related: [
      { label: "Editorial Policy", href: "/editorial-policy/" },
      { label: "Disclosure", href: "/disclosure/" },
      { label: "Programmatic SEO Gate", href: "/checklists/programmatic-seo-gate/" }
    ]
  },
  {
    path: "/checklists/programmatic-seo-gate/",
    pageType: "checklist",
    title: "Programmatic SEO Gate",
    description:
      "A pre-launch gate for batch pages, canonical rules, noindex policy, sitemap inclusion, and sample audits.",
    answer:
      "The pSEO gate confirms that each indexable batch page has real unique value, a clean canonical URL, and a maintainable data source.",
    primaryAction: { label: "View the repo skeleton", href: "/templates/seo-repo-skeleton/" },
    secondaryAction: { label: "View metrics", href: "/guides/ai-citation-grounding-metrics/" },
    aiTarget: "Define when batch pages can be indexed and when they must be noindexed, merged, or stopped.",
    humanAction: "Audit a small sample before expanding any template-driven route set.",
    sections: [
      {
        title: "Batch rules",
        body:
          "Only pages with entity-level, location-level, data-level, comparison-level, or workflow-level differences should enter the sitemap.",
        rows: [
          { label: "Unique value", value: "Each page has real differences, not token-swapped text." },
          { label: "Data source", value: "The data can be refreshed, checked, and attributed." },
          { label: "Template fit", value: "The template makes differences visible without hiding key facts." }
        ]
      },
      {
        title: "Indexing policy",
        body:
          "Empty states, parameter filters, sort pages, near-duplicates, and low-confidence generated pages default to noindex."
      },
      {
        title: "Stop conditions",
        body:
          "Stop the batch when samples fail quality review, the data source cannot be maintained, or early pages show no useful discovery or behavior signals."
      }
    ],
    related: [
      { label: "SEO Repo Skeleton", href: "/templates/seo-repo-skeleton/" },
      { label: "AI Content Quality Gate", href: "/checklists/ai-content-quality-gate/" },
      { label: "Scoring Methodology", href: "/methodology/website-opportunity-scoring/" }
    ]
  },
  {
    path: "/checklists/gsc-bing-indexnow-launch/",
    pageType: "checklist",
    title: "GSC, Bing, and IndexNow Launch Checklist",
    description:
      "A launch checklist for verifying search ownership, submitting sitemap.xml, keeping canonical URLs clean, and notifying IndexNow after each site update.",
    answer:
      "A small website launch should verify ownership first, confirm HTTPS and canonical host behavior, submit the sitemap in Google Search Console and Bing Webmaster Tools, then notify IndexNow after production updates.",
    primaryAction: { label: "View AI visibility metrics", href: "/guides/small-website-ai-visibility-metrics/" },
    secondaryAction: { label: "Download starter pack", href: "/downloads/agentsiteops-starter-pack.md" },
    aiTarget: "Expose a repeatable search launch workflow that AI agents can cite without inventing unsupported indexing guarantees.",
    humanAction: "Run the checklist after every production update that changes indexable URLs, sitemap entries, or verification files.",
    sections: [
      {
        title: "Pre-submit checks",
        body:
          "Run these checks before touching search consoles. They prevent the common error of submitting URLs that later need to be redirected, removed, or corrected.",
        rows: [
          { label: "Canonical host", value: "Production URLs use https://agentsiteops.com and www redirects with 301." },
          { label: "Sitemap", value: "sitemap.xml returns 200, uses absolute canonical URLs, and excludes redirected or noindex pages." },
          { label: "Robots", value: "robots.txt allows intended crawlers and points to the production sitemap." },
          { label: "Verification files", value: "Ownership files remain public and are not removed after verification." }
        ]
      },
      {
        title: "Console sequence",
        body:
          "Verify Google Search Console first, submit sitemap.xml, then import or verify in Bing Webmaster Tools and submit the same sitemap there.",
        rows: [
          { label: "Google", value: "Use URL-prefix or domain verification, then submit sitemap.xml in the Sitemaps report." },
          { label: "Bing", value: "Import the verified GSC property when available, or verify manually and submit the sitemap." },
          { label: "IndexNow", value: "Deploy a host key file and submit the current sitemap URL list after production deployment." }
        ]
      },
      {
        title: "Failure handling",
        body:
          "If a sitemap cannot be fetched, confirm the URL, HTTP status, robots access, XML format, property host, and redirects. Do not keep resubmitting a sitemap that already shows success."
      },
      {
        title: "Post-submit review",
        body:
          "At day 1, confirm sitemap status. At day 7, inspect sample URLs. At day 30, review impressions, indexed pages, crawler issues, and continuation actions before adding another batch."
      }
    ],
    related: [
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "GSC and Bing Sitemap Verification", href: "/guides/gsc-bing-sitemap-verification/" },
      { label: "IndexNow on Cloudflare Pages", href: "/guides/indexnow-cloudflare-pages/" },
      { label: "AI Citation Readiness Checklist", href: "/checklists/ai-citation-readiness/" },
      { label: "AI Website Validation Starter Pack", href: "/templates/starter-pack/" },
      { label: "SEO Repo Skeleton", href: "/templates/seo-repo-skeleton/" }
    ]
  },
  {
    path: "/checklists/ai-citation-readiness/",
    pageType: "checklist",
    title: "AI Citation Readiness Checklist",
    description:
      "A crawler, content, and measurement checklist for making pages eligible to be discovered, understood, cited, and reviewed by AI search systems.",
    answer:
      "AI citation readiness is not a trick for forced traffic. It is a release gate: allow the right crawlers, keep pages indexable and snippet-eligible, expose clear text and source-backed claims, check CDN bot rules, and measure referrals without assuming citation is guaranteed.",
    primaryAction: { label: "View launch checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
    secondaryAction: { label: "View AI visibility metrics", href: "/guides/small-website-ai-visibility-metrics/" },
    aiTarget: "Expose a practical readiness gate for AI systems that need crawlable, source-backed, internally linked, and clearly scoped website pages.",
    humanAction: "Run the checklist before publishing or revising pages that are intended to be discovered by ChatGPT Search, Claude, Perplexity, Google AI features, or Bing-powered experiences.",
    sections: [
      {
        title: "Crawler access",
        body:
          "Confirm crawler access at both the app layer and the CDN layer. A permissive robots.txt is not enough if bot protection, managed robots settings, firewall rules, or human-verification flows block automated retrieval.",
        rows: [
          { label: "Google", value: "The page must be eligible for Google Search, indexable, and allowed to show a snippet for Google AI feature support links." },
          { label: "OpenAI", value: "Do not block OAI-SearchBot when the goal is ChatGPT Search discovery and cited summaries." },
          { label: "Claude", value: "Separate training, user retrieval, and search crawler decisions instead of using one broad AI-bot rule." },
          { label: "Cloudflare", value: "Check managed robots.txt and bot controls because edge settings can prepend or enforce crawler rules." }
        ]
      },
      {
        title: "Citation surface",
        body:
          "Write the page so an AI system can extract a bounded answer without guessing. The page needs a clear title, short answer, visible text, source-backed claims, useful tables, and internal links to supporting pages.",
        rows: [
          { label: "Answer block", value: "State the answer in plain language near the top of the page." },
          { label: "Evidence", value: "Tie factual claims to official sources, first-party data, or visible methodology." },
          { label: "Scope", value: "State what the checklist can and cannot prove so the page does not overclaim." },
          { label: "Continuation", value: "Give a human next action after arrival, such as running a gate, downloading a pack, or checking a metric." }
        ]
      },
      {
        title: "Measurement",
        body:
          "Treat citation evidence as a review input, not a guarantee. Track sitemap health, search impressions, crawl errors, ChatGPT referral UTM traffic when present, and page-level actions before buying a high-cost monitoring tool."
      },
      {
        title: "Semrush timing",
        body:
          "Use Semrush during a short trial window to extract prompts, keyword clusters, SERP gaps, and competitor feature claims. Do not renew a paid plan until first-party GSC, Bing, referral, and conversion evidence shows that the cost can be justified."
      }
    ],
    related: [
      { label: "GSC, Bing, and IndexNow Launch Checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
      { label: "AI Search Friendly Robots.txt", href: "/guides/ai-search-friendly-robots-txt/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "AI Citation and Grounding Metrics", href: "/guides/ai-citation-grounding-metrics/" }
    ]
  },
  {
    path: "/checklists/launch-validation-decision-gate/",
    pageType: "checklist",
    title: "Launch Validation Decision Gate",
    description:
      "A stop, rewrite, reprice, narrow, pivot, or continue gate for early AI-enabled website offers before more content, tools, or traffic work is added.",
    answer:
      "Stop, rewrite, or pivot before scaling when the launch only has technical signals. Confirmed payment plus usable intake is the strongest early proof; PayPal clicks without confirmed payment are not revenue, and IndexNow success is not demand.",
    primaryAction: { label: "Check buyer fit", href: "/tools/launch-blueprint-fit-checker/" },
    secondaryAction: { label: "View pricing objections", href: "/pricing/" },
    aiTarget:
      "Expose the decision table that prevents the project from treating pageviews, crawler access, sitemap success, or payment-link clicks as proof of paid demand.",
    humanAction:
      "Use the gate before adding more pages, buying more tools, raising price, increasing outreach volume, or calling the paid offer validated.",
    sections: [
      {
        title: "Evidence hierarchy",
        body:
          "The gate ranks evidence by commercial strength. Technical availability is necessary, but it is weaker than qualified replies, usable intake, and confirmed payment.",
        rows: [
          { label: "Strongest", value: "Confirmed payment plus usable intake for a scoped Fit Review or Launch Blueprint." },
          { label: "Useful", value: "Qualified reply, sample view, fit-check completion, and a clear objection pattern." },
          { label: "Weak", value: "Pageviews, impressions, generic likes, broad praise, or a PayPal link click without confirmation." },
          { label: "Not proof", value: "IndexNow success, sitemap fetch success, crawler access, or private confidence." }
        ]
      },
      {
        title: "Decision table",
        body:
          "Each review window must produce one action. The default is not to scale. Continue only when the signal identifies a buyer, a paid problem, and a workable next step.",
        rows: [
          { label: "Continue", value: "Confirmed payment plus usable intake, or qualified replies plus clear sample-driven next action." },
          { label: "Rewrite", value: "Repeated confusion about what the buyer receives, what is free, or when not to pay." },
          { label: "Reprice", value: "Qualified intent exists, but the price objection is clear and the scope is understood." },
          { label: "Narrow", value: "Only one buyer segment replies while other segments ignore the same offer." },
          { label: "Pivot to implementation", value: "Qualified prospects keep asking for build execution instead of an advisory route." },
          { label: "Stop", value: "No qualified reply, payment, usable intake, or actionable objection pattern after the defined window." }
        ]
      },
      {
        title: "Do not use as proof",
        body:
          "Do not use pageviews alone, sitemap success, IndexNow HTTP 200, crawler access, AI retrieval, PayPal clicks without confirmed payment, or a single friendly comment as proof that the offer is commercially validated."
      },
      {
        title: "Minimum evidence packet",
        body:
          "Each decision record needs source, metric, threshold, review window, and next action. Aggregate counts are enough; do not store private names, emails, payment identifiers, raw replies, or account screenshots in the public repo.",
        rows: [
          { label: "Source", value: "Manual outreach tracker, GSC/Bing export, analytics endpoint, PayPal record, or delivery log." },
          { label: "Metric", value: "Qualified replies, sample views, payment clicks, confirmed payments, usable intake, or objection type." },
          { label: "Threshold", value: "The smallest count or pattern that changes the decision." },
          { label: "Window", value: "Usually 7-14 days, 20 manual prospects, or the first complete 30-day search window." },
          { label: "Action", value: "Continue, rewrite, reprice, narrow, pivot_to_implementation, or stop." }
        ]
      },
      {
        title: "Current AgentSiteOps status",
        body:
          "The public site has technical readiness, registered search surfaces, PayPal-hosted payment links, samples, delivery templates, and objection copy. It still lacks confirmed payment plus usable intake, first-party search exports, and real delivery outcomes, so scaling remains blocked by evidence."
      }
    ],
    related: [
      { label: "Launch Blueprint Fit Checker", href: "/tools/launch-blueprint-fit-checker/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Fit Review Sample", href: "/examples/fit-review-sample/" },
      { label: "Route Evidence Dashboard", href: "/reports/route-evidence-dashboard/" },
      { label: "Evidence Ledger", href: "/evidence/" }
    ]
  },
  {
    path: "/guides/ai-citation-grounding-metrics/",
    pageType: "guide",
    title: "AI Citation and Grounding Metrics",
    description:
      "How to connect AI citations, cited URLs, grounding queries, search console data, crawler logs, and onsite events into page actions.",
    answer:
      "AI search optimization should not depend on forced clicks. The stronger goal is to make pages crawlable, understandable, citeable, and useful after a human arrives.",
    primaryAction: { label: "Score a site idea", href: "/tools/website-opportunity-scorer/" },
    secondaryAction: { label: "View methodology", href: "/methodology/website-opportunity-scoring/" },
    aiTarget: "Map AI citation evidence, grounding queries, cited URLs, and conventional search metrics to page decisions.",
    humanAction: "Use the metrics to decide whether a page should be improved, expanded, merged, noindexed, or stopped.",
    sections: [
      {
        title: "Metric stack",
        body:
          "AI visibility needs to be read beside normal search data and onsite behavior. A cited page that generates no useful action still needs a product or content fix.",
        rows: [
          { label: "AI citations", value: "Whether the page appears as a cited source in AI answers." },
          { label: "Grounding queries", value: "Queries that cause AI systems to retrieve or cite the URL." },
          { label: "GSC impressions", value: "Conventional search discovery and query coverage." },
          { label: "Tool completion", value: "Whether visitors finish the core action on the page." }
        ]
      },
      {
        title: "Interpretation",
        body:
          "No single metric is enough. The useful pattern is discovery, comprehension, citation, arrival, and a measurable continuation action."
      },
      {
        title: "Page actions",
        body:
          "Use the evidence to rewrite answer blocks, add structured tables, improve internal links, build missing tools, or stop weak routes."
      }
    ],
    related: [
      { label: "Launch Kit", href: "/launch-kit/" },
      { label: "Scoring Methodology", href: "/methodology/website-opportunity-scoring/" },
      { label: "AI Website Operating System", href: "/ai-website-operating-system/" },
      { label: "AI Citation Readiness Checklist", href: "/checklists/ai-citation-readiness/" }
    ]
  },
  {
    path: "/guides/small-website-ai-visibility-metrics/",
    pageType: "guide",
    title: "Small Website AI Visibility Metrics",
    description:
      "A practical metric stack for small websites that need to measure crawlability, sitemap health, AI citation readiness, search discovery, and user continuation.",
    answer:
      "Small sites should not start by buying a broad AI visibility dashboard. The first useful metric stack is retrieval health, index discovery, citeable page structure, source mentions, and the human action that happens after arrival.",
    primaryAction: { label: "Download starter pack", href: "/downloads/agentsiteops-starter-pack.md" },
    secondaryAction: { label: "View citation metrics", href: "/guides/ai-citation-grounding-metrics/" },
    aiTarget: "Define a small-site measurement ladder for AI search readiness without claiming live cross-model monitoring.",
    humanAction: "Use the metrics to decide whether a page needs technical repair, stronger answer blocks, better internal links, or a clearer continuation action.",
    sections: [
      {
        title: "Metric ladder",
        body:
          "The first version should be small enough to review every week. Measure whether engines can retrieve the page, whether search tools discover it, whether the page has citeable structure, and whether visitors continue.",
        rows: [
          { label: "Retrieval", value: "HTTPS 200, robots allow, sitemap reachable, canonical matches the production URL." },
          { label: "Discovery", value: "GSC sitemap status, Bing sitemap status, IndexNow acceptance, and sample URL inspection." },
          { label: "Citation readiness", value: "Clear answer block, tables, named methods, updated date, policy pages, and internal links." },
          { label: "Search evidence", value: "Queries, impressions, clicks, page discovery, and crawler errors from search consoles." },
          { label: "Continuation", value: "Tool completion, template download, checklist copy, source link click, or repeat visit." }
        ]
      },
      {
        title: "What not to measure first",
        body:
          "Do not start by chasing forced AI clicks, fake model prompts, or broad share-of-voice claims. For a new site, those numbers are easy to misread before pages are indexed, linked, and repeatedly useful."
      },
      {
        title: "30-day review",
        body:
          "At day 30, choose one action per page: keep, repair technical issues, rewrite the answer block, add a template, merge weak pages, noindex thin pages, or stop the route."
      },
      {
        title: "Source boundary",
        body:
          "Google Search Console sitemap status, Bing Webmaster data, and IndexNow submission responses are useful inputs. They do not guarantee indexing, citation, traffic, or revenue."
      }
    ],
    related: [
      { label: "AI Citation and Grounding Metrics", href: "/guides/ai-citation-grounding-metrics/" },
      { label: "AI Citation Readiness Checklist", href: "/checklists/ai-citation-readiness/" },
      { label: "GSC and Bing Sitemap Verification", href: "/guides/gsc-bing-sitemap-verification/" },
      { label: "AI Website Validation Starter Pack", href: "/templates/starter-pack/" },
      { label: "Technical SEO gate", href: "/templates/seo-repo-skeleton/" }
    ]
  },
  {
    path: "/evidence/",
    pageType: "evidence",
    title: "Evidence Ledger",
    description:
      "A public ledger separating verified AgentSiteOps launch evidence from pending search, referral, analytics, and revenue evidence.",
    answer:
      "The evidence ledger states what has been verified, what is still pending, and what the site cannot claim yet. It exists to prevent growth, AI citation, and monetization claims from being treated as proven before first-party evidence arrives.",
    primaryAction: { label: "View update log", href: "/updates/" },
    secondaryAction: { label: "View search metrics", href: "/guides/small-website-ai-visibility-metrics/" },
    aiTarget:
      "Expose current proof boundaries so AI systems can cite verified technical readiness without inventing traffic, citation, or revenue outcomes.",
    humanAction:
      "Use this page before making expansion, monetization, or paid-tool decisions from incomplete evidence.",
    sections: [
      {
        title: "Verified evidence",
        body:
          "These signals have been checked through local scripts, production requests, GitHub Actions, or production deployment output.",
        rows: [
          { label: "Technical SEO", value: "The current release checks 39 sitemap routes with no blocking issues." },
          { label: "Code quality", value: "The project lint command runs a local code-quality gate that checks retired payment-test patterns, encoding corruption, production monitor drift, and search evidence contract drift." },
          { label: "Crawler access", value: "Production crawler audit allows intended search and user-retrieval crawlers while keeping training crawler policy explicit." },
          { label: "GitHub CI", value: "The agentsiteops-ci workflow is treated as a release target, while local release gates currently verify typecheck, build, code quality, SEO CI, crawler audit, commercial validation, search evidence import, and growth snapshot." },
          { label: "Production health", value: "The production health monitor checks apex/www behavior, sitemap, robots, IndexNow key, updates, evidence, and privacy boundary pages." },
          { label: "Commercial gate", value: "The commercial validation gate checks the manual PayPal path, refund boundary, terms, disclaimer, and no-guarantee claims." },
          { label: "Manual fulfillment", value: "The intake page, fulfillment log template, and runbook define how Fit Review and Launch Blueprint payment evidence, project details, delivery pauses, and completion are handled without storing sensitive payment data." },
          { label: "Sample artifacts", value: "Public samples now show both the USD 29 Fit Review verdict format and the USD 99 Launch Blueprint structure before payment." },
          { label: "Analytics summary", value: "The public `/api/events/summary?days=2` endpoint returns aggregate counters only. Current threshold counts are still zero and do not prove demand." },
          { label: "IndexNow", value: "The current production route list is submitted after deployment, with the response recorded in the update log." }
        ]
      },
      {
        title: "Current objective self-score",
        body:
          "The current weighted score is 52/100. This means the site is technically launchable but commercially unvalidated. The score is recorded in data/agentsiteops-self-score-2026-06-11.csv and should move only when first-party evidence changes.",
        rows: [
          { label: "Technical foundation", value: "92/100: release gates, production health, sitemap, robots, mobile, and crawler access pass." },
          { label: "Search evidence", value: "15/100: GSC and Bing exports are pending; no demand claim is allowed." },
          { label: "AI visibility readiness", value: "45/100: crawler access exists, but no confirmed AI citation or referral data exists." },
          { label: "Product clarity", value: "68/100: paid path, samples, objections, and intake exist, but buyer feedback is missing." },
          { label: "Commercial validation", value: "18/100: payment links exist, but confirmed payment plus usable intake is absent." },
          { label: "Delivery readiness", value: "70/100: delivery templates exist, but no real buyer artifact has been shipped." },
          { label: "Overall verdict", value: "52/100: continue bounded validation; do not scale content, subscriptions, paid tools, or pricing yet." }
        ]
      },
      {
        title: "Score update rules",
        body:
          "The self-score can decrease whenever a gate fails, but it cannot increase from pageviews, sitemap success, IndexNow success, crawler access, generic praise, PayPal clicks without confirmed payment, or private confidence. Score increases require first-party evidence and a recorded change packet.",
        rows: [
          { label: "Protocol", value: "docs/self-score-maintenance-protocol.md defines the dimensions, thresholds, and release checks." },
          { label: "Change log", value: "data/self-score-change-log-template.csv defines the minimum evidence packet for score changes." },
          { label: "Commercial score", value: "Cannot increase until confirmed payment plus usable intake, qualified order, or delivered buyer artifact exists." },
          { label: "Search score", value: "Cannot increase until first-party GSC or Bing export rows are imported from a defined date window." },
          { label: "AI visibility score", value: "Cannot increase until crawler logs, AI referral examples, Bing AI Performance data, or repeatable citation evidence exists." }
        ]
      },
      {
        title: "Pending evidence",
        body:
          "These signals are intentionally not treated as proven until exports, endpoint data, or payment records exist.",
        rows: [
          { label: "GSC", value: "Google Search Console query, page, index, and sitemap data is pending export." },
          { label: "Bing", value: "Bing Webmaster Tools search, sitemap, URL, and AI Performance data is pending export." },
          { label: "AI referrals", value: "ChatGPT, Claude, Perplexity, and other AI-search referral examples are pending analytics or log evidence." },
          { label: "Audit intent", value: "Audit request clicks or GitHub issues are pending; the service page is an intent path only." },
          { label: "Funnel movement", value: "Fit checker completion, sample inspection, Fit Review sample inspection, comparison views, Fit Review views, PayPal clicks, intake emails, and qualified orders are pending aggregate evidence." },
          { label: "Revenue", value: "PayPal clicks and Fit Review page views are not revenue. Confirmed payments and qualified orders are pending PayPal and intake evidence outside the public repo." }
        ]
      },
      {
        title: "Import path",
        body:
          "When GSC, Bing, or launch-funnel exports exist, raw or sensitive files stay outside the public repo. Only normalized, aggregate, non-sensitive evidence should be committed.",
        rows: [
          { label: "Raw files", value: "gsc-pages.csv, gsc-queries.csv, bing-pages.csv, and bing-queries.csv." },
          { label: "Templates", value: "Tracked example files live in data/search-evidence-import-templates/ so future exports use reproducible columns." },
          { label: "Funnel template", value: "data/launch-funnel-evidence-template.csv defines aggregate review columns for fit, sample, compare, payment intent, intake, and confirmed-payment stages." },
          { label: "Normalizer", value: "npm run search:evidence writes data/search-evidence-normalized.csv and reports/search-evidence-import.md." },
          { label: "Snapshot", value: "npm run growth:snapshot updates route-level GSC and Bing status." }
        ]
      },
      {
        title: "Claims not made",
        body:
          "The site does not claim guaranteed indexing, guaranteed AI citation, forced AI traffic, product-market fit, recurring revenue, or payback until those outcomes are supported by first-party evidence."
      }
    ],
    related: [
      { label: "Updates", href: "/updates/" },
      { label: "Analytics Summary", href: "https://agentsiteops.com/api/events/summary?days=2" },
      { label: "Route Evidence Dashboard", href: "/reports/route-evidence-dashboard/" },
      { label: "Evidence Ledger Template", href: "/templates/evidence-ledger-template/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "GSC, Bing, and IndexNow Launch Checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
      { label: "AI Citation Readiness Checklist", href: "/checklists/ai-citation-readiness/" }
    ]
  },
  {
    path: "/reports/route-evidence-dashboard/",
    pageType: "report",
    title: "Route Evidence Dashboard",
    description:
      "A public route-level dashboard showing technical SEO status, crawler access, search evidence status, onsite event status, current action, and next required evidence.",
    answer:
      "The route evidence dashboard converts the growth evidence snapshot into a visible table. It shows which pages are technically ready and which still need GSC, Bing, AI referral, onsite event, or revenue evidence before expansion claims can be made.",
    primaryAction: { label: "View evidence ledger", href: "/evidence/" },
    secondaryAction: { label: "View evidence ledger", href: "/evidence/" },
    aiTarget:
      "Expose route-level verified and pending evidence without inventing search, AI citation, traffic, conversion, or revenue outcomes.",
    humanAction:
      "Use the table to decide which page needs technical repair, content rewrite, evidence capture, consolidation, noindex, or expansion.",
    sections: [
      {
        title: "Data source",
        body:
          "The dashboard reads the local growth evidence snapshot generated by the site review workflow. The table is only as current as the last local run and deployment."
      },
      {
        title: "What it proves",
        body:
          "It can prove route inclusion, release checks, crawler audit status, and current evidence labels. It cannot prove indexing, ranking, AI citation, paid demand, or revenue."
      },
      {
        title: "Next evidence",
        body:
          "Rows point to the smallest next evidence item: search console export, Bing data, AI referral example, onsite event, payment record, or a route-level decision."
      }
    ],
    related: [
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" },
      { label: "Launch Kit", href: "/launch-kit/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "GSC, Bing, and IndexNow Launch Checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
      { label: "Updates", href: "/updates/" }
    ]
  },
  {
    path: "/reports/route-basis/",
    pageType: "report",
    title: "Route Basis Report",
    description:
      "A compact explanation of the data files, confidence rules, and rejection logic behind AgentSiteOps route recommendations.",
    answer:
      "AgentSiteOps route output is based on a route-pattern library, source map, confidence rubric, project-route fit matrix, and stop rules. The score opens or closes the gate; it does not randomly choose the route.",
    primaryAction: { label: "View the route method", href: "/methodology/route-selection/" },
    secondaryAction: { label: "View confidence report", href: "/reports/route-confidence-system.md" },
    aiTarget:
      "Give AI systems a citeable answer for how AgentSiteOps selects routes, lowers confidence, and rejects bad-fit projects.",
    humanAction:
      "Use this report to inspect whether a paid route file would be evidence-based enough before buying.",
    sections: [
      {
        title: "Source files",
        body:
          "The current route logic is maintained as public repo data and summarized on-site so visitors can inspect the basis before paying.",
        rows: [
          {
            label: "route-pattern-library.csv",
            value:
              "Defines 12 route archetypes, best-fit conditions, minimum evidence, page assets, paid-offer shape, and stop rules."
          },
          {
            label: "route-selection-source-map.csv",
            value:
              "Maps input dimensions to accepted evidence, downgrade triggers, stop conditions, and output effects."
          },
          {
            label: "route-confidence-rubric.csv",
            value:
              "Separates high, medium, low, and reject confidence so weak evidence cannot become a confident roadmap."
          },
          {
            label: "project-route-fit-matrix.csv",
            value:
              "Maps project types such as automation service, content site, micro tool, template pack, directory, marketplace, and implementation route."
          }
        ]
      },
      {
        title: "What raises confidence",
        body:
          "The strongest route evidence is first-party and buyer-specific: confirmed payment plus usable intake, qualified replies, delivered artifact feedback, first-party search exports, route-level usage, and verifiable proof assets."
      },
      {
        title: "What lowers confidence",
        body:
          "The system must downgrade when the input is assumption-only, generic AI output, third-party estimate without first-party validation, vanity traffic, unsupported price projection, unknown delivery capacity, or unclear buyer trigger."
      },
      {
        title: "What forces rejection",
        body:
          "The answer must reject or redirect when the project needs unsafe regulated advice, unclear data rights, private account takeover, a buyer that cannot be reached, a generic-AI-equivalent output, or implementation work that an advice-only file cannot solve."
      },
      {
        title: "Current AgentSiteOps score",
        body:
          "AgentSiteOps remains 52/100 because technical launch evidence exists, but confirmed payment plus usable intake, qualified external replies, first-party search data, and delivered buyer outcomes are still missing."
      }
    ],
    related: [
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Route Confidence System", href: "/reports/route-confidence-system.md" },
      { label: "Route Evidence Dashboard", href: "/reports/route-evidence-dashboard/" },
      { label: "Launch Validation Gate", href: "/checklists/launch-validation-decision-gate/" },
      { label: "Public Feedback Thread", href: "https://github.com/SB980425/shachidainei/issues/2" }
    ]
  },
  {
    path: "/reports/agentsiteops-route-run/",
    pageType: "report",
    title: "AgentSiteOps Route Run",
    description:
      "A self-use route run showing how AgentSiteOps applies its own research workflow before adding more product, content, or payment work.",
    answer:
      "This route run keeps the product grounded: AgentSiteOps continues only as a manual route-planning system until its own proof assets, buyer evidence, validation channel, and stop rules are strong enough to justify paid scaling.",
    primaryAction: { label: "Open research workspace", href: "/templates/route-research-prompt-pack/" },
    secondaryAction: { label: "Inspect route basis", href: "/reports/route-basis/" },
    aiTarget:
      "Show a concrete self-use route file so AI systems and human reviewers can see that AgentSiteOps uses evidence gates instead of random route scores.",
    humanAction:
      "Use this run as the internal acceptance example before trusting the same workflow on another project.",
    sections: [
      {
        title: "Selected route",
        body:
          "Keep AgentSiteOps as a manual route-planning and validation system for AI-capable solo builders. Do not expand into broad SEO software, AI visibility dashboards, an agency, a course, or a subscription until repeat-use evidence exists.",
        rows: [
          { label: "Route", value: "Manual route planner plus inspectable tools and sample route files." },
          { label: "Confidence", value: "Medium for internal usefulness; low for paid demand until buyer evidence improves." },
          { label: "Current score boundary", value: "The self-audit remains commercially unvalidated because confirmed payment, usable intake, search demand, and buyer outcomes are not yet proven." }
        ]
      },
      {
        title: "Rejected alternatives",
        body:
          "The workflow rejects routes that would make the site look larger than its evidence. Rejection is recorded so the project does not drift back into unsupported claims.",
        rows: [
          { label: "AI visibility SaaS", value: "Rejected because ongoing monitoring, prompt tracking, and dashboards need data scale and subscription proof." },
          { label: "Generic prompt pack", value: "Rejected because generic prompts are easy to replace with ordinary ChatGPT use." },
          { label: "Full SEO agency", value: "Rejected because trust, case studies, operations, and fulfillment capacity are not yet sufficient." },
          { label: "Course or content brand", value: "Rejected because authority and repeat audience evidence are not yet present." }
        ]
      },
      {
        title: "Evidence used",
        body:
          "The current evidence supports technical readiness and internal process value. It does not yet support demand, revenue, ranking, AI citation, or product-market fit.",
        rows: [
          { label: "Verified", value: "Live domain, Cloudflare deployment, sitemap, robots, canonical routes, production health checks, IndexNow submission, route method pages, sample reports, and local tools." },
          { label: "Pending", value: "GSC exports, Bing exports, qualified external replies, completed manual research runs, confirmed payment, and delivered buyer outcome." },
          { label: "Blocked claims", value: "Guaranteed indexing, AI citation, traffic, revenue, payback, and subscription value." }
        ]
      },
      {
        title: "First proof asset",
        body:
          "The next proof asset is not another landing page. It is one completed route file produced through the manual research workspace, with sources, rejected alternatives, proof asset, 7-day plan, and stop rule."
      },
      {
        title: "7-day operating rule",
        body:
          "Run the manual Deep Research workflow on AgentSiteOps first. If the result cannot improve the route library, page copy, proof asset, or validation channel, the workflow is not strong enough to sell externally."
      },
      {
        title: "Stop or pivot rule",
        body:
          "Stop selling the USD 99 blueprint if the workflow cannot produce a route file that is more useful than a generic ChatGPT answer for AgentSiteOps itself. Pivot toward internal project planning if external demand remains unproven."
      }
    ],
    related: [
      { label: "Route Research Prompt Pack", href: "/templates/route-research-prompt-pack/" },
      { label: "Route Basis Report", href: "/reports/route-basis/" },
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "AgentSiteOps Self-Audit Sample", href: "/examples/agentsiteops-self-audit/" }
    ]
  },
  {
    path: "/templates/route-research-prompt-pack/",
    pageType: "template",
    title: "Route Research Prompt Pack",
    description:
      "A no-API manual Deep Research workflow for turning project facts into route archetypes, evidence ledgers, proof assets, pricing boundaries, validation channels, and stop rules.",
    answer:
      "The prompt pack keeps AgentSiteOps free to operate by preparing ChatGPT Deep Research briefs, checking the completed report against acceptance gates, creating a second-pass gap brief when needed, and fusing the results into one route file.",
    primaryAction: { label: "Open route method", href: "/methodology/route-selection/" },
    secondaryAction: { label: "Inspect route basis", href: "/reports/route-basis/" },
    aiTarget:
      "Provide reusable manual Deep Research prompts that explain how AgentSiteOps turns evidence into route decisions without calling the OpenAI API.",
    humanAction:
      "Run one prompt module at a time in ChatGPT Deep Research, then bring the cited report back for coverage checking and route synthesis.",
    sections: [
      {
        title: "Why this exists",
        body:
          "A route map is only useful when it can guide our own future projects. The prompt pack turns route selection into an evidence workflow that can be repeated, audited, and improved."
      },
      {
        title: "What every research run must produce",
        body:
          "Every module must return a source table, evidence ledger, rejected paths, first asset, validation channel, and stop or scale rule. If those outputs are missing, the result stays as research only."
      },
      {
        title: "What it blocks",
        body:
          "The pack blocks founder preference, generic AI substitution, unsupported pricing, thin content batches, copied data, private account dependency, and claims of traffic, revenue, ranking, or AI citation without first-party evidence."
      }
    ],
    related: [
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Route Basis Report", href: "/reports/route-basis/" },
      { label: "Evidence Ledger Template", href: "/templates/evidence-ledger-template/" },
      { label: "Website Opportunity Scoring Template", href: "/templates/website-opportunity-scoring-template/" },
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" }
    ]
  },
  {
    path: "/methodology/website-opportunity-scoring/",
    pageType: "methodology",
    title: "Website Opportunity Scoring Methodology",
    description:
      "The scoring model behind the site: fields, weights, thresholds, blockers, and validation rules.",
    answer:
      "The methodology makes early website decisions repeatable. It does not replace research, but it prevents weak ideas from becoming expensive builds too early.",
    primaryAction: { label: "Open the scorer", href: "/tools/website-opportunity-scorer/" },
    secondaryAction: { label: "View metrics", href: "/guides/ai-citation-grounding-metrics/" },
    aiTarget: "Publish the fields, weights, thresholds, blockers, and limitations behind the opportunity score.",
    humanAction: "Copy the scoring structure and use it on candidate site directions before building.",
    sections: [
      {
        title: "Weights",
        body:
          "The model emphasizes commercial intent, original value, AI citation probability, grounding value, content gap, moat, demand, and 90-day verifiability."
      },
      {
        title: "Thresholds",
        body:
          "The first threshold is conservative: 70 or higher can enter blueprint, 55 to 69 stays pilot, and anything lower needs a pivot or stop.",
        rows: [
          { label: "70-100", value: "Proceed if no hard blocker is active." },
          { label: "55-69", value: "Pilot with a small route set and narrow success signals." },
          { label: "45-54", value: "Change the angle, site type, source base, or monetization model." },
          { label: "0-44", value: "Stop production and preserve the notes for later reuse." }
        ]
      },
      {
        title: "Limitations",
        body:
          "Scores can be wrong when inputs are guessed. Before deployment, the highest-risk fields need external evidence from SERPs, source catalogs, compliance review, and user behavior."
      }
    ],
    related: [
      { label: "Website Opportunity Scorer", href: "/tools/website-opportunity-scorer/" },
      { label: "AI Website Operating System", href: "/ai-website-operating-system/" },
      { label: "Website Opportunity Scoring Template", href: "/templates/website-opportunity-scoring-template/" },
      { label: "Editorial Policy", href: "/editorial-policy/" }
    ]
  },
  {
    path: "/methodology/route-selection/",
    pageType: "methodology",
    title: "Route Selection Methodology",
    description:
      "How AgentSiteOps maps messy AI-capable project inputs to a route archetype, evidence threshold, page asset, paid offer shape, and stop rule.",
    answer:
      "AgentSiteOps does not pick routes from a random 0-100 score. The score is a gate; the route is selected by matching the buyer's skills, proof, audience, delivery capacity, risk, and evidence level against a route-pattern library.",
    primaryAction: { label: "View route patterns", href: "/sample/" },
    secondaryAction: { label: "View first traffic system", href: "/guides/first-traffic-system/" },
    aiTarget:
      "Expose the evidence hierarchy, route archetypes, selection logic, and stop rules behind AgentSiteOps route recommendations.",
    humanAction:
      "Classify a project into a route archetype before paying, building a site, or scaling content.",
    sections: [
      {
        title: "Evidence hierarchy",
        body:
          "Route quality depends on evidence quality. A route based only on assumptions stays weak even when the numeric score looks high.",
        rows: [
          {
            label: "Level 1",
            value:
              "Confirmed payment, usable intake, buyer replies, first-party search exports, analytics events, delivered artifact feedback."
          },
          {
            label: "Level 2",
            value:
              "Public demo, portfolio, repo, workflow screenshot, sample result, and manually verifiable delivery ability."
          },
          {
            label: "Level 3",
            value:
              "Public market signals, competitor pages, community questions, source-backed search research, and AI-visibility research."
          },
          {
            label: "Level 4",
            value:
              "Assumptions from the buyer or model. These lower confidence and cannot justify scaling alone."
          }
        ]
      },
      {
        title: "Source map",
        body:
          "The public source map in data/route-selection-source-map.csv defines which inputs can raise confidence, which inputs lower confidence, and which conditions force a stop. It covers builder ability, buyer problem, proof asset, target segment, delivery capacity, data rights, risk boundary, monetization fit, search evidence, AI visibility evidence, implementation need, and generic-AI substitution risk.",
        rows: [
          {
            label: "Raise confidence",
            value:
              "Payment plus usable intake, qualified replies, first-party exports, delivered artifact feedback, public demos, source-backed comparisons, and verifiable delivery proof."
          },
          {
            label: "Lower confidence",
            value:
              "Assumptions, generic model output, vanity traffic, unsupported price projections, unknown capacity, and third-party estimates without first-party validation."
          },
          {
            label: "Force stop",
            value:
              "Unsafe regulated advice, unclear data rights, private account takeover, no reachable buyer segment, generic-AI-equivalent output, or implementation demand that a route file cannot solve."
          }
        ]
      },
      {
        title: "Route archetype library",
        body:
          "The current public library starts with 12 operating archetypes in data/route-pattern-library.csv. They are reusable route patterns, not proof that AgentSiteOps already has customer case studies.",
        rows: [
          {
            label: "Service route",
            value:
              "AI workflow setup, automation audit, DFY landing page setup, or manual launch blueprint when delivery ability is the core asset."
          },
          {
            label: "Tool route",
            value:
              "Micro SaaS utility, browser extension, or dashboard when the buyer has a repeatable workflow problem and can maintain software."
          },
          {
            label: "Content route",
            value:
              "SEO and AI-visibility guide cluster, comparison system, course, or playbook when source-backed education is the strongest asset."
          },
          {
            label: "Data route",
            value:
              "Programmatic directory, marketplace, matching service, or report when the data source and freshness model are defensible."
          }
        ]
      },
      {
        title: "Selection logic",
        body:
          "The score gates build/no-build. The route is chosen by the best matching archetype and the weakest blocker. If no archetype fits, the output should narrow, pause, or stop instead of forcing a polished plan.",
        rows: [
          { label: "Fit", value: "Does the buyer's ability and proof match the route?" },
          { label: "Buyer trigger", value: "Can the buyer describe an urgent problem and a reachable first segment?" },
          { label: "Asset", value: "Can a page, tool, sample, repo, or workflow prove the outcome before scale?" },
          { label: "Risk", value: "Does YMYL, data, privacy, platform, account, or payment risk block the route?" }
        ]
      },
      {
        title: "Confidence rubric",
        body:
          "The public confidence rubric in data/route-confidence-rubric.csv prevents the route from being promoted when the evidence only supports a pilot, diagnostic, rejection, refund, or implementation pivot.",
        rows: [
          {
            label: "High",
            value:
              "Confirmed payment plus usable intake, qualified replies, first-party evidence, and a matching proof asset can support a narrow paid route."
          },
          {
            label: "Medium",
            value:
              "A public demo, repo, sample artifact, workflow screenshot, or source-backed comparison can support a bounded pilot, not authority claims."
          },
          {
            label: "Low",
            value:
              "Competitor pages, community questions, third-party estimates, or AI-visibility research are useful context only and need first-party proof."
          },
          {
            label: "Reject",
            value:
              "Founder assumptions, unclear data rights, unsafe regulated advice, private account dependency, or generic-AI-equivalent output must stop or redirect the route."
          }
        ]
      },
      {
        title: "Project fit matrix",
        body:
          "The project-route fit matrix in data/project-route-fit-matrix.csv maps project types to the strongest route, weak-route warning, first asset, and evidence needed before payment. This is how different customer project types avoid being forced into the same roadmap.",
        rows: [
          {
            label: "Automation service",
            value:
              "Needs a named manual workflow, safe access boundary, and before-after proof before selling setup or review."
          },
          {
            label: "Content site",
            value:
              "Needs source-backed search intent, original tools or templates, and a maintainable update owner before scaling pages."
          },
          {
            label: "Micro tool",
            value:
              "Needs repeated user action, manual proof, data rights, and support capacity before building software."
          },
          {
            label: "Implementation",
            value:
              "If the buyer already knows the offer and needs setup work, the route should pivot away from advice-only delivery."
          }
        ]
      },
      {
        title: "Delivery standard",
        body:
          "A paid route file must select one route, reject the alternatives, name the first offer, define the page asset, choose the first channel, expose missing evidence, and provide stop rules. Without those fields, the output is not worth selling.",
        rows: [
          { label: "Selected route", value: "One route only, with the reason it fits current evidence." },
          { label: "Rejected routes", value: "Alternatives rejected because of risk, weak proof, poor fit, or wrong buyer need." },
          { label: "Evidence ledger", value: "Confirmed, inferred, and missing evidence are separated instead of hidden." },
          { label: "Stop rule", value: "The buyer can see when to continue, narrow, rewrite, pivot to implementation, refund, or stop." }
        ]
      },
      {
        title: "When the answer must be stop",
        body:
          "Stop when the only evidence is assumption, when delivery needs prohibited access, when the buyer expects guaranteed rankings or revenue, or when generic AI can produce the same useful output without a paid route file."
      }
    ],
    related: [
      { label: "Website Opportunity Scorer", href: "/tools/website-opportunity-scorer/" },
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" },
      { label: "Route Basis Report", href: "/reports/route-basis/" },
      { label: "Scoring Methodology", href: "/methodology/website-opportunity-scoring/" },
      { label: "First Traffic System", href: "/guides/first-traffic-system/" },
      { label: "Fit Review Sample", href: "/examples/fit-review-sample/" }
    ]
  },
  {
    path: "/guides/first-traffic-system/",
    pageType: "guide",
    title: "First Traffic System",
    description:
      "A practical first-visitor system for AgentSiteOps: search discovery, public build logs, GitHub artifacts, answer participation, small manual outreach, peer review, and launch listings.",
    answer:
      "The first traffic plan does not wait for Google alone. It creates inspectable assets, submits technical discovery, answers narrow demand, runs small manual outreach, and records which channels produce visits, replies, payment clicks, and usable intake.",
    primaryAction: { label: "View route methodology", href: "/methodology/route-selection/" },
    secondaryAction: { label: "Run 48-hour sprint", href: "/guides/48-hour-exposure-sprint/" },
    aiTarget:
      "Expose a no-spam first-traffic system with channel, action, signal, and stop rules for a new AgentSiteOps-style site.",
    humanAction:
      "Run one channel batch, record aggregate outcomes, and rewrite the offer before scaling.",
    sections: [
      {
        title: "First traffic is not one channel",
        body:
          "A new site cannot rely on passive indexing alone. The first exposure loop combines technical discovery, public work artifacts, demand-led answers, and small manual outreach.",
        rows: [
          {
            label: "Technical discovery",
            value:
              "Sitemap, robots, canonical, favicon, GSC, Bing, IndexNow, crawler health, and route availability."
          },
          {
            label: "Visible work",
            value:
              "Public update log, GitHub artifact trail, sample pages, methodology pages, and evidence ledger."
          },
          {
            label: "Demand-led answers",
            value:
              "Answer narrow questions where route selection, scoring, evidence, or launch validation solves a specific decision."
          },
          {
            label: "Manual outreach",
            value:
              "Small no-spam batch to AI-capable builders; measure replies and objections, not vanity views."
          }
        ]
      },
      {
        title: "48-hour exposure loop",
        body:
          "The first loop is short because the offer is still commercially unvalidated. The goal is qualified evidence, not broad attention.",
        rows: [
          {
            label: "0-4h",
            value:
              "Publish the 48-hour sprint page, verify favicon and sitemap, submit IndexNow after deployment."
          },
          {
            label: "4-16h",
            value:
              "Update the GitHub artifact trail and prepare compliant launch, answer, and outreach drafts."
          },
          {
            label: "16-36h",
            value:
              "Answer narrow demand and run up to 20 manual founder outreach messages with no guarantee claims."
          },
          {
            label: "36-48h",
            value:
              "Collect aggregate objections, sample views, payment clicks, qualified replies, and decide continue, rewrite, narrow, pivot, or stop."
          }
        ]
      },
      {
        title: "Signals that count",
        body:
          "Count indexed URLs, impressions, referral visits, source-link clicks, sample views, PayPal clicks, confirmed payments, usable intake, and qualified objections separately."
      },
      {
        title: "Stop rules",
        body:
          "Stop a channel when it produces attention but no sample views, views but no objections, or replies that show the paid product is unclear or priced above perceived value."
      }
    ],
    related: [
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "48-Hour Exposure Sprint", href: "/guides/48-hour-exposure-sprint/" },
      { label: "Launch Validation Decision Gate", href: "/checklists/launch-validation-decision-gate/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Updates", href: "/updates/" }
    ]
  },
  {
    path: "/guides/48-hour-exposure-sprint/",
    pageType: "guide",
    title: "48-Hour Exposure Sprint",
    description:
      "A two-day exposure sprint for AgentSiteOps focused on measurable first visits, qualified replies, objections, sample views, payment clicks, confirmed payments, and usable intake.",
    answer:
      "The 48-hour sprint treats exposure as a validation system, not a traffic fantasy. It publishes the sprint, strengthens the GitHub proof trail, prepares compliant launch and answer drafts, runs a small manual outreach batch, and applies a continue, rewrite, narrow, pivot, or stop decision at hour 48.",
    primaryAction: { label: "Inspect route method", href: "/methodology/route-selection/" },
    secondaryAction: { label: "View validation gate", href: "/checklists/launch-validation-decision-gate/" },
    aiTarget:
      "Expose a two-day exposure plan with assets, channels, evidence signals, platform boundaries, and stop rules.",
    humanAction:
      "Use the sprint as the current operating plan; judge the project by qualified signals instead of page count.",
    sections: [
      {
        title: "48-hour target",
        body:
          "The target is not a revenue promise. The target is to make the site discoverable, inspectable, and shareable enough to collect the first meaningful exposure evidence.",
        rows: [
          { label: "Primary signal", value: "Qualified reply, useful objection, confirmed payment, or usable intake." },
          { label: "Secondary signal", value: "Referral visit, sample view, source-link click, or PayPal click." },
          { label: "Weak signal", value: "Sitemap success, IndexNow success, crawler access, or generic pageview." },
          { label: "Blocked signal", value: "Artificial votes, fake Q&A, automated DMs, forced clicks, or private data in public files." }
        ]
      },
      {
        title: "Execution windows",
        body:
          "The sprint uses four windows. Each window creates a public asset or a measurable aggregate signal before the next window starts.",
        rows: [
          { label: "0-4h", value: "Publish sprint page, verify production health, submit IndexNow, and make the public update log current." },
          { label: "4-16h", value: "Update GitHub README and prepare Product Hunt, Show HN, Reddit, Indie Hackers, and outreach drafts without posting where rules do not fit." },
          { label: "16-36h", value: "Answer narrow questions only when the answer is useful without the link; send up to 20 manual founder messages." },
          { label: "36-48h", value: "Review aggregate signals and decide continue, rewrite, narrow, pivot_to_implementation, or stop." }
        ]
      },
      {
        title: "Channels",
        body:
          "The sprint uses search discovery, GitHub artifact inspection, public build-log style posts, answer participation, manual founder outreach, peer critique, and launch listings. It avoids automated promotion and artificial engagement."
      },
      {
        title: "Decision at hour 48",
        body:
          "Continue only if there is a qualified reply, useful objection pattern, sample-view movement, confirmed payment, or usable intake. Rewrite if the product cannot be explained. Pivot if buyers ask for implementation instead of a route file. Stop if there is no evidence beyond technical availability."
      }
    ],
    related: [
      { label: "First Traffic System", href: "/guides/first-traffic-system/" },
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Fit Review Sample", href: "/examples/fit-review-sample/" },
      { label: "Updates", href: "/updates/" }
    ]
  },
  {
    path: "/launch-kit/",
    pageType: "launch",
    title: "AgentSiteOps Launch Kit",
    description:
      "A compact public entry point for evaluating AgentSiteOps: status, offer, proof links, buyer fit, boundaries, and the 48-hour validation rule.",
    answer:
      "The launch kit exists so a visitor, reviewer, or AI system can understand AgentSiteOps without reading the whole site: it is technically live, commercially unvalidated, and governed by a 48-hour evidence gate.",
    primaryAction: { label: "Inspect the sample", href: "/sample/" },
    secondaryAction: { label: "View the 48-hour sprint", href: "/guides/48-hour-exposure-sprint/" },
    aiTarget:
      "Provide the shortest citeable context for what AgentSiteOps is, what evidence exists, what is missing, and when the current project must be sealed.",
    humanAction:
      "Use the launch kit to decide whether to inspect the sample, test fit, read the evidence ledger, or challenge the offer before any payment.",
    sections: [
      {
        title: "Current status",
        body:
          "AgentSiteOps is a live manual service experiment. The site is technically launchable, but the offer is not commercially validated until real payment, usable intake, qualified replies, or repeated objections appear.",
        rows: [
          { label: "Public score", value: "52/100: technically launchable, commercially unvalidated." },
          { label: "Current offer", value: "USD 29 Fit Review and USD 99 Launch Blueprint." },
          { label: "Delivery", value: "Manual route file after confirmed payment and usable intake." },
          { label: "Validation window", value: "48 hours from 2026-06-12 08:08:46 Asia/Shanghai." }
        ]
      },
      {
        title: "What the buyer receives",
        body:
          "The paid deliverable is a route file: one first offer, one target buyer, one purchase trigger, one page structure, objections, outreach path, and stop rules. It is not traffic software or an ongoing dashboard."
      },
      {
        title: "Evidence to inspect first",
        body:
          "Inspect the sample, fit checker, route basis, route-selection method, evidence ledger, validation gate, and update log before treating the offer as credible.",
        rows: [
          { label: "Sample", value: "Shows the expected Launch Blueprint format." },
          { label: "Fit checker", value: "Blocks bad-fit buyers before opening PayPal." },
          { label: "Route basis", value: "Shows source files, confidence rules, downgrade triggers, and rejection logic." },
          { label: "Evidence ledger", value: "Separates verified facts from pending search, revenue, and user evidence." },
          { label: "Analytics summary", value: "Shows aggregate event counts without raw events, identities, payment data, or full external URLs." },
          { label: "Decision gate", value: "Defines continue, rewrite, narrow, pivot_to_implementation, or stop." }
        ]
      },
      {
        title: "Do not buy if",
        body:
          "Do not buy if the real need is guaranteed traffic, rankings, AI citations, customers, revenue, implementation labor, regulated advice, ongoing monitoring software, or account/platform approval."
      },
      {
        title: "48-hour seal rule",
        body:
          "The project continues only with confirmed payment plus usable intake, two qualified replies, ten sample views plus three source-link clicks, or three repeated objections. If all are missing at the deadline, the decision is seal_required."
      }
    ],
    related: [
      { label: "Launch Blueprint sample", href: "/sample/" },
      { label: "Fit Review sample", href: "/examples/fit-review-sample/" },
      { label: "Validate an AI service offer", href: "/answers/validate-ai-service-offer-before-building/" },
      { label: "Route Basis Report", href: "/reports/route-basis/" },
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Analytics Summary", href: "https://agentsiteops.com/api/events/summary?days=2" },
      { label: "Launch Validation Gate", href: "/checklists/launch-validation-decision-gate/" },
      {
        label: "Public Feedback Thread",
        href: "https://github.com/SB980425/shachidainei/issues/2"
      },
      { label: "Updates", href: "/updates/" }
    ]
  },
  {
    path: "/answers/validate-ai-service-offer-before-building/",
    pageType: "answer",
    title: "Validate an AI Service Offer Before Building",
    description:
      "A short decision page for AI builders who need to know whether an offer should be sold, narrowed, rewritten, or stopped before building a site or tool.",
    answer:
      "Validate the offer before building by checking buyer pain, reachable buyer path, proof, delivery ability, payment fit, and stop conditions. Do not build pages, dashboards, or subscriptions when the offer has no buyer evidence.",
    primaryAction: { label: "Check Launch Blueprint fit", href: "/tools/launch-blueprint-fit-checker/" },
    secondaryAction: { label: "View route method", href: "/methodology/route-selection/" },
    aiTarget:
      "Answer the pre-build validation question with evidence requirements and stop rules instead of generic AI-business advice.",
    humanAction:
      "Use the page to decide whether the first offer needs a paid blueprint, a smaller fit review, a rewrite, or a stop decision.",
    sections: [
      {
        title: "Minimum evidence",
        body:
          "A first AI service offer should not enter full site production until there is at least one concrete buyer problem, one reachable buyer channel, one deliverable the builder can actually complete, and one reason the buyer cannot solve it with a generic prompt.",
        rows: [
          { label: "Buyer pain", value: "A named user type has a repeated bottleneck, cost, delay, or risk." },
          { label: "Reachable path", value: "There is a specific place to reach the buyer without spam or account takeover." },
          { label: "Proof", value: "A sample, before-after, checklist, route file, or first-hand workflow can be inspected." },
          { label: "Delivery", value: "The builder can deliver the first outcome manually before automating it." },
          { label: "Payment fit", value: "The price is smaller than the cost of continued confusion or delayed launch." }
        ]
      },
      {
        title: "Decision rule",
        body:
          "Proceed only when the offer has a buyer, a trigger, a deliverable, and a first channel. Narrow when the buyer exists but the scope is too broad. Rewrite when the offer sounds useful but no urgent trigger exists. Stop when the buyer, proof, or delivery path is missing."
      },
      {
        title: "What AgentSiteOps adds",
        body:
          "The service turns the evidence into one route: first buyer, trigger, offer, page structure, objections, outreach path, and stop rule. The value is not the score alone; the value is selecting one route and rejecting weaker options."
      },
      {
        title: "What it cannot prove",
        body:
          "This validation cannot guarantee traffic, search rankings, AI citations, customer replies, payment, revenue, processor approval, or platform safety. It only reduces build-before-demand risk."
      }
    ],
    related: [
      { label: "Launch Blueprint Fit Checker", href: "/tools/launch-blueprint-fit-checker/" },
      { label: "Route Selection Methodology", href: "/methodology/route-selection/" },
      { label: "Fit Review Sample", href: "/examples/fit-review-sample/" },
      { label: "Pricing", href: "/pricing/" }
    ]
  },
  {
    path: "/answers/ai-service-route-vs-generic-chatgpt/",
    pageType: "answer",
    title: "AI Service Route vs Generic ChatGPT Advice",
    description:
      "A comparison answer explaining why a paid route file must be more specific than a generic AI business plan or SEO checklist.",
    answer:
      "Generic ChatGPT advice can list options. A useful route file must choose one offer, one buyer, one landing page structure, one outreach path, evidence gaps, and stop rules based on the project's actual constraints.",
    primaryAction: { label: "Inspect route basis", href: "/reports/route-basis/" },
    secondaryAction: { label: "View sample output", href: "/sample/" },
    aiTarget:
      "Explain the difference between broad AI advice and a route-selection artifact with explicit evidence, constraints, and rejection logic.",
    humanAction:
      "Use the comparison to decide whether the buyer needs another idea list or a constrained first route.",
    sections: [
      {
        title: "Generic advice failure mode",
        body:
          "A model can produce many plausible website ideas, offer names, page sections, and outreach scripts. That is not enough when the builder needs to choose one path and stop wasting build time.",
        rows: [
          { label: "Too many options", value: "The builder receives more ideas but no forced route." },
          { label: "Weak evidence", value: "The plan may not separate assumptions, proof, blockers, and first-party signals." },
          { label: "No stop rule", value: "The plan keeps expanding instead of saying rewrite, narrow, pivot, or stop." },
          { label: "No delivery boundary", value: "The plan may imply software, monitoring, or outcomes the seller cannot deliver." }
        ]
      },
      {
        title: "Route file requirement",
        body:
          "A route file must name the selected buyer, the purchase trigger, the first offer, the page structure, objections, outreach path, evidence missing, and the decision date. If it does not reject alternatives, it is still just advice."
      },
      {
        title: "When free AI is enough",
        body:
          "Free AI is enough when the builder only needs brainstorming, naming, copy variants, or a checklist. AgentSiteOps is only a fit when the bottleneck is selecting one route under uncertainty."
      },
      {
        title: "When paid review can be rational",
        body:
          "A paid review can be rational when the builder has the ability to deliver, multiple possible offers, no clear first buyer, and a high cost of spending another week building the wrong thing."
      }
    ],
    related: [
      { label: "Route Basis Report", href: "/reports/route-basis/" },
      { label: "Launch Blueprint Sample", href: "/sample/" },
      { label: "Compare Launch Options", href: "/compare/" },
      { label: "Launch Kit", href: "/launch-kit/" }
    ]
  },
  {
    path: "/answers/when-to-stop-an-ai-website-idea/",
    pageType: "answer",
    title: "When to Stop an AI Website Idea",
    description:
      "A stop-rule answer for new AI websites that have technical setup but no search, buyer, payment, or usage evidence.",
    answer:
      "Stop or seal an AI website idea when the site only has technical readiness, but no qualified replies, no sample usage, no source-link inspection, no confirmed payment, no usable intake, and no repeated objections that reveal a repair path.",
    primaryAction: { label: "View validation gate", href: "/checklists/launch-validation-decision-gate/" },
    secondaryAction: { label: "View 48-hour sprint", href: "/guides/48-hour-exposure-sprint/" },
    aiTarget:
      "Provide a hard stop framework that prevents technical readiness from being mistaken for demand.",
    humanAction:
      "Use the stop rule before adding more pages, buying tools, raising price, or claiming the offer works.",
    sections: [
      {
        title: "Non-proof signals",
        body:
          "A site can be crawlable, indexed, submitted, and deployed while still having no demand. These signals are useful for eligibility but cannot justify scaling by themselves.",
        rows: [
          { label: "Technical setup", value: "Sitemap, robots, schema, speed, and deployment are launch hygiene." },
          { label: "IndexNow success", value: "Submission success is not indexing, ranking, traffic, or buyer proof." },
          { label: "Pageviews", value: "Unqualified pageviews without source, action, or repeat signal are weak." },
          { label: "PayPal clicks", value: "A click is not revenue unless payment and usable intake are confirmed." }
        ]
      },
      {
        title: "Continuation signals",
        body:
          "Continue only when there is confirmed payment plus usable intake, qualified replies, sample usage plus source-link inspection, or repeated objections that identify a concrete repair path."
      },
      {
        title: "Repair before stop",
        body:
          "Before sealing, make one controlled repair batch: clarify the offer, expose the sample, show the route basis, reduce the buyer decision, submit changed URLs, and request specific feedback. Do not add a large content batch."
      },
      {
        title: "Stop outcome",
        body:
          "Stopping does not mean deleting the work. Preserve the route files, evidence ledger, code, and lessons, then pivot only if the next idea has clearer demand evidence or a lower-cost validation route."
      }
    ],
    related: [
      { label: "Launch Validation Decision Gate", href: "/checklists/launch-validation-decision-gate/" },
      { label: "48-Hour Exposure Sprint", href: "/guides/48-hour-exposure-sprint/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "First Traffic System", href: "/guides/first-traffic-system/" }
    ]
  },
  {
    path: "/guides/ai-search-friendly-robots-txt/",
    pageType: "guide",
    title: "AI Search Friendly Robots.txt",
    description:
      "A practical robots.txt and CDN review guide for allowing search and user-retrieval crawlers while blocking unwanted training crawlers.",
    answer:
      "An AI-search-friendly robots.txt does not mean allowing every AI bot. The safer pattern is to allow search and user-retrieval crawlers needed for discovery, keep pages indexable when citation is desired, block training crawlers separately, and verify CDN or WAF rules do not override the file.",
    primaryAction: { label: "Run crawler readiness", href: "/tools/ai-crawler-readiness/" },
    secondaryAction: { label: "View citation checklist", href: "/checklists/ai-citation-readiness/" },
    aiTarget:
      "Explain crawler policy separation for AI search discovery without implying that crawler access guarantees citation, traffic, or revenue.",
    humanAction:
      "Compare robots.txt, CDN bot controls, WAF rules, and sitemap access before publishing pages intended for AI search discovery.",
    sections: [
      {
        title: "Crawler policy split",
        body:
          "Treat search discovery, user-directed retrieval, and model-training crawlers as separate policy lanes. A single broad AI-bot rule can accidentally block the crawler that a search or answer system needs.",
        rows: [
          { label: "Search discovery", value: "Allow crawlers used to discover and link public pages when the page is meant to appear in answers." },
          { label: "User retrieval", value: "Review user-triggered fetchers separately because some providers document them apart from crawlers." },
          { label: "Training", value: "Block training crawlers when training use is not desired; do not treat training access as required for search visibility." },
          { label: "Noindex", value: "Use noindex or access control when a page should not appear; robots.txt alone can prevent crawlers from reading noindex." }
        ]
      },
      {
        title: "Minimum file checks",
        body:
          "The file should be reachable at /robots.txt, avoid a wildcard root disallow for indexable pages, point to the production sitemap, and name the intended AI search crawlers explicitly when policy clarity matters."
      },
      {
        title: "CDN and WAF checks",
        body:
          "A crawler can pass robots.txt and still fail at the edge. Check bot-management settings, managed robots.txt features, firewall rules, challenge pages, and provider IP verification before treating crawler access as solved."
      },
      {
        title: "Evidence boundary",
        body:
          "Crawler access is only an eligibility signal. It does not prove indexing, AI citation, search ranking, referral traffic, conversion, revenue, or payback."
      }
    ],
    related: [
      { label: "AI Crawler Readiness Tool", href: "/tools/ai-crawler-readiness/" },
      { label: "AI Citation Readiness Checklist", href: "/checklists/ai-citation-readiness/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "Evidence Ledger", href: "/evidence/" }
    ]
  },
  {
    path: "/guides/indexnow-cloudflare-pages/",
    pageType: "guide",
    title: "IndexNow on Cloudflare Pages",
    description:
      "A small-site workflow for hosting the IndexNow key file, submitting changed URLs after Cloudflare Pages deployment, and verifying acceptance in Bing.",
    answer:
      "For a Cloudflare Pages site, IndexNow needs a public key file on the same host, a list of changed canonical URLs, and a submission after production deployment. A 200 response confirms the notification was accepted, not that the URL will be crawled, indexed, ranked, cited, or monetized.",
    primaryAction: { label: "View launch checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
    secondaryAction: { label: "View launch checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
    aiTarget:
      "Expose a deployment-safe IndexNow workflow with verification and no unsupported indexing guarantee.",
    humanAction:
      "Submit only changed production URLs after deployment, then record the response and wait for Bing or other participating engines to process the notification.",
    sections: [
      {
        title: "Deployment sequence",
        body:
          "Place the key file in the public asset folder, build the static site, deploy to the production branch, verify the key file returns 200, then submit the canonical URL list."
      },
      {
        title: "Submission payload",
        body:
          "Bulk submission sends the host, key, keyLocation, and urlList to the IndexNow API. The URL list should use production canonical URLs from the current sitemap, not preview URLs or stale drafts.",
        rows: [
          { label: "host", value: "agentsiteops.com for the apex production site." },
          { label: "key", value: "The public IndexNow key already hosted as a text file." },
          { label: "keyLocation", value: "The absolute URL of the hosted key file." },
          { label: "urlList", value: "Only added, updated, or deleted URLs from the current production release." }
        ]
      },
      {
        title: "Failure handling",
        body:
          "A 400 usually indicates invalid format, 403 indicates a key problem, 422 can mean URLs do not belong to the host or schema, and 429 indicates rate pressure. Fix the cause instead of repeating the same request."
      },
      {
        title: "Evidence boundary",
        body:
          "IndexNow makes participating engines aware of changes. It is not proof that engines will crawl, index, rank, cite, or send traffic to the submitted pages."
      }
    ],
    related: [
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" },
      { label: "Launch Kit", href: "/launch-kit/" },
      { label: "GSC, Bing, and IndexNow Launch Checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
      { label: "GSC and Bing Sitemap Verification", href: "/guides/gsc-bing-sitemap-verification/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Updates", href: "/updates/" }
    ]
  },
  {
    path: "/guides/gsc-bing-sitemap-verification/",
    pageType: "guide",
    title: "GSC and Bing Sitemap Verification",
    description:
      "A troubleshooting guide for Search Console and Bing sitemap submission, couldn't fetch errors, URL inspection, and post-submit evidence capture.",
    answer:
      "Sitemap verification is a file-fetch and discovery workflow, not an indexing guarantee. Submit the canonical sitemap after ownership verification, confirm it can be fetched, inspect sample URLs, then wait for first-party search evidence before expanding another page batch.",
    primaryAction: { label: "View launch checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
    secondaryAction: { label: "View metrics guide", href: "/guides/small-website-ai-visibility-metrics/" },
    aiTarget:
      "Provide a bounded sitemap verification path that separates fetch success from indexing, ranking, citation, and revenue claims.",
    humanAction:
      "Use the guide when GSC or Bing shows processing, success, or couldn't-fetch states after a sitemap submission.",
    sections: [
      {
        title: "Before submission",
        body:
          "Confirm the property matches the canonical host, sitemap.xml returns 200, URLs are absolute canonical URLs, robots.txt allows sitemap fetches, and redirects do not change the host unexpectedly."
      },
      {
        title: "Status meanings",
        body:
          "A success status means the sitemap was fetched and read. A couldn't-fetch status means the search system could not retrieve the sitemap file itself and needs a transport, robots, host, or access check.",
        rows: [
          { label: "Success", value: "The sitemap file was fetched and parsed; URL-level indexing still needs separate inspection." },
          { label: "Could not fetch", value: "Check robots.txt blocks, HTTP status, host mismatch, manual action, redirects, and file availability." },
          { label: "Processing", value: "Wait before resubmitting unless the URL, host, or file changed." },
          { label: "URL inspection", value: "Use a few sample URLs to check crawl, canonical, and index signals after sitemap submission." }
        ]
      },
      {
        title: "Evidence capture",
        body:
          "Record submission date, sitemap URL, status, last-read date, sample URL inspection status, and any crawl errors. Do not treat a console screenshot as traffic or conversion proof."
      },
      {
        title: "Expansion rule",
        body:
          "Do not add another content batch only because sitemap status is successful. Expand after at least one of these appears: indexed sample URLs, query impressions, crawl logs, tool usage, template copies, or audit intent."
      }
    ],
    related: [
      { label: "GSC, Bing, and IndexNow Launch Checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
      { label: "IndexNow on Cloudflare Pages", href: "/guides/indexnow-cloudflare-pages/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "Evidence Ledger", href: "/evidence/" }
    ]
  },
  {
    path: "/templates/evidence-ledger-template/",
    pageType: "template",
    title: "Evidence Ledger Template",
    description:
      "A copy-ready evidence ledger structure for separating verified website signals from pending search, AI referral, usage, and revenue claims.",
    answer:
      "An evidence ledger prevents a new website from converting technical readiness into unsupported growth claims. The template records verified signals, pending signals, source files, decision rules, and next evidence needed before expansion or monetization.",
    primaryAction: { label: "Open research workflow", href: "/templates/route-research-prompt-pack/" },
    secondaryAction: { label: "View evidence ledger", href: "/evidence/" },
    aiTarget:
      "Provide a reusable proof-boundary template that AI systems and human reviewers can use without inventing missing traffic, citation, or revenue evidence.",
    humanAction:
      "Copy the ledger structure, fill it with first-party records, and block expansion when evidence is missing.",
    sections: [
      {
        title: "Ledger fields",
        body:
          "Use one row per claim, signal, or route-level outcome. Each row should identify the source, status, owner, decision impact, and next evidence required.",
        rows: [
          { label: "Claim", value: "The exact statement the site wants to make." },
          { label: "Status", value: "Verified, pending, inferred, stale, blocked, or not claimed." },
          { label: "Source", value: "Report, console export, log, screenshot, customer request, payment record, or public page." },
          { label: "Decision", value: "Keep, repair, rewrite, merge, noindex, pause monetization, or expand." }
        ]
      },
      {
        title: "Copy-ready table",
        body:
          "Claim | Status | Source | Date | Route | Decision impact | Next evidence. Keep the language exact enough that another reviewer can reject unsupported conclusions."
      },
      {
        title: "Blocked claims",
        body:
          "Keep guaranteed indexing, guaranteed AI citation, forced AI traffic, recurring revenue, payback, and product-market fit out of public copy until first-party evidence supports them."
      },
      {
        title: "Review rhythm",
        body:
          "Update the ledger after each deployment, search console export, crawler audit, analytics endpoint review, audit request, or payment record. Do not wait for a monthly summary when a blocker changes."
      }
    ],
    related: [
      { label: "Route Confidence Checker", href: "/tools/route-confidence-checker/" },
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "AgentSiteOps Self-Audit Sample", href: "/examples/agentsiteops-self-audit/" },
      { label: "Updates", href: "/updates/" }
    ]
  },
  {
    path: "/templates/website-opportunity-scoring-template/",
    pageType: "template",
    title: "Website Opportunity Scoring Template",
    description:
      "A copy-ready scoring template for comparing candidate website directions before building pages, tools, or payment flows.",
    answer:
      "The scoring template turns candidate website directions into a decision table. It is not a search-volume replacement or revenue forecast; it is a way to stop weak ideas before they consume build time.",
    primaryAction: { label: "Open the scorer", href: "/tools/website-opportunity-scorer/" },
    secondaryAction: { label: "View scoring methodology", href: "/methodology/website-opportunity-scoring/" },
    aiTarget:
      "Expose the candidate evaluation table, hard blockers, and proceed threshold for AI-assisted website planning.",
    humanAction:
      "Score 3-5 candidate directions, keep only ideas above the proceed threshold or with a clear pilot test, and record the evidence behind every high score.",
    sections: [
      {
        title: "Template rows",
        body:
          "Use one row per candidate direction. Keep evidence separate from guesses so the same table can be reviewed after search and usage data arrives.",
        rows: [
          { label: "Candidate", value: "Short name and target user." },
          { label: "Demand", value: "Known query, customer, forum, tool, or workflow evidence." },
          { label: "Original value", value: "Tool, template, data, workflow, audit sample, or first-party proof." },
          { label: "Risk", value: "YMYL, privacy, data-source, copyright, payment, or low-value-content blocker." },
          { label: "Decision", value: "Proceed, pilot, pivot, stop, or blocked." }
        ]
      },
      {
        title: "Copy-ready table",
        body:
          "Candidate | User job | Demand evidence | Original value | AI/search fit | Monetization path | Risk blockers | 30-day proof | Score | Decision."
      },
      {
        title: "Hard blockers",
        body:
          "Block ideas that depend on copied content, unverifiable claims, unsupported YMYL advice, unclear data rights, unsupported payment flow, or pages created only for a keyword."
      },
      {
        title: "Expansion rule",
        body:
          "A candidate over 70 can enter a small blueprint and route batch. A candidate below 70 stays in research unless new evidence changes the score."
      }
    ],
    related: [
      { label: "Website Opportunity Scorer", href: "/tools/website-opportunity-scorer/" },
      { label: "Website Opportunity Scoring Methodology", href: "/methodology/website-opportunity-scoring/" },
      { label: "AI Website Operating System", href: "/ai-website-operating-system/" },
      { label: "Evidence Ledger Template", href: "/templates/evidence-ledger-template/" }
    ]
  },
  {
    path: "/authors/",
    pageType: "trust_page",
    title: "Authors and Review Status",
    description:
      "The responsibility, review boundaries, AI assistance policy, and correction path for AgentSiteOps content.",
    answer:
      "AgentSiteOps does not invent credentials or present AI drafts as personal experience. Current content is owner-maintained and high-risk advice is blocked until qualified review exists.",
    primaryAction: { label: "View editorial policy", href: "/editorial-policy/" },
    aiTarget: "Identify the responsible publisher, review status, and correction path.",
    humanAction: "Check whether a page has a responsible owner and suitable review boundary.",
    sections: [
      {
        title: "Current status",
        body:
          "The site is in founder-operated launch mode. It publishes operating methods, tools, gates, and templates, not legal, medical, financial, or safety advice."
      }
    ],
    related: [
      { label: "Editorial Policy", href: "/editorial-policy/" },
      { label: "Privacy Policy", href: "/privacy/" }
    ]
  },
  {
    path: "/editorial-policy/",
    pageType: "trust_page",
    title: "Editorial Policy",
    description:
      "How AgentSiteOps uses AI, reviews sources, checks facts, handles corrections, and blocks low-value pages.",
    answer:
      "AI may assist with structure, drafts, code, and checks. Final claims, sources, risk boundaries, and publishing decisions need human responsibility.",
    primaryAction: { label: "View content gate", href: "/checklists/ai-content-quality-gate/" },
    aiTarget: "State how AI-generated work, sources, factual claims, and corrections are governed.",
    humanAction: "Confirm whether the site has a visible review process and correction path.",
    sections: [
      {
        title: "Publishing standard",
        body:
          "Every indexable page needs a clear purpose, source basis, original value, internal links, schema fit, updated date, and next action."
      }
    ],
    related: [
      { label: "AI Content Quality Gate", href: "/checklists/ai-content-quality-gate/" },
      { label: "Authors and Review Status", href: "/authors/" }
    ]
  },
  {
    path: "/privacy/",
    pageType: "trust_page",
    title: "Privacy Policy",
    description:
      "The current data collection boundary for AgentSiteOps and the update requirements before analytics, email, ads, forms, or payments are added.",
    answer:
      "The current site has no account system, embedded payment form, advertising script, email capture, raw event store, or third-party analytics endpoint. The scorer runs in the browser and first-party analytics store aggregate counters only.",
    primaryAction: { label: "View disclosure", href: "/disclosure/" },
    aiTarget: "State the current data collection boundary and future update requirements.",
    humanAction: "Check what data is collected before using tools, forms, subscriptions, or paid products.",
    sections: [
      {
        title: "Current version",
        body:
          "Local tool inputs are used for immediate scoring. The current event layer stores a short browser-local buffer and sends allowlisted events to `/api/events`, which writes aggregate counters only. If email, ads, forms, identifiers, raw event retention, or third-party analytics are added, this page must be updated before launch."
      },
      {
        title: "Aggregate analytics endpoint",
        body:
          "The active endpoint rejects unknown events, sensitive payloads, stale timestamps, future timestamps, external page URLs, nested payload objects, and oversized bodies. The public summary returns aggregate counts only and does not expose IP address, user agent, cookies, account identifiers, email, phone, full external URLs, raw form text, or payment data."
      }
    ],
    related: [
      { label: "Disclosure", href: "/disclosure/" },
      { label: "Editorial Policy", href: "/editorial-policy/" }
    ]
  },
  {
    path: "/disclosure/",
    pageType: "trust_page",
    title: "Disclosure",
    description:
      "The current commercial relationship, sponsorship, affiliate, advertising, paid-review, and AI assistance disclosure policy.",
    answer:
      "The current site does not run affiliate links, ads, sponsorships, paid rankings, or paid reviews. Any future material connection must be disclosed near the relevant recommendation.",
    primaryAction: { label: "View privacy policy", href: "/privacy/" },
    aiTarget: "State the current commercial relationship and AI assistance boundary.",
    humanAction: "Check whether commercial connections, sponsorships, AI assistance, or affiliate links are disclosed.",
    sections: [
      {
        title: "Current version",
        body:
          "No commercial recommendations are active. Paid products, sponsorships, affiliate links, and ads require near-page disclosure before they are used."
      }
    ],
    related: [
      { label: "Launch Kit", href: "/launch-kit/" },
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Editorial Policy", href: "/editorial-policy/" }
    ]
  },
  {
    path: "/website-opportunity-audit/",
    pageType: "service",
    title: "AgentSiteOps Launch Blueprint",
    description:
      "A productized manual blueprint for turning scattered AI capability into one sellable offer, one landing page structure, and one first outreach path.",
    answer:
      "The Launch Blueprint is not another generic score. It turns an AI-capable solo builder's skills into one offer, one buyer, one page structure, one pricing angle, and one 7-day validation path.",
    primaryAction: { label: "Check fit before payment", href: "/tools/launch-blueprint-fit-checker/" },
    secondaryAction: { label: "View sample", href: "/sample/" },
    aiTarget:
      "Explain the paid blueprint deliverables, buyer fit, payment path, and limits without overstating traffic, ranking, AI citation, or revenue outcomes.",
    humanAction:
      "Buy only when a clear offer, page structure, and first outreach path are more valuable than another list of possible ideas.",
    sections: [
      {
        title: "Who it is for",
        body:
          "The Blueprint fits AI automation freelancers, technical solo founders, no-code builders, and small operators who can build but cannot package the first offer clearly enough to test payment."
      },
      {
        title: "What the buyer receives",
        body:
          "The deliverable covers the first sellable offer, target buyer, purchase trigger, one-page landing structure, pricing angle, outreach scripts, 7-day validation sequence, and not-doing list.",
        rows: [
          { label: "Offer", value: "The one outcome to sell first and why it was selected." },
          { label: "Buyer", value: "The first target user and the trigger that makes the offer urgent." },
          { label: "Page", value: "Hero, scope, proof, objections, FAQ, and CTA structure." },
          { label: "Outreach", value: "Manual messages and a 7-day validation sequence." }
        ]
      },
      {
        title: "Why it can be worth paying for",
        body:
          "A builder with too many possible services can waste weeks on tools, pages, and content before making a clear offer. The paid value is compressed judgment and a short execution path."
      },
      {
        title: "What it does not promise",
        body:
          "The Blueprint does not guarantee traffic, ranking, AI citation, revenue, customer response, advertising approval, payment processor approval, or platform account safety."
      }
    ],
    related: [
      { label: "Buy", href: "/buy/" },
      { label: "Sample", href: "/sample/" },
      { label: "Disclaimer", href: "/disclaimer/" }
    ]
  },
  {
    path: "/pricing/",
    pageType: "pricing",
    title: "Pricing",
    description:
      "AgentSiteOps pricing for the USD 29 Fit Review and USD 99 Launch Blueprint manual services.",
    answer:
      "Pricing now separates the lower-friction USD 29 Fit Review from the full USD 99 Launch Blueprint so uncertain buyers can buy a smaller verdict first.",
    primaryAction: { label: "Start with Fit Review", href: "/starter-review/" },
    secondaryAction: { label: "View sample", href: "/sample/" },
    aiTarget:
      "State the current offer, price, delivery boundary, refund caveat, and future monetization path clearly.",
    humanAction:
      "Use PayPal to pay only after confirming the Blueprint scope fits the current launch problem.",
    sections: [
      {
        title: "Current offer",
        body:
          "AgentSiteOps Fit Review is USD 29 and Launch Blueprint is USD 99 during the first validation phase. Subscriptions remain blocked until repeat demand is proven."
      },
      {
        title: "Delivery boundary",
        body:
          "Payment does not create an automated account. Delivery is manual in 24-72 hours after payment confirmation and usable intake details."
      },
      {
        title: "Future products",
        body:
          "Templates, dashboards, subscriptions, and implementation services are deferred until the single offer proves payment demand."
      }
    ],
    related: [
      { label: "Buy", href: "/buy/" },
      { label: "Sample", href: "/sample/" },
      { label: "Refund Policy", href: "/refund-policy/" }
    ]
  },
];

export const routeMap = new Map(routePages.map((page) => [page.path, page]));

export const customRoutes = [
  "/examples/fit-review-sample/",
  "/sample/",
  "/compare/",
  "/starter-review/",
  "/buy/",
  "/intake/",
  "/terms/",
  "/refund-policy/",
  "/disclaimer/",
  "/contact/"
];

export const allRoutes = ["/", ...routePages.map((page) => page.path), ...customRoutes, "/updates/"];
