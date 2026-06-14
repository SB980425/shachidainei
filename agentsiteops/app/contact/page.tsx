import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, FileText, Mail, ShieldCheck } from "lucide-react";
import { launchProduct } from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/contact/";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AgentSiteOps about intake readiness, scope boundary, payment confirmation, and delivery details.",
  alternates: { canonical: path },
  openGraph: {
    title: "Contact",
    description: "Contact AgentSiteOps for intake readiness, scope boundary, and manual delivery coordination.",
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
    description: "Contact AgentSiteOps about intake readiness, scope boundary, payment confirmation, and delivery details.",
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
          <h1>Use email for intake and delivery coordination.</h1>
          <p>
            AgentSiteOps currently has no account system or support dashboard. Use the support
            email when the project intake, route boundary, payment confirmation, or delivery handoff
            needs manual coordination.
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
            <Link prefetch={false} className="secondary-action" href="/intake/">
              <FileText aria-hidden="true" size={17} />
              Open intake
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Support email</strong>
          <p>{launchProduct.supportEmail}</p>
          <dl>
            <div>
              <dt>Best use</dt>
              <dd>Resolve intake, scope, and delivery questions before work starts.</dd>
            </div>
            <div>
              <dt>Not supported</dt>
              <dd>No account access, private automation takeover, or guaranteed outcome request.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="gate-section split-section gate-split">
        <div>
          <h2>Use contact for</h2>
          <ul className="compact-list">
            <li>Questions about whether your project has enough input for a Route File.</li>
            <li>Manual scope clarification before or after intake is submitted.</li>
            <li>Payment confirmation details when a purchase already exists.</li>
            <li>Delivery coordination after payment and usable intake are matched.</li>
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

      <section className="gate-section contact-route-grid">
        <Link prefetch={false} href="/delivery-gate/">
          <ClipboardCheck aria-hidden="true" size={21} />
          <span>Check acceptance states</span>
          <strong>Delivery Gate</strong>
        </Link>
        <Link prefetch={false} href="/sample/">
          <FileText aria-hidden="true" size={21} />
          <span>Inspect expected artifact</span>
          <strong>Sample Route File</strong>
        </Link>
        <Link prefetch={false} href="/terms/">
          <ShieldCheck aria-hidden="true" size={21} />
          <span>Read service boundary</span>
          <strong>Service Terms</strong>
        </Link>
      </section>
    </main>
  );
}
