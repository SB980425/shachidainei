import Link from "next/link";
import {
  Activity,
  ClipboardList,
  FileCheck2,
  FileText,
  LockKeyhole,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { routeProjectStages, type RouteProjectStageId } from "@/lib/routeProjectSystem";

const iconMap = {
  activity: Activity,
  clipboard: ClipboardList,
  fileCheck: FileCheck2,
  fileText: FileText,
  lock: LockKeyhole,
  search: SearchCheck,
  shield: ShieldCheck
};

type RouteFlowBridgeProps = {
  current: RouteProjectStageId;
  eyebrow?: string;
  nextHref?: string;
  nextLabel?: string;
};

export function RouteFlowBridge({
  current,
  eyebrow = "Route Foundry path",
  nextHref,
  nextLabel
}: RouteFlowBridgeProps) {
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const resolvedNext = nextHref
    ? { href: nextHref, label: nextLabel ?? "Continue" }
    : routeProjectStages[Math.min(safeIndex + 1, routeProjectStages.length - 1)];

  return (
    <section className="route-flow-bridge" aria-label="AgentSiteOps route flow">
      <div className="route-flow-bridge-head">
        <span>{eyebrow}</span>
        <strong>
          Stage {safeIndex + 1} / {routeProjectStages.length}: {routeProjectStages[safeIndex].label}
        </strong>
        <Link prefetch={false} href={resolvedNext.href}>
          {resolvedNext.label}
        </Link>
      </div>
      <div className="route-flow-bridge-track">
        {routeProjectStages.map((stage, index) => {
          const Icon = iconMap[stage.icon];
          const isCurrent = stage.id === current;
          const isPassed = index < safeIndex;

          return (
            <Link
              prefetch={false}
              className={`${isCurrent ? "is-current" : ""} ${isPassed ? "is-passed" : ""}`}
              href={stage.href}
              key={stage.id}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" size={17} />
              <strong>{stage.label}</strong>
              <small>{stage.output}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
