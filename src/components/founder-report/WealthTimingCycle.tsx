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
    <div
      className="relative rounded-3xl overflow-hidden mb-8"
      style={{
        background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
        padding: "32px 40px",
        boxShadow: "0 10px 40px rgba(251, 146, 60, 0.3)",
        border: "3px solid rgba(251, 146, 60, 0.8)",
        animation: "pulse-border 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 10px 40px rgba(251, 146, 60, 0.4), 0 0 0 0 rgba(251, 146, 60, 1), 0 0 20px rgba(251, 146, 60, 0.6);
          }
          50% {
            box-shadow: 0 10px 60px rgba(251, 146, 60, 0.8), 0 0 0 15px rgba(251, 146, 60, 0), 0 0 40px rgba(251, 146, 60, 0.3);
          }
        }
      `}</style>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <span
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              color: "#ea580c",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "800",
            }}
          >
            02
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            Wealth Timing Cycle
          </h2>
        </div>
        <p
          style={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: "500",
            marginTop: "8px",
            opacity: 0.95,
          }}
        >
          Discover your 10-year life season — what to build, launch, or refine right now
        </p>
      </div>
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

