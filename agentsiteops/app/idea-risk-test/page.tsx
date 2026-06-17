import type { Metadata } from "next";
import { IdeaRiskTestPageContent } from "@/components/IdeaRiskTestPageContent";
import { siteUrl } from "@/lib/site";

const path = "/idea-risk-test/";

export const metadata: Metadata = {
  title: "Free Idea Risk Test",
  description:
    "A free AgentSiteOps project idea test that maps likely failure nodes, evidence gaps, source basis, time checkpoints, and next planning actions before Route File review.",
  alternates: { canonical: path },
  openGraph: {
    title: "Free Idea Risk Test",
    description:
      "Fill in one rough project idea and receive a source-backed failure-node map, evidence gaps, time checkpoints, and next planning actions.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function IdeaRiskTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps Free Idea Risk Test",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A browser-local project idea risk test that maps likely failure nodes and time checkpoints using a visible source basis.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page idea-risk-page ia-risk-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <IdeaRiskTestPageContent />
    </main>
  );
}
