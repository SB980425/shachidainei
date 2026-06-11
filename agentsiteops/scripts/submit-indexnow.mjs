import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(rootDir, "reports", "indexnow-submit.md");
const csvPath = resolve(rootDir, "data", "indexnow-submit-snapshot.csv");
const siteOrigin = process.env.SITE_ORIGIN || "https://agentsiteops.com";
const indexNowKey = "32bc6ba6e277f850a701747381a57c48";
const endpoint = "https://www.bing.com/indexnow";

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const sitemapUrl = new URL("/sitemap.xml", siteOrigin).toString();
const sitemapResponse = await fetch(sitemapUrl);

if (!sitemapResponse.ok) {
  throw new Error(`Failed to fetch sitemap: ${sitemapResponse.status}`);
}

const sitemapXml = await sitemapResponse.text();
const urlList = extractLocs(sitemapXml).filter((url) => {
  try {
    return new URL(url).host === new URL(siteOrigin).host;
  } catch {
    return false;
  }
});

if (urlList.length === 0) {
  throw new Error("No same-host URLs found in sitemap");
}

const payload = {
  host: new URL(siteOrigin).host,
  key: indexNowKey,
  keyLocation: new URL(`/${indexNowKey}.txt`, siteOrigin).toString(),
  urlList,
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed: ${response.status} ${body}`);
}

const generatedAt = new Date().toISOString();
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(
  reportPath,
  [
    "# IndexNow Submission",
    "",
    `- Generated: ${generatedAt}`,
    `- Endpoint: ${endpoint}`,
    `- Host: ${payload.host}`,
    `- Key location: ${payload.keyLocation}`,
    `- Submitted URL count: ${urlList.length}`,
    `- Status: ${response.status}`,
    "",
    "## Submitted URLs",
    "",
    ...urlList.map((url) => `- ${url}`),
    "",
    "## Interpretation",
    "",
    "- This proves notification delivery to the IndexNow endpoint.",
    "- It does not prove crawling, indexing, ranking, traffic, citation, conversion, or revenue."
  ].join("\n") + "\n"
);

writeFileSync(
  csvPath,
  [
    "generated_at,endpoint,host,status,url",
    ...urlList.map((url) =>
      [generatedAt, endpoint, payload.host, response.status, url]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
  ].join("\n") + "\n"
);

console.log(
  JSON.stringify(
    {
      endpoint,
      host: payload.host,
      keyLocation: payload.keyLocation,
      submittedUrlCount: urlList.length,
      status: response.status,
      reportPath,
      csvPath
    },
    null,
    2,
  ),
);
