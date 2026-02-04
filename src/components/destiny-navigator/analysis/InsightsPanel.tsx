/**
 * InsightsPanel Component - Refactored
 * Displays real chart-based insights with visual data dashboard
 */

import React, { useMemo } from "react";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";
import { Profile } from "../../../context/ProfileContext";
import { ZWDSCalculator } from "../../../utils/zwds/calculator";
import { ChartInput } from "../../../utils/zwds/types";
import {
  getPalaceForAspectNatal,
  getPalaceForAspectDayun,
  getPalaceForAspectLiuNian,
  getPalaceForAspectLiuMonth
} from "../../../utils/destiny-navigator/palace-resolver";
import {
  calculatePalaceQuality,
  filterStarsByRelevance,
  generateFocusPriorities,
  getAllStarsFromPalace
} from "../../../utils/destiny-navigator/metrics-calculator";
import { 
  calculateAspectMetrics, 
  getRelevantFocuses,
  calculateStarActivity 
} from "../../../utils/destiny-navigator/aspect-metrics";

// Import sub-components
import { ContextHeader } from "../insights/ContextHeader";
import { AspectMetricsBars } from "../insights/AspectMetricsBars";
import { StarCard } from "../insights/StarCard";
import { FocusPriorities } from "../insights/FocusPriorities";

/**
 * Component props
 */
interface InsightsPanelProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
  dayunPeriod?: "current" | "next";
  selectedMonth?: number;
  selectedYear?: number;
}

/**
 * InsightsPanel - Main component
 * Displays comprehensive insights with real chart data
 */
export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  profile,
  aspect,
  timeframe,
  dayunPeriod,
  selectedMonth,
  selectedYear
}) => {
  const insights = useMemo(() => {
    try {
      // Parse birth date
      const birthDate = new Date(profile.birthday);
      
      // Extract hour from birth time
      let hour = 12; // Default to noon
      if (profile.birth_time) {
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
        const timeMatch = timeRegex.exec(String(profile.birth_time));
        if (timeMatch) {
          hour = Number.parseInt(timeMatch[1], 10);
          const isPM = timeMatch[3]?.toUpperCase() === "PM";
          const isAM = timeMatch[3]?.toUpperCase() === "AM";
          
          if (isPM && hour < 12) {
            hour += 12;
          }
          if (isAM && hour === 12) {
            hour = 0;
          }
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

      // Get palace number based on timeframe and selection context.
      let palaceNumber: number | null = null;
      switch (timeframe) {
        case "natal":
          palaceNumber = getPalaceForAspectNatal(aspect, chartData);
          break;
        case "dayun":
          palaceNumber = getPalaceForAspectDayun(aspect, chartData, dayunPeriod ?? "current");
          break;
        case "liunian":
          palaceNumber = getPalaceForAspectLiuNian(aspect, chartData);
          break;
        case "liumonth": {
          const currentMonth = new Date().getMonth() + 1;
          const resolvedMonth = selectedMonth ?? currentMonth;
          palaceNumber = getPalaceForAspectLiuMonth(
            aspect,
            chartData,
            resolvedMonth,
            selectedYear
          );
          break;
        }
      }

      if (!palaceNumber) {
        throw new Error("Could not resolve palace for selected aspect and timeframe");
      }

      // Get palace data
      const palace = chartData.palaces.find(p => p.number === palaceNumber);
      if (!palace) {
        throw new Error(`Palace ${palaceNumber} not found in chart data`);
      }

      // Calculate metrics
      const qualityScore = calculatePalaceQuality(palace);

      // Get all stars from palace (combining all star arrays)
      const allStars = getAllStarsFromPalace(palace);

      // Calculate aspect-specific metrics
      const aspectMetrics = calculateAspectMetrics(palace, aspect);

      // Calculate meaningful star activity
      const starActivity = calculateStarActivity(palace);

      // Show all stars regardless of timeframe
      // Stars are still ranked by relevance, but none are filtered out
      const starCount = 999;

      // Filter and rank stars (will show all, ranked by relevance)
      const rankedStars = filterStarsByRelevance(allStars, aspect, starCount);

      // Generate focus priorities and filter to aspect-relevant ones
      const allPriorities = generateFocusPriorities(rankedStars, 3);
      const relevantPriorities = getRelevantFocuses(allPriorities, aspect);

      return {
        qualityScore,
        aspectMetrics,
        stars: rankedStars,
        priorities: relevantPriorities,
        starActivity
      };
    } catch (err) {
      console.error("Error generating insights:", err);
      return null;
    }
  }, [profile, aspect, timeframe, dayunPeriod, selectedMonth, selectedYear]);

  // Error state
  if (!insights) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
          Unable to Generate Insights
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300">
          There was an error calculating your chart data. Please check your profile information and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Context Header - Premium Hero Card */}
      <ContextHeader
        aspect={aspect}
        timeframe={timeframe}
        qualityScore={insights.qualityScore}
        starDensity={insights.starActivity}
      />

      {/* Aspect Metrics - Premium Card */}
      <AspectMetricsBars 
        metrics={insights.aspectMetrics} 
        aspect={aspect}
      />

      {/* Star Grid - Premium Cards */}
      <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Active Stars
          </h3>
          <div className="text-xs px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 font-semibold">
            {insights.stars.length} {insights.stars.length === 1 ? "Star" : "Stars"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {insights.stars.map(({ star, starData, relevance }) => (
            <StarCard
              key={star.name}
              star={star}
              starData={starData}
              contribution={Math.round(relevance / 10)}
              showEssence={true}
              aspect={aspect}
            />
          ))}
        </div>

        {insights.stars.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Stars Found
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              No star data available for this palace configuration.
            </p>
          </div>
        )}
      </div>

      {/* Focus Priorities - Premium Cards */}
      {insights.priorities.length > 0 && (
        <FocusPriorities priorities={insights.priorities} />
      )}
    </div>
  );
};

export default InsightsPanel;
