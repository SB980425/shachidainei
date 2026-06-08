import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/services/ai-website-opportunity-audit/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
