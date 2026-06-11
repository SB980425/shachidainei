import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, DatabaseZap, FileText, Mail, ShieldCheck } from "lucide-react";
import {
  authorityBoundaries,
  blueprintEvidenceInputs,
  launchDeliverables,
  launchProduct,
  pricingBenchmarks,
  starterReviewAcceptanceCriteria,
  starterReviewDeliverables,
  starterReviewProduct
} from "@/lib/launch";
import { paypal, primaryOffer, starterOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/pricing/";
const pageUrl = `${siteUrl}${path}`;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AgentSiteOps pricing: USD 29 for a manual fit review or USD 99 for a complete Launch Blueprint.",
  alternates: {
    canonical: path
  },
  openGraph: {
    title: "Pricing",
    description: "Choose the USD 29 fit review or the USD 99 Launch Blueprint through PayPal.",
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

const launchDeliverableCards = [
  { title: "Primary offer", body: launchDeliverables[0] },
  { title: "Target buyer", body: launchDeliverables[1] },
  { title: "Landing page structure", body: launchDeliverables[2] },
  { title: "Pricing boundary", body: launchDeliverables[3] }
];

export default function Page() {
  return (
    <main className="pricing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pricing-hero">
        <div>
          <p className="eyebrow">Validation-stage pricing</p>
          <h1>Start with a fit review or buy the full Launch Blueprint.</h1>
          <p>
            The site now has two bounded manual offers. Use the USD {starterOffer.price} fit
            review if the purchase decision is uncertain. Use the USD {primaryOffer.price}
            Launch Blueprint only when one sellable offer, page structure, and outreach path
            are the real bottleneck.
          </p>
        </div>
        <aside className="pricing-receipt" aria-label="Current paid offer">
          <div className="receipt-topline">
            <span>Lowest entry</span>
            <strong>USD {starterOffer.price}</strong>
          </div>
          <h2>{starterOffer.name}</h2>
          <p>{starterOffer.delivery}</p>
          <Link className="secondary-action" href="/tools/launch-blueprint-fit-checker/">
            <CheckCircle2 aria-hidden="true" size={17} />
            Check fit first
          </Link>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="pricing_paypal_fit_review"
            data-analytics-type="starter_review"
            href={starterOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay USD {starterOffer.price}
          </a>
          <Link className="secondary-action" href="/starter-review/">
            <ArrowRight aria-hidden="true" size={17} />
            View fit review
          </Link>
          <small>
            Payment opens PayPal. The review can recommend not buying the full blueprint.
          </small>
        </aside>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Choose the smallest useful purchase</h2>
          <p>
            The lower-priced review exists because a new product should not force every
            uncertain buyer into a USD {primaryOffer.price} decision before fit is proven.
          </p>
        </div>
        <div className="pricing-grid pricing-grid-two">
          <article className="offer-card-primary">
            <span aria-hidden="true">
              <CheckCircle2 size={18} />
            </span>
            <h3>{starterOffer.name}</h3>
            <strong>USD {starterOffer.price}</strong>
            <p>{starterOffer.delivery}</p>
            <ul className="compact-list">
              {starterReviewDeliverables.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              className="primary-action"
              data-analytics-event="payment_cta_click"
              data-analytics-label="pricing_card_paypal_fit_review"
              data-analytics-type="starter_review"
              href={starterOffer.href}
              rel="noreferrer"
              target="_blank"
            >
              <CreditCard aria-hidden="true" size={17} />
              Pay USD {starterOffer.price}
            </a>
            <Link className="secondary-action" href="/examples/fit-review-sample/">
              <FileText aria-hidden="true" size={17} />
              View sample review
            </Link>
          </article>
          <article>
            <span aria-hidden="true">
              <FileText size={18} />
            </span>
            <h3>{primaryOffer.name}</h3>
            <strong>USD {primaryOffer.price}</strong>
            <p>{primaryOffer.delivery}</p>
            <ul className="compact-list">
              {launchDeliverables.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              className="secondary-action"
              data-analytics-event="payment_cta_click"
              data-analytics-label="pricing_card_paypal_launch_blueprint"
              data-analytics-type="launch_blueprint"
              href={primaryOffer.href}
              rel="noreferrer"
              target="_blank"
            >
              <CreditCard aria-hidden="true" size={17} />
              Pay USD {primaryOffer.price}
            </a>
          </article>
        </div>
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
          {launchDeliverableCards.map((item) => (
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

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>What USD {starterReviewProduct.price} buys</h2>
          <p>
            The fit review is intentionally smaller. Its job is to prevent a weak or
            wrong-fit buyer from purchasing the full blueprint too early.
          </p>
        </div>
        <div className="pricing-grid">
          {starterReviewAcceptanceCriteria.map((item) => (
            <article key={item.title}>
              <span aria-hidden="true">
                <ShieldCheck size={18} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Data source and accuracy boundary</h2>
          <p>
            The route is not generated from confidence alone. It is assembled from declared
            inputs, visible evidence, and explicit stop conditions.
          </p>
        </div>
        <div className="pricing-grid">
          {blueprintEvidenceInputs.map((item) => (
            <article key={item.title}>
              <span aria-hidden="true">
                <DatabaseZap size={18} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="authority-note">
          {authorityBoundaries.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Pricing position</h2>
          <p>
            USD {primaryOffer.price} is not priced as ongoing SEO or AI-monitoring software.
            It is priced as a single manual decision artifact for the first validation cycle.
          </p>
        </div>
        <div className="comparison-table" role="table" aria-label="Pricing comparison">
          <div role="row">
            <strong role="columnheader">Option</strong>
            <strong role="columnheader">Price shape</strong>
            <strong role="columnheader">What it is better for</strong>
          </div>
          {pricingBenchmarks.map((item) => (
            <a
              href={item.href}
              key={item.name}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              role="row"
              target={item.href.startsWith("http") ? "_blank" : undefined}
            >
              <span role="cell">{item.name}</span>
              <span role="cell">{item.price}</span>
              <span role="cell">{item.position}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>Payment path</h2>
          <ul className="compact-list">
            <li>Use the Launch Blueprint Fit Checker before opening PayPal.</li>
            <li>Use the PayPal button only if the result is strong fit or possible fit.</li>
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
            <Link className="secondary-action" href="/compare/">
              <ArrowRight aria-hidden="true" size={17} />
              Compare options
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
            <Link className="secondary-action" href="/tools/launch-blueprint-fit-checker/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Check fit
            </Link>
            <a
              className="primary-action"
              data-analytics-event="payment_cta_click"
              data-analytics-label="pricing_bottom_paypal_launch_blueprint"
              data-analytics-type="launch_blueprint"
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
