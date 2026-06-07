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
      "The current data collection boundary and update requirements before analytics, email, ads, forms, or payments are added.",
    eyebrow: "Privacy boundary",
    h1: "Privacy Policy",
    summary:
      "The current site has no account system, payment form, advertising script, or email capture. The scorer runs in the browser, and production hosting may include Cloudflare-managed analytics or edge logs.",
    decision:
      "Current status: no sensitive personal data collection and no first-party analytics endpoint. Cloudflare-managed hosting analytics must remain disclosed and reviewed before any additional analytics, email, ads, forms, or payments are enabled.",
    jsonLdType: "WebPage",
    sections: [
      {
        title: "Current collection",
        body:
          "The current pages do not ask visitors for name, email, phone number, account credentials, or payment information."
      },
      {
        title: "Local tool data",
        body:
          "The website opportunity scorer uses form inputs in the browser for immediate calculation. The current version does not send those inputs to an external database."
      },
      {
        title: "Local event buffer",
        body:
          "The local event layer may store recent page, tool, export, and source-click events in browser memory and sessionStorage for debugging when no reporting endpoint is configured."
      },
      {
        title: "Analytics endpoint gate",
        body:
          "A real first-party analytics endpoint is not enabled. Before activation, the endpoint must reject unknown events, sensitive payloads, stale timestamps, future timestamps, external page URLs, nested payload objects, and oversized bodies."
      },
      {
        title: "Cloudflare hosting analytics",
        body:
          "Production pages may include Cloudflare-managed scripts, edge logs, or web analytics from the hosting layer. Those records are separate from the site event endpoint and should be reviewed in Cloudflare account settings."
      },
      {
        title: "Hosting logs",
        body:
          "A production host may create basic server or edge logs. The exact retention and processing boundaries depend on the deployment platform."
      },
      {
        title: "Future changes",
        body:
          "Email, analytics, advertising, affiliate links, forms, and payment features require a privacy update before they are used."
      }
    ],
    rules: [
      "Do not add data collection scripts without updating this page.",
      "Email capture must state purpose, frequency, and unsubscribe path.",
      "Forms must state purpose, sharing, retention, and follow-up boundaries.",
      "Analytics endpoints, cookies, host-managed analytics, or third-party scripts require review before release.",
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
      "The current commercial relationship, affiliate, advertising, sponsorship, paid-review, and AI assistance disclosure policy.",
    eyebrow: "Disclosure",
    h1: "Disclosure",
    summary:
      "The current version has no affiliate links, ads, sponsored content, paid rankings, paid reviews, or product sales. Future material connections must be disclosed near the relevant recommendation.",
    decision:
      "Current status: no commercial relationship is active. Ads, sponsorships, affiliate links, paid reviews, or paid recommendations are blocked unless disclosed.",
    jsonLdType: "WebPage",
    sections: [
      {
        title: "Current commercial status",
        body:
          "Current pages do not include affiliate links, ads, sponsored placements, paid reviews, paid rankings, or product sales."
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
