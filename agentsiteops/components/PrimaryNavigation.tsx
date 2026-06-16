"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  Send,
  type LucideIcon
} from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getNextMainStage,
  getSiteRouteContext,
  localize,
  mainJourneyStages,
  normalizeSitePath,
  type MainJourneyStageId
} from "@/lib/siteArchitecture";

const iconMap: Record<MainJourneyStageId, LucideIcon> = {
  output: FileText,
  plan: ClipboardList,
  status: FileCheck2,
  submit: Send,
  test: Gauge
};

export function PrimaryNavigation() {
  const pathname = normalizeSitePath(usePathname());
  const [language] = usePreferredLanguage();
  const context = getSiteRouteContext(pathname);
  const nextStage = getNextMainStage(context.stage);
  const actionHref = context.primaryHref ?? nextStage.href;
  const actionLabel = context.primaryLabel
    ? localize(context.primaryLabel, language)
    : `${language === "zh" ? "下一步" : "Next"}: ${localize(nextStage.shortLabel, language)}`;

  return (
    <>
      <nav className="nav" aria-label="Primary product path">
        {mainJourneyStages.map((item) => {
          const isActive = item.id === context.stage && context.role === "main";
          const Icon = iconMap[item.id];

          return (
            <Link
              prefetch={false}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
              key={item.href}
              href={item.href}
            >
              <Icon aria-hidden="true" size={15} strokeWidth={2.2} />
              {localize(item.shortLabel, language)}
            </Link>
          );
        })}
      </nav>
      <Link
        prefetch={false}
        className="header-action"
        href={actionHref}
        data-analytics-event="header_next_action"
        data-analytics-label={actionHref}
        data-analytics-type="site_navigation"
      >
        <Gauge aria-hidden="true" size={16} />
        {actionLabel}
      </Link>
    </>
  );
}
