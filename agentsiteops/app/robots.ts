import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot"
        ],
        allow: "/"
      },
      {
        userAgent: ["GPTBot", "ClaudeBot"],
        disallow: "/"
      },
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
