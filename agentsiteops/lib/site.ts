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
      { label: "AI Citation and Grounding Metrics", href: "/guides/ai-citation-grounding-metrics/" }
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
      { label: "AI Website Validation Starter Pack", href: "/templates/starter-pack/" },
      { label: "Technical SEO gate", href: "/templates/seo-repo-skeleton/" }
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
      { label: "Editorial Policy", href: "/editorial-policy/" }
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
          "Local tool inputs are used for immediate scoring. If analytics, email, ads, forms, or payments are added, this page must be updated before launch."
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
  }
];

export const routeMap = new Map(routePages.map((page) => [page.path, page]));

export const allRoutes = ["/", ...routePages.map((page) => page.path), "/updates/"];
