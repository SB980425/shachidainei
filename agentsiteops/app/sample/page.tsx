import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  GitCompareArrows,
  ShieldCheck
} from "lucide-react";
import { RouteFileAcceptancePanel } from "@/components/RouteFileAcceptancePanel";
import { siteUrl } from "@/lib/site";

const path = "/sample/";

export const metadata: Metadata = {
  title: "Sample Route File",
  description:
    "A sample AgentSiteOps route file showing selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, stop rule, and unproven claims.",
  alternates: { canonical: path },
  openGraph: {
    title: "Sample Route File",
    description:
      "Preview the route-file structure before using the AgentSiteOps research workflow.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const inputSnapshot = [
  {
    label: "Project",
    value: "AI-capable solo builder with several possible services and no clear first buyer."
  },
  {
    label: "Available proof",
    value: "Two private demos, one public workflow screenshot, and no confirmed payment yet."
  },
  {
    label: "Constraint",
    value: "Seven-day validation window, no paid ads, no regulated advice, no private account takeover."
  },
  {
    label: "Decision needed",
    value: "Choose one route to test first, or stop before building more pages."
  }
];

const selectedRoute = [
  {
    label: "Selected route",
    value:
      "Pilot a narrow AI intake and follow-up workflow setup for solo consultants before building a broader agency, course, or tool."
  },
  {
    label: "Confidence",
    value:
      "Medium for delivery feasibility; low for paid demand until qualified replies or payment plus usable intake exists."
  },
  {
    label: "Reason",
    value:
      "The route uses existing build ability, can be explained in one page, and can produce a first proof asset without search traffic."
  }
];

const rejectedAlternatives = [
  {
    route: "Broad AI automation agency",
    reason:
      "Rejected because it requires general trust, multiple service lines, and stronger proof than the current asset set supports."
  },
  {
    route: "Prompt pack",
    reason:
      "Rejected because generic prompt output is easy to replace with ordinary ChatGPT use and does not prove delivery value."
  },
  {
    route: "SEO content site",
    reason:
      "Rejected because search-first validation is too slow for the current seven-day decision window."
  },
  {
    route: "AI visibility dashboard",
    reason:
      "Rejected because monitoring software needs data scale, recurring demand, and technical scope not proven by the intake."
  }
];

const evidenceLedger = [
  {
    claim: "The builder can deliver a simple workflow setup.",
    status: "Verified",
    source: "Existing demos and workflow screenshot.",
    next: "Turn one demo into a public walkthrough."
  },
  {
    claim: "Solo consultants feel repeated intake and follow-up pain.",
    status: "Inferred",
    source: "Public context and operator observation.",
    next: "Collect qualified replies from targeted outreach."
  },
  {
    claim: "Buyers will pay for this service.",
    status: "Pending",
    source: "No payment plus usable intake yet.",
    next: "Offer a small pilot and record payment or rejection."
  },
  {
    claim: "Search demand can support expansion.",
    status: "Not proven",
    source: "No GSC, Bing, or first-party search export.",
    next: "Do not scale content on search assumptions."
  }
];

const proofAsset = [
  "A one-page service route explaining the intake problem, 72-hour setup scope, included handoff, exclusions, and first CTA.",
  "One anonymized before/after workflow screenshot or walkthrough.",
  "A short outreach message that asks for a workflow review, not a broad AI transformation sale."
];

const validationChannel = [
  {
    label: "First channel",
    value: "Manual outreach to a small set of solo consultants with visible service offers."
  },
  {
    label: "Signal that counts",
    value: "Qualified reply, payment plus usable intake, or repeated objection that identifies a repair path."
  },
  {
    label: "Signal that does not count",
    value: "Page views, sitemap submission, AI-generated praise, or broad market context without buyer action."
  }
];

const stopRules = [
  "Stop this route if 30 targeted messages produce no qualified reply.",
  "Stop paid positioning if buyers ask for implementation outside the stated delivery capacity.",
  "Stop content expansion if the only evidence is search context without first-party signals.",
  "Block the route if it drifts into regulated advice, private account access, spam automation, or guaranteed outcomes."
];

const notProven = [
  "Traffic, ranking, AI citation, revenue, customer response, or product-market fit.",
  "That the selected buyer segment is the highest-value market.",
  "That the route should become software, subscription, course, or broad agency work.",
  "That public market research is enough to justify checkout or content scaling."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Sample AgentSiteOps Route File",
    description:
      "An example route file showing selected path, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page sample-route-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero sample-route-hero">
        <div>
          <p className="eyebrow">Sample route file</p>
          <h1>What the final AgentSiteOps handoff should contain.</h1>
          <p>
            This sample is a fictional route file. It shows the structure a client should
            expect after intake, manual Deep Research, coverage checking, gap repair, and
            final synthesis.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/start/">
              <ClipboardList aria-hidden="true" size={17} />
              Start with a project
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <FileText aria-hidden="true" size={17} />
              Open client workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <ArrowRight aria-hidden="true" size={17} />
              Run research workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ShieldCheck aria-hidden="true" size={17} />
              Check delivery gate
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
            Format example only. It proves the artifact structure, not traffic, payment,
            demand, ranking, AI citation, or customer outcomes.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Input snapshot</h2>
          <p>
            A route file starts from the client's actual situation. Missing inputs remain
            visible instead of being replaced by confident language.
          </p>
        </div>
        <div className="sample-snapshot-grid">
          {inputSnapshot.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <RouteFileAcceptancePanel />

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
            {rejectedAlternatives.map((item) => (
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
            Each claim is tagged before it can raise route confidence. This prevents
            public context from being treated as buyer proof.
          </p>
        </div>
        <div className="sample-ledger-table" role="table" aria-label="Sample evidence ledger">
          <div role="row">
            <strong role="columnheader">Claim</strong>
            <strong role="columnheader">Status</strong>
            <strong role="columnheader">Source</strong>
            <strong role="columnheader">Next evidence</strong>
          </div>
          {evidenceLedger.map((item) => (
            <div role="row" key={item.claim}>
              <span role="cell">{item.claim}</span>
              <span role="cell">{item.status}</span>
              <span role="cell">{item.source}</span>
              <span role="cell">{item.next}</span>
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
          <h2>Validation channel</h2>
          <div className="sample-validation-list">
            {validationChannel.map((item) => (
              <article key={item.label}>
                <ShieldCheck aria-hidden="true" size={18} />
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.value}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Stop rule</h2>
          <ul className="compact-list">
            {stopRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>What is not proven</h2>
          <ul className="compact-list">
            {notProven.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>How to use this sample</h2>
          <p>
            Compare any delivered AgentSiteOps route file against this structure. If the
            file does not choose one route, reject alternatives, tag evidence, define the
            first proof asset, name a validation channel, and state a stop rule, it is not
            complete.
          </p>
        </div>
        <div>
          <h2>Next step</h2>
          <p>
            Start with the client workflow if the project is messy, or use the prompt pack
            when the intake boundary is already clear enough for manual Deep Research.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <FileText aria-hidden="true" size={17} />
              Client workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ShieldCheck aria-hidden="true" size={17} />
              Delivery gate
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              <ShieldCheck aria-hidden="true" size={17} />
              Route basis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
