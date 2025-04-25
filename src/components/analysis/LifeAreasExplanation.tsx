import React, { useMemo, useState } from "react";
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
 * Star data structure from chart
 */
interface ChartStar {
  name: string;
  brightness: string;
  palace: number;
  isTransformed: boolean;
  transformations?: string[];
  [key: string]: any; // Add index signature for additional properties
}

/**
 * Palace data structure from chart
 */
interface Palace {
  name: string;
  mainStar?: ChartStar[];
  minorStars?: ChartStar[];
  [key: string]: any;
}

/**
 * Chart data structure
 */
interface ChartDataType {
  palaces: Palace[];
  [key: string]: any;
}

/**
 * Analysis result for a life area
 */
interface LifeAreaResult {
  area: string;
  displayName: string;
  icon: string;
  score: number;
  stars: Array<{
    name: string;
    score: number;
    description: string;
    starType: string;
  }>;
}

/**
 * Interface for props accepted by LifeAreasExplanation component
 */
interface LifeAreasExplanationProps {
  chartData: ChartDataType;
}

/**
 * Component that displays detailed explanations for each life area score
 * based on the calculated chart data and AREAS_OF_LIFE_ANALYSIS_CONSTANTS
 */
const LifeAreasExplanation: React.FC<LifeAreasExplanationProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [activeArea, setActiveArea] = useState<string | null>(null);

  /**
   * Calculate scores and explanations for each life area
   */
  const lifeAreaAnalysis = useMemo(() => {
    if (!chartData || !chartData.palaces) {
      return [];
    }

    // Map original palace names to user-friendly names
    // Both English and simplified Chinese versions for better understanding
    const palaceNameMap: Record<string, { en: string; zh: string }> = {
      "财帛": { en: "Financial Prosperity", zh: "财富" },
      "官禄": { en: "Career & Achievement", zh: "事业" },
      "疾厄": { en: "Health & Wellbeing", zh: "健康" },
      "夫妻": { en: "Love & Relationships", zh: "感情" },
      "交友": { en: "Friendships & Social Circle", zh: "人际关系" }
    };

    // Map of palace names to icon emojis
    const palaceIconMap: Record<string, string> = {
      "财帛": "💰",
      "官禄": "💼",
      "疾厄": "❤️‍🩹",
      "夫妻": "💞",
      "交友": "👥"
    };

    // Cast constants to proper type for TypeScript
    const areasConstants = AREAS_OF_LIFE_ANALYSIS_CONSTANTS as LifeAreasConstants;

    // Track analysis for each life area
    const analysis: LifeAreaResult[] = [];

    // Process each palace to find stars and their scores
    Object.keys(areasConstants).forEach(areaName => {
      const areaConstants = areasConstants[areaName];
      const areaStars: Array<{ name: string; score: number; description: string; starType: string }> = [];
      let totalScore = 0;
      let starCount = 0;

      // Find the palace with this name
      const palace = chartData.palaces.find((p) => p.name === areaName);
      
      if (palace) {
        // Helper function to process stars
        const processStars = (stars: ChartStar[] | undefined, starType: string) => {
          if (!stars || stars.length === 0) return;
          
          stars.forEach((star) => {
            const starName = star.name;
            
            if (areaConstants[starName]) {
              const { score, description } = areaConstants[starName];
              areaStars.push({
                name: starName,
                score,
                description,
                starType
              });
              
              totalScore += score;
              starCount++;
            }
          });
        };
        
        // Process main stars
        processStars(palace.mainStar, "main");
        
        // Process minor stars
        processStars(palace.minorStars, "minor");
      }

      // Only add areas with at least one star
      if (areaStars.length > 0) {
        // Get the user-friendly name based on language
        const displayName = language === "zh" 
          ? palaceNameMap[areaName]?.zh || areaName 
          : palaceNameMap[areaName]?.en || areaName;
          
        analysis.push({
          area: areaName,
          displayName,
          icon: palaceIconMap[areaName] || "🔮",
          score: Math.round(totalScore / starCount),
          stars: areaStars.sort((a, b) => b.score - a.score) // Sort by score (highest first)
        });
      }
    });

    // Sort areas by score (highest first)
    return analysis.sort((a, b) => b.score - a.score);
  }, [chartData, language]);

  /**
   * Get CSS classes for the score badge
   */
  const getScoreBadgeClasses = (score: number): string => {
    if (score >= 90) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
    if (score >= 80) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (score >= 70) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    }
    if (score >= 60) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  /**
   * Get badge classes for star type
   */
  const getStarTypeBadgeClasses = (starType: string): string => {
    if (starType === "main") {
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    }
    return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
  };

  /**
   * Get star type label
   */
  const getStarTypeLabel = (starType: string): string => {
    return starType === "main" 
      ? (t("analysis.mainStar") || "Main Star") 
      : (t("analysis.minorStar") || "Minor Star");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold dark:text-white">
        {t("analysis.lifeAreasExplanation") || "Life Areas Analysis"}
      </h3>

      {lifeAreaAnalysis.length > 0 ? (
        <div className="space-y-4">
          {lifeAreaAnalysis.map((area) => (
            <div 
              key={area.area}
              className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setActiveArea(activeArea === area.area ? null : area.area)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={area.displayName}>
                    {area.icon}
                  </span>
                  <h4 className="font-semibold text-lg dark:text-white">
                    {area.displayName}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreBadgeClasses(area.score)}`}>
                    {area.score}/100
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${activeArea === area.area ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {activeArea === area.area && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {area.stars.map((star) => (
                    <div key={`${star.name}-${star.starType}`} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium dark:text-white">{star.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStarTypeBadgeClasses(star.starType)}`}>
                            {getStarTypeLabel(star.starType)}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeClasses(star.score)}`}>
                          {star.score}/100
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {star.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("analysis.noAnalysisAvailable") || "No analysis data available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default LifeAreasExplanation; 