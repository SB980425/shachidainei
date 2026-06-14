import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  Languages,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { socialCopyBoundaryRows, socialCopyPreviewRows } from "@/lib/socialCopy";

const inputRows = [
  {
    label: "Project facts",
    status: "Ready",
    owner: "Client",
    body: "Target user, project goal, current assets, constraints, and the decision that blocks the next build."
  },
  {
    label: "Source boundary",
    status: "Ready",
    owner: "Client + operator",
    body: "Public sources, private notes, source permissions, and material that must stay out of this route run."
  },
  {
    label: "Risk boundary",
    status: "Ready",
    owner: "Operator",
    body: "Blocked claims, data-rights limits, delivery capacity, regulated-advice limits, and payment constraints."
  },
  {
    label: "Evidence gap",
    status: "Weak",
    owner: "Gate",
    body: "Buyer proof, payment evidence, search exports, and qualified replies remain pending until first-party records exist."
  }
];

const stageRows = [
  {
    step: "01",
    label: "Intake",
    status: "Passed",
    owner: "Client",
    output: "Usable route brief",
    body: "The project has enough facts to create a narrow route question instead of a broad research request."
  },
  {
    step: "02",
    label: "Scope lock",
    status: "Passed",
    owner: "Operator",
    output: "Research boundary",
    body: "The first run is limited to one route decision, accepted sources, blocked claims, and rejected non-goals."
  },
  {
    step: "03",
    label: "Manual research",
    status: "Active",
    owner: "ChatGPT Deep Research",
    output: "Cited report",
    body: "The operator runs the prompt outside the website with the user's own ChatGPT Deep Research allowance."
  },
  {
    step: "04",
    label: "Coverage gate",
    status: "Repair watch",
    owner: "Site",
    output: "Pass or gap prompt",
    body: "The returned report must cover sources, buyer logic, alternatives, evidence ledger, proof asset, channel, and stop rule."
  },
  {
    step: "05",
    label: "Route File",
    status: "Pending",
    owner: "Operator",
    output: "Fused decision file",
    body: "Accepted research becomes one client-readable file with selected route and rejected alternatives."
  },
  {
    step: "06",
    label: "Public copy",
    status: "Pending",
    owner: "Site",
    output: "Chinese + English copy",
    body: "The route is translated for public updates without adding traffic, ranking, revenue, or automation claims."
  }
];

const passRows = [
  "Input boundary is visible before research starts.",
  "Manual Deep Research is named as an external user-allowance step.",
  "Coverage gate has pass, repair, blocked, and not-delivery states.",
  "Route File sections are fixed before public copy is written."
];

const repairRows = [
  "No source table or no separation between proof and context.",
  "Selected route has no rejected alternatives or rejection reasons.",
  "Buyer problem, first proof asset, or validation channel is vague.",
  "Report drifts into domain content that does not change the route decision."
];

const routeFileRows = [
  {
    label: "Selected route",
    body: "One route to test first, confidence level, and evidence basis."
  },
  {
    label: "Rejected alternatives",
    body: "Plausible paths that failed evidence, delivery, buyer-value, or risk checks."
  },
  {
    label: "Evidence ledger",
    body: "Verified, pending, inferred, stale, blocked, and not-claimed items."
  },
  {
    label: "First proof asset",
    body: "The smallest page, sample, tool, checklist, or outreach artifact to test."
  },
  {
    label: "Validation channel",
    body: "The first channel, signal threshold, review window, and non-proof signals."
  },
  {
    label: "Stop rule",
    body: "The condition that blocks checkout, content scaling, or build expansion."
  }
];

const nonDeliveryRows = [
  "Guaranteed traffic, ranking, AI citation, revenue, or customer response.",
  "A hidden automatic Deep Research workflow or website-side OpenAI API claim.",
  "A broad research article with no route decision, proof asset, or stop condition.",
  "Public social copy that changes the evidence boundary of the Route File."
];

export function ClientRouteWorkspace() {
  return (
    <section className="client-route-workspace" aria-label="Client route workspace preview">
      <div className="client-workspace-head">
        <div>
          <span>Client workspace</span>
          <h2>一个客户能看懂的项目进度页。</h2>
          <p>
            这个模块把 AgentSiteOps 的后台方法压缩成客户可观察状态：输入是否可用、
            当前阶段在哪里、哪些内容已通过、哪些缺口触发补研、最终 Route File 交付什么。
          </p>
        </div>
        <div className="client-workspace-status">
          <strong>Simulated project</strong>
          <span>63%</span>
          <p>Manual Deep Research active. Coverage gate is the next acceptance point.</p>
        </div>
      </div>

      <div className="client-workspace-inputs" aria-label="Client input readiness">
        {inputRows.map((item) => (
          <article className={item.status === "Weak" ? "is-weak" : "is-ready"} key={item.label}>
            <small>{item.status}</small>
            <h3>{item.label}</h3>
            <strong>{item.owner}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="client-workspace-main">
        <div className="client-workspace-timeline" aria-label="Project stage progress">
          {stageRows.map((stage) => (
            <article key={stage.step}>
              <div>
                <span>{stage.step}</span>
                <strong>{stage.status}</strong>
              </div>
              <h3>{stage.label}</h3>
              <p>{stage.body}</p>
              <dl>
                <div>
                  <dt>Owner</dt>
                  <dd>{stage.owner}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{stage.output}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <aside className="client-workspace-gates" aria-label="Coverage and repair gates">
          <div>
            <span>
              <CheckCircle2 aria-hidden="true" size={16} />
              Passed
            </span>
            <ul>
              {passRows.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="is-repair">
            <span>
              <AlertTriangle aria-hidden="true" size={16} />
              Triggers second research
            </span>
            <ul>
              {repairRows.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="client-workspace-file">
        <article className="client-route-file-paper">
          <div>
            <span>Route File v1.0</span>
            <strong>Final structure preview</strong>
            <em>Client-readable</em>
          </div>
          <div className="client-route-file-grid">
            {routeFileRows.map((item) => (
              <section key={item.label}>
                <FileText aria-hidden="true" size={16} />
                <h3>{item.label}</h3>
                <p>{item.body}</p>
              </section>
            ))}
          </div>
        </article>

        <aside className="client-workspace-non-delivery">
          <span>
            <ShieldCheck aria-hidden="true" size={16} />
            Not delivery
          </span>
          <ul>
            {nonDeliveryRows.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="client-workspace-social" aria-label="Bilingual route copy">
        <div>
          <span>
            <Languages aria-hidden="true" size={16} />
            Social copy boundary
          </span>
          <h3>中英文可以转换，承诺边界不能改变。</h3>
        </div>
        {socialCopyPreviewRows.map((item) => (
          <article key={item.language}>
            <strong>{item.language}</strong>
            <p>{item.text}</p>
          </article>
        ))}
        <div className="client-social-boundary" aria-label="Social copy claim boundary">
          {socialCopyBoundaryRows.map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <Link prefetch={false} href="/execution/">
          Open execution workbench
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>

      <div className="client-workspace-links">
        <Link prefetch={false} href="/intake/">
          <ClipboardList aria-hidden="true" size={16} />
          Open intake
        </Link>
        <Link prefetch={false} href="/templates/route-research-prompt-pack/">
          <SearchCheck aria-hidden="true" size={16} />
          Prompt pack
        </Link>
        <Link prefetch={false} href="/delivery-gate/">
          <FileCheck2 aria-hidden="true" size={16} />
          Delivery gate
        </Link>
        <Link prefetch={false} href="/sample/">
          <FileText aria-hidden="true" size={16} />
          Sample Route File
        </Link>
      </div>
    </section>
  );
}
