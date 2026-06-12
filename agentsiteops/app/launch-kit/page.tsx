import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/launch-kit/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
