import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  FileText,
  Gauge,
  GitBranch,
  ShieldCheck
} from "lucide-react";
import { RouteCommandCenter } from "@/components/RouteCommandCenter";
import { primaryOffer, starterOffer } from "@/lib/payments";
import { allRoutes, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AgentSiteOps",
  description:
    "AgentSiteOps turns project facts, evidence, risk boundaries, and delivery capacity into one route map, one rejected-path record, and one 7-day execution plan."
};

const foundationCards = [
  {
    title: "Not a random score",
    body: "Scores come from evidence maturity, proof assets, delivery boundary, data rights, hard blockers, and route fit.",
    Icon: Gauge
  },
  {
    title: "Rejected paths stay visible",
    body: "The interface shows why weak routes are pruned before a build, paid offer, or content cluster starts.",
    Icon: GitBranch
  },
  {
    title: "Reusable for our own projects",
    body: "Each future site starts with the same route brief, evidence ledger, first asset, and failure gate.",
    Icon: FileText
  },
  {
    title: "Claims are bounded",
    body: "The system blocks guaranteed traffic, ranking, AI citation, revenue, and unsupported regulated advice.",
    Icon: ShieldCheck
  }
];

const preservedLinks = [
  { href: "/tools/website-opportunity-scorer/", label: "Website opportunity scorer" },
  { href: "/tools/route-confidence-checker/", label: "Route confidence checker" },
  { href: "/tools/launch-blueprint-fit-checker/", label: "Launch blueprint fit checker" },
  { href: "/reports/route-basis/", label: "Route basis report" },
  { href: "/methodology/route-selection/", label: "Route selection methodology" },
  { href: "/sample/", label: "Sample route file" }
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgentSiteOps",
    description:
      "A route selection and launch blueprint system for choosing one project path before building websites, tools, or content systems.",
    inLanguage: "en",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    offers: [
      {
        "@type": "Offer",
        name: "Fit Review",
        price: starterOffer.price,
        priceCurrency: "USD"
      },
      {
        "@type": "Offer",
        name: "Launch Blueprint",
        price: primaryOffer.price,
        priceCurrency: "USD"
      }
    ]
  };

  return (
    <main className="page-main route-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RouteCommandCenter />

      <section className="route-foundation-section">
        <div className="route-section-heading">
          <span>System foundation</span>
          <h2>How AgentSiteOps becomes our route planner.</h2>
          <p>
            The product is useful only if it can guide our own projects first. The
            homepage now exposes the same route logic we will use before creating a new
            site, tool, content cluster, or paid offer.
          </p>
        </div>

        <div className="route-foundation-grid">
          {foundationCards.map((item) => {
            const Icon = item.Icon;

            return (
              <article key={item.title}>
                <Icon aria-hidden="true" size={22} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="route-preserved-section">
        <div>
          <span>Existing functions preserved</span>
          <h2>The redesign keeps the current tool surface alive.</h2>
          <p>
            The new command center is a front door. The existing scorer, checker, sample,
            methodology pages, payment path, sitemap, and report routes remain available
            and indexable.
          </p>
          <dl>
            <div>
              <dt>Indexed support routes</dt>
              <dd>{allRoutes.length}</dd>
            </div>
            <div>
              <dt>Starter review</dt>
              <dd>USD {starterOffer.price}</dd>
            </div>
            <div>
              <dt>Blueprint path</dt>
              <dd>USD {primaryOffer.price}</dd>
            </div>
          </dl>
        </div>

        <div className="route-link-board">
          {preservedLinks.map((item) => (
            <Link prefetch={false} href={item.href} key={item.href}>
              <CheckCircle2 aria-hidden="true" size={16} />
              {item.label}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          ))}
        </div>
      </section>

      <section className="route-final-cta">
        <div>
          <span>Next operating rule</span>
          <h2>Every new project starts with a route map before a build.</h2>
          <p>
            If the selected route cannot name evidence, first asset, rejected alternatives,
            and a stop rule, the project stays in research instead of entering production.
          </p>
        </div>
        <div className="route-final-actions">
          <Link prefetch={false} className="primary-action" href="/tools/website-opportunity-scorer/">
            <Gauge aria-hidden="true" size={17} />
            Score a direction
          </Link>
          <Link prefetch={false} className="secondary-action" href="/pricing/">
            <BadgeDollarSign aria-hidden="true" size={17} />
            View pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
