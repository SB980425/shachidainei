import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/examples/agentsiteops-self-audit/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
