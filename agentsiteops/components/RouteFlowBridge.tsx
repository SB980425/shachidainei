"use client";

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
import { usePreferredLanguage } from "@/components/LanguageToggle";
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
  language
}: RouteFlowBridgeProps) {
  const [preferredLanguage] = usePreferredLanguage();
  const activeLanguage = language ?? preferredLanguage;
  const hasExplicitLanguage = typeof language !== "undefined";
  const routeProjectStages = getLocalizedRouteProjectStages(activeLanguage);
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const defaultNext = routeProjectStages[Math.min(safeIndex + 1, routeProjectStages.length - 1)];
  const matchedNext = nextHref ? routeProjectStages.find((stage) => stage.href === nextHref) : undefined;
  const resolvedNext = nextHref
    ? {
        href: nextHref,
        label:
          activeLanguage === "zh" && !hasExplicitLanguage
            ? matchedNext?.label ?? "继续"
            : nextLabel ?? matchedNext?.label ?? (activeLanguage === "zh" ? "继续" : "Continue")
      }
    : defaultNext;
  const labels =
    activeLanguage === "zh"
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
  const resolvedEyebrow = activeLanguage === "zh" && !hasExplicitLanguage ? labels.eyebrow : eyebrow ?? labels.eyebrow;

  return (
    <section className="route-flow-bridge" aria-label={labels.aria}>
      <div className="route-flow-bridge-head">
        <span>{resolvedEyebrow}</span>
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
