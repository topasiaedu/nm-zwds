import React, { useMemo, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";
import {
  calculateLifeAreaScores,
  analyzeLifeAreas,
  getScoreBadgeClasses,
  type ChartDataType,
} from "../../utils/zwds/analysis";
import GradientSectionHeader from "./shared/GradientSectionHeader";

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
      {/* Section Header */}
      <GradientSectionHeader
        badgeText="05"
        title="DESTINY SCOREBOARD"
        subtitle="Your personal scorecard across the 5 destiny pillars."
        showDivider={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Radar Chart in Premium Card */}
        <div className="rounded-2xl shadow-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📊</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Life Areas Overview
            </h3>
          </div>
          <div className="w-full h-80 md:h-96">
            {lifeAreaScores.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={lifeAreaScores}>
                  <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="area" 
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#8b5cf6"
                    fillOpacity={0.5}
                    strokeWidth={3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("analysis.noDataAvailable") || "No data available"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Area Explanations */}
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {lifeAreaAnalysis.length > 0 ? (
            <>
              {lifeAreaAnalysis.map((area) => (
                <div
                  key={area.area}
                  className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 p-5 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Background Score Display with better opacity */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="flex items-end justify-end h-full">
                      <div className="opacity-[0.08] dark:opacity-[0.06] transform mr-2 mb-0">
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
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                            <span
                              className="text-xl"
                              role="img"
                              aria-label={area.displayName}>
                              {area.icon}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-gray-900 dark:text-white uppercase tracking-wide">
                            {area.displayName}
                          </h4>
                        </div>

                        {/* Score Badge with gradient background */}
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                            <span className="text-sm font-bold text-white">
                              {area.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-1">
                        <div
                          className={`${
                            !expandedAreas[area.area] ? "line-clamp-3" : ""
                          }`}>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {getCombinedDescription(area)}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleArea(area.area)}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200 uppercase tracking-wider">
                          {expandedAreas[area.area] ? "Show Less ↑" : "See More ↓"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
