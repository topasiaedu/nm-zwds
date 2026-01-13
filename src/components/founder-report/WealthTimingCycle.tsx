/**
 * Founder Timing Decision System Report — Section 02: Wealth Timing Cycle
 *
 * Purpose:
 * - Provide an at-a-glance, founder-friendly interpretation of the user's current Dayun season
 *   (Spring/Summer/Autumn/Winter) to guide what to prioritize right now.
 *
 * Constraints:
 * - Strict TypeScript (no `any`, no non-null assertions, no `unknown` casts).
 * - Deterministic output (no randomness).
 */
import React, { useMemo } from "react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { DayunSection } from "../dayun";

export interface WealthTimingCycleProps {
  /** Complete ZWDS chart data. */
  chartData: ChartData;
}


/**
 * Section header (aligned to Founder Report patterns).
 */
const WealthTimingHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-4xl dark:text-white font-bold mb-2">{"WEALTH TIMING CYCLE"}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{"Your Current Season"}</p>
    </div>
  );
};

export const WealthTimingCycle: React.FC<WealthTimingCycleProps> = ({ chartData }) => {
  const dayun = useMemo(() => calculateCurrentDayunCycle(chartData), [chartData]);

  if (!dayun) {
    return (
      <div className="p-6 dark:bg-gray-900">
        <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>
        <WealthTimingHeader />
        <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-6">
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">{"Data unavailable"}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {"We couldn't detect a valid Dayun cycle for this profile. Please confirm the profile details and try again."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider (match other Founder Report sections) */}
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      <WealthTimingHeader />

      <DayunSection chartData={chartData} showHeader={false} />
    </div>
  );
};

