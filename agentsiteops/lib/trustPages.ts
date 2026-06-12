export type TrustPage = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  summary: string;
  decision: string;
  jsonLdType: "WebPage" | "ProfilePage";
  sections: Array<{
    title: string;
    body: string;
  }>;
  rules: string[];
  sources: Array<{
    label: string;
    href: string;
    note: string;
  }>;
};

const sharedSources = [
  {
    label: "AI Content Quality Gate",
    href: "/checklists/ai-content-quality-gate/",
    note: "The publishing gate for sources, claims, original value, risk, and revision decisions."
  },
  {
    label: "Updates",
    href: "/updates/",
    note: "The public change log for site decisions, verification status, and next actions."
  }
];

export const trustPages: Record<string, TrustPage> = {
  "/authors/": {
    path: "/authors/",
    title: "Authors and Review Status",
    description:
      "The responsibility, AI assistance boundary, review status, correction path, and YMYL limits for AgentSiteOps.",
    eyebrow: "Trust infrastructure",
    h1: "Authors and Review Status",
    summary:
      "AgentSiteOps is currently maintained by the site owner. The site does not invent professional credentials, test results, customer stories, or personal experience.",
    decision:
      "Current status: operating methods, tools, gates, templates, and metrics can be published. YMYL advice is blocked until qualified authorship and review are available.",
    jsonLdType: "ProfilePage",
    sections: [
      {
        title: "Responsible owner",
        body:
          "The current owner maintains the site and release records. A public business identity can be added later when payments, client services, or qualified reviews are enabled."
      },
      {
        title: "AI assistance boundary",
        body:
          "AI may assist with structure, drafts, code, and checklists. Source selection, factual claims, risk boundaries, and final publication decisions remain human responsibilities."
      },
      {
        title: "Review boundary",
        body:
          "The current site does not provide legal, medical, financial, tax, security, or other professional advice. Those categories stay blocked without qualified review."
      },
      {
        title: "Correction path",
        body:
          "Corrections should be logged, assigned, and reflected in the relevant page, source register, and update log."
      }
    ],
    rules: [
      "Do not invent credentials, hands-on experience, customer outcomes, or test results.",
      "Do not present AI output as personal experience.",
      "High-risk topics require qualified authorship, review, location boundaries, and disclaimers.",
      "Author and review status must match the visible page content and structured data."
    ],
    sources: sharedSources
  },
  "/editorial-policy/": {
    path: "/editorial-policy/",
    title: "Editorial Policy",
    description:
      "How AgentSiteOps uses AI, checks sources, verifies claims, handles corrections, updates pages, and blocks low-value content.",
    eyebrow: "Editorial policy",
    h1: "Editorial Policy",
    summary:
      "The editorial goal is to make each page understandable, citeable, useful, and reviewable. Keyword capture alone is not a publishing reason.",
    decision:
      "Current status: methods, tools, gates, templates, and metric explainers can be published. Source-heavy claims must pass the content quality gate first.",
    jsonLdType: "WebPage",
    sections: [
      {
        title: "Before publishing",
        body:
          "Every indexable page needs a clear intent, source basis, original value, internal links, schema fit, updated date, and a useful next action."
      },
      {
        title: "AI use",
        body:
          "AI can support outlines, drafts, checks, and code. It cannot replace source review, compliance judgment, or final publication responsibility."
      },
      {
        title: "Claim review",
        body:
          "Dates, prices, rules, product capabilities, legal topics, medical topics, financial topics, and security topics must be marked as confirmed, inferred, or unverified."
      },
      {
        title: "Page decisions",
        body:
          "After review, pages should be kept, rewritten, merged, noindexed, or deleted. Low-value pages should not be expanded indefinitely."
      }
    ],
    rules: [
      "Do not publish source-heavy pages without a source basis.",
      "Do not publish AI rewrite pages without original value.",
      "Structured data must match visible content.",
      "Major updates must be reflected in the public update log."
    ],
    sources: sharedSources
  },
  "/privacy/": {
    path: "/privacy/",
    title: "Privacy Policy",
    description:
      "The current data collection boundary for local tools, PayPal payment links, manual intake, email, analytics, ads, and forms.",
    eyebrow: "Privacy boundary",
    h1: "Privacy Policy",
    summary:
      "The current site has no account system, embedded payment form, advertising script, newsletter capture, or third-party analytics script. PayPal payment links open PayPal-hosted pages, intake is handled manually by email, and first-party analytics store aggregate counters only.",
    decision:
      "Current status: no account database and no external analytics reporting. The `/api/events` endpoint stores aggregate event counters without IP address, user agent, cookies, account identifiers, email, phone, raw form text, full external URLs, or payment data. PayPal handles payment data for payment-link transactions; buyers should send only the project details needed for manual delivery.",
    jsonLdType: "WebPage",
    sections: [
      {
        title: "Current collection",
        body:
          "The current pages do not ask visitors for account credentials, card numbers, bank details, passwords, private API keys, or recovery information."
      },
      {
        title: "Local tool data",
        body:
          "The website opportunity scorer uses form inputs in the browser for immediate calculation. The current version does not send those inputs to an external database."
      },
      {
        title: "Local event buffer",
        body:
          "The local event layer may store recent page, tool, export, and source-click events in browser memory and sessionStorage for debugging. The production endpoint receives only allowlisted events and writes aggregate counters to Cloudflare KV."
      },
      {
        title: "First-party aggregate analytics",
        body:
          "The `/api/events` endpoint counts page views, tool actions, source-link clicks, and payment CTA clicks for exposure validation. The public `/api/events/summary` endpoint returns aggregate counts only. Source-link clicks store host and path, not full URLs or query strings."
      },
      {
        title: "Payments",
        body:
          "Launch Blueprint payment links open PayPal-hosted pages. PayPal processes the transaction data under its own account and payment terms; this website does not embed a checkout form or store card data."
      },
      {
        title: "Manual intake",
        body:
          "The intake page lists the project details needed for manual delivery and uses email as the first handoff path. Buyers should not send confidential credentials, regulated personal data, client secrets, payment details, or private customer lists."
      },
      {
        title: "Hosting logs",
        body:
          "Cloudflare may create hosting, edge, and security logs under its platform controls. Those logs are separate from the AgentSiteOps first-party event counters."
      },
      {
        title: "Future changes",
        body:
          "Newsletter signup, external analytics, advertising, affiliate links, hosted forms, embedded checkout, databases, login, dashboards, and automated order handling require a privacy update before they are used."
      }
    ],
    rules: [
      "Do not add data collection scripts without updating this page.",
      "Email capture for newsletters must state purpose, frequency, and unsubscribe path.",
      "Hosted forms must state purpose, sharing, retention, and follow-up boundaries.",
      "Embedded checkout or automated order handling must be reviewed before release.",
      "Analytics endpoints must remain aggregate-only unless this page and the analytics gate are updated before release.",
      "Cookies, identifiers, third-party scripts, or raw event storage require review before release.",
      "The privacy statement must match the actual code and service providers."
    ],
    sources: [
      ...sharedSources,
      {
        label: "Disclosure",
        href: "/disclosure/",
        note: "Commercial and material connection disclosure requirements before monetization features are enabled."
      }
    ]
  },
  "/disclosure/": {
    path: "/disclosure/",
    title: "Disclosure",
    description:
      "The current paid service, affiliate, advertising, sponsorship, paid-review, and AI assistance disclosure policy.",
    eyebrow: "Disclosure",
    h1: "Disclosure",
    summary:
      "The current version offers the paid AgentSiteOps Launch Blueprint through PayPal. It has no affiliate links, ads, sponsored content, paid rankings, or paid reviews.",
    decision:
      "Current status: paid Launch Blueprint CTA is active. Ads, sponsorships, affiliate links, paid reviews, or paid recommendations remain blocked unless disclosed.",
    jsonLdType: "WebPage",
    sections: [
      {
        title: "Current commercial status",
        body:
          "Current pages include a paid AgentSiteOps Launch Blueprint offer. They do not include affiliate links, ads, sponsored placements, paid reviews, or paid rankings."
      },
      {
        title: "Near-page disclosure",
        body:
          "Future commercial recommendations must disclose the relationship near the recommendation, not only in the footer or policy page."
      },
      {
        title: "AI assistance",
        body:
          "AI may assist with structure, drafts, code, and checks. It must not be used to fabricate usage experience, tests, expert opinions, or outcomes."
      },
      {
        title: "Blocking conditions",
        body:
          "Undisclosed recommendations, misleading ads, fake reviews, paid ranking without disclosure, and fake personal experience block publication."
      }
    ],
    rules: [
      "Material connections must be clear and easy to notice.",
      "Ads, sponsorships, affiliate links, free products, and paid recommendations require disclosure.",
      "Disclosure language must match the page language.",
      "A policy page does not replace near-page disclosure."
    ],
    sources: [
      ...sharedSources,
      {
        label: "FTC Disclosures 101",
        href: "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers",
        note: "The FTC expects material connections to be clear to readers."
      },
      {
        label: "FTC Endorsement Guides",
        href: "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides",
        note: "The FTC guidance covers endorsements, reviews, and unexpected connections that may affect credibility."
      }
    ]
  }
};

export function getTrustPage(path: string) {
  const page = trustPages[path];

  if (!page) {
    throw new Error(`Missing trust page: ${path}`);
  }

  return page;
}
