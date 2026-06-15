import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, SearchCheck, ShieldCheck } from "lucide-react";
import { CustomerResponseLifecycle } from "@/components/CustomerResponseLifecycle";
import { ManualDeepResearchWorkspace } from "@/components/ManualDeepResearchWorkspace";
import { ResearchDeliveryLoop } from "@/components/ResearchDeliveryLoop";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteStageHeader } from "@/components/RouteStageHeader";
import {
  manualDeepResearchSteps,
  researchAcceptanceGates,
  routeResearchPrompts,
  routeResearchProtocol
} from "@/lib/routeResearchPromptPack";
import { siteUrl } from "@/lib/site";

const path = "/templates/route-research-prompt-pack/";

export const metadata: Metadata = {
  title: "Route Research Prompt Pack",
  description:
    "A carrier-neutral research brief workflow for turning project facts into evidence-backed route maps, proof assets, validation channels, and stop rules.",
  alternates: { canonical: path },
  openGraph: {
    title: "Route Research Prompt Pack",
    description:
      "A reusable prompt system for researching project routes before building pages, tools, checkout, or content clusters.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const outputContract = [
  {
    title: "Decision matrix",
    body:
      "The final route file must show how buyer problem, proof asset, delivery capacity, data rights, monetization, search evidence, AI visibility, implementation need, and generic-AI substitution changed the route."
  },
  {
    title: "Source table",
    body:
      "Every research run must list sources, dates, evidence type, and whether the source proves demand or only gives context."
  },
  {
    title: "Evidence ledger",
    body:
      "Each claim must be marked verified, pending, inferred, stale, blocked, or not claimed before it can affect route confidence."
  },
  {
    title: "Rejected paths",
    body:
      "The output must preserve alternatives that were rejected and explain why they failed the evidence, delivery, or risk test."
  },
  {
    title: "Action rule",
    body:
      "Research is not complete until it produces one first asset, one validation channel, and one stop or scale condition."
  }
];

const manualModeBoundaries = [
  {
    title: "No hidden research run",
    body:
      "The website does not silently turn the project brief into a model result or an automatic research answer."
  },
  {
    title: "Use an approved research carrier",
    body:
      "The operator copies the generated brief into the selected research channel, manual source-review path, or client-provided report workflow."
  },
  {
    title: "Local coverage check",
    body:
      "After the report returns, AgentSiteOps checks required sections locally and marks missing evidence as a gap instead of hiding it."
  },
  {
    title: "Fusion, not automation theater",
    body:
      "Accepted first-pass and second-pass results are fused into one route file with rejected alternatives and a stop rule."
  }
];

const clientObservationStages = [
  {
    title: "Scope lock",
    body:
      "The site first records which project is being routed and which material is out of scope for this pass. A client should see the boundary before any research result is accepted."
  },
  {
    title: "Research brief",
    body:
      "The route brief turns the project into copy-ready research instructions, acceptance gates, and rejection rules. This is where missing questions become visible."
  },
  {
    title: "External research pass",
    body:
      "The operator runs the brief through an approved research surface, manual source review, or client-provided report path. AgentSiteOps does not pretend this step is automatic when it is manual."
  },
  {
    title: "Coverage review",
    body:
      "The report is checked against required modules. Missing evidence, weak source use, vague buyer logic, or skipped alternatives trigger a focused second pass."
  },
  {
    title: "Route file",
    body:
      "Only the fused route file becomes the deliverable: selected route, rejected routes, evidence ledger, first asset, validation channel, stop rule, and next action."
  }
];

const laneBoundaries = [
  {
    title: "This website lane",
    body:
      "AgentSiteOps maintains the route method, prompt pack, acceptance gates, public samples, evidence ledger, and client-facing progress surface."
  },
  {
    title: "Domain research lane",
    body:
      "A separate project thread or workspace runs the domain-specific research, such as a classical-text sample, using the prompt pack and returning a report for review."
  },
  {
    title: "No mixed execution",
    body:
      "The website does not silently absorb every domain note into public copy. A research run must pass scope, rights, risk, and usefulness checks before it becomes a sample."
  }
];

const clientInputs = [
  {
    title: "Project facts",
    body:
      "What the project is, who it serves, what can already be built, what files or examples exist, and what decision is blocking progress."
  },
  {
    title: "Source boundary",
    body:
      "Which files, public pages, search data, competitor references, or research notes can be used, and which material must stay private or out of scope."
  },
  {
    title: "Risk boundary",
    body:
      "Claims that cannot be made, regulated advice to avoid, copyright limits, payment constraints, delivery capacity, and the budget or time boundary."
  }
];

const clientDeliverables = [
  {
    title: "Route decision",
    body:
      "Proceed, pilot, pivot, stop, or blocked, with the reason tied to evidence instead of preference."
  },
  {
    title: "Rejected alternatives",
    body:
      "At least three plausible paths preserved with concrete reasons they failed evidence, delivery, risk, or buyer-value tests."
  },
  {
    title: "First proof asset",
    body:
      "The smallest page, tool, sample, checklist, report, or outreach asset that can test whether the route deserves more work."
  },
  {
    title: "Validation window",
    body:
      "The first channel to test, the signal that counts, the signal that does not count, and the stop or scale condition."
  }
];

const clientFailureRules = [
  {
    title: "Missing coverage",
    body:
      "If the report skips buyer proof, source table, pricing logic, rejected alternatives, or stop rule, the site creates a second-pass gap prompt."
  },
  {
    title: "Unsupported claim",
    body:
      "If a claim is only inferred or copied from broad market context, it cannot raise route confidence until a better source or first-party signal exists."
  },
  {
    title: "Wrong project boundary",
    body:
      "If the research drifts into unrelated domain content, it returns to scope lock instead of being fused into the route file."
  }
];

const clientOperatingQuestions = [
  {
    title: "What is automatic",
    body:
      "The browser can organize the brief, expose missing fields, show the stage, and run local coverage checks. It does not create a hidden research answer or contact a research provider by itself."
  },
  {
    title: "Who responds after submission",
    body:
      "An operator reviews the intake, accepts it, asks for repair, blocks it, or prepares the research handoff. The page shows the expected state instead of pretending every request is instantly fulfilled."
  },
  {
    title: "Research carrier can change",
    body:
      "The evidence carrier can be manual source review, a client-provided report, an operator-controlled AI research pass, interviews, exported search data, or another approved path."
  },
  {
    title: "What the client sees",
    body:
      "The client should see accepted input, current stage, missing evidence, repair trigger, selected route, rejected alternatives, proof asset, validation channel, and stop rule."
  }
];

function PromptCard({ prompt }: { prompt: (typeof routeResearchPrompts)[number] }) {
  return (
    <article className="prompt-card">
      <div className="prompt-card-head">
        <span>{prompt.id}</span>
        <h3>{prompt.title}</h3>
        <p>{prompt.objective}</p>
      </div>
      <div className="prompt-meta-grid">
        <div>
          <strong>Use when</strong>
          <p>{prompt.useWhen}</p>
        </div>
        <div>
          <strong>Required output</strong>
          <ul>
            {prompt.requiredOutput.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="prompt-copy-block">
        <strong>Copy-ready research prompt</strong>
        <pre>{prompt.prompt}</pre>
      </div>
      <div className="prompt-reject-block">
        <strong>Reject the result if it does this</strong>
        <ul>
          {prompt.rejectionRules.map((item) => (
            <li key={item}>
              <ShieldCheck aria-hidden="true" size={15} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Route Research Prompt Pack",
    description:
      "A prompt pack for deep research on project route selection, evidence weighting, proof assets, pricing fit, and validation channels.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page route-research-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero route-research-hero">
        <div>
          <p className="eyebrow">Route research template</p>
          <h1>Run research through an approved channel, then let AgentSiteOps judge the route.</h1>
          <p>
            AgentSiteOps prepares the research brief, the operator runs it through an
            approved research channel or manual source-review path, then the result is
            checked, repaired if needed, and fused into one route map.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/methodology/route-selection/">
              <SearchCheck aria-hidden="true" size={17} />
              Inspect route method
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              <FileText aria-hidden="true" size={17} />
              View route basis
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ShieldCheck aria-hidden="true" size={17} />
              Check delivery gate
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Free mode boundary</strong>
          <p>
            The site does not create a hidden research result. A second pass is only used
            when the first report misses required sections, and the final standard remains
            the Route File contract.
          </p>
        </aside>
      </section>

      <RouteStageHeader
        current="research"
        title="Research runs through an approved evidence carrier."
        body="The carrier can be manual source review, client report, operator-controlled AI research, or another approved path; the coverage standard does not change."
      />

      <section className="gate-section">
        <div className="section-head">
          <h2>Client view before research starts</h2>
          <p>
            The page should answer the practical browsing question: after a project is
            submitted, which parts happen in the website, which parts require operator
            review, and which research carrier is allowed to produce evidence.
          </p>
        </div>
        <div className="contract-grid">
          {clientOperatingQuestions.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <RouteFlowBridge current="research" nextHref="/delivery-gate/" nextLabel="Continue to gate" />

      <CustomerResponseLifecycle />

      <section className="gate-section route-research-receipt-section">
        <div className="section-head">
          <h2>Research-channel operating receipt</h2>
          <p>
            This is the condensed execution contract for the page. It separates what the
            website does, what happens in the selected research channel, what the client can see,
            and when the work turns into one Route File.
          </p>
        </div>
        <div className="route-research-receipt">
          <div className="research-receipt-boundaries" aria-label="Research-channel boundaries">
            {manualModeBoundaries.map((item) => (
              <article key={item.title}>
                <ShieldCheck aria-hidden="true" size={17} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="research-receipt-timeline" aria-label="Client visible research stages">
            {clientObservationStages.map((stage, index) => (
              <article key={stage.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Work lanes stay separate</h2>
          <p>
            The site is the route operating system. A domain study is a separate run that
            can feed the site only after it passes evidence, rights, and risk gates.
          </p>
        </div>
        <div className="contract-grid">
          {laneBoundaries.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>What the client must provide</h2>
          <p>
            The route quality depends on the input boundary. A client does not need a
            finished plan, but the project facts, usable sources, and blocked claims must
            be visible before the research brief is generated.
          </p>
        </div>
        <div className="contract-grid">
          {clientInputs.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>What the client receives</h2>
          <p>
            The final output is a route decision package. It must reduce the next action
            to one buildable path and keep the unchosen paths inspectable.
          </p>
        </div>
        <div className="contract-grid">
          {clientDeliverables.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>What happens when the research is weak</h2>
          <p>
            A weak report is not polished into a confident answer. It is either repaired
            with a focused second pass, downgraded to pending, or blocked.
          </p>
        </div>
        <div className="contract-grid">
          {clientFailureRules.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Carrier-neutral research plan</h2>
          <p>
            This is the current operating path. AgentSiteOps prepares the brief, the
            approved carrier supplies the cited report or review notes, and the site checks
            the result before synthesis.
          </p>
        </div>
        <div className="manual-research-grid">
          {manualDeepResearchSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <dl>
                <div>
                  <dt>Owner</dt>
                  <dd>{step.owner}</dd>
                </div>
                <div>
                  <dt>Cost boundary</dt>
                  <dd>{step.costBoundary}</dd>
                </div>
              </dl>
              <p>{step.instruction}</p>
              <strong>{step.output}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <ManualDeepResearchWorkspace />
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Research delivery loop</h2>
          <p>
            The visible workflow is the delivery standard: approved research pass,
            coverage gate, focused second pass when required, then one fused route file.
          </p>
        </div>
        <ResearchDeliveryLoop />
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Research protocol</h2>
          <p>
            These rules keep long-form research useful. The result must become route
            logic, not a long report that cannot change the product.
          </p>
        </div>
        <div className="loop-grid">
          {routeResearchProtocol.map((rule, index) => (
            <article key={rule}>
              <span>{index + 1}</span>
              <ClipboardList aria-hidden="true" size={18} />
              <h3>{rule}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Acceptance gate before delivery</h2>
          <p>
            If the first report misses core prompt requirements, the missing parts are
            converted into a focused gap brief for a second approved research pass
            before final synthesis.
          </p>
        </div>
        <div className="acceptance-gate-grid">
          {researchAcceptanceGates.map((gate) => (
            <article key={gate.title}>
              <SearchCheck aria-hidden="true" size={20} />
              <h3>{gate.title}</h3>
              <strong>Pass standard</strong>
              <p>{gate.passStandard}</p>
              <strong>Fail action</strong>
              <p>{gate.failAction}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Required output contract</h2>
          <p>
            Every research module must produce the same audit shape. This is how the
            route map becomes reusable for our own future projects before it is sold to
            anyone else.
          </p>
        </div>
        <div className="contract-grid">
          {outputContract.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Research modules</h2>
          <p>
            Run these modules in order when a new project is unclear. Stop early when a
            module returns a hard blocker that cannot be repaired.
          </p>
        </div>
        <div className="prompt-pack-grid">
          {routeResearchPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>How this improves AgentSiteOps itself</h2>
          <p>
            The prompt pack gives the site a repeatable research layer. Future projects
            can be tested with the same route archetype comparison, evidence weighting,
            proof asset design, pricing fit, and validation-channel rules before any new
            page or product is built.
          </p>
        </div>
        <div>
          <h2>Next implementation step</h2>
          <p>
            Each completed research run should be converted into one row in the route
            pattern library, one evidence-ledger entry, and one first-asset backlog item.
            If it cannot produce those three artifacts, it stays as research only.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/templates/evidence-ledger-template/">
              <ArrowRight aria-hidden="true" size={17} />
              Evidence ledger template
            </Link>
            <Link prefetch={false} className="secondary-action" href="/templates/website-opportunity-scoring-template/">
              <ArrowRight aria-hidden="true" size={17} />
              Scoring template
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/agentsiteops-route-run/">
              <ArrowRight aria-hidden="true" size={17} />
              Self route run
            </Link>
            <Link prefetch={false} className="secondary-action" href="/delivery-gate/">
              <ArrowRight aria-hidden="true" size={17} />
              Delivery gate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
