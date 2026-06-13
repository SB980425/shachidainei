import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/reports/agentsiteops-route-run/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
