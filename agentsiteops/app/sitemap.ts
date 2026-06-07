import type { MetadataRoute } from "next";
import { allRoutes, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: "2026-06-07",
    changeFrequency: route === "/" || route === "/updates/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/updates/" ? 0.7 : 0.8
  }));
}
