import Link from "next/link";
import { LaunchBlueprintFitChecker } from "@/components/LaunchBlueprintFitChecker";
import { getRouteMetadata } from "@/components/RoutePage";
import { routeMap, siteUrl } from "@/lib/site";

const path = "/tools/launch-blueprint-fit-checker/";
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
          <LaunchBlueprintFitChecker />
        </article>
        <aside className="side-panel">
          <h2>Use Boundary</h2>
          <ul>
            <li>The checker runs locally in the browser.</li>
            <li>No request, account, payment, or personal data is submitted.</li>
            <li>A high score is not a traffic, revenue, ranking, or customer guarantee.</li>
          </ul>
          <h2>Purchase Path</h2>
          <ul>
            <li>
              <Link href="/sample/">Inspect the sample blueprint first.</Link>
            </li>
            <li>
              <Link href="/compare/">Compare alternatives before payment.</Link>
            </li>
            <li>
              <Link href="/pricing/">Use pricing only after the fit is clear.</Link>
            </li>
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
