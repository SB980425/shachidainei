"use client";

import { AlertTriangle, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { usePreferredLanguage, type SiteLanguage } from "@/components/LanguageToggle";
import { routeExampleCases } from "@/lib/routeExampleCases";

const labels = {
  en: {
    roughInput: "Rough input",
    systemRead: "System read",
    failureNode: "First failure node",
    selectedRoute: "Selected route",
    evidenceNeeded: "Evidence needed",
    stopRule: "Stop rule"
  },
  zh: {
    roughInput: "原始白话输入",
    systemRead: "系统理解",
    failureNode: "第一失败节点",
    selectedRoute: "选定路线",
    evidenceNeeded: "需要的证据",
    stopRule: "停止规则"
  }
} satisfies Record<SiteLanguage, Record<string, string>>;

export function RouteExampleCaseGrid() {
  const [language] = usePreferredLanguage();
  const copy = labels[language];

  return (
    <div className="route-example-grid">
      {routeExampleCases.map((item) => (
        <article className="route-example-card" key={item.id}>
          <div className="route-example-title">
            <FileText aria-hidden="true" size={18} />
            <h3>{item.title[language]}</h3>
          </div>
          <dl>
            <div>
              <dt>{copy.roughInput}</dt>
              <dd>{item.roughInput[language]}</dd>
            </div>
            <div>
              <dt>{copy.systemRead}</dt>
              <dd>{item.systemRead[language]}</dd>
            </div>
            <div>
              <dt>
                <AlertTriangle aria-hidden="true" size={15} />
                {copy.failureNode}
              </dt>
              <dd>{item.failureNode[language]}</dd>
            </div>
            <div>
              <dt>
                <CheckCircle2 aria-hidden="true" size={15} />
                {copy.selectedRoute}
              </dt>
              <dd>{item.selectedRoute[language]}</dd>
            </div>
          </dl>
          <div className="route-example-evidence">
            <strong>{copy.evidenceNeeded}</strong>
            <ul>
              {item.evidenceNeeded[language].map((evidence) => (
                <li key={evidence}>{evidence}</li>
              ))}
            </ul>
          </div>
          <div className="route-example-stop">
            <ShieldCheck aria-hidden="true" size={16} />
            <p>
              <strong>{copy.stopRule}: </strong>
              {item.stopRule[language]}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
