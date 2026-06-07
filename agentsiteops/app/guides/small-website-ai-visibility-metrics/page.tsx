import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/small-website-ai-visibility-metrics/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
