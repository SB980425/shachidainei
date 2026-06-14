"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  GitBranch,
  Newspaper,
  SearchCheck,
  Workflow
} from "lucide-react";

const navItems = [
  { href: "/start/", label: "Start", Icon: Workflow, match: ["/start/", "/intake/"] },
  { href: "/how-it-works/", label: "Method", Icon: GitBranch, match: ["/how-it-works/", "/delivery-gate/"] },
  {
    href: "/templates/route-research-prompt-pack/",
    label: "Research",
    Icon: SearchCheck,
    match: ["/templates/route-research-prompt-pack/", "/reports/route-basis/", "/methodology/route-selection/"]
  },
  { href: "/sample/", label: "Sample", Icon: FileText, match: ["/sample/", "/reports/client-route-workflow/"] },
  { href: "/updates/", label: "Updates", Icon: Newspaper, match: ["/updates/"] }
];

function normalizePath(pathname: string) {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function PrimaryNavigation() {
  const pathname = normalizePath(usePathname());
  const isWorkbench = pathname === "/execution/";

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
        className={isWorkbench ? "header-action is-active" : "header-action"}
        aria-current={isWorkbench ? "page" : undefined}
        href="/execution/"
      >
        <Activity aria-hidden="true" size={16} />
        Workbench
      </Link>
    </>
  );
}
