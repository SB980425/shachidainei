"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Gauge,
  Workflow
} from "lucide-react";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";

const navItems = [
  {
    href: "/idea-risk-test/",
    label: { en: "Test Idea", zh: "测试想法" },
    Icon: Gauge,
    match: ["/idea-risk-test/"]
  },
  {
    href: "/plan/",
    label: { en: "Plan", zh: "计划" },
    Icon: ClipboardList,
    match: ["/plan/", "/intake/", "/review-status/", "/start/", "/contact/", "/thank-you/"]
  },
  {
    href: "/how-it-works/",
    label: { en: "Method", zh: "方法" },
    Icon: Workflow,
    match: [
      "/execution/",
      "/scope/",
      "/how-it-works/",
      "/delivery-gate/",
      "/templates/route-research-prompt-pack/",
      "/reports/client-route-workflow/"
    ]
  },
  {
    href: "/sample/",
    label: { en: "Examples", zh: "样例" },
    Icon: FileText,
    match: ["/sample/", "/reports/route-basis/", "/methodology/route-selection/"]
  }
];

function labelFor(label: Record<SiteLanguage, string>, language: SiteLanguage) {
  return label[language] ?? label.en;
}

function normalizePath(pathname: string) {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function PrimaryNavigation() {
  const pathname = normalizePath(usePathname());
  const isFreeTest = pathname === "/idea-risk-test/";
  const [language] = usePreferredLanguage();

  return (
    <>
      <nav className="nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = item.match.some((path) => pathname === path);
          const Icon = item.Icon;

          return (
            <Link
              prefetch={false}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
              key={item.href}
              href={item.href}
            >
              <Icon aria-hidden="true" size={15} strokeWidth={2.2} />
              {labelFor(item.label, language)}
            </Link>
          );
        })}
      </nav>
      <Link
        prefetch={false}
        className={isFreeTest ? "header-action is-active" : "header-action"}
        aria-current={isFreeTest ? "page" : undefined}
        href="/idea-risk-test/"
      >
        <Gauge aria-hidden="true" size={16} />
        {language === "zh" ? "免费测试" : "Free test"}
      </Link>
    </>
  );
}
