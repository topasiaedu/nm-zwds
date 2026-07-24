/**
 * Week planner tile with quality colour banner.
 */

import React from "react";
import type { WeekPlanRow } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";
import {
  InlineSvgWeekQuality,
  weekQualityIconKind,
} from "./chapterIcons";

/**
 * Map week quality label to a banner colour.
 */
const qualityColor = (quality: string): string => {
  const q = quality.toLowerCase();
  if (q.includes("push") || q.includes("best")) {
    return "#047857";
  }
  if (q.includes("careful") || q.includes("prepare")) {
    return C.gold;
  }
  if (q.includes("steady")) {
    return "#2563eb";
  }
  return C.muted;
};

export interface WeekTileProps {
  row: WeekPlanRow;
  weekIndex: number;
}

/**
 * One week card for the calendar chapter.
 */
export const WeekTile: React.FC<WeekTileProps> = ({ row, weekIndex }) => {
  const accent = qualityColor(row.quality);
  const iconKind = weekQualityIconKind(row.quality);
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.8)" }}
    >
      <div
        className="px-3 py-2 flex items-center justify-between gap-2"
        style={{ background: accent }}
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
          <InlineSvgWeekQuality kind={iconKind} />
          W{String(weekIndex)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
          {row.quality}
        </span>
      </div>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <p className="text-xs font-semibold" style={{ color: C.coral }}>
          {row.window}
        </p>
        <p className="text-sm leading-snug" style={{ color: C.navy }}>
          {row.useFor}
        </p>
      </div>
    </div>
  );
};

export interface WeekTileRowProps {
  weeks: WeekPlanRow[];
}

/**
 * Four-column week planner row (stacks on small screens).
 */
export const WeekTileRow: React.FC<WeekTileRowProps> = ({ weeks }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
    {weeks.slice(0, 4).map((row, index) => (
      <WeekTile key={row.window} row={row} weekIndex={index + 1} />
    ))}
  </div>
);
