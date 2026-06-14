import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CreditCard, FileText, Mail, ShieldCheck } from "lucide-react";
import {
  launchAcceptanceCriteria,
  launchDeliverables,
  launchFailureHandling,
  launchProduct
} from "@/lib/launch";
import { primaryOffer, starterOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/buy/";

export const metadata: Metadata = {
  title: "Route File Purchase Gate",
  description:
    "Check Route File fit, review intake requirements, then use PayPal for USD 99 manual delivery when the project is ready.",
  alternates: { canonical: path },
  openGraph: {
    title: "Route File Purchase Gate",
    description:
      "Review the sample, fit, and intake boundary before paying for manual Route File delivery.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const purchaseGateSteps = [
  {
    title: "1. Check route readiness",
    body:
      "Use the sample, fit checker, and intake fields before paying. If the route question is still weak, use Fit Review or repair the intake first."
  },
  {
    title: "2. Pay only when the scope fits",
    body:
      "Open PayPal only after the project can support a manual Route File and does not require guaranteed traffic, revenue, approvals, or unsafe access."
  },
  {
    title: "3. Send intake and order match",
    body:
      "Send project facts first, plus payment confirmation only when the order already exists, so the manual request can be matched safely."
  },
  {
    title: "4. Receive Route File",
    body:
      "The manual Route File is delivered in 24-72 hours after payment confirmation and usable details are received."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: primaryOffer.name,
    description: primaryOffer.delivery,
    price: String(primaryOffer.price),
    priceCurrency: primaryOffer.currency,
    url: `${siteUrl}${path}`,
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "AgentSiteOps",
      url: siteUrl
    }
  };

  return (
    <main className="pricing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="pricing-hero">
        <div>
          <p className="eyebrow">Route File purchase gate</p>
          <h1>Check the project before paying for the Route File.</h1>
          <p>
            The Route File is a manual service for messy projects that need one selected
            route, rejected alternatives, an evidence ledger, a first proof asset, a
            validation channel, and a stop rule. This page keeps payment behind fit,
            intake, and sample review.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/intake/">
              <Mail aria-hidden="true" size={17} />
              Review intake first
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample Route File
            </Link>
          </div>
        </div>
        <aside className="pricing-receipt" aria-label="Buy Route File">
          <div className="receipt-topline">
            <span>Manual route file</span>
            <strong>USD {primaryOffer.price}</strong>
          </div>
          <h2>{primaryOffer.name}</h2>
          <p>{primaryOffer.delivery}</p>
          <Link prefetch={false} className="primary-action" href="/tools/launch-blueprint-fit-checker/">
            <CheckCircle2 aria-hidden="true" size={17} />
            Check Route File fit first
          </Link>
          <a
            className="secondary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="buy_paypal_route_file"
            href={primaryOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay with PayPal when ready
          </a>
          <small>{launchProduct.timeline}</small>
          <Link prefetch={false} className="secondary-action" href="/starter-review/">
            <ShieldCheck aria-hidden="true" size={17} />
            Start with USD {starterOffer.price} review
          </Link>
        </aside>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>How the purchase gate works</h2>
          <p>
            The payment link is not the first decision. Project readiness, intake quality,
            and delivery boundaries decide whether the full Route File should proceed.
          </p>
        </div>
        <div className="workflow-grid">
          {purchaseGateSteps.map((step) => (
            <article className="workflow-card" key={step.title}>
              <span>
                <CheckCircle2 aria-hidden="true" size={18} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
        <div className="hero-actions">
          <Link prefetch={false} className="secondary-action" href="/starter-review/">
            <ShieldCheck aria-hidden="true" size={17} />
            Fit Review
          </Link>
          <Link prefetch={false} className="secondary-action" href="/intake/">
            <Mail aria-hidden="true" size={17} />
            Project intake
          </Link>
          <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
            <CheckCircle2 aria-hidden="true" size={17} />
            Delivery gate
          </Link>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="buy_purchase_gate_paypal_route_file"
            href={primaryOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay USD {primaryOffer.price}
          </a>
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>Included</h2>
          <ul className="compact-list">
            {launchDeliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Not included</h2>
          <ul className="compact-list">
            <li>{launchProduct.nonPromise}</li>
            <li>No automated platform posting, comment, DM, or scraping workflow.</li>
            <li>No login account, dashboard, or subscription workspace in this first validation offer.</li>
            <li>No legal, tax, financial, medical, security, or regulated professional advice.</li>
          </ul>
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Acceptance criteria</h2>
          <p>
            A paid Route File is complete only when it can be executed and judged in the
            next validation cycle. These criteria define what the buyer should expect.
          </p>
        </div>
        <div className="pricing-grid">
          {launchAcceptanceCriteria.map((item) => (
            <article key={item.title}>
              <span aria-hidden="true">
                <CheckCircle2 size={18} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>If the route is not ready</h2>
          <ul className="compact-list">
            {launchFailureHandling.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Buyer responsibility</h2>
          <ul className="compact-list">
            <li>Provide honest evidence during intake.</li>
            <li>Do not treat a Route File as market proof by itself.</li>
            <li>Execute the outreach and page test before buying another planning artifact.</li>
            <li>Use search, payment, reply, or usage data to judge the next cycle.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
