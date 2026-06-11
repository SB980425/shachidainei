import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  FileText,
  Gauge,
  Mail,
  MousePointer2,
  ShieldCheck,
  TimerReset
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  authorityBoundaries,
  blueprintEvidenceInputs,
  launchProduct,
  marketSignals,
  samplePaidArtifactChecklist,
  starterReviewAcceptanceCriteria,
  starterReviewDeliverables,
  starterReviewProduct
} from "@/lib/launch";
import { primaryOffer, starterOffer } from "@/lib/payments";
import { allRoutes, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AgentSiteOps",
  description:
    "AgentSiteOps validates whether an AI-capable solo builder has a sellable first offer before they build a site, dashboard, or content system."
};

const decisionSteps = [
  {
    title: "Send the raw facts",
    body: "Skill stack, proof assets, buyer idea, time limit, price range, and any regulated or platform-risk boundary.",
    icon: FileText
  },
  {
    title: "Get one verdict",
    body: "Go, narrow, or stop. The answer names the biggest blocker before it recommends more work.",
    icon: Gauge
  },
  {
    title: "Only then scale",
    body: "Move to the USD 99 blueprint only when the small review finds enough evidence for a route.",
    icon: TimerReset
  }
];

const shortProof = [
  ["USD 29", "manual pre-purchase verdict"],
  ["24h", starterReviewProduct.timeline.replace("Manual delivery within ", "").replace(" after payment confirmation and usable intake details.", "")],
  ["52/100", "current public self-score"],
  [String(allRoutes.length), "indexable support routes"]
];

const blockers = [
  "No guaranteed traffic, ranking, AI citation, customer, or revenue claim.",
  "No subscription pitch until repeat usage is proven.",
  "No full blueprint sale when the intake is too weak."
];

const proofConsoleItems = [
  {
    title: "Inputs",
    body: "Skills, assets, buyer idea, public proof, time limit, price range, and risk boundaries."
  },
  {
    title: "Scoring",
    body: "Offer clarity, buyer trigger, proof depth, delivery ability, search evidence, and hard blockers."
  },
  {
    title: "Output",
    body: "One selected route, rejected alternatives, page structure, outreach path, and a stop rule."
  },
  {
    title: "Limits",
    body: "Missing search, payment, intake, or buyer evidence is marked as missing instead of inferred."
  }
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgentSiteOps",
    description:
      "A fit review and launch blueprint service for AI-capable solo builders who need one sellable offer, one page structure, and one first outreach path.",
    inLanguage: "en",
    url: siteUrl,
    potentialAction: {
      "@type": "ViewAction",
      target: `${siteUrl}/starter-review/`,
      name: "Start the AgentSiteOps Fit Review"
    }
  };

  return (
    <main className="page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="validation-hero">
        <div className="validation-hero-copy">
          <p className="hero-kicker">AI service offer validation</p>
          <h1>Validate your first AI service offer before building the site.</h1>
          <p className="hero-lede">
            A USD {starterOffer.price} manual Fit Review gives one verdict: go, narrow,
            or stop. Use it before spending days on a landing page, automation demo, or
            broad content plan.
          </p>

          <div className="hero-actions hero-actions-tight">
            <Link className="primary-action" href="/starter-review/">
              <BadgeDollarSign aria-hidden="true" size={17} />
              Start with USD {starterOffer.price} Fit Review
            </Link>
            <Link className="secondary-action" href="/examples/fit-review-sample/">
              <FileText aria-hidden="true" size={17} />
              See sample verdict
            </Link>
          </div>

          <div className="validation-proof-strip" aria-label="AgentSiteOps launch summary">
            {shortProof.map(([value, label]) => (
              <div key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="validation-panel" aria-label="AgentSiteOps validation model">
          <div className="validation-panel-head">
            <BrandLogo />
            <span>commercially unvalidated by default</span>
          </div>

          <div className="validation-stage" aria-hidden="true">
            <div className="validation-track validation-track-a" />
            <div className="validation-track validation-track-b" />
            <div className="validation-core">
              <strong>52</strong>
              <span>/100</span>
              <small>current score</small>
            </div>
            <span className="validation-node node-offer">Offer</span>
            <span className="validation-node node-proof">Proof</span>
            <span className="validation-node node-buyer">Buyer</span>
            <span className="validation-node node-route">Route</span>
          </div>

          <div className="verdict-stack">
            {["Go", "Narrow", "Stop"].map((item, index) => (
              <span className={index === 1 ? "is-active" : ""} key={item}>
                <Activity aria-hidden="true" size={14} />
                {item}
              </span>
            ))}
          </div>

          <div className="validation-meter" aria-label="Validation score meter">
            <span />
          </div>
          <p>
            The product starts as a small paid decision, not a promise that the full
            blueprint is always worth buying.
          </p>
        </aside>
      </section>

      <section className="proof-console-section compact-home-section">
        <div className="proof-console">
          <div className="proof-console-brand">
            <BrandLogo compact />
            <span>evidence before roadmap</span>
          </div>
          <h2>Evidence used, not guessed.</h2>
          <p>
            The paid work is not a prettier AI answer. It is a constrained decision
            pass that turns messy inputs into one route and records which claims remain
            unproven.
          </p>
          <div className="proof-console-grid">
            {proofConsoleItems.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="artifact-preview-card" aria-label="Launch Blueprint artifact preview">
          <span>Paid artifact preview</span>
          <h3>What the buyer receives is a route file, not a score.</h3>
          <ul>
            {samplePaidArtifactChecklist.slice(0, 4).map((item) => (
              <li key={item.title}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item.title}: {item.body}
              </li>
            ))}
          </ul>
          <Link className="secondary-action" href="/sample/">
            <FileText aria-hidden="true" size={17} />
            Inspect full sample
          </Link>
        </aside>
      </section>

      <section className="workflow-section compact-home-section">
        <div className="section-head">
          <h2>Three-minute decision path</h2>
          <p>
            The page now keeps the buyer on one route: check whether a first offer deserves
            a real build plan.
          </p>
        </div>
        <div className="workflow-grid">
          {decisionSteps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="workflow-card" key={item.title}>
                <span aria-hidden="true">{index + 1}</span>
                <Icon aria-hidden="true" size={20} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section">
        <div className="section-head">
          <h2>What the USD {starterOffer.price} review includes</h2>
          <p>
            The first sale is deliberately small. It should answer whether the full USD{" "}
            {primaryOffer.price} blueprint is useful or wasteful.
          </p>
        </div>
        <div className="pricing-grid">
          {starterReviewDeliverables.slice(0, 3).map((item) => (
            <article key={item}>
              <span aria-hidden="true">
                <CheckCircle2 size={18} />
              </span>
              <h3>{item.split(".")[0]}</h3>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-grid-section split-section gate-split compact-home-section">
        <div>
          <h2>Why this is not generic AI advice</h2>
          <ul className="compact-list">
            {blueprintEvidenceInputs.slice(0, 3).map((item) => (
              <li key={item.title}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item.title}: {item.body}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Payment blockers stay visible</h2>
          <ul className="compact-list">
            {blockers.map((item) => (
              <li key={item}>
                <ShieldCheck aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link className="primary-action" href="/starter-review/">
              <BadgeDollarSign aria-hidden="true" size={17} />
              Start the small review
            </Link>
            <Link className="secondary-action" href="/disclaimer/">
              <ArrowRight aria-hidden="true" size={17} />
              Read limits
            </Link>
          </div>
        </div>
      </section>

      <section className="conversion-band">
        <div>
          <p className="hero-kicker">Full blueprint is gated</p>
          <h2>Buy the full route only after the fit verdict supports it.</h2>
          <p>
            {launchProduct.promise} The review can still say stop when the evidence is too
            weak.
          </p>
        </div>
        <div className="conversion-actions">
          <Link className="primary-action" href="/starter-review/">
            <BadgeDollarSign aria-hidden="true" size={17} />
            Fit Review USD {starterOffer.price}
          </Link>
          <Link className="secondary-action" href="/buy/">
            <MousePointer2 aria-hidden="true" size={17} />
            Full Blueprint USD {primaryOffer.price}
          </Link>
        </div>
      </section>

      <section className="pricing-grid-section compact-home-section evidence-disclosure">
        <div className="section-head">
          <h2>Authority boundary</h2>
          <p>{authorityBoundaries[0]}</p>
        </div>
        <div className="acceptance-row">
          {starterReviewAcceptanceCriteria.slice(0, 3).map((item) => (
            <article key={item.title}>
              <Mail aria-hidden="true" size={17} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="market-signal-section compact-home-section">
        <div className="section-head">
          <h2>Market signals are context, not proof.</h2>
          <p>
            Public AI-search and SEO research shapes the checklist, but only first-party
            payment, intake, search, reply, and delivery evidence can validate this offer.
          </p>
        </div>
        <div className="market-signal-grid">
          {marketSignals.slice(0, 3).map((item) => (
            <a href={item.href} key={item.title} rel="noreferrer" target="_blank">
              <strong>{item.title}</strong>
              <span>{item.summary}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
