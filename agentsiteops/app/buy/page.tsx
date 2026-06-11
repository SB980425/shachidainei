import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, FileText, Mail, ShieldCheck } from "lucide-react";
import { launchDeliverables, launchProduct } from "@/lib/launch";
import { primaryOffer, testPaymentOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/buy/";

export const metadata: Metadata = {
  title: "Buy Launch Blueprint",
  description:
    "Buy the AgentSiteOps Launch Blueprint for USD 99 through PayPal and receive manual delivery in 24-72 hours.",
  alternates: { canonical: path },
  openGraph: {
    title: "Buy Launch Blueprint",
    description: "Pay with PayPal and send intake details for manual blueprint delivery.",
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
          <p className="eyebrow">Buy the first validation artifact</p>
          <h1>Get one sellable offer and first launch path.</h1>
          <p>
            The Launch Blueprint is a manual service for AI-capable solo builders who need a concrete
            first offer, page structure, pricing angle, and outreach sequence.
          </p>
        </div>
        <aside className="pricing-receipt" aria-label="Buy Launch Blueprint">
          <div className="receipt-topline">
            <span>Manual service</span>
            <strong>USD {primaryOffer.price}</strong>
          </div>
          <h2>{primaryOffer.name}</h2>
          <p>{primaryOffer.delivery}</p>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="buy_paypal_launch_blueprint"
            href={primaryOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay with PayPal
          </a>
          <a
            className="secondary-action test-payment-action"
            data-analytics-event="test_payment_cta_click"
            data-analytics-label="buy_paypal_test_usd_1"
            href={testPaymentOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Test PayPal with USD {testPaymentOffer.price}
          </a>
          <small>{launchProduct.timeline}</small>
          <small>{testPaymentOffer.purpose}</small>
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
            <h3>Pay</h3>
            <p>Open PayPal from this page and complete the USD {primaryOffer.price} payment.</p>
          </article>
          <article className="workflow-card">
            <span>2</span>
            <h3>Send intake</h3>
            <p>Open the intake page and send the requested project details by email or approved form.</p>
          </article>
          <article className="workflow-card">
            <span>3</span>
            <h3>Receive blueprint</h3>
            <p>The manual document is delivered in 24-72 hours after payment and usable details are received.</p>
          </article>
        </div>
        <div className="hero-actions">
          <Link className="secondary-action" href="/sample/">
            <FileText aria-hidden="true" size={17} />
            View sample
          </Link>
          <Link className="secondary-action" href="/intake/">
            <Mail aria-hidden="true" size={17} />
            View intake
          </Link>
          <Link className="secondary-action" href="/refund-policy/">
            <ShieldCheck aria-hidden="true" size={17} />
            Refund policy
          </Link>
        </div>
      </section>
    </main>
  );
}
