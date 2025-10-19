import React, { useMemo } from "react";
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
  type ChartDataType
} from "../../utils/zwds/analysis";
import AnimatedWrapper from "./AnimatedWrapper";

/**
 * Interface for props accepted by LifeAreasRadarChart component
 */
interface LifeAreasRadarChartProps {
  chartData: ChartDataType;
}

/**
 * Component that displays a radar chart of life areas analysis scores
 * based on the calculated chart data
 */
const LifeAreasRadarChart: React.FC<LifeAreasRadarChartProps> = ({ chartData }) => {
  const { t, language } = useLanguage();

  /**
   * Calculate average scores for each life area using the utility function
   */
  const lifeAreaScores = useMemo(() => {
    return calculateLifeAreaScores(chartData, language);
  }, [chartData, language]);

  return (
    <AnimatedWrapper delay={0.1} threshold={0.15}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            {t("analysis.lifeAreasRadarChart") || "Life Areas Analysis"}
          </h2>
        </div>
        
        <div className="p-6">
          <div className="w-full h-80 md:h-96">
            {lifeAreaScores.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={lifeAreaScores}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis 
                    dataKey="area" 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#60a5fa"
                    fill="#60a5fa"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">{t("analysis.noDataAvailable") || "No data available"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default LifeAreasRadarChart; 