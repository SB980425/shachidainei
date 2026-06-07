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

console.log(
  JSON.stringify(
    {
      endpoint,
      host: payload.host,
      keyLocation: payload.keyLocation,
      submittedUrlCount: urlList.length,
      status: response.status,
    },
    null,
    2,
  ),
);
