import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { RouteCommandCenter } from "@/components/RouteCommandCenter";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import { allRoutes, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research-to-Route File",
  description:
    "AgentSiteOps turns messy project material into a checked Route File with one selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule."
};

const routeFileContract = [
  "Selected route with confidence and evidence basis.",
  "Rejected alternatives with rejection reasons.",
  "Evidence ledger separating verified, pending, inferred, blocked, and not-claimed items.",
  "First proof asset and first validation channel.",
  "Stop rule that blocks build, checkout, or content expansion when evidence is missing."
];

const homeInputRows = [
  {
    label: "Project material",
    body: "Idea, target user, current assets, notes, demos, sources, and constraints."
  },
  {
    label: "Decision block",
    body: "The question that prevents the next page, tool, checkout, or content batch."
  },
  {
    label: "Risk boundary",
    body: "Claims, data limits, buyer promises, private material, and delivery limits."
  },
  {
    label: "Candidate routes",
    body: "Options that should be selected, rejected, repaired, or blocked with evidence."
  }
];

const homeOutputRows = [
  {
    label: "Automatic receipt",
    body: "The site can preserve the packet, show missing fields, and route the customer to the next visible state."
  },
  {
    label: "Manual acceptance",
    body: "A person decides ready, repair, blocked, or not delivery before research and synthesis begin."
  },
  {
    label: "Route File handoff",
    body: "Accepted material becomes one selected route, rejected alternatives, evidence ledger, proof asset, channel, and stop rule."
  }
];

const heroFlowSteps = [
  { label: "Submit", body: "Messy input" },
  { label: "Receipt", body: "Packet visible" },
  { label: "Review", body: "Ready or repair" },
  { label: "Research", body: "Approved carrier" },
  { label: "Route File", body: "Output + stop" }
];

const routeFlowCards = [
  {
    label: "Submit",
    title: "Client sends the messy project",
    body:
      "Collect the project facts, target user, assets, source boundaries, constraints, candidate routes, and current blocker.",
    output: "Intake packet",
    Icon: ClipboardList
  },
  {
    label: "Receipt",
    title: "The request becomes visible",
    body:
      "The site can format the packet, preserve the missing-input list, and show the next state without claiming hidden automatic research.",
    output: "Received, missing, or blocked",
    Icon: Gauge
  },
  {
    label: "Review",
    title: "Operator accepts or repairs",
    body:
      "A person checks scope, safety, source rights, buyer evidence, and delivery capacity before the route workflow proceeds.",
    output: "Ready, repair, or not delivery",
    Icon: FileCheck2
  },
  {
    label: "Research",
    title: "Evidence carrier can change",
    body:
      "Research can use manual source review, a client report, an operator-controlled pass, or another approved carrier. The acceptance standard stays fixed.",
    output: "Checked source material",
    Icon: SearchCheck
  },
  {
    label: "Route File",
    title: "One output with a stop rule",
    body:
      "Accepted material becomes one selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
    output: "Client-readable handoff",
    Icon: FileText
  }
];

const fitCards = [
  {
    title: "Good fit",
    body:
      "You have too many possible offers, pages, tools, or research lanes and need one route to test before building more."
  },
  {
    title: "Not a fit",
    body:
      "You need guaranteed traffic, rankings, AI citations, payment approval, customer replies, revenue, or ongoing monitoring software."
  },
  {
    title: "Best first use",
    body:
      "Use AgentSiteOps before creating a large content batch, a checkout page, a new tool, a paid service page, or another research branch."
  }
];

const boundaryCards = [
  {
    title: "No automatic research claim",
    body:
      "AgentSiteOps prepares briefs and checks returned reports. It does not pretend to run hidden research through a website-side model/API workflow."
  },
  {
    title: "No guaranteed growth claim",
    body:
      "Traffic, ranking, revenue, AI citation, payment approval, and buyer response stay unclaimed until first-party evidence exists."
  },
  {
    title: "Templates stay as support",
    body:
      "The prompt pack, delivery gate, client workflow, route basis, and sample file remain the backend method layer behind the product."
  },
  {
    title: "Rejected paths stay visible",
    body:
      "Weak routes are recorded with rejection reasons, so the project does not drift back into unsupported build work."
  }
];

const proofLayerCards = [
  {
    title: "Evidence used, not guessed",
    body:
      "A Route File can use project material, source notes, buyer replies, search exports, and onsite events, but weak signals stay tagged until verified."
  },
  {
    title: "What the buyer receives is a route file, not a score",
    body:
      "The output is one selected route, rejected alternatives, an evidence ledger, first proof asset, validation channel, and stop rule."
  },
  {
    title: "Market signals are context, not proof",
    body:
      "Search demand, market examples, and public trend research can shape the route, but they do not prove payment, buyer response, or product-market fit."
  }
];

const supportLinks = [
  { href: "/plan/", label: "Plan Studio" },
  { href: "/start/", label: "Start here" },
  { href: "/execution/", label: "Execution workbench" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/reports/client-route-workflow/", label: "Client route workflow" },
  { href: "/delivery-gate/", label: "Delivery gate" },
  { href: "/templates/route-research-prompt-pack/", label: "Research prompt pack" },
  { href: "/reports/route-basis/", label: "Route basis report" },
  { href: "/methodology/route-selection/", label: "Route selection methodology" },
  { href: "/launch-kit/", label: "Launch Kit" },
  { href: "/sample/", label: "Sample Route File" }
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgentSiteOps Research-to-Route File",
    description:
      "An operator-reviewed research and route-selection service that turns messy project material into one Route File with rejected alternatives and stop rules.",
    inLanguage: "en",
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: "AgentSiteOps"
    },
    serviceOutput: "Checked Route File"
  };

  return (
    <main className="page-main route-home frontstage-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="frontstage-hero route-foundry-hero">
        <div className="frontstage-hero-copy">
          <p className="eyebrow">Route Foundry</p>
          <h1>From messy input to one checked Route File.</h1>
          <p>
            Submit the unclear project once. AgentSiteOps turns it into a visible
            intake packet, manual acceptance state, approved research carrier, coverage
            gate, and final route handoff before more build work starts.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <ClipboardList aria-hidden="true" size={17} />
              Draft your plan
            </Link>
            <Link prefetch={false} className="secondary-action" href="/execution/">
              <Activity aria-hidden="true" size={17} />
              Open execution workbench
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample Route File
            </Link>
          </div>
          <div className="frontstage-hero-flow" aria-label="AgentSiteOps route flow">
            {heroFlowSteps.map((step, index) => (
              <article key={step.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.label}</strong>
                <small>{step.body}</small>
              </article>
            ))}
          </div>
        </div>

        <aside className="route-file-brief" aria-label="Route File output">
          <span>Route File Output</span>
          <h2>One decision package, not another loose research report.</h2>
          <ul>
            {routeFileContract.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="route-foundation-section home-proof-section">
        <div className="route-section-heading">
          <span>Proof boundary</span>
          <h2>The route decision must show what is proven and what is still unverified.</h2>
          <p>
            This keeps the site from turning research context, page activity, or generated
            confidence into unsupported delivery claims.
          </p>
        </div>
        <div className="route-foundation-grid is-boundary-grid">
          {proofLayerCards.map((item) => (
            <article key={item.title}>
              <ShieldCheck aria-hidden="true" size={19} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section home-operating-section">
        <div className="route-section-heading">
          <span>Operating path</span>
          <h2>The visitor should always know the current state and next action.</h2>
          <p>
            The support pages remain available, but the homepage now leads with the
            customer-facing path from submission to output.
          </p>
        </div>
        <div className="home-operating-panel">
          <div className="home-intake-panel">
            <span>Client input</span>
            <h3>Submit once. Repair only what is missing.</h3>
            <p>
              The client does not need a polished brief. The intake only needs enough
              material to expose the route decision, missing evidence, and blocked claims.
            </p>
            <div className="home-input-list">
              {homeInputRows.map((item) => (
                <article key={item.label}>
                  <CheckCircle2 aria-hidden="true" size={15} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="home-output-panel" aria-label="What the client can inspect">
            <span>Visible output</span>
            <h3>The response path stays visible.</h3>
            {homeOutputRows.map((item) => (
              <article key={item.label}>
                <strong>{item.label}</strong>
                <p>{item.body}</p>
              </article>
            ))}
            <div className="home-output-actions">
              <Link prefetch={false} href="/plan/">
                Draft plan
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
              <Link prefetch={false} href="/execution/">
                Workbench
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </div>
          </aside>

          <div className="home-flow-lane" aria-label="Input to stop rule flow">
            {routeFlowCards.map((item, index) => {
              const Icon = item.Icon;

              return (
                <article key={item.label}>
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden="true" size={20} />
                  </div>
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <strong>{item.output}</strong>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CustomerResponseLifecycle
        variant="compact"
        eyebrow="Client response loop"
        title="The site can receive and organize the request; final judgment stays visible and manual."
        body="Research tooling is replaceable. The fixed product is the accepted Route File standard and the visible state path around it."
      />

      <section className="route-foundation-section">
        <div className="route-section-heading">
          <span>Fit boundary</span>
          <h2>Use it when the next build decision is unclear.</h2>
          <p>
            AgentSiteOps is not a generic AI business plan generator. It is a route
            selection and delivery gate for projects that need a narrow next step.
          </p>
        </div>
        <div className="frontstage-fit-grid">
          {fitCards.map((item) => (
            <article key={item.title}>
              <ShieldCheck aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section">
        <div className="route-section-heading">
          <span>Delivery boundary</span>
          <h2>What the product blocks before it sells or builds.</h2>
          <p>
            The workflow can organize evidence and route decisions. It cannot turn weak
            research into a guarantee or a finished market.
          </p>
        </div>

        <div className="route-foundation-grid is-boundary-grid">
          {boundaryCards.map((item) => (
            <article key={item.title}>
              <ShieldCheck aria-hidden="true" size={22} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-preserved-section frontstage-support-section">
        <div>
          <span>Supporting system</span>
          <h2>The old templates stay. The workbench connects them.</h2>
          <p>
            The method library remains available for audit, SEO, and high-intent review.
            The execution workbench now acts as the simpler operating layer above it.
          </p>
          <dl>
            <div>
              <dt>Indexed support routes</dt>
              <dd>{allRoutes.length}</dd>
            </div>
            <div>
              <dt>Execution stages</dt>
              <dd>6</dd>
            </div>
            <div>
              <dt>Public languages</dt>
              <dd>2</dd>
            </div>
          </dl>
        </div>

        <div className="route-link-board">
          {supportLinks.map((item) => (
            <Link prefetch={false} href={item.href} key={item.href}>
              <CheckCircle2 aria-hidden="true" size={16} />
              {item.label}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          ))}
        </div>
      </section>

      <section className="route-foundation-section frontstage-workbench-section">
        <div className="route-section-heading">
          <span>Product workbench</span>
          <h2>The route workflow becomes the thing people can click.</h2>
          <p>
            The first screen now leads with the Route File outcome, then exposes the
            route map, coverage decision, evidence settings, and bilingual social copy
            as one balanced product surface.
          </p>
        </div>
        <RouteCommandCenter />
      </section>

      <section className="route-final-cta">
        <div>
          <span>Next operating rule</span>
          <h2>Every new project starts with a Route File before a build.</h2>
          <p>
            If the selected route cannot name evidence, first asset, rejected alternatives,
            and a stop rule, the project stays in research instead of entering production.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/plan/">
            <ClipboardList aria-hidden="true" size={17} />
            Draft your plan
          </Link>
          <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
            <FileCheck2 aria-hidden="true" size={17} />
            Check delivery gate
          </Link>
          <Link prefetch={false} className="secondary-action" href="/execution/">
            <Activity aria-hidden="true" size={17} />
            Open workbench
          </Link>
          <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
            <Gauge aria-hidden="true" size={17} />
            Client workflow
          </Link>
        </div>
      </section>
    </main>
  );
}
