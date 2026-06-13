import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

const path = "/disclaimer/";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "No-guarantee and risk boundaries for AgentSiteOps Route File content.",
  alternates: { canonical: path },
  openGraph: {
    title: "Disclaimer",
    description: "AgentSiteOps does not guarantee traffic, ranking, revenue, customers, or approvals.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Disclaimer",
    description: "No-guarantee and risk boundaries for AgentSiteOps Route File content.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="gate-hero">
        <div>
          <p className="eyebrow">No-guarantee boundary</p>
          <h1>The Route File is a validation plan, not a guaranteed outcome.</h1>
          <p>
            AgentSiteOps can help compress a launch decision and execution path. It cannot
            guarantee search visibility, AI citation, customer response, income, platform approval,
            or payment processor approval.
          </p>
        </div>
        <aside className="decision-card">
          <strong>Risk rule</strong>
          <p>Use the output as a decision aid. The buyer remains responsible for execution and compliance.</p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Boundaries</h2>
          <p>These are explicit exclusions for the first validation-stage service.</p>
        </div>
        <div className="loop-grid">
          {[
            "No guaranteed traffic, ranking, AI citation, or brand mention.",
            "No customer acquisition, revenue, or profit guarantee.",
            "No legal, tax, financial, medical, security, or regulated professional advice.",
            "No automated posting, commenting, messaging, scraping, or platform-growth workflow.",
            "No claim that any third-party tool, platform, payment provider, or open-source project will approve or support the buyer's use case."
          ].map((item, index) => (
            <article key={item}>
              <span>{index + 1}</span>
              <h3>{item}</h3>
              <p>The final decision and risk review remain the buyer's responsibility.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
