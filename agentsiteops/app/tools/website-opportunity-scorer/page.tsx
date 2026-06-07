import Link from "next/link";
import { OpportunityScorer } from "@/components/OpportunityScorer";
import { getRouteMetadata } from "@/components/RoutePage";
import { routeMap, siteUrl } from "@/lib/site";

const path = "/tools/website-opportunity-scorer/";
const page = routeMap.get(path);

export const metadata = getRouteMetadata(path);

export default function Page() {
  if (!page) {
    throw new Error(`Missing route page: ${path}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.title,
    description: page.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "en",
    url: `${siteUrl}${path}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <main className="page-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero tool-hero">
        <div>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        <div className="tool-hero-actions">
          <Link className="secondary-action" href="/methodology/website-opportunity-scoring/">
            View methodology
          </Link>
          <Link className="secondary-action" href="/ai-website-operating-system/">
            Return to system
          </Link>
        </div>
      </section>
      <section className="tool-answer">
        <div className="answer-block">{page.answer}</div>
      </section>
      <OpportunityScorer />
    </main>
  );
}
