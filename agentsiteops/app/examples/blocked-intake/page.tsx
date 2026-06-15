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

const path = "/examples/blocked-intake/";

export const metadata: Metadata = {
  title: "Blocked Intake Example",
  description:
    "A non-delivery AgentSiteOps example showing when a project intake should be repaired or blocked instead of becoming a Route File.",
  alternates: { canonical: path },
  openGraph: {
    title: "Blocked Intake Example",
    description:
      "Inspect why weak input, missing source rights, and unsupported promises should not become a Route File.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "article"
  }
};

const blockedInput = [
  {
    label: "Project claim",
    value:
      "Build an AI service that guarantees new client leads and ranks on Google within a month."
  },
  {
    label: "Target user",
    value:
      "Any business owner who wants more customers."
  },
  {
    label: "Source material",
    value:
      "No public sample, no workflow screenshot, no buyer replies, no source list, and no usable demo."
  },
  {
    label: "Requested output",
    value:
      "A launch route, pricing page, outreach copy, and payment path."
  }
];

const blockers = [
  {
    title: "Buyer is not specific",
    body:
      "The intake names everyone as the buyer. Route selection needs one reachable segment with a repeated problem."
  },
  {
    title: "Evidence is missing",
    body:
      "No sample asset, buyer reply, source material, or first-party signal exists to choose a route."
  },
  {
    title: "Unsupported promises",
    body:
      "Guaranteed leads, rankings, revenue, and buyer response cannot be used as delivery claims."
  },
  {
    title: "No delivery boundary",
    body:
      "The request asks for route, pricing, outreach, and payment before scope, risks, or proof assets are known."
  }
];

const triageResult = [
  {
    state: "Automatic",
    result:
      "The website can format the packet, preserve missing fields, and show that the request is not ready."
  },
  {
    state: "Manual",
    result:
      "Operator review should return repair or blocked, not a Route File."
  },
  {
    state: "Research",
    result:
      "No approved research carrier should run until the route question and source boundary are repaired."
  }
];

const repairRequest = [
  "Name one reachable buyer segment and one repeated problem.",
  "Provide at least one inspectable asset: demo, screenshot, workflow note, public page, or source list.",
  "Remove guarantees around leads, ranking, revenue, customers, approval, or AI citation.",
  "State what can be delivered manually in the first seven days.",
  "List the routes that should be selected, rejected, or explicitly blocked."
];

const notDelivery = [
  "A confident launch plan based on broad market language.",
  "A pricing recommendation without buyer or payment evidence.",
  "An SEO or AI traffic promise without search exports or first-party signals.",
  "A payment page before proof asset, intake limits, refund boundary, and delivery capacity are visible."
];

const acceptableResubmission = [
  {
    label: "Specific buyer",
    value:
      "Solo consultants who lose time manually qualifying and following up with inbound leads."
  },
  {
    label: "Inspectable asset",
    value:
      "One before/after workflow screenshot, a rough intake flow, and two anonymized example requests."
  },
  {
    label: "Bounded goal",
    value:
      "Choose whether to test a 72-hour workflow setup service before building a dashboard or checkout page."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Blocked Intake Example",
    description:
      "A non-delivery case showing when AgentSiteOps should request repair or block a Route File.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page proof-case-page blocked-intake-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero proof-case-hero blocked-hero">
        <div>
          <p className="eyebrow">Blocked intake</p>
          <h1>This request should not become a Route File.</h1>
          <p>
            This example proves the refusal path. When the intake is too broad,
            unsupported, or missing evidence, AgentSiteOps should return repair or
            blocked instead of producing a polished plan.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <ClipboardList aria-hidden="true" size={17} />
              Repair in Plan Studio
            </Link>
            <Link prefetch={false} className="secondary-action" href="/examples/ai-service-route-file/">
              <FileText aria-hidden="true" size={17} />
              View completed case
            </Link>
            <Link prefetch={false} className="secondary-action" href="/intake/">
              <FileCheck2 aria-hidden="true" size={17} />
              Build intake packet
            </Link>
          </div>
        </div>
        <aside className="decision-card proof-verdict-card">
          <strong>Verdict</strong>
          <p>
            Block delivery. Request repair before research, pricing, outreach,
            checkout, or Route File synthesis.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Blocked input snapshot</h2>
          <p>
            The problem is not that the idea is impossible. The problem is that the
            current request cannot support a route decision.
          </p>
        </div>
        <div className="proof-case-grid">
          {blockedInput.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Why it is blocked</h2>
          <p>
            These blockers prevent the request from becoming accepted research or final delivery.
          </p>
        </div>
        <div className="blocked-reason-grid">
          {blockers.map((item) => (
            <article key={item.title}>
              <AlertTriangle aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Response state</h2>
          <div className="sample-route-stack">
            {triageResult.map((item) => (
              <article key={item.state}>
                <ShieldCheck aria-hidden="true" size={18} />
                <div>
                  <h3>{item.state}</h3>
                  <p>{item.result}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2>Repair request</h2>
          <ul className="compact-list">
            {repairRequest.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>What must not be delivered</h2>
          <ul className="compact-list">
            {notDelivery.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Acceptable resubmission</h2>
          <div className="sample-route-stack">
            {acceptableResubmission.map((item) => (
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
      </section>

      <section className="route-final-cta proof-final-cta">
        <div>
          <span>Boundary proof</span>
          <h2>The route workflow must reject weak inputs before they become deliverables.</h2>
          <p>
            This blocked case is as important as a completed sample because it shows
            the stop rule, repair path, and no-guarantee boundary in action.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/plan/">
            <ClipboardList aria-hidden="true" size={17} />
            Repair the plan
          </Link>
          <Link prefetch={false} className="secondary-action" href="/sample/">
            <FileText aria-hidden="true" size={17} />
            Back to sample
          </Link>
        </div>
      </section>
    </main>
  );
}
