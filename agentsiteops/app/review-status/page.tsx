import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  ShieldCheck
} from "lucide-react";
import { ClientRouteStatePanel } from "@/components/ClientRouteStatePanel";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import { ReviewStatusConsole } from "@/components/ReviewStatusConsole";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteProjectLifecycle } from "@/components/RouteProjectLifecycle";
import { RouteStageHeader } from "@/components/RouteStageHeader";
import { siteUrl } from "@/lib/site";

const path = "/review-status/";

export const metadata: Metadata = {
  title: "Review Status",
  description:
    "A customer-facing AgentSiteOps status page showing what happens after intake: ready, repair, blocked, or not delivery before scope lock or Route File work starts.",
  alternates: { canonical: path },
  openGraph: {
    title: "Review Status",
    description:
      "See the valid responses after a project intake is sent, and what happens before scope lock, research, or Route File delivery.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const exampleSteps = [
  {
    label: "Client input",
    body:
      "A customer submits an AI support workflow draft with buyer notes, current blocker, existing examples, and delivery constraints."
  },
  {
    label: "Website receipt",
    body:
      "The site formats the packet, detects the saved Plan Studio brief, and exposes that receipt is not acceptance."
  },
  {
    label: "Manual review",
    body:
      "The operator checks buyer specificity, source rights, proof asset, rejected alternatives, blocked claims, and delivery limits."
  },
  {
    label: "Response",
    body:
      "The returned state is repair: provide one inspectable proof asset and clarify source boundary before Scope Lock."
  }
];

const notAutomatic = [
  "No hidden research run starts after the email opens.",
  "No API call is made by the public page.",
  "No Route File is synthesized before manual acceptance.",
  "No payment, traffic, ranking, AI citation, or buyer response is claimed from the status alone."
];

export default function ReviewStatusPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AgentSiteOps Review Status",
    description:
      "A customer-facing status page showing ready, repair, blocked, and not-delivery outcomes after project intake.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page review-status-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero review-status-hero">
        <div>
          <p className="eyebrow">Review status</p>
          <h1>After intake, the response is a state decision.</h1>
          <p>
            A customer submission does not automatically become research or a Route File.
            The next visible result is ready, repair, blocked, or not delivery, with a
            concrete next action.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#review-status-console">
              <FileCheck2 aria-hidden="true" size={17} />
              Inspect states
            </a>
            <Link prefetch={false} className="secondary-action" href="/idea-risk-test/">
              <Gauge aria-hidden="true" size={17} />
              Test idea risk
            </Link>
            <Link prefetch={false} className="secondary-action" href="/intake/">
              <ClipboardList aria-hidden="true" size={17} />
              Build intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View Route File
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Core rule</strong>
          <p>
            Receipt means the packet exists. Acceptance means the operator has approved
            it for Scope Lock. These are separate states.
          </p>
        </aside>
      </section>

      <RouteStageHeader
        current="intake"
        title="Review Status sits between intake receipt and scope lock."
        body="This page shows what the customer can expect after sending a packet, before research or final delivery begins."
      />

      <RouteFlowBridge
        current="intake"
        eyebrow="Submission response"
        nextHref="/scope/"
        nextLabel="Scope accepted projects"
      />

      <RouteProjectLifecycle
        current="intake"
        eyebrow="Customer state"
        title="The intake state is only complete when the response state is visible."
        body="The workflow should not make customers infer what happens after submission. It must show automatic receipt, manual review, response state, and next action."
      />

      <ClientRouteStatePanel
        current="intake"
        title="The customer sees a response state before research starts."
        body="The website can prepare and send the packet. The operator returns ready, repair, blocked, or not delivery before any evidence carrier runs."
        compact
      />

      <CustomerResponseLifecycle
        variant="compact"
        eyebrow="Manual response"
        title="A response state must come before research."
        body="Ready projects move to Scope Lock. Repair, blocked, and not-delivery responses return to the correct state without hidden automation."
      />

      <ReviewStatusConsole />

      <section className="gate-section review-example-section">
        <div className="section-head">
          <h2>Example: from submitted packet to response.</h2>
          <p>
            This is the missing customer-facing proof: the visitor can see what happens
            after sending a messy project, without needing to understand the technical
            implementation.
          </p>
        </div>
        <div className="review-example-grid">
          {exampleSteps.map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split review-boundary-section">
        <div>
          <h2>What is not automatic</h2>
          <ul className="compact-list">
            {notAutomatic.map((item) => (
              <li key={item}>
                <ShieldCheck aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>What can happen next</h2>
          <p>
            Ready projects move to Scope Lock. Repair projects return to the free idea
            risk test, Plan Studio, or Intake. Blocked requests should inspect the
            blocked example. Non-delivery material goes to the Delivery Gate before
            anyone calls it a Route File.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/idea-risk-test/">
              <Gauge aria-hidden="true" size={17} />
              Re-test risk
            </Link>
            <Link prefetch={false} className="primary-action" href="/scope/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Scope Lock
            </Link>
            <Link prefetch={false} className="secondary-action" href="/examples/blocked-intake/">
              <ShieldCheck aria-hidden="true" size={17} />
              Blocked example
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              Delivery Gate
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
