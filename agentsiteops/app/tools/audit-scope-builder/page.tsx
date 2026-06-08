import { AuditScopeBuilder } from "@/components/AuditScopeBuilder";
import { getRouteMetadata } from "@/components/RoutePage";
import { routeMap, siteUrl } from "@/lib/site";

const path = "/tools/audit-scope-builder/";
const page = routeMap.get(path);

export const metadata = getRouteMetadata(path);

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page?.title,
    description: page?.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero">
        <h1>{page?.title}</h1>
        <p>{page?.description}</p>
      </section>
      <section className="page-grid">
        <article className="main-panel">
          <div className="answer-block">{page?.answer}</div>
          <AuditScopeBuilder />
        </article>
        <aside className="side-panel">
          <h2>Use Boundary</h2>
          <ul>
            <li>Local-only tool: no request is submitted.</li>
            <li>No payment, account, identity, or external platform step is required.</li>
            <li>Copy the scope draft only after removing any sensitive details.</li>
          </ul>
          <h2>Related Pages</h2>
          <ul>
            {page?.related.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
