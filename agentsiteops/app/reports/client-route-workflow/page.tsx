import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
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

const inputReadiness = [
  {
    label: "Project facts",
    status: "Ready",
    detail: "Target buyer, current asset set, delivery capacity, and decision question are present."
  },
  {
    label: "Source boundary",
    status: "Ready",
    detail: "Usable public pages and private material limits are separated before research."
  },
  {
    label: "Risk boundary",
    status: "Ready",
    detail: "No guaranteed traffic, revenue, ranking, AI citation, or regulated advice claims are allowed."
  },
  {
    label: "Evidence quality",
    status: "Weak",
    detail: "Buyer proof, payment evidence, first-party search exports, and customer outcomes are still missing."
  }
];

const progressStages = [
  {
    label: "Intake",
    status: "Passed",
    percent: "15%",
    detail: "Project facts, source boundary, and blocked claims are recorded."
  },
  {
    label: "Scope lock",
    status: "Passed",
    percent: "28%",
    detail: "The first run is limited to one route decision, not a full content program."
  },
  {
    label: "Research brief",
    status: "Passed",
    percent: "42%",
    detail: "Copy-ready Deep Research prompts and acceptance gates are generated."
  },
  {
    label: "Research run",
    status: "Active",
    percent: "63%",
    detail: "The operator runs the prompt in ChatGPT Deep Research using the user's allowance."
  },
  {
    label: "Coverage gate",
    status: "Pending",
    percent: "78%",
    detail: "The returned report is checked locally for required route evidence."
  },
  {
    label: "Route file",
    status: "Pending",
    percent: "100%",
    detail: "Accepted research is fused into one selected route and rejection record."
  }
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

const coverageGaps = [
  {
    title: "Buyer proof",
    severity: "High",
    body: "The current project can name a likely buyer, but it still needs qualified replies or paid intake before confidence can rise."
  },
  {
    title: "Source table",
    severity: "Medium",
    body: "A report must separate dated sources, public context, first-party evidence, and unsupported assumptions."
  },
  {
    title: "Rejected alternatives",
    severity: "High",
    body: "The selected route is not accepted unless competing paths are preserved with evidence-based rejection reasons."
  },
  {
    title: "Stop condition",
    severity: "High",
    body: "The final file must state what evidence blocks build expansion, checkout, or content scaling."
  }
];

const secondPassQueue = [
  {
    prompt: "Find buyer evidence",
    owner: "Operator",
    result: "A focused second pass on reachable buyer pain, qualified reply signals, and proof still missing."
  },
  {
    prompt: "Audit rejected paths",
    owner: "Operator",
    result: "A shorter comparison of why automation agency, template pack, course, or SEO content routes are weaker."
  },
  {
    prompt: "Define validation rule",
    owner: "Site",
    result: "A route-level keep, repair, stop, or blocked rule tied to first proof asset and first channel."
  }
];

const routeFilePreview = [
  {
    field: "Selected route",
    value: "One recommended path with confidence level and evidence basis."
  },
  {
    field: "Rejected alternatives",
    value: "Plausible paths that failed evidence, delivery, risk, or buyer-value tests."
  },
  {
    field: "Evidence ledger",
    value: "Verified, pending, inferred, stale, blocked, and not-claimed items."
  },
  {
    field: "First proof asset",
    value: "The smallest page, tool, sample, checklist, or outreach artifact to test first."
  },
  {
    field: "Validation channel",
    value: "The first channel, signal threshold, review window, and non-proof signals."
  },
  {
    field: "Stop rule",
    value: "The condition that blocks build expansion, checkout, or content scaling."
  }
];

const nonDeliverables = [
  "A guaranteed traffic, ranking, AI citation, revenue, or customer outcome.",
  "A fully automated Deep Research platform or hidden OpenAI API workflow.",
  "A broad content plan without route selection, rejected paths, and stop conditions.",
  "A domain-specific research article that has not passed route usefulness checks."
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

      <section className="gate-section">
        <div className="section-head">
          <h2>Input readiness</h2>
          <p>
            The workspace starts by showing whether the client supplied enough material
            to create a research brief without inventing missing context.
          </p>
        </div>
        <div className="client-readiness-grid">
          {inputReadiness.map((item) => (
            <article className={item.status.toLowerCase()} key={item.label}>
              <span>{item.status}</span>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

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

      <section className="gate-section">
        <div className="section-head">
          <h2>Project progress</h2>
          <p>
            The progress state is observable. It separates passed setup work from active
            manual research and pending route-file acceptance.
          </p>
        </div>
        <div className="client-progress-board">
          {progressStages.map((stage) => (
            <article className={stage.status.toLowerCase()} key={stage.label}>
              <span>{stage.percent}</span>
              <h3>{stage.label}</h3>
              <strong>{stage.status}</strong>
              <p>{stage.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section client-workflow-split">
        <div>
          <h2>Coverage gaps</h2>
          <div className="client-gap-list">
            {coverageGaps.map((item) => (
              <article key={item.title}>
                <strong>{item.severity}</strong>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2>Second-pass research queue</h2>
          <div className="client-queue-list">
            {secondPassQueue.map((item) => (
              <article key={item.prompt}>
                <small>{item.owner}</small>
                <h3>{item.prompt}</h3>
                <p>{item.result}</p>
              </article>
            ))}
          </div>
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

      <section className="gate-section">
        <div className="section-head">
          <h2>Final route-file preview</h2>
          <p>
            The deliverable is one route file, not two unrelated research reports. The
            file must be specific enough to guide the next build or stop decision.
          </p>
        </div>
        <div className="route-file-preview">
          {routeFilePreview.map((item) => (
            <article key={item.field}>
              <ShieldCheck aria-hidden="true" size={18} />
              <h3>{item.field}</h3>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section client-workflow-split">
        <div>
          <h2>What is not a delivery</h2>
          <ul className="compact-list">
            {nonDeliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
