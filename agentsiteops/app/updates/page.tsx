import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, FileText } from "lucide-react";
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
const latestUpdate = publicUpdates[0];

const updateContextCards = [
  {
    title: "Current product state",
    body:
      "The public site now presents AgentSiteOps as a visible path from intake to operator review, approved research carrier, coverage gate, and Route File output.",
    href: "/execution/",
    label: "Open workbench",
    Icon: CheckCircle2
  },
  {
    title: "Where visitors should act",
    body:
      "A visitor should move from a page explanation into intake, sample inspection, delivery gate, or the workbench without guessing what the next click means.",
    href: "/intake/",
    label: "Open intake",
    Icon: ClipboardList
  },
  {
    title: "What this log proves",
    body:
      "Updates prove changed files, verification scope, and deployment state. They do not prove traffic, revenue, ranking, or buyer demand.",
    href: "/sample/",
    label: "View output",
    Icon: FileText
  }
];

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
          <strong>Latest state</strong>
          <p>{latestUpdate ? latestUpdate.step : "No public update entries are available."}</p>
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

      <section className="updates-context-panel" aria-label="Updates page role">
        <div>
          <span>Page role</span>
          <h2>Updates explain what changed; the product path still lives in intake and workbench.</h2>
          <p>
            This page is a verification ledger. It should send users back to the live
            customer path instead of acting like the main product interface.
          </p>
        </div>
        <div className="updates-context-grid">
          {updateContextCards.map((item) => {
            const Icon = item.Icon;

            return (
              <article key={item.title}>
                <Icon aria-hidden="true" size={19} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link prefetch={false} href={item.href}>
                  {item.label}
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

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
