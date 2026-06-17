"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";

const footerCopy = {
  en: {
    description:
      "Research-to-Route File service for messy projects that need one selected route before build expansion.",
    links: [
      ["Start", "/start/"],
      ["Execution", "/execution/"],
      ["How it works", "/how-it-works/"],
      ["Launch Kit", "/launch-kit/"],
      ["Method", "/methodology/route-selection/"],
      ["Research", "/templates/route-research-prompt-pack/"],
      ["Delivery Gate", "/delivery-gate/"],
      ["Route Basis", "/reports/route-basis/"],
      ["Updates", "/updates/"],
      ["Pricing", "/pricing/"],
      ["Sample", "/sample/"],
      ["Terms", "/terms/"],
      ["Refunds", "/refund-policy/"],
      ["Contact", "/contact/"],
      ["Evidence", "/reports/route-evidence-dashboard/"],
      ["Authors", "/authors/"],
      ["Privacy", "/privacy/"],
      ["Disclosure", "/disclosure/"]
    ]
  },
  zh: {
    description: "把混乱项目材料整理成一个可检查的路线文件，在扩建页面、工具或内容系统前先选定一条路线。",
    links: [
      ["开始", "/start/"],
      ["执行", "/execution/"],
      ["工作原理", "/how-it-works/"],
      ["启动包", "/launch-kit/"],
      ["方法", "/methodology/route-selection/"],
      ["研究", "/templates/route-research-prompt-pack/"],
      ["交付门槛", "/delivery-gate/"],
      ["路线依据", "/reports/route-basis/"],
      ["更新", "/updates/"],
      ["定价", "/pricing/"],
      ["样例", "/sample/"],
      ["条款", "/terms/"],
      ["退款", "/refund-policy/"],
      ["联系", "/contact/"],
      ["证据", "/reports/route-evidence-dashboard/"],
      ["作者", "/authors/"],
      ["隐私", "/privacy/"],
      ["披露", "/disclosure/"]
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
