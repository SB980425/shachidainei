import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/first-traffic-system/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
