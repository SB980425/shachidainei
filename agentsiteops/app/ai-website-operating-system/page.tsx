import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/ai-website-operating-system/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
