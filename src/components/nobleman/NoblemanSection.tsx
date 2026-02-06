/**
 * Nobleman Section - Main Container Component
 * 
 * Orchestrates all nobleman components and handles the calculation logic.
 * Displays key supportive people based on current Dayun cycle and chart structure.
 */

import React from "react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateNoblemanData, calculateOtherLifeAreas } from "../../utils/nobleman/calculator";
import { calculateMainZodiacInsights, calculateMiniZodiacInsights } from "../../utils/nobleman/zodiacInsightsCalculator";
import GradientSectionHeader from "../analysis_v2/shared/GradientSectionHeader";
import NoblemanHeroCard from "./NoblemanHeroCard";
import NoblemanProfileCard from "./NoblemanProfileCard";
import OtherLifeAreas from "./OtherLifeAreas";
import ZodiacInsightsSection from "./ZodiacInsightsSection";
import ZodiacMiniCardsGrid from "./ZodiacMiniCardsGrid";

interface NoblemanSectionProps {
  /** Complete ZWDS chart data */
  chartData: ChartData;
}

/**
 * NoblemanSection component - Complete Nobleman Analysis
 * 
 * Displays:
 * 1. Hero Card - Section introduction
 * 2. Profile Card - Main nobleman profile from Wealth Palace
 * 3. Other Life Areas - Grid of 3 key palace cards (Life, Career, Friends)
 * 
 * @example
 * ```tsx
 * <NoblemanSection chartData={chartData} />
 * ```
 */
export const NoblemanSection: React.FC<NoblemanSectionProps> = ({ chartData }) => {
  // Calculate nobleman data based on Wealth Palace (fixed)
  const noblemanData = calculateNoblemanData(chartData);
  const otherAreas = calculateOtherLifeAreas(chartData);
  
  // Calculate zodiac insights for the new sections
  const mainZodiacInsights = calculateMainZodiacInsights(noblemanData);
  const miniZodiacData = calculateMiniZodiacInsights(otherAreas);
  
  // If no nobleman data available, don't render anything
  if (!noblemanData) {
    return null;
  }
  
  return (
    <>
      {/* NOBLEMAN SECTION - Main Profile */}
      <section className="mb-8 p-6 dark:bg-gray-900">
        {/* Section Header - Premium Gradient Header */}
        <GradientSectionHeader
          badgeText="03"
          title="NOBLEMAN ANALYSIS"
          subtitle="Key People Who Will Support Your Life Journey"
          showDivider={true}
        />

        {/* Hero Card - Purple gradient */}
        <NoblemanHeroCard />
        
        {/* Main Profile Card - Detailed nobleman information */}
        <NoblemanProfileCard {...noblemanData} />
        
        {/* Other Life Areas - 3-card grid */}
        <OtherLifeAreas areas={otherAreas} />
      </section>

      {/* ZODIAC INSIGHTS SECTION - Understanding Your Nobleman */}
      {mainZodiacInsights && (
        <ZodiacInsightsSection
          zodiacInsights={mainZodiacInsights}
          noblemanZodiac={noblemanData.zodiac}
        />
      )}

      {/* MINI ZODIAC CARDS - Other Life Areas Quick Reference */}
      {miniZodiacData.length > 0 && (
        <ZodiacMiniCardsGrid miniData={miniZodiacData} />
      )}
    </>
  );
};

export default NoblemanSection;
