import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, CreditCard, FileText, Mail, ShieldCheck } from "lucide-react";
import {
  authorityBoundaries,
  blueprintEvidenceInputs,
  launchComparisons,
  launchDeliverables,
  launchProduct,
  pricingBenchmarks,
  purchaseObjectionResponses,
  samplePaidArtifactChecklist,
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

const ladder = [
  {
    title: "Inspect",
    price: "Free",
    body: "Read the sample and fit checker before opening a payment link.",
    href: "/examples/fit-review-sample/",
    action: "View sample"
  },
  {
    title: "Validate",
    price: `USD ${starterOffer.price}`,
    body: starterOffer.fit,
    href: "/starter-review/",
    action: "Choose Fit Review"
  },
  {
    title: "Build route",
    price: `USD ${primaryOffer.price}`,
    body: primaryOffer.fit,
    href: "/buy/",
    action: "View blueprint"
  }
];

const compactEvidence = blueprintEvidenceInputs.slice(0, 3);
const compactObjections = purchaseObjectionResponses.slice(0, 3);
const compactComparisons = launchComparisons.slice(0, 4);

export default function Page() {
  return (
    <main className="pricing-page conversion-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="decision-hero pricing-decision-hero">
        <div className="decision-hero-copy">
          <p className="eyebrow">Transparent manual pricing</p>
          <h1>Choose the smallest purchase that can answer the decision.</h1>
          <p>
            AgentSiteOps has two paid paths: a USD {starterOffer.price} Fit Review and a
            USD {primaryOffer.price} AgentSiteOps Launch Blueprint. Start small when the
            route is uncertain.
          </p>
          <div className="hero-actions hero-actions-tight">
            <a
              className="primary-action"
              data-analytics-event="payment_cta_click"
              data-analytics-label="pricing_hero_paypal_fit_review"
              data-analytics-type="starter_review"
              href={starterOffer.href}
              rel="noreferrer"
              target="_blank"
            >
              <CreditCard aria-hidden="true" size={17} />
              Pay USD {starterOffer.price}
            </a>
            <Link prefetch={false} className="secondary-action" href="/starter-review/">
              <ArrowRight aria-hidden="true" size={17} />
              Fit Review details
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Blueprint sample
            </Link>
          </div>
        </div>

        <aside className="decision-ticket pricing-ticket" aria-label="Pricing summary">
          <div className="receipt-topline">
            <span>Lowest entry</span>
            <strong>USD {starterOffer.price}</strong>
          </div>
          <h2>{starterOffer.name}</h2>
          <p>{starterOffer.delivery}</p>
          <small>
            Payment opens PayPal. PayPal-hosted payment instead of collecting card data directly.
          </small>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="pricing_ticket_paypal_fit_review"
            data-analytics-type="starter_review"
            href={starterOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay with PayPal
          </a>
        </aside>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>Decision ladder</h2>
          <p>
            The full blueprint should not be the first click for every visitor. Move only
            as far as the evidence supports.
          </p>
        </div>
        <div className="decision-ladder decision-ladder-pricing">
          {ladder.map((item, index) => (
            <article key={item.title}>
              <span>{index + 1}</span>
              <strong>{item.price}</strong>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link prefetch={false} className={index === 1 ? "primary-action" : "secondary-action"} href={item.href}>
                <ArrowRight aria-hidden="true" size={17} />
                {item.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>Why pay for a manual route</h2>
          <p>
            The paid value is the forced selection: one offer, one buyer, one page
            structure, one outreach path, and one stop rule. It is not a keyword tool,
            dashboard, or generic chat session.
          </p>
        </div>
        <div className="value-proof-grid">
          {compactComparisons.map((item) => (
            <article key={item.option}>
              <span>{item.option}</span>
              <h3>Use when the gap is route selection.</h3>
              <p>{item.agentSiteOpsFit}</p>
              <small>Better alternative: {item.betterFor}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>Offer comparison</h2>
          <p>
            Use the Fit Review to answer whether the larger Launch Blueprint should exist
            for your current evidence.
          </p>
        </div>
        <div className="offer-choice-grid">
          <article className="offer-choice-card offer-choice-card-primary">
            <BadgeDollarSign aria-hidden="true" size={20} />
            <h3>{starterOffer.name}</h3>
            <strong>USD {starterOffer.price}</strong>
            <p>{starterReviewProduct.promise}</p>
            <ul className="compact-list">
              {starterReviewDeliverables.slice(0, 3).map((item) => (
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
          </article>

          <article className="offer-choice-card">
            <FileText aria-hidden="true" size={20} />
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

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>What USD 99 must produce</h2>
          <p>
            If a paid report does not contain these parts, the price is not justified.
            This list is the delivery standard, not a marketing promise.
          </p>
        </div>
        <div className="artifact-standard-grid">
          {samplePaidArtifactChecklist.map((item, index) => (
            <article key={item.title}>
              <span>{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>Why the route can be trusted only so far</h2>
          <p>{authorityBoundaries[0]}</p>
        </div>
        <div className="decision-card-grid">
          {compactEvidence.map((item) => (
            <article key={item.title}>
              <CheckCircle2 aria-hidden="true" size={18} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>Objections that should block or redirect payment</h2>
          <p>
            If these answers do not make the value clear, do not pay. The current product
            is manual judgment, not software, traffic, or implementation.
          </p>
        </div>
        <div className="objection-grid">
          {compactObjections.map((item) => (
            <article key={item.objection}>
              <ShieldCheck aria-hidden="true" size={18} />
              <h3>{item.objection}</h3>
              <p>{item.response}</p>
              <small>{item.nextAction}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split compact-home-section">
        <div>
          <h2>Pricing position</h2>
          <ul className="compact-list">
            {pricingBenchmarks.slice(0, 3).map((item) => (
              <li key={item.name}>
                {item.name}: {item.price}. {item.position}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Service limits</h2>
          <ul className="compact-list">
            <li>{launchProduct.nonPromise}</li>
            <li>No login account, dashboard, or subscription workspace.</li>
            <li>No automated DMs, comments, scraping, or platform growth scripts.</li>
            <li>Manual delivery starts after payment confirmation and usable intake.</li>
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/refund-policy/">
              <ShieldCheck aria-hidden="true" size={17} />
              Refund policy
            </Link>
            <Link prefetch={false} className="secondary-action" href="/intake/">
              <Mail aria-hidden="true" size={17} />
              Intake
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
