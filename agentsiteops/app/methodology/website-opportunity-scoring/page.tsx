import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/methodology/website-opportunity-scoring/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
