/**
 * AnalysisView Stage
 * Final destination showing pre-configured chart + AI insights
 */

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { NavigatorState } from "../../../types/destiny-navigator";
import { Profile } from "../../../context/ProfileContext";
import NavigationBreadcrumb from "../analysis/NavigationBreadcrumb";
import ChartDisplay from "../analysis/ChartDisplay";
import InsightsPanel from "../analysis/InsightsPanel";
import WealthCode from "../../analysis_v2/WealthCode";
import PageTransition from "../../PageTransition";
import { ChartInput } from "../../../utils/zwds/types";
import { ZWDSCalculator } from "../../../utils/zwds/calculator";

/**
 * Component props
 */
interface AnalysisViewProps {
  navigatorState: NavigatorState;
  profile: Profile;
  onBack: () => void;
  onChangeSelection: () => void;
}

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

/**
 * AnalysisView - Stage 4 of Destiny Navigator
 * Shows chart and insights based on user's selections
 */
const AnalysisView: React.FC<AnalysisViewProps> = ({
  navigatorState,
  profile,
  onBack,
  onChangeSelection
}) => {
  const { selectedAspect, selectedTimeframe } = navigatorState;

  /**
   * Calculate chart data from profile
   * Memoized to avoid recalculation on every render
   */
  const chartData = useMemo(() => {
    try {
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
      return calculator.calculate();
    } catch (err) {
      console.error("Error calculating chart:", err);
      return null;
    }
  }, [profile]);

  // Safety check - should never happen but good to have
  if (!selectedAspect || !selectedTimeframe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md text-center">
          <p className="text-white mb-4">Invalid selection. Please start over.</p>
          <button
            onClick={onChangeSelection}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium transition-all"
          >
            Back to Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8"
        role="main"
        aria-label="Analysis View"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with Breadcrumb */}
          <div className="mb-8">
            <NavigationBreadcrumb
              aspect={selectedAspect}
              timeframe={selectedTimeframe}
              onBackToTimeframe={onBack}
              onBackToAspect={() => {
                // Go back two stages to aspect selection
                onChangeSelection();
              }}
              onChangeSelection={onChangeSelection}
            />
          </div>

          {/* Chart Display - Full Width */}
          <div className="mb-8">
            <ChartDisplay
              profile={profile}
              aspect={selectedAspect}
              timeframe={selectedTimeframe}
              dayunPeriod={navigatorState.selectedDayunPeriod}
              selectedMonth={navigatorState.selectedMonth}
              selectedYear={undefined}
            />
          </div>

          {/* Insights Section */}
          <div className="mb-8">
            {selectedAspect === "wealth" && selectedTimeframe === "natal" && chartData ? (
              // Show WealthCode component for Wealth + Natal combination
              <WealthCode chartData={chartData} />
            ) : (
              // Show default InsightsPanel for all other combinations
              <InsightsPanel
                profile={profile}
                aspect={selectedAspect}
                timeframe={selectedTimeframe}
                dayunPeriod={navigatorState.selectedDayunPeriod}
                selectedMonth={navigatorState.selectedMonth}
                selectedYear={undefined}
              />
            )}
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default AnalysisView;
