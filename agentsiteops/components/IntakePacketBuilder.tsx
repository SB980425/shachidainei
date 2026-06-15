"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Copy, Mail } from "lucide-react";
import { buildProjectIntakePacket } from "@/lib/intakePacket";
import { launchProduct } from "@/lib/launch";

type CopyStatus = "idle" | "copied" | "failed";

const planBriefStorageKey = "agentsiteops.planDraftBrief.v1";

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to a temporary textarea when clipboard permissions are blocked.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function IntakePacketBuilder() {
  const [includeOrderFields, setIncludeOrderFields] = useState(false);
  const [includePlanBrief, setIncludePlanBrief] = useState(false);
  const [planBrief, setPlanBrief] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const packet = useMemo(
    () => buildProjectIntakePacket(includeOrderFields, includePlanBrief ? planBrief : ""),
    [includeOrderFields, includePlanBrief, planBrief]
  );
  const copyLabel =
    copyStatus === "copied" ? "Packet copied" : copyStatus === "failed" ? "Copy failed" : "Copy packet";
  const mailHref = `mailto:${launchProduct.supportEmail}?subject=${encodeURIComponent(
    "AgentSiteOps project intake"
  )}&body=${encodeURIComponent(packet)}`;

  useEffect(() => {
    try {
      const savedPlanBrief = window.localStorage.getItem(planBriefStorageKey)?.trim() ?? "";

      if (savedPlanBrief) {
        setPlanBrief(savedPlanBrief);
        setIncludePlanBrief(true);
        window.codexAnalytics?.track("intake_saved_plan_detected", {
          length: savedPlanBrief.length
        });
      }
    } catch {
      setPlanBrief("");
      setIncludePlanBrief(false);
    }
  }, []);

  async function copyPacket() {
    const copied = await writeClipboard(packet);
    setCopyStatus(copied ? "copied" : "failed");
    window.codexAnalytics?.track("template_copy_click", {
      surface: "intake_packet",
      label: includeOrderFields ? "intake_with_order_fields" : "intake_only",
      length: packet.length
    });
    window.setTimeout(() => setCopyStatus("idle"), 1600);
  }

  return (
    <section className="gate-section" id="intake-packet">
      <div className="intake-packet-tool" aria-label="Copy-ready intake packet">
        <div className="intake-packet-copy">
          <span>
            <ClipboardCheck aria-hidden="true" size={17} />
            Copy-ready packet
          </span>
          <h2>Prepare the intake before sending it.</h2>
          <p>
            The copied packet keeps project facts first. Order confirmation fields are optional
            and should only be included when a Fit Review or Route File purchase already exists.
          </p>
          {planBrief ? (
            <div className="intake-saved-plan">
              <strong>Saved Plan Studio draft detected</strong>
              <p>
                The packet can include the browser-local plan brief from this device. Review it
                before emailing; it is still a draft, not accepted scope.
              </p>
              <label className="intake-packet-toggle">
                <input
                  checked={includePlanBrief}
                  onChange={(event) => setIncludePlanBrief(event.target.checked)}
                  type="checkbox"
                />
                Include saved Plan Studio brief
              </label>
            </div>
          ) : (
            <div className="intake-saved-plan">
              <strong>No saved Plan Studio draft</strong>
              <p>
                Start in Plan Studio when the project is still messy, then return here to include
                the browser-local brief in the intake packet.
              </p>
            </div>
          )}
          <label className="intake-packet-toggle">
            <input
              checked={includeOrderFields}
              onChange={(event) => setIncludeOrderFields(event.target.checked)}
              type="checkbox"
            />
            Include order confirmation fields
          </label>
          <div className="intake-packet-actions">
            <button className="primary-action" onClick={copyPacket} type="button">
              <Copy aria-hidden="true" size={16} />
              {copyLabel}
            </button>
            <a className="secondary-action" href={mailHref}>
              <Mail aria-hidden="true" size={16} />
              Email packet
            </a>
          </div>
        </div>
        <pre className="intake-packet-preview">{packet}</pre>
      </div>
    </section>
  );
}
