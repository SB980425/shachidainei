import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, Mail } from "lucide-react";
import {
  deliveryProcessSteps,
  intakeFields,
  launchProduct,
  paymentConfirmationFields,
  starterReviewProduct
} from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/intake/";

export const metadata: Metadata = {
  title: "Order Intake",
  description:
    "Project details needed after buying the AgentSiteOps Fit Review or Route File.",
  alternates: { canonical: path },
  openGraph: {
    title: "Order Intake",
    description: "Send these details after payment so the manual review or Route File can be delivered.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Order Intake",
    description: "Project details needed after buying the AgentSiteOps Fit Review or Route File.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };
  const mailSubject = encodeURIComponent("AgentSiteOps order intake");
  const mailBody = encodeURIComponent(
    [
      "Payment confirmation",
      ...paymentConfirmationFields.map((field) => `- ${field}:`),
      "",
      "Project intake",
      ...intakeFields.map((field) => `- ${field}:`)
    ].join("\n")
  );

  return (
    <main className="gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="gate-hero">
        <div>
          <p className="eyebrow">Post-payment intake</p>
          <h1>Send the details needed for manual delivery.</h1>
          <p>
            The site does not use a login system yet. After payment for the Fit Review or
            Route File, send the details below so the manual deliverable can be prepared.
          </p>
          <div className="hero-actions">
            <a
              className="primary-action"
              data-analytics-event="intake_email_click"
              data-analytics-label="intake_mailto"
              href={`mailto:${launchProduct.supportEmail}?subject=${mailSubject}&body=${mailBody}`}
            >
              <Mail aria-hidden="true" size={17} />
              Email intake
            </a>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Delivery clock</strong>
          <p>{starterReviewProduct.timeline}</p>
          <p>{launchProduct.timeline}</p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Payment confirmation</h2>
          <p>
            Send enough payment evidence to match the PayPal payment to the manual
            delivery request. Do not send card numbers or bank details.
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
          <h2>Project intake fields</h2>
          <p>Use concise factual answers. Do not send passwords, private API keys, bank details, or account recovery information.</p>
        </div>
        <div className="loop-grid">
          {intakeFields.map((field, index) => (
            <article key={field}>
              <span>{index + 1}</span>
              <h3>{field}</h3>
              <p>Provide the shortest useful version. Links are acceptable when they are public and safe to inspect.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Manual delivery process</h2>
          <p>
            This is a service workflow, not an automated account portal. The process is
            designed to reject unsafe or under-evidenced orders before they turn into vague work.
          </p>
        </div>
        <div className="workflow-grid">
          {deliveryProcessSteps.map((step) => (
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

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Ready to send</h2>
          <ul className="compact-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Payment evidence can be matched to the order.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Public links or examples are safe to inspect.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              The project does not require regulated advice or private account access.
            </li>
          </ul>
        </div>
        <div>
          <h2>Delivery pause triggers</h2>
          <ul className="compact-list">
            <li>Missing payment confirmation.</li>
            <li>Secrets, passwords, account recovery details, or private customer data in the intake.</li>
            <li>Requests for guaranteed traffic, ranking, revenue, customers, approvals, or unsafe automation.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
