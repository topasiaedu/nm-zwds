/**
 * Dayun Section - Main Container Component
 * 
 * Orchestrates all Dayun components and handles the calculation logic.
 * This is the primary component to integrate into result pages.
 */

import React from "react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../utils/dayun/guidanceGenerator";
import GradientSectionHeader from "../analysis_v2/shared/GradientSectionHeader";
import {
  DayunSeasonHero,
  CycleTimeline,
  PhaseIntensityChart,
  DayunGuidanceCards,
  ReflectionQuestions,
} from "./index";

interface DayunSectionProps {
  /** Complete ZWDS chart data */
  chartData: ChartData;
  
  /** Optional current year override (defaults to current year) */
  currentYear?: number;

  /**
   * Whether to show the built-in Dayun section header.
   * Defaults to `true` for standalone pages; set to `false` when embedding inside other reports
   * that already provide their own section header (e.g. Founder Report section numbering).
   */
  showHeader?: boolean;
}

/**
 * DayunSection component - Complete Dayun 10-Year Cycle Analysis
 * 
 * Displays:
 * 1. Season Hero - Current season with visual emphasis
 * 2. Cycle Timeline - Past, current, and future cycles
 * 3. Phase Intensity Chart - 10-year energy curve
 * 4. Guidance Cards - Key actions and watch outs
 * 5. Reflection Questions - Thought-provoking prompts
 * 
 * @example
 * ```tsx
 * <DayunSection chartData={chartData} />
 * ```
 */
export const DayunSection: React.FC<DayunSectionProps> = ({ 
  chartData, 
  currentYear,
  showHeader
}) => {
  const shouldShowHeader = showHeader ?? true;

  // Calculate current Dayun cycle
  const dayunCycle = calculateCurrentDayunCycle(chartData, currentYear);

  // If no valid Dayun cycle found, don't render anything
  if (!dayunCycle) {
    return null;
  }

  // Generate guidance content (keyActions, watchOut, etc.)
  const dayunWithGuidance = generateDayunGuidance(dayunCycle);

  return (
    <section className="mb-8 p-6 dark:bg-gray-900">
      {/* Section Header - Premium Gradient Header */}
      {shouldShowHeader ? (
        <GradientSectionHeader
          badgeText="06"
          title="DAYUN SEASON ANALYSIS"
          subtitle="Your Current 10-Year Life Cycle Strategy"
          showDivider={true}
        />
      ) : null}

      {/* Season Hero - Large visual card (FIRST - most prominent) */}
      <DayunSeasonHero dayun={dayunWithGuidance} />

      {/* Cycle Timeline - Past, current, future */}
      <CycleTimeline dayun={dayunWithGuidance} />

      {/* Phase Intensity Chart - Energy curve visualization */}
      <PhaseIntensityChart dayun={dayunWithGuidance} />

      {/* Decision Point Hero - Critical "NOW" moment with two paths (AFTER energy graph) */}
      {/* <DecisionPointHero dayun={dayunWithGuidance} /> */}

      {/* Guidance Cards - Key actions and warnings */}
      <DayunGuidanceCards dayun={dayunWithGuidance} />

      {/* Reflection Questions - Collapsible section */}
      <ReflectionQuestions questions={dayunWithGuidance.reflectionQuestions} />
    </section>
  );
};
