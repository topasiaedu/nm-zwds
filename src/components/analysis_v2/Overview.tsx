import React from "react";
import { Badge } from "flowbite-react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeOverview, getDebugInfo, OverviewAnalysisResult } from "../../utils/zwds/analysis/overviewAnalysis";

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
  
  // For debugging purposes (can be removed in production)
  const debugInfo = getDebugInfo(chartData);
  console.log("Overview Debug Info:", debugInfo);
  console.log("Analysis Result:", analysisResult);

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
   * Renders tip items with increased size and emphasis
   */
  const renderTipItems = (items: FeatureItem[]): JSX.Element[] => {
    return items.map((item) => (
      <div
        key={item.id}
        className="p-4 mb-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-md shadow-sm hover:shadow transition-shadow dark:shadow-gray-800">
        <p className="text-base font-medium text-blue-900 dark:text-blue-300">
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
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Description Text */}
        <div className="md:w-1/2 p-4">
          <div className="rounded-lg shadow-sm">
            {analysisResult.descriptions.length > 0 ? (
              renderDescriptions()
            ) : (
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                No analysis data available for the stars in your life palace. Please ensure your chart data is properly calculated.
              </p>
            )}
          </div>
        </div>

        {/* Divider for medium screens and above */}
        <div className="hidden md:block md:w-px md:bg-gray-300 dark:md:bg-gray-700 md:mx-4"></div>

        {/* Right Column - Features (Strengths, Weaknesses, Tips) */}
        <div className="md:w-1/2 p-4">
          <div className="rounded-lg shadow-sm">
            {/* Strengths Section */}
            <div className="mb-6">
              <h5 className="text-lg font-bold mb-3 dark:text-white">
                Strengths
              </h5>
              <div className="flex flex-wrap">
                {featuresData.strengths.length > 0 ? (
                  renderFeatureItems(featuresData.strengths, "success")
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No strength data available
                  </p>
                )}
              </div>
            </div>

            {/* Weaknesses Section */}
            <div className="mb-6">
              <h5 className="text-lg font-bold mb-3 dark:text-white">
                Potential Challenges
              </h5>
              <div className="flex flex-wrap">
                {featuresData.weaknesses.length > 0 ? (
                  renderFeatureItems(featuresData.weaknesses, "failure")
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No challenge data available
                  </p>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div>
              <h5 className="text-lg font-bold mb-4 pb-2 dark:text-white">
                Growth Tips
              </h5>
              <div>
                {featuresData.tips.length > 0 ? (
                  renderTipItems(featuresData.tips)
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No tip data available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
