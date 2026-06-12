import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, GitCompareArrows } from "lucide-react";
import {
  sampleBlueprintDecision,
  sampleBlueprintInputs,
  sampleBlueprintRejectedPaths,
  sampleLandingPageBlocks,
  samplePaidArtifactChecklist,
  sampleReportSections,
  sampleValidationPlan
} from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/sample/";

export const metadata: Metadata = {
  title: "Sample Launch Blueprint",
  description:
    "A sample AgentSiteOps Launch Blueprint showing the offer, buyer, landing page, and 7-day validation structure.",
  alternates: { canonical: path },
  openGraph: {
    title: "Sample Launch Blueprint",
    description: "Preview the manual blueprint structure before buying.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Sample AgentSiteOps Launch Blueprint",
    description: "An anonymized example structure for the paid Launch Blueprint deliverable.",
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
          <p className="eyebrow">Sample deliverable</p>
          <h1>What a Launch Blueprint looks like.</h1>
          <p>
            This sample shows the shape of the paid artifact. Real delivery is customized
            from the buyer's skills, assets, target market, constraints, and launch window.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/tools/launch-blueprint-fit-checker/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Check fit first
            </Link>
            <Link prefetch={false} className="secondary-action" href="/intake/">
              <ArrowRight aria-hidden="true" size={17} />
              View intake fields
            </Link>
            <Link prefetch={false} className="secondary-action" href="/compare/">
              <GitCompareArrows aria-hidden="true" size={17} />
              Compare options
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Sample status</strong>
          <p>
            This is a fictional example. It demonstrates format and specificity, not a customer case study.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Sample input snapshot</h2>
          <p>
            A paid blueprint is only useful if it starts from actual operating facts. The
            example below shows the minimum evidence used before selecting a route.
          </p>
        </div>
        <div className="comparison-table comparison-table-wide" role="table" aria-label="Sample input snapshot">
          <div role="row">
            <strong role="columnheader">Input</strong>
            <strong role="columnheader">Sample value</strong>
          </div>
          {sampleBlueprintInputs.map((item) => (
            <div key={item.label} role="row">
              <span role="cell">{item.label}</span>
              <span role="cell">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Decision output</h2>
          <ul className="compact-list">
            <li>
              <strong>Selected offer:</strong> {sampleBlueprintDecision.selectedOffer}
            </li>
            <li>
              <strong>Target buyer:</strong> {sampleBlueprintDecision.targetBuyer}
            </li>
            <li>
              <strong>First price:</strong> {sampleBlueprintDecision.firstPrice}
            </li>
            <li>
              <strong>Confidence:</strong> {sampleBlueprintDecision.confidence}
            </li>
          </ul>
        </div>
        <div>
          <h2>Rejected paths</h2>
          <ul className="compact-list">
            {sampleBlueprintRejectedPaths.map((item) => (
              <li key={item.path}>
                <strong>{item.path}:</strong> {item.reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Sample report sections</h2>
          <p>
            A useful blueprint should make one path easier to execute, not add more options.
          </p>
        </div>
        <div className="loop-grid">
          {sampleReportSections.map((section, index) => (
            <article key={section.title}>
              <span>{index + 1}</span>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Landing page outline</h2>
          <ul className="compact-list">
            {sampleLandingPageBlocks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>7-day validation plan</h2>
          <div className="timeline-grid">
            {sampleValidationPlan.map((item) => (
              <article key={item.day}>
                <small>{item.day}</small>
                <p>{item.action}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>What the paid file must contain</h2>
          <p>
            The USD 99 price is not for a score. It is for a compact decision artifact
            that can be executed in the next validation cycle.
          </p>
        </div>
        <div className="loop-grid">
          {samplePaidArtifactChecklist.map((item, index) => (
            <article key={item.title}>
              <span>{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>What this sample proves</h2>
          <ul className="compact-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={16} /> The deliverable is a launch decision artifact, not a generic SEO audit.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} /> It connects offer, buyer, page structure, price, outreach, and stop rules.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} /> It avoids traffic, ranking, revenue, and platform-growth promises.
            </li>
          </ul>
        </div>
        <div>
          <h2>What a real report adds</h2>
          <p>
            A real paid report uses the buyer's submitted details, assets, constraints, and market
            path. The final artifact is delivered manually after payment confirmation and intake.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/tools/launch-blueprint-fit-checker/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Check fit first
            </Link>
            <Link prefetch={false} className="secondary-action" href="/buy/">
              <FileText aria-hidden="true" size={17} />
              View buy page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
