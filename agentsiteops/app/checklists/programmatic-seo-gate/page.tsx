import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/checklists/programmatic-seo-gate/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
