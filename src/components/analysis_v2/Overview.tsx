import React from "react";
import {
  Brain,
  Check,
  Minus,
  Sparkles,
} from "lucide-react";
import { ChartData } from "../../utils/zwds/types";
import {
  analyzeOverview,
  OverviewAnalysisResult,
} from "../../utils/zwds/analysis/overviewAnalysis";
import { analysisHeroTitleLargeClass } from "../../styles/typographyUi";
import { BrandGradientText } from "../BrandGradientText";
import { AnalysisSectionHeader } from "./shared/AnalysisSectionHeader";
import {
  MUTED_HIGHLIGHT_THEME,
  PptHighlightColumn,
  ROTATING_HIGHLIGHT_THEMES,
} from "./shared/PptHighlightCards";
import { GrowthTipsTimeline } from "./shared/GrowthTipsTimeline";
import { PersonalityDescriptionParagraph } from "./shared/personalityTextHighlight";

/**
 * Type definition for a feature item to be displayed in lists
 */
type FeatureItem = {
  id: string;
  label: string;
};

/**
 * Type definition for the features section data
 */
type FeaturesData = {
  strengths: FeatureItem[];
  weaknesses: FeatureItem[];
  tips: FeatureItem[];
};

/**
 * Props for the Overview component
 */
type OverviewProps = {
  chartData: ChartData;
  /** Optional physical palace number (1–12) for timeframe-based analysis. */
  palaceOverride?: number;
  /** Static mode for PDF capture. */
  forPdfCapture?: boolean;
};

/**
 * Overview component displaying personality analysis with a hero header and varied layouts
 */
const Overview: React.FC<OverviewProps> = ({
  chartData,
  palaceOverride,
  forPdfCapture,
}) => {  const analysisResult: OverviewAnalysisResult = analyzeOverview(
    chartData,
    palaceOverride
  );

  const featuresData: FeaturesData = {
    strengths: analysisResult.strengths.map((strength, index) => ({
      id: `strength-${index + 1}`,
      label: strength,
    })),
    weaknesses: analysisResult.weaknesses.map((weakness, index) => ({
      id: `weakness-${index + 1}`,
      label: weakness,
    })),
    tips: analysisResult.quotes.map((quote, index) => ({
      id: `tip-${index + 1}`,
      label: quote,
    })),
  };

  return (
    <div className="p-6">
      <AnalysisSectionHeader
        sectionLabel="Core identity"
        badgeText="01"
        title="Personality Blueprint"
        subtitle="Discover your core strengths, challenges, and strategic growth opportunities"
        icon={Sparkles}
        titleClassName={analysisHeroTitleLargeClass}
        pdfBreakAnchor="overview-hero"
        forPdfCapture={forPdfCapture}
      />

      {/* Core personality — flat editorial block on page surface */}
      <section
        data-pdf-break-anchor="overview-core-personality"
        className={`relative mb-10 ${forPdfCapture ? "break-inside-avoid-page" : ""}`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-600 shadow-lg">
            <Brain className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-purple dark:text-accent-gold">
              Foundation
            </p>
            <BrandGradientText
              as="h3"
              className="mt-1 font-serif text-2xl font-bold"
            >
              Your Core Personality
            </BrandGradientText>
            {analysisResult.descriptions.length > 0 ? (
              <div className="mt-5 space-y-4 border-l-4 border-brand-purple/40 pl-5 dark:border-accent-goldDark/50">
                {analysisResult.descriptions.map((description, index) => (
                  <PersonalityDescriptionParagraph
                    key={`description-${index}`}
                    text={description}
                    prominent={index === 0}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                No analysis data available for the stars in your life palace.
                Please ensure your chart data is properly calculated.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Strengths & challenges — PPT-style highlight cards (matches career alignment) */}
      <section
        data-pdf-break-anchor="overview-strengths-challenges"
        {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
        className="relative mb-10"
        aria-label="Strengths and challenges"
      >
        <Sparkles
          className="pointer-events-none absolute bottom-8 left-0 h-4 w-4 text-accent-gold/40"
          aria-hidden="true"
        />
        <Sparkles
          className="pointer-events-none absolute right-2 top-16 h-3 w-3 text-accent-gold/35"
          aria-hidden="true"
        />

        <div
          className={
            forPdfCapture
              ? "grid grid-cols-2 gap-8"
              : "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6"
          }
        >
          <PptHighlightColumn
            header={{
              variant: "brand",
              beforeText: "These strengths are",
              emphasisText: "in you",
            }}
            items={featuresData.strengths}
            themes={ROTATING_HIGHLIGHT_THEMES}
            icon={Check}
            plainHighlight
            emptyMessage="No strength data available"
            forPdfCapture={forPdfCapture}
          />
          <PptHighlightColumn
            header={{
              variant: "muted",
              beforeText: "Patterns to",
              emphasisText: "watch",
            }}
            items={featuresData.weaknesses}
            themes={[MUTED_HIGHLIGHT_THEME]}
            icon={Minus}
            plainHighlight
            emptyMessage="No challenge data available"
            forPdfCapture={forPdfCapture}
          />
        </div>
      </section>

      {/* Growth tips — alternating vertical timeline on page surface */}
      <section
        data-pdf-break-anchor="overview-growth-tips"
        className="mb-10"
      >
        <GrowthTipsTimeline
          tips={featuresData.tips}
          forPdfCapture={forPdfCapture}
        />
      </section>
    </div>
  );
};

export default Overview;
