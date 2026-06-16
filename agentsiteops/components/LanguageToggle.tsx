"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

export type SiteLanguage = "en" | "zh";

const storageKey = "agentsiteops.language.v1";
const languageEvent = "agentsiteops:language-change";

function readStoredLanguage(): SiteLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored === "zh" ? "zh" : "en";
}

function applyLanguage(language: SiteLanguage) {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.language = language;
}

export function usePreferredLanguage() {
  const [language, setLanguage] = useState<SiteLanguage>("en");

  useEffect(() => {
    const stored = readStoredLanguage();
    setLanguage(stored);
    applyLanguage(stored);

    function handleLanguageChange(event: Event) {
      const next = (event as CustomEvent<SiteLanguage>).detail;
      if (next === "zh" || next === "en") {
        setLanguage(next);
        applyLanguage(next);
      }
    }

    window.addEventListener(languageEvent, handleLanguageChange);
    return () => window.removeEventListener(languageEvent, handleLanguageChange);
  }, []);

  function updateLanguage(next: SiteLanguage) {
    setLanguage(next);
    window.localStorage.setItem(storageKey, next);
    applyLanguage(next);
    window.dispatchEvent(new CustomEvent(languageEvent, { detail: next }));
  }

  return [language, updateLanguage] as const;
}

export function LanguageToggle() {
  const [language, setLanguage] = usePreferredLanguage();

  return (
    <div className="language-toggle" aria-label="Language switch">
      <Languages aria-hidden="true" size={15} />
      {(["en", "zh"] as SiteLanguage[]).map((item) => (
        <button
          aria-pressed={language === item}
          className={language === item ? "is-active" : undefined}
          key={item}
          onClick={() => setLanguage(item)}
          type="button"
        >
          {item === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
