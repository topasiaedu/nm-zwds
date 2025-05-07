import React, { useMemo, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { useLanguage } from "../../context/LanguageContext";
import {
  calculateLifeAreaScores,
  analyzeLifeAreas,
  getScoreBadgeClasses,
  type ChartDataType,
} from "../../utils/zwds/analysis";

/**
 * Helper function to normalize star names for translation lookup
 */
const normalizeStarName = (name: string): string => {
  const charMap: Record<string, string> = {
    辅: "輔",
  };

  return name
    .split("")
    .map((char) => charMap[char] || char)
    .join("");
};

/**
 * Component that combines radar chart and detailed explanations for life areas
 */
const AreasOfLife: React.FC<{ chartData: ChartDataType }> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>(
    {}
  );

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  // Calculate scores for radar chart
  const lifeAreaScores = useMemo(() => {
    return calculateLifeAreaScores(chartData, language);
  }, [chartData, language]);

  // Get detailed analysis for explanation cards
  const lifeAreaAnalysis = useMemo(() => {
    return analyzeLifeAreas(chartData, language);
  }, [chartData, language]);

  // Create combined descriptions for each area
  const getCombinedDescription = (area: any): string => {
    if (!area.stars || area.stars.length === 0) {
      return "";
    }

    // Combine all star descriptions into a single text
    return area.stars
      .map((star: any) => {
        const starDescription =
          language === "en"
            ? getStarDescription(area.area, star.name, star.description)
            : star.description;

        return starDescription;
      })
      .join(" ");
  };

  // Translation helper
  const getStarDescription = (
    area: string,
    starName: string,
    fallback: string
  ): string => {
    const exactMatch = t(
      `analysis.areas.${area}.stars.${starName}.description`
    );
    if (exactMatch !== `analysis.areas.${area}.stars.${starName}.description`) {
      return exactMatch;
    }

    const normalizedName = normalizeStarName(starName);
    if (normalizedName !== starName) {
      const normalizedMatch = t(
        `analysis.areas.${area}.stars.${normalizedName}.description`
      );
      if (
        normalizedMatch !==
        `analysis.areas.${area}.stars.${normalizedName}.description`
      ) {
        return normalizedMatch;
      }
    }

    return fallback;
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>

      {/* Title */}
      <h2 className="text-3xl mb-2 dark:text-white text-center font-bold">
      DESTINY SCOREBOARD
      </h2>

      {/* Subtitle */}
      <p className="text-lg mb-6 dark:text-white text-center italic">
        Your personal scorecard across the 5 destiny pillars.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Radar Chart */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full h-80 md:h-96">
            {lifeAreaScores.length > 0 ? (
              <ResponsiveRadar
                data={lifeAreaScores}
                keys={["score"]}
                indexBy="area"
                maxValue={100}
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                borderWidth={2}
                gridLabelOffset={36}
                dotSize={10}
                dotColor={{ theme: "background" }}
                dotBorderWidth={2}
                colors={["#2563eb"]}
                fillOpacity={0.6}
                borderColor={{ from: "color" }}
                gridShape="circular"
                gridLevels={5}
                enableDots={true}
                theme={{
                  text: {
                    fontSize: 12,
                    fill: "#475569",
                  },
                  axis: {
                    domain: {
                      line: {
                        stroke: "#64748b",
                        strokeWidth: 1,
                      },
                    },
                    ticks: {
                      line: {
                        stroke: "#64748b",
                        strokeWidth: 1,
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#475569",
                      strokeWidth: 1,
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("analysis.noDataAvailable") || "No data available"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Area Explanations */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {lifeAreaAnalysis.length > 0 ? (
            <>
              {lifeAreaAnalysis.map((area) => (
                <div
                  key={area.area}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-shadow duration-300 hover:shadow-md overflow-hidden">
                  {/* Background Score Display */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="flex items-end justify-end h-full">
                      <div className="opacity-[0.16] dark:opacity-[0.10] transform scale-[1] mr-2 mb-0">
                        <span
                          className={`text-9xl font-bold ${getScoreBadgeClasses(
                            area.score
                          )}`}>
                          {area.score}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label={area.displayName}>
                          {area.icon}
                        </span>
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                          {area.displayName}
                        </h4>

                        {/* Score Badge */}
                        <span
                          className={`text-lg font-bold ${getScoreBadgeClasses(
                            area.score
                          )}`}>
                          {area.score}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div
                          className={`${
                            !expandedAreas[area.area] ? "line-clamp-4" : ""
                          }`}>
                          <p className="text-gray-600 dark:text-gray-400">
                            {getCombinedDescription(area)}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleArea(area.area)}
                          className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200">
                          {expandedAreas[area.area] ? "Show Less" : "See More"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500 dark:text-gray-400">
                {t("analysis.noAnalysisAvailable") || "No analysis available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreasOfLife;
