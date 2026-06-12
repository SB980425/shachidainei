import { StaticRoutePage, getRouteMetadata } from "@/components/RoutePage";

const path = "/answers/when-to-stop-an-ai-website-idea/";

export const metadata = getRouteMetadata(path);

export default function Page() {
  return <StaticRoutePage path={path} />;
}
