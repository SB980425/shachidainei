export type PlanDraftInput = {
  projectName: string;
  projectType: string;
  targetUser: string;
  currentGoal: string;
  existingAssets: string;
  blocker: string;
  timeWindow: string;
  executionMode: string;
  researchCarrier: string;
  constraints: string;
};

export type PlanDraft = {
  readinessScore: number;
  confidenceLabel: "Needs input" | "Draftable" | "Review ready";
  selectedRoute: string;
  routeReason: string;
  rejectedAlternatives: string[];
  evidenceGaps: string[];
  sevenDayPlan: string[];
  stopRule: string;
  nextAction: string;
  brief: string;
};

export const projectTypeOptions = [
  "AI service or automation",
  "Content or research product",
  "Tool or dashboard",
  "Local service offer",
  "Template or workflow pack",
  "Unsure"
];

export const executionModeOptions = [
  "I will execute myself",
  "I need operator review",
  "I need manual implementation help",
  "I only need research first"
];

export const researchCarrierOptions = [
  "Carrier-neutral",
  "Manual source review",
  "Client-provided report",
  "ChatGPT Deep Research",
  "Gemini or Perplexity",
  "Operator-selected carrier"
];

export const timeWindowOptions = ["48 hours", "7 days", "14 days", "30 days", "No deadline"];

const fieldWeights: Array<[keyof PlanDraftInput, number]> = [
  ["projectName", 8],
  ["projectType", 10],
  ["targetUser", 14],
  ["currentGoal", 14],
  ["existingAssets", 12],
  ["blocker", 14],
  ["timeWindow", 8],
  ["executionMode", 8],
  ["researchCarrier", 6],
  ["constraints", 6]
];

function hasText(value: string) {
  return value.trim().length >= 4;
}

function scoreInput(input: PlanDraftInput) {
  return fieldWeights.reduce((score, [field, weight]) => score + (hasText(input[field]) ? weight : 0), 0);
}

function selectRoute(input: PlanDraftInput) {
  const type = input.projectType;
  const mode = input.executionMode;

  if (mode === "I only need research first") {
    return "Research-to-route brief";
  }

  if (mode === "I need manual implementation help") {
    return "Implementation-backed route file";
  }

  if (type === "Tool or dashboard") {
    return "Proof asset first: micro tool or dashboard";
  }

  if (type === "Content or research product") {
    return "Research pack to public sample";
  }

  if (type === "Template or workflow pack") {
    return "Template pack with validation channel";
  }

  if (type === "Local service offer") {
    return "Manual service route with first buyer proof";
  }

  return "Narrow AI-service route file";
}

function buildRejectedAlternatives(input: PlanDraftInput) {
  const alternatives = [
    "Build a full product before the first proof asset exists.",
    "Publish broad content before the buyer and validation channel are named.",
    "Treat research-tool output as final delivery without coverage review."
  ];

  if (input.executionMode !== "I need manual implementation help") {
    alternatives.push("Sell implementation before delivery capacity and scope are visible.");
  }

  return alternatives.slice(0, 4);
}

function buildEvidenceGaps(input: PlanDraftInput) {
  const gaps: string[] = [];

  if (!hasText(input.targetUser)) {
    gaps.push("Target user or buyer segment is not specific enough.");
  }

  if (!hasText(input.existingAssets)) {
    gaps.push("Existing assets, examples, links, or source material are missing.");
  }

  if (!hasText(input.blocker)) {
    gaps.push("The current decision blocker is not stated.");
  }

  if (!hasText(input.constraints)) {
    gaps.push("Claim limits, delivery limits, source rights, or risk boundaries are not visible.");
  }

  if (!gaps.length) {
    gaps.push("Buyer proof, first-party usage, payment evidence, and qualified replies still need validation.");
  }

  return gaps;
}

function buildSevenDayPlan(input: PlanDraftInput, selectedRoute: string) {
  return [
    `Day 1: Freeze the route question for ${input.projectName.trim() || "this project"} and list blocked claims.`,
    `Day 2: Gather assets and sources for the selected route: ${selectedRoute}.`,
    `Day 3: Run ${input.researchCarrier || "an approved research carrier"} or manual source review against the locked brief.`,
    "Day 4: Check coverage for buyer logic, rejected alternatives, evidence ledger, proof asset, channel, and stop rule.",
    "Day 5: Repair missing evidence or mark the weak route as blocked.",
    "Day 6: Draft the first proof asset or public sample that can be inspected.",
    "Day 7: Decide continue, repair, pivot, or stop based on visible evidence."
  ];
}

function confidenceFromScore(score: number): PlanDraft["confidenceLabel"] {
  if (score >= 78) {
    return "Review ready";
  }

  if (score >= 48) {
    return "Draftable";
  }

  return "Needs input";
}

export function createPlanDraft(input: PlanDraftInput): PlanDraft {
  const readinessScore = Math.min(100, scoreInput(input));
  const confidenceLabel = confidenceFromScore(readinessScore);
  const selectedRoute = selectRoute(input);
  const evidenceGaps = buildEvidenceGaps(input);
  const sevenDayPlan = buildSevenDayPlan(input, selectedRoute);
  const rejectedAlternatives = buildRejectedAlternatives(input);
  const targetUser = input.targetUser.trim() || "the first reachable buyer segment";
  const blocker = input.blocker.trim() || "the current route decision";
  const carrier = input.researchCarrier || "an approved research carrier";

  const routeReason =
    confidenceLabel === "Needs input"
      ? "The site can prepare a draft shape, but the input is not ready for operator acceptance."
      : `The route focuses on ${targetUser} and resolves ${blocker} before build work expands.`;

  const stopRule =
    "Stop or repair if the draft cannot name a buyer, first proof asset, accepted evidence, rejected alternatives, validation channel, and review date.";

  const nextAction =
    confidenceLabel === "Review ready"
      ? "Copy the plan brief and continue to manual intake for operator review."
      : confidenceLabel === "Draftable"
        ? "Fill the missing evidence gaps, then copy the brief for review."
        : "Complete the missing fields before treating this as a route decision.";

  const brief = [
    `Project: ${input.projectName.trim() || "Untitled project"}`,
    `Type: ${input.projectType || "Unspecified"}`,
    `Target user: ${targetUser}`,
    `Current goal: ${input.currentGoal.trim() || "Not stated"}`,
    `Current blocker: ${blocker}`,
    `Existing assets: ${input.existingAssets.trim() || "Not stated"}`,
    `Constraints: ${input.constraints.trim() || "Not stated"}`,
    `Execution mode: ${input.executionMode || "Unspecified"}`,
    `Research carrier: ${carrier}`,
    `Selected draft route: ${selectedRoute}`,
    `Evidence gaps: ${evidenceGaps.join(" | ")}`,
    `Stop rule: ${stopRule}`
  ].join("\n");

  return {
    readinessScore,
    confidenceLabel,
    selectedRoute,
    routeReason,
    rejectedAlternatives,
    evidenceGaps,
    sevenDayPlan,
    stopRule,
    nextAction,
    brief
  };
}
