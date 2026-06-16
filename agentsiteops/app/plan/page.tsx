import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { ClientRouteStatePanel } from "@/components/ClientRouteStatePanel";
import { PlanDraftStudio } from "@/components/PlanDraftStudio";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteProjectLifecycle } from "@/components/RouteProjectLifecycle";
import { RouteStageHeader } from "@/components/RouteStageHeader";
import { siteUrl } from "@/lib/site";

const path = "/plan/";

export const metadata: Metadata = {
  title: "Plan Studio",
  description:
    "Fill in a messy project plan and get a browser-local preliminary AgentSiteOps route draft before manual intake or final Route File review.",
  alternates: { canonical: path },
  openGraph: {
    title: "Plan Studio",
    description:
      "A clear place to fill in a project plan, see a preliminary route draft, copy a plan brief, and continue to manual intake.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const boundaryCards = [
  {
    title: "Browser-local draft",
    body:
      "The page turns your fields into a preliminary route draft in the browser. It does not call an API or create a hidden research result.",
    Icon: ClipboardList
  },
  {
    title: "Operator review next",
    body:
      "A ready draft can be copied into intake so a person can accept, repair, block, or scope the route before research.",
    Icon: FileCheck2
  },
  {
    title: "Route File is later",
    body:
      "The final Route File still requires accepted evidence, rejected alternatives, a proof asset, validation channel, and stop rule.",
    Icon: FileText
  }
];

const flowRows = [
  { label: "Write", body: "Fill the project plan in plain language." },
  { label: "Draft", body: "See route, gaps, rejected alternatives, and 7-day path." },
  { label: "Copy", body: "Copy the plan brief without exposing private details." },
  { label: "Intake", body: "Send it for manual/operator review when ready." }
];

export default function PlanPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps Plan Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}${path}`,
    description:
      "A browser-local planning studio for turning messy project notes into a preliminary route draft before manual intake.",
    inLanguage: "en"
  };

  return (
    <main className="page-main plan-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="frontstage-hero plan-hero">
        <div className="frontstage-hero-copy">
          <p className="eyebrow">Plan Studio</p>
          <h1>Fill in your project plan before asking for a Route File.</h1>
          <p>
            This is the missing customer entry point: write what you want to do, what
            exists, what is blocked, and what cannot be claimed. The page creates a
            preliminary route draft before manual intake or final delivery.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#plan-draft">
              <ClipboardList aria-hidden="true" size={17} />
              Start drafting
            </a>
            <Link prefetch={false} className="secondary-action" href="/idea-risk-test/">
              <Gauge aria-hidden="true" size={17} />
              Run free risk test
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View final sample
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ShieldCheck aria-hidden="true" size={17} />
              Delivery boundary
            </Link>
          </div>
        </div>

        <aside className="route-file-brief plan-brief" aria-label="Plan Studio boundary">
          <span>What happens here</span>
          <h2>A draft is not the final Route File.</h2>
          <ul>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              You can test the input flow without payment.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Research carrier stays replaceable.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Human review still gates the route.
            </li>
          </ul>
        </aside>
      </section>

      <RouteStageHeader
        current="plan"
        title="Plan Draft is the first usable product step."
        body="Fill one staged draft before the project becomes intake, scope, research, gate, Route File, or validation work."
      />

      <RouteFlowBridge
        current="plan"
        eyebrow="Plan context"
        nextHref="/intake/"
        nextLabel="Continue to intake"
      />

      <RouteProjectLifecycle
        current="plan"
        eyebrow="Current state"
        title="Plan Studio is the first Route Project state."
        body="The page is not only a form. It creates the first project object that can later be reviewed, repaired, blocked, researched, and delivered."
      />

      <ClientRouteStatePanel
        current="plan"
        title="Plan Studio tells the visitor what happens before intake."
        body="The draft, autosave, export, and copy actions are automatic. Acceptance, scope lock, and Route File judgment remain manual."
        compact
      />

      <section className="plan-flow-strip" aria-label="Plan Studio flow">
        {flowRows.map((item, index) => (
          <article key={item.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{item.label}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="route-foundation-section plan-boundary-section">
        <div className="route-section-heading">
          <span>Boundary</span>
          <h2>The page gives visitors a clear place to act.</h2>
          <p>
            Plan Studio sits before intake. It reduces confusion by separating
            preliminary draft, operator review, and final Route File delivery.
          </p>
        </div>
        <div className="plan-boundary-grid">
          {boundaryCards.map((item) => {
            const Icon = item.Icon;

            return (
              <article key={item.title}>
                <Icon aria-hidden="true" size={21} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div id="plan-draft">
        <PlanDraftStudio />
      </div>

      <section className="route-final-cta plan-final-cta">
        <div>
          <span>After the draft</span>
          <h2>Use the draft to decide whether manual intake is worth opening.</h2>
          <p>
            If the draft cannot name buyer, route, failure node, evidence gaps, rejected
            alternatives, validation channel, and stop rule, keep repairing the plan
            before submitting it.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="secondary-action" href="/idea-risk-test/">
            <Gauge aria-hidden="true" size={17} />
            Re-test idea risk
          </Link>
          <Link prefetch={false} className="primary-action" href="/intake/">
            <ClipboardList aria-hidden="true" size={17} />
            Continue to intake
          </Link>
          <Link prefetch={false} className="secondary-action" href="/review-status/">
            <FileCheck2 aria-hidden="true" size={17} />
            Review states
          </Link>
          <Link prefetch={false} className="secondary-action" href="/how-it-works/">
            <SearchCheck aria-hidden="true" size={17} />
            Read method
          </Link>
          <Link prefetch={false} className="secondary-action" href="/sample/">
            <ArrowRight aria-hidden="true" size={17} />
            Inspect sample
          </Link>
        </div>
      </section>
    </main>
  );
}
