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

export type RouteProjectClientState = {
  stage: RouteProjectStageId;
  customerAction: string;
  websiteAction: string;
  manualAction: string;
  nextVisibleResult: string;
  stopOrRepair: string;
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
    href: "/scope/",
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

export const routeProjectClientStates: RouteProjectClientState[] = [
  {
    stage: "plan",
    customerAction: "Write the messy project once: buyer, goal, assets, blocker, constraints, execution mode, and review window.",
    websiteAction: "Create a browser-local preliminary route draft, readiness score, evidence gaps, rejected alternatives, and exportable brief.",
    manualAction: "No manual work starts yet. Operator review begins only after the draft is sent through intake.",
    nextVisibleResult: "A copied or downloaded plan brief that can be included in the intake packet.",
    stopOrRepair: "Repair before intake if buyer, assets, blocker, constraints, or forbidden claims are still vague."
  },
  {
    stage: "intake",
    customerAction: "Send the plan brief plus safe source material, links, screenshots, constraints, and optional order confirmation.",
    websiteAction: "Format the packet, detect a saved Plan Studio draft, copy the packet, and open a clean email handoff.",
    manualAction: "A person accepts, requests repair, blocks, or marks the request as not delivery.",
    nextVisibleResult: "Ready, repair, blocked, or not-delivery state before research starts.",
    stopOrRepair: "Stop or repair when private data, unsafe claims, source-right gaps, or impossible delivery promises appear."
  },
  {
    stage: "scope",
    customerAction: "Confirm the route question, allowed sources, non-goals, blocked claims, and delivery boundary.",
    websiteAction: "Show the frozen scope path and keep the project from drifting into unrelated templates or broad advice.",
    manualAction: "The operator locks the brief, names route alternatives, and decides which evidence carrier is acceptable.",
    nextVisibleResult: "A narrow research and delivery boundary that can be checked later.",
    stopOrRepair: "Repair if the brief cannot name sources, alternatives, unacceptable claims, or a stop condition."
  },
  {
    stage: "research",
    customerAction: "Provide approved source material or wait while the selected carrier returns coverage against the locked brief.",
    websiteAction: "Keep the carrier-neutral research standard visible instead of claiming one hidden AI platform owns the workflow.",
    manualAction: "Manual review, client reports, operator-controlled AI research, or another approved carrier can be used.",
    nextVisibleResult: "Returned findings with sources, uncertainty, alternatives, and proof needs.",
    stopOrRepair: "Trigger second-pass research when buyer logic, source coverage, alternatives, or proof needs are missing."
  },
  {
    stage: "gate",
    customerAction: "Inspect whether returned material covers the route decision before accepting a polished handoff.",
    websiteAction: "Expose pass, repair, blocked, and not-delivery logic so weak reports do not become Route Files.",
    manualAction: "The operator checks coverage and either synthesizes, repairs, blocks, or rejects the material.",
    nextVisibleResult: "Coverage verdict plus missing-evidence request when needed.",
    stopOrRepair: "Repair or block if the report lacks evidence tags, rejected alternatives, proof asset, channel, or stop rule."
  },
  {
    stage: "route-file",
    customerAction: "Read one selected route, the rejected paths, evidence ledger, first proof asset, validation channel, and stop rule.",
    websiteAction: "Present sample and proof-case structure so the final handoff is inspectable before trust is requested.",
    manualAction: "The operator fuses accepted evidence into the Route File and downgrades confidence where proof is weak.",
    nextVisibleResult: "A client-readable Route File that explains what to do first and what not to build.",
    stopOrRepair: "Do not deliver if multiple equal routes remain, no ledger exists, or the stop rule is absent."
  },
  {
    stage: "validation",
    customerAction: "Run the first proof asset in the chosen channel and record counted signals, ignored weak signals, and objections.",
    websiteAction: "Provide the validation sprint and evidence language so page activity is not mistaken for demand.",
    manualAction: "The operator or founder interprets signals and decides continue, repair, pivot, or stop.",
    nextVisibleResult: "A validation decision backed by qualified replies, usable intake, payment plus intake, or repeated objections.",
    stopOrRepair: "Stop or repair when only page views, AI praise, sitemap success, or unqualified clicks appear."
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

export function getRouteProjectClientState(id: RouteProjectStageId) {
  return routeProjectClientStates.find((state) => state.stage === id) ?? routeProjectClientStates[0];
}
