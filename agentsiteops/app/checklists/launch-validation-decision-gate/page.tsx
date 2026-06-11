import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/checklists/launch-validation-decision-gate/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
