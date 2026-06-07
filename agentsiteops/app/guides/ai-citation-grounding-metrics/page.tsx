import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/ai-citation-grounding-metrics/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
