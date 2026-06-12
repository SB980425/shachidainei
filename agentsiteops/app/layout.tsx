import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeDollarSign,
  Bot,
  CheckCircle2,
  FileCheck2,
  Gauge,
  GitBranch,
  GitCompareArrows,
  Mail,
  Newspaper,
  ShieldCheck
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentsiteops.com"),
  title: {
    default: "AgentSiteOps",
    template: "%s | AgentSiteOps"
  },
  description:
    "Turn scattered AI capability into one sellable offer, one landing page structure, and one 7-day validation path.",
  openGraph: {
    title: "AgentSiteOps",
    description:
      "A manual Fit Review and Launch Blueprint for AI-capable solo builders who need one offer, one page, and one first validation path.",
    url: "https://agentsiteops.com/",
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgentSiteOps route selection preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentSiteOps",
    description:
      "Validate one AI service offer before building the site, automation demo, or content system.",
    images: ["/twitter-image.png"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  alternates: {
    canonical: "/"
  }
};

const navItems = [
  { href: "/ai-website-operating-system/", label: "System", Icon: GitBranch },
  { href: "/tools/website-opportunity-scorer/", label: "Scorer", Icon: Gauge },
  { href: "/tools/ai-crawler-readiness/", label: "Crawler", Icon: Bot },
  { href: "/tools/launch-blueprint-fit-checker/", label: "Fit", Icon: CheckCircle2 },
  { href: "/sample/", label: "Sample", Icon: FileCheck2 },
  { href: "/compare/", label: "Compare", Icon: GitCompareArrows },
  { href: "/buy/", label: "Buy", Icon: BadgeDollarSign },
  { href: "/intake/", label: "Intake", Icon: Mail },
  { href: "/updates/", label: "Updates", Icon: Newspaper },
  { href: "/disclaimer/", label: "Limits", Icon: ShieldCheck }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteAnalytics />
        <header className="site-header">
          <Link prefetch={false} className="brand" href="/" aria-label="AgentSiteOps home">
            <BrandLogo />
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link prefetch={false} key={item.href} href={item.href}>
                <item.Icon aria-hidden="true" size={15} strokeWidth={2.2} />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link prefetch={false} className="header-action" href="/pricing/">
            <BadgeDollarSign aria-hidden="true" size={16} />
            Pricing
          </Link>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <BrandLogo compact />
            <p>Launch blueprint service for AI-capable solo builders who need one sellable offer and first validation path.</p>
          </div>
          <div className="footer-links">
            <Link prefetch={false} href="/launch-kit/">Launch Kit</Link>
            <Link prefetch={false} href="/updates/">Updates</Link>
            <Link prefetch={false} href="/pricing/">Pricing</Link>
            <Link prefetch={false} href="/sample/">Sample</Link>
            <Link prefetch={false} href="/compare/">Compare</Link>
            <Link prefetch={false} href="/terms/">Terms</Link>
            <Link prefetch={false} href="/refund-policy/">Refunds</Link>
            <Link prefetch={false} href="/contact/">Contact</Link>
            <Link prefetch={false} href="/tools/ai-crawler-readiness/">Crawler</Link>
            <Link prefetch={false} href="/tools/launch-blueprint-fit-checker/">Fit Checker</Link>
            <Link prefetch={false} href="/templates/starter-pack/">Starter Pack</Link>
            <Link prefetch={false} href="/reports/route-evidence-dashboard/">Evidence</Link>
            <Link prefetch={false} href="/methodology/route-selection/">Route Method</Link>
            <Link prefetch={false} href="/guides/48-hour-exposure-sprint/">48h Sprint</Link>
            <Link prefetch={false} href="/guides/first-traffic-system/">Traffic System</Link>
            <Link prefetch={false} href="/authors/">Authors</Link>
            <Link prefetch={false} href="/editorial-policy/">Editorial</Link>
            <Link prefetch={false} href="/privacy/">Privacy</Link>
            <Link prefetch={false} href="/disclosure/">Disclosure</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
