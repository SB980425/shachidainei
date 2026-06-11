import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, FileText, Mail, ShieldCheck } from "lucide-react";
import { launchDeliverables, launchProduct } from "@/lib/launch";
import { paypal, primaryOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/pricing/";
const pageUrl = `${siteUrl}${path}`;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AgentSiteOps Launch Blueprint pricing: USD 99 for a manual 24-72 hour offer, landing page, and outreach path.",
  alternates: {
    canonical: path
  },
  openGraph: {
    title: "Pricing",
    description: "Buy the AgentSiteOps Launch Blueprint through PayPal.",
    url: pageUrl,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: primaryOffer.name,
  description: primaryOffer.delivery,
  price: String(primaryOffer.price),
  priceCurrency: primaryOffer.currency,
  url: primaryOffer.href,
  availability: "https://schema.org/InStock",
  seller: {
    "@type": "Organization",
    name: paypal.businessName,
    url: siteUrl
  }
};

export default function Page() {
  return (
    <main className="pricing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pricing-hero">
        <div>
          <p className="eyebrow">Single validation offer</p>
          <h1>One Launch Blueprint. One price. No tier confusion.</h1>
          <p>
            The first product is USD {primaryOffer.price}. It is a manual 24-72 hour
            blueprint for AI-capable solo builders who need one sellable offer, one
            landing page structure, and one first outreach path.
          </p>
        </div>
        <aside className="pricing-receipt" aria-label="Current paid offer">
          <div className="receipt-topline">
            <span>Current offer</span>
            <strong>USD {primaryOffer.price}</strong>
          </div>
          <h2>{primaryOffer.name}</h2>
          <p>{primaryOffer.delivery}</p>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="pricing_paypal_launch_blueprint"
            href={primaryOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay USD {primaryOffer.price}
          </a>
          <small>
            Payment opens PayPal. Delivery remains manual after confirmation and intake details.
          </small>
        </aside>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>What USD {primaryOffer.price} buys</h2>
          <p>
            The value is not another score. It is compressed judgment and launch material
            that can be used immediately in the first validation cycle.
          </p>
        </div>
        <div className="pricing-grid">
          {launchDeliverables.slice(0, 4).map((item) => (
            <article key={item}>
              <span aria-hidden="true">
                <CheckCircle2 size={18} />
              </span>
              <h3>{item.split(" and ")[0]}</h3>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>Payment path</h2>
          <ul className="compact-list">
            <li>Use the PayPal button for the Launch Blueprint.</li>
            <li>After payment, open the intake page and send project details to the support email.</li>
            <li>PayPal handles payment data; this static site does not collect card details.</li>
            <li>Full PayPal Checkout API is deferred until automated order handling is required.</li>
          </ul>
        </div>
        <div>
          <h2>Service limits</h2>
          <ul className="compact-list">
            <li>{launchProduct.nonPromise}</li>
            <li>Automated platform DMs, comments, or spam workflows are not included.</li>
            <li>Refund boundaries and delivery limits are written before payment.</li>
            <li>Login, dashboard, and subscription features are intentionally deferred.</li>
          </ul>
          <div className="hero-actions">
            <Link className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample
            </Link>
            <Link className="secondary-action" href="/refund-policy/">
              <ShieldCheck aria-hidden="true" size={17} />
              Refund policy
            </Link>
          </div>
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>After payment</h2>
          <p>
            Send the intake details from the intake page to{" "}
            <a href={`mailto:${launchProduct.supportEmail}`}>{launchProduct.supportEmail}</a>.
            The blueprint is delivered manually by email or document link.
          </p>
        </div>
        <div>
          <h2>Ready path</h2>
          <div className="hero-actions">
            <a
              className="primary-action"
              data-analytics-event="payment_cta_click"
              data-analytics-label="pricing_bottom_paypal_launch_blueprint"
              href={primaryOffer.href}
              rel="noreferrer"
              target="_blank"
            >
              <CreditCard aria-hidden="true" size={17} />
              Pay with PayPal
            </a>
            <Link className="secondary-action" href="/intake/">
              <Mail aria-hidden="true" size={17} />
              View intake
            </Link>
            <Link className="secondary-action" href="/buy/">
              <ArrowRight aria-hidden="true" size={17} />
              Buy page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
