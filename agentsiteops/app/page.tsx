import type { Metadata } from "next";
import { HomePageContent } from "@/components/HomePageContent";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Idea Risk Test Before Planning",
  description:
    "Paste one rough project idea and get the first route diagnosis: system read, likely failure node, missing evidence, 7-day validation path, and stop rule."
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgentSiteOps Free Idea Risk Test",
    description:
      "A browser-local first-pass workflow that turns one messy project idea into a route diagnosis, evidence gaps, validation path, and stop rule before planning.",
    inLanguage: "en",
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: "AgentSiteOps"
    },
    serviceOutput: "Checked Route File"
  };

  return (
    <main className="page-main route-home frontstage-home ia-reset-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent />
    </main>
  );
}
