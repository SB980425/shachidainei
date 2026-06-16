import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  routeProjectStages,
  type RouteProjectStageId
} from "@/lib/routeProjectSystem";

type RouteStageHeaderProps = {
  current: RouteProjectStageId;
  title?: string;
  body?: string;
};

export function RouteStageHeader({ current, title, body }: RouteStageHeaderProps) {
  const currentIndex = Math.max(
    0,
    routeProjectStages.findIndex((stage) => stage.id === current)
  );
  const currentStage = routeProjectStages[currentIndex];
  const nextStage = routeProjectStages[Math.min(currentIndex + 1, routeProjectStages.length - 1)];

  return (
    <section className="route-stage-header" aria-label="Current Route Project stage">
      <div className="route-stage-copy">
        <span>Step {currentIndex + 1} of {routeProjectStages.length}</span>
        <h2>{title ?? currentStage.label}</h2>
        <p>{body ?? currentStage.body}</p>
      </div>
      <div className="route-stage-rail" aria-label="Route Project state rail">
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
        Next: {nextStage.label}
        <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </section>
  );
}
