import type { Metadata } from "next";
import Link from "next/link";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentsiteops.com"),
  title: {
    default: "AgentSiteOps",
    template: "%s | AgentSiteOps"
  },
  description:
    "Score, structure, launch, and review AI-assisted websites with technical SEO gates, content quality checks, repo templates, and 30-day validation loops.",
  alternates: {
    canonical: "/"
  }
};

const navItems = [
  { href: "/ai-website-operating-system/", label: "System" },
  { href: "/tools/website-opportunity-scorer/", label: "Scorer" },
  { href: "/templates/starter-pack/", label: "Pack" },
  { href: "/templates/seo-repo-skeleton/", label: "Templates" },
  { href: "/checklists/ai-content-quality-gate/", label: "Gates" },
  { href: "/guides/ai-citation-grounding-metrics/", label: "Metrics" },
  { href: "/updates/", label: "Updates" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteAnalytics />
        <header className="site-header">
          <Link className="brand" href="/" aria-label="AgentSiteOps home">
            <span className="brand-mark">AS</span>
            <span>AgentSiteOps</span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="header-action" href="/tools/website-opportunity-scorer/">
            Score an idea
          </Link>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>AgentSiteOps</strong>
            <p>Opportunity scoring, site blueprints, content gates, technical SEO, and review loops for AI-assisted websites.</p>
          </div>
          <div className="footer-links">
            <Link href="/updates/">Updates</Link>
            <Link href="/authors/">Authors</Link>
            <Link href="/editorial-policy/">Editorial</Link>
            <Link href="/privacy/">Privacy</Link>
            <Link href="/disclosure/">Disclosure</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
