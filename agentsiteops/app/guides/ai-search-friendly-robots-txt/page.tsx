import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/ai-search-friendly-robots-txt/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
