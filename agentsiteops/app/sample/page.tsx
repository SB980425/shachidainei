import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, FileText, ShieldCheck } from "lucide-react";
import { ClientRouteStatePanel } from "@/components/ClientRouteStatePanel";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteFileAcceptancePanel } from "@/components/RouteFileAcceptancePanel";
import { RouteFileViewer } from "@/components/RouteFileViewer";
import { RouteProjectLifecycle } from "@/components/RouteProjectLifecycle";
import { RouteStageHeader } from "@/components/RouteStageHeader";
import { siteUrl } from "@/lib/site";

const path = "/sample/";

export const metadata: Metadata = {
  title: "Sample Route File",
  description:
    "A sample AgentSiteOps route file showing selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, stop rule, and unproven claims.",
  alternates: { canonical: path },
  openGraph: {
    title: "Sample Route File",
    description:
      "Preview the route-file structure before using the AgentSiteOps research workflow.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const inputSnapshot = [
  {
    label: "Project",
    value: "AI-capable solo builder with several possible services and no clear first buyer."
  },
  {
    label: "Available proof",
    value: "Two private demos, one public workflow screenshot, and no confirmed payment yet."
  },
  {
    label: "Constraint",
    value: "Seven-day validation window, no paid ads, no regulated advice, no private account takeover."
  },
  {
    label: "Decision needed",
    value: "Choose one route to test first, or stop before building more pages."
  }
];

const proofCases = [
  {
    title: "Messy project to Route File",
    href: "/examples/route-file-from-messy-project/",
    body:
      "A full walkthrough showing how a vague request is repaired before it becomes a selected route, evidence ledger, proof asset, validation channel, and stop rule."
  },
  {
    title: "AI service route file",
    href: "/examples/ai-service-route-file/",
    body:
      "A complete proof case showing messy AI-service input, selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule."
  },
  {
    title: "Blocked intake",
    href: "/examples/blocked-intake/",
    body:
      "A non-delivery case showing why weak inputs, missing source rights, and unsupported promises should return repair or blocked instead of a polished route file."
  }
];

const sampleHandoffPath = [
  {
    label: "1. Intake accepted",
    state: "Visible to client",
    body:
      "The project has a decision question, usable source material, delivery limits, and a first validation window."
  },
  {
    label: "2. Research carrier approved",
    state: "Not tool-locked",
    body:
      "Research can come from manual source review, a client report, an operator-controlled research pass, or another approved evidence carrier."
  },
  {
    label: "3. Coverage checked",
    state: "Repair before synthesis",
    body:
      "Weak coverage triggers a missing-input request or second-pass research brief instead of a confident-looking Route File."
  },
  {
    label: "4. Route File sent",
    state: "Final handoff",
    body:
      "Only accepted material becomes the selected route, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule."
  }
];

const selectedRoute = [
  {
    label: "Selected route",
    value:
      "Pilot a narrow AI intake and follow-up workflow setup for solo consultants before building a broader agency, course, or tool."
  },
  {
    label: "Confidence",
    value:
      "Medium for delivery feasibility; low for paid demand until qualified replies or payment plus usable intake exists."
  },
  {
    label: "Reason",
    value:
      "The route uses existing build ability, can be explained in one page, and can produce a first proof asset without search traffic."
  }
];

const rejectedAlternatives = [
  {
    route: "Broad AI automation agency",
    reason:
      "Rejected because it requires general trust, multiple service lines, and stronger proof than the current asset set supports."
  },
  {
    route: "Prompt pack",
    reason:
      "Rejected because generic prompt output is easy to replace with ordinary ChatGPT use and does not prove delivery value."
  },
  {
    route: "SEO content site",
    reason:
      "Rejected because search-first validation is too slow for the current seven-day decision window."
  },
  {
    route: "AI visibility dashboard",
    reason:
      "Rejected because monitoring software needs data scale, recurring demand, and technical scope not proven by the intake."
  }
];

const evidenceLedger = [
  {
    claim: "The builder can deliver a simple workflow setup.",
    status: "Verified",
    source: "Existing demos and workflow screenshot.",
    next: "Turn one demo into a public walkthrough."
  },
  {
    claim: "Solo consultants feel repeated intake and follow-up pain.",
    status: "Inferred",
    source: "Public context and operator observation.",
    next: "Collect qualified replies from targeted outreach."
  },
  {
    claim: "Buyers will pay for this service.",
    status: "Pending",
    source: "No payment plus usable intake yet.",
    next: "Offer a small pilot and record payment or rejection."
  },
  {
    claim: "Search demand can support expansion.",
    status: "Not proven",
    source: "No GSC, Bing, or first-party search export.",
    next: "Do not scale content on search assumptions."
  }
];

const proofAsset = [
  "A one-page service route explaining the intake problem, 72-hour setup scope, included handoff, exclusions, and first CTA.",
  "One anonymized before/after workflow screenshot or walkthrough.",
  "A short outreach message that asks for a workflow review, not a broad AI transformation sale."
];

const validationChannel = [
  {
    label: "First channel",
    value: "Manual outreach to a small set of solo consultants with visible service offers."
  },
  {
    label: "Signal that counts",
    value: "Qualified reply, payment plus usable intake, or repeated objection that identifies a repair path."
  },
  {
    label: "Signal that does not count",
    value: "Page views, sitemap submission, AI-generated praise, or broad market context without buyer action."
  }
];

const stopRules = [
  "Stop this route if 30 targeted messages produce no qualified reply.",
  "Stop paid positioning if buyers ask for implementation outside the stated delivery capacity.",
  "Stop content expansion if the only evidence is search context without first-party signals.",
  "Block the route if it drifts into regulated advice, private account access, spam automation, or guaranteed outcomes."
];

const notProven = [
  "Traffic, ranking, AI citation, revenue, customer response, or product-market fit.",
  "That the selected buyer segment is the highest-value market.",
  "That the route should become software, subscription, course, or broad agency work.",
  "That public market research is enough to justify checkout or content scaling."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Sample AgentSiteOps Route File",
    description:
      "An example route file showing selected path, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page sample-route-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero sample-route-hero">
        <div>
          <p className="eyebrow">Sample route file</p>
          <h1>What the final AgentSiteOps handoff should contain.</h1>
          <p>
            This sample is a fictional route file. It shows the structure a client should
            expect after intake, approved research-channel output, coverage checking, gap
            repair, and final synthesis.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <ClipboardList aria-hidden="true" size={17} />
              Start your plan
            </Link>
            <Link prefetch={false} className="secondary-action" href="/examples/ai-service-route-file/">
              <FileText aria-hidden="true" size={17} />
              View AI service case
            </Link>
            <Link prefetch={false} className="secondary-action" href="/examples/blocked-intake/">
              <ShieldCheck aria-hidden="true" size={17} />
              View blocked intake
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Sample status</strong>
          <p>
            Format example only. It proves the artifact structure, not traffic, payment,
            demand, ranking, AI citation, or customer outcomes.
          </p>
        </aside>
      </section>

      <section className="gate-section sample-proof-section">
        <div className="section-head">
          <h2>Proof cases to inspect before trusting the workflow</h2>
          <p>
            A route workflow is credible only when visitors can inspect both a completed
            route file and a blocked request that should not be delivered.
          </p>
        </div>
        <div className="sample-proof-grid">
          {proofCases.map((item) => (
            <Link prefetch={false} href={item.href} key={item.href}>
              <FileText aria-hidden="true" size={20} />
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="gate-section sample-handoff-section">
        <div className="section-head">
          <h2>How this sample becomes a real handoff</h2>
          <p>
            The sample is not tied to one research product. It represents the output after
            a client request is accepted, researched through an approved carrier, checked
            for coverage, and synthesized by an operator.
          </p>
        </div>
        <div className="sample-handoff-grid">
          {sampleHandoffPath.map((item) => (
            <article key={item.label}>
              <span>{item.state}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <RouteStageHeader
        current="route-file"
        title="Route File is the output, not the end of the decision."
        body="The handoff must show selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule."
      />

      <RouteFlowBridge current="route-file" nextHref="/guides/48-hour-exposure-sprint/" nextLabel="Run validation" />

      <RouteProjectLifecycle
        current="route-file"
        eyebrow="Output state"
        title="The sample is one state in the Route Project lifecycle."
        body="A Route File is complete only when it can name the first proof asset, validation channel, ignored weak signals, and stop rule."
      />

      <ClientRouteStatePanel
        current="route-file"
        title="The final handoff still points to a validation action."
        body="The client receives one route decision, but the system stays honest about confidence, missing proof, ignored signals, and when to stop."
        compact
      />

      <RouteFileViewer
        inputSnapshot={inputSnapshot}
        selectedRoute={selectedRoute}
        rejectedAlternatives={rejectedAlternatives}
        evidenceLedger={evidenceLedger}
        proofAsset={proofAsset}
        validationChannel={validationChannel}
        stopRules={stopRules}
        notProven={notProven}
      />

      <RouteFileAcceptancePanel />

      <section className="gate-section split-section gate-split">
        <div>
          <h2>How to use this sample</h2>
          <p>
            Compare any delivered AgentSiteOps route file against this structure. If the
            file does not choose one route, reject alternatives, tag evidence, define the
            first proof asset, name a validation channel, and state a stop rule, it is not
            complete.
          </p>
        </div>
        <div>
          <h2>Next step</h2>
          <p>
            Start with the client workflow if the project is messy, or use the prompt pack
            when the intake boundary is already clear enough for an approved research
            channel.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/reports/client-route-workflow/">
              <FileText aria-hidden="true" size={17} />
              Client workflow
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ShieldCheck aria-hidden="true" size={17} />
              Delivery gate
            </Link>
            <Link prefetch={false} className="secondary-action" href="/review-status/">
              <ClipboardList aria-hidden="true" size={17} />
              Review status
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
