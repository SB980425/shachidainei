import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, CheckCircle2, FileText, Gauge, GitCompareArrows, ShieldCheck } from "lucide-react";
import { siteUrl } from "@/lib/site";
import { projectRouteFitMatrix, routeConfidenceBands, routeSourceMap } from "@/lib/routeEvidence";

const path = "/methodology/route-selection/";

export const metadata: Metadata = {
  title: "Route Selection Methodology",
  description:
    "How AgentSiteOps turns project evidence into a route archetype, confidence band, first asset, and stop rule without treating a 0-100 score as authority.",
  alternates: { canonical: path },
  openGraph: {
    title: "Route Selection Methodology",
    description:
      "Inspect the evidence map behind AgentSiteOps route selection: inputs, downgrade rules, hard stops, confidence bands, and project-type fit.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

const selectionSteps = [
  {
    title: "Reject hard blockers first",
    body:
      "Regulated advice, unclear data rights, private account dependency, spam-like outreach, and generic-AI-equivalent output can stop the route before scoring.",
    icon: Ban
  },
  {
    title: "Map the project type",
    body:
      "The route is matched to service, content, tool, template, directory, or implementation patterns based on proof and delivery capacity.",
    icon: GitCompareArrows
  },
  {
    title: "Set confidence from evidence",
    body:
      "Payment plus usable intake, qualified replies, first-party exports, and real proof assets outrank assumptions or third-party estimates.",
    icon: Gauge
  },
  {
    title: "Choose one first asset",
    body:
      "The output is one offer, one page or proof asset, one outreach path, rejected alternatives, and a dated stop rule.",
    icon: FileText
  }
];

function SourceMapTable() {
  return (
    <div className="evidence-table-wrap" aria-label="Route source map">
      <table className="route-evidence-table">
        <thead>
          <tr>
            <th scope="col">Input</th>
            <th scope="col">Accepted evidence</th>
            <th scope="col">Downgrade when</th>
            <th scope="col">Stop rule</th>
            <th scope="col">Route effect</th>
          </tr>
        </thead>
        <tbody>
          {routeSourceMap.map((row) => (
            <tr key={row.dimension}>
              <th scope="row">{row.dimension}</th>
              <td>{row.acceptedEvidence}</td>
              <td>{row.downgradeWhen}</td>
              <td>{row.stopRule}</td>
              <td>{row.outputEffect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConfidenceTable() {
  return (
    <div className="evidence-table-wrap" aria-label="Route confidence bands">
      <table className="route-evidence-table">
        <thead>
          <tr>
            <th scope="col">Band</th>
            <th scope="col">Required evidence</th>
            <th scope="col">Allowed output</th>
            <th scope="col">Blocked claims</th>
            <th scope="col">Next action</th>
          </tr>
        </thead>
        <tbody>
          {routeConfidenceBands.map((row) => (
            <tr key={row.band}>
              <th scope="row">{row.band}</th>
              <td>{row.requiredEvidence}</td>
              <td>{row.allowedOutput}</td>
              <td>{row.blockedClaims}</td>
              <td>{row.nextAction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FitMatrixTable() {
  return (
    <div className="evidence-table-wrap" aria-label="Project route fit matrix">
      <table className="route-evidence-table">
        <thead>
          <tr>
            <th scope="col">Project type</th>
            <th scope="col">Strong when</th>
            <th scope="col">Weak when</th>
            <th scope="col">First asset</th>
            <th scope="col">Evidence before payment</th>
          </tr>
        </thead>
        <tbody>
          {projectRouteFitMatrix.map((row) => (
            <tr key={row.projectType}>
              <th scope="row">{row.projectType}</th>
              <td>{row.strongestRouteWhen}</td>
              <td>{row.weakRouteWhen}</td>
              <td>{row.firstAsset}</td>
              <td>{row.evidenceBeforePayment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Route Selection Methodology",
    description:
      "The evidence map behind AgentSiteOps route selection, confidence bands, project fit, and stop rules.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page route-method-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero route-method-hero">
        <div>
          <p className="eyebrow">Route method</p>
          <h1>The score is only a gate. The route comes from evidence.</h1>
          <p>
            AgentSiteOps does not treat a 0-100 number as authority. A route is selected
            by checking evidence quality, buyer clarity, proof assets, delivery capacity,
            risk, and whether a generic AI answer could produce the same useful output.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/sample/">
              <FileText aria-hidden="true" size={17} />
              Inspect sample artifact
            </Link>
            <Link prefetch={false} className="secondary-action" href="/tools/launch-blueprint-fit-checker/">
              <CheckCircle2 aria-hidden="true" size={17} />
              Check fit first
            </Link>
            <Link prefetch={false} className="secondary-action" href="/tools/route-confidence-checker/">
              <Gauge aria-hidden="true" size={17} />
              Run route checker
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              <ArrowRight aria-hidden="true" size={17} />
              View route basis
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Current boundary</strong>
          <p>
            The method can produce high, medium, low, or reject confidence. Missing
            first-party search, payment, buyer reply, or delivery evidence lowers the
            route instead of being filled by model confidence.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Selection sequence</h2>
          <p>
            The route is picked by constraint order. A stronger score cannot override a
            hard blocker or missing delivery proof.
          </p>
        </div>
        <div className="loop-grid">
          {selectionSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.title}>
                <span>{index + 1}</span>
                <Icon aria-hidden="true" size={18} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>What raises authority</h2>
          <ul className="compact-list">
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Confirmed payment plus usable intake.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              Qualified buyer wording, objections, or request patterns.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              First-party search, analytics, AI referral, or source-link evidence.
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" size={16} />
              A proof asset that matches the route being recommended.
            </li>
          </ul>
        </div>
        <div>
          <h2>What forces downgrade or stop</h2>
          <ul className="compact-list">
            <li>
              <ShieldCheck aria-hidden="true" size={16} />
              Unsupported legal, medical, financial, tax, safety, or account-risk advice.
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={16} />
              Copied data, unclear source rights, or no freshness owner.
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={16} />
              No reachable buyer segment, proof asset, or manual delivery capacity.
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={16} />
              A useful equivalent can be generated by generic AI from the same inputs.
            </li>
          </ul>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Route source map</h2>
          <p>
            Each dimension has accepted evidence, downgrade conditions, a stop rule, and
            a direct effect on the route. This table is the route basis, not hidden model
            judgment.
          </p>
        </div>
        <SourceMapTable />
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Confidence bands</h2>
          <p>
            Confidence changes what AgentSiteOps is allowed to recommend. Low evidence can
            still produce a useful diagnostic page, but it cannot justify a paid roadmap
            claim or subscription path.
          </p>
        </div>
        <ConfidenceTable />
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Project route fit matrix</h2>
          <p>
            Different project types need different proof. A route file is rejected when
            the buyer needs implementation, the data is unsafe, or the first asset cannot
            be made credible before payment.
          </p>
        </div>
        <FitMatrixTable />
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Current AgentSiteOps self-application</h2>
          <p>
            This site currently stays at low-to-medium commercial confidence: technical
            readiness exists, but first-party search exports, qualified external replies,
            confirmed payment plus usable intake, and delivered buyer outcomes are still
            missing.
          </p>
        </div>
        <div>
          <h2>Allowed next move</h2>
          <p>
            Continue the bounded exposure sprint, publish inspectable proof, collect real
            objections, and avoid subscription or scale claims until the confidence band
            changes through external evidence.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/guides/48-hour-exposure-sprint/">
              <ArrowRight aria-hidden="true" size={17} />
              View 48-hour sprint
            </Link>
            <Link prefetch={false} className="secondary-action" href="/evidence/">
              <ArrowRight aria-hidden="true" size={17} />
              View evidence ledger
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
