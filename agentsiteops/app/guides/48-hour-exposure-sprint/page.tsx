import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/guides/48-hour-exposure-sprint/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
