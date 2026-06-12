import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";

const path = "/refund-policy/";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund boundaries for the AgentSiteOps Launch Blueprint manual service.",
  alternates: { canonical: path },
  openGraph: {
    title: "Refund Policy",
    description: "Refund boundaries for the Launch Blueprint validation-stage offer.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Refund Policy",
    description: "Refund boundaries for the AgentSiteOps Launch Blueprint manual service.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };

  return (
    <main className="gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="gate-hero">
        <div>
          <p className="eyebrow">Refund boundary</p>
          <h1>Refunds are tied to delivery status.</h1>
          <p>
            This validation-stage offer uses manual delivery. The refund boundary is intentionally
            simple so buyers understand what happens before and after work begins.
          </p>
        </div>
        <aside className="decision-card">
          <strong>Policy status</strong>
          <p>Manual review required. PayPal dispute and payment rules may still apply.</p>
        </aside>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Refund may be available</h2>
          <ul className="compact-list">
            <li>If payment was made by mistake and no intake review or work has started.</li>
            <li>If the service cannot be delivered because the project is outside scope or high-risk.</li>
            <li>If duplicate payment is confirmed.</li>
          </ul>
        </div>
        <div>
          <h2>Refund is not guaranteed</h2>
          <ul className="compact-list">
            <li>After manual work has started using submitted intake details.</li>
            <li>Because the buyer dislikes a no-build, stop, or pivot recommendation.</li>
            <li>Because the blueprint does not create traffic, ranking, revenue, customers, or approvals.</li>
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/terms/">Service terms</Link>
            <Link prefetch={false} className="secondary-action" href="/contact/">Contact</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
