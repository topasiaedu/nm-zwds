import React from "react";
import { C } from "./constants";
import { PhaseActionsSvg } from "./phaseWealthVisuals";

export interface WhatToDoNowListProps {
  actions: string[];
}

/**
 * Numbered action plan list for AA "What To Do Now" sections.
 * Mobile: stacked badge + full-width copy with dividers (no nested card).
 * Desktop: compact row layout inside the white bordered card.
 */
export const WhatToDoNowList: React.FC<WhatToDoNowListProps> = ({ actions }) => (
  <div
    className="md:rounded-3xl md:overflow-hidden md:relative md:min-h-[220px] md:bg-white md:border md:border-[#1a1e3f35]"
    data-aa-what-to-do-list=""
  >
    <div className="hidden md:block absolute right-5 top-5 w-20 h-20 opacity-5 pointer-events-none">
      <PhaseActionsSvg />
    </div>
    <div className="md:p-6 md:space-y-4 relative z-10">
      {actions.map((action, idx) => {
        const isLast = idx === actions.length - 1;
        return (
          <div
            key={`action-${idx}-${action.slice(0, 24)}`}
            data-aa-numbered-list-row=""
            className={[
              "py-5 md:py-0",
              !isLast ? "border-b md:border-b-0" : "",
              "md:flex md:items-start md:gap-3",
            ].join(" ")}
            style={!isLast ? { borderColor: C.border } : undefined}
          >
            <span
              className={[
                "inline-flex items-center justify-center rounded-full font-bold shrink-0",
                "w-9 h-9 text-xs mb-3",
                "md:w-6 md:h-6 md:text-[10px] md:mb-0 md:mt-0.5",
              ].join(" ")}
              style={{
                background: `${C.coral}15`,
                color: C.coral,
                border: `1px solid ${C.coral}30`,
              }}
            >
              {idx + 1}
            </span>
            <p
              className="text-[15px] leading-[1.65] md:text-sm md:leading-snug"
              style={{ color: C.navy }}
            >
              {action}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);
