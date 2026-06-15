export type RouteProjectStageId =
  | "plan"
  | "intake"
  | "scope"
  | "research"
  | "gate"
  | "route-file"
  | "validation";

export type RouteProjectIconKey =
  | "clipboard"
  | "fileCheck"
  | "lock"
  | "search"
  | "fileText"
  | "activity"
  | "shield";

export type RouteProjectStage = {
  id: RouteProjectStageId;
  label: string;
  title: string;
  body: string;
  href: string;
  owner: string;
  input: string;
  output: string;
  pass: string;
  repair: string;
  notDelivery: string;
  icon: RouteProjectIconKey;
};

export const routeProjectStages: RouteProjectStage[] = [
  {
    id: "plan",
    label: "Plan Draft",
    title: "Turn messy intent into a route question",
    body:
      "The visitor writes the project, target user, proof, alternatives, blocker, constraints, execution mode, and review window in plain language.",
    href: "/plan/",
    owner: "Visitor and browser-local draft",
    input: "Unclear project material",
    output: "Preliminary route brief",
    pass: "Buyer, goal, assets, blocker, rejected alternatives, and constraints are visible.",
    repair: "Ask for missing buyer, proof, blocker, or delivery-limit details.",
    notDelivery: "A broad ambition with no route question or inspectable input.",
    icon: "clipboard"
  },
  {
    id: "intake",
    label: "Intake",
    title: "Convert the draft into a reviewable packet",
    body:
      "The packet separates submission from acceptance and shows whether the request is ready, needs repair, is blocked, or is not delivery.",
    href: "/intake/",
    owner: "Website receipt plus operator review",
    input: "Plan brief and safe source material",
    output: "Ready, repair, blocked, or not-delivery state",
    pass: "Facts, rights, risks, payment role, and review boundary are explicit.",
    repair: "Request only the missing fields needed to judge the route.",
    notDelivery: "Secrets, private data, unsafe claims, or impossible delivery promises.",
    icon: "fileCheck"
  },
  {
    id: "scope",
    label: "Scope Lock",
    title: "Freeze claims, sources, routes, and non-goals",
    body:
      "Accepted intake becomes a locked decision frame so research cannot drift into broad market advice or unsupported build work.",
    href: "/how-it-works/",
    owner: "Operator",
    input: "Accepted intake packet",
    output: "Locked research and delivery boundary",
    pass: "Allowed sources, blocked claims, candidate routes, and stop conditions are named.",
    repair: "Narrow the buyer, source set, route alternatives, or delivery scope.",
    notDelivery: "Research request without source rights, route alternatives, or forbidden-claim limits.",
    icon: "lock"
  },
  {
    id: "research",
    label: "Research Run",
    title: "Use an approved evidence carrier",
    body:
      "Research can come from manual source review, client reports, operator-controlled AI research, or another approved carrier. The carrier can change; the acceptance standard does not.",
    href: "/templates/route-research-prompt-pack/",
    owner: "Approved carrier",
    input: "Locked brief and source boundary",
    output: "Source-backed findings and rejected paths",
    pass: "The returned material includes sources, buyer logic, alternatives, uncertainty, and proof needs.",
    repair: "Generate a second-pass research brief for uncovered claims or weak sources.",
    notDelivery: "Hidden automatic research claims or unsupported summaries without inspectable source coverage.",
    icon: "search"
  },
  {
    id: "gate",
    label: "Coverage Gate",
    title: "Accept, repair, block, or reject returned material",
    body:
      "Returned research is checked before synthesis so a confident-looking report cannot become a weak Route File.",
    href: "/delivery-gate/",
    owner: "Quality gate",
    input: "Returned research or manual source notes",
    output: "Pass, repair prompt, blocked reason, or rejection",
    pass: "Buyer logic, rejected alternatives, evidence ledger, proof asset, validation channel, and stop rule are covered.",
    repair: "Send a focused gap request rather than synthesizing around missing evidence.",
    notDelivery: "A clean report that lacks rejection logic, evidence tags, or stop conditions.",
    icon: "shield"
  },
  {
    id: "route-file",
    label: "Route File",
    title: "Fuse accepted evidence into one decision package",
    body:
      "Only accepted material becomes the selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
    href: "/sample/",
    owner: "Operator handoff",
    input: "Coverage-gated research and intake facts",
    output: "Client-readable Route File",
    pass: "The client can see what to do first, what not to build, what is still missing, and when to stop.",
    repair: "Downgrade confidence or request missing evidence before final delivery.",
    notDelivery: "A plan with multiple equal directions, no evidence ledger, or no stop rule.",
    icon: "fileText"
  },
  {
    id: "validation",
    label: "Validation",
    title: "Run the first proof asset and stop rule",
    body:
      "The Route File is not the end of the system. It must point to a first proof asset, counted signal, ignored weak signal, and stop or repair decision.",
    href: "/guides/48-hour-exposure-sprint/",
    owner: "Visitor, operator, or founder",
    input: "Delivered Route File",
    output: "Continue, repair, pivot, or stop evidence",
    pass: "Qualified replies, usable intake, payment plus intake, repeated objections, or source-backed search evidence are recorded.",
    repair: "Rewrite the offer, proof asset, buyer segment, or channel before expansion.",
    notDelivery: "Treating page views, AI praise, sitemap success, or PayPal clicks as validated demand.",
    icon: "activity"
  }
];

export const routeProjectObjects = [
  {
    name: "Route Project",
    definition:
      "The central object: one client project moving through plan, intake, scope, research, gate, Route File, and validation states.",
    owns: "Current state, owner, missing fields, evidence status, and next action."
  },
  {
    name: "Intake Packet",
    definition:
      "The reviewable input bundle created from the visitor's plain-language plan and safe supporting material.",
    owns: "Project facts, buyer, assets, source boundaries, constraints, payment role, and blocked claims."
  },
  {
    name: "Evidence Ledger",
    definition:
      "The claim table that prevents inference, public context, page activity, or market signals from becoming proof.",
    owns: "Verified, inferred, pending, stale, blocked, and not-claimed statuses."
  },
  {
    name: "Route File",
    definition:
      "The final decision artifact, not a dashboard or generic report.",
    owns: "Selected route, rejected alternatives, first proof asset, validation channel, and stop rule."
  }
];

export const routeProjectSupportLayer = [
  {
    label: "SEO and AI visibility pages",
    role:
      "Support discovery and measurement. They should not compete with the Route File as the main product."
  },
  {
    label: "Templates and checklists",
    role:
      "Support delivery quality. They are backend method assets unless a visitor needs that exact artifact."
  },
  {
    label: "Launch Kit and exposure pages",
    role:
      "Support validation after a Route File exists. They do not prove demand on their own."
  }
];

export function getRouteProjectStage(id: RouteProjectStageId) {
  return routeProjectStages.find((stage) => stage.id === id) ?? routeProjectStages[0];
}
