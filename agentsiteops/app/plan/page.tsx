import type { Metadata } from "next";
import { PlanPageContent } from "@/components/PlanPageContent";
import { siteUrl } from "@/lib/site";

const path = "/plan/";

export const metadata: Metadata = {
  title: "Plan Studio",
  description:
    "Fill in a messy project plan and get a browser-local preliminary AgentSiteOps route draft before manual intake or final Route File review.",
  alternates: { canonical: path },
  openGraph: {
    title: "Plan Studio",
    description:
      "A clear place to fill in a project plan, see a preliminary route draft, copy a plan brief, and continue to manual intake.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function PlanPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps Plan Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteUrl}${path}`,
    description:
      "A browser-local planning studio for turning messy project notes into a preliminary route draft before manual intake.",
    inLanguage: "en"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlanPageContent />
    </>
  );
}
