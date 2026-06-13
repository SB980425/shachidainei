"use client";

import { useMemo, useRef, useState } from "react";

const profileOptions = [
  "AI automation freelancer",
  "technical solo founder",
  "no-code builder",
  "small operator",
  "research-only visitor"
];

const offerClarityOptions = [
  "no clear offer",
  "several possible offers",
  "one draft offer",
  "one tested offer"
];

const buyerClarityOptions = [
  "unknown buyer",
  "broad audience",
  "specific buyer group",
  "specific buyer with known trigger"
];

const proofOptions = [
  "no proof",
  "private examples only",
  "public demo or portfolio",
  "customer, payment, or usage evidence"
];

const urgencyOptions = [
  "curious only",
  "want direction this month",
  "need first outreach this week",
  "already ready to publish and sell"
];

const blockerOptions = [
  "I need guaranteed traffic or revenue",
  "The topic is legal, medical, financial, tax, safety, or regulated",
  "I need ongoing SEO or AI visibility software",
  "I cannot execute outreach or publish a page"
];

type FitInput = {
  profile: string;
  offerClarity: string;
  buyerClarity: string;
  proof: string;
  urgency: string;
  blockers: string[];
};

function scoreIndex(options: string[], value: string, multiplier: number) {
  return options.indexOf(value) * multiplier;
}

function getFitDecision(score: number, blockers: string[]) {
  if (blockers.includes("The topic is legal, medical, financial, tax, safety, or regulated")) {
    return {
      label: "Do not buy",
      action: "Regulated or YMYL topics need qualified review outside this product.",
      status: "blocked"
    };
  }

  if (
    blockers.includes("I need guaranteed traffic or revenue") ||
    blockers.includes("I need ongoing SEO or AI visibility software")
  ) {
    return {
      label: "Do not buy",
      action: "Use analytics, SEO, AI visibility, or specialist services instead of a Route File.",
      status: "blocked"
    };
  }

  if (blockers.includes("I cannot execute outreach or publish a page")) {
    return {
      label: "Not ready",
      action: "Prepare a proof asset or validation channel before paying for a Route File.",
      status: "not_ready"
    };
  }

  if (score >= 75) {
    return {
      label: "Strong fit",
      action: "Buy only if one selected route, rejected alternatives, proof asset, validation channel, and stop rule would save more than USD 99 of build time.",
      status: "fit"
    };
  }

  if (score >= 55) {
    return {
      label: "Possible fit",
      action: "Review the sample and compare page first. Buy only if the missing clarity is the main bottleneck.",
      status: "possible"
    };
  }

  return {
    label: "Use free tools first",
    action: "Use the scorer, sample, and comparison page before paying. The current inputs are too early for a manual Route File.",
    status: "not_ready"
  };
}

function buildFitText(input: FitInput, score: number, decision: ReturnType<typeof getFitDecision>) {
  return [
    "AgentSiteOps Route File fit check",
    "",
    `Profile: ${input.profile}`,
    `Offer clarity: ${input.offerClarity}`,
    `Buyer clarity: ${input.buyerClarity}`,
    `Proof level: ${input.proof}`,
    `Urgency: ${input.urgency}`,
    "",
    `Fit score: ${score}`,
    `Decision: ${decision.label}`,
    `Recommended action: ${decision.action}`,
    "",
    "Blockers:",
    ...(input.blockers.length ? input.blockers.map((item) => `- ${item}`) : ["- none selected"]),
    "",
    "Boundary: this checker runs locally in the browser. It does not submit a request, store personal data, collect payment data, or guarantee traffic, ranking, AI citation, customers, revenue, or payback."
  ].join("\n");
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Restricted browser modes fall back to textarea copy.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

export function LaunchBlueprintFitChecker() {
  const [profile, setProfile] = useState(profileOptions[0]);
  const [offerClarity, setOfferClarity] = useState(offerClarityOptions[1]);
  const [buyerClarity, setBuyerClarity] = useState(buyerClarityOptions[1]);
  const [proof, setProof] = useState(proofOptions[1]);
  const [urgency, setUrgency] = useState(urgencyOptions[1]);
  const [blockers, setBlockers] = useState<string[]>([]);
  const [copyState, setCopyState] = useState("Copy fit check");
  const startedRef = useRef(false);

  const score = useMemo(() => {
    const profileScore = profile === "research-only visitor" ? 0 : 14;
    const total =
      profileScore +
      scoreIndex(offerClarityOptions, offerClarity, 8) +
      scoreIndex(buyerClarityOptions, buyerClarity, 9) +
      scoreIndex(proofOptions, proof, 8) +
      scoreIndex(urgencyOptions, urgency, 8);
    const blockerPenalty = blockers.length * 18;
    return Math.max(0, Math.min(100, total - blockerPenalty));
  }, [blockers, buyerClarity, offerClarity, profile, proof, urgency]);

  const decision = useMemo(() => getFitDecision(score, blockers), [blockers, score]);

  function track(name: string, payload: Record<string, string | number | boolean> = {}) {
    window.codexAnalytics?.track(name, {
      tool: "route_file_fit_checker",
      score,
      decision: decision.label,
      ...payload
    });
  }

  function trackStarted(trigger: string) {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    track("tool_started", { trigger });
  }

  function toggleBlocker(blocker: string) {
    trackStarted(`blocker:${blocker}`);
    setBlockers((current) =>
      current.includes(blocker)
        ? current.filter((item) => item !== blocker)
        : [...current, blocker]
    );
  }

  async function copyFitCheck() {
    const text = buildFitText(
      { profile, offerClarity, buyerClarity, proof, urgency, blockers },
      score,
      decision
    );

    try {
      const copied = await copyText(text);

      if (!copied) {
        throw new Error("Clipboard unavailable");
      }

      setCopyState("Copied");
      track("tool_completed", { export_method: "copy" });
      track("tool_result_export", { export_method: "copy" });
      window.dispatchEvent(new CustomEvent("tool_completed", { detail: { score, decision: decision.label } }));
    } catch {
      setCopyState("Copy failed");
    }

    window.setTimeout(() => setCopyState("Copy fit check"), 1600);
  }

  return (
    <section className="scope-builder" aria-label="Route File fit checker">
      <div className="scope-form">
        <label className="field-block">
          <span>Builder profile</span>
          <select
            value={profile}
            onChange={(event) => {
              trackStarted("profile");
              setProfile(event.target.value);
            }}
          >
            {profileOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Offer clarity</span>
          <select
            value={offerClarity}
            onChange={(event) => {
              trackStarted("offer_clarity");
              setOfferClarity(event.target.value);
            }}
          >
            {offerClarityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Buyer clarity</span>
          <select
            value={buyerClarity}
            onChange={(event) => {
              trackStarted("buyer_clarity");
              setBuyerClarity(event.target.value);
            }}
          >
            {buyerClarityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Proof level</span>
          <select
            value={proof}
            onChange={(event) => {
              trackStarted("proof");
              setProof(event.target.value);
            }}
          >
            {proofOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-block">
          <span>Launch urgency</span>
          <select
            value={urgency}
            onChange={(event) => {
              trackStarted("urgency");
              setUrgency(event.target.value);
            }}
          >
            {urgencyOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <div className="scope-check-grid" aria-label="Purchase blockers">
          {blockerOptions.map((blocker) => (
            <label className="checkbox-row" key={blocker}>
              <input
                checked={blockers.includes(blocker)}
                type="checkbox"
                onChange={() => toggleBlocker(blocker)}
              />
              <span>{blocker}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="scope-panel">
        <div className={`scope-score fit-score fit-score-${decision.status}`}>
          <span>{score}</span>
          <div>
            <strong>{decision.label}</strong>
            <p>{decision.action}</p>
          </div>
        </div>

        <section>
          <h2>What the score means</h2>
          <ul className="compact-list">
            <li>75-100: buy only if the manual Route File saves more time than the price.</li>
            <li>55-74: inspect the sample and comparison page before paying.</li>
            <li>0-54: use free tools and clarify the offer first.</li>
            <li>Any regulated topic or guarantee expectation blocks purchase.</li>
          </ul>
        </section>

        <section>
          <h2>Next page</h2>
          <ul className="compact-list">
            <li>Strong fit: go to pricing or buy page.</li>
            <li>Possible fit: read the sample and comparison page.</li>
            <li>Not ready: use the scorer and rebuild the offer first.</li>
          </ul>
        </section>

        <button className="primary-action" type="button" onClick={copyFitCheck}>
          {copyState}
        </button>
      </div>
    </section>
  );
}
