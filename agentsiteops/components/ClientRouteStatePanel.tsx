import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Eye,
  MonitorCheck,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import {
  getRouteProjectClientState,
  getRouteProjectStage,
  routeProjectStages,
  type RouteProjectStageId
} from "@/lib/routeProjectSystem";

type ClientRouteStatePanelProps = {
  current: RouteProjectStageId;
  title?: string;
  body?: string;
  compact?: boolean;
};

function getNextStage(current: RouteProjectStageId) {
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);

  if (currentIndex < 0) {
    return routeProjectStages[1];
  }

  return routeProjectStages[Math.min(currentIndex + 1, routeProjectStages.length - 1)];
}

export function ClientRouteStatePanel({
  current,
  title = "What the customer can tell from this page.",
  body = "Each stage should separate automatic website behavior from manual judgment, then show the next visible result.",
  compact = false
}: ClientRouteStatePanelProps) {
  const stage = getRouteProjectStage(current);
  const state = getRouteProjectClientState(current);
  const nextStage = getNextStage(current);

  const cards = [
    {
      label: "Your action",
      text: state.customerAction,
      Icon: ClipboardList
    },
    {
      label: "Website handles",
      text: state.websiteAction,
      Icon: MonitorCheck
    },
    {
      label: "Manual review",
      text: state.manualAction,
      Icon: UserCheck
    },
    {
      label: "Visible result",
      text: state.nextVisibleResult,
      Icon: Eye
    }
  ];

  return (
    <section className={compact ? "client-state-panel is-compact" : "client-state-panel"}>
      <div className="client-state-head">
        <div>
          <span>Client state</span>
          <h2>{title}</h2>
        </div>
        <p>{body}</p>
      </div>

      <div className="client-state-current" aria-label="Current client state">
        <div>
          <span>Now</span>
          <h3>{stage.label}</h3>
          <p>{stage.title}</p>
        </div>
        <div>
          <span>Stop or repair when</span>
          <p>
            <ShieldAlert aria-hidden="true" size={17} />
            {state.stopOrRepair}
          </p>
        </div>
      </div>

      <div className="client-state-grid">
        {cards.map((card) => {
          const Icon = card.Icon;

          return (
            <article key={card.label}>
              <Icon aria-hidden="true" size={18} />
              <strong>{card.label}</strong>
              <p>{card.text}</p>
            </article>
          );
        })}
      </div>

      <div className="client-state-actions">
        <Link
          prefetch={false}
          className="secondary-action"
          href={stage.href}
          data-analytics-event="client_state_current_click"
          data-analytics-label={stage.id}
          data-analytics-type="route_project"
        >
          Open current state
        </Link>
        <Link
          prefetch={false}
          className="primary-action"
          href={nextStage.href}
          data-analytics-event="client_state_next_click"
          data-analytics-label={`${stage.id}_to_${nextStage.id}`}
          data-analytics-type="route_project"
        >
          {nextStage.id === stage.id ? "Review validation" : `Next: ${nextStage.label}`}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </section>
  );
}
