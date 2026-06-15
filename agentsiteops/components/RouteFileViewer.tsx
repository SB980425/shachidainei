"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck } from "lucide-react";

type LabelValue = {
  label: string;
  value: string;
};

type RejectedRoute = {
  route: string;
  reason: string;
};

type LedgerItem = {
  claim: string;
  status: string;
  source: string;
  next: string;
};

type ValidationItem = {
  label: string;
  value: string;
};

type RouteFileViewerProps = {
  inputSnapshot: LabelValue[];
  selectedRoute: LabelValue[];
  rejectedAlternatives: RejectedRoute[];
  evidenceLedger: LedgerItem[];
  proofAsset: string[];
  validationChannel: ValidationItem[];
  stopRules: string[];
  notProven: string[];
};

const tabs = [
  { id: "input", label: "Input", Icon: FileText },
  { id: "decision", label: "Route", Icon: CheckCircle2 },
  { id: "ledger", label: "Evidence", Icon: ShieldCheck },
  { id: "validation", label: "Validation", Icon: CheckCircle2 },
  { id: "boundary", label: "Boundary", Icon: AlertTriangle }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function RouteFileViewer({
  inputSnapshot,
  selectedRoute,
  rejectedAlternatives,
  evidenceLedger,
  proofAsset,
  validationChannel,
  stopRules,
  notProven
}: RouteFileViewerProps) {
  const [activeTab, setActiveTab] = useState<TabId>("input");

  return (
    <section className="route-file-viewer" aria-label="Interactive Route File viewer">
      <div className="route-file-viewer-head">
        <div>
          <span>Route File Viewer</span>
          <h2>Inspect the handoff as one decision package.</h2>
        </div>
        <p>
          Switch between input, selected route, evidence, validation, and boundary. The
          sample stays fictional, but the structure is the required handoff standard.
        </p>
      </div>

      <div className="route-file-viewer-tabs" role="tablist" aria-label="Route File sections">
        {tabs.map((tab) => {
          const Icon = tab.Icon;
          const selected = activeTab === tab.id;

          return (
            <button
              aria-selected={selected}
              className={selected ? "is-active" : undefined}
              data-analytics-event="route_file_viewer_tab"
              data-analytics-label={tab.id}
              data-analytics-type="sample_route_file"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="route-file-viewer-body">
        {activeTab === "input" ? (
          <div className="route-file-viewer-grid">
            {inputSnapshot.map((item) => (
              <article key={item.label}>
                <small>{item.label}</small>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === "decision" ? (
          <div className="route-file-viewer-split">
            <div>
              <h3>Selected route</h3>
              <div className="route-file-viewer-stack">
                {selectedRoute.map((item) => (
                  <article key={item.label}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.value}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3>Rejected alternatives</h3>
              <div className="route-file-viewer-stack is-rejected">
                {rejectedAlternatives.map((item) => (
                  <article key={item.route}>
                    <AlertTriangle aria-hidden="true" size={18} />
                    <div>
                      <strong>{item.route}</strong>
                      <p>{item.reason}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "ledger" ? (
          <div className="route-file-viewer-table" role="table" aria-label="Sample evidence ledger">
            <div role="row">
              <strong role="columnheader">Claim</strong>
              <strong role="columnheader">Status</strong>
              <strong role="columnheader">Source</strong>
              <strong role="columnheader">Next evidence</strong>
            </div>
            {evidenceLedger.map((item) => (
              <div role="row" key={item.claim}>
                <span role="cell">{item.claim}</span>
                <span role="cell">{item.status}</span>
                <span role="cell">{item.source}</span>
                <span role="cell">{item.next}</span>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "validation" ? (
          <div className="route-file-viewer-split">
            <div>
              <h3>First proof asset</h3>
              <ul>
                {proofAsset.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Validation channel</h3>
              <div className="route-file-viewer-stack">
                {validationChannel.map((item) => (
                  <article key={item.label}>
                    <ShieldCheck aria-hidden="true" size={18} />
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.value}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "boundary" ? (
          <div className="route-file-viewer-split">
            <div>
              <h3>Stop rule</h3>
              <ul>
                {stopRules.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>What is not proven</h3>
              <ul>
                {notProven.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
