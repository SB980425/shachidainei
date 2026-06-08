"use client";

import { useState } from "react";

type Props = {
  buttonLabel?: string;
  description: string;
  eventLabel: string;
  eventName: "template_copy_click" | "checklist_copy_click";
  text: string;
  title: string;
};

export function CopyAction({
  buttonLabel = "Copy",
  description,
  eventLabel,
  eventName,
  text,
  title
}: Props) {
  const [state, setState] = useState(buttonLabel);

  async function copyText() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setState("Copied");
      window.codexAnalytics?.track(eventName, {
        label: eventLabel,
        length: text.length
      });
    } catch {
      setState("Copy failed");
    }

    window.setTimeout(() => setState(buttonLabel), 1600);
  }

  return (
    <section className="copy-action-panel" aria-label={title}>
      <div className="copy-action-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <button className="primary-action" type="button" onClick={copyText}>
          {state}
        </button>
      </div>
      <pre className="copy-action-preview">{text}</pre>
    </section>
  );
}
