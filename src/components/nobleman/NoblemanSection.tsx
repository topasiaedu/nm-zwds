/**
 * Nobleman Section - Main Container Component
 * 
 * Orchestrates all nobleman components and handles the calculation logic.
 * Displays key supportive people based on current Dayun cycle and chart structure.
 */

import React from "react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateAge } from "../../utils/dayun/calculator";
import { calculateNoblemanData, calculateOtherLifeAreas } from "../../utils/nobleman/calculator";
import { calculateMainZodiacInsights, calculateMiniZodiacInsights } from "../../utils/nobleman/zodiacInsightsCalculator";
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
 * 1. Hero Card - Section introduction with Dayun context
 * 2. Profile Card - Main nobleman profile (large, detailed)
 * 3. Other Life Areas - Grid of 4 key palace cards
 * 
 * @example
 * ```tsx
 * <NoblemanSection chartData={chartData} />
 * ```
 */
export const NoblemanSection: React.FC<NoblemanSectionProps> = ({ chartData }) => {
  // Calculate current age and nobleman data
  const currentAge = calculateAge(chartData.input.year);
  const noblemanData = calculateNoblemanData(chartData, currentAge);
  const otherAreas = calculateOtherLifeAreas(chartData);
  
  // Calculate zodiac insights for the new sections
  const mainZodiacInsights = calculateMainZodiacInsights(noblemanData);
  const miniZodiacData = calculateMiniZodiacInsights(otherAreas);
  
  // If no nobleman data available, don't render anything
  if (!noblemanData) {
    return null;
  }
  
  // Calculate Dayun cycle info for hero card
  const birthYear = chartData.input.year;
  const ageInCycle = currentAge % 10;
  const cycleStartAge = currentAge - ageInCycle;
  const startYear = birthYear + cycleStartAge;
  const endYear = startYear + 9;
  
  return (
    <>
      {/* NOBLEMAN SECTION - Main Profile */}
      <section className="mb-8">
        {/* Section Header - Matching other analysis components */}
        <div className="text-center mb-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
            Nobleman Analysis
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Key People Who Will Support Your Current Life Cycle
          </p>
        </div>

        {/* Hero Card - Purple gradient with Dayun context */}
        <NoblemanHeroCard 
          dayunPalace={noblemanData.palaceName}
          startYear={startYear}
          endYear={endYear}
        />
        
        {/* Main Profile Card - Detailed nobleman information */}
        <NoblemanProfileCard {...noblemanData} />
        
        {/* Other Life Areas - 4-card grid */}
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
