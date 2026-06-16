"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  LockKeyhole,
  ShieldCheck,
  XCircle,
  type LucideIcon
} from "lucide-react";

type ReviewStateId = "ready" | "repair" | "blocked" | "not-delivery";

const reviewStates: Array<{
  id: ReviewStateId;
  label: string;
  title: string;
  badge: string;
  body: string;
  clientSees: string;
  operatorDoes: string;
  nextAction: string;
  href: string;
  Icon: LucideIcon;
}> = [
  {
    id: "ready",
    label: "Ready",
    title: "Accepted for scope lock",
    badge: "Can advance",
    body:
      "The project names a buyer, route question, source boundary, constraints, candidate alternatives, and stop condition.",
    clientSees:
      "The packet can move to Scope Lock before any research carrier is selected.",
    operatorDoes:
      "Freeze allowed sources, blocked claims, route alternatives, and the next coverage standard.",
    nextAction: "Open Scope Lock",
    href: "/scope/",
    Icon: CheckCircle2
  },
  {
    id: "repair",
    label: "Repair",
    title: "More input required",
    badge: "Fix before review",
    body:
      "The route question is useful, but the buyer, proof asset, source rights, rejected alternatives, or delivery boundary is still incomplete.",
    clientSees:
      "A focused request for the missing fields. No hidden research or Route File work starts yet.",
    operatorDoes:
      "Ask only for details needed to decide the route, then re-check the packet.",
    nextAction: "Repair in Plan Studio",
    href: "/plan/",
    Icon: AlertTriangle
  },
  {
    id: "blocked",
    label: "Blocked",
    title: "Cannot start delivery",
    badge: "Rejected boundary",
    body:
      "The request depends on unsafe claims, private account access, copied data, regulated advice, or impossible outcome promises.",
    clientSees:
      "A concrete blocked reason instead of a polished plan that hides the risk.",
    operatorDoes:
      "Reject the unsafe boundary and name what would need to change before resubmission.",
    nextAction: "View blocked example",
    href: "/examples/blocked-intake/",
    Icon: XCircle
  },
  {
    id: "not-delivery",
    label: "Not delivery",
    title: "This is not a Route File yet",
    badge: "No handoff",
    body:
      "The material is a broad memo, generic AI answer, or research summary without selected route, rejected alternatives, evidence ledger, validation channel, and stop rule.",
    clientSees:
      "A non-delivery verdict that explains which Route File parts are missing.",
    operatorDoes:
      "Return the material to gate, repair, or scope lock before calling it complete.",
    nextAction: "Check delivery gate",
    href: "/delivery-gate/",
    Icon: ShieldCheck
  }
];

const sampleResponse = [
  "AgentSiteOps review response",
  "",
  "State: Repair",
  "Reason: The buyer segment is visible, but the first proof asset and source boundary are not specific enough for Scope Lock.",
  "",
  "Required before acceptance:",
  "- Provide one inspectable demo, screenshot, walkthrough, or source note.",
  "- Name which public or private source material can be used.",
  "- Confirm which claims cannot be made in the final Route File.",
  "",
  "Not started:",
  "- No hidden research run.",
  "- No API call.",
  "- No Route File synthesis.",
  "",
  "Next action: repair the Plan Studio draft, copy the updated packet, then resend intake."
].join("\n");

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback below.
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "true");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);
    return didCopy;
  } catch {
    return false;
  }
}

export function ReviewStatusConsole() {
  const [activeState, setActiveState] = useState<ReviewStateId>("repair");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "blocked">("idle");
  const active = reviewStates.find((state) => state.id === activeState) ?? reviewStates[1];
  const ActiveIcon = active.Icon;

  async function copyResponse() {
    const didCopy = await copyText(sampleResponse);
    setCopyStatus(didCopy ? "copied" : "blocked");
    window.codexAnalytics?.track("review_response_copy", {
      copied: didCopy,
      state: activeState
    });
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <section className="review-status-console" id="review-status-console" aria-label="Review status console">
      <div className="review-status-head">
        <div>
          <span>Review Status</span>
          <h2>Submission creates a review state, not automatic delivery.</h2>
          <p>
            The customer should be able to see exactly what comes back after intake:
            ready, repair, blocked, or not delivery. Only ready projects move into Scope Lock.
          </p>
        </div>
        <button type="button" onClick={copyResponse}>
          <ClipboardCopy aria-hidden="true" size={16} />
          {copyStatus === "copied"
            ? "Copied response"
            : copyStatus === "blocked"
              ? "Copy unavailable"
              : "Copy sample response"}
        </button>
      </div>

      <div className="review-state-tabs" role="tablist" aria-label="Review response states">
        {reviewStates.map((state) => {
          const Icon = state.Icon;
          const isActive = state.id === activeState;

          return (
            <button
              aria-selected={isActive}
              className={isActive ? "is-active" : undefined}
              data-analytics-event="review_status_selected"
              data-analytics-label={state.id}
              data-analytics-type="review_status"
              key={state.id}
              onClick={() => setActiveState(state.id)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" size={16} />
              {state.label}
            </button>
          );
        })}
      </div>

      <div className="review-state-body">
        <article className={`review-state-card is-${active.id}`}>
          <div>
            <span>{active.badge}</span>
            <ActiveIcon aria-hidden="true" size={24} />
          </div>
          <h3>{active.title}</h3>
          <p>{active.body}</p>
          <Link prefetch={false} href={active.href}>
            {active.nextAction}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </article>

        <div className="review-state-detail">
          <article>
            <LockKeyhole aria-hidden="true" size={18} />
            <h3>Client sees</h3>
            <p>{active.clientSees}</p>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" size={18} />
            <h3>Operator does</h3>
            <p>{active.operatorDoes}</p>
          </article>
          <article>
            <AlertTriangle aria-hidden="true" size={18} />
            <h3>Boundary</h3>
            <p>
              The status response never proves demand, payment, traffic, ranking, AI citation,
              or customer outcomes. It only decides the next workflow state.
            </p>
          </article>
        </div>
      </div>

      <pre className="review-response-preview">{sampleResponse}</pre>
    </section>
  );
}
