"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, MousePointer2 } from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getSiteRouteContext,
  localize,
  normalizeSitePath
} from "@/lib/siteArchitecture";

const roleLabels = {
  main: { en: "Working path", zh: "工作路径" },
  reference: { en: "Reference", zh: "参考内容" },
  proof: { en: "Output proof", zh: "输出样例" },
  legal: { en: "Policy context", zh: "规则背景" },
  support: { en: "Support", zh: "辅助内容" }
};

export function SiteJourneyBar() {
  const pathname = normalizeSitePath(usePathname());
  const [language] = usePreferredLanguage();
  const context = getSiteRouteContext(pathname);
  const primaryHref = context.primaryHref ?? "/#start-idea";
  const primaryLabel = context.primaryLabel
    ? localize(context.primaryLabel, language)
    : language === "zh"
      ? "回到首页输入"
      : "Return to home input";

  if (pathname === "/") {
    return null;
  }

  return (
    <aside className="site-journey-bar" aria-label="Current site path">
      <div className="journey-status">
        {context.role === "main" ? (
          <MousePointer2 aria-hidden="true" size={16} />
        ) : (
          <BookOpen aria-hidden="true" size={16} />
        )}
        <div>
          <span>{localize(roleLabels[context.role], language)}</span>
          <strong>{localize(context.title, language)}</strong>
          <p>{localize(context.body, language)}</p>
        </div>
      </div>

      <Link prefetch={false} className="journey-next" href={primaryHref}>
        {primaryLabel}
        <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </aside>
  );
}
