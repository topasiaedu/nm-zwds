import React from "react";
import { Badge } from "flowbite-react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeOverview, OverviewAnalysisResult } from "../../utils/zwds/analysis/overviewAnalysis";
import GradientSectionHeader from "./shared/GradientSectionHeader";

/**
 * Type definition for a feature item to be displayed as a badge
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
};

/**
 * Overview component displaying personality analysis in a two-column layout
 */
const Overview: React.FC<OverviewProps> = ({ chartData }) => {
  // Analyze the chart data to get real data
  const analysisResult: OverviewAnalysisResult = analyzeOverview(chartData);
  



  // Transform analysis results into the component's expected format
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

  /**
   * Renders feature items as styled badges
   */
  const renderFeatureItems = (
    items: FeatureItem[],
    color: string
  ): JSX.Element[] => {
    return items.map((item) => (
      <Badge key={item.id} color={color} className="mr-2 mb-2">
        {item.label}
      </Badge>
    ));
  };

  /**
   * Renders tip items with premium card styling
   */
  const renderTipItems = (items: FeatureItem[]): JSX.Element[] => {
    return items.map((item) => (
      <div
        key={item.id}
        className="rounded-xl border border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 hover:shadow-lg transition-shadow">
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
          {item.label}
        </p>
      </div>
    ));
  };

  /**
   * Renders description paragraphs from analysis
   */
  const renderDescriptions = (): JSX.Element[] => {
    return analysisResult.descriptions.map((description, index) => (
      <p key={`description-${index}`} className="mb-4 text-gray-700 dark:text-gray-300">
        {description}
      </p>
    ));
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Section Header */}
      <GradientSectionHeader
        badgeText="01"
        title="PERSONALITY BLUEPRINT"
        subtitle="Discover your core strengths, challenges, and strategic growth opportunities"
        showDivider={true}
      />

      {/* Core Personality Description - Premium Card */}
      <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎭</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Your Core Personality
          </h3>
        </div>
        {analysisResult.descriptions.length > 0 ? (
          <div className="space-y-4">
            {analysisResult.descriptions.map((description, index) => (
              <p key={`description-${index}`} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
            No analysis data available for the stars in your life palace. Please ensure your chart data is properly calculated.
          </p>
        )}
      </div>

      {/* Strengths and Challenges - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Strengths Column */}
        <div className="rounded-2xl shadow-lg border bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💪</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Strengths
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {featuresData.strengths.length > 0 ? (
              renderFeatureItems(featuresData.strengths, "success")
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No strength data available
              </p>
            )}
          </div>
        </div>

        {/* Potential Challenges Column */}
        <div className="rounded-2xl shadow-lg border bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚡</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Potential Challenges
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {featuresData.weaknesses.length > 0 ? (
              renderFeatureItems(featuresData.weaknesses, "failure")
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No challenge data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Growth Tips - Premium Card */}
      <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🌱</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Growth Tips
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuresData.tips.length > 0 ? (
            renderTipItems(featuresData.tips)
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4 col-span-full">
              No tip data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
