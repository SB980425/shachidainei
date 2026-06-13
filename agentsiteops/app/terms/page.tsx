import type { Metadata } from "next";
import Link from "next/link";
import { launchProduct } from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/terms/";

export const metadata: Metadata = {
  title: "Service Terms",
  description: "Service terms for the AgentSiteOps Route File manual delivery offer.",
  alternates: { canonical: path },
  openGraph: {
    title: "Service Terms",
    description: "Terms for the manual Research-to-Route File service.",
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
    name: "Service Terms",
    description: "Service terms for the AgentSiteOps Research-to-Route File manual delivery offer.",
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
          <p className="eyebrow">Service terms</p>
          <h1>Route File manual delivery terms.</h1>
          <p>
            These terms define the current validation-stage service. They are business-process terms,
            not legal advice.
          </p>
        </div>
        <aside className="decision-card">
          <strong>Current service</strong>
          <p>{launchProduct.name}, USD {launchProduct.price}, manual 24-72 hour delivery.</p>
        </aside>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Scope</h2>
          <ul className="compact-list">
            <li>The service provides a manual Research-to-Route File based on buyer-submitted details.</li>
            <li>Delivery includes selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.</li>
            <li>Payment is currently handled through PayPal-hosted payment links; the site does not collect card data.</li>
            <li>The service does not include software development, platform automation, paid advertising, account management, or legal review.</li>
            <li>Delivery depends on receiving usable intake details after payment.</li>
          </ul>
        </div>
        <div>
          <h2>Limits</h2>
          <ul className="compact-list">
            <li>{launchProduct.nonPromise}</li>
            <li>Do not send secrets, credentials, payment data, private customer data, or regulated personal information.</li>
            <li>The buyer remains responsible for platform compliance, client claims, legal review, tax treatment, and final business decisions.</li>
          </ul>
          <div className="hero-actions">
            <Link prefetch={false} className="secondary-action" href="/refund-policy/">Refund policy</Link>
            <Link prefetch={false} className="secondary-action" href="/disclaimer/">Disclaimer</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
