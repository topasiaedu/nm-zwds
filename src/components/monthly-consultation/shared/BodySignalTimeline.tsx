/**
 * Vertical timeline for Body chapter week-by-week signals.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";

export interface BodySignalWeek {
  week: string;
  signal: string;
}

export interface BodySignalTimelineProps {
  weeks: BodySignalWeek[];
}

/**
 * Timeline chart: vertical rail with week nodes and signal copy.
 */
export const BodySignalTimeline: React.FC<BodySignalTimelineProps> = ({
  weeks,
}) => {
  const rows = weeks.slice(0, 4);

  return (
    <div className="relative">
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;
        const weekNum = String(index + 1);
        return (
          <div
            key={`${row.week}-${row.signal}`}
            className="relative flex gap-4 pb-5 last:pb-0"
          >
            <div className="relative flex flex-col items-center shrink-0 w-10">
              <span
                className="relative z-[1] w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: C.coral,
                  color: C.white,
                  border: `3px solid ${C.coral}33`,
                }}
                aria-hidden="true"
              >
                {`W${weekNum}`}
              </span>
              {!isLast && (
                <span
                  className="absolute top-10 bottom-[-1.25rem] left-1/2 -translate-x-1/2 w-0.5"
                  style={{ background: `${C.coral}55` }}
                  aria-hidden="true"
                />
              )}
            </div>

            <div
              className="flex-1 min-w-0 rounded-2xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${C.coral}`,
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: C.coral }}
              >
                {row.week}
              </p>
              <p className="text-sm font-medium leading-snug" style={{ color: C.navy }}>
                {row.signal}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
