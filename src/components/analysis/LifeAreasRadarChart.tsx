import React, { useMemo } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { useLanguage } from "../../context/LanguageContext";
import { 
  calculateLifeAreaScores, 
  type ChartDataType, 
  type RadarDataPoint 
} from "../../utils/zwds/analysis";

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
              colors={["#60a5fa"]}
              fillOpacity={0.6}
              borderColor={{ from: "color" }}
              gridShape="circular"
              gridLevels={5}
              enableDots={true}
              theme={{
                text: {
                  fontSize: 12,
                  fill: "#94a3b8" // text-slate-400 works in both light and dark modes
                },
                axis: {
                  domain: {
                    line: {
                      stroke: "#64748b", // text-slate-500
                      strokeWidth: 1
                    }
                  },
                  ticks: {
                    line: {
                      stroke: "#64748b", // text-slate-500
                      strokeWidth: 1
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: "#475569", // text-slate-600 for dark mode
                    strokeWidth: 1
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">{t("analysis.noDataAvailable") || "No data available"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifeAreasRadarChart; 