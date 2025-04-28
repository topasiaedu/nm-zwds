import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  analyzeFourKeyPalaces,
  getConstantTransformationInfo,
  getPalaceMeaningFromConstants,
  getPalaceKeywordFromConstants, transformationTypes,
  type TransformationType
} from "../../utils/zwds/analysis";

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

  // Function to format template strings with placeholders
  const formatString = (template: string, ...args: string[]): string => {
    return args.reduce(
      (result, arg, i) => result.replace(new RegExp(`\\{${i}\\}`, "g"), arg),
      template
    );
  };

  // Function to safely get a translation with a fallback value
  const tSafe = (key: string, fallback: string = ""): string => {
    const translation = t(key);
    // If the translation key is returned unchanged, it means the translation wasn't found
    return translation === key ? fallback : translation;
  };

  // Function to get English translation
  const getEnglishName = (key: string): string => {
    
    // Since we don't have a way to set language for a single translation,
    // we'll just use the key's English part at the end
    const parts = key.split(".");
    const lastPart = parts[parts.length - 1];
    
    // For specific transformations, return hardcoded English names
    if (lastPart === "化禄") return "Prosperity";
    if (lastPart === "化权") return "Power";
    if (lastPart === "化科") return "Achievement";
    if (lastPart === "化忌") return "Obstacle";
    
    // For palaces, return hardcoded English names
    if (lastPart === "命宫") return "Destiny Palace";
    if (lastPart === "兄弟宫") return "Siblings Palace";
    if (lastPart === "夫妻宫") return "Marriage Palace";
    if (lastPart === "子女宫") return "Children Palace";
    if (lastPart === "财帛宫") return "Wealth Palace";
    if (lastPart === "疾厄宫") return "Health Palace";
    if (lastPart === "迁移宫") return "Travel Palace";
    if (lastPart === "交友宫") return "Friends Palace";
    if (lastPart === "官禄宫") return "Career Palace";
    if (lastPart === "田宅宫") return "Property Palace";
    if (lastPart === "福德宫") return "Happiness Palace";
    if (lastPart === "父母宫") return "Parents Palace";
    
    // Default fallback
    return lastPart;
  };

  useEffect(() => {
    if (!chartData) return;
    
    // Use the utility function to analyze transformations
    const transformations = analyzeFourKeyPalaces(chartData);
    setTransformationPalaces(transformations);
    
  }, [chartData]);

  /**
   * Get transformation information either from translation or constants
   */
  const getTransformationInfo = (transformationType: TransformationType, palaceName: string) => {
    // Try to get translated information
    const key = transformationTypes[transformationType].key;
    const translationKeyBase = `${palaceName}.${key}`;
    
    // Check if we have translations for this palace and transformation
    const translationTitle = tSafe(`analysis.fourKeyPalaceContent.${translationKeyBase}.title`);
    const hasTranslation = translationTitle !== "";
    
    if (hasTranslation) {
      return {
        title: translationTitle,
        description: tSafe(`analysis.fourKeyPalaceContent.${translationKeyBase}.description`),
        quote: tSafe(`analysis.fourKeyPalaceContent.${translationKeyBase}.quote`)
      };
    }
    
    // Fallback to the constants if translation not found
    const constantInfo = getConstantTransformationInfo(transformationType, palaceName);
    if (constantInfo) {
      return constantInfo;
    }
    
    // Default fallback using template strings from translations
    return {
      title: formatString(
        tSafe("analysis.fourKeyPalaceContent.defaultTitle", `${transformationType} in ${palaceName}`),
        tSafe(`analysis.fourKeyPalaceContent.${transformationType}`, transformationType),
        tSafe(`analysis.fourKeyPalaceContent.${palaceName}`, palaceName)
      ),
      description: formatString(
        tSafe("analysis.fourKeyPalaceContent.defaultDesc", `This transformation is in the ${palaceName} palace.`),
        tSafe(`analysis.fourKeyPalaceContent.${palaceName}`, palaceName)
      ),
      quote: tSafe("analysis.fourKeyPalaceContent.defaultQuote", "Information not available for this palace.")
    };
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

  /**
   * Get a translated palace meaning if available
   */
  const getPalaceMeaning = (palaceName: string): string => {
    const meaningKey = `analysis.fourKeyPalaceContent.${palaceName}.meaning`;
    const fallback = getPalaceMeaningFromConstants(palaceName);
    
    return tSafe(meaningKey, fallback);
  };

  /**
   * Get a translated palace keyword if available
   */
  const getPalaceKeyword = (palaceName: string): string => {
    const keywordKey = `analysis.fourKeyPalaceContent.${palaceName}.keyword`;
    const fallback = getPalaceKeywordFromConstants(palaceName);
    
    return tSafe(keywordKey, fallback);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
      {/* Analysis Header - non-collapsible */}
      <div className="px-4 py-5 sm:px-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("analysis.fourKeyPalace")}
        </h3>
      </div>

      {/* Analysis Content - always visible */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Display message if no transformations found */}
          {Object.keys(transformationPalaces).length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-yellow-800 dark:text-yellow-300">
              {tSafe("analysis.fourKeyPalaceContent.noTransformations", "No transformations found in the chart data.")}
            </div>
          )}
          
          {/* Four Transformations Grid - now two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(transformationTypes).map(([chineseName, { key }]) => {
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
              const englishTransformation = getEnglishName(`analysis.fourKeyPalaceContent.${transformationType}`);
              
              if (!palaceName) return (
                <div 
                  key={chineseName}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-red-200 dark:border-red-800"
                >
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full ${transformationColorClass} mr-2`}>
                      {tSafe(`analysis.fourKeyPalaceContent.${transformationType}`, transformationType)} ({englishTransformation})
                    </span>
                    <span className="text-red-500 dark:text-red-400 font-medium">
                      {tSafe("analysis.fourKeyPalaceContent.notFound", "Not found in chart")}
                    </span>
                  </div>
                </div>
              );
              
              // Get transformation info with translations
              const transformationInfo = getTransformationInfo(transformationType, palaceName);
              
              // Get meaning for palace
              const meaning = getPalaceMeaning(palaceName);
              
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
                              {tSafe(`analysis.fourKeyPalaceContent.${palaceName}`, palaceName)}
                            </h3>
                            
                            <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${transformationColorClass}`}>
                              {tSafe(`analysis.fourKeyPalaceContent.${transformationType}`, transformationType)} ({englishTransformation})
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