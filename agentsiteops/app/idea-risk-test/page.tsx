import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, SearchCheck, ShieldCheck } from "lucide-react";
import { IdeaRiskTestStudio } from "@/components/IdeaRiskTestStudio";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";
import { siteUrl } from "@/lib/site";

const path = "/idea-risk-test/";

export const metadata: Metadata = {
  title: "Free Idea Risk Test",
  description:
    "A free AgentSiteOps project idea test that maps likely failure nodes, evidence gaps, source basis, time checkpoints, and next planning actions before Route File review.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free Idea Risk Test",
    description:
      "Fill in one rough project idea and receive a source-backed failure-node map, evidence gaps, time checkpoints, and next planning actions.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const flowRows = [
  {
    label: "Write",
    body: "Paste one messy project description. The page extracts useful fields automatically."
  },
  {
    label: "Map",
    body: "See likely failure nodes, evidence gaps, time checkpoints, and source basis."
  },
  {
    label: "Decide",
    body: "Continue to Plan Studio only when the next route is specific enough to draft."
  }
];

const notClaims = [
  "It is not a success forecast.",
  "It is not investment, legal, financial, medical, or regulated advice.",
  "It does not prove product-market fit, traffic, payment, or buyer demand.",
  "It does not run hidden API research or store raw project text on the server."
];

export default function IdeaRiskTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps Free Idea Risk Test",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A browser-local project idea risk test that maps likely failure nodes and time checkpoints using a visible source basis.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page idea-risk-page ia-risk-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero idea-risk-hero ia-risk-hero">
        <div>
          <p className="eyebrow">Free test window</p>
          <h1>Paste the project idea. Get the failure map before any plan.</h1>
          <p>
            This page is the first working surface. It does not ask for payment, does not
            claim automatic research, and does not require a polished plan. It turns one
            rough description into extracted signals, risk nodes, evidence gaps, and a
            next route decision.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#idea-risk-test">
              <ClipboardList aria-hidden="true" size={17} />
              Write the idea
            </a>
          </div>
        </div>
        <aside className="decision-card">
          <strong>One job on this page</strong>
          <p>
            Write the messy project once. Everything below exists to explain the output,
            not to send the visitor into another branch.
          </p>
        </aside>
      </section>

      <IdeaRiskTestStudio />

      <section className="gate-section idea-risk-flow-section ia-risk-flow">
        <div className="section-head">
          <h2>How the test reads the input.</h2>
          <p>
            The browser-local test extracts project signals and compares them to a visible
            failure-node library. The result is a reference map, not a guarantee.
          </p>
        </div>
        <div className="idea-risk-flow-grid">
          {flowRows.map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split idea-risk-source-boundary" id="source-basis">
        <div>
          <h2>Reference sources are visible.</h2>
          <p>
            The test uses searched and registered startup failure sources as a pattern
            library. These sources are useful for asking better questions, not for declaring
            certainty about one project.
          </p>
          <div className="idea-risk-source-ledger">
            {ideaRiskSources.map((source) => (
              <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                <SearchCheck aria-hidden="true" size={17} />
                <span>{source.publisher}</span>
                <strong>{source.name}</strong>
                <small>{source.useFor}</small>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2>What this page will not claim.</h2>
          <ul className="compact-list">
            {notClaims.map((item) => (
              <li key={item}>
                <ShieldCheck aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Continue only after reading the map
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
