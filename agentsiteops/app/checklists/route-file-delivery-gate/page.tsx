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
import { siteUrl } from "@/lib/site";

const path = "/checklists/route-file-delivery-gate/";

export const metadata: Metadata = {
  title: "Route File Delivery Gate",
  description:
    "A final AgentSiteOps delivery checklist for deciding whether a route research run is ready to become a route file, needs repair, or must stay blocked.",
  alternates: { canonical: path },
  openGraph: {
    title: "Route File Delivery Gate",
    description:
      "Check selected route, rejected alternatives, evidence ledger, proof asset, validation channel, stop rule, and non-delivery boundaries before handoff.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const decisionStates = [
  {
    label: "Pass",
    title: "Deliver route file",
    body:
      "The file chooses one route, preserves alternatives, tags evidence, and names the first validation action and stop condition."
  },
  {
    label: "Repair",
    title: "Create gap prompt",
    body:
      "One or more sections are weak but repairable. The next action is a focused second-pass research prompt, not a polished handoff."
  },
  {
    label: "Blocked",
    title: "Keep in research",
    body:
      "The project lacks buyer evidence, source rights, delivery capacity, or a safe claim boundary. It stays out of production."
  },
  {
    label: "Not delivery",
    title: "Reject the handoff",
    body:
      "A broad report, generic plan, automatic-research claim, or unsupported promise does not become an AgentSiteOps deliverable."
  }
];

const deliveryChecks = [
  {
    title: "Selected route",
    pass:
      "The file names one route, the confidence level, the evidence basis, and the next build or stop action."
  },
  {
    title: "Rejected alternatives",
    pass:
      "At least three plausible routes remain visible with rejection reasons tied to evidence, delivery, risk, or buyer value."
  },
  {
    title: "Evidence ledger",
    pass:
      "Every meaningful claim is tagged as verified, pending, inferred, stale, blocked, or not claimed before it raises confidence."
  },
  {
    title: "First proof asset",
    pass:
      "The route names the smallest page, sample, checklist, demo, outreach asset, or workflow artifact that can test demand first."
  },
  {
    title: "Validation channel",
    pass:
      "The file names the first channel, signal threshold, review window, and weak signals that do not count as proof."
  },
  {
    title: "Stop rule",
    pass:
      "The output states when to stop, repair, block, or avoid expanding content, checkout, tools, or claims."
  }
];

const contentCompletionChecks = [
  {
    title: "Client input boundary",
    body:
      "Project facts, source boundary, risk boundary, delivery capacity, and blocked claims are visible before research is accepted."
  },
  {
    title: "Research-channel boundary",
    body:
      "The page says the website does not create hidden research results and that the research carrier remains visible and replaceable."
  },
  {
    title: "Coverage gaps",
    body:
      "Missing buyer proof, source tables, rejected routes, proof assets, validation channel, or stop rule become repair tasks."
  },
  {
    title: "No unsupported claims",
    body:
      "Traffic, ranking, AI citation, payment approval, customer response, and revenue remain unclaimed until first-party evidence exists."
  },
  {
    title: "Next action is narrow",
    body:
      "The handoff ends with build, repair, block, or stop. It does not create a large content batch or hidden automation promise."
  }
];

const secondPassRepairQueue = [
  {
    gap: "Buyer proof is inferred",
    prompt:
      "Find reachable buyer pain, qualified-reply signals, paid-intake evidence, and objections that could change the route."
  },
  {
    gap: "Rejected alternatives are missing",
    prompt:
      "Compare the selected route against agency, template, course, tool, and content-site alternatives with rejection evidence."
  },
  {
    gap: "Evidence ledger is loose",
    prompt:
      "Separate verified facts, dated sources, first-party proof, public context, assumptions, stale evidence, and unsupported claims."
  },
  {
    gap: "Validation rule is vague",
    prompt:
      "Define the first proof asset, first channel, counted signal, ignored signal, review window, and stop condition."
  }
];

const nonDeliveryExamples = [
  "A long research memo that does not choose one route.",
  "A content plan without rejected alternatives, evidence tags, proof asset, validation channel, and stop rule.",
  "A promise of traffic, ranking, AI citation, customers, payment approval, revenue, or product-market fit.",
  "A claim that the website automatically runs hidden research or produces an opaque model/API result.",
  "A domain research article that has not passed route usefulness, rights, risk, and source-quality checks."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Route File Delivery Gate",
    description:
      "A final checklist for judging whether an AgentSiteOps route research run is ready for route-file delivery.",
    url: `${siteUrl}${path}`,
    inLanguage: "en",
    step: deliveryChecks.map((item, index) => ({
      "@type": "HowToStep",
      name: item.title,
      position: index + 1,
      text: item.pass
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
          <p className="eyebrow">Delivery checklist</p>
          <h1>Route file delivery gate before the final handoff.</h1>
          <p>
            This page is the content completion plan for AgentSiteOps. It decides whether
            a research run becomes a client route file, turns into a second-pass repair
            prompt, stays blocked, or is rejected as not a delivery.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Compare sample route file
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <ClipboardList aria-hidden="true" size={17} />
              Inspect client workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <SearchCheck aria-hidden="true" size={17} />
              Open research workflow
            </Link>
          </div>
        </div>
        <aside className="decision-card delivery-gate-card">
          <strong>Gate result</strong>
          <p>
            A route file is complete only when it can show selected route, rejected
            alternatives, evidence ledger, first proof asset, validation channel, and stop
            rule without unsupported claims.
          </p>
          <dl>
            <div>
              <dt>Primary output</dt>
              <dd>Pass, repair, blocked, or not delivery.</dd>
            </div>
            <div>
              <dt>Current use</dt>
              <dd>Final check after approved research-channel output and coverage review.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Delivery decision states</h2>
          <p>
            The gate produces an operating decision. It does not turn weak research into
            confident client copy.
          </p>
        </div>
        <div className="delivery-state-grid">
          {decisionStates.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Route file contract</h2>
          <p>
            These six checks define whether the final route file is ready for client use.
            If one is missing, the output is repair or blocked, not delivery.
          </p>
        </div>
        <div className="delivery-contract-grid">
          {deliveryChecks.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <FileCheck2 aria-hidden="true" size={20} />
              <h3>{item.title}</h3>
              <p>{item.pass}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section delivery-gate-split">
        <div>
          <h2>Content completion checks</h2>
          <div className="delivery-check-list">
            {contentCompletionChecks.map((item) => (
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
          <h2>Second-pass repair queue</h2>
          <div className="delivery-repair-list">
            {secondPassRepairQueue.map((item) => (
              <article key={item.gap}>
                <AlertTriangle aria-hidden="true" size={18} />
                <div>
                  <h3>{item.gap}</h3>
                  <p>{item.prompt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gate-section split-section delivery-gate-split">
        <div>
          <h2>Not delivery</h2>
          <ul className="compact-list">
            {nonDeliveryExamples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Where to apply this gate</h2>
          <p>
            Use this checklist after the client workflow reaches coverage review and
            before a sample or paid handoff is treated as complete. It is also the page
            that keeps the research workflow honest: brief generation, report checking,
            gap repair, and synthesis are visible; hidden automation is not claimed.
          </p>
          <div className="delivery-linked-actions">
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <ArrowRight aria-hidden="true" size={17} />
              Client progress page
            </Link>
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <ArrowRight aria-hidden="true" size={17} />
              Prompt pack
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              <ShieldCheck aria-hidden="true" size={17} />
              Route basis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
