import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Languages,
  SearchCheck
} from "lucide-react";
import { ClientRouteWorkspace } from "@/components/ClientRouteWorkspace";
import { ExecutionWorkbench } from "@/components/ExecutionWorkbench";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Execution Workbench",
  description:
    "An AgentSiteOps execution workbench for moving from messy project intake to scoped research, coverage checks, Route File output, and bilingual social copy.",
  alternates: {
    canonical: "/execution/"
  }
};

const operatingRules = [
  "Start from project facts, not a checkout decision.",
  "Run research manually with a locked prompt pack.",
  "Check returned reports before synthesis.",
  "Merge duplicate modules into one owned page.",
  "Translate public copy without changing the claim boundary."
];

const visibleOutputs = [
  {
    title: "Current stage",
    body: "The active step shows pass condition, trigger, next action, and what does not count as delivery."
  },
  {
    title: "Click path",
    body: "The workbench links the user from start page to prompt pack, delivery gate, sample, and client workflow."
  },
  {
    title: "Event logic",
    body: "The page records aggregate-safe stage and copy events without raw text, contact data, or private project details."
  },
  {
    title: "Social copy",
    body: "English and Chinese variants stay paired so public updates do not drift into unsupported promises."
  }
];

export default function ExecutionPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps Execution Workbench",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/execution/`,
    description:
      "A browser workbench for routing messy project material through intake, scope lock, manual research, coverage gate, Route File synthesis, and bilingual social copy."
  };

  return (
    <main className="page-main frontstage-home execution-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="frontstage-hero execution-hero">
        <div className="frontstage-hero-copy">
          <p className="eyebrow">Execution Workbench</p>
          <h1>Run the Route File workflow before expanding the site.</h1>
          <p>
            Use this page as the main operating path: intake, scope lock, manual
            research, coverage gate, Route File, and bilingual social copy. Payment stays
            secondary to execution clarity.
          </p>
          <div className="hero-actions">
            <Link
              prefetch={false}
              className="primary-action"
              href="/intake/"
              data-analytics-event="cta_click"
              data-analytics-label="execution_start"
              data-analytics-target="/intake/"
              data-analytics-type="execution_page"
            >
              <ClipboardList aria-hidden="true" size={17} />
              Open intake
            </Link>
            <Link
              prefetch={false}
              className="secondary-action"
              href="/templates/route-research-prompt-pack/"
              data-analytics-event="cta_click"
              data-analytics-label="execution_prompt_pack"
              data-analytics-target="/templates/route-research-prompt-pack/"
              data-analytics-type="execution_page"
            >
              <SearchCheck aria-hidden="true" size={17} />
              Prompt pack
            </Link>
            <Link
              prefetch={false}
              className="secondary-action"
              href="/sample/"
              data-analytics-event="cta_click"
              data-analytics-label="execution_sample"
              data-analytics-target="/sample/"
              data-analytics-type="execution_page"
            >
              <FileText aria-hidden="true" size={17} />
              Sample Route File
            </Link>
          </div>
        </div>

        <aside className="route-file-brief execution-brief" aria-label="Execution rules">
          <span>Main path</span>
          <h2>Every action must move the project to a clearer route state.</h2>
          <ul>
            {operatingRules.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <RouteFlowBridge
        current="gate"
        eyebrow="Workbench context"
        nextHref="/sample/"
        nextLabel="Review Route File output"
      />

      <section className="route-foundation-section execution-output-section">
        <div className="route-section-heading">
          <span>Visible product logic</span>
          <h2>The site becomes an execution surface, not a payment-first funnel.</h2>
          <p>
            The workbench keeps the current Route File style while exposing the processing
            logic that a client or operator can follow.
          </p>
        </div>
        <div className="execution-visible-grid">
          {visibleOutputs.map((item) => (
            <article key={item.title}>
              <FileCheck2 aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section execution-client-section">
        <div className="route-section-heading">
          <span>Client progress layer</span>
          <h2>The workbench also needs a customer-readable status surface.</h2>
          <p>
            This embedded workspace shows what the client can inspect while the operator
            moves through intake, manual research, coverage repair, Route File synthesis,
            and public-copy conversion.
          </p>
        </div>
        <ClientRouteWorkspace />
      </section>

      <ExecutionWorkbench />

      <section className="route-final-cta execution-final-cta">
        <div>
          <span>Next path</span>
          <h2>Keep templates, but make the workbench the operating center.</h2>
          <p>
            The prompt pack, delivery gate, client workflow, route basis, and sample stay
            available. This page connects them into one visible execution loop.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/delivery-gate/">
            <FileCheck2 aria-hidden="true" size={17} />
            Check delivery
          </Link>
          <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
            <ArrowRight aria-hidden="true" size={17} />
            Client progress
          </Link>
          <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
            <Languages aria-hidden="true" size={17} />
            Research prompts
          </Link>
        </div>
      </section>
    </main>
  );
}
