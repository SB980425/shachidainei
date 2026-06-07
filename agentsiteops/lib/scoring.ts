export type ScoreKey =
  | "searchDemand"
  | "entrantAngle"
  | "serpOpportunity"
  | "commercialIntent"
  | "contentGap"
  | "originalValue"
  | "maintenanceEase"
  | "moat"
  | "monetizationFit"
  | "complianceSafety"
  | "dataSource"
  | "aiProductionFit"
  | "pseoFit"
  | "verifiability90d"
  | "aiCitationProbability"
  | "groundingValue"
  | "structureExtractability"
  | "entityClarity"
  | "humanContinuationValue"
  | "spamSafety";

export type Decision = "proceed" | "pilot" | "pivot" | "stop" | "block";

export type ScoreField = {
  key: ScoreKey;
  label: string;
  weight: number;
  group: "market" | "asset" | "ai" | "risk";
  low: string;
  high: string;
};

export type ScoreValues = Record<ScoreKey, number>;

export const scoreFields: ScoreField[] = [
  {
    key: "searchDemand",
    label: "Search demand",
    weight: 8,
    group: "market",
    low: "Weak demand",
    high: "Proven demand"
  },
  {
    key: "entrantAngle",
    label: "Entrant angle",
    weight: 8,
    group: "market",
    low: "No clear wedge",
    high: "Distinct wedge"
  },
  {
    key: "serpOpportunity",
    label: "SERP opportunity",
    weight: 8,
    group: "market",
    low: "Fully dominated",
    high: "Open lane"
  },
  {
    key: "commercialIntent",
    label: "Commercial intent",
    weight: 12,
    group: "market",
    low: "Weak",
    high: "Strong"
  },
  {
    key: "contentGap",
    label: "Content gap",
    weight: 10,
    group: "asset",
    low: "Commodity",
    high: "Clear gap"
  },
  {
    key: "originalValue",
    label: "Original value",
    weight: 10,
    group: "asset",
    low: "Rewrite only",
    high: "Unique assets"
  },
  {
    key: "maintenanceEase",
    label: "Maintenance ease",
    weight: 8,
    group: "asset",
    low: "Manual upkeep",
    high: "Processable"
  },
  {
    key: "moat",
    label: "Competitive moat",
    weight: 10,
    group: "asset",
    low: "No moat",
    high: "Compounding"
  },
  {
    key: "monetizationFit",
    label: "Monetization fit",
    weight: 10,
    group: "market",
    low: "Detached",
    high: "Aligned"
  },
  {
    key: "complianceSafety",
    label: "Compliance safety",
    weight: 6,
    group: "risk",
    low: "High risk",
    high: "Low risk"
  },
  {
    key: "dataSource",
    label: "Data source",
    weight: 4,
    group: "asset",
    low: "Unstable",
    high: "Verifiable"
  },
  {
    key: "aiProductionFit",
    label: "AI production fit",
    weight: 4,
    group: "ai",
    low: "Risky",
    high: "Efficient"
  },
  {
    key: "pseoFit",
    label: "pSEO fit",
    weight: 4,
    group: "ai",
    low: "Poor",
    high: "Structured"
  },
  {
    key: "verifiability90d",
    label: "90-day verifiability",
    weight: 8,
    group: "market",
    low: "Hard to judge",
    high: "Clear signals"
  },
  {
    key: "aiCitationProbability",
    label: "AI citation probability",
    weight: 10,
    group: "ai",
    low: "Hard to cite",
    high: "Easy to cite"
  },
  {
    key: "groundingValue",
    label: "Grounding value",
    weight: 10,
    group: "ai",
    low: "Unverifiable",
    high: "Verifiable"
  },
  {
    key: "structureExtractability",
    label: "Structure extractability",
    weight: 8,
    group: "ai",
    low: "Essay-like",
    high: "Tables and fields"
  },
  {
    key: "entityClarity",
    label: "Entity clarity",
    weight: 6,
    group: "ai",
    low: "Ambiguous",
    high: "Clear entities"
  },
  {
    key: "humanContinuationValue",
    label: "Human continuation value",
    weight: 8,
    group: "market",
    low: "Read and leave",
    high: "Use or download"
  },
  {
    key: "spamSafety",
    label: "Spam safety",
    weight: 8,
    group: "risk",
    low: "Looks spammy",
    high: "User value is clear"
  }
];

export const defaultScoreValues = scoreFields.reduce((values, field) => {
  values[field.key] = field.key === "pseoFit" || field.key === "dataSource" ? 3 : 4;
  return values;
}, {} as ScoreValues);

export function calculateScore(values: ScoreValues) {
  const weighted = scoreFields.reduce((total, field) => total + values[field.key] * field.weight, 0);
  const max = scoreFields.reduce((total, field) => total + 5 * field.weight, 0);
  return Math.round((weighted / max) * 1000) / 10;
}

export function getDecision(score: number, hasBlocker: boolean): Decision {
  if (hasBlocker) {
    return "block";
  }

  if (score >= 70) {
    return "proceed";
  }

  if (score >= 55) {
    return "pilot";
  }

  if (score >= 45) {
    return "pivot";
  }

  return "stop";
}

export function getDecisionLabel(decision: Decision) {
  const labels: Record<Decision, string> = {
    proceed: "Proceed to site blueprint",
    pilot: "Pilot only",
    pivot: "Pivot angle or site type",
    stop: "Stop building",
    block: "Blocked by hard risk"
  };

  return labels[decision];
}
