import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Gauge, SearchCheck, ShieldCheck } from "lucide-react";
import { HomeIdeaStart } from "@/components/HomeIdeaStart";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Idea Risk Test to Route File",
  description:
    "AgentSiteOps starts with one rough project idea, maps likely failure nodes and evidence gaps, then turns usable inputs into a checked Route File path."
};

const routeFileContract = [
  "Selected route",
  "Rejected alternatives",
  "Evidence ledger",
  "First proof asset",
  "Validation channel",
  "Stop rule"
];

const whyFillCards = [
  {
    title: "Evidence used, not guessed",
    body:
      "The first input can be messy. The site extracts useful signals and shows what is missing instead of forcing the visitor through many fields."
  },
  {
    title: "What the buyer receives is a route file, not a score",
    body:
      "The output is not a decorative confidence score. It must preserve the route, rejected alternatives, evidence status, proof asset, validation channel, and stop rule."
  },
  {
    title: "Market signals are context, not proof",
    body:
      "Search demand, public examples, trend reports, and market research can shape questions, but they do not prove buyer response, payment, or product-market fit."
  }
];

const pathSteps = [
  {
    label: "1. Idea",
    body: "Paste one rough project description."
  },
  {
    label: "2. Risk map",
    body: "See likely failure nodes, evidence gaps, and source basis."
  },
  {
    label: "3. Plan",
    body: "Convert the risk map into a narrow project route."
  },
  {
    label: "4. Review",
    body: "Decide ready, repair, blocked, or not-delivery before execution."
  },
  {
    label: "5. Route File",
    body: "Inspect one selected route with rejected alternatives and a stop rule."
  }
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgentSiteOps Research-to-Route File",
    description:
      "An operator-reviewed route-selection workflow that turns messy project material into one Route File with rejected alternatives, evidence ledger, validation channel, and stop rule.",
    inLanguage: "en",
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: "AgentSiteOps"
    },
    serviceOutput: "Checked Route File"
  };

  return (
    <main className="page-main route-home frontstage-home ia-reset-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="ia-hero">
        <div className="ia-hero-copy">
          <p className="eyebrow">Free idea risk test</p>
          <h1>Write the idea first. The site should prove why the next step is worth doing.</h1>
          <p>
            AgentSiteOps is not a page directory and not a hidden research promise. The useful
            first action is one input: describe the project, then receive a risk map, evidence
            gaps, time checkpoints, and the next route decision.
          </p>
          <ul className="ia-hero-points">
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              One clear input instead of scattered forms.
            </li>
            <li>
              <SearchCheck aria-hidden="true" size={16} />
              Failure nodes are mapped against a visible source basis.
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={16} />
              No traffic, revenue, payment, or automatic research guarantee.
            </li>
          </ul>
        </div>
        <HomeIdeaStart />
      </section>

      <section className="route-foundation-section ia-section">
        <div className="route-section-heading">
          <span>Why fill it in</span>
          <h2>The page must make the input feel useful before asking for effort.</h2>
          <p>
            The test is designed for unclear early projects. It turns scattered project text into
            a decision surface: what may fail, what evidence is missing, and what should happen
            within a defined time window.
          </p>
        </div>
        <div className="ia-card-grid">
          {whyFillCards.map((item) => (
            <article key={item.title}>
              <Gauge aria-hidden="true" size={19} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section ia-source-section">
        <div className="route-section-heading">
          <span>Reference basis</span>
          <h2>The advice is a reference map, not a guess.</h2>
          <p>
            The failure-node library is grounded in public startup failure patterns, validated
            learning, user discovery, premature scaling research, and customer development
            methods. These sources guide questions; they do not prove one project will succeed.
          </p>
        </div>
        <div className="ia-source-grid">
          {ideaRiskSources.map((source) => (
            <article key={source.id}>
              <span>{source.publisher}</span>
              <h3>{source.name}</h3>
              <p>{source.useFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="route-foundation-section ia-section">
        <div className="route-section-heading">
          <span>Main path</span>
          <h2>There is one working path. Other pages are reference material.</h2>
          <p>
            The public site should behave like a guided product, not a menu. A new visitor should
            understand that the next action is always the same: start with the idea input.
          </p>
        </div>
        <ol className="ia-path-list">
          {pathSteps.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="route-foundation-section ia-section ia-output-section">
        <div>
          <span>Output contract</span>
          <h2>The final thing is a Route File, not a loose suggestion.</h2>
          <p>
            A valid output must preserve the selected path, rejected options, source status,
            first proof asset, validation channel, and stop rule. Anything weaker stays in test
            or repair state.
          </p>
        </div>
        <div className="ia-contract-card">
          <FileText aria-hidden="true" size={24} />
          <h3>Route File must include</h3>
          <ul>
            {routeFileContract.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={15} />
                {item}
              </li>
            ))}
          </ul>
          <Link prefetch={false} className="secondary-action" href="/sample/">
            Inspect sample output
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
          <Link prefetch={false} className="secondary-action" href="/launch-kit/">
            Launch Kit reference
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="route-final-cta ia-final-cta">
        <div>
          <span>Default next action</span>
          <h2>Start with one idea. Do not browse the method pages first.</h2>
          <p>
            If the project cannot name buyer, proof, channel, source boundary, and review date,
            the correct state is still test or repair.
          </p>
        </div>
        <Link prefetch={false} className="primary-action" href="/idea-risk-test/#idea-risk-test">
          <Gauge aria-hidden="true" size={17} />
          Start free test
        </Link>
      </section>
    </main>
  );
}
