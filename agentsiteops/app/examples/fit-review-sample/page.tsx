import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, FileText, ShieldAlert } from "lucide-react";
import { primaryOffer, starterOffer } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const path = "/examples/fit-review-sample/";

const sampleInputs = [
  {
    label: "Builder ability",
    value: "Can build simple AI workflows, publish a one-page site, and send manual outreach."
  },
  {
    label: "Current evidence",
    value: "One demo, no paid customer, no search console data, and no repeated buyer request yet."
  },
  {
    label: "Target buyer",
    value: "Solo consultants who lose time qualifying inbound leads."
  },
  {
    label: "Constraint",
    value: "No regulated advice, no private account access, no automated DMs, and no revenue guarantee."
  }
];

const verdictRows = [
  {
    label: "Verdict",
    value: "Narrow before buying the full Launch Blueprint."
  },
  {
    label: "Strongest blocker",
    value: "The target buyer is plausible, but the pain proof is still too broad. The buyer needs one visible before/after workflow example."
  },
  {
    label: "Minimum missing evidence",
    value: "Create one anonymized intake-and-follow-up workflow screenshot or walkthrough, then ask 10 target buyers whether it matches their current problem."
  },
  {
    label: "Full blueprint decision",
    value: "Do not buy the USD 99 blueprint yet. Buy it only after the workflow example gets at least two qualified replies or one clear paid pilot request."
  }
];

const stopConditions = [
  "No qualified reply after 20 targeted messages.",
  "Target buyers describe the problem as low priority.",
  "The workflow requires private account access or regulated advice.",
  "The buyer asks for traffic, rankings, revenue, or platform-safety guarantees."
];

const nextActions = [
  "Publish a small before/after workflow screenshot or text walkthrough.",
  "Send 10 manual messages to solo consultants with the specific workflow example.",
  "Record replies as: interested, confused, price objection, not urgent, or unsafe scope.",
  "Return to the full Launch Blueprint only if replies show one urgent buyer trigger."
];

export const metadata: Metadata = {
  title: "Fit Review Sample",
  description:
    "A sample AgentSiteOps Fit Review showing the go, narrow, or stop verdict before the full Launch Blueprint purchase.",
  alternates: { canonical: path },
  openGraph: {
    title: "Fit Review Sample",
    description:
      "Preview the USD 29 Fit Review format before buying a manual pre-purchase verdict.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Sample AgentSiteOps Fit Review",
    description: "A fictional sample showing the structure of the USD 29 Fit Review deliverable.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero">
        <div>
          <p className="eyebrow">Sample Fit Review</p>
          <h1>A smaller paid verdict before the full blueprint.</h1>
          <p>
            This fictional sample shows what the USD {starterOffer.price} Fit Review returns:
            a go, narrow, or stop decision, one blocker, missing evidence, and the next action.
            It is not the USD {primaryOffer.price} Launch Blueprint.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/starter-review/">
              <CreditCard aria-hidden="true" size={17} />
              View Fit Review
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Compare full blueprint sample
            </Link>
            <Link prefetch={false} className="secondary-action" href="/pricing/">
              <ArrowRight aria-hidden="true" size={17} />
              Compare prices
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Sample status</strong>
          <p>
            Fictional example. It demonstrates delivery format and rejection logic, not a real customer result.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Input snapshot</h2>
          <p>
            The review starts from a small factual intake. Missing proof lowers confidence
            instead of being hidden inside a confident recommendation.
          </p>
        </div>
        <div className="comparison-table comparison-table-wide" role="table" aria-label="Fit Review input snapshot">
          <div role="row">
            <strong role="columnheader">Input</strong>
            <strong role="columnheader">Sample value</strong>
          </div>
          {sampleInputs.map((item) => (
            <div key={item.label} role="row">
              <span role="cell">{item.label}</span>
              <span role="cell">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Review verdict</h2>
          <p>
            The result is intentionally short. A good Fit Review can say not yet when
            the full blueprint would be premature.
          </p>
        </div>
        <div className="comparison-table comparison-table-wide" role="table" aria-label="Fit Review verdict">
          <div role="row">
            <strong role="columnheader">Field</strong>
            <strong role="columnheader">Sample verdict</strong>
          </div>
          {verdictRows.map((item) => (
            <div key={item.label} role="row">
              <span role="cell">{item.label}</span>
              <span role="cell">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Stop conditions</h2>
          <ul className="compact-list">
            {stopConditions.map((item) => (
              <li key={item}>
                <ShieldAlert aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Next actions</h2>
          <ul className="compact-list">
            {nextActions.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>What this sample proves</h2>
          <p>
            It proves only the delivery shape: a short decision artifact that can prevent
            a larger wrong-fit purchase. It does not prove traffic, revenue, citations, or demand.
          </p>
        </div>
        <div>
          <h2>When to buy the full blueprint</h2>
          <p>
            Move to the full Launch Blueprint only when the buyer trigger, proof asset,
            and manual outreach path are specific enough to build a one-page offer.
          </p>
          <Link prefetch={false} className="secondary-action" href="/buy/">
            <ArrowRight aria-hidden="true" size={17} />
            View full blueprint
          </Link>
        </div>
      </section>
    </main>
  );
}
