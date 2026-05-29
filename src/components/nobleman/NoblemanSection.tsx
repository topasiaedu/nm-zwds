/**
 * Nobleman Section - Main Container Component
 *
 * Orchestrates all nobleman components and handles the calculation logic.
 * Displays key supportive people based on current Dayun cycle and chart structure.
 */

import React from "react";
import { Crown, Users } from "lucide-react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateNoblemanData, calculateOtherLifeAreas } from "../../utils/nobleman/calculator";
import {
  calculateMainZodiacInsights,
  calculateMiniZodiacInsights,
} from "../../utils/nobleman/zodiacInsightsCalculator";
import { pdfCaptureNumericBadgeStyle } from "../analysis_v2/shared/pdfCaptureNumericBadgeStyle";
import NoblemanProfileCard from "./NoblemanProfileCard";
import OtherLifeAreas from "./OtherLifeAreas";
import ZodiacInsightsSection from "./ZodiacInsightsSection";
import ZodiacMiniCardsGrid from "./ZodiacMiniCardsGrid";

interface NoblemanSectionProps {
  /** Complete ZWDS chart data */
  chartData: ChartData;
  /** When true, disables motion and applies PDF-safe layout for html2canvas. */
  forPdfCapture?: boolean;
}

type NoblemanAnalysisHeroProps = {
  forPdfCapture?: boolean;
};

/**
 * Section hero — high visibility in dark mode (vivid gradient + gold ring).
 */
const NoblemanAnalysisHero: React.FC<NoblemanAnalysisHeroProps> = ({ forPdfCapture }) => {
  return (
    <div
      data-pdf-break-anchor="nobleman-header"
      className="relative mb-10 overflow-hidden rounded-3xl border-2 border-brand-purple/25 shadow-2xl dark:border-accent-gold/70 dark:shadow-[0_12px_48px_rgba(251,146,60,0.28)] dark:ring-2 dark:ring-accent-gold/40"
    >
      {/* Match sections 01–02: purple/indigo in light, warm orange in dark */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-purpleDeep via-brand-purple to-indigo-700 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 40%, rgba(255,255,255,0.35) 1px, transparent 1px),
            radial-gradient(circle at 82% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "42px 42px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-accent-gold/20 blur-3xl dark:bg-amber-300/30"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-indigo-400/25 blur-3xl dark:bg-orange-400/20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <Users className="h-3.5 w-3.5 text-accent-gold" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Section 03
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              style={
                forPdfCapture
                  ? pdfCaptureNumericBadgeStyle("#4A3F6B")
                  : {
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "#4A3F6B",
                      height: "40px",
                      minWidth: "52px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      fontSize: "20px",
                      fontWeight: "800",
                      lineHeight: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }
              }
            >
              03
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
              Nobleman Analysis
            </h2>
          </div>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
            Key people who will support your life journey — aligned with your chart
            structure and natural strengths.
          </p>
        </div>
        <div
          className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24 ${
            forPdfCapture ? "" : "backdrop-blur-md"
          }`}
        >
          <Crown className="h-10 w-10 text-white sm:h-12 sm:w-12" aria-hidden="true" />
        </div>
      </div>
      <div
        className="relative z-10 h-1.5 bg-gradient-to-r from-accent-goldDark via-accent-coralDark to-indigo-400 dark:from-amber-200 dark:via-white dark:to-amber-100"
        aria-hidden="true"
      />
    </div>
  );
};

/**
 * Intro strip — context for the profile block (replaces duplicate full hero card).
 */
const NoblemanIntroStrip: React.FC = () => (
  <div className="mb-8 flex gap-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50 p-5 dark:border-indigo-800/50 dark:from-indigo-950/40 dark:via-gray-800 dark:to-violet-950/30">
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
      <Users className="h-5 w-5 text-white" aria-hidden="true" />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
        Your key people
      </p>
      <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        Based on your chart structure, these are the people most beneficial to you —
        individuals who align with your strengths and can provide crucial support.
      </p>
    </div>
  </div>
);

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
        <NoblemanAnalysisHero forPdfCapture={forPdfCapture} />
        <NoblemanIntroStrip />

        <div data-pdf-break-anchor="nobleman-profile">
          <NoblemanProfileCard {...noblemanData} forPdfCapture={forPdfCapture} />
        </div>

        <OtherLifeAreas areas={otherAreas} forPdfCapture={forPdfCapture} />
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
