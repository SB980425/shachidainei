import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteFileAcceptancePanel } from "@/components/RouteFileAcceptancePanel";
import { siteUrl } from "@/lib/site";

const path = "/delivery-gate/";

export const metadata: Metadata = {
  title: "Delivery Gate",
  description:
    "A customer-facing AgentSiteOps delivery gate for checking whether a Route File is pass, repair, blocked, or not delivery.",
  alternates: { canonical: path },
  openGraph: {
    title: "Delivery Gate",
    description:
      "See how AgentSiteOps decides whether a Route File is complete, needs repair, stays blocked, or does not count as delivery.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const states = [
  {
    label: "pass",
    title: "Send the Route File",
    body:
      "The file selects one route, rejects alternatives, tags the evidence ledger, names the first proof asset, defines a validation channel, and states a stop rule."
  },
  {
    label: "repair",
    title: "Run a second-pass prompt",
    body:
      "The research is useful but incomplete. Missing buyer proof, evidence tags, proof asset, validation rule, or rejected alternatives become a focused repair task."
  },
  {
    label: "blocked",
    title: "Keep the project out of delivery",
    body:
      "The route depends on unsafe claims, weak source rights, missing delivery capacity, or buyer evidence that is too thin to support a client handoff."
  },
  {
    label: "not delivery",
    title: "Reject the handoff",
    body:
      "A broad memo, generic strategy, unsupported promise, or automatic-research claim is not an AgentSiteOps Route File."
  }
];

const contract = [
  "Selected route with confidence level and evidence basis.",
  "Rejected alternatives with reasons tied to evidence, risk, delivery, or buyer value.",
  "Evidence ledger that separates verified, pending, inferred, stale, blocked, and not-claimed items.",
  "First proof asset that can test demand before more pages, checkout, tools, or content expand.",
  "Validation channel with counted signal, ignored weak signal, review window, and stop rule.",
  "Explicit list of what is not proven: traffic, ranking, AI citation, revenue, customer response, or product-market fit."
];

const progressChecks = [
  {
    title: "Input accepted",
    body:
      "Project facts, source limits, constraints, candidate routes, and blocked claims are visible before research starts."
  },
  {
    title: "Manual research complete",
    body:
      "The report came from a visible ChatGPT Deep Research run using the client or operator allowance, not a hidden website API call."
  },
  {
    title: "Coverage reviewed",
    body:
      "The returned report has been checked for route logic, source table, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule."
  },
  {
    title: "Final synthesis ready",
    body:
      "Only accepted evidence enters the final Route File. Weak sections stay marked as repair, blocked, or not delivery."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "AgentSiteOps Delivery Gate",
    description:
      "A customer-facing delivery gate for deciding whether a Route File can be handed off.",
    url: `${siteUrl}${path}`,
    inLanguage: "en",
    step: states.map((item, index) => ({
      "@type": "HowToStep",
      name: item.title,
      position: index + 1,
      text: item.body
    }))
  };

  return (
    <main className="gate-page delivery-gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero delivery-gate-hero">
        <div>
          <p className="eyebrow">Delivery gate</p>
          <h1>Delivery gate for every Route File handoff.</h1>
          <p>
            This customer-readable standard shows what must be present before a research
            run becomes a Route File, and when the result should stay in repair, blocked,
            or not delivery state.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Compare sample Route File
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <ClipboardList aria-hidden="true" size={17} />
              Client progress page
            </Link>
            <Link prefetch={false} className="secondary-action" href="/checklists/route-file-delivery-gate/">
              <FileCheck2 aria-hidden="true" size={17} />
              Full checklist
            </Link>
          </div>
        </div>
        <aside className="decision-card delivery-gate-card">
          <strong>Route File acceptance</strong>
          <p>
            Delivery means selected route, rejected alternatives, evidence ledger, first
            proof asset, validation channel, and stop rule. Anything less stays in repair
            or blocked state.
          </p>
          <dl>
            <div>
              <dt>Primary decision</dt>
              <dd>pass, repair, blocked, or not delivery.</dd>
            </div>
            <div>
              <dt>Full checklist</dt>
              <dd>/checklists/route-file-delivery-gate/</dd>
            </div>
          </dl>
        </aside>
      </section>

      <RouteFlowBridge current="gate" nextHref="/sample/" nextLabel="Continue to sample" />

      <section className="gate-section">
        <div className="section-head">
          <h2>Decision states</h2>
          <p>
            The gate is designed to stop weak research from turning into confident client
            copy. Each state has a different next action.
          </p>
        </div>
        <div className="delivery-state-grid">
          {states.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <RouteFileAcceptancePanel />

      <section className="gate-section split-section delivery-gate-split">
        <div>
          <h2>Route File contract</h2>
          <ul className="compact-list">
            {contract.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>What it prevents</h2>
          <p>
            The gate blocks broad reports, unsupported paid promises, hidden automation
            claims, and route recommendations that do not name evidence or a stop rule.
          </p>
          <div className="delivery-linked-actions">
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <SearchCheck aria-hidden="true" size={17} />
              Research workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/how-it-works/">
              <ArrowRight aria-hidden="true" size={17} />
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Visible progress checks</h2>
          <p>
            A client should be able to see where the project stands before the final
            Route File is treated as complete.
          </p>
        </div>
        <div className="delivery-contract-grid delivery-progress-grid">
          {progressChecks.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <ShieldCheck aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section delivery-gate-split">
        <div>
          <h2>Customer use</h2>
          <p>
            Use this page to judge whether the final handoff is a Route File or still a
            research task. If the six contract parts are not visible, the output is not
            complete.
          </p>
        </div>
        <div>
          <h2>Operator use</h2>
          <p>
            Use the full checklist after coverage review and before sending the final
            file. Missing coverage should create a repair prompt, not polished delivery
            language.
          </p>
          <div className="delivery-linked-actions">
            <Link prefetch={false} className="secondary-action" href="/checklists/route-file-delivery-gate/">
              <FileCheck2 aria-hidden="true" size={17} />
              Full checklist
            </Link>
            <Link prefetch={false} className="secondary-action" href="/pricing/">
              <ArrowRight aria-hidden="true" size={17} />
              Pricing boundary
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
