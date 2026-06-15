import { intakeFields, paymentConfirmationFields } from "@/lib/launch";

function formatPacketField(field: string) {
  return `- ${field.replace(/[.!?]+$/, "")}:`;
}

export function buildProjectIntakePacket(includeOrderFields: boolean, planBrief = "") {
  const trimmedPlanBrief = planBrief.trim();

  return [
    "AgentSiteOps project intake",
    "",
    ...(trimmedPlanBrief
      ? [
          "Saved Plan Studio draft",
          trimmedPlanBrief,
          ""
        ]
      : []),
    "Project context",
    ...intakeFields.map(formatPacketField),
    "",
    "Do not include passwords, private API keys, bank details, recovery information, or private customer data.",
    "",
    "Response expectation",
    "- Website packet preparation confirms formatting only.",
    "- Operator review returns ready, repair, blocked, or not delivery.",
    "- Research carrier is chosen after manual acceptance; no hidden automatic research result is created.",
    ...(includeOrderFields
      ? [
          "",
          "Order confirmation if already purchased",
          ...paymentConfirmationFields.map(formatPacketField)
        ]
      : [])
  ].join("\n");
}
