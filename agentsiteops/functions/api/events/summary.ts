const kvPrefix = "analytics:v1:daily";
const sampleViewEvents = new Set([
  "launch_blueprint_sample_view",
  "sample_audit_view",
  "fit_review_sample_view"
]);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8"
    },
    status
  });
}

function addCount(target: Record<string, number>, key: string, count: number) {
  target[key] = (target[key] ?? 0) + count;
}

function recentDates(days: number) {
  const dates = new Set<string>();
  const now = Date.now();

  for (let offset = 0; offset < days; offset += 1) {
    dates.add(new Date(now - offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  }

  return dates;
}

export async function onRequestGet(context: {
  env: { AGENTSITEOPS_ANALYTICS?: KVNamespace };
  request: Request;
}) {
  const kv = context.env.AGENTSITEOPS_ANALYTICS;

  if (!kv) {
    return jsonResponse({ error: "analytics namespace is not configured" }, 503);
  }

  const url = new URL(context.request.url);
  const requestedDays = Number(url.searchParams.get("days") ?? "2");
  const days = Number.isFinite(requestedDays)
    ? Math.max(1, Math.min(30, Math.floor(requestedDays)))
    : 2;
  const dates = recentDates(days);
  const countsByEvent: Record<string, number> = {};
  const countsByPath: Record<string, number> = {};
  const countsByDay: Record<string, number> = {};
  const countsByEventPath: Record<string, number> = {};

  let cursor: string | undefined;

  do {
    const listed = await kv.list({ cursor, limit: 1000, prefix: `${kvPrefix}:` });
    cursor = listed.list_complete ? undefined : listed.cursor;

    for (const key of listed.keys) {
      const parts = key.name.split(":");
      const date = parts[3];
      const kind = parts[4];

      if (!dates.has(date)) {
        continue;
      }

      const value = Number(await kv.get(key.name));
      const count = Number.isFinite(value) ? value : 0;

      if (kind === "event") {
        addCount(countsByEvent, parts[5] ?? "unknown", count);
      }

      if (kind === "total") {
        addCount(countsByDay, date, count);
      }

      if (kind === "path") {
        addCount(countsByPath, parts.slice(5).join(":") || "/", count);
      }

      if (kind === "event_path") {
        addCount(countsByEventPath, parts.slice(5).join(":") || "unknown:/", count);
      }
    }
  } while (cursor);

  const sampleViewCount = [...sampleViewEvents].reduce(
    (sum, eventName) => sum + (countsByEvent[eventName] ?? 0),
    0
  );

  return jsonResponse({
    generated_at: new Date().toISOString(),
    days,
    privacy_boundary:
      "Aggregate event counters only. No IP address, user agent, cookie id, account id, email, phone, raw form text, full external URL, or payment data is returned.",
    counts_by_event: countsByEvent,
    counts_by_path: countsByPath,
    counts_by_day: countsByDay,
    counts_by_event_path: countsByEventPath,
    threshold_snapshot: {
      paypal_click_count: countsByEvent.payment_cta_click ?? 0,
      sample_view_count: sampleViewCount,
      source_link_click_count: countsByEvent.source_link_click ?? 0
    }
  });
}
