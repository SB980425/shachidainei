import type { Metadata } from "next";
import { HomePageContent } from "@/components/HomePageContent";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Idea Risk Test to Route File",
  description:
    "AgentSiteOps starts with one rough project idea, maps likely failure nodes and evidence gaps, then turns usable inputs into a checked Route File path."
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AgentSiteOps Research-to-Route File",
    description:
      "An operator-reviewed route-selection workflow that turns messy project material into one Route File with rejected alternatives, evidence ledger, validation channel, and stop rule.",
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
