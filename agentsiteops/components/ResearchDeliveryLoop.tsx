"use client";

import { useState } from "react";
import { CheckCircle2, Play, SearchCheck } from "lucide-react";
import { researchDeliveryStages } from "@/lib/routeResearchPromptPack";

export function ResearchDeliveryLoop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = researchDeliveryStages[activeIndex];
  const nextIndex = activeIndex === researchDeliveryStages.length - 1 ? 0 : activeIndex + 1;

  return (
    <div className="research-workflow-panel">
      <div className="research-progress-rail" aria-label={`Research workflow ${activeStage.percent}%`}>
        <span style={{ width: `${activeStage.percent}%` }} />
      </div>

      <div className="research-workflow-current">
        <div>
          <span>{activeStage.percent}%</span>
          <h3>{activeStage.title}</h3>
          <p>{activeStage.visibleStatus}</p>
        </div>
        <dl>
          <div>
            <dt>Window</dt>
            <dd>{activeStage.window}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{activeStage.output}</dd>
          </div>
        </dl>
      </div>

      <div className="research-step-strip" aria-label="Research delivery checkpoints">
        {researchDeliveryStages.map((stage, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <button
              type="button"
              className={isActive ? "is-active" : ""}
              key={stage.title}
              onClick={() => setActiveIndex(index)}
            >
              {isComplete ? (
                <CheckCircle2 aria-hidden="true" size={15} />
              ) : (
                <SearchCheck aria-hidden="true" size={15} />
              )}
              <span>{stage.percent}%</span>
              <strong>{stage.title}</strong>
            </button>
          );
        })}
      </div>

      <div className="research-gate-note">
        <p>
          This panel previews the manual workflow. If the coverage gate fails, missing
          items become a focused second-pass brief for ChatGPT Deep Research before
          synthesis. The final delivery is one fused route file, not two unrelated reports.
        </p>
        <button type="button" onClick={() => setActiveIndex(nextIndex)}>
          <Play aria-hidden="true" size={15} />
          Preview next manual checkpoint
        </button>
      </div>
    </div>
  );
}
