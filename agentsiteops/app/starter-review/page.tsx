import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, CreditCard, FileText, ShieldAlert, TimerReset } from "lucide-react";
import {
  starterReviewAcceptanceCriteria,
  starterReviewDeliverables,
  starterReviewProduct
} from "@/lib/launch";
import { primaryOffer, starterOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/starter-review/";

export const metadata: Metadata = {
  title: "Fit Review",
  description:
    "A USD 29 manual pre-purchase review that decides whether the full AgentSiteOps Launch Blueprint is worth buying.",
  alternates: { canonical: path },
  openGraph: {
    title: "AgentSiteOps Fit Review",
    description:
      "Pay USD 29 for a manual go, narrow, or stop verdict before buying the full Launch Blueprint.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const decisionCards = [
  {
    title: "One verdict",
    body: starterReviewDeliverables[0]
  },
  {
    title: "One blocker",
    body: starterReviewDeliverables[1]
  },
  {
    title: "One next step",
    body: starterReviewDeliverables[4]
  }
];

const processSteps = [
  "Pay with PayPal and send the intake facts.",
  "The review checks buyer fit, proof, risk, and route clarity.",
  "You receive a short verdict that can approve, narrow, or reject the larger sale."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: starterOffer.name,
    description: starterOffer.delivery,
    price: String(starterOffer.price),
    priceCurrency: starterOffer.currency,
    url: `${siteUrl}${path}`,
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "AgentSiteOps",
      url: siteUrl
    }
  };

  return (
    <main className="pricing-page conversion-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="decision-hero">
        <div className="decision-hero-copy">
          <p className="eyebrow">USD {starterOffer.price} fit verdict</p>
          <h1>Get a go, narrow, or stop verdict before you buy the full blueprint.</h1>
          <p>
            The Fit Review is the smallest paid step. It exists to reject the larger sale
            when your offer, buyer, evidence, or execution route is not ready.
          </p>
          <div className="hero-actions hero-actions-tight">
            <a
              className="primary-action"
              data-analytics-event="payment_cta_click"
              data-analytics-label="starter_review_paypal"
              data-analytics-type="starter_review"
              href={starterOffer.href}
              rel="noreferrer"
              target="_blank"
            >
              <CreditCard aria-hidden="true" size={17} />
              Pay USD {starterOffer.price} for the verdict
            </a>
            <Link className="secondary-action" href="/examples/fit-review-sample/">
              <FileText aria-hidden="true" size={17} />
              See sample
            </Link>
            <Link className="secondary-action" href="/intake/">
              <ArrowRight aria-hidden="true" size={17} />
              Intake fields
            </Link>
          </div>
        </div>

        <aside className="decision-ticket" aria-label="Fit Review decision card">
          <div className="receipt-topline">
            <span>Manual review</span>
            <strong>USD {starterOffer.price}</strong>
          </div>
          <h2>{starterOffer.name}</h2>
          <div className="verdict-stack verdict-stack-light">
            <span>
              <CheckCircle2 aria-hidden="true" size={14} />
              Go
            </span>
            <span className="is-active">
              <TimerReset aria-hidden="true" size={14} />
              Narrow
            </span>
            <span>
              <ShieldAlert aria-hidden="true" size={14} />
              Stop
            </span>
          </div>
          <dl className="decision-facts">
            <div>
              <dt>Delivery</dt>
              <dd>{starterReviewProduct.timeline}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>Short verdict, not a full launch artifact.</dd>
            </div>
            <div>
              <dt>Boundary</dt>
              <dd>Can reject the larger sale before the USD {primaryOffer.price} blueprint.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>What you receive</h2>
          <p>
            The output is intentionally narrow. It answers the payment decision before
            more site, UI, content, or automation work begins.
          </p>
        </div>
        <div className="decision-card-grid">
          {decisionCards.map((item) => (
            <article key={item.title}>
              <BadgeDollarSign aria-hidden="true" size={18} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split compact-home-section">
        <div>
          <h2>Buy when</h2>
          <ul className="compact-list">
            <li>You can build or deliver, but the buyer and offer are still unclear.</li>
            <li>You need a paid decision before buying the full USD {primaryOffer.price} blueprint.</li>
            <li>You can send enough evidence for a 24-hour manual review.</li>
          </ul>
        </div>
        <div>
          <h2>Do not buy when</h2>
          <ul className="compact-list">
            <li>You need guaranteed traffic, rankings, citations, revenue, or customers.</li>
            <li>You need legal, financial, medical, tax, safety, or other regulated advice.</li>
            <li>You expect a dashboard, login, subscription, or automated fulfillment.</li>
          </ul>
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>How the review works</h2>
          <p>
            Payment alone is not enough. A usable intake is required before the verdict
            can be delivered.
          </p>
        </div>
        <div className="decision-ladder">
          {processSteps.map((step, index) => (
            <article key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section evidence-disclosure">
        <div className="section-head">
          <h2>Acceptance rule</h2>
          <p>{starterReviewAcceptanceCriteria[0].body}</p>
        </div>
        <div className="hero-actions">
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="starter_review_bottom_paypal"
            data-analytics-type="starter_review"
            href={starterOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay USD {starterOffer.price}
          </a>
          <Link className="secondary-action" href="/pricing/">
            <ArrowRight aria-hidden="true" size={17} />
            Compare offers
          </Link>
        </div>
      </section>
    </main>
  );
}
