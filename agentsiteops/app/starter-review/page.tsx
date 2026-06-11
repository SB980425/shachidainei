import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CreditCard, FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  starterReviewAcceptanceCriteria,
  starterReviewDeliverables,
  starterReviewProduct
} from "@/lib/launch";
import { primaryOffer, starterOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/starter-review/";
const deliverableTitles = ["Verdict", "Blocker", "Missing evidence", "Fit note", "Recommendation"];

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
    <main className="pricing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pricing-hero">
        <div>
          <p className="eyebrow">Lower-friction purchase test</p>
          <h1>Pay for a fit verdict before buying the full blueprint.</h1>
          <p>
            The Fit Review is a USD {starterOffer.price} manual check for buyers who are
            unsure whether the USD {primaryOffer.price} Launch Blueprint is worth buying.
            It returns a go, narrow, or stop decision instead of a full launch artifact.
          </p>
          <div className="hero-actions">
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
              Pay USD {starterOffer.price}
            </a>
            <Link className="secondary-action" href="/intake/">
              <FileText aria-hidden="true" size={17} />
              View intake fields
            </Link>
            <Link className="secondary-action" href="/examples/fit-review-sample/">
              <FileText aria-hidden="true" size={17} />
              View sample review
            </Link>
            <Link className="secondary-action" href="/pricing/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Compare offers
            </Link>
          </div>
        </div>
        <aside className="pricing-receipt" aria-label="Fit Review offer">
          <div className="receipt-topline">
            <span>Manual review</span>
            <strong>USD {starterOffer.price}</strong>
          </div>
          <h2>{starterOffer.name}</h2>
          <p>{starterReviewProduct.timeline}</p>
          <small>{starterReviewProduct.nonPromise}</small>
        </aside>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>What the review returns</h2>
          <p>
            This is not a cheaper version of the full blueprint. It is a purchase filter
            that can reject the larger sale when the evidence is not ready.
          </p>
        </div>
        <div className="pricing-grid">
          {starterReviewDeliverables.map((item, index) => (
            <article key={item}>
              <span aria-hidden="true">
                <CheckCircle2 size={18} />
              </span>
              <h3>{deliverableTitles[index]}</h3>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Acceptance criteria</h2>
          <p>
            A useful review is allowed to say no. If it only pushes every buyer toward
            the USD {primaryOffer.price} blueprint, the review has failed its own purpose.
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

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>Buy the Fit Review when</h2>
          <ul className="compact-list">
            <li>You can build or deliver, but the offer and buyer are still unclear.</li>
            <li>You want a smaller paid check before the full Launch Blueprint.</li>
            <li>You accept a short verdict instead of a complete landing page and outreach artifact.</li>
            <li>You can send enough evidence for a reviewer to judge fit within 24 hours.</li>
          </ul>
        </div>
        <div>
          <h2>Do not buy it when</h2>
          <ul className="compact-list">
            <li>You need guaranteed traffic, rankings, citations, revenue, or customers.</li>
            <li>You need legal, financial, medical, tax, safety, or other regulated advice.</li>
            <li>You already know the buyer and only need the full blueprint deliverable.</li>
            <li>You expect a dashboard, account portal, or automated checkout workflow.</li>
          </ul>
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>If the verdict is go</h2>
          <p>
            The review can recommend the full Launch Blueprint only when the intake shows
            a plausible buyer, deliverable, proof path, and seven-day execution route.
          </p>
          <Link className="secondary-action" href="/buy/">
            <CreditCard aria-hidden="true" size={17} />
            View full blueprint
          </Link>
          <Link className="secondary-action" href="/examples/fit-review-sample/">
            <FileText aria-hidden="true" size={17} />
            View sample
          </Link>
        </div>
        <div>
          <h2>If the verdict is stop</h2>
          <p>
            The review should name the missing evidence or blocked route. That result is
            still useful because it prevents paying for a larger artifact too early.
          </p>
          <Link className="secondary-action" href="/refund-policy/">
            <ShieldAlert aria-hidden="true" size={17} />
            Read refund boundary
          </Link>
        </div>
      </section>
    </main>
  );
}
