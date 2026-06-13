import type { Metadata, Viewport } from "next";
import Link from "next/link";
import {
  BadgeDollarSign,
  ClipboardList,
  FileCheck2,
  FileText,
  GitBranch,
  Newspaper
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentsiteops.com"),
  applicationName: "AgentSiteOps",
  manifest: "/manifest.webmanifest",
  title: {
    default: "AgentSiteOps",
    template: "%s | AgentSiteOps"
  },
  description:
    "Turn messy project material into one checked Route File before building more pages, tools, checkout, or content systems.",
  openGraph: {
    title: "AgentSiteOps",
    description:
      "A Research-to-Route File service for unclear projects that need one selected route, rejected alternatives, evidence ledger, validation channel, and stop rule.",
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
      "Turn messy project input into a checked Route File before build expansion.",
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

export const viewport: Viewport = {
  themeColor: "#11170f",
  colorScheme: "light"
};

const navItems = [
  { href: "/start/", label: "Start", Icon: ClipboardList },
  { href: "/how-it-works/", label: "How it works", Icon: GitBranch },
  { href: "/sample/", label: "Sample", Icon: FileText },
  { href: "/checklists/route-file-delivery-gate/", label: "Delivery", Icon: FileCheck2 },
  { href: "/updates/", label: "Updates", Icon: Newspaper }
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
            <p>Research-to-Route File service for messy projects that need one selected route before build expansion.</p>
          </div>
          <div className="footer-links">
            <Link prefetch={false} href="/start/">Start</Link>
            <Link prefetch={false} href="/how-it-works/">How it works</Link>
            <Link prefetch={false} href="/launch-kit/">Launch Kit</Link>
            <Link prefetch={false} href="/methodology/route-selection/">Method</Link>
            <Link prefetch={false} href="/templates/route-research-prompt-pack/">Research</Link>
            <Link prefetch={false} href="/checklists/route-file-delivery-gate/">Delivery Gate</Link>
            <Link prefetch={false} href="/reports/route-basis/">Route Basis</Link>
            <Link prefetch={false} href="/updates/">Updates</Link>
            <Link prefetch={false} href="/pricing/">Pricing</Link>
            <Link prefetch={false} href="/sample/">Sample</Link>
            <Link prefetch={false} href="/terms/">Terms</Link>
            <Link prefetch={false} href="/refund-policy/">Refunds</Link>
            <Link prefetch={false} href="/contact/">Contact</Link>
            <Link prefetch={false} href="/reports/route-evidence-dashboard/">Evidence</Link>
            <Link prefetch={false} href="/authors/">Authors</Link>
            <Link prefetch={false} href="/privacy/">Privacy</Link>
            <Link prefetch={false} href="/disclosure/">Disclosure</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
