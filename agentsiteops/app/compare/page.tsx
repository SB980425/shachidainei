import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  GitCompareArrows,
  ShieldAlert,
  XCircle
} from "lucide-react";
import {
  comparisonSources,
  launchComparisons,
  launchProduct,
  purchaseFitRules
} from "@/lib/launch";
import { primaryOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/compare/";
const pageUrl = `${siteUrl}${path}`;

export const metadata: Metadata = {
  title: "Compare Launch Options",
  description:
    "Compare AgentSiteOps with generic AI chat, SEO software, AI visibility monitoring, and consultants before buying the USD 99 Launch Blueprint.",
  alternates: { canonical: path },
  openGraph: {
    title: "Compare Launch Options",
    description:
      "See when AgentSiteOps is useful, when it is the wrong tool, and how the USD 99 Launch Blueprint differs from software and consulting.",
    url: pageUrl,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Launch Options",
    description:
      "A decision page comparing AgentSiteOps with generic AI chat, SEO software, AI visibility monitoring, and consulting.",
    url: pageUrl,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
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
          <p className="eyebrow">Decision page</p>
          <h1>Compare AgentSiteOps before buying.</h1>
          <p>
            AgentSiteOps is not trying to replace SEO software, AI visibility monitoring,
            or a full consultant. It is a narrow manual blueprint for one early problem:
            choosing the first sellable offer, page structure, and outreach path.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/tools/launch-blueprint-fit-checker/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Check fit before payment
            </Link>
            <Link className="secondary-action" href="/sample/">
              <GitCompareArrows aria-hidden="true" size={17} />
              View sample
            </Link>
            <Link className="secondary-action" href="/pricing/">
              <ArrowRight aria-hidden="true" size={17} />
              View pricing
            </Link>
          </div>
        </div>
        <aside className="pricing-receipt">
          <div className="receipt-topline">
            <span>Current offer</span>
            <strong>USD {primaryOffer.price}</strong>
          </div>
          <h2>{primaryOffer.name}</h2>
          <p>{primaryOffer.delivery}</p>
          <a
            className="primary-action"
            data-analytics-event="payment_cta_click"
            data-analytics-label="compare_paypal_launch_blueprint"
            href={primaryOffer.href}
            rel="noreferrer"
            target="_blank"
          >
            <CreditCard aria-hidden="true" size={17} />
            Pay USD {primaryOffer.price}
          </a>
          <small>{launchProduct.nonPromise}</small>
        </aside>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>What each option is better for</h2>
          <p>
            The comparison is intentionally narrow. A lower price is not enough; the page
            needs to show when the product is useful and when another option is stronger.
          </p>
        </div>
        <div className="comparison-table comparison-table-wide" role="table" aria-label="Launch option comparison">
          <div role="row">
            <strong role="columnheader">Option</strong>
            <strong role="columnheader">Better for</strong>
            <strong role="columnheader">Weaker for</strong>
            <strong role="columnheader">AgentSiteOps fit</strong>
          </div>
          {launchComparisons.map((item) => (
            <div key={item.option} role="row">
              <span role="cell">{item.option}</span>
              <span role="cell">{item.betterFor}</span>
              <span role="cell">{item.weakerFor}</span>
              <span role="cell">{item.agentSiteOpsFit}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>Buy only when the fit is clear</h2>
          <ul className="compact-list">
            {purchaseFitRules.buyIf.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Do not buy for these jobs</h2>
          <ul className="compact-list">
            {purchaseFitRules.doNotBuyIf.map((item) => (
              <li key={item}>
                <XCircle aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Why the USD 99 price is still a test</h2>
          <p>
            The price is not proven by traffic, conversion, or customer history yet. It is
            a validation price for a manual artifact that can prevent wasted build time.
          </p>
        </div>
        <div className="pricing-grid">
          <article>
            <span aria-hidden="true">
              <GitCompareArrows size={18} />
            </span>
            <h3>Not a subscription replacement</h3>
            <p>
              SEO and AI visibility tools are stronger for ongoing measurement. AgentSiteOps
              is positioned before that stage, when the buyer still needs a first route.
            </p>
          </article>
          <article>
            <span aria-hidden="true">
              <ShieldAlert size={18} />
            </span>
            <h3>No authority shortcut</h3>
            <p>
              The blueprint is not more accurate because it uses AI. It is constrained by
              evidence intake, rejected paths, explicit assumptions, and stop rules.
            </p>
          </article>
          <article>
            <span aria-hidden="true">
              <CheckCircle2 size={18} />
            </span>
            <h3>Measurable next step</h3>
            <p>
              A useful report ends with one landing page structure, one outreach sequence,
              and a 7-day decision rule rather than a large list of possible ideas.
            </p>
          </article>
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>Reference pages used for category boundaries</h2>
          <p>
            These links are used only to identify product categories and pricing shape.
            Exact third-party prices can change and should be checked on the official page
            before purchase.
          </p>
        </div>
        <div className="source-grid">
          {comparisonSources.map((source) => (
            <a href={source.href} key={source.href} rel="noreferrer" target="_blank">
              <span>{source.label}</span>
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
