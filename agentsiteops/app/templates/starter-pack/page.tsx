import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/templates/starter-pack/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
