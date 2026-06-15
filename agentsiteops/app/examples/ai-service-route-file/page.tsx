import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  ShieldCheck
} from "lucide-react";
import { siteUrl } from "@/lib/site";

const path = "/examples/ai-service-route-file/";

export const metadata: Metadata = {
  title: "AI Service Route File Example",
  description:
    "A complete AgentSiteOps proof case showing how a messy AI service idea becomes a selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
  alternates: { canonical: path },
  openGraph: {
    title: "AI Service Route File Example",
    description:
      "Inspect a complete route-file proof case before submitting a project plan.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "article"
  }
};

const intakeSnapshot = [
  {
    label: "Messy input",
    value:
      "Builder can create AI automations, has several demos, but cannot choose between setup service, dashboard, template pack, or broad agency."
  },
  {
    label: "Buyer guess",
    value:
      "Solo consultants and small service teams who lose time answering repeated intake and follow-up questions."
  },
  {
    label: "Available assets",
    value:
      "Two workflow notes, one before/after support triage demo, rough landing copy, and manual setup capacity."
  },
  {
    label: "Constraint",
    value:
      "No hidden research claim, no guaranteed revenue, no private customer data, no promise of fully autonomous support."
  }
];

const selectedRoute = [
  {
    label: "Selected route",
    value:
      "72-hour AI intake and follow-up workflow setup for solo consultants."
  },
  {
    label: "Why this route",
    value:
      "It is narrow enough to explain, can be delivered manually, and can create a first proof asset without waiting for search traffic."
  },
  {
    label: "Confidence",
    value:
      "Medium for delivery feasibility; still low for paid demand until qualified replies or payment plus usable intake exists."
  }
];

const rejectedRoutes = [
  {
    route: "AI automation agency",
    reason:
      "Too broad for the current proof. It would require multiple offers, stronger trust, and a wider delivery team."
  },
  {
    route: "SaaS dashboard",
    reason:
      "Rejected until repeated manual workflow demand and data access are proven."
  },
  {
    route: "Prompt pack",
    reason:
      "Generic prompt packs are easy to replace and do not prove the builder can deliver a business workflow."
  },
  {
    route: "SEO content launch",
    reason:
      "Search-first validation is too slow for the seven-day route decision window."
  }
];

const evidenceLedger = [
  {
    claim: "The builder can set up the workflow manually.",
    status: "Verified",
    source: "Existing workflow notes and support triage demo.",
    decision: "Allowed to proceed as a manual service route."
  },
  {
    claim: "Solo consultants have the repeated intake problem.",
    status: "Inferred",
    source: "Public service pages and observed manual reply patterns.",
    decision: "Needs outreach replies before confidence can rise."
  },
  {
    claim: "Buyers will pay USD 149-299.",
    status: "Pending",
    source: "No paid order or qualified budget signal yet.",
    decision: "Do not claim pricing validation."
  },
  {
    claim: "The route can become software.",
    status: "Blocked",
    source: "No repeated usage, no data rights, no retention need.",
    decision: "Block SaaS positioning for this cycle."
  }
];

const proofAsset = [
  "One page describing the consultant intake problem, 72-hour setup scope, handoff notes, exclusions, and first CTA.",
  "One anonymized before/after workflow screenshot or narrated walkthrough.",
  "One outreach message asking for a workflow review, not a broad AI transformation sale."
];

const validationPlan = [
  {
    day: "Day 1",
    action: "Freeze the route statement and remove all broad agency, dashboard, and autonomous support claims."
  },
  {
    day: "Day 2",
    action: "Publish or prepare the first proof asset and the service-scope page."
  },
  {
    day: "Day 3",
    action: "List 30 reachable solo consultants with visible intake or follow-up friction."
  },
  {
    day: "Days 4-5",
    action: "Send the workflow review message and record qualified replies, objections, and non-responses."
  },
  {
    day: "Day 6",
    action: "Repair the offer if objections repeat around scope, trust, price, or implementation."
  },
  {
    day: "Day 7",
    action: "Continue, repackage, or stop based on qualified replies and proof-asset inspection."
  }
];

const stopRules = [
  "Stop the route if 30 targeted outreach attempts produce no qualified reply.",
  "Stop paid positioning if buyers only ask for unsupported full automation.",
  "Stop software claims until manual delivery repeats and data rights are clear.",
  "Stop expansion if the only evidence is page views, generated praise, or broad market context."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "AI Service Route File Example",
    description:
      "A complete proof case for turning a messy AI service idea into a checked Route File.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page proof-case-page ai-service-proof-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero proof-case-hero">
        <div>
          <p className="eyebrow">Proof case</p>
          <h1>AI service route file example.</h1>
          <p>
            This example shows the full AgentSiteOps output path: messy AI-service
            input becomes one selected route, rejected alternatives, evidence ledger,
            first proof asset, validation channel, and stop rule.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <ClipboardList aria-hidden="true" size={17} />
              Draft your plan
            </Link>
            <Link prefetch={false} className="secondary-action" href="/examples/blocked-intake/">
              <ShieldCheck aria-hidden="true" size={17} />
              Compare blocked intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Back to sample
            </Link>
          </div>
        </div>
        <aside className="decision-card proof-verdict-card">
          <strong>Verdict</strong>
          <p>
            Proceed with a narrow manual service route. Do not build a dashboard,
            course, SEO batch, or broad agency page until buyer evidence appears.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Input snapshot</h2>
          <p>
            The route file starts by preserving the messy input instead of hiding it.
          </p>
        </div>
        <div className="proof-case-grid">
          {intakeSnapshot.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Selected route</h2>
          <div className="sample-route-stack">
            {selectedRoute.map((item) => (
              <article key={item.label}>
                <CheckCircle2 aria-hidden="true" size={18} />
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.value}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2>Rejected alternatives</h2>
          <div className="sample-route-stack is-rejected">
            {rejectedRoutes.map((item) => (
              <article key={item.route}>
                <AlertTriangle aria-hidden="true" size={18} />
                <div>
                  <h3>{item.route}</h3>
                  <p>{item.reason}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Evidence ledger</h2>
          <p>
            Claims only raise confidence when their source and decision effect are visible.
          </p>
        </div>
        <div className="sample-ledger-table proof-ledger-table" role="table" aria-label="AI service evidence ledger">
          <div role="row">
            <strong role="columnheader">Claim</strong>
            <strong role="columnheader">Status</strong>
            <strong role="columnheader">Source</strong>
            <strong role="columnheader">Decision</strong>
          </div>
          {evidenceLedger.map((item) => (
            <div role="row" key={item.claim}>
              <span role="cell">{item.claim}</span>
              <span role="cell">{item.status}</span>
              <span role="cell">{item.source}</span>
              <span role="cell">{item.decision}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>First proof asset</h2>
          <ul className="compact-list">
            {proofAsset.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Stop rules</h2>
          <ul className="compact-list">
            {stopRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Seven-day validation path</h2>
          <p>
            The route file is useful only if it creates a visible next action and a stop date.
          </p>
        </div>
        <div className="proof-timeline">
          {validationPlan.map((item) => (
            <article key={item.day}>
              <span>{item.day}</span>
              <p>{item.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-final-cta proof-final-cta">
        <div>
          <span>Use this as the benchmark</span>
          <h2>A real Route File must explain what to do and what not to build.</h2>
          <p>
            If a delivery lacks rejected alternatives, evidence tags, first proof asset,
            validation channel, or stop rule, it is still a loose report.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/plan/">
            <ClipboardList aria-hidden="true" size={17} />
            Draft your plan
          </Link>
          <Link prefetch={false} className="secondary-action" href="/intake/">
            <FileCheck2 aria-hidden="true" size={17} />
            Build intake packet
          </Link>
        </div>
      </section>
    </main>
  );
}
