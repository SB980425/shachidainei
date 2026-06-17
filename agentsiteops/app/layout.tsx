import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PrimaryNavigation } from "@/components/PrimaryNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteJourneyBar } from "@/components/SiteJourneyBar";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteAnalytics />
        <header className="site-header">
          <Link prefetch={false} className="brand" href="/" aria-label="AgentSiteOps home">
            <BrandLogo />
          </Link>
          <PrimaryNavigation />
          <LanguageToggle />
        </header>
        <SiteJourneyBar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
