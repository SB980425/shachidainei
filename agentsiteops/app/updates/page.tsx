import type { Metadata } from "next";
import Link from "next/link";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { siteUrl } from "@/lib/site";
import { updateLog, type UpdateLogEntry } from "@/lib/updateLog";

const path = "/updates/";
const pageUrl = `${siteUrl}${path}`;

function isPublicEnglishEntry(entry: UpdateLogEntry) {
  const visibleText = [
    entry.step,
    entry.aiAngle,
    entry.next,
    ...entry.keyPoints,
    ...entry.files,
    ...entry.verification
  ].join(" ");

  return /^[\x09\x0A\x0D\x20-\x7E]*$/.test(visibleText);
}

const publicUpdates = updateLog.filter(isPublicEnglishEntry);

export const metadata: Metadata = {
  title: "Updates",
  description:
    "AgentSiteOps execution updates: key decisions, AI-reader notes, changed files, verification scope, risks, and next actions.",
  alternates: {
    canonical: path
  },
  openGraph: {
    title: "Updates",
    description: "AgentSiteOps execution updates, release checks, verification notes, and next actions.",
    url: pageUrl,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AgentSiteOps Updates",
  description: "Public execution log for AgentSiteOps.",
  inLanguage: "en",
  url: pageUrl,
  hasPart: publicUpdates.map((entry) => ({
    "@type": "CreativeWork",
    name: entry.step,
    dateModified: entry.date,
    text: entry.aiAngle
  }))
};

export default function Page() {
  return (
    <main className="updates-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="updates-hero">
        <div>
          <p className="eyebrow">Execution log</p>
          <h1>Updates</h1>
          <p>
            This page keeps the public timeline for domain changes, production readiness,
            verification status, and the next actions required before site expansion.
          </p>
        </div>
        <aside className="decision-card">
          <strong>Log rule</strong>
          <p>Each public entry must include the decision, changed files, verification scope, residual risk, and next action.</p>
          <Link prefetch={false} className="secondary-action" href="/checklists/ai-content-quality-gate/">
            View content gate
          </Link>
        </aside>
      </section>

      <RouteFlowBridge
        current="route-file"
        eyebrow="Release context"
        nextHref="/execution/"
        nextLabel="Open current workbench"
      />

      <section className="updates-timeline" aria-label="site update log">
        {publicUpdates.map((entry) => (
          <article key={entry.step} className="update-entry">
            <div className="update-meta">
              <span>{entry.date}</span>
              <strong>{entry.status}</strong>
            </div>
            <div className="update-body">
              <h2>{entry.step}</h2>
              <p className="update-angle">{entry.aiAngle}</p>
              <div className="update-grid">
                <section>
                  <h3>Key Points</h3>
                  <ul>
                    {entry.keyPoints.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Changed Files</h3>
                  <ul>
                    {entry.files.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Verification</h3>
                  <ul>
                    {entry.verification.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Next Action</h3>
                  <p>{entry.next}</p>
                </section>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
