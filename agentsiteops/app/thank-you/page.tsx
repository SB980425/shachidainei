import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { launchProduct } from "@/lib/launch";
import { siteUrl } from "@/lib/site";

const path = "/thank-you/";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Next steps after buying the AgentSiteOps Route File.",
  alternates: { canonical: path },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Thank You",
    description: "Send intake details after payment so manual delivery can start.",
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website"
  }
};

export default function Page() {
  return (
    <main className="gate-page">
      <section className="gate-hero">
        <div>
          <p className="eyebrow">Next step</p>
          <h1>Send your intake details.</h1>
          <p>
            Payment alone is not enough to start the manual Route File. Send the intake fields
            so the route, evidence ledger, proof asset, validation channel, and stop rule can be built from your actual constraints.
          </p>
          <div className="hero-actions">
            <Link prefetch={false} className="primary-action" href="/intake/">
              <Mail aria-hidden="true" size={17} />
              Open intake
            </Link>
            <Link prefetch={false} className="secondary-action" href="/refund-policy/">
              <ShieldCheck aria-hidden="true" size={17} />
              Refund policy
            </Link>
          </div>
        </div>
        <aside className="decision-card">
          <strong>Support email</strong>
          <p>{launchProduct.supportEmail}</p>
        </aside>
      </section>
    </main>
  );
}

