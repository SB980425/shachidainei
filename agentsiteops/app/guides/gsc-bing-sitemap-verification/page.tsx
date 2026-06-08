import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/gsc-bing-sitemap-verification/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
