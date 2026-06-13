import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { RouteCommandCenter } from "@/components/RouteCommandCenter";
import { primaryOffer, starterOffer } from "@/lib/payments";
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

const frontstageCards = [
  {
    label: "What you submit",
    title: "Messy project material",
    body:
      "Send the project idea, target user, available notes, demos, sources, constraints, blocked claims, and the decision that keeps the project from moving."
  },
  {
    label: "What we do",
    title: "Research, check, repair",
    body:
      "Lock the scope, generate a manual Deep Research prompt pack, check coverage when the report returns, and create a second-pass gap prompt when evidence is weak."
  },
  {
    label: "What you receive",
    title: "One Route File",
    body:
      "Receive a client-readable file that says what to build first, what not to build, what evidence is missing, where to validate, and when to stop."
  }
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
    title: "Manual Deep Research run",
    body:
      "Generate the prompt pack, then run it in ChatGPT Deep Research with the user's own allowance. The website does not run hidden research.",
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
    title: "No automatic Deep Research claim",
    body:
      "AgentSiteOps prepares prompts and checks returned reports. It does not pretend to run ChatGPT Deep Research through a hidden API."
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
  { href: "/how-it-works/", label: "How it works" },
  { href: "/reports/client-route-workflow/", label: "Client route workflow" },
  { href: "/delivery-gate/", label: "Delivery gate" },
  { href: "/templates/route-research-prompt-pack/", label: "Research prompt pack" },
  { href: "/reports/route-basis/", label: "Route basis report" },
  { href: "/methodology/route-selection/", label: "Route selection methodology" },
  { href: "/sample/", label: "Sample Route File" },
  { href: "/pricing/", label: "Pricing and scope" }
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgentSiteOps Research-to-Route File",
    description:
      "A manual research and route-selection service that turns messy project material into one Route File with rejected alternatives and stop rules.",
    inLanguage: "en",
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: "AgentSiteOps"
    },
    offers: [
      {
        "@type": "Offer",
        name: "Fit Review",
        price: starterOffer.price,
        priceCurrency: "USD"
      },
      {
        "@type": "Offer",
        name: "Research-to-Route File",
        price: primaryOffer.price,
        priceCurrency: "USD"
      }
    ]
  };

  return (
    <main className="page-main route-home frontstage-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="frontstage-hero">
        <div className="frontstage-hero-copy">
          <p className="eyebrow">AgentSiteOps Route File</p>
          <h1>Research-to-Route File for messy projects.</h1>
          <p>
            Bring the unclear project, mixed notes, possible offers, risk limits, and
            open decisions. AgentSiteOps turns them into one checked Route File before
            you build another page, tool, checkout, or content system.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/start/">
              <ClipboardList aria-hidden="true" size={17} />
              Start with a project
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample Route File
            </Link>
            <Link prefetch={false} className="secondary-action" href="/how-it-works/">
              <ArrowRight aria-hidden="true" size={17} />
              How it works
            </Link>
          </div>
        </div>

        <aside className="route-file-brief" aria-label="Route File output">
          <span>Route File</span>
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

      <section className="route-foundation-section frontstage-intake-section">
        <div className="route-section-heading">
          <span>Client path</span>
          <h2>Submit the mess. Receive a route.</h2>
          <p>
            The front-stage product is intentionally simple. The templates, research
            prompts, and gates stay behind the scenes until a client needs to inspect the
            method.
          </p>
        </div>
        <div className="frontstage-card-grid">
          {frontstageCards.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section route-flow-section">
        <div className="route-section-heading">
          <span>Product path</span>
          <h2>{"Input -> Research -> Check -> Route -> Stop rule."}</h2>
          <p>
            This is the operational path behind the customer-facing offer. It keeps
            research visible enough to trust without making the user operate the whole
            backend method library.
          </p>
        </div>

        <div className="route-flow-board">
          {routeFlowCards.map((item, index) => {
            const Icon = item.Icon;

            return (
              <article key={item.label}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" size={22} />
                </div>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <strong>{item.output}</strong>
              </article>
            );
          })}
        </div>
      </section>

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
          <h2>The old templates stay. They move behind the product path.</h2>
          <p>
            The method library remains available for audit, SEO, and high-intent review.
            It no longer needs to be the first thing a new visitor understands.
          </p>
          <dl>
            <div>
              <dt>Indexed support routes</dt>
              <dd>{allRoutes.length}</dd>
            </div>
            <div>
              <dt>Starter review</dt>
              <dd>USD {starterOffer.price}</dd>
            </div>
            <div>
              <dt>Route File path</dt>
              <dd>USD {primaryOffer.price}</dd>
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
          <span>Internal route engine</span>
          <h2>The interactive workbench remains as the system layer.</h2>
          <p>
            The workbench is useful for operators and advanced readers. The customer
            offer is still the Route File, not the dashboard itself.
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
          <Link prefetch={false} className="primary-action" href="/start/">
            <ClipboardList aria-hidden="true" size={17} />
            Start here
          </Link>
          <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
            <FileCheck2 aria-hidden="true" size={17} />
            Check delivery gate
          </Link>
          <Link prefetch={false} className="secondary-action" href="/pricing/">
            <BadgeDollarSign aria-hidden="true" size={17} />
            View pricing
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
