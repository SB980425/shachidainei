import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Mail,
  ShieldCheck
} from "lucide-react";
import {
  intakeFields,
  launchProduct,
  paymentConfirmationFields
} from "@/lib/launch";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import { IntakePacketBuilder } from "@/components/IntakePacketBuilder";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { buildProjectIntakePacket } from "@/lib/intakePacket";
import { siteUrl } from "@/lib/site";

const path = "/intake/";

export const metadata: Metadata = {
  title: "Project Intake",
  description:
    "Project context, source boundaries, constraints, and optional order confirmation for AgentSiteOps route review.",
  alternates: { canonical: path },
  openGraph: {
    title: "Project Intake",
    description:
      "Send project facts first. Payment confirmation is only needed when a Fit Review or Route File order already exists.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const intakeTriageRows = [
  {
    label: "Ready",
    title: "Scope can be locked",
    body:
      "The project facts, source boundary, risks, and candidate routes are specific enough to create a research brief.",
    Icon: CheckCircle2
  },
  {
    label: "Repair",
    title: "More context required",
    body:
      "The route question is useful, but the intake lacks examples, evidence, constraints, or rejected alternatives.",
    Icon: AlertTriangle
  },
  {
    label: "Blocked",
    title: "Do not start delivery",
    body:
      "The request depends on private access, unsafe regulated advice, copied data, or guaranteed traffic, ranking, revenue, or buyer response.",
    Icon: ShieldCheck
  }
];

const intakeProcessSteps = [
  {
    title: "1. Receive project facts",
    body:
      "Project context, source material, constraints, candidate routes, and delivery limits are collected before any route decision."
  },
  {
    title: "2. Screen readiness",
    body:
      "The intake is marked ready, repair, or blocked so weak material does not become unsupported route work."
  },
  {
    title: "3. Lock the research boundary",
    body:
      "A narrow research brief is prepared only after the route question, source rules, and unacceptable claims are clear."
  },
  {
    title: "4. Hand off the Route File path",
    body:
      "Accepted research becomes one selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule."
  }
];

const submissionStates = [
  {
    label: "Automatic receipt",
    status: "Website",
    body:
      "The request can be formatted, copied, emailed, and stored in the browser session as a packet. This confirms submission only.",
    next: "Missing fields are visible before review."
  },
  {
    label: "Manual acceptance",
    status: "Operator",
    body:
      "A person checks whether the project is safe, scoped, evidenced, and specific enough for route work.",
    next: "Ready, repair, blocked, or not delivery."
  },
  {
    label: "Research carrier",
    status: "Approved path",
    body:
      "Research may use manual source review, a client report, an operator-controlled pass, or another approved carrier.",
    next: "Returned material enters the coverage gate."
  },
  {
    label: "Route File output",
    status: "Handoff",
    body:
      "Accepted material becomes selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
    next: "The client receives one execution boundary."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Project Intake",
    description:
      "Project context, source boundaries, constraints, and optional order confirmation for AgentSiteOps route review.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };
  const mailSubject = encodeURIComponent("AgentSiteOps project intake");
  const mailBody = encodeURIComponent(buildProjectIntakePacket(true));

  return (
    <main className="gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="gate-hero">
        <div>
          <p className="eyebrow">Project intake</p>
          <h1>Send the context needed to judge the route.</h1>
          <p>
            Use this page before a Fit Review or Route File begins. The intake answers
            decide whether the project is ready, needs repair, or must stay blocked.
            Payment evidence is only needed when an order already exists.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <ClipboardList aria-hidden="true" size={17} />
              Draft plan first
            </Link>
            <a
              className="secondary-action"
              data-analytics-event="intake_email_click"
              data-analytics-label="intake_mailto"
              href={`mailto:${launchProduct.supportEmail}?subject=${mailSubject}&body=${mailBody}`}
            >
              <Mail aria-hidden="true" size={17} />
              Email project intake
            </a>
            <a className="secondary-action" href="#intake-packet">
              <ClipboardList aria-hidden="true" size={17} />
              Build packet
            </a>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View output
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>What gets checked</strong>
          <p>
            Facts, source rights, constraints, candidate routes, buyer proof, and
            delivery ability are checked before the route path is accepted.
          </p>
          <dl>
            <div>
              <dt>Main decision</dt>
              <dd>Ready, repair, blocked, or stop.</dd>
            </div>
            <div>
              <dt>Payment role</dt>
              <dd>Order matching only.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <RouteFlowBridge current="intake" nextHref="/how-it-works/" nextLabel="Continue to scope lock" />

      <section className="gate-section intake-submission-section">
        <div className="section-head">
          <h2>After the intake is sent</h2>
          <p>
            The site can create the packet and next-state visibility. It does not
            automatically accept the project, run hidden research, or produce a route
            without manual review and coverage checking.
          </p>
        </div>
        <div className="intake-submission-grid">
          {submissionStates.map((item, index) => (
            <article key={item.label}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.status}</strong>
              </div>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
              <small>
                {item.next}
                <ArrowRight aria-hidden="true" size={14} />
              </small>
            </article>
          ))}
        </div>
      </section>

      <CustomerResponseLifecycle
        variant="compact"
        eyebrow="Submission is not acceptance"
        title="The customer sees receipt first; route work starts only after manual acceptance."
        body="This keeps the intake page aligned with the full site promise: visible state, approved research carrier, coverage gate, and checked Route File output."
      />

      <IntakePacketBuilder />

      <section className="gate-section">
        <div className="section-head">
          <h2>Project intake fields</h2>
          <p>Use concise factual answers. Do not send passwords, private API keys, bank details, account recovery information, or private customer data.</p>
        </div>
        <div className="loop-grid">
          {intakeFields.map((field, index) => (
            <article key={field}>
              <span>{index + 1}</span>
              <h3>{field}</h3>
              <p>Provide the shortest useful version. Public links are acceptable when they are safe to inspect.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Intake triage</h2>
          <p>
            The first pass separates usable project context from missing context and
            blocked requests before any research or delivery promise is made.
          </p>
        </div>
        <div className="start-readiness-panel">
          {intakeTriageRows.map((item) => {
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

      <section className="gate-section">
        <div className="section-head">
          <h2>Payment confirmation if already ordered</h2>
          <p>
            Send enough evidence to match the PayPal payment to the manual request
            only when a Fit Review or Route File order already exists. Do not send card
            numbers or bank details.
          </p>
        </div>
        <div className="loop-grid">
          {paymentConfirmationFields.map((field, index) => (
            <article key={field}>
              <span>{index + 1}</span>
              <h3>{field}</h3>
              <p>Use the exact value from PayPal or from the email address used for the order.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Manual intake process</h2>
          <p>
            This is a service workflow, not an automated account portal. The process
            rejects unsafe or under-evidenced requests before they turn into vague work.
          </p>
        </div>
        <div className="workflow-grid">
          {intakeProcessSteps.map((step) => (
            <article className="workflow-card" key={step.title}>
              <span>
                <ClipboardList aria-hidden="true" size={18} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split intake-ready-split">
        <div>
          <h2>Ready to send</h2>
          <ul className="compact-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              The project goal, buyer, delivery ability, and current blocker are clear.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Public links, demos, examples, notes, or source limits are safe to inspect.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              The project does not require regulated advice or private account access.
            </li>
          </ul>
        </div>
        <div>
          <h2>Pause triggers</h2>
          <ul className="compact-list">
            <li>
              <AlertTriangle aria-hidden="true" size={16} />
              The route question is too broad to research without inventing context.
            </li>
            <li>
              <AlertTriangle aria-hidden="true" size={16} />
              Payment confirmation is missing for an already ordered manual deliverable.
            </li>
            <li>
              <AlertTriangle aria-hidden="true" size={16} />
              Secrets, passwords, account recovery details, or private customer data in the intake.
            </li>
            <li>
              <AlertTriangle aria-hidden="true" size={16} />
              Requests for guaranteed traffic, ranking, revenue, customers, approvals, or unsafe automation.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
