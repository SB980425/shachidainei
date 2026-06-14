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
    label: "Client-visible progress",
    body: "The customer can see intake, scope lock, research-channel status, repair watch, and Route File synthesis."
  },
  {
    label: "Research-channel boundary",
    body: "The website prepares briefs and checks reports. The research carrier is approved per project and can change without changing the Route File standard."
  },
  {
    label: "Claim-safe public copy",
    body: "Chinese and English updates keep the same evidence boundary and do not add growth guarantees."
  }
];

const heroFlowSteps = [
  { label: "Intake", body: "Facts and constraints" },
  { label: "Scope Lock", body: "Boundary and risks" },
  { label: "Research Run", body: "Approved channel" },
  { label: "Coverage Gate", body: "Pass or repair" },
  { label: "Route File", body: "Decision output" }
];

const routeFlowCards = [
  {
    label: "Input",
    title: "Messy project intake",
    body:
      "Capture project facts, target user, assets, source boundaries, constraints, and the decision blocking progress.",
    output: "Usable route brief",
    Icon: ClipboardList
  },
  {
    label: "Research",
    title: "Approved research run",
    body:
      "Generate the route brief, then run it through an approved research channel, manual source review, or client-provided report workflow. The website does not run hidden research.",
    output: "Cited research report",
    Icon: SearchCheck
  },
  {
    label: "Check",
    title: "Coverage gate",
    body:
      "Check buyer logic, source table, rejected alternatives, proof asset, validation channel, and stop rule before accepting the report.",
    output: "Pass or gap prompt",
    Icon: FileCheck2
  },
  {
    label: "Route",
    title: "One Route File",
    body:
      "Fuse accepted research into selected route, rejected alternatives, evidence ledger, first proof asset, and validation channel.",
    output: "Client-readable file",
    Icon: FileText
  },
  {
    label: "Stop rule",
    title: "Build or stop decision",
    body:
      "The route either enters a small validation cycle or stays blocked. No page, checkout, or content batch expands without evidence.",
    output: "Next action boundary",
    Icon: ShieldCheck
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

const supportLinks = [
  { href: "/start/", label: "Start here" },
  { href: "/execution/", label: "Execution workbench" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/reports/client-route-workflow/", label: "Client route workflow" },
  { href: "/delivery-gate/", label: "Delivery gate" },
  { href: "/templates/route-research-prompt-pack/", label: "Research prompt pack" },
  { href: "/reports/route-basis/", label: "Route basis report" },
  { href: "/methodology/route-selection/", label: "Route selection methodology" },
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
          <h1>Turn messy client input into one reviewable Route File.</h1>
          <p>
            Bring the unclear project, mixed notes, possible offers, risk limits, and
            open decisions. AgentSiteOps processes them through intake, scope lock,
            approved research channel, coverage gate, and final route output before another page,
            tool, checkout, or content system is built.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/intake/">
              <ClipboardList aria-hidden="true" size={17} />
              Open intake
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

      <section className="route-foundation-section home-operating-section">
        <div className="route-section-heading">
          <span>Operating path</span>
          <h2>One customer-readable path replaces scattered method pages.</h2>
          <p>
            The homepage now shows the product as an execution surface: submit the
            project, run research outside the website through an approved carrier, check coverage, deliver one
            Route File, then stop or validate.
          </p>
        </div>
        <div className="home-operating-panel">
          <div className="home-intake-panel">
            <span>Client input</span>
            <h3>Submit the messy project once.</h3>
            <p>
              The client does not need a polished brief. The system only needs enough
              material to lock the decision boundary and block unsupported claims.
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
            <h3>The method library becomes one inspected route.</h3>
            {homeOutputRows.map((item) => (
              <article key={item.label}>
                <strong>{item.label}</strong>
                <p>{item.body}</p>
              </article>
            ))}
            <div className="home-output-actions">
              <Link prefetch={false} href="/reports/client-route-workflow/">
                Client progress
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

      <CustomerResponseLifecycle />

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
          <Link prefetch={false} className="primary-action" href="/intake/">
            <ClipboardList aria-hidden="true" size={17} />
            Open intake
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
