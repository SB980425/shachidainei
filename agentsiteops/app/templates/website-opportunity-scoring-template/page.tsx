import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/templates/website-opportunity-scoring-template/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
