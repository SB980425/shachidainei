import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/evidence/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
