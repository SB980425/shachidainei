import type { Metadata } from "next";
import Link from "next/link";
import { routeMap, siteUrl, type RoutePage as RoutePageData } from "@/lib/site";

type Props = {
  path: string;
};

export function getRouteMetadata(path: string): Metadata {
  const page = routeMap.get(path);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteUrl}${path}`,
      siteName: "AgentSiteOps",
      locale: "en_US",
      type: "website"
    }
  };
}

function DataRows({ rows }: { rows: NonNullable<RoutePageData["sections"][number]["rows"]> }) {
  return (
    <table className="data-table">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function StaticRoutePage({ path }: Props) {
  const page = routeMap.get(path);

  if (!page) {
    throw new Error(`Missing route page: ${path}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": page.pageType === "tool" ? "SoftwareApplication" : "WebPage",
    name: page.title,
    description: page.description,
    url: `${siteUrl}${page.path}`,
    inLanguage: "en"
  };

  return (
    <main className="page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </section>
      <section className="page-grid">
        <article className="main-panel">
          <div className="answer-block">{page.answer}</div>
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.rows ? <DataRows rows={section.rows} /> : null}
            </section>
          ))}
        </article>
        <aside className="side-panel">
          <h2>Page Goal</h2>
          <ul>
            <li>AI citation goal: {page.aiTarget}</li>
            <li>Human continuation: {page.humanAction}</li>
          </ul>
          <div className="hero-actions">
            <Link className="primary-action" href={page.primaryAction.href}>
              {page.primaryAction.label}
            </Link>
            {page.secondaryAction ? (
              <Link className="secondary-action" href={page.secondaryAction.href}>
                {page.secondaryAction.label}
              </Link>
            ) : null}
          </div>
          <h2>Related Pages</h2>
          <ul>
            {page.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
