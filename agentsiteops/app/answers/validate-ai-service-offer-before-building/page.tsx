import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/answers/validate-ai-service-offer-before-building/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
