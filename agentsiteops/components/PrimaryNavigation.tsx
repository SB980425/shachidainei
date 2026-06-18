"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge } from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getSiteRouteContext,
  localize,
  normalizeSitePath
} from "@/lib/siteArchitecture";

export function PrimaryNavigation() {
  const pathname = normalizeSitePath(usePathname());
  const [language] = usePreferredLanguage();
  const context = getSiteRouteContext(pathname);
  const actionHref = context.primaryHref ?? "/#start-idea";
  const actionLabel = context.primaryLabel
    ? localize(context.primaryLabel, language)
    : language === "zh"
      ? "填写一个想法"
      : "Write one idea";
  const pathSummary =
    language === "zh"
      ? "首页输入 -> 第一轮判断 -> 编辑计划 -> 审核输出"
      : "Home input -> first diagnosis -> editable plan -> reviewed output";

  return (
    <>
      <nav className="nav nav-static" aria-label="Main path status">
        <span className="is-active">{pathSummary}</span>
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
