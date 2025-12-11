/**
 * Phase Intensity Chart Component
 * 
 * Visualizes the 10-year energy curve showing building, peak, and integration phases.
 * Current year is highlighted with gradient colors.
 */

import React from "react";
import type { DayunCycleExtended } from "../../types/dayun";
import { SEASON_COLORS } from "../../utils/dayun/seasonMapper";

interface PhaseIntensityChartProps {
  dayun: DayunCycleExtended;
}

type Phase = {
  years: string;
  label: string;
  description: string;
  isCurrent: boolean;
};

/**
 * PhaseIntensityChart component displays the energy curve across the 10-year cycle
 */
export const PhaseIntensityChart: React.FC<PhaseIntensityChartProps> = ({ dayun }) => {
  const seasonColor = SEASON_COLORS[dayun.season];
  
  const currentYear = dayun.currentYear - dayun.startYear + 1;
  const years = Array.from({ length: 10 }, (_, i) => i + 1);
  
  /**
   * Get gradient colors matching hero card style
   */
  const getGradientColors = (season: string) => {
    switch (season) {
      case "spring":
        return "linear-gradient(to top, #10b981, #059669)"; // emerald-500 to emerald-600
      case "summer":
        return "linear-gradient(to top, #f59e0b, #eab308)"; // amber-500 to yellow-500
      case "autumn":
        return "linear-gradient(to top, #f97316, #ef4444)"; // orange-500 to red-500
      case "winter":
        return "linear-gradient(to top, #3b82f6, #06b6d4)"; // blue-500 to cyan-500
      default:
        return "linear-gradient(to top, #6b7280, #4b5563)";
    }
  };
  
  // Determine which strategic phase the user is currently in
  const isInFoundationPhase = currentYear <= 5;
  
  /**
   * Conditional phases based on current year position
   * Years 1-5: Strategic Foundation (can't afford wrong decisions)
   * Years 6-10: Maximize & Scale (execute and expand)
   */
  const phases: Phase[] = isInFoundationPhase ? [
    { 
      years: "1-5", 
      label: "Plan & Strategize", 
      description: "Find your exact money path",
      isCurrent: true
    },
    { 
      years: "6-10", 
      label: "Future: Maximize", 
      description: "Scale what works",
      isCurrent: false
    },
  ] : [
    { 
      years: "1-5", 
      label: "Foundation Built", 
      description: "Strategic base established",
      isCurrent: false
    },
    { 
      years: "6-10", 
      label: "Maximize & Scale", 
      description: "Execute and expand",
      isCurrent: true
    },
  ];

  /**
   * Calculate bar height based on year position in cycle
   * Creates clear visual differences between building, peak, and integration
   */
  const getBarHeight = (year: number): number => {
    if (year <= 3) {
      // Building phase: 75px, 90px, 105px
      return 60 + (year * 15);
    } else if (year >= 4 && year <= 6) {
      // Peak phase: 150px, 170px, 190px (tallest)
      return 130 + ((year - 3) * 20);
    } else {
      // Integration phase: 135px, 120px, 105px, 90px
      return 150 - ((year - 6) * 15);
    }
  };

  // Context-aware messaging based on current year
  const contextualTitle = isInFoundationPhase 
    ? "Years 1-5: Strategic Foundation Phase" 
    : "Years 6-10: Maximize & Scale Phase";
  
  const contextualDescription = isInFoundationPhase
    ? "You're in the critical foundation years. Wrong starting point = wasted 10 years. Focus on finding your exact money path and core strengths before expanding."
    : "Foundation established. Time to maximize returns and scale proven strategies. Execute with confidence and prepare for cycle transition.";

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
        {contextualTitle}
      </h4>
      <p className="text-sm mb-5 text-gray-600 dark:text-gray-400">
        {contextualDescription}
      </p>
      
      {/* Intensity Chart */}
      <div className="mb-6">
        <div className="relative flex items-end justify-between gap-2 mb-3 px-2" style={{ height: "200px" }}>
          {years.map((year) => {
            const heightPx = getBarHeight(year);
            const isCurrent = year === currentYear;
            
            return (
              <div key={year} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="relative w-full flex items-end justify-center" style={{ height: "100%" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 relative overflow-hidden ${
                      isCurrent
                        ? "shadow-xl"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    style={{ 
                      height: `${heightPx}px`
                    }}
                  >
                    {isCurrent && (
                      <>
                        {/* Season Gradient Background */}
                        <div 
                          className="absolute inset-0 opacity-90 dark:opacity-95"
                          style={{ 
                            backgroundImage: getGradientColors(dayun.season)
                          }}
                        />
                        
                        {/* Subtle Pattern Overlay */}
                        <div 
                          className="absolute inset-0" 
                          style={{
                            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,.08) 1px, transparent 1px),
                                             radial-gradient(circle at 80% 80%, rgba(255,255,255,.08) 1px, transparent 1px)`,
                            backgroundSize: "20px 20px"
                          }} 
                        />
                        
                        {/* Year Label */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                          <div className="relative overflow-hidden rounded-full shadow-lg">
                            {/* Label Gradient Background */}
                            <div 
                              className="absolute inset-0 opacity-90 dark:opacity-95"
                              style={{ 
                                backgroundImage: getGradientColors(dayun.season).replace("to top", "to right")
                              }}
                            />
                            
                            {/* Label Content */}
                            <span className="relative text-xs font-bold px-3 py-1.5 text-white drop-shadow-md flex items-center">
                              Year {year}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <span 
                  className={`text-xs ${isCurrent ? "font-bold" : ""} text-gray-600 dark:text-gray-400`}
                  style={{ color: isCurrent ? seasonColor.primary : undefined }}
                >
                  {year}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Phase Labels */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {phases.map((phase) => {
            return (
              <div
                key={phase.years}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  phase.isCurrent
                    ? "border-2 shadow-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500"
                    : "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 opacity-60"
                }`}
                style={phase.isCurrent ? { borderColor: seasonColor.primary } : undefined}
              >
                {/* Current badge */}
                {phase.isCurrent && (
                  <div className="mb-2">
                    <span 
                      className="text-xs font-bold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: seasonColor.primary }}
                    >
                      YOU ARE HERE
                    </span>
                  </div>
                )}
                
                <div className="text-sm font-bold mb-1 text-gray-900 dark:text-white">
                  Years {phase.years}
                </div>
                <div 
                  className={`text-xs font-semibold mb-1 ${
                    phase.isCurrent ? "" : "text-gray-600 dark:text-gray-400"
                  }`} 
                  style={phase.isCurrent ? { color: seasonColor.primary } : undefined}
                >
                  {phase.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {phase.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
