import type { Metadata } from "next";
import Link from "next/link";
import { ScorerPanel } from "@/components/ScorerPanel";
import { allRoutes, routePages, siteUrl, workflow } from "@/lib/site";

export const metadata: Metadata = {
  title: "AgentSiteOps",
  description:
    "An AI website operating system for scoring opportunities, structuring SEO sites, running content gates, and reviewing launch signals."
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgentSiteOps",
    description:
      "An AI website operating system for scoring opportunities, structuring SEO sites, running content gates, and reviewing launch signals.",
    inLanguage: "en",
    url: siteUrl,
    potentialAction: {
      "@type": "ViewAction",
      target: `${siteUrl}/tools/website-opportunity-scorer/`,
      name: "Use the website opportunity scorer"
    }
  };

  const routeCards = routePages.filter((page) =>
    [
      "/tools/website-opportunity-scorer/",
      "/tools/ai-crawler-readiness/",
      "/examples/agentsiteops-self-audit/",
      "/services/ai-website-opportunity-audit/",
      "/templates/starter-pack/",
      "/templates/seo-repo-skeleton/",
      "/checklists/ai-content-quality-gate/",
      "/checklists/programmatic-seo-gate/",
      "/checklists/gsc-bing-indexnow-launch/",
      "/checklists/ai-citation-readiness/",
      "/guides/ai-search-friendly-robots-txt/",
      "/guides/indexnow-cloudflare-pages/",
      "/guides/gsc-bing-sitemap-verification/",
      "/guides/small-website-ai-visibility-metrics/",
      "/guides/ai-citation-grounding-metrics/",
      "/evidence/",
      "/templates/evidence-ledger-template/",
      "/templates/website-opportunity-scoring-template/",
      "/methodology/website-opportunity-scoring/"
    ].includes(page.path)
  );

  return (
    <main className="page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <div className="hero-copy">
          <h1>AI Website Operating System</h1>
          <p className="hero-lede">
            AgentSiteOps turns website ideas into scored opportunities, structured routes, content gates,
            technical SEO checks, and 30-day review loops before a site is expanded.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/tools/website-opportunity-scorer/">
              Score a site idea
            </Link>
            <Link className="secondary-action" href="/tools/ai-crawler-readiness/">
              Check crawler readiness
            </Link>
          </div>
          <div className="proof-grid" aria-label="System summary">
            <div className="proof-item">
              <strong>{allRoutes.length}</strong>
              <span>indexable routes in the first release set</span>
            </div>
            <div className="proof-item">
              <strong>5</strong>
              <span>gates and review loops before expansion</span>
            </div>
            <div className="proof-item">
              <strong>30</strong>
              <span>day validation cycle for early site signals</span>
            </div>
          </div>
        </div>
        <ScorerPanel />
      </section>

      <section className="workflow-section">
        <div className="section-head">
          <h2>From idea to review</h2>
          <p>Each step creates a file, page, gate, or report so the site can be audited and improved without relying on chat history.</p>
        </div>
        <div className="workflow-grid">
          {workflow.map((step, index) => (
            <div className="workflow-card" key={step.title}>
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="route-section">
        <div className="section-head">
          <h2>First release pages</h2>
          <p>The initial set focuses on free diagnostics, sample proof, repo structure, publishing gates, and metrics before checkout or large content expansion.</p>
        </div>
        <div className="route-grid">
          {routeCards.map((page) => (
            <Link className="route-card" href={page.path} key={page.path}>
              <small>{page.pageType}</small>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
