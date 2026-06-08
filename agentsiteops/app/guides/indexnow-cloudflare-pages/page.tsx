import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/indexnow-cloudflare-pages/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
