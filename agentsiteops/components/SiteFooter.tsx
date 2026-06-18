"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";

const footerCopy = {
  en: {
    description:
      "Turn one rough project idea into a reviewable route file before building more.",
    links: [
      ["Start", "/#start-idea"],
      ["Plan", "/plan/"],
      ["Review", "/review-status/"],
      ["Route File", "/sample/"],
      ["Evidence library", "/evidence/"],
      ["Terms", "/terms/"],
      ["Privacy", "/privacy/"]
    ]
  },
  zh: {
    description: "把一个粗略项目想法整理成可审查的路线文件，再决定是否继续建设。",
    links: [
      ["开始", "/#start-idea"],
      ["计划", "/plan/"],
      ["审核", "/review-status/"],
      ["路线文件", "/sample/"],
      ["证据库", "/evidence/"],
      ["条款", "/terms/"],
      ["隐私", "/privacy/"]
    ]
  }
} satisfies Record<SiteLanguage, { description: string; links: Array<[string, string]> }>;

export function SiteFooter() {
  const [language] = usePreferredLanguage();
  const labels = footerCopy[language];

  return (
    <footer className="site-footer">
      <div>
        <BrandLogo compact />
        <p>{labels.description}</p>
      </div>
      <div className="footer-links">
        {labels.links.map(([label, href]) => (
          <Link prefetch={false} href={href} key={href}>
            {label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
