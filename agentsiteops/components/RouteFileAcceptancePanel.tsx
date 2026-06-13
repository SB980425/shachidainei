import { AlertTriangle, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";

const decisionRows = [
  {
    label: "Pass",
    body: "Send the Route File only when the six sections are present and weak evidence is labeled."
  },
  {
    label: "Repair",
    body: "Create a focused second-pass prompt when the route is useful but a section is missing."
  },
  {
    label: "Blocked",
    body: "Keep the project out of delivery when source rights, claims, buyer proof, or delivery capacity are unsafe."
  },
  {
    label: "Not delivery",
    body: "Reject broad memos, generic strategy, automatic-research claims, or outputs without a stop rule."
  }
];

const acceptanceRows = [
  {
    part: "Selected route",
    pass: "One route is named with confidence and evidence basis.",
    repair: "Several options remain open or the confidence reason is vague."
  },
  {
    part: "Rejected alternatives",
    pass: "Plausible paths are preserved with rejection reasons.",
    repair: "The file only says what to do and hides why other routes failed."
  },
  {
    part: "Evidence ledger",
    pass: "Claims are tagged as verified, pending, inferred, blocked, stale, or not claimed.",
    repair: "Public context, assumptions, and buyer proof are mixed together."
  },
  {
    part: "First proof asset",
    pass: "The smallest inspectable asset is named before more build work expands.",
    repair: "The next step is still broad production, content scaling, or checkout setup."
  },
  {
    part: "Validation channel",
    pass: "The first channel, counted signal, ignored signal, and review window are named.",
    repair: "The file treats page views, praise, or research context as proof."
  },
  {
    part: "Stop rule",
    pass: "A concrete condition blocks build, payment, content, or product expansion.",
    repair: "The plan keeps expanding without a stop, pivot, or rewrite trigger."
  }
];

export function RouteFileAcceptancePanel() {
  return (
    <section className="route-acceptance-panel" aria-label="Route File acceptance matrix">
      <div className="route-acceptance-head">
        <span>
          <FileCheck2 aria-hidden="true" size={16} />
          Route File acceptance
        </span>
        <h2>Pass the file, repair the research, or stop the handoff.</h2>
        <p>
          The acceptance matrix makes the final handoff inspectable. A client can compare
          the delivered file against each row before treating it as complete.
        </p>
      </div>

      <div className="route-acceptance-states">
        {decisionRows.map((item) => (
          <article key={item.label}>
            {item.label === "Pass" ? (
              <CheckCircle2 aria-hidden="true" size={18} />
            ) : (
              <AlertTriangle aria-hidden="true" size={18} />
            )}
            <h3>{item.label}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="route-acceptance-table" role="table" aria-label="Acceptance rows">
        <div role="row">
          <strong role="columnheader">Section</strong>
          <strong role="columnheader">Pass condition</strong>
          <strong role="columnheader">Repair trigger</strong>
        </div>
        {acceptanceRows.map((item) => (
          <div role="row" key={item.part}>
            <span role="cell">
              <ShieldCheck aria-hidden="true" size={16} />
              {item.part}
            </span>
            <p role="cell">{item.pass}</p>
            <p role="cell">{item.repair}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
