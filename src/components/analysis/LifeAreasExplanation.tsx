import React, { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { 
  analyzeLifeAreas,
  getScoreBadgeClasses,
  getStarTypeBadgeClasses,
  type ChartDataType,
  type LifeAreaResult
} from "../../utils/zwds/analysis";

/**
 * Interface for props accepted by LifeAreasExplanation component
 */
interface LifeAreasExplanationProps {
  chartData: ChartDataType;
}

/**
 * Component that displays detailed explanations for each life area score
 * based on the calculated chart data
 */
const LifeAreasExplanation: React.FC<LifeAreasExplanationProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [activeArea, setActiveArea] = useState<string | null>(null);

  /**
   * Get life area analysis using the utility function
   */
  const lifeAreaAnalysis = useMemo(() => {
    return analyzeLifeAreas(chartData, language);
  }, [chartData, language]);

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