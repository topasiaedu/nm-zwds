/**
 * ChartDisplay Component
 * Calculates and renders the ZWDS chart with smart configuration based on aspect/timeframe
 */

import React, { useMemo, useState, useEffect } from "react";
import ZWDSChart from "../../zwds/ZWDSChart";
import { ChartInput } from "../../../utils/zwds/types";
import { ZWDSCalculator } from "../../../utils/zwds/calculator";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";
import { Profile } from "../../../context/ProfileContext";
import { getChartConfigForSelection } from "../../../utils/destiny-navigator/chart-configurator";
import { ChartSettingsProvider, useChartSettings } from "../../../context/ChartSettingsContext";

/**
 * Component props
 */
interface ChartDisplayProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
  dayunPeriod?: "current" | "next";
  selectedMonth?: number;
  selectedYear?: number;
}

/**
 * Inner component that applies settings
 */
const ChartDisplayInner: React.FC<ChartDisplayProps> = ({
  profile,
  aspect,
  timeframe,
  dayunPeriod,
  selectedMonth,
  selectedYear
}) => {
  const { updateSetting } = useChartSettings();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate chart data from profile
   * Memoized to avoid recalculation on every render
   */
  const calculatedChartData = useMemo(() => {
    try {
      setLoading(true);
      setError(null);

      // Parse birth date
      const birthDate = new Date(profile.birthday);
      
      // Parse birth time (hour)
      const birthTimeStr = String(profile.birth_time);
      let hour = Number.parseInt(birthTimeStr, 10);
      
      // Handle AM/PM if present
      const timeRegex = /(\d+):?(\d+)?\s*(AM|PM)?/i;
      const timeMatch = timeRegex.exec(birthTimeStr);
      if (timeMatch) {
        hour = Number.parseInt(timeMatch[1], 10);
        const isPM = timeMatch[3] && timeMatch[3].toUpperCase() === "PM";
        const isAM = timeMatch[3] && timeMatch[3].toUpperCase() === "AM";
        
        if (isPM && hour < 12) {
          hour += 12;
        }
        if (isAM && hour === 12) {
          hour = 0;
        }
      }

      // Create chart input
      const chartInput: ChartInput = {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: hour,
        gender: profile.gender as "male" | "female",
        name: profile.name
      };

      // Calculate chart
      const calculator = new ZWDSCalculator(chartInput);
      const chartData = calculator.calculate();

      setLoading(false);
      return chartData;
    } catch (err) {
      console.error("Error calculating chart:", err);
      setError(`Failed to calculate chart: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
      return null;
    }
  }, [profile]);

  /**
   * Generate chart configuration based on aspect and timeframe
   * Memoized to avoid recalculation on every render
   */
  const chartConfig = useMemo(() => {
    if (!calculatedChartData) return null;

    try {
      return getChartConfigForSelection(
        aspect,
        timeframe,
        calculatedChartData,
        dayunPeriod,
        selectedMonth,
        selectedYear
      );
    } catch (err) {
      console.error("Error generating chart config:", err);
      return null;
    }
  }, [aspect, timeframe, calculatedChartData, dayunPeriod, selectedMonth, selectedYear]);

  /**
   * Apply chart settings when config changes
   */
  useEffect(() => {
    if (chartConfig?.settings) {
      // Apply each setting from the config
      Object.entries(chartConfig.settings).forEach(([key, value]) => {
        updateSetting(key as any, value);
      });
    }
  }, [chartConfig, updateSetting]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-cyan-200 text-lg">Calculating your chart...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !calculatedChartData || !chartConfig) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl border border-red-500/20">
        <div className="text-center max-w-md px-6">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-red-300 mb-2">Chart Calculation Error</h3>
          <p className="text-red-200/80 text-sm mb-4">
            {error || "Unable to generate chart configuration. Please try again."}
          </p>
          <p className="text-gray-400 text-xs">
            If the problem persists, please check your profile data or contact support.
          </p>
        </div>
      </div>
    );
  }

  // Render chart with configuration - Matches result.tsx card design
  return (
    <div
      className="rounded-2xl shadow-2xl overflow-hidden
                border border-white/10
                backdrop-filter backdrop-blur-2xl 
                bg-white/10 hover:bg-white/15 
                dark:bg-black/10 dark:hover:bg-black/20 
                transition-all duration-300 p-1 sm:p-2 md:p-4 lg:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-6 dark:text-white">
        Chart Visualization
      </h2>

      <div
        className="flex-grow overflow-auto p-0"
        style={{
          minHeight:
            window.innerWidth < 640
              ? "calc(100vh - 150px)"
              : undefined,
        }}>
        <ZWDSChart
          chartData={calculatedChartData}
          disableInteraction={true}
          selectedPalaceControlled={chartConfig.selectedPalaceControlled ?? undefined}
          selectedDaXianControlled={chartConfig.selectedDaXianControlled ?? undefined}
          selectedPalaceNameControlled={chartConfig.selectedPalaceNameControlled ?? undefined}
          showMonthsControlled={chartConfig.showMonthsForPalace ?? undefined}
          // Use simulated age to shift Dayun highlighting when configured.
          simulatedAge={chartConfig.simulatedAge}
        />
      </div>
    </div>
  );
};

/**
 * Wrapper component that provides ChartSettings context
 */
const ChartDisplay: React.FC<ChartDisplayProps> = (props) => {
  return (
    <ChartSettingsProvider defaultPageType="tier3-result">
      <ChartDisplayInner {...props} />
    </ChartSettingsProvider>
  );
};

export default ChartDisplay;
