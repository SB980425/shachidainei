"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileCheck2,
  FileText,
  Workflow
} from "lucide-react";

const navItems = [
  {
    href: "/plan/",
    label: "Plan",
    Icon: ClipboardList,
    match: ["/plan/"]
  },
  {
    href: "/intake/",
    label: "Intake",
    Icon: FileCheck2,
    match: ["/intake/", "/start/", "/contact/", "/thank-you/"]
  },
  {
    href: "/execution/",
    label: "Workbench",
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
    label: "Sample",
    Icon: FileText,
    match: ["/sample/", "/reports/route-basis/", "/methodology/route-selection/"]
  }
];

function normalizePath(pathname: string) {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function PrimaryNavigation() {
  const pathname = normalizePath(usePathname());
  const isPlanStudio = pathname === "/plan/";

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
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link
        prefetch={false}
        className={isPlanStudio ? "header-action is-active" : "header-action"}
        aria-current={isPlanStudio ? "page" : undefined}
        href="/plan/"
      >
        <ClipboardList aria-hidden="true" size={16} />
        Start plan
      </Link>
    </>
  );
}
