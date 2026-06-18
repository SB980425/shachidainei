"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getLocalizedRouteProjectStages,
  type RouteProjectLanguage,
  type RouteProjectStageId
} from "@/lib/routeProjectSystem";

type RouteStageHeaderProps = {
  current: RouteProjectStageId;
  title?: string;
  body?: string;
  language?: RouteProjectLanguage;
};

export function RouteStageHeader({ current, title, body, language }: RouteStageHeaderProps) {
  const [preferredLanguage] = usePreferredLanguage();
  const activeLanguage = language ?? preferredLanguage;
  const hasExplicitLanguage = typeof language !== "undefined";
  const routeProjectStages = getLocalizedRouteProjectStages(activeLanguage);
  const currentIndex = Math.max(
    0,
    routeProjectStages.findIndex((stage) => stage.id === current)
  );
  const currentStage = routeProjectStages[currentIndex];
  const nextStage = routeProjectStages[Math.min(currentIndex + 1, routeProjectStages.length - 1)];
  const labels =
    activeLanguage === "zh"
      ? {
          aria: "当前路线项目阶段",
          rail: "路线项目状态条",
          step: "第",
          of: "步，共",
          next: "下一步"
        }
      : {
          aria: "Current Route Project stage",
          rail: "Route Project state rail",
          step: "Step",
          of: "of",
          next: "Next"
        };
  const resolvedTitle = activeLanguage === "zh" && !hasExplicitLanguage ? currentStage.title : title ?? currentStage.label;
  const resolvedBody = activeLanguage === "zh" && !hasExplicitLanguage ? currentStage.body : body ?? currentStage.body;

  return (
    <section className="route-stage-header" aria-label={labels.aria}>
      <div className="route-stage-copy">
        <span>
          {activeLanguage === "zh"
            ? `${labels.step} ${currentIndex + 1} ${labels.of} ${routeProjectStages.length} 步`
            : `${labels.step} ${currentIndex + 1} ${labels.of} ${routeProjectStages.length}`}
        </span>
        <h2>{resolvedTitle}</h2>
        <p>{resolvedBody}</p>
      </div>
      <div className="route-stage-rail" aria-label={labels.rail}>
        {routeProjectStages.map((stage, index) => {
          const isCurrent = stage.id === current;
          const isPassed = index < currentIndex;
          const isNext = index === currentIndex + 1;
          const canOpen = isPassed || isCurrent || isNext;
          const className = `${isCurrent ? "is-current" : ""} ${isPassed ? "is-passed" : ""} ${!canOpen ? "is-locked" : ""}`;
          const content = (
            <>
              {isPassed ? (
                <CheckCircle2 aria-hidden="true" size={14} />
              ) : (
                <span>{String(index + 1).padStart(2, "0")}</span>
              )}
              <strong>{stage.label}</strong>
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
      <Link prefetch={false} className="route-stage-next" href={nextStage.href}>
        {labels.next}: {nextStage.label}
        <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </section>
  );
}
