import { FOUR_KEY_PALACE_ANALYSIS_CONSTANTS } from "../analysis_constants/four_key_palace_analysis";

/**
 * Types for accessing the four key palace analysis data
 */
export type PalaceName = keyof typeof FOUR_KEY_PALACE_ANALYSIS_CONSTANTS;
export type TransformationType = "化禄" | "化权" | "化科" | "化忌";
export type TransformationKey = "HuaLu" | "HuaQuan" | "HuaKe" | "HuaJi";

/**
 * Interface for mapping traditional to simplified Chinese characters
 */
export interface TraditionToSimplifiedMap {
  [key: string]: string;
}

/**
 * Interface for mapping palace names
 */
export interface PalaceNameMapping {
  [key: string]: string;
}

/**
 * Interface for transformation information
 */
export interface TransformationInfo {
  title: string;
  description: string;
  quote: string;
}

/**
 * Interface for transformation types
 */
export interface TransformationTypes {
  [key: string]: { key: TransformationKey };
}

/**
 * Mapping between traditional and simplified Chinese characters for transformations
 */
export const traditionToSimplified: TraditionToSimplifiedMap = {
  "化祿": "化禄",
  "化權": "化权",
  "化科": "化科", // Same in both
  "化忌": "化忌"  // Same in both
};

/**
 * Mapping for traditional to simplified Chinese palace names
 */
export const palaceNameMapping: PalaceNameMapping = {
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

/**
 * The four transformations in Chinese with their English keys
 */
export const transformationTypes: Record<TransformationType, { key: TransformationKey }> = {
  "化禄": { key: "HuaLu" },
  "化权": { key: "HuaQuan" },
  "化科": { key: "HuaKe" },
  "化忌": { key: "HuaJi" }
};

/**
 * Analyzes transformations in a chart to find which palace each transformation landed in
 * @param chartData - The calculated ZWDS chart data
 * @returns Record mapping transformation types to palace names
 */
export function analyzeFourKeyPalaces(chartData: any): Record<string, string> {
  if (!chartData) return {};
  
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
    
    return transformations;
  } catch (error) {
    console.error("Error processing chart data:", error);
    return {};
  }
}

/**
 * Check if a string is a valid palace name in our constants
 * @param name - The name to check
 * @returns True if it's a valid palace name
 */
export function isValidPalaceName(name: string): boolean {
  return name in FOUR_KEY_PALACE_ANALYSIS_CONSTANTS;
}

/**
 * Gets transformation information from constants
 * @param transformationType - The type of transformation
 * @param palaceName - The palace name
 * @returns Transformation information
 */
export function getConstantTransformationInfo(
  transformationType: TransformationType, 
  palaceName: string
): TransformationInfo | null {
  try {
    if (isValidPalaceName(palaceName)) {
      const key = transformationTypes[transformationType].key;
      // Type assertion for TypeScript narrowing
      const palaceKey = palaceName as PalaceName;
      const info = FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceKey][key];
      
      // Check if we have valid info
      if (info && typeof info === "object" && "title" in info) {
        return info as TransformationInfo;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error getting transformation info for ${transformationType} in palace ${palaceName}:`, error);
    return null;
  }
}

/**
 * Gets meaning for a palace from constants
 * @param palaceName - The palace name
 * @returns Palace meaning string
 */
export function getPalaceMeaningFromConstants(palaceName: string): string {
  try {
    if (isValidPalaceName(palaceName)) {
      const palaceKey = palaceName as PalaceName;
      return FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceKey].meaning || "";
    }
    return "";
  } catch (error) {
    console.error(`Error getting palace meaning for ${palaceName}:`, error);
    return "";
  }
}

/**
 * Gets keyword for a palace from constants
 * @param palaceName - The palace name
 * @returns Palace keyword string
 */
export function getPalaceKeywordFromConstants(palaceName: string): string {
  try {
    if (isValidPalaceName(palaceName)) {
      const palaceKey = palaceName as PalaceName;
      return FOUR_KEY_PALACE_ANALYSIS_CONSTANTS[palaceKey].keyword || "";
    }
    return "";
  } catch (error) {
    console.error(`Error getting palace keyword for ${palaceName}:`, error);
    return "";
  }
} 