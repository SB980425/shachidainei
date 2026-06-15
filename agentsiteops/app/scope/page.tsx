import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  LockKeyhole,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { ClientRouteStatePanel } from "@/components/ClientRouteStatePanel";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteProjectLifecycle } from "@/components/RouteProjectLifecycle";
import { siteUrl } from "@/lib/site";

const path = "/scope/";

export const metadata: Metadata = {
  title: "Scope Lock",
  description:
    "Freeze the AgentSiteOps route question, source boundary, blocked claims, candidate routes, non-goals, and stop conditions before research begins.",
  alternates: { canonical: path },
  openGraph: {
    title: "Scope Lock",
    description:
      "A customer-visible state between intake and research that prevents a Route File from drifting into broad advice or unsupported build work.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const lockItems = [
  {
    label: "Route question",
    body:
      "The one decision this project must resolve before more pages, tools, offers, outreach, or checkout work expands."
  },
  {
    label: "Allowed sources",
    body:
      "Public links, client-provided notes, screenshots, demos, reports, or manual observations that can be inspected safely."
  },
  {
    label: "Blocked claims",
    body:
      "Traffic, ranking, citation, revenue, buyer response, regulated advice, private data access, and hidden automation promises."
  },
  {
    label: "Candidate routes",
    body:
      "The selected route must be compared against rejected alternatives rather than presented as the only possible answer."
  },
  {
    label: "Non-goals",
    body:
      "What this Route File will not build, sell, automate, scrape, guarantee, or research during the current cycle."
  },
  {
    label: "Stop condition",
    body:
      "The rule that blocks synthesis or expansion when evidence, source rights, delivery capacity, or validation signal is missing."
  }
];

const lockMatrix = [
  {
    state: "Locked",
    title: "Ready for approved research",
    body:
      "Buyer, route question, allowed sources, rejected alternatives, blocked claims, proof asset, validation channel, and stop rule are visible.",
    Icon: CheckCircle2
  },
  {
    state: "Repair",
    title: "Ask only for missing inputs",
    body:
      "The request is useful, but one or more scope facts are missing. Repair the smallest missing part before research starts.",
    Icon: AlertTriangle
  },
  {
    state: "Blocked",
    title: "Do not research or synthesize",
    body:
      "The request depends on private access, unsafe data, impossible guarantees, copied material, or a delivery promise the operator cannot verify.",
    Icon: ShieldCheck
  }
];

const carrierRules = [
  "Research carrier can be manual source review, client report, operator-controlled AI research, or another approved evidence path.",
  "The carrier is replaceable. The acceptance standard is not replaceable.",
  "Returned material must still pass the coverage gate before it becomes a Route File.",
  "A clean-looking report is not delivery when it lacks sources, rejected alternatives, proof asset, validation channel, or stop rule."
];

export default function ScopePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AgentSiteOps Scope Lock",
    description:
      "A customer-visible state for freezing route question, source boundary, claims, candidate routes, non-goals, and stop conditions before approved research.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="page-main scope-lock-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="frontstage-hero scope-lock-hero">
        <div className="frontstage-hero-copy">
          <p className="eyebrow">Scope Lock</p>
          <h1>Freeze the route boundary before research starts.</h1>
          <p>
            Scope Lock is the state between intake and research. It prevents the
            project from drifting into broad market advice, unsupported build work,
            or tool-specific research claims.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/templates/route-research-prompt-pack/">
              <SearchCheck aria-hidden="true" size={17} />
              Continue to research
            </Link>
            <Link prefetch={false} className="secondary-action" href="/intake/">
              <ClipboardList aria-hidden="true" size={17} />
              Repair intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <FileCheck2 aria-hidden="true" size={17} />
              View coverage gate
            </Link>
          </div>
        </div>

        <aside className="route-file-brief scope-lock-brief" aria-label="Scope lock rule">
          <span>Lock rule</span>
          <h2>No research run starts until the route frame is inspectable.</h2>
          <ul>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Sources and rights are named.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Blocked claims are explicit.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Rejected alternatives remain visible.
            </li>
          </ul>
        </aside>
      </section>

      <RouteFlowBridge current="scope" nextHref="/templates/route-research-prompt-pack/" nextLabel="Continue to research" />

      <RouteProjectLifecycle
        current="scope"
        eyebrow="Current state"
        title="Scope Lock turns accepted intake into a research boundary."
        body="This page gives the customer a concrete state after intake and before research, instead of hiding the handoff inside a method article."
      />

      <ClientRouteStatePanel
        current="scope"
        title="The customer can see what is frozen before research."
        body="Scope Lock separates accepted intake from research execution, so the Route File cannot be built on vague sources or unsupported claims."
        compact
      />

      <section className="route-foundation-section scope-lock-section">
        <div className="route-section-heading">
          <span>Locked packet</span>
          <h2>The research brief needs six visible boundaries.</h2>
          <p>
            If any boundary is missing, the next action is repair. The project should not
            continue into research just because the intake sounds interesting.
          </p>
        </div>
        <div className="scope-lock-grid">
          {lockItems.map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section scope-lock-decision-section">
        <div className="route-section-heading">
          <span>Scope decision</span>
          <h2>The accepted packet can only move in three directions.</h2>
          <p>
            Scope Lock is not a writing step. It is a go, repair, or block decision
            before the evidence carrier is allowed to run.
          </p>
        </div>
        <div className="scope-lock-matrix">
          {lockMatrix.map((item) => {
            const Icon = item.Icon;

            return (
              <article key={item.state}>
                <Icon aria-hidden="true" size={19} />
                <span>{item.state}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="route-foundation-section scope-carrier-section">
        <div className="route-section-heading">
          <span>Carrier-neutral</span>
          <h2>The research tool can change; the evidence standard cannot.</h2>
          <p>
            The website should not tell customers that the product is one fixed AI
            research mode. The locked brief controls the work regardless of carrier.
          </p>
        </div>
        <div className="scope-carrier-panel">
          <LockKeyhole aria-hidden="true" size={26} />
          <ul>
            {carrierRules.map((item) => (
              <li key={item}>
                <ArrowRight aria-hidden="true" size={15} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="route-final-cta scope-final-cta">
        <div>
          <span>Next state</span>
          <h2>Move to research only after the scope is locked.</h2>
          <p>
            The next page can prepare or run the research brief, but returned material
            still has to pass the coverage gate before becoming a Route File.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/templates/route-research-prompt-pack/">
            <SearchCheck aria-hidden="true" size={17} />
            Continue to research
          </Link>
          <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
            <ShieldCheck aria-hidden="true" size={17} />
            Coverage gate
          </Link>
          <Link prefetch={false} className="secondary-action" href="/sample/">
            <FileCheck2 aria-hidden="true" size={17} />
            Sample output
          </Link>
        </div>
      </section>
    </main>
  );
}
