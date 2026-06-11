import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/methodology/route-selection/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
