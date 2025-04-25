import React, { useMemo } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { useLanguage } from "../../context/LanguageContext";
import { AREAS_OF_LIFE_ANALYSIS_CONSTANTS } from "../../utils/zwds/analysis_constants";

/**
 * Star analysis data structure
 */
interface StarAnalysis {
  score: number;
  description: string;
}

/**
 * Area analysis data structure with stars
 */
interface AreaAnalysis {
  [starName: string]: StarAnalysis;
}

/**
 * Complete life areas analysis constants structure
 */
type LifeAreasConstants = {
  [areaName: string]: AreaAnalysis;
};

/**
 * Interface for radar chart data point
 * Includes an index signature to allow dynamic property access
 */
interface RadarDataPoint {
  area: string;
  score: number;
  originalName: string;
  [key: string]: string | number; // Add index signature for string keys
}

/**
 * Interface for props accepted by LifeAreasRadarChart component
 */
interface LifeAreasRadarChartProps {
  chartData: any;
}

/**
 * Component that displays a radar chart of life areas analysis scores
 * based on the calculated chart data and AREAS_OF_LIFE_ANALYSIS_CONSTANTS
 */
const LifeAreasRadarChart: React.FC<LifeAreasRadarChartProps> = ({ chartData }) => {
  const { t, language } = useLanguage();

  /**
   * Calculate average scores for each life area
   * by finding the main and minor stars in each palace and getting their scores
   */
  const lifeAreaScores = useMemo(() => {
    if (!chartData || !chartData.palaces) {
      return [];
    }

    // Map original palace names to user-friendly names
    // Both English and simplified Chinese versions for better understanding
    const palaceNameMap: Record<string, { en: string; zh: string }> = {
      "财帛": { en: "Wealth", zh: "财运" },
      "官禄": { en: "Career", zh: "事业" },
      "疾厄": { en: "Health", zh: "健康" },
      "夫妻": { en: "Love", zh: "爱情" },
      "交友": { en: "Friend", zh: "朋友" }
    };

    // Track scores for each life area
    const areaScores: Record<string, { total: number; count: number }> = {};
    
    // Cast constants to proper type for TypeScript
    const areasConstants = AREAS_OF_LIFE_ANALYSIS_CONSTANTS as LifeAreasConstants;
    
    // Initialize area scores
    Object.keys(areasConstants).forEach(area => {
      areaScores[area] = { total: 0, count: 0 };
    });

    // Process each palace to find stars and their scores
    chartData.palaces.forEach((palace: any) => {
      const palaceName = palace.name;
      
      // Skip palaces that are not in our analysis constants
      if (!areasConstants[palaceName]) {
        return;
      }
      
      // Create a helper function to process stars
      const processStars = (stars: any[] | undefined, starType: string) => {
        if (!stars || stars.length === 0) return;
        
        stars.forEach((star) => {
          const starName = star.name;
          const areaConstants = areasConstants[palaceName];
          
          if (areaConstants && areaConstants[starName]) {
            console.log(`Found ${starType} star ${starName} in ${palaceName} with score ${areaConstants[starName].score}`);
            const score = areaConstants[starName].score;
            areaScores[palaceName].total += score;
            areaScores[palaceName].count++;
          }
        });
      };
      
      // Process main stars
      processStars(palace.mainStar, "main");
      
      // Process minor stars
      processStars(palace.minorStars, "minor");
    });

    // Calculate average scores and format data for the radar chart
    return Object.keys(areaScores).map(area => {
      const { total, count } = areaScores[area];
      const averageScore = count > 0 ? Math.round(total / count) : 0;
      
      // Get the user-friendly name based on language
      const displayName = language === "zh" 
        ? palaceNameMap[area]?.zh || area 
        : palaceNameMap[area]?.en || area;
      
      return {
        area: displayName,
        score: averageScore,
        originalName: area,
        // Add a formatted label that includes the score
        [`${displayName}`]: averageScore
      } as RadarDataPoint;
    });
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