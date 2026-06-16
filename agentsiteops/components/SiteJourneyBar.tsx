"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Circle, MousePointer2 } from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";
import {
  getSiteRouteContext,
  localize,
  mainJourneyStages,
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
  const currentIndex = mainJourneyStages.findIndex((item) => item.id === context.stage);
  const primaryHref = context.primaryHref ?? "/idea-risk-test/";
  const primaryLabel = context.primaryLabel
    ? localize(context.primaryLabel, language)
    : language === "zh"
      ? "填写想法"
      : "Paste idea";

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

      <div className="journey-steps" aria-label="Main product path">
        {mainJourneyStages.map((stage, index) => {
          const isCurrent = stage.id === context.stage;
          const isVisited = currentIndex > index;

          return (
            <span className={isCurrent ? "is-current" : isVisited ? "is-visited" : undefined} key={stage.id}>
              {isVisited ? (
                <CheckCircle2 aria-hidden="true" size={15} />
              ) : (
                <Circle aria-hidden="true" size={13} />
              )}
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{localize(stage.shortLabel, language)}</strong>
            </span>
          );
        })}
      </div>

      <Link prefetch={false} className="journey-next" href={primaryHref}>
        {primaryLabel}
        <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </aside>
  );
}
