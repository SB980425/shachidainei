import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/templates/seo-repo-skeleton/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
