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
  title: "AgentSiteOps",
  description:
    "AgentSiteOps turns project facts, evidence, risk boundaries, and delivery capacity into one route map, one rejected-path record, and one 7-day execution plan."
};

const routeFlowCards = [
  {
    label: "Input",
    title: "Messy project intake",
    body:
      "Capture project facts, target user, available assets, source boundaries, constraints, and the decision blocking progress.",
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
    title: "One route file",
    body:
      "Fuse accepted research into selected route, rejected alternatives, evidence ledger, first proof asset, and first validation channel.",
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

const workspaceSignals = [
  {
    label: "Current stage",
    value: "Research run",
    detail: "Intake, scope lock, and prompt brief are already visible before report acceptance."
  },
  {
    label: "Pending check",
    value: "Coverage gate",
    detail: "Missing source table, rejected paths, or stop rule becomes a second-pass research prompt."
  },
  {
    label: "Final artifact",
    value: "Route file",
    detail: "The output is not a loose report. It must show what to build, reject, validate, and stop."
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
    title: "No mixed domain execution",
    body:
      "Domain research can feed the route only after scope, rights, risk, evidence quality, and usefulness checks pass."
  },
  {
    title: "Rejected paths stay in the file",
    body:
      "Weak routes are recorded with rejection reasons, so the project does not drift back into unsupported build work."
  },
  {
    title: "Route confidence is evidence-bound",
    body:
      "Scores and route choices depend on proof assets, buyer signals, delivery capacity, data rights, and hard blockers."
  }
];

const preservedLinks = [
  { href: "/launch-kit/", label: "Launch Kit" },
  { href: "/methodology/route-selection/", label: "Route selection methodology" },
  { href: "/templates/route-research-prompt-pack/", label: "Research delivery workflow" },
  { href: "/reports/client-route-workflow/", label: "Client route workflow" },
  { href: "/reports/agentsiteops-route-run/", label: "Self route run" },
  { href: "/reports/route-basis/", label: "Route basis report" },
  { href: "/sample/", label: "Sample route file" },
  { href: "/pricing/", label: "Pricing and scope" }
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps",
    description:
      "A route selection and launch blueprint system for choosing one project path before building websites, tools, or content systems.",
    inLanguage: "en",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    offers: [
      {
        "@type": "Offer",
        name: "Fit Review",
        price: starterOffer.price,
        priceCurrency: "USD"
      },
      {
        "@type": "Offer",
        name: "Launch Blueprint",
        price: primaryOffer.price,
        priceCurrency: "USD"
      }
    ]
  };

  return (
    <main className="page-main route-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RouteCommandCenter />

      <section className="route-foundation-section route-flow-section">
        <div className="route-section-heading">
          <span>Product path</span>
          <h2>{"Input -> Research -> Check -> Route -> Stop rule."}</h2>
          <p>
            AgentSiteOps turns unclear project material into a client-readable route file.
            The site shows where the work is, what is missing, and why the next action is
            build, repair, or stop.
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

        <div className="route-workspace-strip">
          <div>
            <span>Client workspace</span>
            <h3>Progress is visible before a final handoff.</h3>
          </div>
          {workspaceSignals.map((item) => (
            <article key={item.label}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
          <Link prefetch={false} className="route-workspace-link" href="/reports/client-route-workflow/">
            Open client workspace
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section className="route-foundation-section">
        <div className="route-section-heading">
          <span>Delivery boundary</span>
          <h2>What the product blocks before it sells or builds.</h2>
          <p>
            The workflow is intentionally narrow: it can organize evidence and route
            decisions, but it cannot turn weak research into a guarantee or a finished
            market.
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

      <section className="route-preserved-section">
        <div>
          <span>Existing functions preserved</span>
          <h2>The redesign keeps the current tool surface alive.</h2>
          <p>
            The command center is now the front door. Older scorer and checker pages
            remain available for search and existing links, but they no longer compete
            with the main path.
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
              <dt>Blueprint path</dt>
              <dd>USD {primaryOffer.price}</dd>
            </div>
          </dl>
        </div>

        <div className="route-link-board">
          {preservedLinks.map((item) => (
            <Link prefetch={false} href={item.href} key={item.href}>
              <CheckCircle2 aria-hidden="true" size={16} />
              {item.label}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          ))}
        </div>
      </section>

      <section className="route-final-cta">
        <div>
          <span>Next operating rule</span>
          <h2>Every new project starts with a route map before a build.</h2>
          <p>
            If the selected route cannot name evidence, first asset, rejected alternatives,
            and a stop rule, the project stays in research instead of entering production.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/templates/route-research-prompt-pack/">
            <FileText aria-hidden="true" size={17} />
            Run research workflow
          </Link>
          <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
            <Gauge aria-hidden="true" size={17} />
            Open client workspace
          </Link>
          <Link prefetch={false} className="secondary-action" href="/launch-kit/">
            <FileText aria-hidden="true" size={17} />
            Open Launch Kit
          </Link>
          <Link prefetch={false} className="secondary-action" href="/pricing/">
            <BadgeDollarSign aria-hidden="true" size={17} />
            View pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
