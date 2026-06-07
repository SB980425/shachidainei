import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/checklists/gsc-bing-indexnow-launch/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
