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
import {
  getLocalizedRouteProjectStages,
  type RouteProjectLanguage,
  type RouteProjectStageId
} from "@/lib/routeProjectSystem";

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
  language?: RouteProjectLanguage;
};

export function RouteFlowBridge({
  current,
  eyebrow,
  nextHref,
  nextLabel,
  language = "en"
}: RouteFlowBridgeProps) {
  const routeProjectStages = getLocalizedRouteProjectStages(language);
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const resolvedNext = nextHref
    ? { href: nextHref, label: nextLabel ?? (language === "zh" ? "继续" : "Continue") }
    : routeProjectStages[Math.min(safeIndex + 1, routeProjectStages.length - 1)];
  const labels =
    language === "zh"
      ? {
          aria: "AgentSiteOps 路线流程",
          eyebrow: "路线生成路径",
          stage: "阶段"
        }
      : {
          aria: "AgentSiteOps route flow",
          eyebrow: "Route Foundry path",
          stage: "Stage"
        };

  return (
    <section className="route-flow-bridge" aria-label={labels.aria}>
      <div className="route-flow-bridge-head">
        <span>{eyebrow ?? labels.eyebrow}</span>
        <strong>
          {labels.stage} {safeIndex + 1} / {routeProjectStages.length}: {routeProjectStages[safeIndex].label}
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
          const isNext = index === safeIndex + 1;
          const canOpen = isPassed || isCurrent || isNext;
          const className = `${isCurrent ? "is-current" : ""} ${isPassed ? "is-passed" : ""} ${!canOpen ? "is-locked" : ""}`;
          const content = (
            <>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" size={17} />
              <strong>{stage.label}</strong>
              <small>{stage.output}</small>
            </>
          );

          return canOpen ? (
            <Link
              prefetch={false}
              className={className}
              href={stage.href}
              key={stage.id}
            >
              {content}
            </Link>
          ) : (
            <span className={className} aria-disabled="true" key={stage.id}>
              {content}
            </span>
          );
        })}
      </div>
    </section>
  );
}
