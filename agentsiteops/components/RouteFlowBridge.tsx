import Link from "next/link";
import {
  ClipboardList,
  FileCheck2,
  FileText,
  LockKeyhole,
  SearchCheck
} from "lucide-react";

const routeFlowStages = [
  {
    id: "intake",
    label: "Intake",
    title: "Client input",
    body: "Facts, sources, constraints, and candidate routes.",
    href: "/start/",
    Icon: ClipboardList
  },
  {
    id: "scope",
    label: "Scope Lock",
    title: "Boundary",
    body: "Allowed claims, blocked claims, and research limits.",
    href: "/how-it-works/",
    Icon: LockKeyhole
  },
  {
    id: "research",
    label: "Research Run",
    title: "Manual research",
    body: "Prompt pack, Deep Research run, and source coverage.",
    href: "/templates/route-research-prompt-pack/",
    Icon: SearchCheck
  },
  {
    id: "gate",
    label: "Coverage Gate",
    title: "Pass or repair",
    body: "Check coverage before synthesis or block weak output.",
    href: "/delivery-gate/",
    Icon: FileCheck2
  },
  {
    id: "route-file",
    label: "Route File",
    title: "Final output",
    body: "Selected route, rejected paths, ledger, asset, channel, stop rule.",
    href: "/sample/",
    Icon: FileText
  }
];

type RouteFlowBridgeProps = {
  current: (typeof routeFlowStages)[number]["id"];
  eyebrow?: string;
  nextHref?: string;
  nextLabel?: string;
};

export function RouteFlowBridge({
  current,
  eyebrow = "Route Foundry path",
  nextHref,
  nextLabel
}: RouteFlowBridgeProps) {
  const currentIndex = routeFlowStages.findIndex((stage) => stage.id === current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const resolvedNext = nextHref
    ? { href: nextHref, label: nextLabel ?? "Continue" }
    : routeFlowStages[Math.min(safeIndex + 1, routeFlowStages.length - 1)];

  return (
    <section className="route-flow-bridge" aria-label="AgentSiteOps route flow">
      <div className="route-flow-bridge-head">
        <span>{eyebrow}</span>
        <strong>
          Stage {safeIndex + 1} / {routeFlowStages.length}: {routeFlowStages[safeIndex].label}
        </strong>
        <Link prefetch={false} href={resolvedNext.href}>
          {resolvedNext.label}
        </Link>
      </div>
      <div className="route-flow-bridge-track">
        {routeFlowStages.map((stage, index) => {
          const Icon = stage.Icon;
          const isCurrent = stage.id === current;
          const isPassed = index < safeIndex;

          return (
            <Link
              prefetch={false}
              className={`${isCurrent ? "is-current" : ""} ${isPassed ? "is-passed" : ""}`}
              href={stage.href}
              key={stage.id}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" size={17} />
              <strong>{stage.label}</strong>
              <small>{stage.body}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
