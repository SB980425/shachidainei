import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  DatabaseZap,
  FileText,
  Gauge,
  Mail,
  MousePointer2,
  Rocket,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ScorerPanel } from "@/components/ScorerPanel";
import {
  authorityBoundaries,
  blueprintEvidenceInputs,
  launchDeliverables,
  launchProduct,
  marketSignals
} from "@/lib/launch";
import { primaryOffer } from "@/lib/payments";
import { allRoutes, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AgentSiteOps",
  description:
    "AgentSiteOps turns scattered AI capability into one sellable offer, one landing page structure, and one 7-day validation path."
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgentSiteOps",
    description:
      "A launch blueprint service for AI-capable solo builders who need one sellable offer, one page structure, and one first outreach path.",
    inLanguage: "en",
    url: siteUrl,
    potentialAction: {
      "@type": "ViewAction",
      target: `${siteUrl}/buy/`,
      name: "Buy the AgentSiteOps Launch Blueprint"
    }
  };

  return (
    <main className="page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">AI solo business launch system</p>
          <h1>Turn scattered AI skills into one sellable offer.</h1>
          <p className="hero-lede">
            AgentSiteOps sells a manual Launch Blueprint for AI-capable solo builders:
            one buyer, one offer, one landing page structure, one pricing angle, and one
            7-day outreach path.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="/tools/launch-blueprint-fit-checker/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Check fit before payment
            </Link>
            <Link className="secondary-action" href="/buy/">
              <BadgeDollarSign aria-hidden="true" size={17} />
              Buy USD {primaryOffer.price}
            </Link>
            <Link className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample
            </Link>
            <Link className="secondary-action" href="/tools/website-opportunity-scorer/">
              <Gauge aria-hidden="true" size={17} />
              Try free scorer
            </Link>
          </div>
          <div className="system-strip" aria-label="AgentSiteOps launch loop">
            <span>Offer</span>
            <span>Buyer</span>
            <span>Page</span>
            <span>Outreach</span>
            <span>Validate</span>
          </div>
          <div className="proof-grid" aria-label="Launch summary">
            <div className="proof-item">
              <strong>USD {launchProduct.price}</strong>
              <span>single validation-stage offer, no tier confusion</span>
            </div>
            <div className="proof-item">
              <strong>24-72h</strong>
              <span>manual delivery after payment and intake details</span>
            </div>
            <div className="proof-item">
              <strong>{allRoutes.length}</strong>
              <span>indexable routes kept behind one buy path</span>
            </div>
          </div>
        </div>
        <div className="hero-side">
          <aside className="brand-signal-card" aria-label="AgentSiteOps brand signal">
            <BrandLogo />
            <div className="signal-map" aria-hidden="true">
              <span>Input</span>
              <i />
              <span>Evidence</span>
              <i />
              <span>Route</span>
            </div>
            <p>
              A visible brand mark, source boundary, and one commercial route replace the
              previous generic static-site feel.
            </p>
          </aside>
          <ScorerPanel />
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-head">
          <h2>What the buyer receives</h2>
          <p>
            The first product is not a dashboard or generic audit. It is a compressed
            execution artifact for a founder who needs to stop circling ideas and test one offer.
          </p>
        </div>
        <div className="workflow-grid">
          {launchDeliverables.slice(0, 5).map((item, index) => (
            <div className="workflow-card" key={item}>
              <span aria-hidden="true">{index + 1}</span>
              <h3>{["Offer", "Buyer", "Page", "Price", "Outreach"][index]}</h3>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="route-section">
        <div className="section-head">
          <h2>Market signals shaping the product</h2>
          <p>
            Semrush's current AI Search and SEO coverage reinforces a practical boundary:
            visibility matters, but the three-day validation metric remains payment.
          </p>
        </div>
        <div className="route-grid">
          {marketSignals.map((signal) => (
            <a className="route-card" href={signal.href} key={signal.href} rel="noreferrer" target="_blank">
              <span className="route-icon" aria-hidden="true">
                <SearchCheck size={20} strokeWidth={2.2} />
              </span>
              <small>Semrush signal</small>
              <h3>{signal.title}</h3>
              <p>{signal.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section">
        <div className="section-head">
          <h2>What the route is based on</h2>
          <p>
            The blueprint is not positioned as a superior generic AI answer. It is a
            constrained decision process that uses declared inputs, visible evidence, and
            stop rules.
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

      <section className="pricing-grid-section split-section gate-split">
        <div>
          <h2>Best fit</h2>
          <ul className="compact-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={16} /> You can build AI or automation workflows but cannot package the first offer.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} /> You need a clear page structure and first outreach path more than another tool.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} /> You accept that this is a validation plan, not a revenue guarantee.
            </li>
          </ul>
        </div>
        <div>
          <h2>Not a fit</h2>
          <ul className="compact-list">
            <li>
              <ShieldCheck aria-hidden="true" size={16} /> You want guaranteed traffic, rankings, AI citations, or revenue.
            </li>
            <li>
              <MousePointer2 aria-hidden="true" size={16} /> You need someone to run automated DMs, comments, or platform growth scripts.
            </li>
            <li>
              <Mail aria-hidden="true" size={16} /> You want a full SaaS account, dashboard, or subscription workspace today.
            </li>
          </ul>
          <div className="hero-actions">
            <Link className="primary-action" href="/tools/launch-blueprint-fit-checker/">
              <Rocket aria-hidden="true" size={17} />
              Check launch fit
            </Link>
            <Link className="secondary-action" href="/disclaimer/">
              <ArrowRight aria-hidden="true" size={17} />
              Read limits
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
