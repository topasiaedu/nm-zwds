import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { FOUR_KEY_PALACE_ANALYSIS_CONSTANTS } from "../../utils/zwds/analysis_constants";

/**
 * Types for accessing the four key palace analysis data
 */
type PalaceName = keyof typeof FOUR_KEY_PALACE_ANALYSIS_CONSTANTS;
type TransformationType = "化禄" | "化权" | "化科" | "化忌";
type TransformationKey = "HuaLu" | "HuaQuan" | "HuaKe" | "HuaJi";

/**
 * Props interface for the FourKeyPalaceAnalysis component
 */
interface FourKeyPalaceAnalysisProps {
  chartData: any;
}

/**
 * FourKeyPalaceAnalysis component displays information about the four transformations
 * (禄、权、科、忌) and where they landed in the chart
 */
const FourKeyPalaceAnalysis: React.FC<FourKeyPalaceAnalysisProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [openCardStates, setOpenCardStates] = useState<Record<TransformationType, boolean>>({
    "化禄": true,
    "化权": true,
    "化科": true,
    "化忌": true
  });
  const [transformationPalaces, setTransformationPalaces] = useState<Record<string, string>>({});

  // The four transformations in Chinese (both simplified and traditional) and their English equivalents
  const transformationTypes: Record<TransformationType, { key: TransformationKey, english: string }> = {
    "化禄": { key: "HuaLu", english: "Prosperity" },
    "化权": { key: "HuaQuan", english: "Power" },
    "化科": { key: "HuaKe", english: "Achievement" },
    "化忌": { key: "HuaJi", english: "Obstacle" }
  };

  // Mapping between traditional and simplified Chinese characters for transformations
  const traditionToSimplified: Record<string, string> = {
    "化祿": "化禄",
    "化權": "化权",
    "化科": "化科", // Same in both
    "化忌": "化忌"  // Same in both
  };

  // Mapping for traditional to simplified Chinese palace names
  const palaceNameMapping: Record<string, string> = {
    // Traditional to simplified
    "命宮": "命宫",
    "兄弟宮": "兄弟宫",
    "夫妻宮": "夫妻宫",
    "子女宮": "子女宫",
    "財帛宮": "财帛宫",
    "疾厄宮": "疾厄宫",
    "遷移宮": "迁移宫",
    "交友宮": "交友宫",
    "官祿宮": "官禄宫",
    "田宅宮": "田宅宫",
    "福德宮": "福德宫",
    "父母宮": "父母宫",
    // Add any other mappings that might be needed
  };

  // User-friendly names for Chinese palaces
  const userFriendlyPalaceNames: Record<string, { zh: string, en: string }> = {
    "命宫": { zh: "命运", en: "Destiny" },
    "兄弟宫": { zh: "兄弟姐妹", en: "Siblings" },
    "夫妻宫": { zh: "感情", en: "Love & Marriage" },
    "子女宫": { zh: "子女", en: "Children" },
    "财帛宫": { zh: "财富", en: "Financial Prosperity" },
    "疾厄宫": { zh: "健康", en: "Health & Wellbeing" },
    "迁移宫": { zh: "旅行与变动", en: "Travel & Changes" },
    "交友宫": { zh: "人际关系", en: "Social Circle" },
    "官禄宫": { zh: "事业", en: "Career & Achievement" },
    "田宅宫": { zh: "住宅", en: "Property" },
    "福德宫": { zh: "福气", en: "Happiness" },
    "父母宫": { zh: "父母", en: "Parents" }
  };

  useEffect(() => {
    if (!chartData) return;
    
    // Extract transformation data by finding which stars have transformations
    const transformations: Record<string, string> = {};

    try {
      // Examine all palaces and stars to find transformations
      if (chartData.palaces && Array.isArray(chartData.palaces)) {
        chartData.palaces.forEach((palace: any) => {
          const rawPalaceName = palace.name;
          // Convert traditional to simplified if needed
          const palaceName = palaceNameMapping[rawPalaceName] || rawPalaceName;
          
          // Check all star types (mainStar, minorStars, and others)
          const starTypes = ["mainStar", "minorStars", "auxiliaryStar", "otherStars"];
          
          starTypes.forEach(starType => {
            if (palace[starType] && Array.isArray(palace[starType])) {
              palace[starType].forEach((star: any) => {
                // Check for transformations in different possible formats
                const transformationsArray = star.transformations || star.transformation || [];
                const transformsToCheck = Array.isArray(transformationsArray) 
                  ? transformationsArray 
                  : [transformationsArray];
                
                if (transformsToCheck.length > 0) {
                  transformsToCheck.forEach((transformation: string) => {
                    if (!transformation) return;
                    
                    // Convert traditional to simplified if needed
                    const simplifiedTransformation = traditionToSimplified[transformation] || transformation;
                    
                    if (simplifiedTransformation in transformationTypes) {
                      transformations[simplifiedTransformation] = palaceName;
                    }
                  });
                }
              });
            }
          });
        });
      }
      
      setTransformationPalaces(transformations);
    } catch (error) {
      console.error("Error processing chart data:", error);
    }
  }, [chartData]);

  /**
   * Check if a string is a valid palace name in our constants
   * @param name - The name to check
   * @returns True if it's a valid palace name
   */
  const isValidPalaceName = (name: string): name is PalaceName => {
    return name in FOUR_KEY_PALACE_ANALYSIS_CONSTANTS;
  };

  /**
   * Get transformation information even if palace name isn't in constants
   * This fallback ensures we can display something even if there's a palace name mismatch
   */
  const getTransformationInfo = (transformationType: TransformationType, palaceName: string) => {
    // Default information if palace isn't found
    const defaultInfo = {
      title: `${transformationType} in ${palaceName}`,
      description: `This transformation is in the ${palaceName} palace.`,
      quote: "Information not available for this palace."
    };
    
    try {
      // Try to get info from constants if palace name is valid
      if (isValidPalaceName(palaceName)) {
        const key = transformationTypes[transformationType].key;
        const info = FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceName][key];
        
        // Check if we have valid info
        if (info && typeof info === "object" && "title" in info) {
          return info;
        }
      }
    } catch (error) {
      console.error(`Error getting transformation info for ${transformationType} in palace ${palaceName}:`, error);
    }
    
    return defaultInfo;
  };

  /**
   * Toggle the expanded/collapsed state of a specific transformation card
   * @param transformationType - The transformation type to toggle
   */
  const toggleCardState = (transformationType: TransformationType) => {
    setOpenCardStates(prevState => ({
      ...prevState,
      [transformationType]: !prevState[transformationType]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
      {/* Analysis Header - non-collapsible */}
      <div className="px-4 py-5 sm:px-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("analysis.fourKeyPalace") || "Four Key Palace Analysis"}
        </h3>
      </div>

      {/* Analysis Content - always visible */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Display message if no transformations found */}
          {Object.keys(transformationPalaces).length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-yellow-800 dark:text-yellow-300">
              No transformations found in the chart data.
            </div>
          )}
          
          {/* Four Transformations Grid - now two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(transformationTypes).map(([chineseName, { key, english }]) => {
              const transformationType = chineseName as TransformationType;
              // Get palace name from our processed data
              const palaceName = transformationPalaces[transformationType];
              
              // Get transformation color based on type
              const getTransformationColor = (type: TransformationType) => {
                switch(type) {
                  case "化禄": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-400";
                  case "化权": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-400";
                  case "化科": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-400";
                  case "化忌": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-400";
                  default: return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-400";
                }
              };
              
              const transformationColorClass = getTransformationColor(transformationType);
              const isCardOpen = openCardStates[transformationType];
              
              if (!palaceName) return (
                <div 
                  key={chineseName}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-red-200 dark:border-red-800"
                >
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full ${transformationColorClass} mr-2`}>
                      {chineseName} ({english})
                    </span>
                    <span className="text-red-500 dark:text-red-400 font-medium">
                      Not found in chart
                    </span>
                  </div>
                </div>
              );
              
              // Get transformation info (with fallback if palace name is invalid)
              const transformationInfo = getTransformationInfo(transformationType, palaceName);
              
              // Get keyword and meaning for palace if available
              let keyword = "";
              let meaning = "";
              if (isValidPalaceName(palaceName)) {
                const keywordValue = FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceName].keyword;
                keyword = keywordValue !== undefined ? String(keywordValue) : "";
                meaning = FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceName].meaning || "";
              }
              
              return (
                <div 
                  key={chineseName}
                  className="overflow-hidden transition-all duration-300"
                >
                  {/* Palace name header with transformation tag */}
                  <div 
                    className="cursor-pointer transition-colors duration-200 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700"
                    onClick={() => toggleCardState(transformationType)}
                  >
                    <div className="flex flex-col space-y-2">
                      {/* Palace name and transformation tag on same line */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {t(palaceName)}
                            </h3>
                            
                            <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${transformationColorClass}`}>
                              {chineseName} ({english})
                            </span>
                          </div>
                          
                          {/* Meaning right below palace name */}
                          {meaning && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {meaning}
                            </div>
                          )}
                        </div>

                        {/* Toggle icon on right side */}
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isCardOpen ? "transform rotate-180" : ""}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transformation content - collapsible */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isCardOpen 
                        ? "max-h-96 opacity-100" 
                        : "max-h-0 opacity-0 p-0"
                    }`}
                  >
                    <div className="p-4 space-y-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                        {transformationInfo.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {transformationInfo.description}
                      </p>
                      
                      <div className={`italic text-xs text-gray-600 dark:text-gray-400 border-l-2 pl-3 py-1 mt-2 ${transformationColorClass}`}>
                        &quot;{transformationInfo.quote}&quot;
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourKeyPalaceAnalysis; 