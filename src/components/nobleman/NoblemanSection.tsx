/**
 * Nobleman Section - Main Container Component
 *
 * Orchestrates all nobleman components and handles the calculation logic.
 * Displays key supportive people based on current Dayun cycle and chart structure.
 */

import React from "react";
import { Users } from "lucide-react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateNoblemanData, calculateOtherLifeAreas } from "../../utils/nobleman/calculator";
import {
  calculateMainZodiacInsights,
  calculateMiniZodiacInsights,
} from "../../utils/nobleman/zodiacInsightsCalculator";
import { AnalysisSectionHeader } from "../analysis_v2/shared/AnalysisSectionHeader";
import NoblemanProfileCard from "./NoblemanProfileCard";
import ZodiacInsightsSection from "./ZodiacInsightsSection";
import ZodiacMiniCardsGrid from "./ZodiacMiniCardsGrid";

interface NoblemanSectionProps {
  /** Complete ZWDS chart data */
  chartData: ChartData;
  /** When true, disables motion and applies PDF-safe layout for html2canvas. */
  forPdfCapture?: boolean;
}

/**
 * NoblemanSection component - Complete Nobleman Analysis
 */
export const NoblemanSection: React.FC<NoblemanSectionProps> = ({
  chartData,
  forPdfCapture,
}) => {
  const noblemanData = calculateNoblemanData(chartData);
  const otherAreas = calculateOtherLifeAreas(chartData);
  const mainZodiacInsights = calculateMainZodiacInsights(noblemanData);
  const miniZodiacData = calculateMiniZodiacInsights(otherAreas);

  if (!noblemanData) {
    return null;
  }

  return (
    <>
      <section
        className="mb-8 p-6"
        {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
      >
        <AnalysisSectionHeader
          sectionLabel="Key allies"
          badgeText="03"
          title="Nobleman Analysis"
          subtitle="Key people who will support your life journey, aligned with your chart structure and natural strengths."
          icon={Users}
          backgroundImage="/images/chart/guiding.png"
          backgroundPosition="right 40%"
          pdfBreakAnchor="nobleman-header"
          forPdfCapture={forPdfCapture}
        />

        <NoblemanProfileCard
          {...noblemanData}
          areas={otherAreas}
          forPdfCapture={forPdfCapture}
        />
      </section>

      {mainZodiacInsights ? (
        <ZodiacInsightsSection
          zodiacInsights={mainZodiacInsights}
          noblemanZodiac={noblemanData.zodiac}
          forPdfCapture={forPdfCapture}
        />
      ) : null}

      {miniZodiacData.length > 0 ? (
        <ZodiacMiniCardsGrid miniData={miniZodiacData} forPdfCapture={forPdfCapture} />
      ) : null}
    </>
  );
};

export default NoblemanSection;
