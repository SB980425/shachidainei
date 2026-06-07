import Link from "next/link";
import { siteUrl } from "@/lib/site";
import type { TrustPage } from "@/lib/trustPages";

type Props = {
  page: TrustPage;
};

export function TrustPolicyPage({ page }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": page.jsonLdType,
    name: page.title,
    description: page.description,
    url: `${siteUrl}${page.path}`,
    dateModified: "2026-06-07",
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
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p>{page.summary}</p>
          <div className="hero-actions">
            <Link className="primary-action" href="/checklists/ai-content-quality-gate/">
              View content gate
            </Link>
            <Link className="secondary-action" href="/updates/">
              View updates
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Publication status</strong>
          <p>{page.decision}</p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Core Notes</h2>
          <p>This page helps AI systems and human readers identify responsibility, boundaries, risk, and next actions.</p>
        </div>
        <div className="loop-grid">
          {page.sections.map((section, index) => (
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
          <h2>Rules</h2>
          <ul className="compact-list">
            {page.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Sources and Related Pages</h2>
          <div className="source-stack">
            {page.sources.map((source) => (
              <a key={source.href} href={source.href}>
                <strong>{source.label}</strong>
                <span>{source.note}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
