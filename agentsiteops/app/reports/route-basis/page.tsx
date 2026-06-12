import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/reports/route-basis/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
