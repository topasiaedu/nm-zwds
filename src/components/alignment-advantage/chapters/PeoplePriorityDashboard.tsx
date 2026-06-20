import React from "react";
import { C } from "../shared/constants";
import type { PeoplePriorityBarRow } from "../shared/helpers/peoplePalaceAnalysis";

interface PeoplePriorityDashboardProps {
  priorityBars: ReadonlyArray<PeoplePriorityBarRow>;
  resourcePalace: string | null;
  boundaryPalaces: ReadonlyArray<string>;
}

/** Priority bars aligned with Ch02 Wealth Code Distribution (display only). */
export const PeoplePriorityDashboard: React.FC<PeoplePriorityDashboardProps> = ({
  priorityBars,
  resourcePalace,
  boundaryPalaces,
}) => (
  <div>
    {(resourcePalace !== null || boundaryPalaces.length > 0) && (
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-[10px] font-bold uppercase tracking-wider">
        {resourcePalace !== null && (
          <span style={{ color: "#15803d" }}>Resource · {resourcePalace}</span>
        )}
        {boundaryPalaces.length > 0 && (
          <span style={{ color: C.coral }}>Boundary · {boundaryPalaces.join(", ")}</span>
        )}
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {priorityBars.map((row) => (
        <div key={row.palaceKey}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              {row.isPrimary && (
                <span
                  className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide shrink-0"
                  style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}30` }}
                >
                  Primary
                </span>
              )}
              <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{row.palaceLabel}</p>
            </div>
            <p className="text-sm font-bold shrink-0 ml-2" style={{ color: row.isPrimary ? C.coral : C.navy }}>
              {row.score}
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: C.border }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${row.score}%`,
                background: row.isPrimary
                  ? `linear-gradient(90deg, ${C.navy}, ${C.coral})`
                  : `linear-gradient(90deg, ${C.navy}88, ${C.navy}55)`,
              }}
            />
          </div>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
            {row.leadStar}
          </p>
        </div>
      ))}
    </div>
  </div>
);
