/**
 * Phase Intensity Chart Component
 * 
 * Visualizes the 10-year energy curve as a line chart.
 * Uses specific intensity values for each year showing U-shaped progression.
 */

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
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
  const currentYear = dayun.currentYear - dayun.startYear + 1;
  
  /**
   * Get gradient colors matching hero card style
   */
  const getGradientColors = (season: string): string => {
    switch (season) {
      case "spring":
        return "#10b981"; // emerald-500
      case "summer":
        return "#f59e0b"; // amber-500
      case "autumn":
        return "#f97316"; // orange-500
      case "winter":
        return "#3b82f6"; // blue-500
      default:
        return "#6b7280"; // gray-500
    }
  };
  
  /**
   * Get specific intensity value for each year
   * U-shaped curve with lowest point at year 4
   */
  const getIntensityValue = (year: number): number => {
    const intensityValues: Record<number, number> = {
      1: 550,  // Start
      2: 289,  // Declining
      3: 144,  // Near bottom
      4: 100,  // Lowest point
      5: 139,  // Beginning ascent
      6: 244,  // Rising
      7: 400,  // Accelerating
      8: 589,  // Strong rise
      9: 794,  // Near peak
      10: 1000 // Peak
    };
    return intensityValues[year] || 550;
  };
  
  /**
   * Prepare chart data
   */
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    return {
      year: year,
      intensity: getIntensityValue(year),
      name: `Year ${year}`
    };
  });
  
  // Determine which strategic phase the user is currently in
  const isInFoundationPhase = currentYear <= 5;
  
  /**
   * Strategic phases for the 10-year cycle:
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

  // Context-aware messaging based on current year
  const contextualTitle = isInFoundationPhase 
    ? "Years 1-5: Strategic Foundation Phase" 
    : "Years 6-10: Maximize & Scale Phase";
  
  const contextualDescription = isInFoundationPhase
    ? "You're in the critical foundation years. Wrong starting point = wasted 10 years. Focus on finding your exact money path and core strengths before expanding."
    : "Foundation established. Time to maximize returns and scale proven strategies. Execute with confidence and prepare for cycle transition.";

  const lineColor = getGradientColors(dayun.season);

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
        {contextualTitle}
      </h4>
      <p className="text-sm mb-5 text-gray-600 dark:text-gray-400">
        {contextualDescription}
      </p>
      
      {/* Layout: Phase labels on left, chart on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Phase Labels - Left Side */}
        <div className="space-y-4">
          {phases.map((phase) => (
            <div
              key={phase.years}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                phase.isCurrent
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-700 shadow-md"
                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${
                      phase.isCurrent 
                        ? "text-blue-700 dark:text-blue-400" 
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      Years {phase.years}
                    </span>
                    {phase.isCurrent && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                        NOW
                      </span>
                    )}
                  </div>
                  <div className={`text-base font-semibold mb-1 ${
                    phase.isCurrent 
                      ? "text-gray-900 dark:text-white" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {phase.label}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {phase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart - Right Side */}
        <div className="w-full" style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year"
                label={{ value: "Year", position: "insideBottom", offset: -10, className: "fill-gray-600 dark:fill-gray-400" }}
                tick={{ className: "fill-gray-600 dark:fill-gray-400" }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis 
                domain={[0, 1000]}
                label={{ value: "Intensity", angle: -90, position: "insideLeft", className: "fill-gray-600 dark:fill-gray-400" }}
                tick={{ className: "fill-gray-600 dark:fill-gray-400" }}
              />
              <Line 
                type="monotone"
                dataKey="intensity"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ fill: lineColor, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
