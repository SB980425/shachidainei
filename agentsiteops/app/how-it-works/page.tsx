import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { siteUrl } from "@/lib/site";

const path = "/how-it-works/";

export const metadata: Metadata = {
  title: "How AgentSiteOps Works",
  description:
    "How AgentSiteOps turns messy project input into a Route File through scope lock, approved research channels, coverage gates, repair prompts, and delivery checks.",
  alternates: { canonical: path },
  openGraph: {
    title: "How AgentSiteOps Works",
    description:
      "The visible path from messy project intake to checked Route File, without hidden automatic research or unsupported growth promises.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const workflowSteps = [
  {
    title: "1. Lock the project boundary",
    body:
      "The intake separates usable facts, private limits, source boundaries, risk constraints, candidate routes, and blocked claims."
  },
  {
    title: "2. Generate the research brief",
    body:
      "AgentSiteOps turns the boundary into copy-ready research prompts, acceptance gates, rejection rules, and required output sections."
  },
  {
    title: "3. Run the approved research channel",
    body:
      "The operator runs the locked brief through an approved research channel, manual source-review path, or client-provided report workflow. The website does not create hidden research results."
  },
  {
    title: "4. Apply the Coverage gate",
    body:
      "The returned report is checked for buyer logic, source table, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule."
  },
  {
    title: "5. Repair, fuse, or stop",
    body:
      "Missing evidence becomes a second-pass prompt. Accepted research is fused into one Route File. Unsupported routes stay blocked."
  }
];

const manualBoundaries = [
  {
    title: "No hidden research run",
    body:
      "The website does not silently run a model, store an undisclosed research response, or turn intake into an automatic result."
  },
  {
    title: "Use an approved carrier",
    body:
      "The research run can use an approved external research surface, manual source review, or a client-provided report outside the website."
  },
  {
    title: "Local checking after research",
    body:
      "AgentSiteOps checks the returned report against the required route-file sections before accepting it."
  },
  {
    title: "Fusion is the product",
    body:
      "The deliverable is not a transcript of research. The deliverable is a Route File that selects, rejects, validates, and stops."
  }
];

const proofPoints = [
  "The client can see what stage the project is in.",
  "Weak research triggers a repair prompt instead of polished overconfidence.",
  "Templates and gates stay available as support assets.",
  "No page claims traffic, ranking, AI citation, revenue, or customer response without evidence."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How AgentSiteOps Works",
    description:
      "A five-step workflow for turning messy project input into a checked Route File.",
    url: `${siteUrl}${path}`,
    inLanguage: "en",
    step: workflowSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body
    }))
  };

  return (
    <main className="gate-page how-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero how-hero">
        <div>
          <p className="eyebrow">How it works</p>
          <h1>How AgentSiteOps works from intake to Route File.</h1>
          <p>
            The product path is visible: scope lock, approved research channel, Coverage gate,
            second-pass repair when needed, and final Route File synthesis. It does not
            claim hidden automation or guaranteed outcomes.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/intake/">
              <ClipboardList aria-hidden="true" size={17} />
              Open intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <FileText aria-hidden="true" size={17} />
              View client workflow
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Core boundary</strong>
          <p>
            The website handles briefs, checks, gap repair, and synthesis. Research
            tooling is replaceable; the fixed standard is the Route File acceptance gate.
          </p>
        </aside>
      </section>

      <RouteFlowBridge
        current="scope"
        nextHref="/templates/route-research-prompt-pack/"
        nextLabel="Continue to research"
      />

      <CustomerResponseLifecycle
        variant="compact"
        eyebrow="Customer-visible method"
        title="The method stays visible while the research carrier can change."
        body="AgentSiteOps owns the intake boundary, acceptance gate, repair loop, and Route File synthesis. The research tool or source-review surface can change per project."
      />

      <section className="gate-section">
        <div className="section-head">
          <h2>Five-step workflow</h2>
          <p>
            The workflow is designed to answer one question: what should be built,
            repaired, blocked, or stopped next?
          </p>
        </div>
        <div className="how-step-grid">
          {workflowSteps.map((step) => (
            <article key={step.title}>
              <SearchCheck aria-hidden="true" size={20} />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Research-channel boundary</h2>
          <p>
            The manual mode is explicit so customers do not mistake prompt preparation
            and checking for an automatic research platform.
          </p>
        </div>
        <div className="how-boundary-grid">
          {manualBoundaries.map((item) => (
            <article key={item.title}>
              <ShieldCheck aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section how-split">
        <div>
          <h2>What changes for the client</h2>
          <ul className="compact-list">
            {proofPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Where the templates fit</h2>
          <p>
            The route research prompt pack, delivery gate, client route workflow,
            evidence ledger, and sample Route File remain part of the operating system.
            They support the product, but the customer-facing promise is simpler: one
            checked Route File before build expansion.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <ArrowRight aria-hidden="true" size={17} />
              Prompt pack
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <FileCheck2 aria-hidden="true" size={17} />
              Delivery gate
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Sample Route File
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
