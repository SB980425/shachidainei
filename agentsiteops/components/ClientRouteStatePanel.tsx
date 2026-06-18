"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Eye,
  MonitorCheck,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getLocalizedRouteProjectClientState,
  getLocalizedRouteProjectStage,
  getLocalizedRouteProjectStages,
  type RouteProjectLanguage,
  type RouteProjectStageId
} from "@/lib/routeProjectSystem";

type ClientRouteStatePanelProps = {
  current: RouteProjectStageId;
  title?: string;
  body?: string;
  compact?: boolean;
  language?: RouteProjectLanguage;
};

function getNextStage(current: RouteProjectStageId, language: RouteProjectLanguage) {
  const routeProjectStages = getLocalizedRouteProjectStages(language);
  const currentIndex = routeProjectStages.findIndex((stage) => stage.id === current);

  if (currentIndex < 0) {
    return routeProjectStages[1];
  }

  return routeProjectStages[Math.min(currentIndex + 1, routeProjectStages.length - 1)];
}

export function ClientRouteStatePanel({
  current,
  title,
  body,
  compact = false,
  language
}: ClientRouteStatePanelProps) {
  const [preferredLanguage] = usePreferredLanguage();
  const activeLanguage = language ?? preferredLanguage;
  const hasExplicitLanguage = typeof language !== "undefined";
  const stage = getLocalizedRouteProjectStage(current, activeLanguage);
  const state = getLocalizedRouteProjectClientState(current, activeLanguage);
  const nextStage = getNextStage(current, activeLanguage);
  const labels =
    activeLanguage === "zh"
      ? {
          heading: "客户能从这个页面看懂什么。",
          body:
            "每个阶段都要把网站自动处理和人工判断分开，并告诉客户下一个可见结果是什么。",
          clientState: "客户状态",
          now: "现在",
          stopOrRepair: "何时停止或修复",
          currentStage: "当前阶段",
          reviewValidation: "查看验证",
          nextRecommended: "下一步建议",
          cards: {
            customer: "你的动作",
            website: "网站处理",
            manual: "人工审核",
            result: "可见结果"
          }
        }
      : {
          heading: "What the customer can tell from this page.",
          body:
            "Each stage should separate automatic website behavior from manual judgment, then show the next visible result.",
          clientState: "Client state",
          now: "Now",
          stopOrRepair: "Stop or repair when",
          currentStage: "Current stage",
          reviewValidation: "Review validation",
          nextRecommended: "Next recommended",
          cards: {
            customer: "Your action",
            website: "Website handles",
            manual: "Manual review",
            result: "Visible result"
          }
        };
  const resolvedTitle = activeLanguage === "zh" && !hasExplicitLanguage ? labels.heading : title ?? labels.heading;
  const resolvedBody = activeLanguage === "zh" && !hasExplicitLanguage ? labels.body : body ?? labels.body;

  const cards = [
    {
      label: labels.cards.customer,
      text: state.customerAction,
      Icon: ClipboardList
    },
    {
      label: labels.cards.website,
      text: state.websiteAction,
      Icon: MonitorCheck
    },
    {
      label: labels.cards.manual,
      text: state.manualAction,
      Icon: UserCheck
    },
    {
      label: labels.cards.result,
      text: state.nextVisibleResult,
      Icon: Eye
    }
  ];

  return (
    <section className={compact ? "client-state-panel is-compact" : "client-state-panel"}>
      <div className="client-state-head">
        <div>
          <span>{labels.clientState}</span>
          <h2>{resolvedTitle}</h2>
        </div>
        <p>{resolvedBody}</p>
      </div>

      <div className="client-state-current" aria-label="Current client state">
        <div>
          <span>{labels.now}</span>
          <h3>{stage.label}</h3>
          <p>{stage.title}</p>
        </div>
        <div>
          <span>{labels.stopOrRepair}</span>
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
          {labels.currentStage}
        </Link>
        <Link
          prefetch={false}
          className="primary-action"
          href={nextStage.href}
          data-analytics-event="client_state_next_click"
          data-analytics-label={`${stage.id}_to_${nextStage.id}`}
          data-analytics-type="route_project"
        >
          {nextStage.id === stage.id
            ? labels.reviewValidation
            : `${labels.nextRecommended}: ${nextStage.label}`}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </section>
  );
}
