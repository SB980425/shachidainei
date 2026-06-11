import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { intakeFields, launchProduct } from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/intake/";

export const metadata: Metadata = {
  title: "Launch Blueprint Intake",
  description:
    "Project details needed after buying the AgentSiteOps Launch Blueprint.",
  alternates: { canonical: path },
  openGraph: {
    title: "Launch Blueprint Intake",
    description: "Send these details after payment so the manual blueprint can be delivered.",
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
    name: "Launch Blueprint Intake",
    description: "Project details needed after buying the AgentSiteOps Launch Blueprint.",
    url: `${siteUrl}${path}`,
    inLanguage: "en"
  };
  const mailSubject = encodeURIComponent("AgentSiteOps Launch Blueprint intake");
  const mailBody = encodeURIComponent(
    `Payment name or PayPal email:\n\n${intakeFields.map((field) => `- ${field}:\n`).join("\n")}`
  );

  return (
    <main className="gate-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="gate-hero">
        <div>
          <p className="eyebrow">Post-payment intake</p>
          <h1>Send the details needed for the Blueprint.</h1>
          <p>
            The site does not use a login system yet. After payment, send the details below
            to the support email so the manual blueprint can be prepared.
          </p>
          <div className="hero-actions">
            <a
              className="primary-action"
              data-analytics-event="intake_email_click"
              data-analytics-label="intake_mailto"
              href={`mailto:${launchProduct.supportEmail}?subject=${mailSubject}&body=${mailBody}`}
            >
              <Mail aria-hidden="true" size={17} />
              Email intake
            </a>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Delivery clock</strong>
          <p>{launchProduct.timeline}</p>
        </aside>
      </section>

      <section className="gate-section">
        <div className="section-head">
          <h2>Required fields</h2>
          <p>Use concise factual answers. Do not send passwords, private API keys, bank details, or account recovery information.</p>
        </div>
        <div className="loop-grid">
          {intakeFields.map((field, index) => (
            <article key={field}>
              <span>{index + 1}</span>
              <h3>{field}</h3>
              <p>Provide the shortest useful version. Links are acceptable when they are public and safe to inspect.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
