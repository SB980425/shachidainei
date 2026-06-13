import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  SearchCheck
} from "lucide-react";
import { ClientRouteWorkspace } from "@/components/ClientRouteWorkspace";
import { siteUrl } from "@/lib/site";

const path = "/reports/client-route-workflow/";

export const metadata: Metadata = {
  title: "Client Route Workflow",
  description:
    "A client-facing project workspace preview showing intake, manual Deep Research progress, coverage checks, gap research, and final route-file boundaries.",
  alternates: { canonical: path },
  openGraph: {
    title: "Client Route Workflow",
    description:
      "Inspect how AgentSiteOps turns a messy project intake into a checked route file without pretending manual Deep Research is automatic.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const intakeChecklist = [
  "Project idea, target user, and the decision blocking progress.",
  "Available files, samples, public pages, source notes, and private material limits.",
  "Constraints around claims, delivery capacity, payment, timeline, data rights, and risk.",
  "Known alternatives that should be compared instead of silently ignored."
];

const passedItems = [
  {
    title: "Boundary is visible",
    body:
      "The workspace names what is in scope, what is out of scope, and which claims cannot be used in public copy."
  },
  {
    title: "Manual cost boundary is explicit",
    body:
      "The website does not call the OpenAI API. The research step uses the client's or operator's ChatGPT Deep Research access."
  },
  {
    title: "Acceptance gates exist",
    body:
      "The report must cover buyer logic, source table, rejected alternatives, proof asset, validation channel, and stop rule."
  }
];

const secondPassTriggers = [
  "No source table, dated sources, or separation between proof and market context.",
  "Selected route is stated without rejected alternatives and rejection reasons.",
  "Buyer problem, delivery capacity, or generic-AI substitution risk is vague.",
  "First proof asset, validation channel, or stop condition is missing.",
  "Research drifts into domain content that does not change the route decision."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "Client Route Workflow",
    description:
      "A client-observable workflow preview for AgentSiteOps route research and delivery.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page client-workflow-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero client-workflow-hero">
        <div>
          <p className="eyebrow">Client project workspace</p>
          <h1>See the route file forming before the final handoff.</h1>
          <p>
            This page previews the client-facing progress surface: what the client
            provides, what has passed, what is still being checked, when a second research
            pass is triggered, and what the final route file must contain.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/templates/route-research-prompt-pack/">
              <SearchCheck aria-hidden="true" size={17} />
              Open research workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              View sample route file
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <FileText aria-hidden="true" size={17} />
              Check delivery gate
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Current simulated project</strong>
          <p>
            Status: manual Deep Research is running. Intake and scope lock have passed.
            Coverage review, second-pass gap handling, and final synthesis are still
            pending.
          </p>
          <dl>
            <div>
              <dt>Visible progress</dt>
              <dd>63%</dd>
            </div>
            <div>
              <dt>Next gate</dt>
              <dd>Coverage gaps</dd>
            </div>
          </dl>
        </aside>
      </section>

      <ClientRouteWorkspace />

      <section className="gate-section">
        <div className="section-head">
          <h2>Client input checklist</h2>
          <p>
            AgentSiteOps can start with messy material, but it still needs a usable
            boundary before research begins.
          </p>
        </div>
        <div className="client-checklist-grid">
          {intakeChecklist.map((item) => (
            <article key={item}>
              <ClipboardList aria-hidden="true" size={18} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section client-workflow-split">
        <div>
          <h2>What has passed</h2>
          <div className="client-status-list">
            {passedItems.map((item) => (
              <article key={item.title}>
                <CheckCircle2 aria-hidden="true" size={18} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2>What triggers second research</h2>
          <div className="client-status-list is-warning">
            {secondPassTriggers.map((item) => (
              <article key={item}>
                <AlertTriangle aria-hidden="true" size={18} />
                <div>
                  <h3>Gap trigger</h3>
                  <p>{item}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gate-section split-section client-workflow-split">
        <div>
          <h2>Why the workspace replaces repeated explanation</h2>
          <p>
            Progress, coverage gaps, repair triggers, final file structure, and
            non-delivery boundaries now live in one client workspace module. This page
            can focus on intake details and manual research policy instead of repeating
            the same Route File list in several sections.
          </p>
        </div>
        <div>
          <h2>Manual Deep Research boundary</h2>
          <p>
            AgentSiteOps prepares prompts, checks coverage, generates a gap prompt when
            needed, and fuses accepted outputs. It does not hide API usage, create
            automatic research results, or treat broad market context as proof of demand.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ArrowRight aria-hidden="true" size={17} />
              Apply delivery gate
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/agentsiteops-route-run/">
              <ArrowRight aria-hidden="true" size={17} />
              Inspect self route run
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              <ArrowRight aria-hidden="true" size={17} />
              Inspect route basis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
