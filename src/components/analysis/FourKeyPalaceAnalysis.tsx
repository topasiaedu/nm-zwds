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
  const [validPalaceNames, setValidPalaceNames] = useState<string[]>([]);
  // Track transformation info errors
  const [transformationErrors, setTransformationErrors] = useState<Record<string, string>>({});

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

  // Initialize with valid palace names
  useEffect(() => {
    const palaceNames = Object.keys(FOUR_KEY_PALACE_ANALYSIS_CONSTANTS);
    setValidPalaceNames(palaceNames);
    console.log("Valid palace names:", palaceNames);
  }, []);

  useEffect(() => {
    if (!chartData) return;

    // For debugging, log the chart data structure to analyze its format
    console.log("Chart data:", chartData);
    
    // Extract transformation data by finding which stars have transformations
    const transformations: Record<string, string> = {};
    let debug = "";

    try {
      debug += `Valid palace names from constants: ${Object.keys(FOUR_KEY_PALACE_ANALYSIS_CONSTANTS).join(", ")}\n`;
      
      // Examine all palaces and stars to find transformations
      if (chartData.palaces && Array.isArray(chartData.palaces)) {
        debug += `Found ${chartData.palaces.length} palaces\n`;
        
        chartData.palaces.forEach((palace: any, index: number) => {
          const rawPalaceName = palace.name;
          // Convert traditional to simplified if needed
          const palaceName = palaceNameMapping[rawPalaceName] || rawPalaceName;
          
          debug += `Palace ${index + 1}: ${rawPalaceName} -> ${palaceName}\n`;
          
          // Check if this palace name is in our constants
          const isValid = isValidPalaceName(palaceName);
          debug += `  Is valid palace name: ${isValid}\n`;
          
          // Check all star types (mainStar, minorStars, and others)
          const starTypes = ["mainStar", "minorStars", "auxiliaryStar", "otherStars"];
          
          starTypes.forEach(starType => {
            if (palace[starType] && Array.isArray(palace[starType])) {
              debug += `  Found ${palace[starType].length} ${starType}s\n`;
              
              palace[starType].forEach((star: any) => {
                // Add star name to debug
                debug += `  Star: ${star.name || "unnamed"}\n`;
                
                // Check for transformations in different possible formats
                const transformationsArray = star.transformations || star.transformation || [];
                const transformsToCheck = Array.isArray(transformationsArray) 
                  ? transformationsArray 
                  : [transformationsArray];
                
                if (transformsToCheck.length > 0) {
                  debug += `  Star ${star.name || "unnamed"} has transformations: ${transformsToCheck.join(', ')}\n`;
                  
                  transformsToCheck.forEach((transformation: string) => {
                    if (!transformation) return;
                    
                    // Convert traditional to simplified if needed
                    const simplifiedTransformation = traditionToSimplified[transformation] || transformation;
                    
                    debug += `  Checking transformation: ${transformation} → ${simplifiedTransformation}\n`;
                    debug += `  Is valid transformation: ${simplifiedTransformation in transformationTypes}\n`;
                    
                    if (simplifiedTransformation in transformationTypes) {
                      transformations[simplifiedTransformation] = palaceName;
                      debug += `  Mapped ${transformation} to ${simplifiedTransformation} in palace ${palaceName}\n`;
                    }
                  });
                }
              });
            }
          });
        });
      } else {
        debug += "chartData.palaces is not an array or is undefined\n";
        debug += `chartData structure: ${JSON.stringify(Object.keys(chartData))}\n`;
      }
      
      // Check if we found all four transformations
      const expectedTransformations = ["化禄", "化权", "化科", "化忌"];
      for (const trans of expectedTransformations) {
        if (!transformations[trans]) {
          debug += `Missing transformation: ${trans}\n`;
        } else {
          const palace = transformations[trans];
          debug += `Found transformation: ${trans} in palace "${palace}"\n`;
          debug += `  Is valid palace name: ${isValidPalaceName(palace)}\n`;
          
          if (isValidPalaceName(palace)) {
            const key = transformationTypes[trans as TransformationType].key;
            try {
              const info = FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palace][key];
              debug += `  Has proper info: ${Boolean(info)}\n`;
              debug += `  Title: ${info?.title || "missing"}\n`;
            } catch (error) {
              debug += `  Error accessing info: ${String(error)}\n`;
            }
          }
        }
      }
      
      setTransformationPalaces(transformations);
      setDebugInfo(debug);
      
      // Pre-check all transformation info and log errors
      const errors: Record<string, string> = {};
      Object.entries(transformations).forEach(([transType, palace]) => {
        try {
          const transformInfo = getTransformationInfo(transType as TransformationType, palace);
          if (!transformInfo.title || transformInfo.title === "") {
            errors[transType] = `Missing title for ${transType} in palace ${palace}`;
          }
        } catch (error) {
          errors[transType] = `Error getting info for ${transType} in palace ${palace}: ${String(error)}`;
        }
      });
      setTransformationErrors(errors);
      
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
        if (info && typeof info === 'object' && 'title' in info) {
          return info;
        } else {
          console.warn(`Missing or invalid info for ${transformationType} in palace ${palaceName}`);
        }
      }
    } catch (error) {
      console.error(`Error getting transformation info for ${transformationType} in palace ${palaceName}:`, error);
    }
    
    return defaultInfo;
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
            {/* Debug info showing available data - always show for now during debugging */}
            <div className="my-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto text-xs font-mono">
              <details>
                <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold">
                  Debug Information (Click to expand)
                </summary>
                <pre className="mt-2">{debugInfo}</pre>
                <p className="mt-2">Transformation data: {JSON.stringify(transformationPalaces, null, 2)}</p>
                <p className="mt-2">Valid palace names: {validPalaceNames.join(", ")}</p>
                {Object.keys(transformationErrors).length > 0 && (
                  <div className="mt-2 text-red-500">
                    <p>Errors:</p>
                    <pre>{JSON.stringify(transformationErrors, null, 2)}</pre>
                  </div>
                )}
                
                <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="font-semibold">Transformation info test:</p>
                  {Object.entries(transformationPalaces).map(([transType, palace]) => (
                    <div key={transType} className="mt-1">
                      <p>Testing {transType} in {palace}:</p>
                      <pre>
                        {JSON.stringify(
                          isValidPalaceName(palace) ? 
                            FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palace][transformationTypes[transType as TransformationType].key] : 
                            "Palace not found in constants", 
                          null, 2
                        )}
                      </pre>
                    </div>
                  ))}
                </div>
              </details>
            </div>
            
            {/* Display message if no transformations found */}
            {Object.keys(transformationPalaces).length === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-yellow-800 dark:text-yellow-300">
                No transformations found in the chart data.
              </div>
            )}
            
            {/* Four Transformations Grid */}
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
                    className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Palace name header with transformation tag at bottom right */}
                    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                            {palaceName} 宫
                          </h3>
                          {meaning && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {meaning}
                            </div>
                          )}
                        </div>
                        {keyword && !isNaN(keyword as any) ? null : (
                          <div className="text-sm font-medium text-purple-600 dark:text-purple-400 ml-2">
                            {keyword}
                          </div>
                        )}
                      </div>
                      
                      {/* Transformation badge positioned at bottom right */}
                      <div className="absolute bottom-3 right-0">
                        <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full ${transformationColorClass}`}>
                          {chineseName} ({english})
                        </span>
                      </div>
                    </div>
                    
                    {/* Transformation content */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {transformationInfo.title}
                      </h4>
                      
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        {transformationInfo.description}
                      </p>
                      
                      <div className={`italic text-sm text-gray-600 dark:text-gray-400 border-l-3 pl-3 py-1 mt-3 bg-opacity-20 dark:bg-opacity-10 rounded-r ${transformationColorClass}`}>
                        &quot;{transformationInfo.quote}&quot;
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourKeyPalaceAnalysis; 