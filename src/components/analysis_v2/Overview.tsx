import React from "react";
import { Sparkles } from "lucide-react";
import { ChartData } from "../../utils/zwds/types";
import {
  analyzeOverview,
  OverviewAnalysisResult,
} from "../../utils/zwds/analysis/overviewAnalysis";
import { analysisHeroTitleLargeClass } from "../../styles/typographyUi";
import { AnalysisSectionHeader } from "./shared/AnalysisSectionHeader";
import { CorePersonalitySection } from "./shared/CorePersonalitySection";
import { OverviewStrengthsChallenges } from "./shared/OverviewStrengthsChallenges";
import { GrowthTipsTimeline } from "./shared/GrowthTipsTimeline";

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

      <CorePersonalitySection
        personalityProfiles={analysisResult.personalityProfiles}
        supplementaryProfiles={analysisResult.supplementaryProfiles}
        forPdfCapture={forPdfCapture}
      />

      {/* Strengths & challenges — paired trait cards */}
      <section
        data-pdf-break-anchor="overview-strengths-challenges"
        {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
        className="relative mb-10"
        aria-label="Strengths and challenges"
      >
        <OverviewStrengthsChallenges
          strengths={featuresData.strengths}
          weaknesses={featuresData.weaknesses}
          forPdfCapture={forPdfCapture}
        />
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
