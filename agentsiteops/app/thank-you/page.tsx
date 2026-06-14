import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ClipboardCheck, FileText, Mail, ShieldCheck } from "lucide-react";
import {
  deliveryProcessSteps,
  intakeFields,
  launchProduct,
  paymentConfirmationFields
} from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/thank-you/";

const responseExpectations = [
  {
    label: "Automatic receipt",
    body:
      "The site can preserve the intake packet and show that the request has been received."
  },
  {
    label: "Manual acceptance",
    body:
      "A person checks whether the project is inside scope, whether evidence can be used, and whether a Route File can be produced."
  },
  {
    label: "Repair or block",
    body:
      "If facts, rights, buyer evidence, or delivery capacity are missing, the next message is a repair request or blocked reason."
  },
  {
    label: "Route File handoff",
    body:
      "Accepted work returns one selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule."
  }
];

export const metadata: Metadata = {
  title: "Route File Next Steps",
  description: "Next steps after payment or purchase intent for the AgentSiteOps Route File.",
  alternates: { canonical: path },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Route File Next Steps",
    description: "Send usable intake details before manual Route File delivery can start.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  return (
    <main className="gate-page">
      <section className="gate-hero">
        <div>
          <p className="eyebrow">Next step</p>
          <h1>Turn purchase intent into a usable work order.</h1>
          <p>
            Payment alone is not enough to start the manual Route File. AgentSiteOps starts work
            only after the purchase record and project intake are specific enough to judge route,
            evidence, proof asset, validation channel, and stop rule.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/intake/">
              <Mail aria-hidden="true" size={17} />
              Open intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ClipboardCheck aria-hidden="true" size={17} />
              Delivery gate
            </Link>
            <Link prefetch={false} className="secondary-action" href="/refund-policy/">
              <ShieldCheck aria-hidden="true" size={17} />
              Refund policy
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Support email</strong>
          <p>{launchProduct.supportEmail}</p>
          <dl>
            <div>
              <dt>Start condition</dt>
              <dd>Payment record plus usable intake.</dd>
            </div>
            <div>
              <dt>Manual boundary</dt>
              <dd>No account, dashboard, hidden research run, or automatic route result.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="gate-section thank-response-panel">
        <div className="section-head">
          <h2>What happens after submission</h2>
          <p>
            There is no hidden automatic research run. The next visible state is receipt,
            manual acceptance, repair/block, or Route File handoff.
          </p>
        </div>
        <div className="thank-response-grid">
          {responseExpectations.map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section next-step-board">
        <article>
          <FileText aria-hidden="true" size={22} />
          <span>Payment record</span>
          <h2>Identify what was purchased</h2>
          <ul className="compact-list">
            {paymentConfirmationFields.slice(0, 4).map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </article>
        <article>
          <ClipboardCheck aria-hidden="true" size={22} />
          <span>Project intake</span>
          <h2>Send decision material</h2>
          <ul className="compact-list">
            {intakeFields.slice(0, 5).map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </article>
        <article className="is-warning">
          <AlertTriangle aria-hidden="true" size={22} />
          <span>Not enough</span>
          <h2>These do not start delivery</h2>
          <ul className="compact-list">
            <li>A PayPal click without confirmed payment.</li>
            <li>A broad idea with no buyer, proof, or delivery constraint.</li>
            <li>Requests for guaranteed traffic, revenue, ranking, or AI citation.</li>
            <li>Secrets, credentials, payment data, or regulated private records.</li>
          </ul>
        </article>
      </section>

      <section className="gate-section">
        <div className="handoff-flow">
          {deliveryProcessSteps.map((step) => (
            <article key={step.title}>
              <span>{step.title.split(".")[0]}</span>
              <h2>{step.title.replace(/^\d+\.\s*/, "")}</h2>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

