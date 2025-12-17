/**
 * Phase Intensity Chart Component
 * 
 * Visualizes the 10-year energy curve showing building, peak, and integration phases.
 * Current year is highlighted with gradient colors.
 */

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
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
   * Calculate intensity value based on year position in cycle
   * Year 1: starts slightly below mid (45%)
   * Year 4: lowest point (30%)
   * Year 10: highest point (100%)
   */
  const getIntensityValue = (year: number): number => {
    if (year === 1) {
      // Starts slightly below mid
      return 45;
    } else if (year <= 4) {
      // Drops from 45% to 30% (year 4 is lowest)
      const startValue = 45;
      const endValue = 30;
      const progress = (year - 1) / 3; // 0 to 1 from year 1 to 4
      return startValue - ((startValue - endValue) * progress);
    } else if (year <= 10) {
      // Rises from 30% (year 4) to 100% (year 10)
      const startValue = 30;
      const endValue = 100;
      const progress = (year - 4) / 6; // 0 to 1 from year 4 to 10
      return startValue + ((endValue - startValue) * progress);
    }
    
    return 45;
  };

  /**
   * Prepare chart data
   */
  const chartData = years.map((year) => ({
    year: year,
    intensity: Math.round(getIntensityValue(year)),
    isCurrent: year === currentYear
  }));

  /**
   * Custom dot component to highlight current year
   */
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    if (payload.isCurrent) {
      return (
        <g>
          {/* Outer pulse ring */}
          <circle
            cx={cx}
            cy={cy}
            r={14}
            fill="none"
            stroke={seasonColor.primary}
            strokeWidth={2}
            opacity={0.2}
          />
          {/* Middle pulse ring */}
          <circle
            cx={cx}
            cy={cy}
            r={10}
            fill="none"
            stroke={seasonColor.primary}
            strokeWidth={2}
            opacity={0.4}
          />
          {/* Main dot */}
          <circle
            cx={cx}
            cy={cy}
            r={7}
            fill={seasonColor.primary}
            stroke="white"
            strokeWidth={3}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          />
        </g>
      );
    }
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="white"
        stroke={seasonColor.primary}
        strokeWidth={2.5}
        opacity={0.8}
      />
    );
  };

  // Context-aware messaging based on current year
  const contextualTitle = isInFoundationPhase 
    ? "Years 1-5: Strategic Foundation Phase" 
    : "Years 6-10: Maximize & Scale Phase";
  
  const contextualDescription = isInFoundationPhase
    ? "You're in the critical foundation years. Wrong starting point = wasted 10 years. Focus on finding your exact money path and core strengths before expanding."
    : "Foundation established. Time to maximize returns and scale proven strategies. Execute with confidence and prepare for cycle transition.";

  return (
    <div className="rounded-2xl shadow-xl border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 p-8 mb-6 overflow-hidden relative">
      {/* Decorative background pattern */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: seasonColor.primary }}
      />
      
      <div className="relative">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: seasonColor.primary
                }}
              >
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {contextualTitle}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: seasonColor.primary }} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    10-Year Cycle Energy Map
                  </span>
                </div>
              </div>
            </div>
            
            {/* Current Year Badge - Repositioned */}
            <div className="relative overflow-hidden rounded-full shadow-lg">
              <div 
                className="absolute inset-0 opacity-90 dark:opacity-95"
                style={{ 
                  backgroundImage: getGradientColors(dayun.season).replace("to top", "to right")
                }}
              />
              <span className="relative text-sm font-bold px-4 py-2 text-white drop-shadow-md flex items-center gap-2">
                <span className="text-lg">📍</span>
                Year {currentYear}
              </span>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl">
            {contextualDescription}
          </p>
        </div>

        {/* Chart Container with enhanced styling */}
        <div className="rounded-xl bg-white dark:bg-gray-800/50 p-6 shadow-inner border border-gray-100 dark:border-gray-700 mb-6">
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id={`colorIntensity-${dayun.season}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={seasonColor.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={seasonColor.primary} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  opacity={0.5}
                />
                
                <XAxis 
                  dataKey="year" 
                  stroke="currentColor"
                  className="text-gray-600 dark:text-gray-400"
                  tick={{ fill: "currentColor", fontSize: 12, fontWeight: 600 }}
                  tickLine={{ stroke: "currentColor" }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
                />
                
                <YAxis 
                  hide
                  domain={[0, 110]}
                />
                
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: `2px solid ${seasonColor.primary}`,
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    padding: "12px 16px"
                  }}
                  labelStyle={{ 
                    fontWeight: "bold",
                    color: seasonColor.primary,
                    marginBottom: "4px"
                  }}
                  formatter={(value: number) => [
                    <span key="intensity-value" style={{ color: seasonColor.primary, fontWeight: "bold", fontSize: "16px" }}>
                      {value}%
                    </span>, 
                    "Cycle Intensity"
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                  cursor={{ stroke: seasonColor.primary, strokeWidth: 2, strokeDasharray: "5 5" }}
                />
                
                <Area
                  type="monotone"
                  dataKey="intensity"
                  stroke={seasonColor.primary}
                  strokeWidth={4}
                  fill={`url(#colorIntensity-${dayun.season})`}
                  dot={<CustomDot />}
                  activeDot={{ 
                    r: 8, 
                    stroke: "white", 
                    strokeWidth: 3,
                    fill: seasonColor.primary,
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seasonColor.primary }} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Energy Level
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: seasonColor.primary }} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Current Position
              </span>
            </div>
          </div>
        </div>
        
        {/* Phase Labels - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => {
            return (
              <div
                key={phase.years}
                className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 ${
                  phase.isCurrent
                    ? "shadow-lg border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800"
                    : "bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-80"
                }`}
                style={phase.isCurrent ? { 
                  borderColor: seasonColor.primary,
                  boxShadow: `0 10px 30px ${seasonColor.primary}20`
                } : undefined}
              >
                {/* Decorative element */}
                {phase.isCurrent && (
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-10"
                    style={{ background: seasonColor.primary }}
                  />
                )}
                
                <div className="relative">
                  {/* Current badge */}
                  {phase.isCurrent && (
                    <div className="flex items-center justify-center mb-3">
                      <span 
                        className="text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-md"
                        style={{ backgroundColor: seasonColor.primary }}
                      >
                        ⭐ YOU ARE HERE
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-sm font-bold mb-2 text-gray-900 dark:text-white">
                      Years {phase.years}
                    </div>
                    <div 
                      className={`text-base font-bold mb-2 ${
                        phase.isCurrent ? "" : "text-gray-600 dark:text-gray-400"
                      }`} 
                      style={phase.isCurrent ? { color: seasonColor.primary } : undefined}
                    >
                      {phase.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {phase.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
