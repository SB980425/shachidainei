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
  routeProjectObjects,
  routeProjectSupportLayer,
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

type RouteProjectLifecycleProps = {
  current: RouteProjectStageId;
  eyebrow?: string;
  title?: string;
  body?: string;
  showObjects?: boolean;
  showSupportLayer?: boolean;
  language?: RouteProjectLanguage;
};

export function RouteProjectLifecycle({
  current,
  eyebrow,
  title,
  body,
  showObjects = false,
  showSupportLayer = false,
  language = "en"
}: RouteProjectLifecycleProps) {
  const routeProjectStages = getLocalizedRouteProjectStages(language);
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const labels =
    language === "zh"
      ? {
          aria: "路线项目生命周期",
          defaultEyebrow: "路线项目系统",
          defaultTitle: "同一个项目对象穿过每个页面。",
          defaultBody: "网站不应像一组分散说明。每个页面都是同一个路线项目生命周期中的一个状态。",
          currentState: "当前状态",
          owner: "负责人",
          input: "输入",
          passCondition: "通过条件",
          repairRule: "修复规则",
          objectModel: "路线项目对象模型",
          supportLayer: "辅助层"
        }
      : {
          aria: "Route Project lifecycle",
          defaultEyebrow: "Route Project OS",
          defaultTitle: "One project object moves through every page.",
          defaultBody:
            "The site should not feel like separate explanations. Each page is one state in the same Route Project lifecycle.",
          currentState: "Current state",
          owner: "Owner",
          input: "Input",
          passCondition: "Pass condition",
          repairRule: "Repair rule",
          objectModel: "Route Project object model",
          supportLayer: "Support layer"
        };

  return (
    <section className="route-project-system" aria-label={labels.aria}>
      <div className="route-project-system-head">
        <div>
          <span>{eyebrow ?? labels.defaultEyebrow}</span>
          <h2>{title ?? labels.defaultTitle}</h2>
        </div>
        <p>{body ?? labels.defaultBody}</p>
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
          <span>{labels.currentState}</span>
          <h3>{routeProjectStages[safeIndex].title}</h3>
          <p>{routeProjectStages[safeIndex].body}</p>
        </div>
        <dl>
          <div>
            <dt>{labels.owner}</dt>
            <dd>{routeProjectStages[safeIndex].owner}</dd>
          </div>
          <div>
            <dt>{labels.input}</dt>
            <dd>{routeProjectStages[safeIndex].input}</dd>
          </div>
          <div>
            <dt>{labels.passCondition}</dt>
            <dd>{routeProjectStages[safeIndex].pass}</dd>
          </div>
          <div>
            <dt>{labels.repairRule}</dt>
            <dd>{routeProjectStages[safeIndex].repair}</dd>
          </div>
        </dl>
      </div>

      {showObjects ? (
        <div className="route-project-object-grid" aria-label={labels.objectModel}>
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
        <div className="route-project-support-grid" aria-label={labels.supportLayer}>
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
