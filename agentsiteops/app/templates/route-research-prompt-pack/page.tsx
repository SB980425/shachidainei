import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, SearchCheck, ShieldCheck } from "lucide-react";
import { routeResearchPrompts, routeResearchProtocol } from "@/lib/routeResearchPromptPack";
import { siteUrl } from "@/lib/site";

const path = "/templates/route-research-prompt-pack/";

export const metadata: Metadata = {
  title: "Route Research Prompt Pack",
  description:
    "Copy-ready deep research prompts for turning project facts into evidence-backed route maps, proof assets, validation channels, and stop rules.",
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
          <h1>Use long-form research to make the route map less random.</h1>
          <p>
            AgentSiteOps should not rely on a score alone. This prompt pack turns each
            route decision into a bounded research task with sources, rejected paths,
            proof assets, confidence rules, and stop conditions.
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
            <Link prefetch={false} className="secondary-action" href="/tools/route-confidence-checker/">
              <ArrowRight aria-hidden="true" size={17} />
              Run route checker
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Current use</strong>
          <p>
            Use one module at a time. A single broad research prompt is weaker than a
            sequence that separately tests buyer problem, proof asset, data rights,
            pricing, validation channel, and delivery blueprint.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Research protocol</h2>
          <p>
            These rules keep GPT research useful. The result must become route logic, not
            a long report that cannot change the product.
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
          <h2>Deep research modules</h2>
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
          </div>
        </div>
      </section>
    </main>
  );
}
