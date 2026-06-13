import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileText,
  Gauge,
  GitCompareArrows,
  ShieldCheck
} from "lucide-react";
import { getRouteMetadata } from "@/components/RoutePage";
import { routeMap, siteUrl } from "@/lib/site";

const path = "/reports/route-basis/";
const page = routeMap.get(path);

export const metadata = getRouteMetadata(path);

type CsvRow = Record<string, string>;

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""]))
  ) as CsvRow[];
}

function readCsv(filename: string) {
  return parseCsv(readFileSync(resolve(process.cwd(), "data", filename), "utf8"));
}

function titleize(value: string) {
  return value.replace(/_/g, " ");
}

function RouteTable({ columns, rows }: { columns: string[]; rows: CsvRow[] }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {titleize(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${columns[0]}-${row[columns[0]]}-${index}`}>
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const routeSelectionSequence = [
  {
    title: "Normalize project facts",
    body:
      "The route run starts from project type, target buyer, builder ability, assets, data sources, weekly capacity, payment boundary, and risk category.",
    icon: FileText
  },
  {
    title: "Compare route archetypes",
    body:
      "The project is compared against the public route-pattern library. At least one archetype must fit the buyer job, proof asset, delivery burden, and stop rule.",
    icon: GitCompareArrows
  },
  {
    title: "Apply evidence weights",
    body:
      "Buyer-specific and first-party evidence outranks public research. Public pages, keyword estimates, and AI answers are context until verified by owned signals.",
    icon: Database
  },
  {
    title: "Downgrade weak claims",
    body:
      "Missing payment, search, usage, data-rights, or delivery evidence lowers the confidence band and blocks traffic, revenue, subscription, or authority claims.",
    icon: Gauge
  },
  {
    title: "Deliver or reject",
    body:
      "A valid route file must include selected route, rejected alternatives, evidence ledger, first proof asset, first channel, and dated stop or pivot rule.",
    icon: ShieldCheck
  }
];

const invalidSignals = [
  "A high score without source evidence",
  "Third-party keyword or traffic estimates without first-party validation",
  "A sitemap success or IndexNow response treated as demand",
  "Generic AI output that does not use project-specific evidence",
  "A payment price copied from competitors without buyer budget proof",
  "A broad target user such as all founders, all AI users, or all websites"
];

const maturityNotes = [
  {
    label: "Current library",
    value:
      "12 operating archetypes maintained as public repo data. They are route patterns, not proof of confirmed customer outcomes."
  },
  {
    label: "Accepted case",
    value:
      "A route becomes stronger only after a completed run records source table, evidence ledger, delivered artifact, buyer feedback, or first-party search and usage signals."
  },
  {
    label: "Failure rule",
    value:
      "If no archetype fits or generic AI can produce the same useful plan from the same inputs, the route should narrow, pivot, or stop instead of producing a polished roadmap."
  }
];

export default function Page() {
  const routePatterns = readCsv("route-pattern-library.csv");
  const sourceMap = readCsv("route-selection-source-map.csv");
  const confidenceRubric = readCsv("route-confidence-rubric.csv");
  const fitMatrix = readCsv("project-route-fit-matrix.csv");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: page?.title,
    description: page?.description,
    url: `${siteUrl}${path}`,
    inLanguage: "en",
    variableMeasured: [
      "route_archetype",
      "minimum_evidence",
      "confidence_band",
      "project_type",
      "evidence_needed_before_payment"
    ]
  };

  return (
    <main className="page-main route-basis-report">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero">
        <div>
          <p className="eyebrow">report</p>
          <h1>{page?.title}</h1>
          <p>{page?.description}</p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/reports/agentsiteops-route-run/">
              <FileText aria-hidden="true" size={17} />
              View self route run
            </Link>
            <Link prefetch={false} className="secondary-action" href="/templates/route-research-prompt-pack/">
              <ArrowRight aria-hidden="true" size={17} />
              Open research workspace
            </Link>
          </div>
        </div>
        <aside className="route-brief">
          <strong>Data-backed basis</strong>
          <dl>
            <div>
              <dt>
                <Database aria-hidden="true" size={15} />
                Route archetypes
              </dt>
              <dd>{routePatterns.length} reusable patterns, each with evidence and stop rules.</dd>
            </div>
            <div>
              <dt>
                <Database aria-hidden="true" size={15} />
                Confidence gates
              </dt>
              <dd>{confidenceRubric.length} bands prevent weak inputs from becoming confident roadmaps.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="page-grid">
        <article className="main-panel">
          <div className="answer-block">
            <Database aria-hidden="true" size={18} />
            <span>
              {page?.answer} The tables below expose the current route patterns,
              evidence inputs, confidence bands, and project-fit matrix used before a
              route file can be delivered.
            </span>
          </div>

          <section>
            <h2>Route selection sequence</h2>
            <p>
              The route is not generated from the score alone. The score opens or closes
              the build gate; the selected path comes from matching project evidence
              against route archetypes, downgrade rules, and delivery constraints.
            </p>
            <div className="route-basis-flow">
              {routeSelectionSequence.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden="true" size={18} />
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <h2>Invalid signals that cannot raise confidence</h2>
            <p>
              These inputs can appear inside research, but they cannot make a route
              commercially stronger until they are tied to buyer-specific or first-party
              evidence.
            </p>
            <div className="route-basis-invalid-grid">
              {invalidSignals.map((signal) => (
                <article key={signal}>
                  <ShieldCheck aria-hidden="true" size={17} />
                  <span>{signal}</span>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>Library maturity boundary</h2>
            <p>
              The current knowledge base is useful for internal route decisions because
              it exposes patterns and stop rules. It is not yet a large customer case
              database, and it must not be marketed as one.
            </p>
            <div className="route-basis-maturity-grid">
              {maturityNotes.map((note) => (
                <article key={note.label}>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <h3>{note.label}</h3>
                  <p>{note.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>Route pattern library</h2>
            <p>
              These patterns define what kind of route can be selected, when it fits,
              what evidence is required, what public asset should exist first, and when
              the route must stop.
            </p>
            <RouteTable
              columns={[
                "route_archetype",
                "best_fit_when",
                "minimum_evidence",
                "primary_page_asset",
                "paid_offer_shape",
                "common_stop_rule"
              ]}
              rows={routePatterns}
            />
          </section>

          <section>
            <h2>Route selection source map</h2>
            <p>
              Inputs do not all carry equal weight. This map records which evidence can
              affect the route and which weak signals force downgrade or stop decisions.
            </p>
            <RouteTable
              columns={[
                "input_dimension",
                "accepted_evidence",
                "downgrade_when",
                "stop_rule",
                "output_effect"
              ]}
              rows={sourceMap}
            />
          </section>

          <section>
            <h2>Confidence rubric</h2>
            <p>
              The score is a gate, not a route generator. Confidence is lowered when
              payment, buyer, search, usage, rights, or delivery evidence is missing.
            </p>
            <RouteTable
              columns={[
                "confidence_band",
                "required_evidence",
                "allowed_output",
                "blocked_claims",
                "next_action"
              ]}
              rows={confidenceRubric}
            />
          </section>

          <section>
            <h2>Project route fit matrix</h2>
            <p>
              Different project types need different first assets and payment evidence.
              This matrix keeps AgentSiteOps from forcing every project into the same
              paid blueprint shape.
            </p>
            <RouteTable
              columns={[
                "project_type",
                "strongest_route_when",
                "weak_route_when",
                "recommended_first_asset",
                "evidence_needed_before_payment"
              ]}
              rows={fitMatrix}
            />
          </section>
        </article>

        <aside className="side-panel">
          <h2>How to use this report</h2>
          <div className="route-basis-side-note">
            <strong>What this page proves</strong>
            <p>
              It proves that route selection has an inspectable basis. It does not prove
              customer demand, rankings, AI citations, revenue, or product-market fit.
            </p>
          </div>
          <ul>
            <li>
              <Link prefetch={false} href="/reports/agentsiteops-route-run/">
                <FileText aria-hidden="true" size={14} />
                Compare against the self route run
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/templates/route-research-prompt-pack/">
                <FileText aria-hidden="true" size={14} />
                Generate a research prompt
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/methodology/route-selection/">
                <FileText aria-hidden="true" size={14} />
                Inspect the route method
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/evidence/">
                <FileText aria-hidden="true" size={14} />
                Check evidence limits
              </Link>
            </li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
