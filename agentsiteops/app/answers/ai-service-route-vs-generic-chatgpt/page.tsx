import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/answers/ai-service-route-vs-generic-chatgpt/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
