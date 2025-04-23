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
  const [isOpen, setIsOpen] = useState<boolean>(true); // Start open for debugging
  const [transformationPalaces, setTransformationPalaces] = useState<Record<string, string>>({});
  const [debugInfo, setDebugInfo] = useState<string>("");

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

  useEffect(() => {
    if (!chartData) return;

    // For debugging, log the chart data structure to analyze its format
    console.log("Chart data:", chartData);
    
    // Extract transformation data by finding which stars have transformations
    const transformations: Record<string, string> = {};
    let debug = "";

    try {
      // Examine all palaces and stars to find transformations
      if (chartData.palaces && Array.isArray(chartData.palaces)) {
        debug += `Found ${chartData.palaces.length} palaces\n`;
        
        chartData.palaces.forEach((palace: any, index: number) => {
          const palaceName = palace.name;
          debug += `Palace ${index + 1}: ${palaceName}\n`;
          
          // Check main stars
          if (palace.mainStar && Array.isArray(palace.mainStar)) {
            debug += `  Found ${palace.mainStar.length} main stars\n`;
            
            palace.mainStar.forEach((star: any) => {
              if (star.transformations && Array.isArray(star.transformations)) {
                debug += `  Star ${star.name} has transformations: ${star.transformations.join(', ')}\n`;
                
                star.transformations.forEach((transformation: string) => {
                  // Convert traditional to simplified if needed
                  const simplifiedTransformation = traditionToSimplified[transformation] || transformation;
                  
                  if (simplifiedTransformation in transformationTypes) {
                    transformations[simplifiedTransformation] = palaceName;
                    debug += `  Mapped ${transformation} to ${simplifiedTransformation} in palace ${palaceName}\n`;
                  }
                });
              }
            });
          }
        });
      }
      
      // Check if we found all four transformations
      const expectedTransformations = ["化禄", "化权", "化科", "化忌"];
      for (const trans of expectedTransformations) {
        if (!transformations[trans]) {
          debug += `Missing transformation: ${trans}\n`;
        }
      }
      
      setTransformationPalaces(transformations);
      setDebugInfo(debug);
    } catch (error) {
      console.error("Error processing chart data:", error);
      setDebugInfo(`Error: ${String(error)}\n${debug}`);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
      {/* Analysis Header */}
      <div 
        className="px-4 py-5 sm:px-6 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("analysis.fourKeyPalace") || "Four Key Palace Analysis"}
          </h3>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Analysis Content */}
      {isOpen && (
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("analysis.fourKeyPalaceDescription") || 
                "The Four Transformations (化禄, 化权, 化科, 化忌) show where your prosperity, power, achievements, and challenges lie."}
            </p>
            
            {/* Debug Info - only in development */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <div className="my-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto text-xs font-mono">
                <pre>{debugInfo}</pre>
                <p className="mt-2">Transformation data: {JSON.stringify(transformationPalaces, null, 2)}</p>
              </div>
            )}
            
            {/* Four Transformations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(transformationTypes).map(([chineseName, { key, english }]) => {
                const transformationType = chineseName as TransformationType;
                // Get palace name from our processed data
                const palaceName = transformationPalaces[transformationType];
                
                if (!palaceName || !isValidPalaceName(palaceName)) return (
                  <div 
                    key={chineseName}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-red-200 dark:border-red-800"
                  >
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full 
                        bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                        {chineseName} ({english})
                      </span>
                      <span className="text-red-500 dark:text-red-400 font-medium">
                        Not found in chart
                      </span>
                    </div>
                  </div>
                );
                
                const palaceData = FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceName];
                const transformationInfo = palaceData[key];
                
                return (
                  <div 
                    key={chineseName}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full 
                        bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                        {chineseName} ({english})
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        → {t(`palaces.${palaceName}`) || palaceName}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                      {transformationInfo.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {transformationInfo.description}
                    </p>
                    
                    <div className="italic text-xs text-gray-500 dark:text-gray-400 border-l-2 border-purple-300 pl-2">
                      &quot;{transformationInfo.quote}&quot;
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Additional Guidance */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                {t("analysis.guidanceTitle") || "Guidance"}:
              </p>
              <p>
                {t("analysis.fourKeyPalaceGuidance") || 
                  "Pay special attention to where 化禄 (Prosperity) and 化科 (Achievement) land, as these indicate your areas of natural advantage. The palace with 化忌 (Obstacle) shows where you need extra care and awareness."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourKeyPalaceAnalysis; 