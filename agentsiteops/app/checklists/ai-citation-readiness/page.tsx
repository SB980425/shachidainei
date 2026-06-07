import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/checklists/ai-citation-readiness/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
