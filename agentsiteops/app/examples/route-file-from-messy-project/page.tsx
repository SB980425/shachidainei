import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  ShieldCheck
} from "lucide-react";
import { RouteStageHeader } from "@/components/RouteStageHeader";
import { siteUrl } from "@/lib/site";

const path = "/examples/route-file-from-messy-project/";

export const metadata: Metadata = {
  title: "Messy Project to Route File Example",
  description:
    "A complete AgentSiteOps case showing messy input, repaired scope, selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
  alternates: { canonical: path },
  openGraph: {
    title: "Messy Project to Route File Example",
    description:
      "Inspect how a vague AI-service idea is turned into a bounded Route File without pretending the route is validated demand.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "article"
  }
};

const messyInput = [
  {
    label: "Original request",
    body:
      "I want to build an AI service, maybe a dashboard, maybe automation, maybe training, and I need a plan that can make money quickly."
  },
  {
    label: "Problem",
    body:
      "The request names several possible products but does not identify one buyer, one proof asset, or one validation channel."
  },
  {
    label: "Missing evidence",
    body:
      "No payment, no qualified reply, no public sample, no delivery boundary, and no source material that proves buyer demand."
  }
];

const repairSteps = [
  "Narrow buyer to solo consultants who repeat intake and follow-up manually.",
  "Use existing screenshots and manual workflow notes as inspectable proof material.",
  "Block claims about traffic, revenue, automation ROI, or guaranteed buyer response.",
  "Reject dashboard, prompt pack, broad agency, and SEO-content routes before selecting the first route.",
  "Set a seven-day validation window and a 30-targeted-message stop rule."
];

const routeOutput = [
  {
    label: "Selected route",
    body:
      "Offer a narrow AI intake and follow-up workflow setup for solo consultants before building software, course content, or a broad agency."
  },
  {
    label: "Rejected alternatives",
    body:
      "Dashboard, prompt pack, broad automation agency, and search-first content site are rejected because the current proof does not support them."
  },
  {
    label: "Evidence ledger",
    body:
      "Delivery ability is verified by demos. Buyer demand is pending. Search demand and payment demand are not proven."
  },
  {
    label: "First proof asset",
    body:
      "One public before/after workflow walkthrough and one narrow outreach message asking for workflow review."
  },
  {
    label: "Validation channel",
    body:
      "Manual outreach to a small list of solo consultants with visible service offers."
  },
  {
    label: "Stop rule",
    body:
      "Stop or repair if 30 targeted messages produce no qualified reply or if buyers ask for work outside delivery capacity."
  }
];

const evidenceRows = [
  ["Builder can deliver a simple workflow setup", "Verified", "Existing demo and workflow screenshot", "Publish one walkthrough"],
  ["Solo consultants feel intake follow-up pain", "Inferred", "Public context and repeated workflow pattern", "Collect qualified replies"],
  ["Buyers will pay for this setup", "Pending", "No payment plus usable intake yet", "Offer a small pilot"],
  ["Search can validate this route", "Not proven", "No GSC or Bing route evidence yet", "Do not scale content from this claim"]
];

const finalChecks = [
  "The client can see what to do first.",
  "The client can see what not to build.",
  "The route is not presented as validated demand.",
  "Weak evidence is still marked pending or inferred.",
  "The validation window has a stop rule."
];

export default function MessyProjectCasePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Messy Project to Route File Example",
    description:
      "A complete example showing how AgentSiteOps turns vague project input into a bounded Route File.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page route-case-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero route-case-hero">
        <div>
          <p className="eyebrow">Complete case</p>
          <h1>From messy project input to one Route File.</h1>
          <p>
            This fictional case shows the full product logic: messy request, repair,
            scope lock, research boundary, coverage check, selected route, rejected
            alternatives, evidence ledger, proof asset, validation channel, and stop rule.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <ClipboardList aria-hidden="true" size={17} />
              Start your plan
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Open viewer
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Case boundary</strong>
          <p>
            This case proves the workflow shape, not buyer demand, payment, traffic,
            ranking, or AI citation.
          </p>
        </aside>
      </section>

      <RouteStageHeader
        current="route-file"
        title="This example shows the full Route Project chain."
        body="The same project moves from messy input to accepted Route File and then into validation."
      />

      <section className="gate-section route-case-section">
        <div className="section-head">
          <h2>1. Messy input</h2>
          <p>The project starts as a vague request. AgentSiteOps does not treat it as ready.</p>
        </div>
        <div className="route-case-grid">
          {messyInput.map((item) => (
            <article key={item.label}>
              <AlertTriangle aria-hidden="true" size={19} />
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section route-case-section">
        <div className="section-head">
          <h2>2. Repair before scope lock</h2>
          <p>The request becomes usable only after the missing decision boundary is repaired.</p>
        </div>
        <ol className="route-case-steps">
          {repairSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="gate-section route-case-section">
        <div className="section-head">
          <h2>3. Route File output</h2>
          <p>The handoff is one decision package, not a general strategy memo.</p>
        </div>
        <div className="route-case-output-grid">
          {routeOutput.map((item) => (
            <article key={item.label}>
              <CheckCircle2 aria-hidden="true" size={19} />
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section route-case-section">
        <div className="section-head">
          <h2>4. Evidence ledger</h2>
          <p>Claims are tagged before they influence confidence.</p>
        </div>
        <div className="route-case-table" role="table" aria-label="Messy project evidence ledger">
          <div role="row">
            <strong role="columnheader">Claim</strong>
            <strong role="columnheader">Status</strong>
            <strong role="columnheader">Source</strong>
            <strong role="columnheader">Next evidence</strong>
          </div>
          {evidenceRows.map((row) => (
            <div role="row" key={row[0]}>
              {row.map((cell) => (
                <span role="cell" key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="gate-section route-case-section">
        <div className="section-head">
          <h2>5. Final acceptance check</h2>
          <p>The case is acceptable only because the weak parts stay visible.</p>
        </div>
        <div className="route-case-check-grid">
          {finalChecks.map((item) => (
            <article key={item}>
              <ShieldCheck aria-hidden="true" size={18} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-final-cta proof-final-cta">
        <div>
          <span>Next action</span>
          <h2>Use the same structure on your own project.</h2>
          <p>
            Start with Plan Studio, repair the intake, lock the scope, run an approved
            research carrier, then accept only a Route File that passes the delivery gate.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/plan/">
            Start Plan Studio
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
            Delivery gate
          </Link>
        </div>
      </section>
    </main>
  );
}
