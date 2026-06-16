"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge } from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getSiteRouteContext,
  localize,
  mainJourneyStages,
  normalizeSitePath
} from "@/lib/siteArchitecture";

export function PrimaryNavigation() {
  const pathname = normalizeSitePath(usePathname());
  const [language] = usePreferredLanguage();
  const context = getSiteRouteContext(pathname);
  const actionHref = context.primaryHref ?? "/idea-risk-test/";
  const actionLabel = context.primaryLabel
    ? localize(context.primaryLabel, language)
    : language === "zh"
      ? "填写想法"
      : "Paste idea";

  return (
    <>
      <nav className="nav nav-static" aria-label="Main path status">
        {mainJourneyStages.map((item) => {
          const isActive = item.id === context.stage && context.role === "main";

          return (
            <span className={isActive ? "is-active" : undefined} key={item.id}>
              {localize(item.shortLabel, language)}
            </span>
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
