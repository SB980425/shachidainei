import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/checklists/ai-content-quality-gate/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
