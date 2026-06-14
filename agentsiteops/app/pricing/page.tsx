import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CheckCircle2, CreditCard, FileText, Mail, ShieldCheck } from "lucide-react";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import {
  authorityBoundaries,
  blueprintEvidenceInputs,
  launchComparisons,
  pricingBenchmarks,
  purchaseObjectionResponses,
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
    "AgentSiteOps pricing starts with free sample inspection, then a USD 29 manual Fit Review or USD 99 Research-to-Route File delivery when the intake supports it.",
  alternates: {
    canonical: path
  },
  openGraph: {
    title: "Pricing",
    description:
      "Inspect the sample and delivery gate before choosing a USD 29 Fit Review or USD 99 Research-to-Route File delivery.",
    url: pageUrl,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: "AgentSiteOps Research-to-Route File",
  description:
    "Manual delivery of a checked Route File with selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
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
    body: "Read the sample Route File, delivery gate, and workflow before opening a payment link.",
    href: "/sample/",
    action: "View Route File sample"
  },
  {
    title: "Validate",
    price: `USD ${starterOffer.price}`,
    body:
      "Use Fit Review when the project may not be ready for a full Route File and needs a go, narrow, or stop verdict first.",
    href: "/starter-review/",
    action: "Choose Fit Review"
  },
  {
    title: "Receive route",
    price: `USD ${primaryOffer.price}`,
    body:
      "Use Research-to-Route File when the messy inputs are ready for an approved research run, coverage checking, gap repair, and final synthesis.",
    href: "/buy/",
    action: "Review purchase gate"
  }
];

const routeFileOfferName = "AgentSiteOps Research-to-Route File";

const routeFileDeliverables = [
  {
    title: "Selected route",
    body: "Selected route with confidence level and evidence basis."
  },
  {
    title: "Rejected alternatives",
    body: "Rejected alternatives with reasons tied to current evidence and constraints."
  },
  {
    title: "Evidence ledger",
    body:
      "Evidence ledger separating verified, pending, inferred, stale, blocked, and not-claimed items."
  },
  {
    title: "First proof asset",
    body: "First proof asset that can test the route before larger build work."
  },
  {
    title: "Validation channel",
    body: "Validation channel with counted signal, ignored weak signal, review window, and stop rule."
  },
  {
    title: "Not-delivery boundary",
    body:
      "Explicit not-delivery boundary for traffic, ranking, AI citation, revenue, and customer-response claims."
  }
];

const pricingBoundaries = [
  "No guarantees of traffic, ranking, AI citation, customer replies, revenue, payment approval, or product-market fit.",
  "No hidden automatic research or opaque model/API result. The research carrier is approved per project and the final judgment remains manual.",
  "No login account, dashboard, subscription workspace, automated DMs, scraping, or platform growth scripts.",
  "Manual delivery starts after payment confirmation and usable intake; weak inputs can produce repair, blocked, or stop decisions."
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
          <p className="eyebrow">Research-to-Route File pricing</p>
          <h1>Choose the smallest manual step that can produce a route decision.</h1>
          <p>
            AgentSiteOps has two paid paths: a USD {starterOffer.price} Fit Review and a
            USD {primaryOffer.price} Research-to-Route File delivery. Start small when
            the route is uncertain; buy the full Route File only when the intake can
            support manual delivery.
          </p>
          <div className="hero-actions hero-actions-tight">
            <Link prefetch={false} className="primary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Inspect sample first
            </Link>
            <Link prefetch={false} className="secondary-action" href="/starter-review/">
              <ArrowRight aria-hidden="true" size={17} />
              Fit Review details
            </Link>
            <a
              className="secondary-action"
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
            Payment opens PayPal. AgentSiteOps does not collect card data directly; manual
            delivery starts only after payment confirmation and usable intake.
          </small>
          <a
            className="secondary-action"
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

      <CustomerResponseLifecycle
        variant="compact"
        eyebrow="Before payment"
        title="Payment does not bypass intake or operator review."
        body="A paid path still starts with usable intake, source boundaries, and accepted scope. Weak inputs can produce repair, blocked, or stop decisions."
      />

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>Decision ladder</h2>
          <p>
            The full Route File should not be the first click for every visitor. Move
            only as far as the evidence supports.
          </p>
        </div>
        <div className="decision-ladder decision-ladder-pricing">
          {ladder.map((item, index) => (
            <article key={item.title}>
              <span>{index + 1}</span>
              <strong>{item.price}</strong>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link prefetch={false} className={index === 0 ? "primary-action" : "secondary-action"} href={item.href}>
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
            The paid value is forced selection and traceability: one route, rejected
            alternatives, tagged evidence, first proof asset, validation channel, and stop
            rule. It is not a keyword tool, dashboard, or generic chat session.
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
            Use Fit Review to decide whether the larger Route File should be bought now,
            repaired first, or blocked.
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
              className="secondary-action"
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
            <h3>{routeFileOfferName}</h3>
            <strong>USD {primaryOffer.price}</strong>
            <p>
              A manual 24-72 hour Route File delivery covering research, coverage review,
              repair prompts when needed, and final synthesis.
            </p>
            <ul className="compact-list">
              {routeFileDeliverables.slice(0, 4).map((item) => (
                <li key={item.title}>{item.body}</li>
              ))}
            </ul>
            <Link
              prefetch={false}
              className="secondary-action"
              data-analytics-event="route_file_purchase_gate_click"
              data-analytics-label="pricing_card_route_file_gate"
              href="/buy/"
            >
              <ArrowRight aria-hidden="true" size={17} />
              Review purchase gate
            </Link>
          </article>
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>What USD {primaryOffer.price} must produce</h2>
          <p>
            If the paid file does not contain these parts, it is not a complete
            Research-to-Route File delivery. This is the delivery standard, not a traffic
            or revenue promise.
          </p>
        </div>
        <div className="artifact-standard-grid">
          {routeFileDeliverables.map((item, index) => (
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
            is manual route judgment, not software, traffic, or implementation.
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
          <h2>No guarantees and service limits</h2>
          <ul className="compact-list">
            {pricingBoundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
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
