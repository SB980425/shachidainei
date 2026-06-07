import type { Metadata } from "next";
import { TrustPolicyPage } from "@/components/TrustPolicyPage";
import { siteUrl } from "@/lib/site";
import { getTrustPage } from "@/lib/trustPages";

const path = "/authors/";
const page = getTrustPage(path);

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: path },
  openGraph: {
    title: page.title,
    description: page.description,
    url: `${siteUrl}${path}`,
    siteName: "AgentSiteOps",
    locale: "en_US",
    type: "profile"
  }
};

export default function Page() {
  return <TrustPolicyPage page={page} />;
}
