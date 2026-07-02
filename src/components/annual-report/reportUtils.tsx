/**
 * Shared display helpers for annual report components.
 */

import React from "react";
import type { BranchHarmonyType } from "../../utils/annual-report/types";

/**
 * Render 1–5 star rating.
 */
export function StarRating({ rating }: { rating: number }): React.ReactElement {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span className="text-amber-500 text-sm tracking-wider" aria-label={`${clamped} stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < clamped ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

/**
 * Format birth hour index into display range.
 */
export function formatBirthHour(hourIndex: string): string {
  const hour = parseInt(hourIndex, 10);
  if (Number.isNaN(hour)) {
    return hourIndex;
  }
  const timeRanges: { start: number; end: number; range: string }[] = [
    { start: 23, end: 1, range: "23:00–00:59" },
    { start: 1, end: 3, range: "01:00–02:59" },
    { start: 3, end: 5, range: "03:00–04:59" },
    { start: 5, end: 7, range: "05:00–06:59" },
    { start: 7, end: 9, range: "07:00–08:59" },
    { start: 9, end: 11, range: "09:00–10:59" },
    { start: 11, end: 13, range: "11:00–12:59" },
    { start: 13, end: 15, range: "13:00–14:59" },
    { start: 15, end: 17, range: "15:00–16:59" },
    { start: 17, end: 19, range: "17:00–18:59" },
    { start: 19, end: 21, range: "19:00–20:59" },
    { start: 21, end: 23, range: "21:00–22:59" },
  ];
  if (hour >= 23 || hour < 1) {
    return timeRanges[0].range;
  }
  for (const tr of timeRanges) {
    if (hour >= tr.start && hour < tr.end) {
      return tr.range;
    }
  }
  return timeRanges[0].range;
}

/**
 * Format ISO date for display.
 */
export function formatBirthDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Section heading component.
 */
export function SectionHeading({
  children,
  color = "#6b7280",
}: {
  children: React.ReactNode;
  color?: string;
}): React.ReactElement {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color }}>
      {children}
    </h3>
  );
}

/**
 * Trend arrow display component.
 */
export function TrendArrow({ trend }: { trend: "up" | "stable" | "down" }): React.ReactElement {
  const symbol = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return <span>{symbol}</span>;
}

const HARMONY_CLASS: Record<BranchHarmonyType, string> = {
  favorable: "annual-report-harmony-favorable",
  supportive: "annual-report-harmony-supportive",
  watchful: "annual-report-harmony-watchful",
  challenging: "annual-report-harmony-challenging",
  neutral: "annual-report-harmony-neutral",
};

const HARMONY_LABEL: Record<BranchHarmonyType, string> = {
  favorable: "Favorable",
  supportive: "Supportive",
  watchful: "Watchful",
  challenging: "Caution",
  neutral: "Neutral",
};

/**
 * Branch harmony badge for timing blocks.
 */
export function HarmonyBadge({ harmony }: { harmony: BranchHarmonyType }): React.ReactElement {
  return (
    <span className={`annual-report-harmony-badge ${HARMONY_CLASS[harmony]}`}>
      {HARMONY_LABEL[harmony]}
    </span>
  );
}

/**
 * Quarterly energy bar (0–5 scale).
 */
export function EnergyBar({ score, label }: { score: number; label: string }): React.ReactElement {
  const pct = Math.min(100, Math.max(0, (score / 5) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span>{score.toFixed(1)}/5</span>
      </div>
      <div className="annual-report-energy-bar">
        <div className="annual-report-energy-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
