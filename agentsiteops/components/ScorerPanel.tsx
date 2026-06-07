import Link from "next/link";

const scoreRows = [
  { label: "Search demand", value: 62 },
  { label: "AI citation fit", value: 84 },
  { label: "Original value", value: 88 },
  { label: "Compliance safety", value: 76 },
  { label: "90-day validation", value: 80 }
];

export function ScorerPanel() {
  return (
    <aside className="score-panel" aria-label="Website opportunity scorer preview">
      <div className="panel-header">
        <p className="panel-title">Website Opportunity Scorer</p>
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
          <strong>85</strong>
          <span>proceed</span>
        </div>
        <Link
          className="copy-button"
          data-analytics-event="cta_click"
          data-analytics-label="homepage_scorer_preview"
          data-analytics-target="/tools/website-opportunity-scorer/"
          href="/tools/website-opportunity-scorer/"
        >
          Open scorer
        </Link>
      </div>
    </aside>
  );
}
