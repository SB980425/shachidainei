import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { IdeaRiskTestStudio } from "@/components/IdeaRiskTestStudio";
import { ClientRouteStatePanel } from "@/components/ClientRouteStatePanel";
import { RouteFlowBridge } from "@/components/RouteFlowBridge";
import { RouteProjectLifecycle } from "@/components/RouteProjectLifecycle";
import { RouteStageHeader } from "@/components/RouteStageHeader";
import { ideaRiskSources } from "@/lib/ideaRiskEngine";
import { siteUrl } from "@/lib/site";

const path = "/idea-risk-test/";

export const metadata: Metadata = {
  title: "Free Idea Risk Test",
  description:
    "A free AgentSiteOps project idea test that maps likely failure nodes, evidence gaps, source basis, time checkpoints, and next planning actions before Route File review.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free Idea Risk Test",
    description:
      "Fill in a rough project idea and receive a source-backed failure-node map, evidence gaps, time checkpoints, and next planning actions.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const flowRows = [
  {
    label: "Fill",
    body:
      "The visitor enters rough project idea, buyer, first offer, assets, channel, resources, constraints, and validation plan."
  },
  {
    label: "Match",
    body:
      "The page checks the input against a local source-backed failure node library. It does not claim live web research."
  },
  {
    label: "Map",
    body:
      "The output shows failure nodes, why they were triggered, evidence needed, reference basis, and time checkpoints."
  },
  {
    label: "Route",
    body:
      "The visitor moves to Plan Studio, Review Status, Scope Lock, or stops before creating a false Route File."
  }
];

const notClaims = [
  "It is not a success forecast.",
  "It is not investment, legal, financial, medical, or regulated advice.",
  "It does not prove product-market fit, traffic, payment, or buyer demand.",
  "It does not run hidden API research or store raw project text on the server."
];

export default function IdeaRiskTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps Free Idea Risk Test",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A browser-local project idea risk test that maps likely failure nodes and time checkpoints using a visible source basis.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page idea-risk-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero idea-risk-hero">
        <div>
          <p className="eyebrow">Free test window</p>
          <h1>Test a project idea before turning it into a Route File.</h1>
          <p>
            Put in a rough idea. The first output is not payment, not a promise, and not a
            final plan. It is a source-backed failure map with evidence gaps, time
            checkpoints, and the next planning action.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#idea-risk-test">
              <ClipboardList aria-hidden="true" size={17} />
              Start free test
            </a>
            <Link prefetch={false} className="secondary-action" href="/plan/">
              <FileCheck2 aria-hidden="true" size={17} />
              Plan Studio
            </Link>
            <Link prefetch={false} className="secondary-action" href="/sample/">
              Source to Route File
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Core flow</strong>
          <p>
            User idea to failure-node match to reference basis to evidence gaps to time
            checkpoints to Plan Studio or Review Status.
          </p>
        </aside>
      </section>

      <RouteStageHeader
        current="plan"
        title="Idea Risk Test is the free first screen before Plan Studio."
        body="The visitor should understand what may fail before the project becomes intake, research, or final Route File work."
      />

      <RouteFlowBridge
        current="plan"
        eyebrow="Free risk map"
        nextHref="/plan/"
        nextLabel="Convert risk map into plan"
      />

      <RouteProjectLifecycle
        current="plan"
        eyebrow="Pre-plan state"
        title="The project starts as a risk map, not a confident business plan."
        body="The site first exposes failure nodes and evidence gaps. Only then should the visitor move into Plan Studio, Review Status, Scope Lock, or Route File review."
      />

      <ClientRouteStatePanel
        current="plan"
        title="The customer can test the idea without payment."
        body="The free page runs locally, shows source basis, and gives a reference plan. Manual acceptance and final Route File judgment still happen later."
        compact
      />

      <section className="gate-section idea-risk-flow-section">
        <div className="section-head">
          <h2>What happens from click to output.</h2>
          <p>
            The key support is not a hidden AI answer. It is the visible connection between
            user input, failure patterns, source basis, evidence needed, and time-boxed action.
          </p>
        </div>
        <div className="idea-risk-flow-grid">
          {flowRows.map((item, index) => (
            <article key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <IdeaRiskTestStudio />

      <section className="gate-section split-section gate-split idea-risk-source-boundary">
        <div>
          <h2>Reference sources are visible.</h2>
          <p>
            The test uses searched and registered startup failure sources as a pattern
            library. These sources are useful for asking better questions, not for declaring
            certainty about one project.
          </p>
          <div className="idea-risk-source-ledger">
            {ideaRiskSources.map((source) => (
              <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                <SearchCheck aria-hidden="true" size={17} />
                <span>{source.publisher}</span>
                <strong>{source.name}</strong>
                <small>{source.useFor}</small>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2>What this page will not claim.</h2>
          <ul className="compact-list">
            {notClaims.map((item) => (
              <li key={item}>
                <ShieldCheck aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/plan/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Continue to Plan Studio
            </Link>
            <Link prefetch={false} className="secondary-action" href="/review-status/">
              Review Status
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
