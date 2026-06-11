import Link from "next/link";

const scoreRows = [
  { label: "Offer clarity", value: 82 },
  { label: "Buyer trigger", value: 74 },
  { label: "Page readiness", value: 78 },
  { label: "Outreach path", value: 69 },
  { label: "Risk boundary", value: 86 }
];

export function ScorerPanel() {
  return (
    <aside className="score-panel" aria-label="Launch readiness preview">
      <div className="panel-header">
        <div>
          <p className="panel-title">Launch Readiness</p>
          <p className="panel-subtitle">A quick signal map before buying a Blueprint</p>
        </div>
        <span className="status-dot">Ready</span>
      </div>
      <div className="score-rows">
        {scoreRows.map((row) => (
          <div className="score-row" key={row.label}>
            <label>{row.label}</label>
            <div className="score-track" aria-label={`${row.label} ${row.value}`}>
              <span style={{ width: `${row.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="panel-footer">
        <div className="score-result">
          <strong>78</strong>
          <span>package</span>
        </div>
        <Link
          className="copy-button"
          data-analytics-event="cta_click"
          data-analytics-label="homepage_scorer_preview"
          data-analytics-target="/tools/website-opportunity-scorer/"
          href="/tools/website-opportunity-scorer/"
        >
          Open free scorer
        </Link>
      </div>
    </aside>
  );
}
