import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  ShieldCheck
} from "lucide-react";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { siteUrl } from "@/lib/site";

const path = "/start/";

export const metadata: Metadata = {
  title: "Start with AgentSiteOps",
  description:
    "Start with a messy project and see what AgentSiteOps needs before it can turn research, sources, constraints, and decisions into a Route File.",
  alternates: { canonical: path },
  openGraph: {
    title: "Start with AgentSiteOps",
    description:
      "What to submit, what AgentSiteOps needs, who fits, who should not use it, and what a Route File includes.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const submitItems = [
  {
    title: "Project facts",
    body:
      "What the project is, who it might serve, what already exists, what can be delivered, and what decision is stuck."
  },
  {
    title: "Source material",
    body:
      "Notes, screenshots, pages, demos, research, public references, competitor links, private material boundaries, and source limits."
  },
  {
    title: "Constraints",
    body:
      "Claims that cannot be made, regulated-advice risk, data rights, delivery capacity, payment limits, timeline, and platform boundaries."
  },
  {
    title: "Candidate routes",
    body:
      "The possible offers, sites, tools, services, content lanes, or research branches that should be compared instead of guessed."
  }
];

const fitRows = [
  {
    label: "Good fit",
    body:
      "You have several possible routes and need one selected path before building more pages, tools, checkout, content, or outreach."
  },
  {
    label: "Good fit",
    body:
      "You can provide enough facts, notes, examples, or constraints for a real research boundary."
  },
  {
    label: "Not a fit",
    body:
      "You need guaranteed traffic, ranking, AI citation, customer replies, revenue, or payment processor approval."
  },
  {
    label: "Not a fit",
    body:
      "You want hidden automatic research, opaque model output, or a tool that bypasses visible operator review."
  }
];

const routeFileItems = [
  "Selected route with confidence level and evidence basis.",
  "Rejected alternatives with evidence-based rejection reasons.",
  "Evidence ledger showing verified, pending, inferred, stale, blocked, and not-claimed items.",
  "First proof asset that can be built or shown before expansion.",
  "Validation channel, counted signal, weak signal, review window, and stop rule."
];

const readinessRows = [
  {
    label: "Ready",
    title: "Research can start",
    body:
      "Project facts, source boundary, risk limits, and candidate routes are clear enough to create a narrow research brief.",
    Icon: CheckCircle2
  },
  {
    label: "Repair",
    title: "Ask for missing context",
    body:
      "The route question is useful, but buyer proof, examples, sources, constraints, or rejected options are too thin.",
    Icon: AlertTriangle
  },
  {
    label: "Blocked",
    title: "Do not start the run",
    body:
      "The request depends on private account access, unsafe regulated advice, copied data, or guaranteed traffic, ranking, revenue, or buyer response.",
    Icon: ShieldCheck
  }
];

const startPathSteps = [
  {
    label: "Intake",
    body: "Collect facts, sources, constraints, and candidate routes."
  },
  {
    label: "Scope",
    body: "Lock what is in scope, out of scope, and not allowed as a claim."
  },
  {
    label: "Research",
    body: "Run the locked brief through an approved research channel."
  },
  {
    label: "Gate",
    body: "Mark pass, repair, blocked, or not delivery."
  },
  {
    label: "Route File",
    body: "Fuse accepted evidence into one decision file and stop rule."
  }
];

const nextSteps = [
  {
    title: "1. Prepare the intake",
    body:
      "Collect the project facts, source boundaries, constraints, and candidate routes in one place."
  },
  {
    title: "2. Run the research path",
    body:
      "Use the approved research channel or manual source-review path, then bring the report back for checking."
  },
  {
    title: "3. Apply the delivery gate",
    body:
      "Only call the output complete when the Route File contract is satisfied. Otherwise repair, block, or stop."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Start with AgentSiteOps",
    description:
      "A starting page for submitting messy project material before AgentSiteOps creates a Route File.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page start-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero start-hero">
        <div>
          <p className="eyebrow">Start here</p>
          <h1>Start with a messy project. Leave with a Route File.</h1>
          <p>
            This page explains what to submit, what we need, who is a Good fit,
            who is Not a fit, and what the final Route File must contain before
            the project enters build work.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/intake/">
              <ClipboardList aria-hidden="true" size={17} />
              Open intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample Route File
            </Link>
            <Link prefetch={false} className="secondary-action" href="/how-it-works/">
              <ArrowRight aria-hidden="true" size={17} />
              How it works
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>What we need</strong>
          <p>
            The project does not need to be polished. It does need enough facts,
            source limits, constraints, and possible routes to avoid invented context.
          </p>
          <dl>
            <div>
              <dt>Main output</dt>
              <dd>Route File</dd>
            </div>
            <div>
              <dt>Default decision</dt>
              <dd>Build, repair, block, or stop.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <RouteFlowBridge current="intake" nextHref="/how-it-works/" nextLabel="Continue to method" />

      <CustomerResponseLifecycle
        variant="compact"
        eyebrow="Start response path"
        title="Start creates a review queue, not an instant answer."
        body="The first useful outcome is intake readiness: ready, repair, blocked, or stop. Research begins only after a human/operator accepts the boundary."
      />

      <section className="gate-section start-route-path" aria-label="Start execution path">
        <div>
          <span>First path</span>
          <h2>Start means opening intake, not jumping to payment.</h2>
          <p>
            The first click should create a usable project boundary. Payment, build work,
            and public copy stay behind the route decision.
          </p>
        </div>
        <div className="start-route-path-steps">
          {startPathSteps.map((step, index) => (
            <article key={step.label}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h3>{step.label}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>What you submit</h2>
          <p>
            AgentSiteOps is designed for unclear inputs. These four groups are enough to
            start a useful route review.
          </p>
        </div>
        <div className="start-submit-grid">
          {submitItems.map((item) => (
            <article key={item.title}>
              <ClipboardList aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Intake readiness</h2>
          <p>
            The first decision is not payment. The first decision is whether the intake is
            ready for a bounded research run, needs repair, or must stay blocked.
          </p>
        </div>
        <div className="start-readiness-panel">
          {readinessRows.map((item) => {
            const Icon = item.Icon;

            return (
              <article key={item.label}>
                <span>{item.label}</span>
                <Icon aria-hidden="true" size={20} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="gate-section split-section start-fit-split">
        <div>
          <h2>Good fit</h2>
          <div className="start-fit-list">
            {fitRows
              .filter((item) => item.label === "Good fit")
              .map((item) => (
                <article key={item.body}>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <p>{item.body}</p>
                </article>
              ))}
          </div>
        </div>
        <div>
          <h2>Not a fit</h2>
          <div className="start-fit-list is-warning">
            {fitRows
              .filter((item) => item.label === "Not a fit")
              .map((item) => (
                <article key={item.body}>
                  <AlertTriangle aria-hidden="true" size={18} />
                  <p>{item.body}</p>
                </article>
              ))}
          </div>
        </div>
      </section>

      <section className="gate-section split-section start-fit-split">
        <div>
          <h2>Route File output</h2>
          <ul className="compact-list">
            {routeFileItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>What this does not replace</h2>
          <p>
            A Route File does not replace confirmed demand, paid customers, product-market
            fit, search exports, legal review, or a production build. It exists to choose
            the next route before those later stages consume more work.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <FileCheck2 aria-hidden="true" size={17} />
              Delivery gate
            </Link>
            <Link prefetch={false} className="secondary-action" href="/pricing/">
              <ShieldCheck aria-hidden="true" size={17} />
              Pricing boundary
            </Link>
          </div>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Next path</h2>
          <p>
            Start small. The route process should reduce decision uncertainty, not create
            a larger production queue.
          </p>
        </div>
        <div className="start-next-grid">
          {nextSteps.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
