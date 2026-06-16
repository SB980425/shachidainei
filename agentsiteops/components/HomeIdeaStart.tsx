"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ClipboardList, ShieldCheck } from "lucide-react";
import { usePreferredLanguage } from "@/components/LanguageToggle";

const storageKey = "agentsiteops.projectBriefInput.v1";

const copy = {
  en: {
    eyebrow: "Start here",
    title: "Paste the idea once.",
    body:
      "Use plain language. The test extracts buyer, offer, proof, channel, constraints, and validation signals from scattered text.",
    placeholder:
      "Example: I want to build an AI service for small agencies. They lose time turning messy client requests into scope. I have one screenshot, a few workflow notes, no paid ads, and I want to test outreach for 7 days...",
    action: "Analyze idea",
    local: "Browser-local draft",
    noApi: "No hidden API research",
    source: "Source-backed risk map",
    hintShort: "Add two or three specific sentences before analysis.",
    hintReady: "Enough text for the first risk map."
  },
  zh: {
    eyebrow: "从这里开始",
    title: "先把想法写一次。",
    body:
      "按自然语言写，不需要懂专业字段。测试会从零散文本里提取用户、交付物、证据、渠道、约束和验证信号。",
    placeholder:
      "示例：我想做一个给小团队用的 AI 服务。他们经常把混乱的客户需求整理成项目范围，很耗时间。我现在有一张截图、几条流程笔记、没有广告预算，想先用 7 天做私信验证...",
    action: "分析想法",
    local: "浏览器本地草稿",
    noApi: "不伪装隐藏 API 研究",
    source: "有来源依据的风险图",
    hintShort: "分析前至少写两三句具体描述。",
    hintReady: "文本足够生成第一版风险图。"
  }
};

export function HomeIdeaStart() {
  const [language] = usePreferredLanguage();
  const labels = copy[language];
  const [idea, setIdea] = useState("");
  const readiness = useMemo(() => Math.min(100, Math.round((idea.trim().length / 220) * 100)), [idea]);

  function persistIdea() {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          rawIdeaText: idea,
          optionalAssets: ""
        })
      );
    } catch {
      // The full test page still works if local storage is unavailable.
    }

    window.codexAnalytics?.track("home_idea_start", {
      length: idea.trim().length,
      readiness
    });
  }

  return (
    <section className="home-idea-start" aria-label="Start with project idea">
      <span>{labels.eyebrow}</span>
      <h2>{labels.title}</h2>
      <p>{labels.body}</p>
      <textarea
        value={idea}
        rows={8}
        placeholder={labels.placeholder}
        onChange={(event) => setIdea(event.target.value)}
      />
      <div className="home-idea-meter" aria-label="Input readiness">
        <i style={{ width: `${readiness}%` }} />
      </div>
      <p className="home-idea-hint">{readiness >= 55 ? labels.hintReady : labels.hintShort}</p>
      <Link prefetch={false} className="primary-action" href="/idea-risk-test/#idea-risk-test" onClick={persistIdea}>
        <ClipboardList aria-hidden="true" size={17} />
        {labels.action}
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
      <dl>
        <div>
          <ShieldCheck aria-hidden="true" size={15} />
          <dd>{labels.local}</dd>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" size={15} />
          <dd>{labels.noApi}</dd>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" size={15} />
          <dd>{labels.source}</dd>
        </div>
      </dl>
    </section>
  );
}
