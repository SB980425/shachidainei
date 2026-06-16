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
  routeProjectObjects,
  routeProjectStages,
  routeProjectSupportLayer,
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

type RouteProjectLifecycleProps = {
  current: RouteProjectStageId;
  eyebrow?: string;
  title?: string;
  body?: string;
  showObjects?: boolean;
  showSupportLayer?: boolean;
};

export function RouteProjectLifecycle({
  current,
  eyebrow = "Route Project OS",
  title = "One project object moves through every page.",
  body = "The site should not feel like separate explanations. Each page is one state in the same Route Project lifecycle.",
  showObjects = false,
  showSupportLayer = false
}: RouteProjectLifecycleProps) {
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <section className="route-project-system" aria-label="Route Project lifecycle">
      <div className="route-project-system-head">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <p>{body}</p>
      </div>

      <div className="route-project-lifecycle">
        {routeProjectStages.map((stage, index) => {
          const Icon = iconMap[stage.icon];
          const isCurrent = stage.id === current;
          const isPassed = index < safeIndex;
          const isNext = index === safeIndex + 1;
          const canOpen = isPassed || isCurrent || isNext;
          const className = `${isCurrent ? "is-current" : ""} ${isPassed ? "is-passed" : ""} ${!canOpen ? "is-locked" : ""}`;
          const content = (
            <>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" size={18} />
              </div>
              <strong>{stage.label}</strong>
              <p>{stage.title}</p>
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

      <div className="route-project-current-card">
        <div>
          <span>Current state</span>
          <h3>{routeProjectStages[safeIndex].title}</h3>
          <p>{routeProjectStages[safeIndex].body}</p>
        </div>
        <dl>
          <div>
            <dt>Owner</dt>
            <dd>{routeProjectStages[safeIndex].owner}</dd>
          </div>
          <div>
            <dt>Input</dt>
            <dd>{routeProjectStages[safeIndex].input}</dd>
          </div>
          <div>
            <dt>Pass condition</dt>
            <dd>{routeProjectStages[safeIndex].pass}</dd>
          </div>
          <div>
            <dt>Repair rule</dt>
            <dd>{routeProjectStages[safeIndex].repair}</dd>
          </div>
        </dl>
      </div>

      {showObjects ? (
        <div className="route-project-object-grid" aria-label="Route Project object model">
          {routeProjectObjects.map((item) => (
            <article key={item.name}>
              <strong>{item.name}</strong>
              <p>{item.definition}</p>
              <small>{item.owns}</small>
            </article>
          ))}
        </div>
      ) : null}

      {showSupportLayer ? (
        <div className="route-project-support-grid" aria-label="Support layer">
          {routeProjectSupportLayer.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <p>{item.role}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
