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

  /**
   * Define our custom tooltip component separately
   */
  const CustomTooltip = ({ index, value }: { index: string; value: number }) => (
    <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-md text-sm">
      <strong>{index}: </strong>
      <span>{value}/100</span>
    </div>
  );

  return (
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
          colors={{ scheme: "category10" }}
          blendMode="multiply"
          motionConfig="gentle"
          gridShape="circular"
          gridLevels={5}
          enableDots={true}
          theme={{
            text: {
              fontSize: 12,
              fill: "#333333"
            },
            axis: {
              domain: {
                line: {
                  stroke: "#777777",
                  strokeWidth: 1
                }
              },
              ticks: {
                line: {
                  stroke: "#777777",
                  strokeWidth: 1
                }
              }
            },
            grid: {
              line: {
                stroke: "#dddddd",
                strokeWidth: 1
              }
            },
            tooltip: {
              container: {
                background: "#ffffff",
                color: "#333333",
                fontSize: 12
              }
            }
          }}
          /* Using type assertion to bypass TypeScript restrictions */
          {...({} as any)}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">{t("analysis.noDataAvailable") || "No data available"}</p>
        </div>
      )}
    </div>
  );
};

export default LifeAreasRadarChart; 