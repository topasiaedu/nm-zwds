/**
 * Timing Sync band banner + three-layer season alignment stack.
 */

import React from "react";
import type { ConvergenceResult } from "../../../utils/forecast/monthlyConsultation";
import { C } from "../../alignment-advantage/shared/constants";

export interface AlignmentBandsProps {
  convergence: ConvergenceResult;
  decadeLabel: string;
  yearLabel: string;
  monthLabel: string;
}

/**
 * Band colour for aligned / partial / clash.
 */
const bandMeta = (
  band: ConvergenceResult["band"]
): { color: string; bg: string; title: string } => {
  if (band === "aligned") {
    return { color: "#047857", bg: "#ecfdf5", title: "In sync" };
  }
  if (band === "partial") {
    return { color: C.gold, bg: "#fffbeb", title: "Mixed signals" };
  }
  return { color: C.coral, bg: "#fff7ed", title: "At odds" };
};

/**
 * Compare two season strings for a match indicator.
 */
const seasonsMatch = (a: string, b: string): boolean => {
  const normalize = (s: string): string => s.toLowerCase().split("(")[0]?.trim() ?? "";
  return normalize(a) === normalize(b) && normalize(a).length > 0;
};

/**
 * Visual Timing Sync banner and decade / year / month alignment rows.
 */
export const AlignmentBands: React.FC<AlignmentBandsProps> = ({
  convergence,
  decadeLabel,
  yearLabel,
  monthLabel,
}) => {
  const meta = bandMeta(convergence.band);
  const rows = [
    { label: "Decade", value: decadeLabel },
    { label: "Year", value: yearLabel },
    { label: "Month", value: monthLabel },
  ];
  const monthNorm = monthLabel;

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: meta.bg, border: `1px solid ${meta.color}44` }}
      >
        <span
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: `${meta.color}22`, color: meta.color }}
          aria-hidden="true"
        >
          {convergence.band === "aligned" ? "✓" : convergence.band === "partial" ? "~" : "!"}
        </span>
        <div>
          <p className="text-sm font-bold" style={{ color: meta.color }}>
            {meta.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            {convergence.label} · score {String(convergence.score)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((row) => {
          const matchesMonth =
            row.label === "Month" ? true : seasonsMatch(row.value, monthNorm);
          const indicator = matchesMonth ? "✓" : "✗";
          const indicatorColor = matchesMonth ? "#047857" : C.coral;
          return (
            <div
              key={row.label}
              className="rounded-xl px-3 py-2.5 flex items-center justify-between gap-3"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: `1px solid ${C.border}`,
              }}
            >
              <div className="min-w-0 flex items-center gap-2.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider shrink-0 w-14"
                  style={{ color: C.coral }}
                >
                  {row.label}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${C.gold}22`,
                    color: C.navy,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {row.value}
                </span>
              </div>
              <span
                className="text-sm font-bold shrink-0"
                style={{ color: indicatorColor }}
                aria-label={matchesMonth ? "Aligned with month" : "Clash with month"}
              >
                {indicator}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
