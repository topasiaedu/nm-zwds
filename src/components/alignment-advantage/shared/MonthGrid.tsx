/**
 * MonthGrid — Year-at-a-Glance Signal Strip
 *
 * Renders 12 month pills, each colour-coded by the traffic-light
 * signal (green / yellow / red) derived from the palace star rating.
 *
 * Interactive mode (default): clicking a pill notifies the parent to update
 * the active month.
 * Print / display-only mode: pills are a non-interactive legend showing
 * signal colors for the year (used by PDF export).
 *
 * This component contains NO logic — it receives all pre-computed data as props.
 */

import React from "react";
import { SIGNAL_STYLES, type SignalColor } from "../../../utils/forecast/alignmentTimingData";

/** Data for a single month pill. */
export interface MonthPillData {
  /** Solar month index 0–11. */
  monthIndex: number;
  /** Short month name ("Jan", "Feb", …). */
  shortName: string;
  /** Chinese palace name active for this month. */
  palaceName: string;
  /** Star rating (3–5) used to derive the signal colour. */
  stars: number;
  /** Pre-computed signal colour. */
  signal: SignalColor;
}

interface MonthGridProps {
  /** Pre-computed array of 12 month pill data items (index 0 = January). */
  months: ReadonlyArray<MonthPillData>;
  /**
   * Currently selected solar month index (0–11).
   * Ignored when `interactive` is false (print legend has no selection).
   */
  selectedMonthIndex?: number;
  /**
   * Callback when a pill is clicked.
   * Required when `interactive` is true; ignored when false.
   */
  onSelect?: (monthIndex: number) => void;
  /**
   * When false, pills are display-only (no clicks / pointer events).
   * Defaults to true for the in-app Execution Playbook.
   */
  interactive?: boolean;
}

/** Label copy for each signal. */
const SIGNAL_SHORT: Record<SignalColor, string> = {
  green: "Peak",
  yellow: "Caution",
  red: "Protect",
};

/**
 * MonthGrid component — displays a horizontal strip of 12 month pills.
 */
const MonthGrid: React.FC<MonthGridProps> = ({
  months,
  selectedMonthIndex,
  onSelect,
  interactive = true,
}) => {
  return (
    <div
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-white/5 backdrop-blur-sm p-4 shadow-sm"
      data-aa-month-picker=""
    >
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 px-1">
        Year at a Glance
      </p>
      <div
        className={[
          "grid grid-cols-6 gap-2 sm:grid-cols-12",
          interactive ? "" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={interactive ? undefined : true}
      >
        {months.map((m) => {
          const styles = SIGNAL_STYLES[m.signal];
          const isSelected =
            interactive &&
            selectedMonthIndex !== undefined &&
            m.monthIndex === selectedMonthIndex;

          const pillClassName = [
            "flex flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 border transition-all duration-200",
            interactive
              ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
              : "",
            isSelected
              ? `${styles.bg} ${styles.border} shadow-md scale-105`
              : "border-transparent hover:bg-gray-100 dark:hover:bg-white/5",
          ].join(" ");

          const pillBody = (
            <>
              <span
                className={[
                  "inline-block h-3 w-3 rounded-full shadow-sm",
                  styles.dot,
                  isSelected ? "ring-2 ring-offset-1 ring-current" : "",
                ].join(" ")}
                aria-hidden="true"
              />
              <span
                className={[
                  "text-[11px] font-bold leading-none",
                  isSelected ? styles.text : "text-gray-700 dark:text-gray-300",
                ].join(" ")}
              >
                {m.shortName}
              </span>
              <span
                className={[
                  "text-[9px] font-medium leading-none hidden sm:block",
                  isSelected ? styles.text : "text-gray-400 dark:text-gray-500",
                ].join(" ")}
              >
                {SIGNAL_SHORT[m.signal]}
              </span>
            </>
          );

          if (!interactive) {
            return (
              <div
                key={m.monthIndex}
                className={pillClassName}
                aria-label={`${m.shortName}: ${SIGNAL_SHORT[m.signal]}: ${m.palaceName}`}
              >
                {pillBody}
              </div>
            );
          }

          return (
            <button
              key={m.monthIndex}
              type="button"
              onClick={() => {
                if (onSelect !== undefined) {
                  onSelect(m.monthIndex);
                }
              }}
              aria-pressed={isSelected}
              aria-label={`${m.shortName}: ${SIGNAL_SHORT[m.signal]}: ${m.palaceName}`}
              className={pillClassName}
            >
              {pillBody}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthGrid;
