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
  title: "Buy Route File",
  description:
    "Buy the AgentSiteOps Research-to-Route File for USD 99 through PayPal and receive manual delivery in 24-72 hours.",
  alternates: { canonical: path },
  openGraph: {
    title: "Buy Route File",
    description: "Pay with PayPal and send intake details for manual Route File delivery.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

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
          <p className="eyebrow">Buy the checked route artifact</p>
          <h1>Buy a Research-to-Route File handoff.</h1>
          <p>
            The Route File is a manual service for messy projects that need one selected route,
            rejected alternatives, an evidence ledger, a first proof asset, a validation channel,
            and a stop rule. If that purchase decision is still unclear, use the USD {starterOffer.price} Fit Review first.
          </p>
        </div>
        <aside className="pricing-receipt" aria-label="Buy Route File">
          <div className="receipt-topline">
            <span>Manual service</span>
            <strong>USD {primaryOffer.price}</strong>
          </div>
          <h2>{primaryOffer.name}</h2>
          <p>{primaryOffer.delivery}</p>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="buy_paypal_route_file"
            href={primaryOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay with PayPal
          </a>
          <small>{launchProduct.timeline}</small>
          <Link prefetch={false} className="secondary-action" href="/tools/launch-blueprint-fit-checker/">
            <CheckCircle2 aria-hidden="true" size={17} />
            Check Route File fit first
          </Link>
          <Link prefetch={false} className="secondary-action" href="/starter-review/">
            <ShieldCheck aria-hidden="true" size={17} />
            Start with USD {starterOffer.price} review
          </Link>
        </aside>
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
          <h2>How the purchase works</h2>
          <p>Use a simple payment and intake path before any heavier checkout or account system exists.</p>
        </div>
        <div className="workflow-grid">
          <article className="workflow-card">
            <span>1</span>
            <h3>Check fit</h3>
            <p>Use the fit checker first. If the decision is unclear, buy the smaller Fit Review instead.</p>
          </article>
          <article className="workflow-card">
            <span>2</span>
            <h3>Pay and send intake</h3>
            <p>Open PayPal, complete the USD {primaryOffer.price} payment, then send the requested project details.</p>
          </article>
          <article className="workflow-card">
            <span>3</span>
            <h3>Receive Route File</h3>
            <p>The manual Route File is delivered in 24-72 hours after payment and usable details are received.</p>
          </article>
        </div>
        <div className="hero-actions">
          <Link prefetch={false} className="secondary-action" href="/sample/">
            <FileText aria-hidden="true" size={17} />
            View sample
          </Link>
          <Link prefetch={false} className="secondary-action" href="/starter-review/">
            <ShieldCheck aria-hidden="true" size={17} />
            Fit Review
          </Link>
          <Link prefetch={false} className="secondary-action" href="/intake/">
            <Mail aria-hidden="true" size={17} />
            View intake
          </Link>
          <Link prefetch={false} className="secondary-action" href="/refund-policy/">
            <ShieldCheck aria-hidden="true" size={17} />
            Refund policy
          </Link>
          <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
            <CheckCircle2 aria-hidden="true" size={17} />
            Delivery gate
          </Link>
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
