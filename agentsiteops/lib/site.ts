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
    primaryAction: { label: "Run the readiness tool", href: "/tools/ai-crawler-readiness/" },
    secondaryAction: { label: "View evidence ledger", href: "/evidence/" },
    aiTarget:
      "Provide a citeable sample report that separates verified launch evidence from missing search, usage, customer, and revenue evidence.",
    humanAction:
      "Use the sample to judge whether a paid audit would be useful before submitting an audit request.",
    sections: [
      {
        title: "Sample score",
        body:
          "AgentSiteOps currently passes the production and crawler-access foundation, but it does not yet pass commercial proof. The sample score is a readiness diagnosis, not a claim of product-market fit.",
        rows: [
          { label: "Technical readiness", value: "Pass: production health, sitemap, robots, IndexNow key, and CI are checked." },
          { label: "Search evidence", value: "Pending: GSC and Bing exports are not yet available." },
          { label: "AI citation evidence", value: "Pending: no confirmed ChatGPT, Perplexity, Claude, or Copilot referral evidence." },
          { label: "Commercial evidence", value: "Blocked: no customer request, payment, renewal, or conversion evidence." },
          { label: "Decision", value: "Continue free tools and sample reports; do not enable checkout yet." }
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
          "The repair path is to publish useful free diagnostics, show this self-audit as case study zero, collect first-party usage signals, and only then test a paid manual audit."
      }
    ],
    related: [
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
      { label: "Compare Launch Options", href: "/compare/" },
      { label: "Sample Launch Blueprint", href: "/sample/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Buy", href: "/buy/" }
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
          { label: "Sample blueprint", value: "A public sample now shows input facts, selected offer, rejected paths, landing page outline, outreach angle, seven-day validation, and missing-evidence boundaries before payment." },
          { label: "IndexNow", value: "The current production route list is submitted after deployment, with the response recorded in the update log." }
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
          { label: "Revenue", value: "Paid templates, audits, subscriptions, ads, and affiliate revenue are not active evidence yet." }
        ]
      },
      {
        title: "Import path",
        body:
          "When GSC or Bing exports exist, raw CSV files are placed in a local ignored import directory, normalized into a stable CSV, then merged into the growth evidence snapshot.",
        rows: [
          { label: "Raw files", value: "gsc-pages.csv, gsc-queries.csv, bing-pages.csv, and bing-queries.csv." },
          { label: "Templates", value: "Tracked example files live in data/search-evidence-import-templates/ so future exports use reproducible columns." },
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
    primaryAction: { label: "View the evidence ledger", href: "/evidence/" },
    secondaryAction: { label: "View update log", href: "/updates/" },
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
      { label: "Evidence Ledger", href: "/evidence/" },
      { label: "Small Website AI Visibility Metrics", href: "/guides/small-website-ai-visibility-metrics/" },
      { label: "GSC, Bing, and IndexNow Launch Checklist", href: "/checklists/gsc-bing-indexnow-launch/" },
      { label: "Updates", href: "/updates/" }
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
    secondaryAction: { label: "View evidence ledger", href: "/evidence/" },
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
    primaryAction: { label: "View evidence ledger", href: "/evidence/" },
    secondaryAction: { label: "View weekly review", href: "/guides/small-website-ai-visibility-metrics/" },
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
      "The current site has no account system, payment form, advertising script, or email capture. The scorer runs in the browser and does not send form inputs to an external database.",
    primaryAction: { label: "View disclosure", href: "/disclosure/" },
    aiTarget: "State the current data collection boundary and future update requirements.",
    humanAction: "Check what data is collected before using tools, forms, subscriptions, or paid products.",
    sections: [
      {
        title: "Current version",
        body:
          "Local tool inputs are used for immediate scoring. The current event layer stores only a short browser-local buffer unless an approved endpoint is configured. If analytics collection, email, ads, forms, or payments are added, this page must be updated before launch."
      },
      {
        title: "Analytics endpoint gate",
        body:
          "A real analytics endpoint is not enabled. Before activation, the endpoint must reject unknown events, sensitive payloads, stale timestamps, future timestamps, external page URLs, nested payload objects, and oversized bodies."
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
      "AgentSiteOps pricing for the USD 99 Launch Blueprint manual service.",
    answer:
      "Pricing is intentionally reduced to one validation-stage offer: USD 99 for a manual Launch Blueprint delivered after payment confirmation and intake details.",
    primaryAction: { label: "Pay with PayPal", href: "https://paypal.me/agentsiteops/99USD" },
    secondaryAction: { label: "View sample", href: "/sample/" },
    aiTarget:
      "State the current offer, price, delivery boundary, refund caveat, and future monetization path clearly.",
    humanAction:
      "Use PayPal to pay only after confirming the Blueprint scope fits the current launch problem.",
    sections: [
      {
        title: "Current offer",
        body:
          "AgentSiteOps Launch Blueprint is USD 99 during the first validation phase. The old multi-tier ladder is intentionally removed."
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
  "/sample/",
  "/compare/",
  "/buy/",
  "/intake/",
  "/terms/",
  "/refund-policy/",
  "/disclaimer/",
  "/contact/"
];

export const allRoutes = ["/", ...routePages.map((page) => page.path), ...customRoutes, "/updates/"];
