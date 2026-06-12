import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Goal, Link2, MousePointer2, Sparkles } from "lucide-react";
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
        <div>
          <p className="eyebrow">{page.pageType}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href={page.primaryAction.href}>
              <ArrowRight aria-hidden="true" size={17} />
              {page.primaryAction.label}
            </Link>
            {page.secondaryAction ? (
              <Link prefetch={false} className="secondary-action" href={page.secondaryAction.href}>
                <Sparkles aria-hidden="true" size={17} />
                {page.secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>
        <aside className="route-brief">
          <strong>Route brief</strong>
          <dl>
            <div>
              <dt>
                <Bot aria-hidden="true" size={15} />
                AI target
              </dt>
              <dd>{page.aiTarget}</dd>
            </div>
            <div>
              <dt>
                <MousePointer2 aria-hidden="true" size={15} />
                Human action
              </dt>
              <dd>{page.humanAction}</dd>
            </div>
          </dl>
        </aside>
      </section>
      <section className="page-grid">
        <article className="main-panel">
          <div className="answer-block">
            <Goal aria-hidden="true" size={18} />
            <span>{page.answer}</span>
          </div>
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.rows ? <DataRows rows={section.rows} /> : null}
            </section>
          ))}
        </article>
        <aside className="side-panel">
          <h2>Related Pages</h2>
          <ul>
            {page.related.map((link) => (
              <li key={link.href}>
                <Link prefetch={false} href={link.href}>
                  <Link2 aria-hidden="true" size={14} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
