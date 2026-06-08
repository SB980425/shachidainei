import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { routeMap, siteUrl } from "@/lib/site";

const path = "/reports/route-evidence-dashboard/";
const page = routeMap.get(path);

type EvidenceRow = {
  url: string;
  page_type: string;
  cluster: string;
  technical_seo_status: string;
  crawler_access_status: string;
  gsc_status: string;
  bing_status: string;
  ai_referral_status: string;
  onsite_event_status: string;
  current_action: string;
  next_required_evidence: string;
};

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  alternates: { canonical: path },
  openGraph: {
    title: page?.title,
    description: page?.description,
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

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
  ) as EvidenceRow[];
}

function readRows() {
  const csvPath = resolve(process.cwd(), "data", "growth-evidence-snapshot.csv");
  return parseCsv(readFileSync(csvPath, "utf8"));
}

function count(rows: EvidenceRow[], predicate: (row: EvidenceRow) => boolean) {
  return rows.filter(predicate).length;
}

export default function Page() {
  const rows = readRows();
  const summary = [
    { label: "Routes", value: rows.length },
    { label: "Tech SEO pass", value: count(rows, (row) => row.technical_seo_status === "pass") },
    { label: "Crawler pass", value: count(rows, (row) => row.crawler_access_status === "site_pass") },
    { label: "GSC pending", value: count(rows, (row) => row.gsc_status === "pending_export") },
    { label: "Bing pending", value: count(rows, (row) => row.bing_status === "pending_export") }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: page?.title,
    description: page?.description,
    url: `${siteUrl}${path}`,
    inLanguage: "en",
    variableMeasured: [
      "technical_seo_status",
      "crawler_access_status",
      "gsc_status",
      "bing_status",
      "onsite_event_status",
      "current_action"
    ]
  };

  return (
    <main className="dashboard-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Evidence dashboard</p>
          <h1>{page?.title}</h1>
          <p>{page?.description}</p>
        </div>
        <aside className="decision-card">
          <strong>Evidence boundary</strong>
          <p>
            This dashboard reads first-party release reports and route records. It does not prove
            indexing, AI citation, traffic, conversion, or revenue.
          </p>
          <Link className="secondary-action" href="/evidence/">
            View Evidence Ledger
          </Link>
        </aside>
      </section>

      <section className="dashboard-summary" aria-label="route evidence summary">
        {summary.map((item) => (
          <article key={item.label}>
            <span>{item.value}</span>
            <strong>{item.label}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-table-section">
        <div className="section-head">
          <h2>Route evidence table</h2>
          <p>
            Each row maps a public URL to technical readiness, crawler access, search evidence, onsite
            signal status, current action, and the next evidence needed before expansion.
          </p>
        </div>
        <div className="table-scroll">
          <table className="data-table route-evidence-table">
            <thead>
              <tr>
                <th scope="col">URL</th>
                <th scope="col">Type</th>
                <th scope="col">Tech</th>
                <th scope="col">Crawler</th>
                <th scope="col">GSC</th>
                <th scope="col">Bing</th>
                <th scope="col">Action</th>
                <th scope="col">Next evidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.url}>
                  <th scope="row">
                    <Link href={row.url}>{row.url}</Link>
                  </th>
                  <td>{row.page_type}</td>
                  <td>{row.technical_seo_status}</td>
                  <td>{row.crawler_access_status}</td>
                  <td>{row.gsc_status}</td>
                  <td>{row.bing_status}</td>
                  <td>{row.current_action}</td>
                  <td>{row.next_required_evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
