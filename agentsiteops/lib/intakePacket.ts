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
    ...(includeOrderFields
      ? [
          "",
          "Order confirmation if already purchased",
          ...paymentConfirmationFields.map(formatPacketField)
        ]
      : [])
  ].join("\n");
}
