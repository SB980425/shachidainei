import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/templates/evidence-ledger-template/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
