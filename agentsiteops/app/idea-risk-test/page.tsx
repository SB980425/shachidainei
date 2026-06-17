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
    label: "Write once",
    body: "Paste one messy project description. The user does not need to know the correct product or startup vocabulary."
  },
  {
    label: "System takes over",
    body: "The page extracts signals, marks what AI may misunderstand, and asks only the minimum repair questions."
  },
  {
    label: "Decide",
    body: "Continue, repair, or stop before Plan Studio. Do not add more features just because the idea feels possible."
  }
];

const notClaims = [
  "It is not a success forecast.",
  "It is not investment, legal, financial, medical, or regulated advice.",
  "It does not prove product-market fit, traffic, payment, or buyer demand.",
  "It does not run hidden API research or store raw project text on the server.",
  "It does not let subjective preference override missing buyer, proof, channel, or stop-rule evidence."
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
          <h1>Paste the project idea. Let the system challenge it before any plan.</h1>
          <p>
            This page is the first working surface. It does not need polished product
            language. It takes one rough description, freezes the current interpretation,
            shows what AI may misunderstand, asks the smallest repair questions, and
            returns continue, repair, or stop before any plan.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#idea-risk-test">
              <ClipboardList aria-hidden="true" size={17} />
              Write the idea
            </a>
          </div>
        </div>
        <aside className="decision-card">
          <strong>The system takes the first pass</strong>
          <p>
            Write the messy project once. The page should reduce subjective drift by
            forcing buyer, proof, channel, boundary, and stop-rule checks before any
            route is treated as real.
          </p>
        </aside>
      </section>

      <IdeaRiskTestStudio />

      <section className="gate-section idea-risk-flow-section ia-risk-flow">
        <div className="section-head">
          <h2>How the system takes over the first pass.</h2>
          <p>
            The browser-local test extracts project signals and compares them to a
            visible failure-node library. The result is a decision checkpoint, not a
            guarantee and not a polished opinion.
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
