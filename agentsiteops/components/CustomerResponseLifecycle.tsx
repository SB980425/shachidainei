import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  MailCheck,
  SearchCheck,
  ShieldCheck,
  UserCheck
} from "lucide-react";

const responseStages = [
  {
    label: "Automated receipt",
    title: "Packet prepared",
    body:
      "The site can format the intake, show the next status, and prepare an email. This confirms receipt only; it is not research acceptance.",
    Icon: MailCheck
  },
  {
    label: "Operator review",
    title: "Scope and evidence check",
    body:
      "A human/operator checks whether the request has a route question, usable facts, source rights, safety limits, and delivery capacity.",
    Icon: UserCheck
  },
  {
    label: "Repair request",
    title: "Missing input is requested",
    body:
      "If facts, source boundaries, buyer proof, or constraints are missing, the next response asks for exact repair items instead of starting broad research.",
    Icon: AlertTriangle
  },
  {
    label: "Research channel",
    title: "Carrier can change",
    body:
      "The accepted brief can run through an approved research channel, manual source review, client-provided report, or AI research tool. The Route File standard stays fixed.",
    Icon: SearchCheck
  },
  {
    label: "Coverage gate",
    title: "Report must pass",
    body:
      "The returned material is checked for buyer logic, source table, rejected alternatives, evidence tags, proof asset, validation channel, and stop rule.",
    Icon: FileCheck2
  },
  {
    label: "Route File",
    title: "Decision file handoff",
    body:
      "Only the fused Route File is delivery: selected route, rejected paths, evidence ledger, first proof asset, validation channel, and stop rule.",
    Icon: ClipboardCheck
  }
];

const boundaryRows = [
  {
    title: "Automatic",
    body: "Receipt, packet formatting, visible status, copy/email preparation, and checklist state.",
    Icon: CheckCircle2
  },
  {
    title: "Human/operator",
    body: "Acceptance judgment, research-channel choice, source-quality review, gap handling, and final route synthesis.",
    Icon: UserCheck
  },
  {
    title: "Not automatic",
    body: "Hidden research, guaranteed traffic, guaranteed revenue, market proof, or unsupported buyer response.",
    Icon: ShieldCheck
  }
];

export function CustomerResponseLifecycle() {
  return (
    <section className="customer-response-lifecycle" aria-label="Customer response lifecycle">
      <div className="customer-response-head">
        <div>
          <span>After submission</span>
          <h2>Submission creates a response path, not an automatic research result.</h2>
          <p>
            The customer-facing promise is simple: intake creates a visible packet, the
            operator decides whether it is ready, missing inputs are requested, and the
            final handoff is a checked Route File.
          </p>
        </div>
        <aside>
          <strong>Core rule</strong>
          <p>
            Research tooling is replaceable. The deliverable is not tied to one model,
            vendor, or UI; it is tied to the Route File acceptance standard.
          </p>
        </aside>
      </div>

      <div className="customer-response-stage-grid">
        {responseStages.map((stage, index) => {
          const Icon = stage.Icon;

          return (
            <article key={stage.label}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" size={19} />
              </div>
              <small>{stage.label}</small>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </article>
          );
        })}
      </div>

      <div className="customer-response-boundary">
        {boundaryRows.map((item) => {
          const Icon = item.Icon;

          return (
            <article key={item.title}>
              <Icon aria-hidden="true" size={18} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
