import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { launchProduct } from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/contact/";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AgentSiteOps about Route File payment, intake, and delivery details.",
  alternates: { canonical: path },
  openGraph: {
    title: "Contact",
    description: "Contact AgentSiteOps for payment, intake, and manual delivery coordination.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact",
    description: "Contact AgentSiteOps about Route File payment, intake, and delivery details.",
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
          <p className="eyebrow">Contact</p>
          <h1>Use email for payment and delivery coordination.</h1>
          <p>
            AgentSiteOps currently has no account system or support dashboard. Use the support
            email for intake, payment confirmation notes, and delivery coordination.
          </p>
          <div className="hero-actions">
            <a
              className="primary-action"
              data-analytics-event="contact_email_click"
              data-analytics-label="contact_mailto"
              href={`mailto:${launchProduct.supportEmail}`}
            >
              <Mail aria-hidden="true" size={17} />
              Email AgentSiteOps
            </a>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Support email</strong>
          <p>{launchProduct.supportEmail}</p>
        </aside>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Use contact for</h2>
          <ul className="compact-list">
            <li>Payment confirmation details.</li>
            <li>Post-payment intake information.</li>
            <li>Delivery coordination.</li>
            <li>Correction requests for published pages.</li>
          </ul>
        </div>
        <div>
          <h2>Do not send</h2>
          <ul className="compact-list">
            <li>Passwords, private API keys, account recovery data, bank details, or customer lists.</li>
            <li>Regulated personal data or confidential client material unless a separate agreement exists.</li>
            <li>Requests for guaranteed rankings, revenue, account automation, or spam workflows.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
