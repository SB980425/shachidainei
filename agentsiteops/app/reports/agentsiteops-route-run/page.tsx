import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GitCompareArrows,
  ShieldCheck
} from "lucide-react";
import { getRouteMetadata } from "@/components/RoutePage";
import { routeMap, siteUrl } from "@/lib/site";

const path = "/reports/agentsiteops-route-run/";
const page = routeMap.get(path);

export const metadata = getRouteMetadata(path);

const routeDecisionMatrix = [
  {
    input: "Buyer problem",
    evidence: "Solo builders can build pages and tools but still need a bounded route, first proof asset, and stop rule before spending more time.",
    routeEffect: "Keep the product as a route-planning system, not a broad SEO or AI visibility dashboard.",
    confidence: "Medium internal; low paid-demand proof",
    gap: "Qualified external buyer wording is still limited."
  },
  {
    input: "Proof asset",
    evidence: "Live scorer, crawler checker, route basis report, research workspace, sample blueprint, and self-audit exist.",
    routeEffect: "Use inspectable proof and route files as the first product surface.",
    confidence: "Medium",
    gap: "One complete internal route file must prove the workflow is useful before selling harder."
  },
  {
    input: "Delivery capacity",
    evidence: "Manual delivery is realistic; automated SaaS support is not yet justified.",
    routeEffect: "Offer fixed-scope manual files and internal planning before subscription claims.",
    confidence: "Medium",
    gap: "Turnaround and revision limits need real buyer runs."
  },
  {
    input: "Monetization fit",
    evidence: "PayPal path exists, but payment plus usable intake is not yet proven as buyer demand.",
    routeEffect: "Keep free tools and low-risk manual review visible; block subscription positioning.",
    confidence: "Low",
    gap: "Confirmed payment, refund boundary use, and completed delivery outcome."
  },
  {
    input: "Generic AI substitute",
    evidence: "Generic AI can suggest ideas, but this workflow adds rejection rules, evidence ledger, route basis, and stop thresholds.",
    routeEffect: "The file must show rejected routes and evidence mapping or it is not worth selling.",
    confidence: "Medium",
    gap: "Need side-by-side examples showing why a route file beats generic advice."
  }
];

const rejectedRoutes = [
  {
    route: "AI visibility SaaS",
    reason:
      "Rejected because ongoing prompt tracking, dashboards, and subscription support need repeat-use and data-scale evidence."
  },
  {
    route: "Generic prompt pack",
    reason:
      "Rejected because a broad prompt bundle can be replaced by ordinary ChatGPT use unless it includes route-specific evidence gates."
  },
  {
    route: "Full SEO agency",
    reason:
      "Rejected because case studies, fulfillment operations, trust proof, and qualified lead flow are not yet present."
  },
  {
    route: "Course or media brand",
    reason:
      "Rejected because authority, audience retention, and repeat learning demand are not yet proven."
  }
];

const evidenceLedger = [
  {
    claim: "The site is technically launchable.",
    evidence: "Cloudflare deployment, sitemap, robots, canonical routes, health checks, and IndexNow submissions.",
    status: "Verified",
    impact: "Allows continued public testing."
  },
  {
    claim: "The route workflow can help our own future projects.",
    evidence: "Methodology, route basis data, manual Deep Research workspace, and synthesis skeleton.",
    status: "Partly verified",
    impact: "Requires one completed internal route file."
  },
  {
    claim: "Customers will pay for the route file.",
    evidence: "Payment path exists; confirmed payment and usable intake are not yet recorded.",
    status: "Pending",
    impact: "Blocks stronger paid-demand claims."
  },
  {
    claim: "The product can support subscription revenue.",
    evidence: "No repeat-use or recurring workflow evidence yet.",
    status: "Blocked",
    impact: "Subscription route remains rejected."
  }
];

const sevenDayPlan = [
  { day: "Day 1", task: "Run the manual research workspace on AgentSiteOps itself.", artifact: "Completed primary report", evidence: "Coverage gate result" },
  { day: "Day 2", task: "Create a focused gap prompt if the report misses route alternatives, pricing, or validation evidence.", artifact: "Gap response", evidence: "Missing modules repaired" },
  { day: "Day 3", task: "Fuse the result into one route file using the decision matrix.", artifact: "Internal route file", evidence: "Rejected routes and evidence ledger present" },
  { day: "Day 4", task: "Turn the route file into one proof asset improvement.", artifact: "Improved sample or method page", evidence: "Before-after content delta" },
  { day: "Day 5", task: "Request external feedback on whether the file beats generic AI advice.", artifact: "Feedback request", evidence: "Qualified reply or objection" },
  { day: "Day 6", task: "Record objections and update the route basis or pricing boundary.", artifact: "Evidence ledger update", evidence: "Changed rule or blocked claim" },
  { day: "Day 7", task: "Decide continue, pilot, pivot, or stop.", artifact: "Decision note", evidence: "Real signal or explicit absence of signal" }
];

const acceptanceChecks = [
  "Selected route is tied to evidence, not preference.",
  "At least three alternatives are rejected with concrete reasons.",
  "The first proof asset can be built before adding broader content or checkout work.",
  "Payment, traffic, ranking, AI citation, and revenue claims stay inside the evidence boundary.",
  "The route names the next evidence required to raise confidence.",
  "If the output is no better than a generic ChatGPT answer, the paid route is blocked."
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: page?.title,
    description: page?.description,
    url: `${siteUrl}${path}`,
    inLanguage: "en",
    about: ["route selection", "evidence ledger", "AI project planning", "validation blueprint"]
  };

  return (
    <main className="gate-page route-run-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="gate-hero">
        <div>
          <p className="eyebrow">Self route file</p>
          <h1>{page?.title}</h1>
          <p>{page?.description}</p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/templates/route-research-prompt-pack/">
              <ClipboardCheck aria-hidden="true" size={17} />
              Open research workspace
            </Link>
            <Link prefetch={false} className="secondary-action" href="/reports/route-basis/">
              <ArrowRight aria-hidden="true" size={17} />
              Inspect route basis
            </Link>
            <Link prefetch={false} className="secondary-action" href="/methodology/route-selection/">
              <GitCompareArrows aria-hidden="true" size={17} />
              View method
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Decision</strong>
          <p>
            Continue as a manual route-planning system for internal and client project
            decisions. Do not expand into SaaS, subscription, broad SEO agency, or
            course positioning until repeat-use and buyer evidence exists.
          </p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Selected route</h2>
          <p>{page?.answer}</p>
        </div>
        <div className="loop-grid">
          <article>
            <span>1</span>
            <h3>Route</h3>
            <p>Manual route planner plus inspectable tools, research workspace, and sample route files.</p>
          </article>
          <article>
            <span>2</span>
            <h3>Confidence</h3>
            <p>Medium for internal usefulness; low for paid demand until qualified external evidence improves.</p>
          </article>
          <article>
            <span>3</span>
            <h3>Boundary</h3>
            <p>Technical launch readiness exists; buyer payment, usable intake, and delivered outcomes remain pending.</p>
          </article>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Route decision matrix</h2>
          <p>
            This is the core answer to how the route is created. Inputs affect the route,
            confidence, and missing-evidence list before any recommendation is allowed.
          </p>
        </div>
        <div className="evidence-table-wrap" aria-label="AgentSiteOps route decision matrix">
          <table className="route-evidence-table">
            <thead>
              <tr>
                <th scope="col">Input</th>
                <th scope="col">Evidence used</th>
                <th scope="col">Route effect</th>
                <th scope="col">Confidence</th>
                <th scope="col">Gap</th>
              </tr>
            </thead>
            <tbody>
              {routeDecisionMatrix.map((row) => (
                <tr key={row.input}>
                  <th scope="row">{row.input}</th>
                  <td>{row.evidence}</td>
                  <td>{row.routeEffect}</td>
                  <td>{row.confidence}</td>
                  <td>{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Rejected alternatives</h2>
          <ul className="compact-list">
            {rejectedRoutes.map((item) => (
              <li key={item.route}>
                <ShieldCheck aria-hidden="true" size={16} />
                <span>
                  <strong>{item.route}:</strong> {item.reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>First proof asset</h2>
          <p>
            The next proof asset is one completed internal route file produced through
            the manual research workspace. It must include sources, rejected
            alternatives, decision matrix, evidence ledger, first asset, validation
            channel, 7-day plan, and stop rule.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <FileText aria-hidden="true" size={17} />
              Use the workspace
            </Link>
          </div>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Evidence used</h2>
          <p>
            The current evidence supports technical readiness and internal process
            testing. It does not yet prove demand, revenue, ranking, AI citation, or
            product-market fit.
          </p>
        </div>
        <div className="evidence-table-wrap" aria-label="AgentSiteOps route evidence ledger">
          <table className="route-evidence-table">
            <thead>
              <tr>
                <th scope="col">Claim</th>
                <th scope="col">Evidence</th>
                <th scope="col">Status</th>
                <th scope="col">Confidence impact</th>
              </tr>
            </thead>
            <tbody>
              {evidenceLedger.map((row) => (
                <tr key={row.claim}>
                  <th scope="row">{row.claim}</th>
                  <td>{row.evidence}</td>
                  <td>{row.status}</td>
                  <td>{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>7-day operating rule</h2>
          <p>
            The workflow must improve AgentSiteOps before it can credibly be sold as a
            route planner for other projects.
          </p>
        </div>
        <div className="timeline-grid">
          {sevenDayPlan.map((item) => (
            <article key={item.day}>
              <small>{item.day}</small>
              <h3>{item.task}</h3>
              <p>
                <strong>Artifact:</strong> {item.artifact}
              </p>
              <p>
                <strong>Evidence:</strong> {item.evidence}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Stop or pivot rule</h2>
          <p>
            Stop selling the USD 99 blueprint if the workflow cannot produce a route
            file that is more useful than a generic ChatGPT answer for AgentSiteOps
            itself. Pivot toward internal project planning if external demand remains
            unproven.
          </p>
        </div>
        <div>
          <h2>Delivery acceptance checklist</h2>
          <ul className="compact-list">
            {acceptanceChecks.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
